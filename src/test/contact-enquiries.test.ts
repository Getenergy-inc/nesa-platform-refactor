import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn(async () => ({ error: null }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: vi.fn(() => ({ insert }) ) } }));

import { CONTACT_ENQUIRY_TYPES, CONTACT_SUBJECT_PREFILLS } from "@/config/contactEnquiries";
import { makeContactReference, submitContactEnquiry } from "@/services/contactEnquiries";

const valid = {
  name: "Test Sender",
  email: "sender@example.org",
  enquiry_type: "Merchandise" as const,
  country: "Nigeria",
  preferred_contact: "Email" as const,
  subject: "Merchandise enquiry",
  message: "Please send the approved merchandise enquiry process.",
  consent: true,
};

describe("Contact and Help enquiries", () => {
  beforeEach(() => insert.mockClear());

  it("contains exactly the 20 approved enquiry types", () => {
    expect(CONTACT_ENQUIRY_TYPES).toHaveLength(20);
    expect(CONTACT_ENQUIRY_TYPES).toContain("Merchandise");
    expect(CONTACT_ENQUIRY_TYPES).toContain("Special-needs school support");
    expect(CONTACT_ENQUIRY_TYPES).toContain("Safeguarding concern");
    expect(CONTACT_ENQUIRY_TYPES).toContain("Judges Arena support");
  });

  it("preselects Merchandise and maps Afri-EduTourism to General enquiry", () => {
    expect(CONTACT_SUBJECT_PREFILLS.merchandise).toBe("Merchandise");
    expect(CONTACT_SUBJECT_PREFILLS["afri-edutourism"]).toBe("General enquiry");
  });

  it("requires explicit consent before saving", async () => {
    await expect(submitContactEnquiry({ ...valid, consent: false })).rejects.toThrow("confirm");
    expect(insert).not.toHaveBeenCalled();
  });

  it("saves a consented enquiry and returns its secure case reference", async () => {
    const reference = await submitContactEnquiry(valid);
    expect(reference).toMatch(/^NESA-\d{4}-[A-F0-9]{10}$/);
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ reference, enquiry_type: "Merchandise", status: "new", consent: true }));
  });

  it("uses an unguessable reference format with the supplied year", () => {
    expect(makeContactReference(new Date("2026-11-15T00:00:00Z"))).toMatch(/^NESA-2026-[A-F0-9]{10}$/);
  });
});
