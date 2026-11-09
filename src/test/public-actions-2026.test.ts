import { describe, expect, it } from "vitest";
import { SOCIAL_LINKS, SOCIAL_PROFILE_URLS } from "@/config/socialLinks";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { OFFICIAL_NOMINATION_FORM_URL } from "@/config/nomination/officialGoogleForm";
import { NOMINATION_WINDOW_LABEL } from "@/config/nominationWindows2026";
import { REFACTOR_REDIRECTS_2026 } from "@/config/refactorRedirects2026";
import { AWARD_TIERS_TOTALS } from "@/config/awardTiers2026";
import { SITE_STATS_FALLBACK } from "@/config/siteStats";

describe("2026 public actions", () => {
  it("uses the official Google Form as the only nomination destination", () => {
    expect(PUBLIC_ACTIONS_2026.nominate.href).toBe(OFFICIAL_NOMINATION_FORM_URL);
    expect(PUBLIC_ACTIONS_2026.nominate.external).toBe(true);
  });

  it("publishes the approved nomination and certificate window", () => {
    expect(NOMINATION_WINDOW_LABEL).toBe("9 November 2026 – 31 March 2027");
  });

  it("keeps every public taxonomy source at 4 tiers, 22 categories and 90 subcategories", () => {
    expect(AWARD_TIERS_TOTALS).toEqual({ tiers: 4, categories: 22, subcategories: 90 });
    expect(SITE_STATS_FALLBACK.tiers).toBe(4);
    expect(SITE_STATS_FALLBACK.categories).toBe(22);
    expect(SITE_STATS_FALLBACK.subcategories).toBe(90);
  });

  it("keeps public actions away from tickets, voting, wallet and commerce", () => {
    const hrefs = Object.values(PUBLIC_ACTIONS_2026).map((action) => action.href);
    expect(hrefs).not.toContain("/tickets");
    expect(hrefs).not.toContain("/vote");
    expect(hrefs).not.toContain("/shop");
    expect(hrefs).not.toContain("/wallet");
  });

  it("redirects legacy Gala destinations to the online programme", () => {
    for (const from of ["/gala", "/media/gala", "/gala-2026", "/events/gala"]) {
      expect(REFACTOR_REDIRECTS_2026.find((redirect) => redirect.from === from)?.to).toBe("/programme-2026");
    }
  });
});

describe("canonical NESA Follow links", () => {
  it("contains exactly five unique HTTPS destinations", () => {
    expect(SOCIAL_LINKS).toHaveLength(5);
    expect(new Set(SOCIAL_LINKS.map((link) => link.href)).size).toBe(5);
    expect(SOCIAL_LINKS.every((link) => link.href.startsWith("https://"))).toBe(true);
  });

  it("keeps the approved existing footer destinations", () => {
    expect(SOCIAL_PROFILE_URLS).toEqual({
      facebook: "https://facebook.com/nesaafrica",
      instagram: "https://instagram.com/nesaafrica",
      linkedin: "https://linkedin.com/company/nesa-africa",
      twitter: "https://twitter.com/nesaafrica",
      youtube: "https://www.youtube.com/@Nesa.africaTV",
    });
  });

  it("does not confuse social sharing with profile Follow destinations", () => {
    expect(SOCIAL_LINKS.every((link) => !/share|sharer|intent/.test(link.href))).toBe(true);
  });
});
