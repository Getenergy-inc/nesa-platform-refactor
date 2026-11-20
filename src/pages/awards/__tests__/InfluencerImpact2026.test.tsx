import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import InfluencerImpact2026 from "../InfluencerImpact2026";
import { AWARD_TIERS_2026 } from "@/config/awardTiers2026";
import { OFFICIAL_NOMINATION_FORM_URL } from "@/config/nomination/officialGoogleForm";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string) => fallback,
    i18n: { language: "en" },
  }),
}));
vi.mock("react-helmet-async", () => ({ Helmet: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("@/components/nesa/NESAHeader", () => ({ NESAHeader: () => <div /> }));
vi.mock("@/hooks/useNominees", () => ({ useNominees: () => ({ data: [], isLoading: false }) }));
vi.mock("@/components/nesa/NESAFooter", () => ({ NESAFooter: () => <div /> }));
vi.mock("@/components/seo/LocalizedSEO", () => ({ LocalizedSEO: () => null }));
vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));
vi.mock("@/components/awards/InfluencerPathwayNomineeSlider", () => ({
  InfluencerPathwayNomineeSlider: () => <div>Live nominee pathways</div>,
}));
vi.mock("@/hooks/useInfluencerPathwayNominees", () => ({
  useInfluencerPathwayNominees: () => ({ total: 12, loading: false, error: null }),
}));
vi.mock("@/components/nominate/OfficialNominationForm", () => ({
  OfficialNominationForm: ({ id, heading }: { id: string; heading: string }) => (
    <section id={id}>
      <h2>{heading}</h2>
      <a href={OFFICIAL_NOMINATION_FORM_URL}>Official Google nomination form</a>
    </section>
  ),
}));

const tier = AWARD_TIERS_2026.find((entry) => entry.id === "influencers")!;
const categoryHrefs = [
  "/recognition/influencer-education-impact/african-social-media-influencers",
  "/recognition/influencer-education-impact/african-sports-icons-supporting-education",
  "/recognition/influencer-education-impact/african-music-icons-supporting-education",
];

function renderPage() {
  return render(<MemoryRouter><InfluencerImpact2026 /></MemoryRouter>);
}

describe("Tier 2 Influencers Education Impact page", () => {
  it("shows exactly the three approved Tier 2 categories and their canonical links", () => {
    renderPage();
    expect(tier.tierNumber).toBe(2);
    expect(screen.getByRole("heading", { level: 1, name: "Influencers Education Impact" })).toBeInTheDocument();

    const list = screen.getByRole("list", { name: "Tier 2 award categories" });
    const cards = within(list).getAllByRole("listitem");
    expect(cards).toHaveLength(3);

    tier.categories.forEach((category, index) => {
      expect(within(cards[index]).getByRole("heading", { name: category.name })).toBeInTheDocument();
      expect(within(cards[index]).getByRole("link", { name: "Explore this category" })).toHaveAttribute("href", categoryHrefs[index]);
    });
  });

  it("uses the official free nomination channel and states the no-public-voting rule", () => {
    renderPage();
    expect(screen.getByText("Nomination is free. There is no public voting in 2026.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Official Google nomination form" })).toHaveAttribute("href", OFFICIAL_NOMINATION_FORM_URL);
    expect(screen.getByRole("link", { name: "Open official form" })).toHaveAttribute("href", OFFICIAL_NOMINATION_FORM_URL);
    expect(screen.queryByText(/Gold-Blue Garnet Gala/i)).not.toBeInTheDocument();
  });

  it("displays the live nominee total rather than a fabricated static count", () => {
    renderPage();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Published nominee profiles")).toBeInTheDocument();
  });
});
