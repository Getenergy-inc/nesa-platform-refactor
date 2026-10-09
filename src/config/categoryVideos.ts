// Category → YouTube video mapping
// Each award category card on the landing page plays its associated video.
// Falls back to a tier-level default when no slug-specific video is set.

import type { CategoryDefinition } from "@/config/nesaCategories";

export interface CategoryVideo {
  videoId: string;
  title: string;
}

// Tier-level defaults (reuse the official Award TV Show videos)
const TIER_DEFAULTS: Record<string, CategoryVideo> = {
  icon: { videoId: "Hdu_qlFLfrQ", title: "The Icon Show — Africa Education Icons" },
  "blue-garnet": { videoId: "DDREAU_bmRk", title: "The Blue Garnet Show — Competitive Excellence" },
  platinum: { videoId: "nQCXDX_X3rs", title: "The Platinum Show — Institutional Leadership" },
  "gold-special": { videoId: "aP0SskrfioI", title: "The Gold Show — Special Recognition 2026" },
  gold: { videoId: "aP0SskrfioI", title: "The Gold Show" },
};

// Slug-specific overrides (extend over time as bespoke videos are produced)
const SLUG_OVERRIDES: Record<string, CategoryVideo> = {
  "best-ngo-education-africa": { videoId: "DDREAU_bmRk", title: "Best NGO Contribution to Education in Africa" },
  "best-csr-education-nigeria": { videoId: "DDREAU_bmRk", title: "Best CSR in Education — Nigeria" },
  "international-bilateral-education": { videoId: "nQCXDX_X3rs", title: "International Bilateral Education Partners" },
  "diaspora-education-impact": { videoId: "nQCXDX_X3rs", title: "Diaspora Education Impact" },
  "political-leaders-education-nigeria": { videoId: "nQCXDX_X3rs", title: "Political Leaders Driving Education — Nigeria" },
};

function getPrimaryTier(cat: CategoryDefinition): string {
  if (cat.tierApplicability.icon) return "icon";
  if (cat.tierApplicability.goldSpecial) return "gold-special";
  if (cat.tierApplicability.blueGarnet) return "blue-garnet";
  return "platinum";
}

export function getCategoryVideo(cat: CategoryDefinition): CategoryVideo {
  return SLUG_OVERRIDES[cat.slug] ?? TIER_DEFAULTS[getPrimaryTier(cat)] ?? TIER_DEFAULTS.platinum;
}
