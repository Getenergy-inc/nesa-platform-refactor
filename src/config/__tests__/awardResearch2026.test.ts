import { describe, expect, it } from "vitest";
import { getAwardResearch } from "../awardResearch2026";
import { CATEGORIES } from "../recognition2026/categories";
import { researchCandidateSchema, dedupeResearchCandidates, type ResearchCandidate } from "@/lib/researchStaging";

const candidate: ResearchCandidate = {
  name: "CAMFED", source_file: "research.pdf", source_page: 1, source_row: 1,
  source_section: "NGO", source_region: "West Africa", category_slug: "best-ngo-education-africa",
  pathway_slug: "ngo-girl-child", dedupe_key: "a".repeat(64), raw_text: ["CAMFED"],
  nomination_status: "under_review", publication_status: "unpublished", nrc_verified: false,
  nomination_source: "Research compilation — attached award PDFs", mapping_status: "requires_nrc_mapping", evidence_status: "source_claim_unverified",
};
describe("Confirmed research rules", () => {
  it("opens all categories on 6 September 2026", () => {
    expect(CATEGORIES.every((category) => category.openingDate === "2026-09-06T00:00:00Z")).toBe(true);
  });
  it("retains the confirmed 6 October Icon closing date", () => {
    expect(CATEGORIES.find((category) => category.tier === "africa-education-icon")?.closingDate).toBe("2026-10-06T23:59:59Z");
  });
  it("retains the confirmed 21 November certificate closing date", () => {
    expect(CATEGORIES.filter((category) => category.tier !== "africa-education-icon").every((category) => category.closingDate === "2026-11-21T23:59:59Z")).toBe(true);
  });
  it("has four official STEM pathways, not seven", () => {
    expect(getAwardResearch("best-stem-education-africa")?.pathways.map((p) => p.slug)).toEqual(["stem-school-institution", "stem-ngo-nonprofit", "stem-edtech-digital", "stem-girls-initiative"]);
    expect(getAwardResearch("best-stem-education-africa")?.lenses).toHaveLength(3);
  });
  it("refuses publicly published research candidates", () => {
    expect(researchCandidateSchema.safeParse({ ...candidate, publication_status: "published" }).success).toBe(false);
  });
  it("refuses pre-verified research candidates", () => {
    expect(researchCandidateSchema.safeParse({ ...candidate, nrc_verified: true }).success).toBe(false);
  });
  it("deduplicates exact normalized names within a category and pathway", () => {
    expect(dedupeResearchCandidates([candidate, { ...candidate, name: " camfed " }])).toHaveLength(1);
  });
  it("retains legitimate appearances across categories", () => {
    expect(dedupeResearchCandidates([candidate, { ...candidate, category_slug: "best-csr-education-africa" }])).toHaveLength(2);
  });
  it("retains separate subcategory appearances", () => {
    expect(dedupeResearchCandidates([candidate, { ...candidate, pathway_slug: "ngo-basic-primary" }])).toHaveLength(2);
  });
});