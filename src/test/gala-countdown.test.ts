// Regression guard: every Gala countdown on the site must resolve to the
// canonical target 2026-12-13T00:00:00+01:00 (13 December 2026, 00:00 WAT).

import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import {
  GALA_COUNTDOWN_DATETIME,
  GALA_COUNTDOWN_TARGET,
  PROGRAMME_END_DATE,
  PROGRAMME_END_LABEL,
} from "@/config/programme";
import { CURRENT_SEASON } from "@/config/nesaSeasonConfig";
import { getSubpageModules } from "@/config/awards/subpageModules2026";

const CANONICAL_ISO = "2026-12-13T00:00:00+01:00";
const CANONICAL_UTC = "2026-12-12T23:00:00.000Z";

describe("Gala countdown — canonical target", () => {
  it("programme config exposes the corrected target", () => {
    expect(GALA_COUNTDOWN_DATETIME).toBe(CANONICAL_ISO);
    expect(GALA_COUNTDOWN_TARGET.toISOString()).toBe(CANONICAL_UTC);
    expect(PROGRAMME_END_DATE).toBe("2026-12-13");
    expect(PROGRAMME_END_LABEL).toBe("13 December 2026");
  });

  it("season ceremony countdown uses the canonical target", () => {
    expect(CURRENT_SEASON.ceremonyDate.toISOString()).toBe(CANONICAL_UTC);
  });

  it("award subpage Gala countdown uses the canonical target", () => {
    const platinum = getSubpageModules("platinum", "Platinum");
    expect(platinum.countdown.targetIso).toBe(CANONICAL_ISO);
    // Icon subpages count down to their own nomination deadline, not the Gala.
    const icon = getSubpageModules("africa-education-icon", "Icon");
    expect(icon.countdown.targetIso).not.toBe(CANONICAL_ISO);
  });

  it("countdown surfaces import the shared constant instead of hard-coding a date", () => {
    const files = [
      "src/components/nesa/CountdownSection.tsx",
      "src/features/landing/editorial/GalaBandSection.tsx",
      "src/pages/media/Gala.tsx",
      "src/config/schedule.ts",
      "src/config/nesaSeasonConfig.ts",
    ];
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      expect(src, `${f} must use the shared countdown constant`).toMatch(/GALA_COUNTDOWN_(TARGET|DATETIME)/);
      expect(src, `${f} must not hard-code a Gala date`).not.toMatch(/new Date\("2026-12-\d{2}T/);
    }
  });

  it("no retired 14 December Gala date remains in config or components", () => {
    const files = [
      "src/config/programme.ts",
      "src/config/schedule.ts",
      "src/components/nesa/CountdownSection.tsx",
      "src/features/landing/editorial/GalaBandSection.tsx",
      "src/pages/media/Gala.tsx",
    ];
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      expect(src, `${f} still references 14 December 2026`).not.toMatch(/2026-12-14|14 December 2026/);
    }
  });
});
