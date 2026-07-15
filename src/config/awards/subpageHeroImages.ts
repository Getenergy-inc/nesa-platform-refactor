// Hero images for the 22 award subpages + 4 tier pages.
// Each image is a bespoke editorial photograph (warm charcoal & gold palette)
// telling the story of that category / subcategory.

import iconPhil from "@/assets/story/icon-phil.jpg";
import iconLit from "@/assets/story/icon-lit.jpg";
import iconTech from "@/assets/story/icon-tech.jpg";

import infSoc from "@/assets/story/inf-soc.jpg";
import infSpt from "@/assets/story/inf-spt.jpg";
import infMus from "@/assets/story/inf-mus.jpg";

import plt_lib from "@/assets/story/best-tertiary-institution-library.jpg";
import plt_rnd from "@/assets/story/research-development-education.jpg";
import plt_chr from "@/assets/story/christian-education-impact.jpg";
import plt_isl from "@/assets/story/islamic-education-impact.jpg";
import plt_pol from "@/assets/story/political-leadership-education.jpg";
import plt_int from "@/assets/story/international-partnership-education.jpg";
import plt_dia from "@/assets/story/diaspora-association-education.jpg";

import gbg_csrAfr from "@/assets/story/csr-education-africa.jpg";
import gbg_csrNg from "@/assets/story/csr-education-nigeria.jpg";
import gbg_edtAfr from "@/assets/story/edutech-organisation-africa.jpg";
import gbg_medNg from "@/assets/story/media-education-advocacy-nigeria.jpg";
import gbg_ngoNg from "@/assets/story/ngo-education-nigeria.jpg";
import gbg_ngoAfr from "@/assets/story/ngo-education-africa.jpg";
import gbg_stemAfr from "@/assets/story/stem-education-africa.jpg";
import gbg_artNg from "@/assets/story/creative-arts-education-nigeria.jpg";
import gbg_polNg from "@/assets/story/education-friendly-state-nigeria.jpg";

import tierIcon from "@/assets/story/tier-africa-education-icon.jpg";
import tierInfluencer from "@/assets/story/tier-influencer-education-impact.jpg";
import tierPlatinum from "@/assets/story/tier-platinum.jpg";
import tierGbg from "@/assets/story/tier-gold-blue-garnet.jpg";

import type { TierSlug } from "@/config/recognition2026/tiers";

/** Map from a subpage slug (as generated in subpages2026.ts) to its hero image. */
export const SUBPAGE_HERO_IMAGES: Record<string, string> = {
  // Africa Education Icon subcategories (slug = lowercased subcategory code)
  "icon-phil": iconPhil,
  "icon-lit": iconLit,
  "icon-tech": iconTech,

  // Influencer Education Impact subcategories (short codes)
  "inf-soc": infSoc,
  "inf-spt": infSpt,
  "inf-mus": infMus,
  // Long-form aliases used by InfluencerSubcategoryPage
  "african-social-media-influencers": infSoc,
  "african-sports-icons-supporting-education": infSpt,
  "african-music-icons-supporting-education": infMus,

  // Platinum categories (slug = category slug)
  "best-tertiary-institution-library": plt_lib,
  "research-development-education": plt_rnd,
  "christian-education-impact": plt_chr,
  "islamic-education-impact": plt_isl,
  "political-leadership-education": plt_pol,
  "international-partnership-education": plt_int,
  "diaspora-educational-impact": plt_dia,

  // Gold-Blue Garnet categories
  "best-csr-education-africa": gbg_csrAfr,
  "best-csr-education-nigeria": gbg_csrNg,
  "best-edtech-innovation-africa": gbg_edtAfr,
  "best-media-education-advocacy-nigeria": gbg_medNg,
  "best-ngo-education-nigeria": gbg_ngoNg,
  "best-ngo-education-africa": gbg_ngoAfr,
  "best-stem-education-programme-africa": gbg_stemAfr,
  "best-creative-arts-education-nigeria": gbg_artNg,
  "best-education-policy-state-nigeria": gbg_polNg,
};

export function getSubpageHeroImage(slug: string): string | undefined {
  return SUBPAGE_HERO_IMAGES[slug];
}

/** Editorial hero image for each of the 4 recognition tiers.
 *  Keyed by both canonical TierSlug and the tier-cluster URL slug variant
 *  (`platinum-recognition`) so either lookup works. */
export const TIER_HERO_IMAGES: Record<string, string> = {
  "africa-education-icon": tierIcon,
  "influencer-education-impact": tierInfluencer,
  "influencer-education-impact-2026": tierInfluencer,
  platinum: tierPlatinum,
  "platinum-recognition": tierPlatinum,
  "gold-blue-garnet": tierGbg,
};


export function getTierHeroImage(tier: TierSlug | string): string | undefined {
  return TIER_HERO_IMAGES[tier];
}

