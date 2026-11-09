import { describe, it, expect } from "vitest";
import { canPublishSupportSchool, SCHOOL_SUPPORT_ACTIONS } from "@/config/schoolSupport";
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
});