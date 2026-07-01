/**
 * Integration tests for /awards/platinum-recognition/diaspora.
 *
 * Verifies:
 *   1. Region tab filtering narrows the visible nominee grid to the selected
 *      African region.
 *   2. Subcategory tab filtering narrows the visible nominee grid to the
 *      selected subcategory.
 *   3. Combining region + subcategory filters intersects both constraints.
 *   4. Free-text search matches name / location / region case-insensitively.
 *   5. "Clear filters" resets query + region + sub back to defaults and
 *      restores the full nominee count.
 *   6. Pagination behaviour: the page currently renders all filtered
 *      nominees in a single grid (no paginator). This is asserted so any
 *      future pagination refactor triggers an intentional test update.
 */
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import PlatinumDiasporaPage from "../PlatinumDiasporaPage";
import {
  DIASPORA_NOMINEES,
  DIASPORA_REGIONS,
  DIASPORA_SUBCATEGORIES,
} from "@/data/diasporaNominees2026";

// jsdom lacks IntersectionObserver; framer-motion's whileInView needs it to
// eventually reveal cards. Provide a minimal stub that immediately reports
// intersection so nominee cards mount into the DOM.
class IOStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/awards/platinum-recognition/diaspora"]}>
        <PlatinumDiasporaPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function resultsRegion() {
  // The "Showing N of M …" counter is a stable anchor for the results section.
  const counter = screen.getByText(/Showing/i);
  const section = counter.closest("section");
  if (!section) throw new Error("results section not found");
  return section;
}

function visibleCardCount() {
  // Each NomineeCard renders a semantic <article>. Restrict to the results
  // section so hero / CTA articles are not counted.
  return within(resultsRegion()).queryAllByRole("article").length;
}

function shownOf(): { shown: number; total: number } {
  const text = resultsRegion().textContent ?? "";
  const m = text.match(/Showing\s+(\d+)\s+of\s+(\d+)/i);
  if (!m) throw new Error(`counter text not found in: ${text}`);
  return { shown: Number(m[1]), total: Number(m[2]) };
}

