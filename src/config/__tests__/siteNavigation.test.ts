import { describe, it, expect } from "vitest";
import { SITE_NAV, MOBILE_SITE_NAV, SIGN_IN_WORKSPACES, UTILITY_NAV } from "@/config/siteNavigation";
import { NOMINATE_CTA } from "@/config/campaignPhase";
import { PROGRAMME_END_DATE, PROGRAMME_END_LONG_LABEL } from "@/config/programme";

describe("2026–2027 navigation", () => {
  it("preserves nominee access under recognition on desktop and directly on mobile", () => {
    expect(SITE_NAV.some(g => g.href === "/nominees")).toBe(false);
    expect(SITE_NAV.find(g => g.href === "/categories")?.children?.some(c => c.href === "/nominees")).toBe(true);
    expect(MOBILE_SITE_NAV.some(g => g.href === "/nominees")).toBe(true);
  });
  it("keeps all utility nomination links on the authorised form", () => {
    expect(UTILITY_NAV.map(g => g.href)).toEqual(["/login", NOMINATE_CTA.href, "/contact", "/nrc", "/judges"]);
    expect(UTILITY_NAV.find(g => g.href === NOMINATE_CTA.href)?.external).toBe(true);
  });
  it("sends merchandise enquiries to Contact without reopening the retired shop", () => {
    expect(UTILITY_NAV.find(g => g.analyticsId === "util_merchandise")?.href).toBe("/contact");
  });
  it("keeps the top-bar research and judges links on their existing guarded routes", () => {
    expect(UTILITY_NAV.find(g => g.analyticsId === "util_nrrc")?.href).toBe("/nrc");
    expect(UTILITY_NAV.find(g => g.analyticsId === "util_judges")?.href).toBe("/judges");
  });
  it("preserves existing NRRC and judges routes without creating migrated routes", () => {
    expect(SIGN_IN_WORKSPACES.map(g => g.href)).toEqual([
      "/nominee-portal", "/nrc", "/judges", "/login?next=%2Fdashboard%2Fvolunteer",
      "/login?next=%2Folc%2Fdashboard", "/login?next=%2Fadmin",
    ]);
  });
  it("has no voting, AGC, ticket or table links anywhere", () => {
    const all = [...SITE_NAV.flatMap((g) => [g, ...(g.children ?? [])]), ...UTILITY_NAV, ...SIGN_IN_WORKSPACES];
    for (const i of all) expect(i.href).not.toMatch(/vote|agc|ticket|table|wallet/i);
  });
});

describe("online programme date", () => {
  it("is Monday 28 December 2026", () => {
    expect(PROGRAMME_END_DATE).toBe("2026-12-28");
    expect(PROGRAMME_END_LONG_LABEL).toBe("Monday, 28 December 2026 · Online");
  });
});
