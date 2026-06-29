// Best-effort mapping from `recognitionArchitecture2026` (tier + category) →
// `awardCategoryForms` formSlug. Powers the canonical category/subcategory
// pages so each of the 18 GBG + 21 Platinum + 1 Icon + 3 Influencer canonical
// categories can render an embedded subcategory panel + nomination form.
//
// Categories without an existing Google form fall through to `undefined` —
// the page then renders the canonical description + "Nominations opening
// soon" placeholder (no broken UI).

import { AWARD_CATEGORY_FORMS } from "@/config/nomination/awardCategoryForms";
import type { AwardCategoryForm } from "@/config/nomination/types";

/**
 * Explicit overrides — architecture categorySlug → award form slug.
 * Add an entry here whenever a new Google form ships for a canonical category.
 */
const EXPLICIT_MAP: Record<string, string> = {
  // ── Africa Education Icon ────────────────────────────────────────────────
  "icon-of-the-decade": "africa-education-icon-lifetime-achievement-2006-2026",

  // ── Gold-Blue Garnet (18) ────────────────────────────────────────────────
  "csr-for-education": "best-csr-for-education-africa-regional",
  "education-philanthropy": "best-csr-for-education-africa-regional",
  "faith-based-organisations": "excellence-in-christian-education-impact-africa-regional",
  "ngos-advancing-education": "best-ngo-for-education-advancement-africa-regional",
  "edtech-and-ai-innovation": "best-edutech-innovation-for-education-africa-regional",
  "stem-education": "best-stem-education-programme-africa-regional",
  "media-and-journalism-for-education": "best-media-organisation-for-education-advocacy-nigeria",
  "education-policy-and-government": "best-education-policy-implementation-state-nigeria",
  "research-and-curriculum-development": "excellence-in-research-development-for-education-nigeria",

  // ── Platinum (21) ────────────────────────────────────────────────────────
  "international-bilateral-education-partners":
    "excellence-in-international-partnership-for-education-africa",
  "diaspora-organisations": "excellence-in-diaspora-educational-impact-international",
  "national-libraries": "best-tertiary-institution-library-nigeria",
  "religious-organisations": "excellence-in-christian-education-impact-africa-regional",
  "government-ministries": "excellence-in-political-leadership-for-education-nigeria",
  "research-institutions": "excellence-in-research-development-for-education-nigeria",

  // ── Influencer (3) ───────────────────────────────────────────────────────
  "social-media": "education-content-social-media-influencers",
  "sports": "african-footballers-supporting-education",
  "music": "african-musicians-supporting-education",
};

/**
 * Resolve the nomination form that backs a canonical architecture category.
 * Falls back to a fuzzy keyword match if no explicit override exists.
 */
export function getFormForCategory(
  categorySlug: string,
): AwardCategoryForm | undefined {
  const explicit = EXPLICIT_MAP[categorySlug];
  if (explicit) {
    const direct = AWARD_CATEGORY_FORMS.find((f) => f.slug === explicit);
    if (direct) return direct;
  }
  // Fuzzy: any form slug that contains the category root token.
  const root = categorySlug.split("-")[0];
  if (!root || root.length < 3) return undefined;
  return AWARD_CATEGORY_FORMS.find((f) => f.slug.includes(root));
}
