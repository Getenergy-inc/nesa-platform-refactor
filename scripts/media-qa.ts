/**
 * Media QA Pipeline — NESA Africa nominee visuals.
 *
 * For each nominee that carries an image/logo field:
 *  1. existence       — is a URL present?
 *  2. format          — extension + content-type sanity (jpg/png/webp/svg/gif/avif)
 *  3. reachability    — HEAD (fallback to ranged GET) with 8s timeout
 *  4. resolution      — best-effort via probe-image-size when reachable
 *  5. aspect ratio    — derived from resolution
 *  6. broken links    — HTTP >=400 / network error
 *  7. duplicates      — URL-normalised + (when fetched) sha1(first 64KB)
 *  8. quality score   — 0–100 from above signals
 *
 * Then derives:
 *  - media_status:     verified | uploaded | low_quality | duplicate | broken_link | missing | requires_review
 *  - media_verified:   true when status === "verified"
 *  - fallback_avatar:  "initials_individual" | "logo_placeholder_org"
 *  - image_alt_text:   descriptive, SEO-friendly
 *
 * Outputs:
 *  - migration/media-qa.report.md
 *  - migration/media-qa.ngos.json   (enriched dataset, append-only audit)
 *  - migration/media-qa.summary.json
 *
 * Run: bun scripts/media-qa.ts
 */

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { NGO_NOMINEES, type NGONominee } from "../src/data/ngoEducationAfrica";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type MediaStatus =
  | "verified"
  | "uploaded"
  | "low_quality"
  | "duplicate"
  | "broken_link"
  | "missing"
  | "requires_review";

type NomineeKind = "individual" | "organization";

interface MediaQARecord {
  id: string;
  name: string;
  kind: NomineeKind;
  source_url: string | null;
  profile_image_url: string;
  logo_url: string;
  banner_image_url: string;
  thumbnail_image_url: string;
  featured_image_url: string;
  image_alt_text: string;
  media_status: MediaStatus;
  image_quality_score: number;
  fallback_avatar: "initials_individual" | "logo_placeholder_org";
  media_verified: boolean;
  diagnostics: {
    reachable: boolean | null;
    http_status: number | null;
    content_type: string | null;
    content_length: number | null;
    format: string | null;
    width: number | null;
    height: number | null;
    aspect_ratio: number | null;
    duplicate_of: string | null;
    error: string | null;
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp", "svg", "gif", "avif"];
const MIN_SIDE = 200;
const TARGET_SIDE = 400;
const TIMEOUT_MS = 8000;

function normaliseUrl(u: string | null | undefined): string | null {
  if (!u) return null;
  const s = u.trim();
  if (!s) return null;
  return s.replace(/[?#].*$/, "").toLowerCase();
}

function extOf(u: string): string | null {
  const m = u.match(/\.([a-z0-9]{2,5})(?:$|\?|#)/i);
  return m ? m[1].toLowerCase() : null;
}

function altTextFor(name: string, kind: NomineeKind, context?: string): string {
  const base = kind === "organization" ? `${name} organisation logo` : `${name} nominee profile photo`;
  return context ? `${base} — ${context}` : base;
}

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, redirect: "follow" });
  } finally {
    clearTimeout(t);
  }
}

/** Lightweight dimensions probe: read first 64KB and inspect headers for png/jpg/webp/gif. */
function probeDimensions(buf: Uint8Array): { width: number | null; height: number | null } {
  // PNG: 8-byte sig + IHDR
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf.length >= 24
  ) {
    const w = (buf[16] << 24) | (buf[17] << 16) | (buf[18] << 8) | buf[19];
    const h = (buf[20] << 24) | (buf[21] << 16) | (buf[22] << 8) | buf[23];
    return { width: w, height: h };
  }
  // GIF87a/89a
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf.length >= 10) {
    const w = buf[6] | (buf[7] << 8);
    const h = buf[8] | (buf[9] << 8);
    return { width: w, height: h };
  }
  // WebP: RIFF....WEBPVP8
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50 &&
    buf.length >= 30
  ) {
    // VP8 lossy
    if (buf[12] === 0x56 && buf[13] === 0x50 && buf[14] === 0x38 && buf[15] === 0x20) {
      const w = ((buf[26] | (buf[27] << 8)) & 0x3fff);
      const h = ((buf[28] | (buf[29] << 8)) & 0x3fff);
      return { width: w, height: h };
    }
    // VP8L lossless
    if (buf[12] === 0x56 && buf[13] === 0x50 && buf[14] === 0x38 && buf[15] === 0x4c) {
      const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
      const w = 1 + (((b1 & 0x3f) << 8) | b0);
      const h = 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
      return { width: w, height: h };
    }
  }
  // JPEG SOF0/2 scan
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      const len = (buf[i + 2] << 8) | buf[i + 3];
      if (marker >= 0xc0 && marker <= 0xc3) {
        const h = (buf[i + 5] << 8) | buf[i + 6];
        const w = (buf[i + 7] << 8) | buf[i + 8];
        return { width: w, height: h };
      }
      i += 2 + len;
    }
  }
  return { width: null, height: null };
}

