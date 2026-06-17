/**
 * QA gate: /categories/international-bilateral-education must render the
 * 2026 nominations-open hero (badge + headline + Nominate Now CTA pointing
 * at the Embassies subcategory UUID) and set its canonical link to the
 * /categories/international-bilateral-education URL.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import InternationalEducationPage from "../InternationalEducation";
import { PRIMARY_NOMINATE_HREF } from "../internationalEducationData";

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/categories/international-bilateral-education"]}>
        <InternationalEducationPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("/categories/international-bilateral-education", () => {
  afterEach(() => {
    cleanup();
    // Helmet writes to document.head; clear between tests.
    document.head.querySelectorAll("link[rel='canonical']").forEach((n) => n.remove());
    document.title = "";
  });

  it("renders the 2026 nominations-open hero badge and headline", () => {
    renderPage();

    expect(screen.getByText(/2026 Nominations Open/i)).toBeInTheDocument();

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/Excellence in International/i);
    expect(h1).toHaveTextContent(/Partnership for Education/i);
    expect(h1).toHaveTextContent(/\(Africa\)/);
  });

  it("renders a Nominate Now CTA pointing at the Embassies subcategory UUID", () => {
    renderPage();

    expect(PRIMARY_NOMINATE_HREF).toBe(
      "/nominate?subcategory=51dcefcf-e410-4372-85de-65c997c587bf",
    );

    const ctas = screen
      .getAllByRole("link", { name: /Nominate Now/i })
      .filter((a) => a.getAttribute("href") === PRIMARY_NOMINATE_HREF);
    expect(ctas.length).toBeGreaterThan(0);
  });

  it("sets the canonical link to the /categories/international-bilateral-education URL", async () => {
    renderPage();

    await waitFor(() => {
      const canonical = document.head.querySelector("link[rel='canonical']");
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute("href")).toBe(
        "https://nesa.africa/categories/international-bilateral-education",
      );
    });
  });
});
