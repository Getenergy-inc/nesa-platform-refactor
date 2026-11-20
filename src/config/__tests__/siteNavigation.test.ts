import { describe, it, expect } from "vitest";
import { SITE_NAV, MOBILE_SITE_NAV, SIGN_IN_WORKSPACES, MOBILE_QUICK_ACTIONS } from "@/config/siteNavigation";
import { PROGRAMME_END_DATE, PROGRAMME_END_LONG_LABEL } from "@/config/programme";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";

describe("Website Content v2 navigation", () => {
  it("uses the same six approved headings in the same order on desktop and phone", () => {
    const labels = ["Awards", "Nominees", "Support a School", "Online Programme", "About", "Get Involved"];
    expect(SITE_NAV.map(g => g.label)).toEqual(labels);
    expect(MOBILE_SITE_NAV.map(g => g.label)).toEqual(labels);
    expect(SITE_NAV.find(g => g.label === "Get Involved")?.href).toBe("/get-involved");
  });

  it("lists the four tiers, recognition process and timeline under Awards", () => {
    expect(SITE_NAV[0].children).toEqual([
      { label: "How recognition works", href: "/awards#how" },
      { label: "Tier 1 Africa Education Icon", href: "/awards/africa-education-icon" },
      { label: "Tier 2 Influencers Education Impact", href: "/awards/influencer-education-impact" },
      { label: "Tier 3 Platinum Recognition", href: "/awards/platinum-recognition" },
      { label: "Tier 4 Gold–Blue Garnet", href: "/awards/gold-blue-garnet" },
      { label: "Timeline", href: "/awards#timeline" },
    ]);
  });

  it("uses the consolidated About anchors and live online-programme page", () => {
    expect(SITE_NAV.find(g => g.label === "About")?.children).toEqual([
      { label: "SCEF and the five arms", href: "/about#scef" },
      { label: "Governance", href: "/about#governance" },
      { label: "Board of Advisors", href: "/about#advisors" },
      { label: "Partners", href: "/about#partners" },
    ]);
    expect(SITE_NAV.find(g => g.label === "Online Programme")?.href).toBe("/programme/2026");
  });

  it("keeps legacy pages and retired features out of public navigation", () => {
    const hrefs = MOBILE_SITE_NAV.flatMap(g => [g.href, ...(g.children ?? []).map(c => c.href)]);
    for (const h of hrefs) {
      expect(h).not.toMatch(/2027|2028|vision-2035|gallery|^\/nrc(\/|$)/);
      expect(h).not.toMatch(/vote|agc|ticket|table|wallet|shop|judgeapply|nrc\/apply/i);
    }
  });

  it("uses exactly two phone actions and sends Nominate to the official external form", () => {
    expect(MOBILE_QUICK_ACTIONS.map(item => item.label)).toEqual(["Nominate", "Support a School"]);
    expect(MOBILE_QUICK_ACTIONS[0].href).toBe(PUBLIC_ACTIONS_2026.nominate.href);
    expect(MOBILE_QUICK_ACTIONS[0].href).toMatch(/^https:\/\//);
    expect(MOBILE_QUICK_ACTIONS[1].href).toBe("/impact/special-needs-schools");
  });

  it("keeps sign-in workspace choices unchanged and never grants access through navigation", () => {
    expect(SIGN_IN_WORKSPACES.map(g => g.href)).toEqual([
      "/nominee-portal", "/nrrc", "/judges", "/login?next=%2Fdashboard%2Fvolunteer",
      "/login?next=%2Folc%2Fdashboard", "/login?next=%2Fadmin",
    ]);
  });
});

describe("online programme date", () => {
  it("is Monday 28 December 2026", () => {
    expect(PROGRAMME_END_DATE).toBe("2026-12-28");
    expect(PROGRAMME_END_LONG_LABEL).toBe("Monday 28 December 2026 · Online");
  });
});
