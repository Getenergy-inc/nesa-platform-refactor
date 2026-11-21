import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ParticipationInterestForm } from "@/components/school-support/ParticipationInterestForm";
import { INTEREST_FORMS, type InterestKind } from "@/config/participationForms2027";
import { SCHOOL_BALLOT_RULES, VOTING_OPEN, COUNTRY_MAP_APPROVED, canPublishSupportSchool } from "@/config/schoolSupport";
import { WORLD_COUNTRIES } from "@/config/worldCountries";
import { submitContactEnquiry } from "@/services/contactEnquiries";

vi.mock("@/services/contactEnquiries", () => ({ submitContactEnquiry: vi.fn().mockResolvedValue("NESA-2026-TEST-C") }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("Message C participation persistence", () => {
  const destinations: Record<InterestKind, string> = { involved: "School support", school: "School support", reminder: "School support", scholarships: "School support", offers: "School support", edutourism: "General enquiry", academy: "General enquiry", items: "Donation" };
  for (const kind of Object.keys(destinations) as InterestKind[]) it(`saves ${kind} through its existing Contact topic`, async () => {
    render(<ParticipationInterestForm kind={kind} />);
    const form = screen.getByRole("form");
    fireEvent.change(form.querySelector('[name="name"]') as HTMLInputElement, { target: { value: "Adult Test Contact" } });
    fireEvent.change(form.querySelector('[name="email"]') as HTMLInputElement, { target: { value: "message-c@example.org" } });
    fireEvent.change(form.querySelector('[name="country"]') as HTMLSelectElement, { target: { value: "Nigeria" } });
    const interest = form.querySelector('[name="interests"]');
    if (interest) fireEvent.click(interest);
    fireEvent.click(form.querySelector('[name="consent"]') as HTMLInputElement);
    fireEvent.submit(form);
    await waitFor(() => expect(submitContactEnquiry).toHaveBeenCalledWith(expect.objectContaining({ enquiry_type: destinations[kind], name: "Adult Test Contact", email: "message-c@example.org", country: "Nigeria", subject: INTEREST_FORMS[kind].name, consent: true })));
  });
});

describe("Message C school rules", () => {
  it("retains closed voting", () => expect(VOTING_OPEN).toBe(false));
  it("limits the announced ballot to seven schools", () => expect(SCHOOL_BALLOT_RULES.maximumSchools).toBe(7));
  it("permits one entitlement per person per ballot", () => expect(SCHOOL_BALLOT_RULES.votesPerPersonPerBallot).toBe(1));
  it("retains the unpublished country mapping", () => expect(COUNTRY_MAP_APPROVED).toBe(false));
  it("requires both verified status and publication approval", () => {
    expect(canPublishSupportSchool({ verificationStatus: "verified", publicationApproved: true })).toBe(true);
    expect(canPublishSupportSchool({ verificationStatus: "verified", publicationApproved: false })).toBe(false);
    expect(canPublishSupportSchool({ verificationStatus: "nominated", publicationApproved: true })).toBe(false);
  });
  it("offers worldwide countries rather than only African countries", () => {
    expect(WORLD_COUNTRIES).toContain("Nigeria");
    expect(WORLD_COUNTRIES).toContain("Canada");
    expect(WORLD_COUNTRIES).toContain("Japan");
    expect(WORLD_COUNTRIES).toHaveLength(249);
  });
  it("does not collect child identities or medical details", () => {
    for (const config of Object.values(INTEREST_FORMS)) expect(config.fields.map(field => field.name).join(" ")).not.toMatch(/child|photo|diagnos|medical/i);
  });
  it("does not collect payment credentials", () => {
    for (const config of Object.values(INTEREST_FORMS)) expect(config.fields.map(field => field.name).join(" ")).not.toMatch(/card|cvv|password|bankLogin|pin|otp/i);
  });
});