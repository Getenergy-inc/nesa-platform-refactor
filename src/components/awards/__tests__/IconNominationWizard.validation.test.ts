import { describe, it, expect } from "vitest";
import { validateStep } from "../IconNominationWizard";

// Base state matches INITIAL in the component (all empty / false).
const empty = {
  pathway: "",
  classification: "",
  full_name: "",
  professional_title: "",
  organisation: "",
  country_nationality: "",
  country_residence: "",
  country_impact: "",
  email: "",
  telephone: "",
  website: "",
  linkedin: "",
  photo_url: "",
  q_why: "",
  q_lifetime: "",
  q_programmes: "",
  q_beneficiaries: "",
  q_regions: "",
  q_sustainability: "",
  edi_lifetime_impact: "",
  edi_scale_reach: "",
  edi_inclusion_equity: "",
  edi_innovation: "",
  edi_sustainability: "",
  edi_leadership: "",
  edi_evidence_quality: "",
  edi_continental_relevance: "",
  evidence_links: "",
  nm_full_name: "",
  nm_email: "",
  nm_telephone: "",
  nm_country: "",
  nm_organisation: "",
  nm_relationship: "",
  decl_0: false,
  decl_1: false,
  decl_2: false,
  decl_3: false,
  decl_4: false,
} as any;

const make = (overrides: Record<string, unknown> = {}) => ({ ...empty, ...overrides });

