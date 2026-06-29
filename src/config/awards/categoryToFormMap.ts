// Best-effort mapping from `recognitionArchitecture2026` (tier + category) →
// `awardCategoryForms` formSlug. Powers the canonical category/subcategory
// pages so each of the 43 canonical architecture categories
// (1 Icon + 18 GBG + 21 Platinum + 3 Influencer) can render an embedded
// subcategory panel + nomination form whenever a backing Google form exists.
//
// Categories without a backing form fall through to `undefined` — the
// canonical page then renders a clear "Nominations opening soon" fallback
// (see `MissingFormFallback`), never a broken or misleading embed.
//
// AUDIT (2026 season — keep this comment in sync with EXPLICIT_MAP):
//   Icon (1/1 mapped):
//     • icon-of-the-decade → legacy umbrella form
//   Gold-Blue Garnet (10/18 mapped, 8 awaiting Google form):
//     mapped: csr-for-education, education-philanthropy*, faith-based-organisations,
//             ngos-advancing-education, edtech-and-ai-innovation, stem-education,
//             media-and-journalism-for-education, education-policy-and-government,
//             research-and-curriculum-development, libraries-and-knowledge-systems
//     pending: institutional-and-bilateral-grants, universities-and-higher-education,
//              tvet-and-technical-education, inclusive-and-special-needs-education,
//              early-childhood-education, school-transformation,
//              skills-development-and-employability, regional-education-leadership
//   Platinum (8/21 mapped, 13 awaiting Google form):
//     mapped: international-bilateral-education-partners, diaspora-organisations,
//             national-libraries, religious-organisations, government-ministries,
//             research-institutions, universities, foundations
//     pending: embassies-supporting-african-education, development-partners,
//              un-agencies, corporate-foundations, education-agencies, csr-coalitions,
//              education-networks, professional-associations, international-ngos,
//              african-regional-organisations, friends-of-africa-organisations,
//              special-recognition, legacy-recognition
//   Influencer (3/3 mapped)
//
// (*) `education-philanthropy` reuses the CSR regional form intentionally
// until a dedicated philanthropy form is published.

import { AWARD_CATEGORY_FORMS } from "@/config/nomination/awardCategoryForms";
import type { AwardCategoryForm } from "@/config/nomination/types";

/**
 * Explicit overrides — architecture categorySlug → award form slug.
 * Always prefer an explicit entry over the fuzzy fallback below.
 */
const EXPLICIT_MAP: Record<string, string> = {
  // ── Africa Education Icon ────────────────────────────────────────────────
  "icon-of-the-decade": "africa-education-icon-lifetime-achievement-2006-2026",

  // ── Gold-Blue Garnet ─────────────────────────────────────────────────────
  "csr-for-education": "best-csr-for-education-africa-regional",
  "education-philanthropy": "best-csr-for-education-africa-regional",
  "faith-based-organisations":
    "excellence-in-christian-education-impact-africa-regional",
  "ngos-advancing-education": "best-ngo-for-education-advancement-africa-regional",
  "edtech-and-ai-innovation":
    "best-edutech-innovation-for-education-africa-regional",
  "stem-education": "best-stem-education-programme-africa-regional",
  "media-and-journalism-for-education":
    "best-media-organisation-for-education-advocacy-nigeria",
  "education-policy-and-government":
    "best-education-policy-implementation-state-nigeria",
  "research-and-curriculum-development":
    "excellence-in-research-development-for-education-nigeria",
  "libraries-and-knowledge-systems": "best-tertiary-institution-library-nigeria",

  // ── Platinum ─────────────────────────────────────────────────────────────
  "international-bilateral-education-partners":
    "excellence-in-international-partnership-for-education-africa",
  "diaspora-organisations":
    "excellence-in-diaspora-educational-impact-international",
  "national-libraries": "best-tertiary-institution-library-nigeria",
  "religious-organisations":
    "excellence-in-christian-education-impact-africa-regional",
  "government-ministries":
    "excellence-in-political-leadership-for-education-nigeria",
  "research-institutions":
    "excellence-in-research-development-for-education-nigeria",
  "universities": "excellence-in-research-development-for-education-nigeria",
  "foundations": "best-csr-for-education-africa-regional",

  // ── Influencer ───────────────────────────────────────────────────────────
  "social-media": "education-content-social-media-influencers",
  "sports": "african-footballers-supporting-education",
  "music": "african-musicians-supporting-education",
};

const STOP_WORDS = new Set([
  "and",
  "for",
  "the",
  "of",
  "to",
  "in",
  "by",
  "on",
  "education",
  "africa",
  "african",
  "best",
  "award",
  "awards",
]);

/**
 * Resolve the nomination form that backs a canonical architecture category.
 *
 * Resolution order:
 *   1. Explicit override (EXPLICIT_MAP).
 *   2. Strict fuzzy match — requires ≥ 2 meaningful token overlaps with the
 *      form slug; otherwise returns `undefined` so the page renders the
 *      "Nominations opening soon" fallback instead of a wrong form.
 */
export function getFormForCategory(
  categorySlug: string,
): AwardCategoryForm | undefined {
  const explicit = EXPLICIT_MAP[categorySlug];
  if (explicit) {
    const direct = AWARD_CATEGORY_FORMS.find((f) => f.slug === explicit);
    if (direct) return direct;
  }

  const tokens = categorySlug
    .split("-")
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
  if (tokens.length === 0) return undefined;

  let best: { form: AwardCategoryForm; score: number } | undefined;
  for (const form of AWARD_CATEGORY_FORMS) {
    const hay = form.slug.toLowerCase();
    let score = 0;
    for (const t of tokens) if (hay.includes(t)) score += 1;
    if (!best || score > best.score) best = { form, score };
  }
  // Require at least 2 strong token overlaps to avoid mis-mapping
  // (e.g. matching anything containing "philanthropy" / "policy").
  if (best && best.score >= 2) return best.form;
  return undefined;
}

/** Returns true when the architecture category has a backing Google form. */
export function hasFormForCategory(categorySlug: string): boolean {
  return getFormForCategory(categorySlug) !== undefined;
}
