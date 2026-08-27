/**
 * categoryDisplayBrand.ts — PRESENTATION-ONLY label map.
 *
 * Maps the REAL `categories.slug` values stored in the database to the branded
 * public display name used as the page H1 / dashboard header.
 *
 * IMPORTANT: this never renames anything in the database. `categories.name`
 * and `categories.slug` stay exactly as they are, and nomination form category
 * keys / Google Form routing are untouched.
 */

export const CATEGORY_DISPLAY_BRAND: Record<string, string> = {
  "africa-education-icon-award": "Africa Education Icon — Education Enabler",
  "best-csr-education-africa":
    "Best CSR for Education (Africa Regional) — Education Enabler",
  "best-csr-education-nigeria":
    "Best CSR for Education (Nigeria) — Education Enabler",
  "best-edutech-organisation-africa":
    "Best EduTech Innovation for Education (Africa Regional) — Education Enabler",
  "best-media-educational-advocacy-nigeria":
    "Best Media Organisation for Education Advocacy (Nigeria) — Education Enabler",
  "best-ngo-education-nigeria":
    "Best NGO for Education Advancement (Nigeria) — Education Enabler",
  "best-ngo-education-africa":
    "Best NGO for Education Advancement (Africa Regional) — Education Enabler",
  "international-bilateral-education":
    "Excellence in International Partnership for Education — Education Enabler",
  "diaspora-education-impact":
    "Excellence in Diaspora Educational Impact — Education Enabler",
  "africa-music-influencer-education":
    "Influencer Education Impact Award — Education Enabler (Music)",
  "africa-social-media-influencer-education":
    "Influencer Education Impact Award — Education Enabler (Social Media)",
  "africa-sports-influencer-education":
    "Influencer Education Impact Award — Education Enabler (Sports)",
  "best-library-tertiary-nigeria":
    "Best Tertiary Institution Library — Education Enabler",
  "best-research-development-nigeria":
    "Excellence in Research and Development for Education — Education Enabler",
  "christian-education-impact-africa":
    "Excellence in Christian Education Impact — Education Enabler",
  "islamic-education-impact-africa":
    "Excellence in Islamic Education Impact — Education Enabler",
  "political-leaders-education-nigeria":
    "Excellence in Political Leadership for Education — Education Enabler",
  "best-stem-education-africa":
    "Best STEM Education Programme (Africa Regional) — Education Enabler",
  "creative-arts-education-nigeria":
    "Best Creative Arts Contribution to Education (Nigeria) — Education Enabler",
  "best-education-friendly-state-nigeria":
    "Best Education Policy and Implementation State (Nigeria) — Education Enabler",
};

/** Branded display name for a real DB category slug (falls back to given name). */
export function getCategoryDisplayName(slug?: string | null, fallback = ""): string {
  if (!slug) return fallback;
  return CATEGORY_DISPLAY_BRAND[slug] ?? fallback;
}

/**
 * Content-Bible pathway page id → real `categories.slug`.
 * Used so DetailedCategoryPageTemplate can resolve the DB category without
 * editing all sixteen thin category page files.
 */
export const PATHWAY_ID_TO_DB_CATEGORY_SLUG: Record<string, string> = {
  "bg-csr-africa": "best-csr-education-africa",
  "bg-csr-nigeria": "best-csr-education-nigeria",
  "bg-edutech-africa": "best-edutech-organisation-africa",
  "bg-media-nigeria": "best-media-educational-advocacy-nigeria",
  "bg-ngo-nigeria": "best-ngo-education-nigeria",
  "bg-ngo-africa": "best-ngo-education-africa",
  "bg-stem-africa": "best-stem-education-africa",
  "bg-creative-nigeria": "creative-arts-education-nigeria",
  "bg-education-state-nigeria": "best-education-friendly-state-nigeria",
  "pt-library-nigeria": "best-library-tertiary-nigeria",
  "pt-rnd": "best-research-development-nigeria",
  "pt-christian": "christian-education-impact-africa",
  "pt-islamic": "islamic-education-impact-africa",
  "pt-political": "political-leaders-education-nigeria",
  "pt-international": "international-bilateral-education",
  "pt-diaspora": "diaspora-education-impact",
};

export function getDbCategorySlugForPathway(pathwayId?: string): string | undefined {
  if (!pathwayId) return undefined;
  return PATHWAY_ID_TO_DB_CATEGORY_SLUG[pathwayId];
}
