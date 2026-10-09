// ============================================================================
// Historical master-list category label → canonical 2026 catalogue category.
// Dependency-free so migration scripts can import it without pulling the app
// runtime (Supabase client, React, etc.).
// ============================================================================

/**
 * Master list category label (lower-cased) → canonical catalogue category slug.
 * Matching is done on a normalised prefix so truncated / year-suffixed labels
 * from the source workbook still resolve.
 */
const MASTER_CATEGORY_RULES: Array<{ test: RegExp; categorySlug: string }> = [
  { test: /africa regional companies csr/i, categorySlug: "best-csr-education-africa" },
  { test: /best csr for education in nigeria/i, categorySlug: "best-csr-education-nigeria" },
  { test: /stem education/i, categorySlug: "best-stem-education-africa" },
  { test: /edutech/i, categorySlug: "best-edutech-organisation-africa" },
  { test: /library/i, categorySlug: "best-library-tertiary-nigeria" },
  { test: /creative arts/i, categorySlug: "creative-arts-education-nigeria" },
  { test: /political leaders/i, categorySlug: "political-leaders-education-nigeria" },
  { test: /educational friendly state/i, categorySlug: "best-education-friendly-state-nigeria" },
  { test: /global education excellence/i, categorySlug: "international-bilateral-education" },
  { test: /\bngo\b/i, categorySlug: "best-ngo-education-africa" },
  { test: /christian/i, categorySlug: "christian-education-impact-africa" },
  { test: /islamic/i, categorySlug: "islamic-education-impact-africa" },
  { test: /media organization|media organisation/i, categorySlug: "best-media-educational-advocacy-nigeria" },
  { test: /diaspora/i, categorySlug: "diaspora-education-impact" },
  { test: /research and development/i, categorySlug: "best-research-development-nigeria" },
  { test: /social media influencer/i, categorySlug: "africa-social-media-influencer-education" },
  { test: /sports? influencer|sports icon/i, categorySlug: "africa-sports-influencer-education" },
  { test: /music influencer|music icon/i, categorySlug: "africa-music-influencer-education" },
  { test: /education icon/i, categorySlug: "africa-education-icon-award" },
];

/** Resolve a raw master-list category label to a canonical catalogue slug. */
export function resolveMasterCategorySlug(rawCategory: string): string | null {
  for (const rule of MASTER_CATEGORY_RULES) {
    if (rule.test.test(rawCategory)) return rule.categorySlug;
  }
  return null;
}

