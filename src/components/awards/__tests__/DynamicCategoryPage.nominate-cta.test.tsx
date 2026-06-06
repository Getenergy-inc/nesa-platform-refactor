import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";

// ── Mocks ──────────────────────────────────────────────────────────────────
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
  motion: new Proxy(
    {},
    {
      get: () => (p: any) => <div>{p.children}</div>,
    }
  ),
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  ),
}));
vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";

function renderCategoryPage(
  categoryTitle: string,
  nominateCategorySlug?: string
) {
  return render(
    <MemoryRouter>
      <Routes>
        <Route
          path="*"
          element={
            <DynamicCategoryPage
              categoryTitle={categoryTitle}
              nominationType="Test"
              nominateCategorySlug={nominateCategorySlug}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("DynamicCategoryPage Nominate CTA deep links", () => {
  beforeEach(() => {
    mockI18n.language = "en";
  });

  it("hero 'Nominate Now' and bottom 'Submit Nomination' link to /nominate?category=<slug>", () => {
    const slug = "best-csr-for-education-africa-regional";
    renderCategoryPage("Best CSR in Education (Africa Regional)", slug);

    const expectedHref = `/nominate?category=${slug}`;

    // Hero CTA
    const heroLink = screen.getByRole("link", { name: /Nominate Now/i });
    expect(heroLink).toHaveAttribute("href", expectedHref);

    // Bottom CTA
    const bottomLink = screen.getByRole("link", { name: /Submit Nomination/i });
    expect(bottomLink).toHaveAttribute("href", expectedHref);
  });

  it("falls back to plain /nominate when no nominateCategorySlug is provided", () => {
    renderCategoryPage("Best CSR in Education (Africa Regional)");

    const heroLink = screen.getByRole("link", { name: /Nominate Now/i });
    expect(heroLink).toHaveAttribute("href", "/nominate");

    const bottomLink = screen.getByRole("link", { name: /Submit Nomination/i });
    expect(bottomLink).toHaveAttribute("href", "/nominate");
  });

  it.each([
    ["best-csr-for-education-nigeria", "Best CSR in Education (Nigeria)"],
    ["best-ngo-for-education-advancement-africa-regional", "Best NGO Contribution to Education for All (Africa Regional)"],
    ["best-stem-education-programme-africa-regional", "Best STEM Education Programme (Africa Regional)"],
  ] as const)(
    "slug %s on '%s' yields correct /nominate?category= hrefs",
    (slug, categoryTitle) => {
      renderCategoryPage(categoryTitle, slug);

      const expectedHref = `/nominate?category=${slug}`;

      expect(screen.getByRole("link", { name: /Nominate Now/i })).toHaveAttribute(
        "href",
        expectedHref
      );
      expect(
        screen.getByRole("link", { name: /Submit Nomination/i })
      ).toHaveAttribute("href", expectedHref);
    }
  );
});
