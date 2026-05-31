// NESA-Africa 2026 — Sponsor Slot Limit Matrix
// Defines how many sponsors/partners are allowed per category. Lane rows are
// derived from src/config/sponsorLaneCopy.ts so headline, amount and limit
// stay in lock-step with the Pricing Table and Partnership Lane components.

import {
  SPONSOR_LANE_COPY,
  type SponsorLaneSlug,
} from "@/config/sponsorLaneCopy";

export interface SponsorSlotRow {
  slug?: SponsorLaneSlug;
  area: string;
  mainSlots: string;         // e.g. "1 only"
  supportingSlots?: string;  // e.g. "3–5 supporting partners"
  mainAmount?: string;       // e.g. "$800,000"
  notes?: string;
}

export interface SponsorSlotGroup {
  /** Slug from SPONSOR_CATEGORIES this group maps to (when applicable) */
  categorySlug?: string;
  title: string;
  summary: string;
  rows: SponsorSlotRow[];
}

/** Build a row from a single lane copy block (headline / limit / amount). */
function rowFromLane(slug: SponsorLaneSlug, notes?: string): SponsorSlotRow {
  const copy = SPONSOR_LANE_COPY[slug];
  return {
    slug,
    area: copy.headline,
    mainSlots: copy.sponsorLimit,
    mainAmount: copy.amount,
    notes,
  };
}

export const SPONSOR_SLOT_GROUPS: SponsorSlotGroup[] = [
  {
    categorySlug: "partners",
    title: "1. Blue Diamond Sponsorship — Overall Programme",
    summary:
      "The highest sponsorship level — exclusive across the full NESA-Africa 2026 ecosystem.",
    rows: [
      rowFromLane(
        "blue-diamond",
        "Exclusive continental partner status across the full ecosystem.",
      ),
    ],
  },
  {
    categorySlug: "gala",
    title: "2. Award Gala Night Sponsor",
    summary:
      "One main sponsor holds the naming right; supporting partners cover hospitality, red carpet, media wall, VIP reception, cultural performance and accessibility.",
    rows: [
      rowFromLane("gala-main"),
      rowFromLane(
        "gala-supporting",
        "Hospitality · Red Carpet · Media Wall · VIP Reception · Accessibility",
      ),
    ],
  },
  {
    title: "3. Africa Education Icon Award",
    summary:
      "A premium lifetime achievement recognition — kept uncrowded to protect prestige.",
    rows: [
      rowFromLane("africa-icon-main"),
      rowFromLane("icon-documentary"),
      rowFromLane("icon-tribute"),
    ],
  },
  {
    categorySlug: "categories",
    title: "4. Gold / Blue Garnet Sponsorship",
    summary:
      "Exclusive category sponsorship with strict non-influence firewalls.",
    rows: [
      rowFromLane("gold-blue-garnet-main"),
      rowFromLane("blue-garnet-category"),
    ],
  },
  {
    title: "5. Platinum Recognition Sponsor",
    summary:
      "One main Platinum sponsor plus optional sub-category page sponsors.",
    rows: [
      rowFromLane("platinum-main"),
      rowFromLane("platinum-category"),
    ],
  },
  {
    title: "6. Influencers Education Impact Award",
    summary:
      "Built for digital amplification — one main sponsor with multiple specialised supporting partners.",
    rows: [
      rowFromLane("influencers-main"),
      rowFromLane(
        "influencers-supporting",
        "Youth voice · Digital creator · Social amplification · Radio / community campaign",
      ),
    ],
  },
  {
    title: "7. Sub-Category Page Sponsorship",
    summary:
      "Each sub-category page may carry a maximum of three sponsors.",
    rows: [
      rowFromLane("subcategory-lead"),
      rowFromLane("subcategory-supporting"),
      rowFromLane("subcategory-visibility"),
    ],
  },
  {
    categorySlug: "webinars",
    title: "8. EduAid-Africa Webinars & Events",
    summary: "One main sponsor per episode/event; supporting visibility available.",
    rows: [
      rowFromLane("eduaid-webinar-main"),
      rowFromLane("eduaid-webinar-supporting"),
    ],
  },
  {
    categorySlug: "nesa-tv",
    title: "9. NESA-Africa TV Feature Sponsor",
    summary: "One main sponsor per feature, documentary or category coverage.",
    rows: [
      rowFromLane("nesa-tv-feature"),
      rowFromLane("nesa-tv-supporting"),
    ],
  },
  {
    title: "10. Supporter Visibility Listing",
    summary:
      "Paid public supporter listings — unlimited but grouped by type. Supporter Visibility Listing does NOT create sponsorship rights, category ownership, judging authority, nomination influence, voting influence or winner-selection power.",
    rows: (
      [
        "Institutional Supporters",
        "Civil Society Supporters",
        "Academic Supporters",
        "Media Supporters",
        "Diaspora Supporters",
        "Corporate Supporters",
        "Community Supporters",
      ] as const
    ).map((area) => ({
      slug: "supporter-visibility-listing" as SponsorLaneSlug,
      area,
      mainSlots: "Unlimited",
      mainAmount: SPONSOR_LANE_COPY["supporter-visibility-listing"].amount,
    })),
  },
];

/** Policy statement displayed alongside the matrix. */
export const SPONSOR_SLOT_POLICY = `To protect sponsor value, brand visibility and award integrity, NESA-Africa 2026 limits sponsorship rights by category. Each major award category has only one main sponsor, while selected supporting partners may be allowed for media, storytelling, hospitality, visibility or legacy impact. Sub-category pages carry a maximum of three sponsors per page. Supporter Visibility Listing is a paid public listing — separate from sponsorship — and never creates category ownership or influence over award outcomes.`;

export function getSlotGroupForCategory(slug?: string): SponsorSlotGroup | undefined {
  if (!slug) return undefined;
  return SPONSOR_SLOT_GROUPS.find((g) => g.categorySlug === slug);
}
