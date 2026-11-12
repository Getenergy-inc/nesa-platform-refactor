import { describe, it, expect } from "vitest";
import {
  buildSchoolParticipationHref,
  canPublishSupportSchool,
  getSchoolVotingLabel,
  getSnsFormUrl,
  SCHOOL_SUPPORT_ACTIONS,
  SCHOOL_SUPPORT_PARTICIPATION,
  SCHOOL_SUPPORT_PARTICIPATE_ROUTE,
  SNS_FORM_URL,
  VOTING_OPEN,
  VOTING_PENDING_LABEL,
} from "@/config/schoolSupport";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";

describe("school-support publication integrity", () => {
  it("excludes verified schools without explicit publication approval", () => {
    expect(canPublishSupportSchool({ verificationStatus: "verified" })).toBe(false);
    expect(canPublishSupportSchool({ verificationStatus: "verified", publicationApproved: false })).toBe(false);
  });
  it("excludes nominated schools even if publication approval is present", () => {
    expect(canPublishSupportSchool({ verificationStatus: "nominated", publicationApproved: true })).toBe(false);
  });
  it("allows only verified and explicitly approved schools", () => {
    expect(canPublishSupportSchool({ verificationStatus: "verified", publicationApproved: true })).toBe(true);
    expect(canPublishSupportSchool({})).toBe(false);
  });
  it("keeps school intake independent of the award nomination form", () => {
    expect(SCHOOL_SUPPORT_ACTIONS.nominate.href).toBe("/impact/nominate-school");
    expect(SCHOOL_SUPPORT_ACTIONS.nominate.href).not.toBe(PUBLIC_ACTIONS_2026.nominate.href);
    expect(SCHOOL_SUPPORT_ACTIONS.support.href).toBe("/impact/special-needs-schools");
  });

  it("keeps voting closed with the exact pending label until the config flag is enabled", () => {
    expect(VOTING_OPEN).toBe(false);
    expect(getSchoolVotingLabel()).toBe("Voting Opens in September 2027, Subject to Verification and Approval");
    expect(getSchoolVotingLabel()).toBe(VOTING_PENDING_LABEL);
    expect(getSchoolVotingLabel(true)).toBe("Vote for a School in Your Region");
  });

  it("provides exactly eight participation choices and a dedicated NESA route", () => {
    expect(SCHOOL_SUPPORT_PARTICIPATION.map((option) => option.label)).toEqual([
      "Nominate a school",
      "Vote for a verified school",
      "Donate",
      "Sponsor a school",
      "Support a region",
      "Become a partner",
      "Volunteer professional services",
      "Donate equipment or materials",
    ]);
    expect(buildSchoolParticipationHref("equipment")).toBe(`${SCHOOL_SUPPORT_PARTICIPATE_ROUTE}?participation=equipment`);
  });

  it("fails closed until an authorised HTTPS Google Form URL is supplied", () => {
    expect(SNS_FORM_URL).toBe("");
    expect(getSnsFormUrl()).toBeNull();
    expect(getSnsFormUrl("https://example.com/form")).toBeNull();
    expect(getSnsFormUrl("http://forms.gle/example")).toBeNull();
    expect(getSnsFormUrl("https://forms.gle/example")).toBe("https://forms.gle/example");
  });
});