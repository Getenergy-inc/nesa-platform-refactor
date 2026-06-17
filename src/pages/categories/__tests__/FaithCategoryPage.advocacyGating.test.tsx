/**
 * QA gate: the Christian "Advocacy for Educational Reforms & Awareness Campaigns"
 * tile must stay in the disabled "Nominations opening soon" state until the
 * backend exposes a `subcategories` row with slug = "christian-advocacy".
 * Once the hook resolves that slug to a UUID, the tile must flip to a working
 * "Nominate" link pointing at `/nominate?subcategory=<uuid>`.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { FaithCategoryPage } from "../FaithCategoryPage";
import { christianEducationConfig } from "../christianEducationData";

// Mockable resolver — the test controls what the hook returns.
const mockHook = vi.fn();
vi.mock("@/hooks/useFaithSubcategoryUuids", () => ({
  useFaithSubcategoryUuids: (slugs: string[]) => mockHook(slugs),
}));

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <FaithCategoryPage config={christianEducationConfig} />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function getAdvocacyTile() {
  const heading = screen.getByText(
    "Best Advocacy for Educational Reforms & Awareness Campaigns",
  );
  // Card is the closest ancestor that contains the CTA button.
  const tile = heading.closest("div.flex") ?? heading.parentElement!;
  return tile as HTMLElement;
}

describe("Christian Advocacy & Awareness tile — backend gating", () => {
  beforeEach(() => {
    mockHook.mockReset();
  });

  it("requests the christian-advocacy slug from the resolver", () => {
    mockHook.mockReturnValue({ uuidBySlug: {}, loading: false });
    renderPage();
    const slugs = mockHook.mock.calls[0][0] as string[];
    expect(slugs).toContain("christian-advocacy");
  });

  it("renders the disabled 'Nominations opening soon' state when the backend has no UUID", () => {
    mockHook.mockReturnValue({ uuidBySlug: {}, loading: false });
    renderPage();

    const tile = getAdvocacyTile();
    const disabledBtn = within(tile).getByRole("button", {
      name: /Nominations opening soon/i,
    });
    expect(disabledBtn).toBeDisabled();
    // No active Nominate link inside this tile while the backend row is missing.
    expect(within(tile).queryByRole("link", { name: /^Nominate$/ })).toBeNull();
  });

  it("flips to a working 'Nominate' link once the backend returns a UUID", () => {
    const resolvedUuid = "11111111-2222-3333-4444-555555555555";
    mockHook.mockReturnValue({
      uuidBySlug: { "christian-advocacy": resolvedUuid },
      loading: false,
    });
    renderPage();

    const tile = getAdvocacyTile();
    const link = within(tile).getByRole("link", { name: /^Nominate$/ });
    expect(link).toHaveAttribute(
      "href",
      `/nominate?subcategory=${resolvedUuid}`,
    );
    // Disabled fallback must be gone.
    expect(
      within(tile).queryByRole("button", { name: /Nominations opening soon/i }),
    ).toBeNull();
  });
});
