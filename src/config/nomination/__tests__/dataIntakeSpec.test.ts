import { describe, it, expect } from "vitest";
import {
  AWARD_GROUP_CODES,
  CATEGORY_CODES,
  REGION_CODES,
  buildAwardRecordId,
  buildRmsaRecordId,
  buildAwardFormTitle,
  buildRmsaFormTitle,
  buildAwardSheetTitle,
  buildRmsaSheetTitle,
  computeDataQualityScore,
  bandForScore,
  SHEET_TAB_COLUMNS,
} from "../dataIntakeSpec";
import { AWARD_CATEGORY_FORMS } from "../awardCategoryForms";
import { RMSA_REGIONAL_FORMS } from "../rmsaRegionalForms";

describe("dataIntakeSpec", () => {
  it("has a category code for every one of the 23 award forms", () => {
    for (const form of AWARD_CATEGORY_FORMS) {
      expect(CATEGORY_CODES[form.slug], `missing code for ${form.slug}`).toBeTruthy();
    }
    expect(Object.keys(CATEGORY_CODES)).toHaveLength(23);
  });

  it("has a region code for every RMSA regional form", () => {
    for (const form of RMSA_REGIONAL_FORMS) {
      expect(REGION_CODES[form.slug], `missing code for ${form.slug}`).toBeTruthy();
    }
  });

  it("builds award record_id in NESA2026-GROUP-CATEGORY-YYYYMMDD-NNNN format", () => {
    const id = buildAwardRecordId({
      family: "gold-blue-garnet",
      categorySlug: "best-csr-for-education-nigeria",
      submittedAt: new Date(Date.UTC(2026, 5, 1)),
      rowNumber: 1,
    });
    expect(id).toBe("NESA2026-GBG-CSRNG-20260601-0001");
  });

  it("builds RMSA record_id in RMSA2027-REGION-YYYYMMDD-NNNN format", () => {
    const id = buildRmsaRecordId({
      regionSlug: "west-africa",
      submittedAt: new Date(Date.UTC(2026, 5, 1)),
      rowNumber: 1,
    });
    expect(id).toBe("RMSA2027-WAF-20260601-0001");
  });

  it("throws for unknown category or region slugs", () => {
    expect(() =>
      buildAwardRecordId({
        family: "gold-blue-garnet",
        categorySlug: "nope",
        submittedAt: new Date(),
        rowNumber: 1,
      }),
    ).toThrow();
    expect(() =>
      buildRmsaRecordId({ regionSlug: "atlantis", submittedAt: new Date(), rowNumber: 1 }),
    ).toThrow();
  });

  it("produces the canonical form and sheet titles", () => {
    expect(buildAwardFormTitle("Best CSR for Education - Nigeria")).toBe(
      "The New Education Standard Award Africa 2026 Public Nomination - Best CSR for Education - Nigeria",
    );
    expect(buildAwardSheetTitle("Best CSR for Education - Nigeria")).toBe(
      "NESA 2026 - Best CSR for Education - Nigeria - Responses",
    );
    expect(buildRmsaFormTitle("West Africa")).toBe(
      "The New Education Standard Award Africa 2026/2027 Special Needs School Intervention - West Africa School Nomination",
    );
    expect(buildRmsaSheetTitle("West Africa")).toBe(
      "NESA 2026-2027 RMSA Special Needs School Intervention - West Africa Responses",
    );
  });

  it("scores all-true flags as 100 and assigns 'strong' band", () => {
    const score = computeDataQualityScore({
      submitterDetailsComplete: true,
      nomineeNameAndTypeComplete: true,
      countryAndRegionComplete: true,
      correctCategoryAndSubcategory: true,
      impactSummaryClear: true,
      evidenceLinkProvided: true,
      evidenceCredible: true,
      contactRouteAvailable: true,
      declarationCompleted: true,
    });
    expect(score).toBe(100);
    expect(bandForScore(score)).toBe("strong");
  });

  it("scores empty flags as 0 with 'not_ready' band", () => {
    expect(computeDataQualityScore({})).toBe(0);
    expect(bandForScore(0)).toBe("not_ready");
  });

  it("classifies bands at threshold boundaries", () => {
    expect(bandForScore(80)).toBe("strong");
    expect(bandForScore(79)).toBe("reviewable");
    expect(bandForScore(60)).toBe("reviewable");
    expect(bandForScore(59)).toBe("weak");
    expect(bandForScore(40)).toBe("weak");
    expect(bandForScore(39)).toBe("not_ready");
  });

  it("exposes the seven canonical sheet tab column layouts", () => {
    expect(SHEET_TAB_COLUMNS.cleaned).toContain("record_id");
    expect(SHEET_TAB_COLUMNS.websiteSync).toContain("nominee_id");
    expect(SHEET_TAB_COLUMNS.duplicates).toContain("possible_duplicate_record_id");
    expect(SHEET_TAB_COLUMNS.evidence).toContain("evidence_quality");
  });

  it("maps every award family to a group code", () => {
    expect(Object.keys(AWARD_GROUP_CODES).sort()).toEqual(
      ["africa-education-icon", "gold-blue-garnet", "influencer", "platinum"].sort(),
    );
  });
});
