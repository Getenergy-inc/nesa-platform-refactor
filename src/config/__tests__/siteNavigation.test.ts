import { describe, it, expect } from "vitest";
import { SITE_NAV, MOBILE_SITE_NAV, SIGN_IN_WORKSPACES } from "@/config/siteNavigation";
import { PROGRAMME_END_DATE, PROGRAMME_END_LONG_LABEL } from "@/config/programme";

describe("2026–2027 navigation", () => {
  it("lists exactly two Impact items on desktop and mobile, with the heading linking to /impact", () => {
    for (const nav of [SITE_NAV, MOBILE_SITE_NAV]) {
      const impact = nav.find(g => g.label === "Impact");
      expect(impact?.href).toBe("/impact");
      expect(impact?.headingLink).toBe(true);
      expect(impact?.children?.map(c => [c.label, c.href])).toEqual([
        ["Support a Special-Needs School", "/support-a-special-needs-school"],
        ["Afri-EduTourism", "/afri-edutourism"],
      ]);
    }
  });
  it("uses the approved headings and keeps Nominee Directory inside Recognition on mobile", () => {
    expect(SITE_NAV.map(g => g.label)).toEqual(["About", "Recognition", "Impact", "Media", "Get Involved", "Contact"]);
    expect(MOBILE_SITE_NAV.map(g => g.label)).toEqual(["About", "Recognition", "Impact", "Media", "Get Involved", "Contact"]);
    expect(SITE_NAV.find(g => g.label === "Get Involved")?.href).toBe("/get-involved");
    expect(MOBILE_SITE_NAV.find(g => g.label === "Recognition")?.children?.some(c => c.label === "Nominee Directory" && c.href === "/nominees")).toBe(true);
  });
  it("uses each panel heading as its page link without duplicate overview items", () => {
    for (const item of SITE_NAV.filter(g => g.children || g.sections)) {
      expect(item.headingLink).toBe(true);
      expect(item.children?.some(c => c.href === item.href && c.label !== "Media Hub") ?? false).toBe(false);
      expect(item.children?.some(c => /overview/i.test(c.label)) ?? false).toBe(false);
    }
    const recognition = SITE_NAV.find(g => g.label === "Recognition")?.children ?? [];
    expect(recognition.some(c => c.label === "Certificates of Recognition")).toBe(false);
    const aboutItems = SITE_NAV.find(g => g.label === "About")?.sections?.flatMap(s => s.items) ?? [];
    expect(aboutItems.some(c => c.label === "Timeline")).toBe(false);
  });
  it("links the new recognition pages and renamed media items", () => {
    const about = SITE_NAV.find(g => g.label === "About")?.sections?.flatMap(s => s.items) ?? [];
    expect(about.find(c => c.label === "How Recognition Works")?.href).toBe("/how-it-works");
    expect(about.find(c => c.label === "Research and Judging")?.href).toBe("/research-and-judging");
    expect(about.find(c => c.label === "2026 Online Programme")?.href).toBe("/programme/2026");
    const media = (SITE_NAV.find(g => g.label === "Media")?.children ?? []).map(c => c.label);
    expect(media).toEqual(["Media Hub", "Webinars", "Africa Education Enablers Podcast", "NESA-Africa TV", "Documentaries and Interviews", "EduAid-Africa E-Journal", "Press and News"]);
    expect(SITE_NAV.find(g => g.label === "Media")?.children?.find(c => c.label === "Documentaries and Interviews")?.href).toBe("/media#documentaries");
  });
  it("keeps legacy pages out of the menus", () => {
    const hrefs = MOBILE_SITE_NAV.flatMap(g => [g.href, ...(g.children ?? []).map(c => c.href)]);
    for (const h of hrefs) expect(h).not.toMatch(/2027|2028|vision-2035|gallery|^\/nrc(\/|$)/);
  });
  it("routes merchandise enquiries through Contact after Donate, without a duplicate Contact Us item", () => {
    for (const navigation of [SITE_NAV, MOBILE_SITE_NAV]) {
      const children = navigation.find(item => item.label === "Get Involved")?.children ?? [];
      const donateIndex = children.findIndex(item => item.label === "Donate");
      expect(donateIndex).toBeGreaterThanOrEqual(0);
      expect(children.slice(donateIndex)).toEqual([
        { label: "Donate", href: "/donate" },
        { label: "Buy Merchandise", href: "/contact?subject=merchandise" },
      ]);
      expect(children.some(item => item.label === "Contact Us")).toBe(false);
    }
  });
  it("uses NRRC presentation routes without changing workspace access", () => {
    expect(SIGN_IN_WORKSPACES.map(g => g.href)).toEqual([
      "/nominee-portal", "/nrrc", "/judges", "/login?next=%2Fdashboard%2Fvolunteer",
      "/login?next=%2Folc%2Fdashboard", "/login?next=%2Fadmin",
    ]);
  });
  it("has no voting, AGC, ticket, table or specialist-recruitment links", () => {
    const all = [...SITE_NAV.flatMap((g) => [g, ...(g.children ?? [])]), ...SIGN_IN_WORKSPACES];
    for (const i of all) expect(i.href).not.toMatch(/vote|agc|ticket|table|wallet|judgeapply|nrc\/apply/i);
  });
});

describe("online programme date", () => {
  it("is Monday 28 December 2026", () => {
    expect(PROGRAMME_END_DATE).toBe("2026-12-28");
    expect(PROGRAMME_END_LONG_LABEL).toBe("Monday 28 December 2026 · Online");
  });
});
