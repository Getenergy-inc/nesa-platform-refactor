import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AfriEduTourismPage from "@/pages/AfriEduTourismPage";
import { CONTACT_SUBJECT_PREFILLS } from "@/pages/Contact";

function renderPage() {
  return render(<HelmetProvider><MemoryRouter><AfriEduTourismPage /></MemoryRouter></HelmetProvider>);
}

describe("Afri-EduTourism lean page", () => {
  it("shows exactly the four mission cards", () => {
    renderPage();
    const titles = screen.getAllByTestId("mission-card").map((c) => c.querySelector("h3")?.textContent);
    expect(titles).toEqual([
      "School commissioning visits",
      "Inclusive-education learning visits",
      "Education leadership and teacher exchange",
      "Heritage and Diaspora learning journeys",
    ]);
  });

  it("has no /regions/ links", () => {
    const { container } = renderPage();
    const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.filter((h) => h.startsWith("/regions"))).toEqual([]);
  });

  it("Register Interest CTAs open the Afri-EduTourism contact prefill", () => {
    renderPage();
    const ctas = screen.getAllByRole("link", { name: "Register Interest in a 2027 Mission" });
    expect(ctas).toHaveLength(2);
    ctas.forEach((a) => expect(a.getAttribute("href")).toBe("/contact?subject=afri-edutourism"));
    expect(CONTACT_SUBJECT_PREFILLS["afri-edutourism"]).toBe("Afri-EduTourism mission");
  });
});
