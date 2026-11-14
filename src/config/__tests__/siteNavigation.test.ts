import { describe, it, expect } from "vitest";
import { SITE_NAV, MOBILE_SITE_NAV, SIGN_IN_WORKSPACES, UTILITY_NAV } from "@/config/siteNavigation";
import { PROGRAMME_END_DATE, PROGRAMME_END_LONG_LABEL } from "@/config/programme";

describe("2026–2027 navigation", () => {
  it("shows the seven approved main labels and direct nominee access", () => {
    expect(SITE_NAV.map(g => g.label)).toEqual(["About", "Recognition", "Nominees", "Impact", "Media", "Get Involved", "Contact"]);
    expect(MOBILE_SITE_NAV.map(g => g.label)).toEqual(SITE_NAV.map(g => g.label));
    expect(SITE_NAV.find(g => g.label === "Recognition")?.children?.some(c => c.href === "/nominees")).toBe(true);
  });
  it("uses the nine approved utility destinations", () => {
    expect(UTILITY_NAV.map(g => g.label)).toEqual([
      "How Recognition Works", "EduAid-Africa", "Support a Special-Needs School",
      "Become a Sponsor", "Partner With Us", "Join a Webinar", "Listen to the Podcast",
      "Watch NESA-Africa TV", "Volunteer",
    ]);
    expect(UTILITY_NAV.find(g => g.label === "How Recognition Works")?.href).toBe("/about/how-recognition-works");
  });
  it("uses NRRC presentation routes without changing workspace access", () => {
    expect(SIGN_IN_WORKSPACES.map(g => g.href)).toEqual([
      "/nominee-portal", "/nrrc", "/judges", "/login?next=%2Fdashboard%2Fvolunteer",
      "/login?next=%2Folc%2Fdashboard", "/login?next=%2Fadmin",
    ]);
  });
  it("has no voting, AGC, ticket, table or specialist-recruitment links", () => {
    const all = [...SITE_NAV.flatMap((g) => [g, ...(g.children ?? [])]), ...UTILITY_NAV, ...SIGN_IN_WORKSPACES];
    for (const i of all) expect(i.href).not.toMatch(/vote|agc|ticket|table|wallet|judgeapply|nrc\/apply/i);
  });
});

describe("online programme date", () => {
  it("is Sunday 13 December 2026", () => {
    expect(PROGRAMME_END_DATE).toBe("2026-12-13");
    expect(PROGRAMME_END_LONG_LABEL).toBe("Sunday 13 December 2026 · Online");
  });
});
