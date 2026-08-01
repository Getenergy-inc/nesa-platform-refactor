// ============================================================================
// Africa's Education Impact Directory — Canonical Catalogue Taxonomy
//
// Maps every award category stored in the database onto the approved
// NESA-Africa 2026 Recognition Framework hierarchy:
//
//   Award Tier → Award Category → Award Subcategory → Existing Nominees
//
// This file is presentation-layer only: it never mutates nominee records.
// Nominees whose category slug has no confirmed tier mapping are surfaced in
// the Migration Review Queue rather than being guessed, deleted, or hidden.
// ============================================================================

export type CatalogueTierSlug =
  | "blue-garnet"
  | "platinum"
  | "africa-education-icon"
  | "influencer-education-impact";

export interface CatalogueTier {
  slug: CatalogueTierSlug;
  /** Public tier label. */
  name: string;
  /** Tier ordinal used in the directory (Tier 1 → Tier 4). */
  tierNumber: 1 | 2 | 3 | 4;
  blurb: string;
  /** Tier landing page on the awards side of the site. */
  awardHref: string;
}

export const CATALOGUE_TIERS: CatalogueTier[] = [
  {
    slug: "blue-garnet",
    name: "Blue Garnet Award",
    tierNumber: 1,
    blurb:
      "Competitive recognition for organisations, programmes and institutions advancing Education for All across Africa.",
    awardHref: "/awards/blue-garnet",
  },
  {
    slug: "platinum",
    name: "Platinum Recognition",
    tierNumber: 2,
    blurb:
      "Institutional and systemic recognition for libraries, research, faith-based education, political leadership, international partners and the diaspora.",
    awardHref: "/awards/platinum",
  },
  {
    slug: "africa-education-icon",
    name: "Africa Education Icon",
    tierNumber: 3,
    blurb:
      "Lifetime legacy recognition across three pathways — Philanthropy, Literary & New Curriculum, and Technical Education.",
    awardHref: "/awards/africa-education-icon",
  },
  {
    slug: "influencer-education-impact",
    name: "Influencer Education Impact",
    tierNumber: 4,
    blurb:
      "Recognition for social media, sports and music enablers using their platform to advance education across Africa.",
    awardHref: "/awards/influencer-education-impact",
  },
];

export const TIER_BY_SLUG: Record<CatalogueTierSlug, CatalogueTier> =
  Object.fromEntries(CATALOGUE_TIERS.map((t) => [t.slug, t])) as Record<
    CatalogueTierSlug,
    CatalogueTier
  >;

export interface CatalogueCategoryMapping {
  /** Category slug as stored in `public.categories`. */
  categorySlug: string;
  /** Directory display name (overrides the raw database name). */
  displayName: string;
  tier: CatalogueTierSlug;
  /** Geographic scope label shown on the category card. */
  scope: "Africa Regional" | "Nigeria" | "Continental" | "Global";
  /** Nomination form deep link for this category. */
  nominateHref: string;
  /** Mapping confidence, 0–1. Anything below 0.9 lands in review. */
  confidence: number;
}

/**
 * Confirmed mappings from database category slug → recognition tier.
 * Sourced from the locked 22-page category architecture.
 */
