/**
 * Guard: every NRC / Judges Arena layout shell must mount <ArenaSeo> so page
 * titles and Open Graph tokens stay consistent across all arena routes.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ARENA_LAYOUTS = [
  "src/components/judge/JudgesArenaLayout.tsx",
  "src/components/judge/ArenaShellLayout.tsx",
  "src/features/iconJudges/IconJuryLayout.tsx",
  "src/components/nrc/arena/NRCArenaLayout.tsx",
  "src/components/nrc/arena/NRCArenaPage.tsx",
  "src/components/nrc/NRCLayout.tsx",
  "src/components/nrc/NRCDashboardLayout.tsx",
];

describe("Arena layouts mount ArenaSeo", () => {
  it.each(ARENA_LAYOUTS)("%s renders <ArenaSeo>", (file) => {
    const src = readFileSync(resolve(process.cwd(), file), "utf8");
    expect(src).toMatch(/from ["']@\/components\/arena\/ArenaSeo["']/);
    expect(src).toMatch(/<ArenaSeo\b/);
    expect(src).toMatch(/workspace=["'](NRC Arena|Judges Arena)["']/);
  });
});
