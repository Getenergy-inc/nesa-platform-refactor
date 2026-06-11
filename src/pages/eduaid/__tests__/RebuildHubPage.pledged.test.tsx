/**
 * Unit tests — Rebuild My School Africa pledged-success URL handling.
 *
 * Guards:
 *   - ?pledged=success is consumed exactly once
 *   - Success banner renders only once (no duplicates on rerender)
 *   - window.history.replaceState is called only when expected
 *   - pledged=success is removed after consumption
 *   - utm_source / utm_campaign / ref / return_to are preserved
 *   - #donate hash is preserved and the section is scrolled into view
 *   - Unrelated parameters are not stripped
 *
 * Regressions here MUST fail CI — these are wired into the
 * `.github/workflows/pledged-success.yml` gate.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Stub heavy children — they aren't relevant to the URL/scroll behavior.
vi.mock("@/components/nominate/IntegrityNotice", () => ({
  IntegrityNotice: () => null,
}));
vi.mock("@/components/nesa/RegionalLegacyEcosystem", () => ({
  RegionalLegacyEcosystem: () => null,
}));
vi.mock("framer-motion", () => {
  const React = require("react");
  const passthrough = (tag: string) =>
    React.forwardRef(({ children, ...rest }: any, ref: any) =>
      React.createElement(tag, { ref, ...rest }, children),
    );
  return {
    motion: new Proxy({}, { get: (_t, k: string) => passthrough(k) }),
    AnimatePresence: ({ children }: any) => children,
  };
});

import RebuildHubPage from "../RebuildHubPage";

function renderAt(url: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[url]}>
        <RebuildHubPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

const PATH = "/eduaid-africa/rebuild-my-school";

describe("RebuildHubPage — ?pledged=success URL handling", () => {
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;
  let scrollIntoViewSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollIntoViewSpy = vi.fn();
    (Element.prototype as any).scrollIntoView = scrollIntoViewSpy;
    window.history.replaceState({}, "", `${PATH}?pledged=success#donate`);
    replaceStateSpy = vi.spyOn(window.history, "replaceState");
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
    vi.useRealTimers();
  });

  async function flushFrames() {
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
  }

  it("renders the success banner, strips ?pledged, preserves #donate, and scrolls", async () => {
    renderAt(`${PATH}?pledged=success#donate`);

    expect(await screen.findByText(/Pledge recorded/i)).toBeInTheDocument();

    await waitFor(() => expect(replaceStateSpy).toHaveBeenCalledTimes(1));
    const [, , newUrl] = replaceStateSpy.mock.calls[0];
    expect(newUrl).toBe(`${PATH}#donate`);
    expect(String(newUrl)).not.toMatch(/pledged=/);

    await flushFrames();
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });

  it("renders the success banner exactly once (no duplicates)", async () => {
    renderAt(`${PATH}?pledged=success#donate`);
    await screen.findByText(/Pledge recorded/i);
    const banners = screen.getAllByRole("status");
    const matches = banners.filter((n) => /Pledge recorded/i.test(n.textContent ?? ""));
    expect(matches).toHaveLength(1);
  });

  it("consumes the param exactly once across rapid rerenders", async () => {
    const tree = (
      <HelmetProvider>
        <MemoryRouter initialEntries={[`${PATH}?pledged=success#donate`]}>
          <RebuildHubPage />
        </MemoryRouter>
      </HelmetProvider>
    );
    const { rerender } = render(tree);

    await waitFor(() => expect(replaceStateSpy).toHaveBeenCalledTimes(1));

    // Fire several rapid rerenders to simulate parent state churn.
    for (let i = 0; i < 5; i++) {
      rerender(
        <HelmetProvider>
          <MemoryRouter initialEntries={[`${PATH}?pledged=success#donate`]}>
            <RebuildHubPage />
          </MemoryRouter>
        </HelmetProvider>,
      );
    }
    await new Promise((r) => setTimeout(r, 0));

    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    const matches = screen
      .getAllByRole("status")
      .filter((n) => /Pledge recorded/i.test(n.textContent ?? ""));
    expect(matches).toHaveLength(1);
  });

  it("does nothing when ?pledged is absent", async () => {
    window.history.replaceState({}, "", PATH);
    replaceStateSpy.mockClear();
    renderAt(PATH);

    await new Promise((r) => setTimeout(r, 0));
    expect(replaceStateSpy).not.toHaveBeenCalled();
    expect(screen.queryByText(/Pledge recorded/i)).not.toBeInTheDocument();
  });

  it("preserves utm_source, utm_campaign, ref, and return_to during cleanup", async () => {
    const url =
      `${PATH}?pledged=success` +
      `&utm_source=newsletter` +
      `&utm_campaign=rmsa_q3` +
      `&ref=email` +
      `&return_to=${encodeURIComponent("/eduaid-africa/rebuild-my-school#donate")}` +
      `#donate`;
    window.history.replaceState({}, "", url);
    replaceStateSpy.mockClear();
    renderAt(url);

    await waitFor(() => expect(replaceStateSpy).toHaveBeenCalledTimes(1));
    const [, , newUrl] = replaceStateSpy.mock.calls[0] as [unknown, string, string];

    // Re-parse so the assertion is order-insensitive.
    const u = new URL(newUrl, "http://localhost");
    expect(u.pathname).toBe(PATH);
    expect(u.hash).toBe("#donate");
    expect(u.searchParams.get("pledged")).toBeNull();
    expect(u.searchParams.get("utm_source")).toBe("newsletter");
    expect(u.searchParams.get("utm_campaign")).toBe("rmsa_q3");
    expect(u.searchParams.get("ref")).toBe("email");
    expect(u.searchParams.get("return_to")).toBe("/eduaid-africa/rebuild-my-school#donate");
  });

  it("preserves the #donate hash even when missing from the URL", async () => {
    const url = `${PATH}?pledged=success`;
    window.history.replaceState({}, "", url);
    replaceStateSpy.mockClear();
    renderAt(url);

    await waitFor(() => expect(replaceStateSpy).toHaveBeenCalledTimes(1));
    const [, , newUrl] = replaceStateSpy.mock.calls[0] as [unknown, string, string];
    expect(newUrl).toMatch(/#donate$/);
  });

  it("does not strip unrelated single params", async () => {
    const url = `${PATH}?pledged=success&keep=me#donate`;
    window.history.replaceState({}, "", url);
    replaceStateSpy.mockClear();
    renderAt(url);

    await waitFor(() => expect(replaceStateSpy).toHaveBeenCalledTimes(1));
    const [, , newUrl] = replaceStateSpy.mock.calls[0] as [unknown, string, string];
    expect(newUrl).toBe(`${PATH}?keep=me#donate`);
  });
});
