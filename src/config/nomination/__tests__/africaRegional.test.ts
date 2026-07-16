import { describe, it, expect } from "vitest";
import {
  AWARD_CATEGORY_FORMS,
  getCategoryFormBySlug,
  getCategoryRegion,
} from "@/config/nomination/awardCategoryForms";
import { AFRICA_REGIONS } from "@/config/nomination/africaRegions";

const REGIONAL_SLUGS = [
  "best-csr-for-education-africa-regional",
  "best-edutech-innovation-for-education-africa-regional",
  "best-ngo-for-education-advancement-africa-regional",
  "best-stem-education-programme-africa-regional",
];

const SUB_COUNTS: Record<string, number> = {
  "best-csr-for-education-africa-regional": 6,
  "best-edutech-innovation-for-education-africa-regional": 4,
  "best-ngo-for-education-advancement-africa-regional": 9,
  "best-stem-education-programme-africa-regional": 7,
};

describe("Africa Regional category forms", () => {
  it.each(REGIONAL_SLUGS)(
    "%s is flagged as regional and has all 8 African regions",
    (slug) => {
      const cat = getCategoryFormBySlug(slug)!;
      expect(cat).toBeDefined();
      expect(cat.isRegionalCategory).toBe(true);
      expect(cat.regions).toHaveLength(AFRICA_REGIONS.length);
      const slugs = cat.regions!.map((r) => r.slug).sort();
      expect(slugs).toEqual(AFRICA_REGIONS.map((r) => r.slug).sort());
    },
  );

  it("each region carries its own subcategories suffixed with the region name", () => {
    for (const slug of REGIONAL_SLUGS) {
      const cat = getCategoryFormBySlug(slug)!;
      for (const region of cat.regions!) {
        expect(region.subcategories).toHaveLength(SUB_COUNTS[slug]);
        for (const sub of region.subcategories) {
          expect(sub.name.endsWith(`— ${region.name}`)).toBe(true);
        }
      }
    }
  });

  it("each region only exposes its own countries (no cross-region leakage)", () => {
    for (const slug of REGIONAL_SLUGS) {
      const cat = getCategoryFormBySlug(slug)!;
      for (const region of cat.regions!) {
        const expected = AFRICA_REGIONS.find((r) => r.slug === region.slug)!.countries;
        expect(region.countries).toEqual(expected);
      }
    }
  });

  it("non-regional categories remain unaffected", () => {
    const ngo = getCategoryFormBySlug("best-csr-for-education-nigeria")!;
    expect(ngo.isRegionalCategory).toBeFalsy();
    expect(ngo.regions).toBeUndefined();
  });

  it("getCategoryRegion resolves a regional variant by slugs", () => {
    const r = getCategoryRegion(
      "best-csr-for-education-africa-regional",
      "west-africa",
    );
    expect(r).toBeDefined();
    expect(r!.name).toBe("West Africa");
    expect(r!.countries).toContain("Nigeria");
    expect(r!.sheetTitle).toBe(
      "NESA 2026 — Best CSR for Education — Africa Regional — West Africa — Responses",
    );
  });

  it("yields exactly 32 regional variants across the 4 Africa Regional categories (4 × 8 regions)", () => {
    const total = AWARD_CATEGORY_FORMS.filter((c) => c.isRegionalCategory).reduce(
      (n, c) => n + (c.regions?.length ?? 0),
      0,
    );
    expect(total).toBe(32);
  });
});
