/**
 * NESA-Africa — Recognition Catalogue Migration Report
 *
 * Reads every published nominee from the security-hardened `public_nominees`
 * view, maps each record onto the approved Tier → Category → Subcategory
 * framework using `src/config/directory/catalogueTaxonomy.ts`, and writes a
 * governance-ready migration report.
 *
 * Run: bunx tsx scripts/catalogue-migration-report.ts
 * Output: docs/refactor/nominee-catalogue-migration-report.md
 */
import { writeFileSync, mkdirSync } from "fs";
import {
  CATALOGUE_TIERS,
  CATEGORY_MAP,
  MIN_MAPPING_CONFIDENCE,
  subcategoryFamilyName,
  subcategoryFamilySlug,
} from "../src/config/directory/catalogueTaxonomy";

const SUPABASE_URL = "https://sjghitoydzpirpqjules.supabase.co";
const ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZ2hpdG95ZHpwaXJwcWp1bGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjA4OTksImV4cCI6MjA4NDU5Njg5OX0.TGMiFx-q_W9FhQMTDHaJ6IPcvJrlvsdBYegHgMQShBw";

const headers = { apikey: ANON, Authorization: `Bearer ${ANON}` };

async function fetchAll(path: string, select: string) {
  const rows: any[] = [];
  const step = 1000;
  for (let from = 0; ; from += step) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}?select=${select}`, {
      headers: { ...headers, Range: `${from}-${from + step - 1}` },
    });
    const chunk = (await res.json()) as any[];
    if (!Array.isArray(chunk) || chunk.length === 0) break;
    rows.push(...chunk);
    if (chunk.length < step) break;
  }
  return rows;
}

const inc = (m: Record<string, number>, k: string) => (m[k] = (m[k] ?? 0) + 1);
const table = (title: string, m: Record<string, number>) =>
  `### ${title}\n\n| Value | Nominees |\n|---|---:|\n${Object.entries(m)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `| ${k} | ${v} |`)
    .join("\n")}\n`;

async function main() {
  const subs = await fetchAll(
    "subcategories",
    "id,name,slug,categories:category_id(name,slug)",
  );
  const subMap = new Map(subs.map((s: any) => [s.id, s]));
  const nominees = await fetchAll(
    "public_nominees",
    "id,name,slug,subcategory_id,country,region,status,nrc_verified,acceptance_status,created_at",
  );

  const byTier: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const bySubcategory: Record<string, number> = {};
  const byRegion: Record<string, number> = {};
  const byCountry: Record<string, number> = {};
  const byYear: Record<string, number> = {};
  const byVerification: Record<string, number> = {};
  const review: string[] = [];
  const dupes: string[] = [];

  const seenIds = new Set<string>();
  const identity = new Map<string, string[]>();

  for (const n of nominees) {
    if (seenIds.has(n.id)) continue;
    seenIds.add(n.id);

    const key = `${(n.name ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()}|${(n.country ?? "").toLowerCase()}`;
    identity.set(key, [...(identity.get(key) ?? []), n.name]);

    inc(byRegion, n.region || "Unspecified");
    inc(byCountry, n.country || "Unspecified");
    inc(byYear, n.created_at ? String(new Date(n.created_at).getUTCFullYear()) : "Unspecified");
    inc(
      byVerification,
      n.nrc_verified ? "Verified" : n.acceptance_status === "accepted" ? "Accepted" : (n.status ?? "pending"),
    );

    const sub: any = subMap.get(n.subcategory_id);
    const catSlug = sub?.categories?.slug;
    const mapping = catSlug ? CATEGORY_MAP[catSlug] : undefined;

    if (!mapping || mapping.confidence < MIN_MAPPING_CONFIDENCE) {
      review.push(`| ${n.name} | ${catSlug ?? "—"} | ${sub?.name ?? "—"} | ${mapping ? "confidence below 90%" : "no confirmed tier mapping"} |`);
      continue;
    }

    inc(byTier, mapping.tier);
    inc(byCategory, mapping.displayName);
    inc(bySubcategory, `${mapping.displayName} → ${subcategoryFamilyName(sub.name)} (${subcategoryFamilySlug(sub.slug)})`);
  }

  for (const [key, names] of identity) {
    if (names.length > 1) dupes.push(`| ${key} | ${names.length} |`);
  }

  const total = seenIds.size;
  const mapped = Object.values(byTier).reduce((a, b) => a + b, 0);

  const md = `# Recognition Catalogue — Migration Report

_Generated ${new Date().toISOString()}_

## Summary

| Metric | Count |
|---|---:|
| Total nominee records | ${total} |
| Categorised into a tier | ${mapped} |
| Migration Review Queue | ${review.length} |
| Duplicate identity clusters | ${dupes.length} |
| Award tiers | ${CATALOGUE_TIERS.length} |
| Mapped award categories | ${Object.keys(byCategory).length} |
| Mapped subcategory families | ${Object.keys(bySubcategory).length} |

### By Tier

| Tier | Nominees |
|---|---:|
${CATALOGUE_TIERS.map((t) => `| Tier ${t.tierNumber} · ${t.name} | ${byTier[t.slug] ?? 0} |`).join("\n")}

${table("By Category", byCategory)}
${table("By Subcategory", bySubcategory)}
${table("By Region", byRegion)}
${table("By Country", byCountry)}
${table("By Nomination Year", byYear)}
${table("By Verification Status", byVerification)}

## Migration Review Queue (${review.length})

${review.length === 0 ? "_Empty — every record maps to a tier with ≥90% confidence._" : `| Nominee | Category slug | Subcategory | Reason |\n|---|---|---|---|\n${review.join("\n")}`}

## Duplicate Identity Clusters (${dupes.length})

${dupes.length === 0 ? "_None detected._" : `| Normalised identity | Records |\n|---|---:|\n${dupes.join("\n")}`}

## Governance Notes

- No record was deleted, overwritten, or reassigned by this report; mapping is applied at the presentation layer only.
- Every nominee remains linked to its original historical nomination record via \`nominees.id\` and \`subcategory_id\`.
- Records below the 90% confidence threshold are held in the Migration Review Queue and surfaced in the directory UI at \`/nominees/catalogue\`.
`;

  mkdirSync("docs/refactor", { recursive: true });
  writeFileSync("docs/refactor/nominee-catalogue-migration-report.md", md);
  console.log(`Report written. ${mapped}/${total} categorised, ${review.length} in review.`);
}

main();
