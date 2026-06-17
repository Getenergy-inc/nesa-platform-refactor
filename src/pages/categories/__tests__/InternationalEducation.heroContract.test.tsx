/**
 * Hero contract test for /categories/international-bilateral-education.
 *
 * Locks the hero section's structure, copy, and CTA wiring so future
 * data/content changes can't silently drift away from spec:
 *   - Single H1 with the lead text + gold accent span "Partnership for Education"
 *   - "2026 Nominations Open" status badge
 *   - Exact descriptive sub-headline
 *   - 3 CTAs in order:
 *       1. Nominate Now  → /nominate?subcategory=51dcefcf-e410-4372-85de-65c997c587bf
 *       2. Explore Nominees → /nominees?category=international-bilateral-education
 *       3. View All Categories → /categories
 *   - Subcategory UUID must match the documented Embassies & High Commissions ID
 *     and stay aligned with the first entry in INTL_SUBCATEGORIES.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import InternationalEducationPage from "../InternationalEducation";
import {
  INTL_SUBCATEGORIES,
  PRIMARY_NOMINATE_HREF,
} from "../internationalEducationData";

const EMBASSIES_UUID = "51dcefcf-e410-4372-85de-65c997c587bf";

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/categories/international-bilateral-education"]}>
        <InternationalEducationPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function getHeroSection(): HTMLElement {
  const h1 = screen.getByRole("heading", { level: 1 });
  const section = h1.closest("section");
  if (!section) throw new Error("Hero <section> not found around the H1");
  return section as HTMLElement;
}

describe("InternationalEducation — hero contract", () => {
  afterEach(() => {
    cleanup();
    document.head.querySelectorAll("link[rel='canonical']").forEach((n) => n.remove());
    document.title = "";
  });

  it("data contract: PRIMARY_NOMINATE_HREF, Embassies UUID, and first subcategory all align", () => {
    expect(PRIMARY_NOMINATE_HREF).toBe(`/nominate?subcategory=${EMBASSIES_UUID}`);
    expect(INTL_SUBCATEGORIES[0]).toMatchObject({
      key: "embassies",
      title: "Embassies & High Commissions",
      subcategoryId: EMBASSIES_UUID,
    });
  });

  it("renders exactly one H1 with the lead text and gold accent span", () => {
    renderPage();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);

    const h1 = headings[0];
    expect(h1).toHaveTextContent(
      /Excellence in International\s+Partnership for Education\s*\(Africa\)/i,
    );

    // Accent span carries the gold token class.
    const accent = within(h1).getByText(/Partnership for Education/i);
    expect(accent.tagName).toBe("SPAN");
    expect(accent.className).toMatch(/text-gold/);
  });

  it("renders the 2026 Nominations Open badge and exact sub-headline inside the hero", () => {
    renderPage();
    const hero = getHeroSection();

    expect(within(hero).getByText(/2026 Nominations Open/i)).toBeInTheDocument();
    expect(
      within(hero).getByText(
        /Celebrating international partners advancing education across Africa\./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the 3 hero CTAs in order with the correct hrefs", () => {
    renderPage();
    const hero = getHeroSection();

    const links = within(hero).getAllByRole("link");
    const ctas = links.filter((a) =>
      /Nominate Now|Explore Nominees|View All Categories/i.test(a.textContent ?? ""),
    );

    expect(ctas).toHaveLength(3);

    expect(ctas[0]).toHaveTextContent(/Nominate Now/i);
    expect(ctas[0].getAttribute("href")).toBe(`/nominate?subcategory=${EMBASSIES_UUID}`);

    expect(ctas[1]).toHaveTextContent(/Explore Nominees/i);
    expect(ctas[1].getAttribute("href")).toBe(
      "/nominees?category=international-bilateral-education",
    );

    expect(ctas[2]).toHaveTextContent(/View All Categories/i);
    expect(ctas[2].getAttribute("href")).toBe("/categories");
  });

  it("Nominate Now CTA UUID stays locked to the Embassies subcategory across data changes", () => {
    renderPage();
    const hero = getHeroSection();

    const nominate = within(hero)
      .getAllByRole("link")
      .find((a) => /Nominate Now/i.test(a.textContent ?? ""));

    expect(nominate).toBeDefined();
    // Must match the documented UUID, the data-file constant, AND
    // the first INTL_SUBCATEGORIES entry — all three are coupled.
    const href = nominate!.getAttribute("href");
    expect(href).toBe(`/nominate?subcategory=${EMBASSIES_UUID}`);
    expect(href).toBe(PRIMARY_NOMINATE_HREF);
    expect(href).toBe(`/nominate?subcategory=${INTL_SUBCATEGORIES[0].subcategoryId}`);
  });
});
