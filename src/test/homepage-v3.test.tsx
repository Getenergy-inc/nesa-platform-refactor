import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EditorialHero } from "@/features/landing/editorial/EditorialHero";
import { HomeActionSection, HomeHookSection } from "@/features/landing/editorial/HomepageV3Sections";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { REFACTOR_REDIRECTS_2026 } from "@/config/refactorRedirects2026";

const renderPage = (children: React.ReactNode) => render(<MemoryRouter>{children}</MemoryRouter>);

describe("Homepage v3 actions", () => {
  it("keeps exactly three links in the hero and sends nomination to the official form", () => {
    renderPage(<EditorialHero />);
    const hero = screen.getByRole("heading", { level: 1 }).closest("section");
    expect(hero).not.toBeNull();
    const links = within(hero!).getAllByRole("link");
    expect(links).toHaveLength(3);

    expect(links[0]).toHaveAccessibleName("Nominate an Education Enabler");
    expect(links[0]).toHaveAttribute("href", PUBLIC_ACTIONS_2026.nominate.href);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
    expect(links[1]).toHaveAttribute("href", "/awards");
    expect(links[2]).toHaveAttribute("href", "/impact/special-needs-schools");
  });

  it("uses the official form for the hook and final nomination actions", () => {
    renderPage(<><HomeHookSection /><HomeActionSection /></>);
    const nameLink = screen.getByRole("link", { name: "Name them →" });
    const submitLink = screen.getByRole("link", { name: "Submit a Nomination" });
    for (const link of [nameLink, submitLink]) {
      expect(link).toHaveAttribute("href", PUBLIC_ACTIONS_2026.nominate.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("provides all three requested sharing channels", () => {
    renderPage(<HomeHookSection />);
    expect(screen.getByRole("link", { name: "Share on WhatsApp" })).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(screen.getByRole("link", { name: "Share on LinkedIn" })).toHaveAttribute("href", expect.stringContaining("linkedin.com"));
    expect(screen.getByRole("link", { name: "Share on X" })).toHaveAttribute("href", expect.stringContaining("twitter.com/intent/tweet"));
  });
});

describe("Homepage v3 tier shortcuts", () => {
  it.each([
    ["/recognition/tier-1", "/awards/africa-education-icon"],
    ["/recognition/tier-2", "/awards/influencer-education-impact"],
    ["/recognition/tier-3", "/awards/platinum-recognition"],
    ["/recognition/tier-4", "/awards/gold-blue-garnet"],
  ])("redirects %s to its existing tier page", (from, to) => {
    expect(REFACTOR_REDIRECTS_2026.find((redirect) => redirect.from === from)?.to).toBe(to);
  });

  it("does not replace the real Recognition and Sponsors pages", () => {
    expect(REFACTOR_REDIRECTS_2026.some((redirect) => redirect.from === "/recognition")).toBe(false);
    expect(REFACTOR_REDIRECTS_2026.some((redirect) => redirect.from === "/sponsors")).toBe(false);
  });
});
