/**
 * Verifies that every /nominate?category=<slug> deep link wired up across the
 * site (src/pages/categories/*.tsx, GoldCategoryPage, RegionNomineesHubPage,
 * GroupIndexPage, etc.) resolves to a real form in AWARD_CATEGORY_FORMS and
 * renders the matching Google Form card via NominateMvp.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";
import * as fs from "node:fs";
import * as path from "node:path";

// ── Mocks (same surface as NominateMvp.deeplink.test.tsx) ────────────────
const mockI18n: { language: string } = { language: "en" };
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: mockI18n }),
  Trans: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  initReactI18next: { type: "3rdParty", init: () => {} },
}));
vi.mock("@/lib/i18n", () => ({ changeLanguage: vi.fn() }));
vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));
vi.mock("framer-motion", () => ({
  motion: new Proxy({}, { get: () => (p: any) => <div>{p.children}</div> }),
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));
vi.mock("@/components/i18n", () => ({
  LanguageSwitcher: () => <div data-testid="lang-switcher" />,
}));
vi.mock("@/components/nominate/IntegrityNotice", () => ({
  IntegrityNotice: () => <div data-testid="integrity" />,
}));
vi.mock("@/components/nominate/GoogleFormDisplay", () => ({
  GoogleFormDisplay: ({ title, status }: { title: string; status: string }) => (
    <div data-testid="form-display">
      <span data-testid="form-title">{title}</span>
      <span data-testid="form-status">{status}</span>
    </div>
  ),
}));

import NominateMvp from "@/pages/NominateMvp";
import {
  AWARD_CATEGORY_FORMS,
  getCategoryFormBySlug,
} from "@/config/nomination/awardCategoryForms";

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/nominate" element={<NominateMvp />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Deep-link integrity: every wired ?category= slug resolves", () => {
  beforeEach(() => {
    mockI18n.language = "en";
  });

  // 1) Every form in the central catalogue is reachable via deep link.
  //    Africa Regional / Nigeria zonal categories deliberately show a
  //    region-or-zone chooser first (the form is per-region), so for those the
  //    deep link must land on the chooser for that category rather than the
  //    generic picker. Both outcomes are asserted — nothing is skipped.
  it.each(AWARD_CATEGORY_FORMS.map((f) => [f.slug, f.name] as const))(
    "renders form or region chooser for slug %s",
    (slug, name) => {
      const { unmount } = renderAt(`/nominate?category=${slug}`);
      const form = screen.queryByTestId("form-display");
      if (form) {
        expect(screen.getByTestId("form-title").textContent).toBe(name);
      } else {
        // Category resolved, but it fans out into per-region forms.
        const chooser = screen.getByRole("heading", {
          name: /Select Your (Africa Region|Zone)/i,
        });
        expect(chooser).toBeInTheDocument();
      }
      unmount();
    },
  );

  // 1b) Every regional category variant renders its own form directly.
  it.each(
    AWARD_CATEGORY_FORMS.filter((f) => f.isRegionalCategory && f.regions).flatMap((f) =>
      f.regions!.map((r) => [f.slug, r.slug] as const),
    ),
  )("renders regional form for %s / %s", (slug, regionSlug) => {
    const { unmount } = renderAt(`/nominate?category=${slug}&region=${regionSlug}`);
    expect(screen.getByTestId("form-display")).toBeInTheDocument();
    unmount();
  });

  // 2) Every nominateCategorySlug literal hard-coded in the site source code
  //    must exist in AWARD_CATEGORY_FORMS. Catches typos at build time.
  it("all hard-coded nominateCategorySlug values exist in the catalogue", () => {
    const root = path.resolve(__dirname, "../..");
    const found = new Set<string>();

    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === "node_modules" || entry.name === "__tests__") continue;
          walk(p);
        } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
          const src = fs.readFileSync(p, "utf8");
          // matches: nominateCategorySlug="..."  or  nominateCategorySlug={"..."}
          const re = /nominateCategorySlug\s*=\s*\{?\s*["'`]([^"'`]+)["'`]/g;
          let m: RegExpExecArray | null;
          while ((m = re.exec(src)) !== null) found.add(m[1]);
        }
      }
    };
    walk(root);

    expect(found.size).toBeGreaterThan(0);
    const bad = [...found].filter((slug) => !getCategoryFormBySlug(slug));
    expect(bad, `Unknown slugs referenced in source:\n${bad.join("\n")}`).toEqual([]);
  });
});
