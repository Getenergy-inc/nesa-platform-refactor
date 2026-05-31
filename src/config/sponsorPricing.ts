// NESA-Africa 2026 — Master sponsorship pricing table.
// Derived from src/config/sponsorLaneCopy.ts so that headline, amount,
// sponsor limit and purpose are single-sourced. Update copy once → it
// propagates through the Pricing Table, Slot Matrix and Partnership Lane
// components.

import {
  SPONSOR_LANE_COPY,
  type SponsorLaneSlug,
  type SponsorLaneCopy,
} from "@/config/sponsorLaneCopy";

export interface SponsorPricingRow {
  slug?: SponsorLaneSlug;
  lane: string;
  amount: string;
  limit: string;
  purpose: string;
  /** Optional anchor link (internal route) for the lane CTA. */
  href?: string;
}

/** Order in which lanes appear in the master pricing table. */
const PRICING_ORDER: SponsorLaneSlug[] = [
  "blue-diamond",
  "gala-main",
  "gala-supporting",
  "africa-icon-main",
  "icon-documentary",
  "icon-tribute",
  "gold-blue-garnet-main",
  "blue-garnet-category",
  "platinum-main",
  "platinum-category",
  "influencers-main",
  "influencers-supporting",
  "eduaid-webinar-main",
  "eduaid-webinar-supporting",
  "nesa-tv-feature",
  "nesa-tv-supporting",
  "subcategory-lead",
  "subcategory-supporting",
  "subcategory-visibility",
  "supporter-visibility-listing",
  "merchandise-visibility",
  "rmsa-regional-partner",
];

function rowFromCopy(copy: SponsorLaneCopy): SponsorPricingRow {
  return {
    slug: copy.slug,
    lane: copy.headline,
    amount: copy.amount,
    limit: copy.sponsorLimit,
    purpose: copy.subheadline || copy.purpose,
    href: copy.href,
  };
}

export const SPONSOR_PRICING_ROWS: SponsorPricingRow[] = PRICING_ORDER.map(
  (slug) => rowFromCopy(SPONSOR_LANE_COPY[slug]),
);

/** 12 partnership lane cards displayed in the "Choose your partnership lane" grid. */
export interface SponsorLaneCard {
  slug?: SponsorLaneSlug;
  title: string;
  description: string;
  startingAmount: string;
  limit?: string;
  ctaLabel: string;
  href: string;
}

/**
 * Grid cards aggregate multiple related lanes (e.g. Gala = main + supporting)
 * so the title, description and starting amount are intentionally composed
 * rather than 1:1 to a lane copy block. Where a card maps cleanly to a single
 * lane, the `slug` is provided to keep CTA/href/limit in sync via the copy.
 */