describe("PlatinumDiasporaPage — filtering, search & pagination", () => {
  beforeEach(() => {
    (globalThis as unknown as { IntersectionObserver: typeof IOStub }).IntersectionObserver =
      IOStub;
  });

  afterEach(() => {
    cleanup();
    document.head.querySelectorAll("link[rel='canonical']").forEach((n) => n.remove());
    document.title = "";
  });

  it("renders all 300 diaspora nominees by default", () => {
    renderPage();
    const { shown, total } = shownOf();
    expect(total).toBe(DIASPORA_NOMINEES.length);
    expect(shown).toBe(DIASPORA_NOMINEES.length);
    expect(visibleCardCount()).toBe(DIASPORA_NOMINEES.length);
  });

  it("filters by African region when a region tab is selected", async () => {
    const user = userEvent.setup();
    renderPage();

    const region = "West Africa";
    const expected = DIASPORA_NOMINEES.filter((n) => n.region === region).length;
    expect(expected).toBeGreaterThan(0);

    await user.click(screen.getByRole("tab", { name: region }));

    expect(shownOf().shown).toBe(expected);
    expect(visibleCardCount()).toBe(expected);
  });

  it("filters by subcategory when a subcategory tab is selected", async () => {
    const user = userEvent.setup();
    renderPage();

    const sub = DIASPORA_SUBCATEGORIES[1]; // Program Innovation
    const shortLabel = "Program Innovation";
    const expected = DIASPORA_NOMINEES.filter((n) => n.subcategory === sub).length;
    expect(expected).toBeGreaterThan(0);

    await user.click(screen.getByRole("tab", { name: shortLabel }));

    expect(shownOf().shown).toBe(expected);
    expect(visibleCardCount()).toBe(expected);
  });

  it("intersects region + subcategory filters", async () => {
    const user = userEvent.setup();
    renderPage();

    const region = "East Africa";
    const sub = DIASPORA_SUBCATEGORIES[2]; // Teacher Training
    const shortLabel = "Teacher Training";
    const expected = DIASPORA_NOMINEES.filter(
      (n) => n.region === region && n.subcategory === sub,
    ).length;
    expect(expected).toBeGreaterThan(0);

    await user.click(screen.getByRole("tab", { name: region }));
    await user.click(screen.getByRole("tab", { name: shortLabel }));

    expect(shownOf().shown).toBe(expected);
    expect(visibleCardCount()).toBe(expected);
  });

  it("searches nominees by name case-insensitively", async () => {
    const user = userEvent.setup();
    renderPage();

    // Pick a real nominee and search a substring of its name.
    const target = DIASPORA_NOMINEES[1]; // "Moroccan American Association"
    const needle = target.name.split(" ")[0].toLowerCase();
    const expected = DIASPORA_NOMINEES.filter(
      (n) =>
        n.name.toLowerCase().includes(needle) ||
        n.location.toLowerCase().includes(needle) ||
        n.region.toLowerCase().includes(needle),
    ).length;

    const input = screen.getByPlaceholderText(/Search nominees/i);
    await user.type(input, needle);

    expect(shownOf().shown).toBe(expected);
    expect(visibleCardCount()).toBe(expected);
  });

  it("searches nominees by location text", async () => {
    const user = userEvent.setup();
    renderPage();

    const needle = "usa";
    const expected = DIASPORA_NOMINEES.filter(
      (n) =>
        n.name.toLowerCase().includes(needle) ||
        n.location.toLowerCase().includes(needle) ||
        n.region.toLowerCase().includes(needle),
    ).length;
    expect(expected).toBeGreaterThan(0);

    const input = screen.getByPlaceholderText(/Search nominees/i);
    await user.type(input, needle);

    expect(shownOf().shown).toBe(expected);
  });

  it("renders the empty state when no nominees match", async () => {
    const user = userEvent.setup();
    renderPage();

    const input = screen.getByPlaceholderText(/Search nominees/i);
    await user.type(input, "zzz-no-nominee-matches-this-string-zzz");

    expect(shownOf().shown).toBe(0);
    expect(visibleCardCount()).toBe(0);
    expect(
      screen.getByText(/No diaspora organisations match your filters/i),
    ).toBeInTheDocument();
  });

  it("‘Clear filters’ resets query + region + subcategory", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("tab", { name: "West Africa" }));
    await user.click(screen.getByRole("tab", { name: "Teacher Training" }));
    await user.type(screen.getByPlaceholderText(/Search nominees/i), "foundation");

    // Clear filters button only appears when a filter is active.
    const clear = screen.getByRole("button", { name: /Clear filters/i });
    await user.click(clear);

    expect(shownOf().shown).toBe(DIASPORA_NOMINEES.length);
    expect(visibleCardCount()).toBe(DIASPORA_NOMINEES.length);
    // All region + subcategory "All" tabs return to active.
    expect(screen.getByRole("tab", { name: /All Regions/i })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByRole("tab", { name: /All Subcategories/i })).toHaveAttribute(
      "data-state",
      "active",
    );
  });

  it("exposes every region + subcategory as a filter tab", () => {
    renderPage();
    for (const r of DIASPORA_REGIONS) {
      expect(screen.getByRole("tab", { name: r })).toBeInTheDocument();
    }
    // Subcategories render via SUB_SHORT labels.
    for (const label of ["Infrastructure", "Program Innovation", "Teacher Training"]) {
      expect(screen.getByRole("tab", { name: label })).toBeInTheDocument();
    }
  });

  it("pagination: renders every filtered nominee in a single grid (no paginator)", async () => {
    // The current UX intentionally shows all 300 nominees at once. If a
    // paginator is ever introduced, this test must be updated deliberately.
    renderPage();

    // No pagination controls in the DOM today.
    expect(screen.queryByRole("navigation", { name: /pagination/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /^next$/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /^previous$/i })).toBeNull();

    // shown === total when unfiltered.
    const { shown, total } = shownOf();
    expect(shown).toBe(total);
    expect(visibleCardCount()).toBe(total);
  });
});
