/**
 * Nominee Category Registry — single source of truth for tier + CTA logic.
 * Used by /nominees, landing page category rails, category landing pages,
 * profile pages, sliders, and discovery surfaces.
 *
 * Tier Identity System (NESA-Africa multi-tier recognition ecosystem):
 *   - blue_garnet      → premium voting-enabled awards (Vote CTA)
 *   - platinum         → elite institutional recognition (Re-nominate)
 *   - legacy_icon      → heritage hall-of-fame icon awards (Re-nominate)
 *   - influencer_impact→ creator / social-impact recognition (Re-nominate)
 *   - gold             → standard recognition (Re-nominate)
 *   - regional         → regional / state recognition (Re-nominate)
 *
 * Global CTA Rule:
 *   - Primary CTA on every card  = "Explore Nominees" / "View Profile"
 *   - Secondary CTA on Blue Garnet = "Vote"
 *   - Secondary CTA on all others  = "Re-nominate"
 *   (Future: Support / Donate / Join Campaign / Attend Gala / View Legacy)
 */

export type RecognitionTier =
  | "blue_garnet"
  | "platinum"
  | "legacy_icon"
  | "influencer_impact"
  | "gold"
  | "regional";

export type SecondaryCTA = "vote" | "renominate";

export interface NomineeCategoryConfig {
  slug: string;
  name: string;
  tier: RecognitionTier;
  secondaryCta: SecondaryCTA;
  description?: string;
}

/**
 * Slugs / slug-fragments that identify each tier. Matching is
 * substring-insensitive against the runtime categorySlug.
 *
 * Order of precedence inside getCategoryTier():
 *   1. blue_garnet  (active voting wins over all overlaps)
 *   2. legacy_icon  (heritage hall-of-fame)
 *   3. influencer_impact
 *   4. platinum
 *   5. regional
 *   6. gold (default)
 */
const BLUE_GARNET_SLUG_FRAGMENTS = [
  "blue-garnet",
  "continental-leader",
  "diaspora-excellence",
  // 9 official Blue Garnet competitive categories
  "best-csr-education-africa",
  "best-csr-education-nigeria",
  "best-edutech-organisation-africa",
  "best-media-educational-advocacy-nigeria",
  "best-ngo-education-nigeria",
  "best-ngo-education-africa",
  "best-stem-education-africa",
  "creative-arts-education-nigeria",
  "best-education-friendly-state-nigeria",
];

const LEGACY_ICON_SLUG_FRAGMENTS = [
  "africa-education-icon-award",
  "africa-education-icon",
  "lifetime-africa-icon",
  "icon-award",
  "icon-philanthropy",
  "icon-literary",
  "icon-technical",
  "legacy-icon",
  "hall-of-fame",
];

const INFLUENCER_IMPACT_SLUG_FRAGMENTS = [
  "africa-sports-education-impact",
  "africa-music-education-impact",
  "africa-social-media-education-impact",
  "social-media-education",
  "influencer-impact",
  "creative-impact",
  "social-impact-recognition",
];

const PLATINUM_SLUG_FRAGMENTS = [
  "best-library-tertiary-nigeria",
  "best-research-development-nigeria",
  "christian-education-impact-africa",
  "islamic-education-impact-africa",
  "political-leaders-education-nigeria",
  "international-bilateral-education",
  "diaspora-education-impact",
  "platinum-recognition",
  "platinum-award",
];

const REGIONAL_SLUG_FRAGMENTS = [
  "regional",
  "state-education",
  "africa-regional",
];

