// awardThemes.ts — per-award visual identity tokens (Phase 1 of the Award Pages Module).
//
// Every award/category page keeps the institutional Charcoal base. What varies is a
// single accent token plus an optional banner + icon key. Values are raw HSL triples
// so they can be injected as CSS custom properties (`--award-accent`) on the page
// wrapper and consumed as `hsl(var(--award-accent))` — never as hardcoded utilities.
//
// Resolution order: explicit slug override → tier default → global gold.

import type { TierSlug } from "@/config/recognition2026/tiers";

export interface AwardTheme {
  /** HSL triple, e.g. "42 85% 52%" */
  accent: string;
  /** Softer companion tone used for gradients / glows. HSL triple. */
  accentSoft: string;
  /** lucide-react icon name rendered in the eyebrow / seal. */
  iconKey: string;
  /** Optional banner image for the section band. */
  bannerSrc?: string;
  /** Short label shown on the award seal. */
  sealLabel?: string;
}

/** Global fallback — the canonical NESA gold. */
export const DEFAULT_AWARD_THEME: AwardTheme = {
  accent: "42 85% 52%",
  accentSoft: "42 70% 38%",
  iconKey: "Award",
  sealLabel: "NESA-Africa 2026",
};

/** Tier-level defaults. */
export const TIER_THEMES: Record<TierSlug, AwardTheme> = {
  "africa-education-icon": {
    accent: "42 92% 56%",
    accentSoft: "34 70% 40%",
    iconKey: "Crown",
    sealLabel: "Africa Education Icon",
  },
  "influencer-education-impact": {
    accent: "18 85% 58%",
    accentSoft: "12 65% 42%",
    iconKey: "Megaphone",
    sealLabel: "Influencer Impact",
  },
  platinum: {
    accent: "45 30% 78%",
    accentSoft: "45 18% 55%",
    iconKey: "Gem",
    sealLabel: "Platinum Recognition",
  },
  "gold-blue-garnet": {
    accent: "212 72% 58%",
    accentSoft: "218 60% 40%",
    iconKey: "Sparkles",
    sealLabel: "Gold-Blue Garnet",
  },
};

/**
 * Per-award overrides. Keys are the canonical subpage slugs produced by
 * `src/config/awards/subpages2026.ts` — subcategory codes (lowercased) for the
 * Icon/Influencer tiers, and category slugs for Platinum / Gold-Blue Garnet.
 * Anything absent inherits its tier theme.
 */
export const AWARD_THEME_OVERRIDES: Record<string, Partial<AwardTheme>> = {
  // Africa Education Icon pathways
  "icon-phil": { accent: "42 92% 56%", iconKey: "HeartHandshake" },
  "icon-lit": { accent: "38 78% 52%", iconKey: "BookOpen" },
  "icon-tech": { accent: "30 72% 50%", iconKey: "Wrench" },

  // Influencer Education Impact
  "inf-soc": { accent: "199 84% 55%", iconKey: "Share2" },
  "inf-spt": { accent: "142 62% 45%", iconKey: "Trophy" },
  "inf-mus": { accent: "286 62% 62%", iconKey: "Music" },

  // Platinum
  "best-tertiary-institution-library": { accent: "28 55% 55%", iconKey: "Library" },
  "research-development-education": { accent: "172 55% 45%", iconKey: "FlaskConical" },
  "christian-education-impact": { accent: "48 45% 62%", iconKey: "Church" },
  "islamic-education-impact": { accent: "158 40% 52%", iconKey: "Moon" },
  "political-leadership-education": { accent: "352 55% 55%", iconKey: "Landmark" },
  "international-partnership-education": { accent: "205 62% 58%", iconKey: "Globe2" },
  "diaspora-educational-impact": { accent: "268 55% 65%", iconKey: "Plane" },

  // Gold-Blue Garnet
  "best-csr-education-africa": { accent: "196 68% 50%", iconKey: "Building2" },
  "best-csr-education-nigeria": { accent: "192 62% 46%", iconKey: "Building" },
  "best-edtech-innovation-africa": { accent: "184 70% 46%", iconKey: "Cpu" },
  "best-media-education-advocacy-nigeria": { accent: "232 62% 62%", iconKey: "Radio" },
  "best-ngo-education-nigeria": { accent: "212 72% 58%", iconKey: "Users" },
  "best-ngo-education-africa": { accent: "216 66% 52%", iconKey: "UsersRound" },
  "best-stem-education-programme-africa": { accent: "160 62% 44%", iconKey: "Atom" },
  "best-creative-arts-education-nigeria": { accent: "320 60% 60%", iconKey: "Palette" },
  "best-education-policy-state-nigeria": { accent: "220 55% 52%", iconKey: "MapPinned" },
};


export function getAwardTheme(slug: string, tier?: TierSlug): AwardTheme {
  const base = (tier && TIER_THEMES[tier]) || DEFAULT_AWARD_THEME;
  const override = AWARD_THEME_OVERRIDES[slug];
  return override ? { ...base, ...override } : base;
}

/** CSS custom properties to spread onto a page wrapper's `style`. */
export function awardThemeVars(theme: AwardTheme): React.CSSProperties {
  return {
    ["--award-accent" as string]: theme.accent,
    ["--award-accent-soft" as string]: theme.accentSoft,
  };
}
