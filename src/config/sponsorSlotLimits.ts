// NESA-Africa 2026 — Sponsor Slot Limit Matrix
// Defines how many sponsors/partners are allowed per category, to protect
// sponsor value, brand visibility and award integrity.

export interface SponsorSlotRow {
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

export const SPONSOR_SLOT_GROUPS: SponsorSlotGroup[] = [
  {
    categorySlug: "partners",
    title: "1. Blue Diamond Sponsorship — Overall Programme",
    summary:
      "The highest sponsorship level — exclusive across the full NESA-Africa 2026 ecosystem.",
    rows: [
      {
        area: "Official Blue Diamond Partner — NESA-Africa 2026",
        mainSlots: "1 only",
        mainAmount: "$800,000",
        notes: "Exclusive continental partner status across the full ecosystem.",
      },
    ],
  },
  {
    categorySlug: "gala",
    title: "2. Award Gala Night Sponsor",
    summary:
      "One main sponsor holds the naming right; supporting partners cover hospitality, red carpet, media wall, VIP reception, cultural performance and accessibility.",
    rows: [
      { area: "Gala Night Main Sponsor", mainSlots: "1", mainAmount: "$200,000" },
      {
        area: "Gala Supporting Partners",
        mainSlots: "3–5",
        notes: "Hospitality · Red Carpet · Media Wall · VIP Reception · Accessibility",
      },
    ],
  },
  {
    title: "3. Africa Education Icon Award",
    summary:
      "A premium lifetime achievement recognition — kept uncrowded to protect prestige.",
    rows: [
      { area: "Africa Education Icon Main Sponsor", mainSlots: "1", mainAmount: "$100,000" },
      { area: "Legacy Documentary Partner", mainSlots: "1" },
      { area: "Icon Reception / Tribute Partner", mainSlots: "1" },
    ],
  },
  {
    categorySlug: "categories",
    title: "4. Gold / Blue Garnet Sponsorship",
    summary:
      "Exclusive category sponsorship with strict non-influence firewalls.",
    rows: [
      { area: "Main Gold / Blue Garnet Sponsor", mainSlots: "1 per category", mainAmount: "$150,000" },
      { area: "Supporting Media / Storytelling Partner", mainSlots: "1" },
      { area: "Optional Category Page Sponsor", mainSlots: "1–3" },
    ],
  },
  {
    title: "5. Platinum Recognition Sponsor",
    summary:
      "One main Platinum sponsor plus optional sub-category page sponsors.",
    rows: [
      { area: "Platinum Main Sponsor", mainSlots: "1", mainAmount: "$70,000" },
      { area: "Platinum Sub-Category Page Sponsors", mainSlots: "Maximum 3 per page" },
    ],
  },
  {
    title: "6. Influencers Education Impact Award",
    summary:
      "Built for digital amplification — one main sponsor with multiple specialised supporting partners.",
    rows: [
      { area: "Main Influencers Education Impact Sponsor", mainSlots: "1", mainAmount: "$50,000" },
      { area: "Youth Voice Partner", mainSlots: "1" },
      { area: "Digital Creator Partner", mainSlots: "1" },
      { area: "Social Media Amplification Partner", mainSlots: "1" },
      { area: "Radio / Community Campaign Partner", mainSlots: "1" },
      { area: "Category Page Sponsors", mainSlots: "1–3 per page" },
    ],
  },
  {
    title: "7. Sub-Category Page Sponsorship",
    summary:
      "Each sub-category page may carry a maximum of three sponsors.",
    rows: [
      { area: "Page Lead Sponsor", mainSlots: "1", mainAmount: "$5,000" },
      { area: "Page Supporting Sponsor", mainSlots: "1", mainAmount: "$2,500" },
      { area: "Page Visibility Sponsor", mainSlots: "1", mainAmount: "$1,000" },
    ],
  },
  {
    categorySlug: "webinars",
    title: "8. EduAid-Africa Webinars & Events",
    summary: "One main sponsor per episode/event; supporting visibility available.",
    rows: [
      { area: "Webinar / Event Main Sponsor", mainSlots: "1 per episode" },
      { area: "Supporting Visibility Partners", mainSlots: "Up to 2 per episode" },
    ],
  },
  {
    categorySlug: "nesa-tv",
    title: "9. NESA-Africa TV Feature Sponsor",
    summary: "One main sponsor per feature, documentary or category coverage.",
    rows: [
      { area: "Feature / Category Main Sponsor", mainSlots: "1 per feature" },
      { area: "Episode Supporting Partners", mainSlots: "Up to 2 per episode" },
    ],
  },
  {
    title: "10. Endorsement Visibility",
    summary:
      "Unlimited, but grouped properly. Endorsements are not sponsorship and never imply award influence, sponsor control or winner-selection power.",
    rows: [
      { area: "Institutional Endorsers", mainSlots: "Unlimited", mainAmount: "$500" },
      { area: "Civil Society Endorsers", mainSlots: "Unlimited", mainAmount: "$500" },
      { area: "Academic Endorsers", mainSlots: "Unlimited", mainAmount: "$500" },
      { area: "Media Endorsers", mainSlots: "Unlimited", mainAmount: "$500" },
      { area: "Diaspora Endorsers", mainSlots: "Unlimited", mainAmount: "$500" },
      { area: "Corporate Support Endorsers", mainSlots: "Unlimited", mainAmount: "$500" },
    ],
  },
];

/** Policy statement displayed alongside the matrix. */
export const SPONSOR_SLOT_POLICY = `To protect sponsor value, brand visibility and award integrity, NESA-Africa 2026 limits sponsorship rights by category. Each major award category has only one main sponsor, while selected supporting partners may be allowed for media, storytelling, hospitality, visibility or legacy impact. Sub-category pages carry a maximum of three sponsors per page. Endorsement visibility is separate from sponsorship and does not create category ownership or influence over award outcomes.`;

export function getSlotGroupForCategory(slug?: string): SponsorSlotGroup | undefined {
  if (!slug) return undefined;
  return SPONSOR_SLOT_GROUPS.find((g) => g.categorySlug === slug);
}
