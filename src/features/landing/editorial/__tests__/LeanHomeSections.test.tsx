import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TwoPillarsSection } from "../LeanHomeSections";
import { ICON_PATHWAYS } from "@/config/brandHierarchy";

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

    ICON_PATHWAYS.forEach((pathway, index) => {
      const card = cards[index];
      expect(within(card).getByRole("heading", { name: pathway.name })).toBeInTheDocument();
      expect(within(card).getByRole("link", { name: "View category nominees →" })).toHaveAttribute(
        "href",
        pathway.nomineesHref,
      );
    });
  });
});
