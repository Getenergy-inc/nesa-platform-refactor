// NESA-Africa NRC Arena — canonical team registry.
// 28 operational NRC teams · 75 approved member slots.
// Tiers: Africa Education Icon (9 groups · 18), Influencer (3 · 9),
// Platinum (7 · 21), Gold-Blue Garnet (9 · 27).

export type NrcTier =
  | "icon"
  | "influencer"
  | "platinum"
  | "gold_blue_garnet";

export interface NrcTeam {
  slug: string;
  name: string;
  tier: NrcTier;
  category: string;
  pathway?: string;          // Icon classification / Influencer pathway
  memberSlots: number;       // 2 for Icon, 3 elsewhere
  roles: string[];           // Team role slots
}

export const NRC_TIER_META: Record<NrcTier, { label: string; short: string; accent: string }> = {
  icon: { label: "Africa Education Icon", short: "Icon", accent: "text-gold" },
  influencer: { label: "Influencer Education Impact", short: "Influencer", accent: "text-sky-400" },
  platinum: { label: "Platinum Recognition", short: "Platinum", accent: "text-slate-200" },
  gold_blue_garnet: { label: "Gold-Blue Garnet", short: "Gold-Blue Garnet", accent: "text-amber-300" },
};

const ICON_CATEGORIES = [
  "Education Philanthropy",
  "Literary and New Curriculum",
  "Africa Technical Educator",
];
const ICON_CLASSIFICATIONS = [
  "African in Africa",
  "African in the Diaspora",
  "Friend of Africa",
];

const INFLUENCER_PATHWAYS = [
  "Social Media Education Impact",
  "Sports for Education Impact",
  "Music for Education Impact",
];

const PLATINUM_CATEGORIES = [
  "Lifetime Africa Education Legacy",
  "Institutional Research and Development",
  "Government and Policy Leadership",
  "Continental Education Reform",
  "Multilateral Education Partnership",
  "Faith-Based Education Institution",
  "Diaspora Education Leadership",
];

const GBG_CATEGORIES = [
  "Best CSR for Education — Africa Regional",
  "Best NGO Contribution to Education",
  "EdTech Innovation for Africa",
  "STEM Education Excellence",
  "Girls & Women in Education",
  "Green & Sustainable Education",
  "Vocational and Skills Development",
  "Early Childhood & Basic Education",
  "Higher Education Impact",
];

const ICON_ROLES = ["Primary Research Reviewer", "Secondary Verification Reviewer"];
const STANDARD_ROLES = [
  "Team Lead & Eligibility Reviewer",
  "Evidence & Impact Reviewer",
  "Quality & Public-Profile Reviewer",
];

function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const NRC_TEAMS: NrcTeam[] = [
  // Icon — 9 groups of 2 = 18
  ...ICON_CATEGORIES.flatMap((cat) =>
    ICON_CLASSIFICATIONS.map<NrcTeam>((cls) => ({
      slug: `icon-${slugify(cat)}-${slugify(cls)}`,
      name: `${cat} · ${cls}`,
      tier: "icon",
      category: cat,
      pathway: cls,
      memberSlots: 2,
      roles: ICON_ROLES,
    })),
  ),
  // Influencer — 3 pathways × 3 = 9
  ...INFLUENCER_PATHWAYS.map<NrcTeam>((p) => ({
    slug: `influencer-${slugify(p)}`,
    name: p,
    tier: "influencer",
    category: "Influencer Education Impact",
    pathway: p,
    memberSlots: 3,
    roles: STANDARD_ROLES,
  })),
  // Platinum — 7 × 3 = 21
  ...PLATINUM_CATEGORIES.map<NrcTeam>((c) => ({
    slug: `platinum-${slugify(c)}`,
    name: c,
    tier: "platinum",
    category: c,
    memberSlots: 3,
    roles: STANDARD_ROLES,
  })),
  // Gold-Blue Garnet — 9 × 3 = 27
  ...GBG_CATEGORIES.map<NrcTeam>((c) => ({
    slug: `gbg-${slugify(c)}`,
    name: c,
    tier: "gold_blue_garnet",
    category: c,
    memberSlots: 3,
    roles: STANDARD_ROLES,
  })),
];

export const NRC_TOTALS = {
  teams: NRC_TEAMS.length,                                          // 28
  slots: NRC_TEAMS.reduce((n, t) => n + t.memberSlots, 0),          // 75
};

export function getNrcTeamsByTier(tier: NrcTier): NrcTeam[] {
  return NRC_TEAMS.filter((t) => t.tier === tier);
}

export function getNrcTeam(slug: string): NrcTeam | undefined {
  return NRC_TEAMS.find((t) => t.slug === slug);
}
