import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { GALA_COUNTDOWN_DATETIME, GALA_COUNTDOWN_TARGET, PROGRAMME_END_DATE, PROGRAMME_END_LABEL } from "@/config/programme";
import { CURRENT_SEASON } from "@/config/nesaSeasonConfig";

const CANONICAL_ISO = "2026-12-28T00:00:00+01:00";
const CANONICAL_UTC = "2026-12-27T23:00:00.000Z";

describe("online programme without countdown surfaces", () => {
  it("retains the canonical programme date for non-countdown content", () => {
    expect(GALA_COUNTDOWN_DATETIME).toBe(CANONICAL_ISO);
    expect(GALA_COUNTDOWN_TARGET.toISOString()).toBe(CANONICAL_UTC);
    expect(PROGRAMME_END_DATE).toBe("2026-12-28");
    expect(PROGRAMME_END_LABEL).toBe("Monday 28 December 2026");
    expect(CURRENT_SEASON.ceremonyDate.toISOString()).toBe(CANONICAL_UTC);
    expect(CURRENT_SEASON.ceremonyLocation).toBe("Online only");
  });

  it("renders no countdown on the retired homepage band, gala alias or award template", () => {
    for (const file of ["src/components/nesa/CountdownSection.tsx", "src/pages/media/Gala.tsx", "src/components/awards/subpage/AwardSubpageTemplate.tsx"]) {
      const source = readFileSync(file, "utf8");
      expect(source, `${file} must not render a countdown`).not.toMatch(/<CountdownTimer|<AwardCountdownBlock/);
    }
  });

  it("keeps the programme on Monday 28 December 2026", () => {
    for (const file of ["src/config/programme.ts", "src/config/schedule.ts", "src/features/landing/editorial/GalaBandSection.tsx", "src/pages/gala/GalaConsolidated.tsx"]) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toMatch(/2026-12-13|13 December 2026|2026-12-14|14 December 2026/);
    }
  });
});