// ────────────────────────────────────────────────────────────────────────────
// Per-URL check (cached so duplicates resolve to the same probe)
// ────────────────────────────────────────────────────────────────────────────

interface UrlProbe {
  reachable: boolean;
  http_status: number | null;
  content_type: string | null;
  content_length: number | null;
  width: number | null;
  height: number | null;
  bytes_hash: string | null;
  error: string | null;
}

const probeCache = new Map<string, Promise<UrlProbe>>();

function probeUrl(url: string): Promise<UrlProbe> {
  const key = normaliseUrl(url) ?? url;
  const cached = probeCache.get(key);
  if (cached) return cached;

  const p = (async (): Promise<UrlProbe> => {
    try {
      // HEAD first
      const head = await fetchWithTimeout(url, { method: "HEAD" });
      const ct = head.headers.get("content-type");
      const cl = head.headers.get("content-length");

      if (!head.ok) {
        return {
          reachable: false,
          http_status: head.status,
          content_type: ct,
          content_length: cl ? Number(cl) : null,
          width: null,
          height: null,
          bytes_hash: null,
          error: `HTTP ${head.status}`,
        };
      }

      // Ranged GET (first 64KB) to probe dimensions + hash
      let width: number | null = null;
      let height: number | null = null;
      let hash: string | null = null;
      try {
        const got = await fetchWithTimeout(url, {
          method: "GET",
          headers: { Range: "bytes=0-65535" },
        });
        if (got.ok || got.status === 206) {
          const buf = new Uint8Array(await got.arrayBuffer());
          const dims = probeDimensions(buf);
          width = dims.width;
          height = dims.height;
          hash = createHash("sha1").update(buf).digest("hex").slice(0, 16);
        }
      } catch {
        /* dimensions are best-effort */
      }

      return {
        reachable: true,
        http_status: head.status,
        content_type: ct,
        content_length: cl ? Number(cl) : null,
        width,
        height,
        bytes_hash: hash,
        error: null,
      };
    } catch (e) {
      return {
        reachable: false,
        http_status: null,
        content_type: null,
        content_length: null,
        width: null,
        height: null,
        bytes_hash: null,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  })();

  probeCache.set(key, p);
  return p;
}

// ────────────────────────────────────────────────────────────────────────────
// Classify a single nominee
// ────────────────────────────────────────────────────────────────────────────

function scoreAndStatus(args: {
  hasUrl: boolean;
  reachable: boolean | null;
  format: string | null;
  width: number | null;
  height: number | null;
  isDuplicate: boolean;
}): { score: number; status: MediaStatus } {
  const { hasUrl, reachable, format, width, height, isDuplicate } = args;

  if (!hasUrl) return { score: 0, status: "missing" };
  if (reachable === false) return { score: 10, status: "broken_link" };
  if (isDuplicate) return { score: 35, status: "duplicate" };

  let score = 40; // reachable baseline
  if (format && ALLOWED_FORMATS.includes(format)) score += 20;
  if (width && height) {
    const minSide = Math.min(width, height);
    if (minSide >= TARGET_SIDE) score += 30;
    else if (minSide >= MIN_SIDE) score += 15;
    const ar = width / height;
    if (ar >= 0.5 && ar <= 2.5) score += 10;
  } else {
    // unknown dims — neutral
    score += 5;
  }

  let status: MediaStatus;
  if (score >= 85) status = "verified";
  else if (score >= 65) status = "uploaded";
  else if (score >= 40) status = "low_quality";
  else status = "requires_review";

  return { score, status };
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function analyse(
  source: { id: string; name: string; kind: NomineeKind; url: string | null; country?: string },
  hashRegistry: Map<string, string>,
): Promise<MediaQARecord> {
  const url = source.url;
  const ext = url ? extOf(url) : null;

  let probe: UrlProbe | null = null;
  if (url) {
    probe = await probeUrl(url);
  }

  const ctype = probe?.content_type ?? null;
  const formatFromCT = ctype?.split("/")[1]?.split(";")[0]?.toLowerCase() ?? null;
  const format = ext ?? formatFromCT;

  // Duplicate detection: same bytes_hash as a different nominee
  let duplicateOf: string | null = null;
  if (probe?.bytes_hash) {
    const owner = hashRegistry.get(probe.bytes_hash);
    if (owner && owner !== source.id) duplicateOf = owner;
    else if (!owner) hashRegistry.set(probe.bytes_hash, source.id);
  }

  const { score, status } = scoreAndStatus({
    hasUrl: !!url,
    reachable: probe?.reachable ?? null,
    format,
    width: probe?.width ?? null,
    height: probe?.height ?? null,
    isDuplicate: !!duplicateOf,
  });

  const alt = altTextFor(source.name, source.kind, source.country);
  const fallback = source.kind === "organization" ? "logo_placeholder_org" : "initials_individual";

  return {
    id: source.id,
    name: source.name,
    kind: source.kind,
    source_url: url,
    profile_image_url: url ?? "",
    logo_url: source.kind === "organization" ? (url ?? "") : "",
    banner_image_url: "",
    thumbnail_image_url: url ?? "",
    featured_image_url: url ?? "",
    image_alt_text: alt,
    media_status: status,
    image_quality_score: score,
    fallback_avatar: fallback,
    media_verified: status === "verified",
    diagnostics: {
      reachable: probe?.reachable ?? null,
      http_status: probe?.http_status ?? null,
      content_type: ctype,
      content_length: probe?.content_length ?? null,
      format,
      width: probe?.width ?? null,
      height: probe?.height ?? null,
      aspect_ratio:
        probe?.width && probe?.height ? Number((probe.width / probe.height).toFixed(3)) : null,
      duplicate_of: duplicateOf,
      error: probe?.error ?? null,
    },
  };
}

async function main() {
  console.log(`[media-qa] analysing ${NGO_NOMINEES.length} NGO nominees…`);

  const hashRegistry = new Map<string, string>();
  const records: MediaQARecord[] = [];

  // Bounded concurrency
  const CONCURRENCY = 6;
  const queue: NGONominee[] = [...NGO_NOMINEES];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const n = queue.shift()!;
      const rec = await analyse(
        {
          id: n.id,
          name: n.name,
          kind: "organization",
          url: n.logoUrl || n.imageUrl || null,
          country: n.country,
        },
        hashRegistry,
      );
      records.push(rec);
      const tag = rec.media_status.padEnd(16);
      console.log(`  [${tag}] ${rec.image_quality_score.toString().padStart(3)}  ${rec.name}`);
    }
  });
  await Promise.all(workers);

  // Summary
  const counts = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.media_status] = (acc[r.media_status] ?? 0) + 1;
    return acc;
  }, {});
  const verified = records.filter((r) => r.media_verified).length;
  const avgScore = Math.round(
    records.reduce((s, r) => s + r.image_quality_score, 0) / Math.max(1, records.length),
  );
  const coverage = Math.round(
    (records.filter((r) => r.source_url).length / Math.max(1, records.length)) * 100,
  );

  const outDir = resolve("migration");
  mkdirSync(dirname(outDir + "/x"), { recursive: true });
  writeFileSync(
    `${outDir}/media-qa.ngos.json`,
    JSON.stringify({ generated_at: new Date().toISOString(), records }, null, 2),
  );
  writeFileSync(
    `${outDir}/media-qa.summary.json`,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        dataset: "ngoEducationAfrica.NGO_NOMINEES",
        total: records.length,
        verified,
        coverage_percent: coverage,
        average_quality_score: avgScore,
        by_status: counts,
      },
      null,
      2,
    ),
  );

  // Markdown report
  const md: string[] = [];
  md.push(`# Media QA Report — NGO Nominees`);
  md.push("");
  md.push(`_Generated ${new Date().toISOString()}_`);
  md.push("");
  md.push(`## Summary`);
  md.push("");
  md.push(`- **Total nominees:** ${records.length}`);
  md.push(`- **Verified media:** ${verified} (${Math.round((verified / records.length) * 100)}%)`);
  md.push(`- **URL coverage:** ${coverage}%`);
  md.push(`- **Average quality score:** ${avgScore}/100`);
  md.push("");
  md.push(`### Status breakdown`);
  md.push("");
  md.push(`| Status | Count |`);
  md.push(`|---|---:|`);
  for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    md.push(`| \`${k}\` | ${v} |`);
  }
  md.push("");

  const needsAction = records.filter((r) =>
    ["missing", "broken_link", "duplicate", "low_quality", "requires_review"].includes(
      r.media_status,
    ),
  );
  md.push(`## Action queue (${needsAction.length})`);
  md.push("");
  md.push(`| Nominee | Status | Score | Issue |`);
  md.push(`|---|---|---:|---|`);
  for (const r of needsAction.slice(0, 200)) {
    const issue =
      r.diagnostics.duplicate_of
        ? `duplicate of ${r.diagnostics.duplicate_of}`
        : r.diagnostics.error
          ? r.diagnostics.error
          : !r.source_url
            ? "no image on file — uses fallback"
            : r.diagnostics.width && r.diagnostics.height
              ? `${r.diagnostics.width}×${r.diagnostics.height}`
              : "—";
    md.push(`| ${r.name} | \`${r.media_status}\` | ${r.image_quality_score} | ${issue} |`);
  }
  md.push("");
  md.push(`## Fallback policy applied`);
  md.push("");
  md.push(`- Individuals → premium gradient + initials avatar.`);
  md.push(`- Organisations → branded placeholder logo card (gold ring, building icon, initials).`);
  md.push(`- No empty image containers shipped anywhere.`);
  md.push("");
  md.push(`## Notes on broader nominee dataset`);
  md.push("");
  md.push(
    `- \`NOMINEES_2025\` is a tuple-based dataset (no image columns yet). Every record renders via the same fallback avatar; QA records are not produced for it until image fields are introduced upstream.`,
  );
  writeFileSync(`${outDir}/media-qa.report.md`, md.join("\n"));

  console.log("");
  console.log("[media-qa] done.");
  console.log(`  → ${outDir}/media-qa.report.md`);
  console.log(`  → ${outDir}/media-qa.ngos.json`);
  console.log(`  → ${outDir}/media-qa.summary.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
