// Guards on the shared navigation configuration.
// Enforces the 6-group information architecture and rejects duplicate
// destinations across unrelated top-level sections.

import { describe, it, expect } from "vitest";
import { SITE_NAV, type NavItem } from "@/config/siteNavigation";

const EXPECTED_TOP_LEVEL = [
  "About",
  "Awards",
  "Education Enablers",
  "Impact Programmes",
  "Media & Events",
  "Get Involved",
];

function collectLeaves(item: NavItem): Array<{ href: string; parent: string; section?: string }> {
  const out: Array<{ href: string; parent: string; section?: string }> = [];
  if (item.children) {
    for (const c of item.children) out.push({ href: c.href, parent: item.label });
  }
  if (item.sections) {
    for (const s of item.sections) {
      for (const c of s.items) {
        out.push({ href: c.href, parent: item.label, section: s.title });
      }
    }
  }
  return out;
}

// Destinations we intentionally re-surface across sections (canonical exceptions).
// Everything else must live under exactly one parent group.
const CROSS_SECTION_ALLOWED = new Set<string>([
  "/nominate",
  "/nominees",
  "/awards/categories",
  "/eduaid-africa",
  "/eduaid-africa/rebuild-my-school",
  "/donate",
  "/sponsors",
  "/sponsorship-packages",
  "/guidelines/nominators",
]);

describe("SITE_NAV configuration", () => {
  it("exposes exactly the six approved top-level groups in order", () => {
    expect(SITE_NAV.map((g) => g.label)).toEqual(EXPECTED_TOP_LEVEL);
  });

  it("every top-level group has an href and an analyticsId", () => {
    for (const g of SITE_NAV) {
      expect(g.href, `${g.label} href`).toMatch(/^\//);
      expect(g.analyticsId, `${g.label} analyticsId`).toBeTruthy();
    }
  });

  it("no leaf href appears under more than one top-level group (except canonical crossovers)", () => {
    const seen = new Map<string, string>(); // href -> parent
    const duplicates: Array<{ href: string; a: string; b: string }> = [];
    for (const g of SITE_NAV) {
      for (const leaf of collectLeaves(g)) {
        if (CROSS_SECTION_ALLOWED.has(leaf.href)) continue;
        const prior = seen.get(leaf.href);
        if (prior && prior !== g.label) {
          duplicates.push({ href: leaf.href, a: prior, b: g.label });
        } else {
          seen.set(leaf.href, g.label);
        }
      }
    }
    expect(duplicates, JSON.stringify(duplicates, null, 2)).toEqual([]);
  });

  it("Awards dropdown exposes the Programmes / Explore / Process sections", () => {
    const awards = SITE_NAV.find((g) => g.label === "Awards");
    expect(awards?.sections?.map((s) => s.title)).toEqual([
      "Award Programmes",
      "Explore",
      "Process",
    ]);
  });

  it("Get Involved dropdown uses the approved section headings", () => {
    const gi = SITE_NAV.find((g) => g.label === "Get Involved");
    expect(gi?.sections?.map((s) => s.title)).toEqual([
      "Sponsorship and Partnership",
      "Join the Community",
      "Support",
    ]);
  });

  it("no dropdown column exceeds 8 links", () => {
    for (const g of SITE_NAV) {
      if (g.sections) {
        for (const s of g.sections) {
          expect(
            s.items.length,
            `${g.label} → ${s.title} has ${s.items.length} links (max 8)`,
          ).toBeLessThanOrEqual(8);
        }
      }
    }
  });
});