describe("IconNominationWizard.validateStep", () => {
  describe("Step 0 — Recognition Pathway", () => {
    it("fails when pathway is empty", () => {
      expect(validateStep(0, make())).toMatch(/pathway/i);
    });
    it("passes when a pathway slug is chosen", () => {
      expect(validateStep(0, make({ pathway: "technical-educator-icon" }))).toBeNull();
    });
  });

  describe("Step 1 — Classification", () => {
    it("fails when classification is empty", () => {
      expect(validateStep(1, make())).toMatch(/classification/i);
    });
    it("passes when a classification is chosen", () => {
      expect(validateStep(1, make({ classification: "african-in-africa" }))).toBeNull();
    });
  });

  describe("Step 2 — Nominee Information", () => {
    const required = [
      "full_name",
      "professional_title",
      "country_nationality",
      "country_residence",
      "country_impact",
    ];
    const filled = {
      full_name: "Ada Lovelace",
      professional_title: "Educator",
      country_nationality: "Nigeria",
      country_residence: "Nigeria",
      country_impact: "Nigeria",
    };

    it.each(required)("fails when required field %s is missing", (field) => {
      const s = make({ ...filled, [field]: "" });
      expect(validateStep(2, s)).not.toBeNull();
    });

    it("passes when all required fields are filled and optional fields are omitted", () => {
      expect(validateStep(2, make(filled))).toBeNull();
    });

    it("accepts whitespace-only optional fields (treated as empty)", () => {
      expect(
        validateStep(2, make({ ...filled, email: "   ", website: "  ", linkedin: "", photo_url: "" })),
      ).toBeNull();
    });

    it("rejects malformed optional email when provided", () => {
      expect(validateStep(2, make({ ...filled, email: "not-an-email" }))).toMatch(/email/i);
    });
    it("accepts valid optional email", () => {
      expect(validateStep(2, make({ ...filled, email: "a@b.co" }))).toBeNull();
    });

    it.each(["website", "linkedin", "photo_url"])(
      "rejects malformed optional URL field %s",
      (field) => {
        expect(validateStep(2, make({ ...filled, [field]: "example.com" }))).not.toBeNull();
      },
    );
    it.each(["website", "linkedin", "photo_url"])("accepts valid https URL for %s", (field) => {
      expect(validateStep(2, make({ ...filled, [field]: "https://example.com/x" }))).toBeNull();
    });

    it("keeps telephone strictly optional", () => {
      expect(validateStep(2, make({ ...filled, telephone: "" }))).toBeNull();
    });
  });

  describe("Step 3 — Nomination Details", () => {
    const keys = ["q_why", "q_lifetime", "q_programmes", "q_beneficiaries", "q_regions", "q_sustainability"];
    const full = Object.fromEntries(keys.map((k) => [k, "answer"]));

    it.each(keys)("fails when %s is empty", (k) => {
      expect(validateStep(3, make({ ...full, [k]: "" }))).not.toBeNull();
    });
    it.each(keys)("fails when %s is whitespace only", (k) => {
      expect(validateStep(3, make({ ...full, [k]: "   " }))).not.toBeNull();
    });
    it("passes when all six questions are answered", () => {
      expect(validateStep(3, make(full))).toBeNull();
    });
  });

  describe("Step 4 — EDI Matrix", () => {
    const ediKeys = [
      "edi_lifetime_impact",
      "edi_scale_reach",
      "edi_inclusion_equity",
      "edi_innovation",
      "edi_sustainability",
      "edi_leadership",
      "edi_evidence_quality",
      "edi_continental_relevance",
    ];
    const full = Object.fromEntries(ediKeys.map((k) => [k, "strong"]));

    it.each(ediKeys)("fails when EDI dimension %s is empty", (k) => {
      expect(validateStep(4, make({ ...full, [k]: "" }))).not.toBeNull();
    });
    it("passes when every EDI dimension is filled", () => {
      expect(validateStep(4, make(full))).toBeNull();
    });
  });

  describe("Step 5 — Evidence", () => {
    it("fails with no evidence", () => {
      expect(validateStep(5, make())).toMatch(/two independent evidence/i);
    });
    it("fails with only one evidence line", () => {
      expect(validateStep(5, make({ evidence_links: "https://a.com" }))).not.toBeNull();
    });
    it("passes with two newline-separated entries", () => {
      expect(
        validateStep(5, make({ evidence_links: "https://a.com\nhttps://b.com" })),
      ).toBeNull();
    });
    it("passes with two comma-separated entries", () => {
      expect(
        validateStep(5, make({ evidence_links: "https://a.com, https://b.com" })),
      ).toBeNull();
    });
    it("ignores blank lines when counting", () => {
      expect(validateStep(5, make({ evidence_links: "https://a.com\n\n   \n" }))).not.toBeNull();
    });
  });

  describe("Step 6 — Nominator Information", () => {
    const filled = {
      nm_full_name: "Jane Doe",
      nm_email: "jane@example.com",
      nm_telephone: "+2348000000000",
      nm_country: "Nigeria",
      nm_relationship: "Colleague",
    };
    it("passes when all required nominator fields are provided (org optional)", () => {
      expect(validateStep(6, make(filled))).toBeNull();
    });
    it("keeps nm_organisation optional", () => {
      expect(validateStep(6, make({ ...filled, nm_organisation: "" }))).toBeNull();
    });
    it.each(["nm_full_name", "nm_telephone", "nm_country", "nm_relationship"])(
      "fails when required %s is missing",
      (field) => {
        expect(validateStep(6, make({ ...filled, [field]: "" }))).not.toBeNull();
      },
    );
    it("rejects invalid nominator email", () => {
      expect(validateStep(6, make({ ...filled, nm_email: "bad" }))).toMatch(/email/i);
    });
    it("rejects empty nominator email", () => {
      expect(validateStep(6, make({ ...filled, nm_email: "" }))).toMatch(/email/i);
    });
  });

  describe("Step 7 — Declarations", () => {
    it("fails when any declaration is unchecked", () => {
      const partial = { decl_0: true, decl_1: true, decl_2: true, decl_3: true, decl_4: false };
      expect(validateStep(7, make(partial))).toMatch(/declaration/i);
    });
    it("passes when all five declarations are accepted", () => {
      const all = { decl_0: true, decl_1: true, decl_2: true, decl_3: true, decl_4: true };
      expect(validateStep(7, make(all))).toBeNull();
    });
  });

  describe("Step 8 — Review & Submit", () => {
    it("has no additional per-step validation (submission re-validates 0..7)", () => {
      expect(validateStep(8, make())).toBeNull();
    });
  });
});
