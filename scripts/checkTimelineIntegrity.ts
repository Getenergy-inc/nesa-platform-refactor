/**
 * Timeline Integrity Guard
 * ------------------------
 * Enforces that `src/data/masterTimeline2026.ts` is the single source of truth
 * for NESA-Africa 2026 milestone dates and copy.
 *
 * Two checks are performed:
 *   1. Denylist scan — no legacy date strings / superseded phrases anywhere
 *      in `src/` (with a narrow allowlist for the master file itself and
 *      historical archives).
 *   2. Positive wiring — the shared master timeline table imports from
 *      the canonical module, and the Timeline page mounts that table.
 *
 * Exits non-zero on failure so it can run in CI, `npm test`, or manually via
 *   `tsx scripts/checkTimelineIntegrity.ts`
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = join(process.cwd(), "src");
const CANONICAL = "src/data/masterTimeline2026.ts";

/**
 * Legacy strings replaced by the master timeline. Any occurrence outside the
 * allowlist is a bug — pages must derive their copy from MASTER_TIMELINE_2026
 * / MASTER_TIMELINE_PUBLIC_NOTICE instead of hard-coding superseded dates.
 */
const DENYLIST: { pattern: RegExp; reason: string }[] = [
  { pattern: /\b5\s+July\s+2026\b/i, reason: "Legacy Platinum Recognition Show date (superseded)" },
  { pattern: /\b10\s+July\s+2026\b/i, reason: "Legacy Icon nominations close date (superseded)" },
  { pattern: /\b29\s+June\s*[–-]\s*10\s+July\s+2026\b/i, reason: "Legacy Icon nominations window (superseded)" },
  { pattern: /\b1\s*[–-]\s*30\s+July\s+2026\b/i, reason: "Legacy pre-launch window — master timeline is 1 – 31 July 2026" },
  { pattern: /NESA-?Africa\s*2025\/26/i, reason: "Legacy '2025/26' branding — use 'NESA-Africa 2026'" },
];

/**
 * Files exempt from the denylist scan. Keep this list tight — it must only
 * contain the canonical data module, historical logs, or this guard itself.
 */
const ALLOWLIST = new Set<string>([
  CANONICAL,
  "src/data/recognitionJourney2026.ts", // historical phase archive, migrated separately
]);

const EXTENSIONS = new Set([".ts", ".tsx"]);
const failures: string[] = [];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      walk(full, out);
    } else if (EXTENSIONS.has(full.slice(full.lastIndexOf("."))) ) {
      out.push(full);
    }
  }
  return out;
}

// ---- Check 1: denylist scan --------------------------------------------------
for (const file of walk(ROOT)) {
  const rel = relative(process.cwd(), file).split(sep).join("/");
  if (ALLOWLIST.has(rel)) continue;
  const src = readFileSync(file, "utf8");
  for (const { pattern, reason } of DENYLIST) {
    const lines = src.split("\n");
    lines.forEach((line, i) => {
      if (pattern.test(line)) {
        failures.push(`${rel}:${i + 1}  ${reason}\n    → ${line.trim()}`);
      }
    });
  }
}

// ---- Check 2: positive wiring -----------------------------------------------
function assertContains(file: string, needle: string | RegExp, message: string) {
  try {
    const src = readFileSync(file, "utf8");
    const found = typeof needle === "string" ? src.includes(needle) : needle.test(src);
    if (!found) failures.push(`${file}  ${message}`);
  } catch {
    failures.push(`${file}  missing (${message})`);
  }
}

assertContains(
  "src/components/timeline/MasterTimelineTable.tsx",
  /MASTER_TIMELINE_2026|from ["']@\/data\/masterTimeline2026["']/,
  "must import MASTER_TIMELINE_2026 from @/data/masterTimeline2026",
);
assertContains(
  "src/pages/about/Timeline.tsx",
  "MasterTimelineTable",
  "must render <MasterTimelineTable /> to expose the master calendar",
);
assertContains(
  "src/components/nesa/PublicNominationsNotice.tsx",
  /MASTER_TIMELINE_PUBLIC_NOTICE|from ["']@\/data\/masterTimeline2026["']/,
  "must source copy from MASTER_TIMELINE_PUBLIC_NOTICE",
);

// ---- Report ------------------------------------------------------------------
if (failures.length) {
  console.error("\n✖ Timeline integrity check failed:\n");
  for (const f of failures) console.error("  " + f);
  console.error(
    `\n${failures.length} issue(s). Update the offending file(s) to consume ` +
      `MASTER_TIMELINE_2026 / MASTER_TIMELINE_PUBLIC_NOTICE from ${CANONICAL}.\n`,
  );
  process.exit(1);
}

console.log("✓ Timeline integrity check passed — master timeline is the single source of truth.");
