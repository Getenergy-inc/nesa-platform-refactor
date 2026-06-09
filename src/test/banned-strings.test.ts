import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

/**
 * Pass A / Pass E governance — banned phrases must not leak back into source.
 * Mirrors `scripts/check-banned-strings.sh` (date strings) plus the audit
 * cleanup list and surfaces failures as a failing unit test in CI.
 */
const BANNED: { needle: string; pattern?: RegExp }[] = [
  // Legacy date windows — must be 2006–2026.
  { needle: "2005–2025" },
  { needle: "2005-2025" },
  { needle: "2005 to 2025" },
  { needle: "2006–2025" },
  { needle: "2006-2025" },
  // Audit-aligned terminology cleanup (Pass A).
  { needle: "Blue Garnet & Gold" },
  // Must read "Gold-Blue Garnet — Competitive Excellence" — flag any
  // occurrence NOT preceded by "Gold-".
  {
    needle: "Blue Garnet — Competitive Excellence (must be Gold-Blue Garnet …)",
    pattern: /(?<!Gold-)Blue Garnet — Competitive Excellence/,
  },
  { needle: "Gold / Blue Garnet" },
  { needle: "Gold, Blue Garnet" },
  { needle: "Gold and Blue Garnet" },
  { needle: "Vote & Earn AGC" }, // replaced by "Nominate & Earn AGC Voting Coin"
  { needle: "Nominate your Champion" }, // replaced by "Submit Evidence-Based Nomination"
];

const ROOTS = ["src", "public", "index.html"];
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "coverage"]);
const SKIP_EXT = new Set([
  ".csv", ".lock", ".lockb", ".png", ".jpg", ".jpeg", ".svg",
  ".webp", ".ico", ".mp4", ".mp3", ".pdf", ".woff", ".woff2",
]);
const SELF = relative(process.cwd(), __filename);

function* walk(p: string): Generator<string> {
  let s: ReturnType<typeof statSync>;
  try { s = statSync(p); } catch { return; }
  if (s.isFile()) { yield p; return; }
  if (!s.isDirectory()) return;
  for (const entry of readdirSync(p)) {
    if (SKIP_DIRS.has(entry)) continue;
    yield* walk(join(p, entry));
  }
}

function shouldScan(file: string): boolean {
  if (relative(process.cwd(), file) === SELF) return false;
  const lower = file.toLowerCase();
  for (const ext of SKIP_EXT) if (lower.endsWith(ext)) return false;
  return true;
}

describe("banned strings governance", () => {
  for (const { needle } of BANNED) {
    it(`source tree contains no occurrences of "${needle}"`, () => {
      const offenders: string[] = [];
      for (const root of ROOTS) {
        for (const file of walk(resolve(process.cwd(), root))) {
          if (!shouldScan(file)) continue;
          let body: string;
          try { body = readFileSync(file, "utf8"); } catch { continue; }
          if (body.includes(needle)) {
            offenders.push(relative(process.cwd(), file));
          }
        }
      }
      expect(
        offenders,
        `Banned string "${needle}" found in:\n  ${offenders.join("\n  ")}`,
      ).toEqual([]);
    });
  }
});
