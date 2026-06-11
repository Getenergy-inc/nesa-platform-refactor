import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";

// --- Mocks ------------------------------------------------------------------
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

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/nominate" element={<NominateMvp />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("NominateMvp deep-link param handling", () => {
  beforeEach(() => {
    mockI18n.language = "en";
  });

  it("shows family selector when no params", () => {
    renderAt("/nominate");
    expect(screen.getByText(/Select an Award Family/i)).toBeInTheDocument();
    expect(screen.queryByTestId("form-display")).toBeNull();
  });

  it("preselects family from ?family= and shows category list", () => {
    renderAt("/nominate?family=platinum");
    expect(screen.getByText(/Choose a Category/i)).toBeInTheDocument();
  });

  it("ignores unknown family values", () => {
    renderAt("/nominate?family=bogus");
    expect(screen.getByText(/Select an Award Family/i)).toBeInTheDocument();
  });

  it("preselects category from ?category= and renders the embedded form", () => {
    renderAt("/nominate?category=best-csr-for-education-nigeria");
    expect(screen.getByTestId("form-display")).toBeInTheDocument();
    expect(screen.getByTestId("form-title").textContent).toMatch(/CSR/i);
  });

  it("applies subcategory + region passthrough without crashing", () => {
    renderAt(
      "/nominate?category=best-csr-for-education-nigeria&subcategory=scholarships&region=west",
    );
    expect(screen.getByTestId("form-display")).toBeInTheDocument();
  });
});