export const SPONSOR_LANE_CARDS: SponsorLaneCard[] = [
  {
    title: "Sponsor the Blue Garnet Awards Gala",
    description:
      "Headline the Gala night, hospitality, red carpet, broadcast and VIP reception.",
    startingAmount: `Main ${SPONSOR_LANE_COPY["gala-main"].amount} · Supporting ${SPONSOR_LANE_COPY["gala-supporting"].amount}`,
    limit: "1 main + 3–5 supporting",
    ctaLabel: "Sponsor the Gala",
    href: "/sponsor/gala",
  },
  {
    title: "Sponsor Award Categories",
    description:
      "Own a Blue Garnet, Platinum, EduTech, STEM, NGO or regional award category.",
    startingAmount: `${SPONSOR_LANE_COPY["blue-garnet-category"].amount} – ${SPONSOR_LANE_COPY["gold-blue-garnet-main"].amount} / category`,
    limit: "1 per category",
    ctaLabel: "Sponsor a Category",
    href: "/sponsor/categories",
  },
  {
    slug: "africa-icon-main",
    title: "Sponsor Africa Education Icon",
    description:
      "Premium lifetime achievement recognition with documentary and tribute partners.",
    startingAmount: `Main ${SPONSOR_LANE_COPY["africa-icon-main"].amount} · Docu ${SPONSOR_LANE_COPY["icon-documentary"].amount}`,
    limit: SPONSOR_LANE_COPY["africa-icon-main"].sponsorLimit,
    ctaLabel: SPONSOR_LANE_COPY["africa-icon-main"].ctaLabel,
    href: SPONSOR_LANE_COPY["africa-icon-main"].href,
  },
  {
    slug: "platinum-main",
    title: "Sponsor Platinum Recognition",
    description:
      "Recognise verified excellence across institutional and sector categories.",
    startingAmount: `${SPONSOR_LANE_COPY["platinum-main"].amount} main · ${SPONSOR_LANE_COPY["platinum-category"].amount}`,
    limit: "1 main + 1 per category",
    ctaLabel: "Sponsor Platinum",
    href: SPONSOR_LANE_COPY["platinum-main"].href,
  },
  {
    slug: "influencers-main",
    title: "Sponsor Influencers Education Impact",
    description:
      "Power youth voice, creator cohorts, digital advocacy and social amplification.",
    startingAmount: `${SPONSOR_LANE_COPY["influencers-main"].amount} main · ${SPONSOR_LANE_COPY["influencers-supporting"].amount} supporting`,
    limit: "1 main + 3–6 supporting",
    ctaLabel: "Sponsor Influencers",
    href: SPONSOR_LANE_COPY["influencers-main"].href,
  },
  {
    slug: "eduaid-webinar-main",
    title: "Sponsor EduAid-Africa Webinars",
    description:
      "Fund parent, teacher, inclusion and community education webinars.",
    startingAmount: SPONSOR_LANE_COPY["eduaid-webinar-main"].amount,
    limit: "1 main + up to 2 supporting / episode",
    ctaLabel: "Sponsor a Webinar",
    href: SPONSOR_LANE_COPY["eduaid-webinar-main"].href,
  },
  {
    slug: "nesa-tv-feature",
    title: "Sponsor NESA-Africa TV Features",
    description:
      "Power broadcast storytelling, documentaries and online category features.",
    startingAmount: SPONSOR_LANE_COPY["nesa-tv-feature"].amount,
    limit: "1 main + up to 2 supporting / episode",
    ctaLabel: "Sponsor NESA-Africa TV",
    href: SPONSOR_LANE_COPY["nesa-tv-feature"].href,
  },
  {
    slug: "rmsa-regional-partner",
    title: "Sponsor Rebuild My School Africa",
    description:
      "Fund infrastructure, accessibility, libraries, WASH and learning resources.",
    startingAmount: "Approved amount — regional partner tier",
    limit: SPONSOR_LANE_COPY["rmsa-regional-partner"].sponsorLimit,
    ctaLabel: SPONSOR_LANE_COPY["rmsa-regional-partner"].ctaLabel,
    href: SPONSOR_LANE_COPY["rmsa-regional-partner"].href,
  },
  {
    title: "Sponsor Sub-Category Pages",
    description:
      "Page-level visibility across sub-category and regional listing pages.",
    startingAmount: `${SPONSOR_LANE_COPY["subcategory-visibility"].amount} – ${SPONSOR_LANE_COPY["subcategory-lead"].amount}`,
    limit: "Up to 3 sponsors per page",
    ctaLabel: "Sponsor a Page",
    href: "/contact?topic=sponsorship&lane=sub-category",
  },
  {
    title: "Become a Strategic Partner",
    description:
      "Multi-year programmatic partnership across awards, media, webinars and legacy impact.",
    startingAmount: "Custom — by MoU",
    ctaLabel: "Talk to Partnerships",
    href: "/contact?topic=sponsorship&lane=strategic",
  },
  {
    slug: "supporter-visibility-listing",
    title: "Join as Supporter Visibility Listing",
    description:
      "Public supporter listing for institutions, civil society, academia, media and diaspora.",
    startingAmount: SPONSOR_LANE_COPY["supporter-visibility-listing"].amount,
    limit: SPONSOR_LANE_COPY["supporter-visibility-listing"].sponsorLimit,
    ctaLabel: SPONSOR_LANE_COPY["supporter-visibility-listing"].ctaLabel,
    href: SPONSOR_LANE_COPY["supporter-visibility-listing"].href,
  },
  {
    title: "Request a Custom Partnership Package",
    description:
      "Tailored sponsorship across multiple lanes with CSR and ESG reporting.",
    startingAmount: "Custom — built with our partnerships team",
    ctaLabel: "Request a Proposal",
    href: "/contact?topic=sponsorship&lane=custom",
  },
];
