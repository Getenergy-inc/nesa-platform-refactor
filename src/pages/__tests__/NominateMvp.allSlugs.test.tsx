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
  it.each(AWARD_CATEGORY_FORMS.map((f) => [f.slug, f.name] as const))(
    "renders form for slug %s",
    (slug, name) => {
      const { unmount } = renderAt(`/nominate?category=${slug}`);
      const display = screen.getByTestId("form-display");
      expect(display).toBeInTheDocument();
      expect(screen.getByTestId("form-title").textContent).toBe(name);
      unmount();
    },
  );

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
