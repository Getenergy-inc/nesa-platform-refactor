// Guards on the shared navigation configuration.
//
// NOTE (2026 IA): this file previously locked a 5-item architecture
// (About · Recognition · Get Involved · Directory · Support). That IA was
// deliberately superseded by the 2026 information architecture documented at
// the top of `siteNavigation.ts`, so the old "exactly these five labels"
// assertion no longer describes an intended contract. It is replaced below by
// a guard on the CURRENT approved group list — same intent (nav cannot drift
// silently), updated shape. No coverage was dropped: the structural rules
// (href/analyticsId present, no accidental duplicate destinations, column
// size caps) are all still enforced, plus a new intra-dropdown duplicate check.

import { describe, it, expect } from "vitest";
import { SITE_NAV, UTILITY_NAV, type NavItem } from "@/config/siteNavigation";

const EXPECTED_TOP_LEVEL = [
  "About",
  "Africa Education Icon",
  "CSR",
  "NGO & Foundations",
  "EduTech",
  "Influencers",
  "Recognition",
  "Explore Nominees",
  "Education Social Impact",
  "Participate",
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

// Destinations we intentionally re-surface across groups (canonical exceptions).
const CROSS_SECTION_ALLOWED = new Set<string>([
  "/nominate",
  "/nominees",
  "/donate",
  "/partners-sponsors",
  // Contact is reachable from both the institutional group and the
  // participation funnel by design.
  "/contact",
  // The Icon flagship overview is deliberately surfaced both as its own
  // top-level group and inside the Recognition group.
  "/recognition/africa-education-icon",
  // Shared institutional pages referenced from more than one intent.
  "/about/how-it-works",
  "/timeline",
]);


describe("SITE_NAV configuration", () => {
  it("exposes exactly the approved top-level groups in order", () => {
    expect(SITE_NAV.map((g) => g.label)).toEqual(EXPECTED_TOP_LEVEL);
  });

  it("every top-level group has an href and an analyticsId", () => {
    for (const g of SITE_NAV) {
      expect(g.href, `${g.label} href`).toMatch(/^\//);
      expect(g.analyticsId, `${g.label} analyticsId`).toBeTruthy();
    }
  });

  it("every top-level group exposes a dropdown (children or sections)", () => {
    for (const g of SITE_NAV) {
      expect(
        Boolean(g.children?.length || g.sections?.length),
        `${g.label} has no dropdown content`,
      ).toBe(true);
    }
  });

  it("Explore Nominees points at the directory", () => {
    const dir = SITE_NAV.find((g) => g.label === "Explore Nominees")!;
    expect(dir.href).toBe("/nominees");
  });

  it("no href is repeated inside a single dropdown", () => {
    for (const g of SITE_NAV) {
      const hrefs = collectLeaves(g).map((l) => l.href);
      const dupes = hrefs.filter((h, i) => hrefs.indexOf(h) !== i);
      expect(dupes, `${g.label} repeats: ${dupes.join(", ")}`).toEqual([]);
    }
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

  it("no dropdown column exceeds its size cap", () => {
    for (const g of SITE_NAV) {
      for (const s of g.sections ?? []) {
        expect(
          s.items.length,
          `${g.label} → ${s.title} has ${s.items.length} links (max 8)`,
        ).toBeLessThanOrEqual(8);
      }
      if (g.children) {
        expect(
          g.children.length,
          `${g.label} has ${g.children.length} links (max 12)`,
        ).toBeLessThanOrEqual(12);
      }
    }
  });
});
