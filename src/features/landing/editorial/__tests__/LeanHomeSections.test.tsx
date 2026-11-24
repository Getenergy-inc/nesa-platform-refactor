import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TwoPillarsSection } from "../LeanHomeSections";
import { ICON_PATHWAYS } from "@/config/brandHierarchy";
import { bySubcategory, type IconSubcategorySlug } from "@/data/iconAward";
import { SNS_CATEGORIES, SNS_HERO_IMAGE } from "@/config/schoolSupport";
import { vi } from "vitest";

vi.mock("@/features/landing/editorial/StripScroller", () => ({
  StripScroller: ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div role="group" aria-label={label}>{children}</div>
  ),
}));

describe("lean homepage Tier 1 categories", () => {
  it("links to all three Icon categories from the landing section", () => {
    render(
      <MemoryRouter>
        <TwoPillarsSection />
      </MemoryRouter>,
    );

    const categories = screen.getByRole("list", { name: "Africa Education Icon categories" });
    const cards = within(categories).getAllByRole("listitem");
    expect(cards).toHaveLength(3);

    const pathwayTitles = ["Education Philanthropy Icon", "Literary & New Curriculum Advocate Icon", "Technical Educator Icon"];
    ICON_PATHWAYS.forEach((pathway, index) => {
      const card = cards[index];
      expect(within(card).getByRole("heading", { name: pathwayTitles[index] })).toBeInTheDocument();
      expect(within(card).getByRole("link", { name: "View nominees →" })).toHaveAttribute(
        "href",
        pathway.nomineesHref,
      );
    });
  });

  it("shows every nominee in the matching category strip with a working profile link", () => {
    render(
      <MemoryRouter>
        <TwoPillarsSection />
      </MemoryRouter>,
    );

    const cards = within(screen.getByRole("list", { name: "Africa Education Icon categories" })).getAllByRole("listitem");
    ICON_PATHWAYS.forEach((pathway, index) => {
      const expected = bySubcategory(pathway.slug as IconSubcategorySlug);
      const strip = within(cards[index]).getByRole("group", { name: `${pathway.name} nominees` });
      const profileLinks = within(strip).getAllByRole("link");
      expect(profileLinks).toHaveLength(expected.length);

      expect(profileLinks.map((link) => link.getAttribute("href"))).toEqual(
        expected.map((nominee) => `/nominees/africa-education-icon-award/${nominee.award_subcategory_slug}/${nominee.classification_slug}/${nominee.slug}`),
      );
      // Every record has either its real portrait or the accessible initials fallback.
      expect(within(strip).getAllByRole("img")).toHaveLength(expected.length);
    });
  });

  it("restores the school collage, eight supplied category pictures and three organisation logos", () => {
    render(
      <MemoryRouter>
        <TwoPillarsSection />
      </MemoryRouter>,
    );

    const schoolPanel = screen.getByRole("heading", { name: "From Recognition to Education Impact" }).closest("article");
    expect(schoolPanel).not.toBeNull();
    expect(within(schoolPanel!).getByRole("img", { name: SNS_HERO_IMAGE.alt })).toHaveAttribute("src", SNS_HERO_IMAGE.src);

    const categoryPictures = within(schoolPanel!).getByRole("list", { name: "School support category pictures" });
    const expectedCategories = SNS_CATEGORIES.filter((category) => category.image).slice(0, 8);
    expect(within(categoryPictures).getAllByRole("listitem")).toHaveLength(8);
    expectedCategories.forEach((category) => {
      expect(within(categoryPictures).getByRole("img", { name: category.image!.alt })).toHaveAttribute("src", category.image!.src);
    });

    const organisations = within(schoolPanel!).getByRole("list", { name: "School support organisations" });
    expect(within(organisations).getAllByRole("img")).toHaveLength(3);
  });
});
