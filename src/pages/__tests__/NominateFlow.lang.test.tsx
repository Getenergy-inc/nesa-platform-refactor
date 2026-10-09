import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import React from "react";

// --- Mocks ------------------------------------------------------------------

const changeLanguageSpy = vi.fn();
vi.mock("@/lib/i18n", () => ({
  changeLanguage: (l: string) => {
    changeLanguageSpy(l);
    // simulate i18next applying the change
    mockI18n.language = l;
  },
}));

// Controllable i18n stub for react-i18next
const mockI18n: { language: string } = { language: "en" };
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: mockI18n,
  }),
  Trans: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  initReactI18next: { type: "3rdParty", init: () => {} },
}));

// Strip heavy children — we only care about URL <-> i18n sync
vi.mock("react-helmet-async", () => ({
  Helmet: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    { get: () => (props: any) => <div>{props.children}</div> },
  ),
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

vi.mock("@/components/i18n", () => ({
  LanguageSwitcher: () => <div data-testid="lang-switcher" />,
}));
vi.mock("@/components/nominate/NominationProgressBar", () => ({
  NominationProgressBar: () => <div />,
}));
vi.mock("@/components/nominate/NominationFlashMessage", () => ({
  NominationFlashMessage: () => <div />,
}));
vi.mock("@/components/nominate/NominationPathwaySelector", () => ({
  NominationPathwaySelector: () => <div />,
}));
vi.mock("@/components/nominate/NomineeEntryForm", () => ({
  NomineeEntryForm: () => <div />,
}));
vi.mock("@/components/nominate/ReviewAllNomineesStep", () => ({
  ReviewAllNomineesStep: () => <div />,
}));
vi.mock("@/components/nominate/FinalSubmitterIdentityForm", () => ({
  FinalSubmitterIdentityForm: () => <div />,
}));
vi.mock("@/components/nominate/SignupAtSubmissionStep", () => ({
  SignupAtSubmissionStep: () => <div />,
}));
vi.mock("@/components/nominate/NominationConfirmationScreen", () => ({
  NominationConfirmationScreen: () => <div />,
}));

import NominateFlow from "@/pages/NominateFlow";

function LocationProbe({ onLocation }: { onLocation: (s: string) => void }) {
  const loc = useLocation();
  onLocation(loc.pathname + loc.search);
  return null;
}

function renderAt(url: string, onLocation: (s: string) => void = () => {}) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route
          path="/nominate"
          element={
            <>
              <NominateFlow />
              <LocationProbe onLocation={onLocation} />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

// --- Tests ------------------------------------------------------------------

describe("NominateFlow language URL persistence", () => {
  beforeEach(() => {
    changeLanguageSpy.mockClear();
    mockI18n.language = "en";
    sessionStorage.clear();
  });

  it("restores language from ?lang= on direct link load", () => {
    renderAt("/nominate?lang=fr");
    expect(changeLanguageSpy).toHaveBeenCalledWith("fr");
  });

  it("restores language from ?lang= for each supported locale (refresh simulation)", () => {
    const locales = ["fr", "ar", "pt", "sw", "ha", "yo", "ig", "am", "zu", "zh", "hi"];
    for (const l of locales) {
      changeLanguageSpy.mockClear();
      mockI18n.language = "en";
      const { unmount } = renderAt(`/nominate?lang=${l}`);
      expect(changeLanguageSpy).toHaveBeenCalledWith(l);
      unmount();
    }
  });

  it("ignores invalid ?lang= values", () => {
    renderAt("/nominate?lang=xx");
    expect(changeLanguageSpy).not.toHaveBeenCalled();
  });

  it("does not re-trigger changeLanguage when ?lang= matches current language", () => {
    mockI18n.language = "fr";
    renderAt("/nominate?lang=fr");
    expect(changeLanguageSpy).not.toHaveBeenCalled();
  });

  it("writes ?lang= into the URL when i18n language differs from URL", () => {
    let lastUrl = "";
    mockI18n.language = "fr";
    renderAt("/nominate", (u) => {
      lastUrl = u;
    });
    expect(lastUrl).toContain("lang=fr");
  });

  it("preserves other query params when syncing ?lang=", () => {
    let lastUrl = "";
    renderAt("/nominate?lang=fr&family=education", (u) => {
      lastUrl = u;
    });
    expect(lastUrl).toContain("lang=fr");
    expect(lastUrl).toContain("family=education");
  });
});
