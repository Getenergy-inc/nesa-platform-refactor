// Guards on the shared navigation configuration.
// Locked 5-item architecture:
//   About · Recognition · Get Involved · Directory · Support
//
// Rule: new content goes INSIDE an existing dropdown, never as a new
// top-level item — unless it represents a genuinely new visitor intent.

import { describe, it, expect } from "vitest";
import { SITE_NAV, type NavItem } from "@/config/siteNavigation";

const EXPECTED_TOP_LEVEL = [
  "About",
  "Recognition",
  "Get Involved",
  "Explore Existing Nominees",
  "Support",
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
const CROSS_SECTION_ALLOWED = new Set<string>([
  "/nominate",
  "/nominees",
  "/donate",
  "/partners-sponsors",
]);

describe("SITE_NAV configuration", () => {
  it("exposes exactly the five approved top-level groups in order", () => {
    expect(SITE_NAV.map((g) => g.label)).toEqual(EXPECTED_TOP_LEVEL);
  });

  it("every top-level group has an href and an analyticsId", () => {
    for (const g of SITE_NAV) {
      expect(g.href, `${g.label} href`).toMatch(/^\//);
      expect(g.analyticsId, `${g.label} analyticsId`).toBeTruthy();
    }
  });

  it("Explore Existing Nominees is a direct link with no dropdown", () => {
    const dir = SITE_NAV.find((g) => g.label === "Explore Existing Nominees")!;
    expect(dir.children).toBeUndefined();
    expect(dir.sections).toBeUndefined();
    expect(dir.href).toBe("/nominees");
  });

  it("Recognition exposes the four tier columns in the locked order", () => {
    const rec = SITE_NAV.find((g) => g.label === "Recognition");
    expect(rec?.sections?.map((s) => s.title)).toEqual([
      "Africa Education Icon",
      "Influencer Education Impact",
      "Platinum Certificate of Recognition",
      "Gold-Blue Garnet Regional Recognition",
    ]);
  });

  it("no leaf href appears under more than one top-level group (except canonical crossovers)", () => {
    const seen = new Map<string, string>();
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
