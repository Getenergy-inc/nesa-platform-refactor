/**
 * Nominee Category Registry — single source of truth for tier + CTA logic.
 * Used by /nominees, landing page category rails, and category landing pages.
 *
 * Global CTA Rule:
 *   - Blue Garnet category → Secondary CTA = "Vote"
 *   - All other categories → Secondary CTA = "Re-nominate"
 *   - Primary CTA on every category card = "Explore Nominees"
 */

export type RecognitionTier = "blue_garnet" | "gold" | "platinum" | "icon" | "regional";
export type SecondaryCTA = "vote" | "renominate";

export interface NomineeCategoryConfig {
  slug: string;
  name: string;
  tier: RecognitionTier;
  secondaryCta: SecondaryCTA;
  description?: string;
}

/**
 * Slugs (or slug fragments) that identify Blue Garnet categories.
 * Match is substring-insensitive against the runtime categorySlug.
 */
const BLUE_GARNET_SLUG_FRAGMENTS = [
  "blue-garnet",
  "lifetime-africa-icon",
  "africa-education-icon",
  "continental-leader",
  "diaspora-excellence",
];

const ICON_SLUG_FRAGMENTS = ["africa-education-icon", "icon-award"];
const REGIONAL_SLUG_FRAGMENTS = ["regional", "state-education", "africa-regional"];

export function getCategoryTier(slug: string): RecognitionTier {
  const s = slug.toLowerCase();
  if (BLUE_GARNET_SLUG_FRAGMENTS.some((f) => s.includes(f))) {
    // Icon overlaps with Blue Garnet in some cases — Blue Garnet wins for CTA logic.
    if (ICON_SLUG_FRAGMENTS.some((f) => s.includes(f)) && !s.includes("blue-garnet")) {
      return "icon";
    }
    return "blue_garnet";
  }
  if (REGIONAL_SLUG_FRAGMENTS.some((f) => s.includes(f))) return "regional";
  return "gold";
}

export function getSecondaryCta(slug: string): SecondaryCTA {
  return getCategoryTier(slug) === "blue_garnet" ? "vote" : "renominate";
}

export function getSecondaryCtaLabel(slug: string): string {
  return getSecondaryCta(slug) === "vote" ? "Vote" : "Re-nominate";
}

/**
 * Build the secondary CTA destination for a category.
 *   - vote       → /vote?category={slug}
 *   - renominate → /nominate?category={slug}
 */
export function getSecondaryCtaHref(slug: string): string {
  return getSecondaryCta(slug) === "vote"
    ? `/vote?category=${encodeURIComponent(slug)}`
    : `/nominate?category=${encodeURIComponent(slug)}`;
}

export const TIER_BADGE_STYLES: Record<RecognitionTier, { label: string; className: string }> = {
  blue_garnet: {
    label: "Blue Garnet",
    className: "bg-blue-900/40 text-blue-200 border-blue-400/40",
  },
  gold: { label: "Gold", className: "bg-gold/15 text-gold border-gold/40" },
  platinum: { label: "Platinum", className: "bg-ivory/15 text-ivory border-ivory/40" },
  icon: { label: "Icon", className: "bg-gold/20 text-gold border-gold/60" },
  regional: { label: "Regional", className: "bg-emerald-500/15 text-emerald-300 border-emerald-400/40" },
};