export function getCategoryTier(slug: string): RecognitionTier {
  const s = (slug || "").toLowerCase();
  if (BLUE_GARNET_SLUG_FRAGMENTS.some((f) => s.includes(f))) return "blue_garnet";
  if (LEGACY_ICON_SLUG_FRAGMENTS.some((f) => s.includes(f))) return "legacy_icon";
  if (INFLUENCER_IMPACT_SLUG_FRAGMENTS.some((f) => s.includes(f))) return "influencer_impact";
  if (PLATINUM_SLUG_FRAGMENTS.some((f) => s.includes(f))) return "platinum";
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

/**
 * Tier-aware presentation tokens consumed by nominee cards, category cards,
 * profile headers, sliders, and trending surfaces. All colors use Tailwind
 * utility classes that map back to the global Charcoal/Gold design system.
 */
export interface TierStyle {
  /** Short label shown in the badge */
  label: string;
  /** Longer descriptive tag, e.g. profile chips */
  longLabel: string;
  /** Badge class (background + text + border) */
  className: string;
  /** Card border / outline class */
  cardBorderClass: string;
  /** Card subtle background gradient class */
  cardBgClass: string;
  /** Secondary (outline) CTA class */
  secondaryCtaClass: string;
  /** Accent text color for tier-specific copy */
  accentTextClass: string;
  /** Soft tint used for icon chips, dots, etc. */
  accentSoftClass: string;
}

export const TIER_BADGE_STYLES: Record<RecognitionTier, TierStyle> = {
  blue_garnet: {
    label: "Blue Garnet",
    longLabel: "Blue Garnet Voting Award",
    className: "bg-blue-900/40 text-blue-100 border-blue-400/50",
    cardBorderClass: "border-blue-400/40 hover:border-blue-300/70",
    cardBgClass: "bg-gradient-to-br from-blue-950/60 via-charcoal-light to-charcoal",
    secondaryCtaClass: "border-blue-300/50 text-blue-100 hover:bg-blue-400/10",
    accentTextClass: "text-blue-200",
    accentSoftClass: "bg-blue-400/15 text-blue-200",
  },
  platinum: {
    label: "Platinum",
    longLabel: "Platinum Recognition",
    className: "bg-ivory/15 text-ivory border-ivory/50",
    cardBorderClass: "border-ivory/25 hover:border-ivory/60",
    cardBgClass: "bg-gradient-to-br from-slate-800/40 via-charcoal-light to-charcoal",
    secondaryCtaClass: "border-ivory/40 text-ivory hover:bg-ivory/10",
    accentTextClass: "text-ivory",
    accentSoftClass: "bg-ivory/10 text-ivory",
  },
  legacy_icon: {
    label: "Legacy Icon",
    longLabel: "African Education Legacy Icon",
    className: "bg-amber-900/30 text-amber-200 border-amber-400/60",
    cardBorderClass: "border-amber-500/40 hover:border-amber-300/70",
    cardBgClass: "bg-gradient-to-br from-amber-950/40 via-charcoal-light to-charcoal",
    secondaryCtaClass: "border-amber-300/50 text-amber-100 hover:bg-amber-400/10",
    accentTextClass: "text-amber-200",
    accentSoftClass: "bg-amber-400/15 text-amber-200",
  },
  influencer_impact: {
    label: "Influencer Impact",
    longLabel: "Social Impact Recognition",
    className: "bg-fuchsia-900/30 text-fuchsia-100 border-fuchsia-400/50",
    cardBorderClass: "border-fuchsia-400/35 hover:border-fuchsia-300/70",
    cardBgClass: "bg-gradient-to-br from-fuchsia-950/40 via-charcoal-light to-charcoal",
    secondaryCtaClass: "border-fuchsia-300/50 text-fuchsia-100 hover:bg-fuchsia-400/10",
    accentTextClass: "text-fuchsia-200",
    accentSoftClass: "bg-fuchsia-400/15 text-fuchsia-200",
  },
  gold: {
    label: "Gold",
    longLabel: "Gold Recognition",
    className: "bg-gold/15 text-gold border-gold/50",
    cardBorderClass: "border-gold/20 hover:border-gold/55",
    cardBgClass: "bg-gradient-to-br from-charcoal-light to-charcoal",
    secondaryCtaClass: "border-gold/40 text-gold hover:bg-gold/10",
    accentTextClass: "text-gold",
    accentSoftClass: "bg-gold/15 text-gold",
  },
  regional: {
    label: "Regional",
    longLabel: "Regional Recognition",
    className: "bg-emerald-500/15 text-emerald-200 border-emerald-400/50",
    cardBorderClass: "border-emerald-400/30 hover:border-emerald-300/60",
    cardBgClass: "bg-gradient-to-br from-emerald-950/40 via-charcoal-light to-charcoal",
    secondaryCtaClass: "border-emerald-300/50 text-emerald-100 hover:bg-emerald-400/10",
    accentTextClass: "text-emerald-200",
    accentSoftClass: "bg-emerald-400/15 text-emerald-200",
  },
};

export function getTierStyle(slug: string): TierStyle {
  return TIER_BADGE_STYLES[getCategoryTier(slug)];
}
