import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import {
  EDUAID_WEBINAR_SERIES_2026,
  EDUAID_CONTENT_BOUNDARY,
} from "@/data/eduaidWebinarSeries2026";
import {
  checkIconBoundary,
  formatIconBoundaryViolations,
  iconNomineeNames,
} from "@/lib/governance/iconBoundary";

/**
 * Automated enforcement of the Episode 4 / Episode 7 Icon content boundary:
 * no naming, promoting, comparing, or commenting on any specific Africa
 * Education Icon nominee under active review.
 */

const BOUNDARY_EPISODES = EDUAID_WEBINAR_SERIES_2026.filter(
  (e) => e.competitiveStatus === "icon-boundary",
);

/** Surfaces that render or author webinar episode copy. */
const COPY_SURFACES = [
  "src/data/eduaidWebinarSeries2026.ts",
  "src/pages/media/Webinars.tsx",
  "src/content/webinars",
];

function* walk(p: string): Generator<string> {
  if (!existsSync(p)) return;
  const s = statSync(p);
  if (s.isFile()) {
    if (/\.(ts|tsx|md|json)$/.test(p)) yield p;
    return;
  }
  if (!s.isDirectory()) return;
  for (const entry of readdirSync(p)) yield* walk(join(p, entry));
}

describe("Icon content boundary — Episodes 4 and 7", () => {
  it("the boundary applies to exactly Episodes 4 and 7", () => {
    expect(BOUNDARY_EPISODES.map((e) => e.episode)).toEqual([4, 7]);
    expect(EDUAID_CONTENT_BOUNDARY.iconJudgingWindow).toContain("12 October 2026");
  });

  it("has a non-empty Icon nominee roster to check against", () => {
    expect(iconNomineeNames().length).toBeGreaterThan(20);
  });

  for (const ep of BOUNDARY_EPISODES) {
    it(`Episode ${ep.episode} ("${ep.title}") names no Icon nominee and uses no promoting/comparing language`, () => {
      const text = [ep.title, ep.summary, ep.tiers, ep.competitiveLabel].join("\n");
      const violations = checkIconBoundary(text);
      expect(
        violations,
        formatIconBoundaryViolations(`Episode ${ep.episode}`, violations),
      ).toEqual([]);
    });

    it(`Episode ${ep.episode} carries the Icon-only boundary label`, () => {
      expect(ep.competitiveLabel.toLowerCase()).toContain("content boundary");
    });
  }

  it("webinar copy surfaces contain no Icon nominee names or boundary-breaking language", () => {
    const offenders: string[] = [];
    for (const surface of COPY_SURFACES) {
      for (const file of walk(resolve(process.cwd(), surface))) {
        const body = readFileSync(file, "utf8");
        const violations = checkIconBoundary(body);
        if (violations.length) {
          offenders.push(
            formatIconBoundaryViolations(relative(process.cwd(), file), violations),
          );
        }
      }
    }
    expect(offenders, offenders.join("\n\n")).toEqual([]);
  });

  it("detects violations when they are introduced (checker sanity)", () => {
    const sample = iconNomineeNames()[0];
    expect(checkIconBoundary(`This episode features ${sample}.`)).not.toEqual([]);
    expect(checkIconBoundary("This nominee should win the Icon award.")).not.toEqual([]);
    expect(checkIconBoundary("Vote for our guest in the Icon category.")).not.toEqual([]);
    expect(checkIconBoundary("A clear front-runner emerged.")).not.toEqual([]);
    expect(
      checkIconBoundary("Curriculum Innovation & Future of Work — reforming how Africa learns."),
    ).toEqual([]);
  });
});
