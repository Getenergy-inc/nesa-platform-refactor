import { describe, it, expect } from "vitest";
import { mapRawRowToCleaned, ingestBatch } from "../mapRawRow";

const AWARD_HEADERS = [
  "Timestamp",
  "Nominee Name",
  "Nominee Type",
  "Nominee Country",
  "African Region Connected to Nominee",
  "City / State / Province",
  "Award Subcategory",
  "What education impact has the nominee made",
  "Evidence Link 1",
  "Evidence Link 2",
  "I agree",
];

const awardCtx = {
  formType: "award" as const,
  family: "gold-blue-garnet" as const,
  categorySlug: "best-csr-for-education-nigeria",
  categoryName: "Best CSR for Education - Nigeria",
};

describe("mapRawRowToCleaned", () => {
  it("maps a complete award row into a cleaned record with NESA2026 record_id", () => {
    const { cleaned, warnings } = mapRawRowToCleaned({
      headers: AWARD_HEADERS,
      row: [
        "2026-06-01T08:00:00Z",
        "unicef nigeria",
        "NGO / Foundation",
        "Nigeria",
        "West Africa",
        "Abuja",
        "Scholarships",
        "Funded 5,000 girls' scholarships across 12 states.",
        "https://example.org/unicef",
        "https://news.example/article",
        "Yes",
      ],
      rowNumber: 1,
      context: awardCtx,
    });

    expect(cleaned.record_id).toBe("NESA2026-GBG-CSRNG-20260601-0001");
    expect(cleaned.nominee_name_clean).toBe("Unicef Nigeria");
    expect(cleaned.nominee_country_clean).toBe("Nigeria");
    expect(cleaned.nominee_region_clean).toBe("West Africa");
    expect(cleaned.award_subcategory).toBe("Scholarships");
    expect(cleaned.evidence_status).toBe("Evidence Review Pending");
    expect(cleaned.nomination_status).toBe("New Submission");
    expect(cleaned.duplicate_status).toBe("Not Checked");
    expect(cleaned.verification_status).toBe("Verification Pending");
    expect(cleaned.website_sync_status).toBe("Not Published");
    expect(warnings).toEqual([]);
  });

  it("flags Incomplete when required nominee fields are missing", () => {
    const { cleaned } = mapRawRowToCleaned({
      headers: AWARD_HEADERS,
      row: ["2026-06-01", "", "", "", "", "", "", "", "", "", ""],
      rowNumber: 2,
      context: awardCtx,
    });
    expect(cleaned.nomination_status).toBe("Incomplete");
    expect(cleaned.evidence_status).toBe("Evidence Missing");
  });

  it("downgrades evidence status when only placeholder text is given", () => {
    const { cleaned } = mapRawRowToCleaned({
      headers: AWARD_HEADERS,
      row: [
        "2026-06-01",
        "Jane Doe",
        "Educator",
        "Kenya",
        "East Africa",
        "Nairobi",
        "Scholarships",
        "Impact",
        "Google it",
        "Instagram",
        "Yes",
      ],
      rowNumber: 3,
      context: awardCtx,
    });
    expect(cleaned.evidence_status).toBe("Evidence Missing");
    expect(cleaned.nomination_status).toBe("Evidence Missing");
  });

  it("marks Evidence Weak when only a single real link is provided", () => {
    const { cleaned } = mapRawRowToCleaned({
      headers: AWARD_HEADERS,
      row: [
        "2026-06-01",
        "Jane Doe",
        "Educator",
        "Kenya",
        "East Africa",
        "Nairobi",
        "Scholarships",
        "Impact",
        "https://example.org/profile",
        "",
        "Yes",
      ],
      rowNumber: 4,
      context: awardCtx,
    });
    expect(cleaned.evidence_status).toBe("Evidence Weak");
    expect(cleaned.nomination_status).toBe("Evidence Weak");
  });

  it("warns when declaration is not confirmed", () => {
    const { warnings } = mapRawRowToCleaned({
      headers: AWARD_HEADERS,
      row: [
        "2026-06-01",
        "Jane Doe",
        "Educator",
        "Kenya",
        "East Africa",
        "Nairobi",
        "Scholarships",
        "Impact",
        "https://example.org/a",
        "https://example.org/b",
        "",
      ],
      rowNumber: 5,
      context: awardCtx,
    });
    expect(warnings).toContain("declaration checkbox not confirmed");
  });

  it("builds RMSA2027 record_id and forwards the region name", () => {
    const headers = [
      "Timestamp",
      "Nominee Name",
      "Nominee Country",
      "Evidence Link 1",
      "Evidence Link 2",
      "I agree",
    ];
    const { cleaned } = mapRawRowToCleaned({
      headers,
      row: [
        "2026-06-01",
        "School of Hope",
        "Ghana",
        "https://schoolofhope.example",
        "https://news.example/coverage",
        "Yes",
      ],
      rowNumber: 7,
      context: {
        formType: "rmsa",
        regionSlug: "west-africa",
        regionName: "West Africa",
      },
    });
    expect(cleaned.record_id).toBe("RMSA2027-WAF-20260601-0007");
    expect(cleaned.form_type).toBe("rmsa");
    expect(cleaned.award_group).toBe("rmsa");
    expect(cleaned.nominee_region_clean).toBe("West Africa");
  });

  it("returns warning when headers and row length differ", () => {
    const { warnings } = mapRawRowToCleaned({
      headers: AWARD_HEADERS,
      row: ["2026-06-01"],
      rowNumber: 1,
      context: awardCtx,
    });
    expect(warnings.some((w) => w.includes("≠ headers length"))).toBe(true);
  });

  it("uses unknown-slug throw and surfaces it as a warning, not a thrown error", () => {
    const { cleaned, warnings } = mapRawRowToCleaned({
      headers: AWARD_HEADERS,
      row: [
        "2026-06-01",
        "Jane",
        "",
        "Nigeria",
        "",
        "",
        "",
        "",
        "https://a.example",
        "https://b.example",
        "yes",
      ],
      rowNumber: 1,
      context: { ...awardCtx, categorySlug: "nope" },
    });
    expect(cleaned.record_id).toBe("");
    expect(warnings[0]).toMatch(/record_id build failed/);
  });
});

describe("ingestBatch", () => {
  it("maps multiple rows starting at startingRowNumber and collects warnings", () => {
    const result = ingestBatch({
      headers: AWARD_HEADERS,
      rows: [
        [
          "2026-06-01",
          "UNICEF Nigeria",
          "NGO",
          "Nigeria",
          "West Africa",
          "Abuja",
          "Scholarships",
          "Impact",
          "https://a.example",
          "https://b.example",
          "Yes",
        ],
        [
          "2026-06-01",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
      ],
      startingRowNumber: 10,
      context: awardCtx,
    });

    expect(result.total).toBe(2);
    expect(result.cleaned[0].record_id).toBe("NESA2026-GBG-CSRNG-20260601-0010");
    expect(result.cleaned[1].nomination_status).toBe("Incomplete");
    expect(result.warnings.find((w) => w.rowNumber === 11)).toBeTruthy();
  });
});
