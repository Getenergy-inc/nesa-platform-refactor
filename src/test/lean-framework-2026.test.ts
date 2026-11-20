import { describe, expect, it } from "vitest";
import { MASTER_AWARDS, MASTER_COUNTS } from "@/config/awardMaster2026";
import { PROGRAMME_PUBLIC_NOTICE } from "@/config/programme";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { REFACTOR_REDIRECTS_2026 } from "@/config/refactorRedirects2026";
import { COUNTRY_MAP_APPROVED, SNS_CATEGORIES, SNS_MAP_DRAFT_NOTE, VOTING_OPEN, VOTING_PENDING_LABEL } from "@/config/schoolSupport";

describe("approved lean framework", () => {
  it("presents exactly four tiers, 22 main awards and 90 subcategories", () => {
    expect(MASTER_COUNTS).toEqual({ tiers: 4, categories: 22, subcategories: 90 });
    expect(new Set(MASTER_AWARDS.map((award) => award.tier)).size).toBe(4);
  });

  it("keeps recognition process and ticket destinations on the approved routes", () => {
    expect(PUBLIC_ACTIONS_2026.recognitionProcess.href).toBe("/how-it-works");
    for (const from of ["/gala", "/events/tickets"]) {
      expect(REFACTOR_REDIRECTS_2026.find((rule) => rule.from === from)?.to).toBe("/programme/2026");
    }
  });

  it("keeps the online programme free of physical attendance and tickets", () => {
    expect(PROGRAMME_PUBLIC_NOTICE).toContain("Monday 28 December 2026");
    expect(PROGRAMME_PUBLIC_NOTICE).not.toContain("Lagos");
    expect(PROGRAMME_PUBLIC_NOTICE).not.toContain("ticket");
  });

  it("lists 14 support categories and keeps regional selection closed", () => {
    expect(SNS_CATEGORIES).toHaveLength(14);
    expect(VOTING_OPEN).toBe(false);
    expect(VOTING_PENDING_LABEL).toBe("Regional school participation opens in September 2027, subject to verification and approval");
    expect(VOTING_PENDING_LABEL).not.toMatch(/voting/i);
  });

  it("fails closed on unapproved country mapping with the exact governance notice", () => {
    expect(COUNTRY_MAP_APPROVED).toBe(false);
    expect(SNS_MAP_DRAFT_NOTE).toBe("Regional country mapping is under governance review and will be published only after written approval.");
  });
});
