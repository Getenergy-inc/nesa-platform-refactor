import { describe, expect, it } from "vitest";
import { SITE_STATS_FALLBACK } from "@/config/siteStats";
import { AWARD_TIERS_TOTALS } from "@/config/awardTiers2026";

describe("approved public award totals", () => {
  it("has four tiers", () => {
    expect(SITE_STATS_FALLBACK.tiers).toBe(4);
    expect(AWARD_TIERS_TOTALS.tiers).toBe(4);
  });
  it("has 22 main categories", () => {
    expect(SITE_STATS_FALLBACK.categories).toBe(22);
    expect(AWARD_TIERS_TOTALS.categories).toBe(22);
  });
  it("has 90 subcategories, excluding Icon and Influencer pathways", () => {
    expect(SITE_STATS_FALLBACK.subcategories).toBe(90);
    expect(AWARD_TIERS_TOTALS.subcategories).toBe(90);
    expect(SITE_STATS_FALLBACK.iconSubcategories).toBe(0);
    expect(SITE_STATS_FALLBACK.influencerSubcategories).toBe(0);
  });
  it("splits subcategories into Platinum 27 and Gold-Blue Garnet 63", () => {
    expect(SITE_STATS_FALLBACK.platinumSubcategories).toBe(27);
    expect(SITE_STATS_FALLBACK.goldBlueGarnetSubcategories).toBe(63);
  });
});