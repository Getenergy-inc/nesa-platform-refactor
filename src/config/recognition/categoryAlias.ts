// Maps the 18 Gold–Blue Garnet award-category slugs (from
// recognitionArchitecture2026) to the parent-category slug(s) used inside the
// canonical subcategory registry. One 18-category slug can fan out to multiple
// registry parents (e.g. "faith-based-organisations" spans Christian + Islamic
// education impact families).
//
// Used by:
//   • /awards/18-categories                    — subcategory counts on cards
//   • /awards/18-categories/:categorySlug      — subcategory listing

import {
  SUBCATEGORY_REGISTRY,
  type SubcategoryEntry,
} from "@/config/recognition/subcategoryRegistry";

/** Ordered map — first entry is the "primary" parent when we need one. */
export const CATEGORY_TO_REGISTRY: Record<string, string[]> = {
  "csr-for-education": ["csr-for-education"],
  "education-philanthropy": [],
  "institutional-and-bilateral-grants": ["international-partnership"],
  "faith-based-organisations": ["christian-education-impact", "islamic-education-impact"],
  "ngos-advancing-education": ["ngo-advancement"],
  "education-policy-and-government": ["political-leadership", "education-friendly-state"],
  "universities-and-higher-education": ["tertiary-library"],
  "tvet-and-technical-education": [],
  "edtech-and-ai-innovation": ["edutech-innovation"],
  "stem-education": ["stem-programme"],
  "libraries-and-knowledge-systems": ["tertiary-library"],
  "research-and-curriculum-development": ["research-excellence"],
  "media-and-journalism-for-education": ["media-advocacy", "creative-arts"],
  "inclusive-and-special-needs-education": [],
  "early-childhood-education": [],
  "school-transformation": [],
  "skills-development-and-employability": [],
  "regional-education-leadership": [],
};

/** Return the non-regional subcategory entries for an 18-category slug. */
export function listSubcategoriesForCategory(categorySlug: string): SubcategoryEntry[] {
  const parents = CATEGORY_TO_REGISTRY[categorySlug] ?? [];
  if (parents.length === 0) return [];
  return SUBCATEGORY_REGISTRY.filter(
    (e) => parents.includes(e.parentCategorySlug) && !e.isRegional,
  );
}

/** Fast count without allocating the array twice. */
export function countSubcategoriesFor(categorySlug: string): number {
  return listSubcategoriesForCategory(categorySlug).length;
}
