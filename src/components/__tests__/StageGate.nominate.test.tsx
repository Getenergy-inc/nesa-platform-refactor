import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";

// --- Mocks ------------------------------------------------------------------
// Mock SeasonContext so we can flip the stage between open / closed / loading.
const mockStageState: {
  isOpen: boolean;
  loading: boolean;
  opensAt: Date | null;
} = { isOpen: false, loading: false, opensAt: new Date("2026-09-01") };

vi.mock("@/contexts/SeasonContext", () => ({
  useSeason: () => ({
    currentEdition: { key: "2026", name: "NESA-Africa 2026" },
  }),
  useStageGate: () => ({
    isOpen: mockStageState.isOpen,
    loading: mockStageState.loading,
    stage: { action: "nominations", isOpen: mockStageState.isOpen },
    opensAt: mockStageState.opensAt,
    closesAt: null,
  }),
}));

import { StageGate, StageLocked } from "@/components/StageGate";

function NominateCta() {
  return (
    <a href="/nominate?category=best-csr-for-education-nigeria" data-testid="nominate-cta">
      Nominate Now
    </a>
  );
}

function renderGate() {
  return render(
    <MemoryRouter>
      <StageGate action="nominations">
        <NominateCta />
      </StageGate>
    </MemoryRouter>,
  );
}

describe("StageGate — Nominate CTAs", () => {
  beforeEach(() => {
    mockStageState.isOpen = false;
    mockStageState.loading = false;
    mockStageState.opensAt = new Date("2026-09-01");
  });

  it("blocks Nominate CTA and renders StageLocked UI when stage is closed", () => {
    mockStageState.isOpen = false;
    renderGate();

    // CTA must NOT render
    expect(screen.queryByTestId("nominate-cta")).toBeNull();
    expect(screen.queryByText(/Nominate Now/i)).toBeNull();

    // StageLocked UI is shown
    expect(screen.getByText(/Currently Closed/i)).toBeInTheDocument();
    expect(screen.getByText(/not currently open/i)).toBeInTheDocument();
    // Opens-at chip is rendered
    expect(screen.getByText(/Opens:/i)).toBeInTheDocument();
  });

  it("renders Nominate CTA when nominations stage is open", () => {
    mockStageState.isOpen = true;
    renderGate();

    expect(screen.getByTestId("nominate-cta")).toBeInTheDocument();
    expect(screen.queryByText(/Currently Closed/i)).toBeNull();
  });

  it("renders custom fallback instead of default StageLocked when provided and closed", () => {
    mockStageState.isOpen = false;
    render(
      <MemoryRouter>
        <StageGate
          action="nominations"
          fallback={<div data-testid="custom-fallback">Nominations open soon</div>}
        >
          <NominateCta />
        </StageGate>
      </MemoryRouter>,
    );
    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("nominate-cta")).toBeNull();
  });

  it("shows a loading indicator and hides CTAs while stage status is loading", () => {
    mockStageState.loading = true;
    renderGate();

    expect(screen.getByText(/Loading stage status/i)).toBeInTheDocument();
    expect(screen.queryByTestId("nominate-cta")).toBeNull();
    expect(screen.queryByText(/Currently Closed/i)).toBeNull();
  });

  it("StageLocked rendered directly also shows the closed messaging", () => {
    mockStageState.isOpen = false;
    render(
      <MemoryRouter>
        <StageLocked action="nominations" />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Currently Closed/i)).toBeInTheDocument();
  });
});