export const CATEGORY_MAPPINGS: CatalogueCategoryMapping[] = [
  // ── Tier 1 · Blue Garnet ────────────────────────────────────────────────
  {
    categorySlug: "best-csr-education-africa",
    displayName: "Best CSR for Education — Africa Regional",
    tier: "blue-garnet",
    scope: "Africa Regional",
    nominateHref: "/nominate?category=csr-for-education&scope=africa",
    confidence: 1,
  },
  {
    categorySlug: "best-csr-education-nigeria",
    displayName: "Best CSR for Education — Nigeria",
    tier: "blue-garnet",
    scope: "Nigeria",
    nominateHref: "/nominate?category=csr-for-education&scope=nigeria",
    confidence: 1,
  },
  {
    categorySlug: "best-edutech-organisation-africa",
    displayName: "Best EduTech Innovation",
    tier: "blue-garnet",
    scope: "Africa Regional",
    nominateHref: "/nominate?category=edtech-and-ai-innovation",
    confidence: 1,
  },
  {
    categorySlug: "best-media-educational-advocacy-nigeria",
    displayName: "Media Organisations Supporting Education",
    tier: "blue-garnet",
    scope: "Nigeria",
    nominateHref: "/nominate?category=media-and-journalism-for-education",
    confidence: 1,
  },
  {
    categorySlug: "best-ngo-education-nigeria",
    displayName: "NGOs Supporting Education — Nigeria",
    tier: "blue-garnet",
    scope: "Nigeria",
    nominateHref: "/nominate?category=ngos-advancing-education&scope=nigeria",
    confidence: 1,
  },
  {
    categorySlug: "best-ngo-education-africa",
    displayName: "NGOs Supporting Education — Africa Regional",
    tier: "blue-garnet",
    scope: "Africa Regional",
    nominateHref: "/nominate?category=ngos-advancing-education&scope=africa",
    confidence: 1,
  },
  {
    categorySlug: "best-stem-education-africa",
    displayName: "STEM Education Programme",
    tier: "blue-garnet",
    scope: "Africa Regional",
    nominateHref: "/nominate?category=stem-education",
    confidence: 1,
  },
  {
    categorySlug: "creative-arts-education-nigeria",
    displayName: "Creative Industries Supporting Education",
    tier: "blue-garnet",
    scope: "Nigeria",
    nominateHref: "/nominate?category=media-and-journalism-for-education&track=creative",
    confidence: 1,
  },
  {
    categorySlug: "best-education-friendly-state-nigeria",
    displayName: "Education Policy & Implementation",
    tier: "blue-garnet",
    scope: "Nigeria",
    nominateHref: "/nominate?category=education-policy-and-government",
    confidence: 1,
  },

  // ── Tier 2 · Platinum ───────────────────────────────────────────────────
  {
    categorySlug: "best-library-tertiary-nigeria",
    displayName: "Libraries",
    tier: "platinum",
    scope: "Nigeria",
    nominateHref: "/nominate?category=libraries-and-knowledge-systems",
    confidence: 1,
  },
  {
    categorySlug: "best-research-development-nigeria",
    displayName: "Research & Development",
    tier: "platinum",
    scope: "Nigeria",
    nominateHref: "/nominate?category=research-and-curriculum-development",
    confidence: 1,
  },
  {
    categorySlug: "christian-education-impact-africa",
    displayName: "Christian Education Impact",
    tier: "platinum",
    scope: "Africa Regional",
    nominateHref: "/nominate?category=faith-based-organisations&track=christian",
    confidence: 1,
  },
  {
    categorySlug: "islamic-education-impact-africa",
    displayName: "Islamic Education Impact",
    tier: "platinum",
    scope: "Africa Regional",
    nominateHref: "/nominate?category=faith-based-organisations&track=islamic",
    confidence: 1,
  },
  {
    categorySlug: "political-leaders-education-nigeria",
    displayName: "Political Leadership",
    tier: "platinum",
    scope: "Nigeria",
    nominateHref: "/nominate?category=education-policy-and-government&track=political",
    confidence: 1,
  },
  {
    categorySlug: "international-bilateral-education",
    displayName: "International Partnership",
    tier: "platinum",
    scope: "Global",
    nominateHref: "/nominate?category=institutional-and-bilateral-grants",
    confidence: 1,
  },
  {
    categorySlug: "diaspora-education-impact",
    displayName: "Diaspora Educational Impact",
    tier: "platinum",
    scope: "Global",
    nominateHref: "/nominate?category=education-philanthropy&track=diaspora",
    confidence: 1,
  },

  // ── Tier 3 · Africa Education Icon ──────────────────────────────────────
  {
    categorySlug: "africa-education-icon-award",
    displayName: "Africa Education Icon (2006–2026)",
    tier: "africa-education-icon",
    scope: "Continental",
    nominateHref: "/awards/africa-education-icon#nominate",
    confidence: 1,
  },

  // ── Tier 4 · Influencer Education Impact ────────────────────────────────
  {
    categorySlug: "africa-social-media-influencer-education",
    displayName: "Social Media Education Champions",
    tier: "influencer-education-impact",
    scope: "Continental",
    nominateHref: "/awards/influencer-education-impact#influencer-nomination-form",
    confidence: 1,
  },
  {
    categorySlug: "africa-sports-influencer-education",
    displayName: "Sports Icons Supporting Education",
    tier: "influencer-education-impact",
    scope: "Continental",
    nominateHref: "/awards/influencer-education-impact#influencer-nomination-form",
    confidence: 1,
  },
  {
    categorySlug: "africa-music-influencer-education",
    displayName: "Music Icons Supporting Education",
    tier: "influencer-education-impact",
    scope: "Continental",
    nominateHref: "/awards/influencer-education-impact#influencer-nomination-form",
    confidence: 1,
  },
];

export const CATEGORY_MAP: Record<string, CatalogueCategoryMapping> =
  Object.fromEntries(CATEGORY_MAPPINGS.map((c) => [c.categorySlug, c]));

/** Minimum confidence required to place a nominee inside the catalogue. */
export const MIN_MAPPING_CONFIDENCE = 0.9;

/** Region suffixes appended to regional subcategory permutations. */
const REGION_SUFFIXES = [
  "north-africa",
  "west-africa",
  "east-africa",
  "central-africa",
  "southern-africa",
  "horn-africa",
  "sahel",
  "indian-ocean-islands",
];

/**
 * Collapse a regional subcategory permutation back to its base subcategory
 * family, e.g. `csr-africa-banking-north-africa` → `csr-africa-banking`.
 */
export function subcategoryFamilySlug(subcategorySlug: string): string {
  for (const suffix of REGION_SUFFIXES) {
    if (subcategorySlug.endsWith(`-${suffix}`)) {
      return subcategorySlug.slice(0, -(suffix.length + 1));
    }
  }
  return subcategorySlug;
}

/** Strip the trailing "(Region)" qualifier from a subcategory display name. */
export function subcategoryFamilyName(subcategoryName: string): string {
  return subcategoryName.replace(/\s*\([^)]*\)\s*$/, "").trim() || subcategoryName;
}

export function resolveTierForCategory(
  categorySlug: string | null | undefined,
): CatalogueCategoryMapping | null {
  if (!categorySlug) return null;
  return CATEGORY_MAP[categorySlug] ?? null;
}
