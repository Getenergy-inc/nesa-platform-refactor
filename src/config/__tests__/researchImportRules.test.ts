import { describe, expect, it } from "vitest";
import {
  isResearchCompilation,
  subcategoryMatchesRegion,
  validateResearchImport,
  type ResearchImportRecord,
} from "../researchImportRules";

const base: ResearchImportRecord = {
  name: "ActionAid Nigeria",
  region: "West Africa",
  subcategorySlug: "ngo-africa-girlchild-west-africa",
  status: "under_review",
  publicationStatus: "unpublished",
  nrcVerified: false,
  nominationSource: "Research compilation — Aug 2026",
  legacySource: null,
};

describe("research-compilation source attribution", () => {
  it("recognises the research compilation source", () => {
    expect(isResearchCompilation("Research compilation — Aug 2026")).toBe(true);
    expect(isResearchCompilation("2024 legacy register")).toBe(false);
    expect(isResearchCompilation(null)).toBe(false);
  });

  it("rejects records that leave attribution in legacy_source", () => {
    const issues = validateResearchImport([
      { ...base, nominationSource: null, legacySource: "Research compilation — Aug 2026" },
    ]);
    expect(issues.some((i) => i.rule === "source-field")).toBe(true);
  });
});

describe("region-scoped subcategory mapping", () => {
  it("accepts a subcategory scoped to the record's region", () => {
    expect(subcategoryMatchesRegion("ngo-africa-scholarship-east-africa", "East Africa")).toBe(true);
  });

  it("accepts all 10 research regions", () => {
    expect(subcategoryMatchesRegion("ngo-africa-basicprimary-horn-of-africa", "Horn of Africa")).toBe(true);
    expect(subcategoryMatchesRegion("ngo-africa-refugee-sahel-africa", "Sahel Africa")).toBe(true);
    expect(subcategoryMatchesRegion("ngo-africa-training-indian-ocean-islands", "Indian Ocean Islands")).toBe(true);
    expect(subcategoryMatchesRegion("ngo-africa-scholarship-african-diaspora", "African Diaspora")).toBe(true);
    expect(subcategoryMatchesRegion("ngo-africa-community-friends-of-africa", "Friends of Africa")).toBe(true);
  });

  it("rejects a cross-region mapping", () => {
    expect(subcategoryMatchesRegion("ngo-africa-scholarship-east-africa", "West Africa")).toBe(false);
    const issues = validateResearchImport([
      { ...base, region: "East Africa" },
    ]);
    expect(issues.map((i) => i.rule)).toContain("region-scope");
  });

  it("rejects an unknown region", () => {
    expect(subcategoryMatchesRegion("ngo-africa-scholarship-west-africa", "Atlantis")).toBe(false);
  });
});

describe("review gate for research imports", () => {
  it("passes a correctly staged record", () => {
    expect(validateResearchImport([base])).toEqual([]);
  });

  it("fails an import that skips straight to published", () => {
    const issues = validateResearchImport([
      { ...base, status: "approved", publicationStatus: "published" },
    ]);
    expect(issues.some((i) => i.rule === "review-gate")).toBe(true);
  });

  it("fails an import that pre-sets nrc_verified", () => {
    const issues = validateResearchImport([{ ...base, nrcVerified: true }]);
    expect(issues.some((i) => i.rule === "review-gate")).toBe(true);
  });

  it("requires all three review flags together", () => {
    expect(validateResearchImport([{ ...base, publicationStatus: "published" }]).length).toBe(1);
    expect(validateResearchImport([{ ...base, status: "approved" }]).length).toBe(1);
  });
});
