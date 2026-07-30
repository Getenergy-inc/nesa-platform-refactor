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
 * Per-category overrides. Keys are canonical category slugs from
 * `src/config/recognition2026/categories`. Anything absent inherits its tier theme.
 */
export const AWARD_THEME_OVERRIDES: Record<string, Partial<AwardTheme>> = {
  // Africa Education Icon pathways
  "philanthropy-education": { accent: "42 92% 56%", iconKey: "HeartHandshake" },
  "literary-new-curriculum": { accent: "38 78% 52%", iconKey: "BookOpen" },
  "technical-education": { accent: "30 72% 50%", iconKey: "Wrench" },

  // Influencer Education Impact
  "social-media-influencer": { accent: "199 84% 55%", iconKey: "Share2" },
  "sports-influencer": { accent: "142 62% 45%", iconKey: "Trophy" },
  "music-influencer": { accent: "286 62% 62%", iconKey: "Music" },

  // Platinum
  "diaspora-education": { accent: "268 55% 65%", iconKey: "Globe2" },
  "international-education": { accent: "205 62% 58%", iconKey: "Plane" },
  "library-nigeria": { accent: "28 55% 55%", iconKey: "Library" },
  "research-development": { accent: "172 55% 45%", iconKey: "FlaskConical" },
  "political-leaders": { accent: "352 55% 55%", iconKey: "Landmark" },
  "creative-arts": { accent: "320 60% 60%", iconKey: "Palette" },
  "faith-education": { accent: "48 45% 62%", iconKey: "Church" },

  // Gold-Blue Garnet
  "ngo-education": { accent: "212 72% 58%", iconKey: "Users" },
  "csr-education": { accent: "196 68% 50%", iconKey: "Building2" },
  "edutech-africa": { accent: "184 70% 46%", iconKey: "Cpu" },
  "stem-education": { accent: "160 62% 44%", iconKey: "Atom" },
  "media-advocacy": { accent: "232 62% 62%", iconKey: "Radio" },
  "education-friendly-state": { accent: "220 55% 52%", iconKey: "MapPinned" },
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
