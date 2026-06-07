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

describe("RebuildHubPage — ?pledged=success handling", () => {
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;
  let scrollIntoViewSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // jsdom doesn't implement these.
    scrollIntoViewSpy = vi.fn();
    (Element.prototype as any).scrollIntoView = scrollIntoViewSpy;

    // Seed window.location with the pledged param + hash so the effect's
    // `new URL(window.location.href)` reflects the route under test.
    window.history.replaceState({}, "", `${PATH}?pledged=success#donate`);
    replaceStateSpy = vi.spyOn(window.history, "replaceState");
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
    vi.useRealTimers();
  });

  it("shows success banner, strips ?pledged, preserves #donate hash, and scrolls", async () => {
    renderAt(`${PATH}?pledged=success#donate`);

    // Banner renders.
    expect(
      await screen.findByText(/Pledge recorded/i),
    ).toBeInTheDocument();

    // replaceState was called exactly once, stripping pledged but keeping hash.
    await waitFor(() => expect(replaceStateSpy).toHaveBeenCalledTimes(1));
    const [, , newUrl] = replaceStateSpy.mock.calls[0];
    expect(newUrl).toBe(`${PATH}#donate`);
    expect(String(newUrl)).not.toMatch(/pledged=/);

    // Scroll is deferred via double rAF — flush a couple frames.
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });

  it("consumes the param exactly once even on re-render", async () => {
    const { rerender } = renderAt(`${PATH}?pledged=success#donate`);

    await waitFor(() => expect(replaceStateSpy).toHaveBeenCalledTimes(1));

    rerender(
      <HelmetProvider>
        <MemoryRouter initialEntries={[`${PATH}?pledged=success#donate`]}>
          <RebuildHubPage />
        </MemoryRouter>
      </HelmetProvider>,
    );

    // Still exactly one call — the ref guard prevents re-consumption.
    await new Promise((r) => setTimeout(r, 0));
    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
  });

  it("does nothing when ?pledged is absent", async () => {
    window.history.replaceState({}, "", PATH);
    renderAt(PATH);

    await new Promise((r) => setTimeout(r, 0));
    expect(replaceStateSpy).not.toHaveBeenCalled();
    expect(screen.queryByText(/Pledge recorded/i)).not.toBeInTheDocument();
  });

  it("preserves other query params alongside the stripped pledged param", async () => {
    const url = `${PATH}?pledged=success&ref=email#donate`;
    window.history.replaceState({}, "", url);
    renderAt(url);

    await waitFor(() => expect(replaceStateSpy).toHaveBeenCalledTimes(1));
    const [, , newUrl] = replaceStateSpy.mock.calls[0];
    expect(newUrl).toBe(`${PATH}?ref=email#donate`);
  });
});
