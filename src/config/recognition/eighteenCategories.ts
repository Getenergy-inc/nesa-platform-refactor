// Canonical assignment of the 18 award categories across the 4 recognition tiers.
//
//   9 → Gold–Blue Garnet   (programme / organisation recognition)
//   7 → Platinum           (institutional / systemic recognition)
//   1 → Africa Education Icon   (lifetime pathway meta-category)
//   1 → Influencer Education Impact  (influence-for-education meta-category)
//
// This file is the single source of truth for how the /awards/18-categories
// registry is grouped by parent tier. The 18-category slugs themselves already
// live in `recognitionArchitecture2026.ts` (Gold–Blue Garnet legacy list);
// here we only decide which tier "owns" each of them for display, filtering
// and cross-linking. Nomination forms on each tier page are untouched.

export type TierSlug =
  | "africa-education-icon"
  | "gold-blue-garnet"
  | "platinum-recognition"
  | "influencer-education-impact";

export interface EighteenCategoryEntry {
  slug: string;
  name: string;
  tagline: string;
  parentTier: TierSlug;
  /** True when the category is a tier-level meta-category (Icon, Influencer). */
  meta?: boolean;
}

export const EIGHTEEN_CATEGORIES: EighteenCategoryEntry[] = [
  // ── Africa Education Icon (1) ─────────────────────────────────────────────
  {
    slug: "africa-education-icon",
    name: "Africa Education Icon (Lifetime Legacy)",
    tagline:
      "Continental Hall of Fame across three pathways — Philanthropy, Literary & Curriculum, and Technical Education.",
    parentTier: "africa-education-icon",
    meta: true,
  },

  // ── Gold–Blue Garnet (9) ──────────────────────────────────────────────────
  { slug: "csr-for-education", name: "CSR for Education by Organisations", tagline: "Corporate citizenship advancing African education.", parentTier: "gold-blue-garnet" },
  { slug: "education-philanthropy", name: "Education Philanthropy", tagline: "Philanthropists and foundations funding learning.", parentTier: "gold-blue-garnet" },
  { slug: "ngos-advancing-education", name: "NGOs Advancing Education", tagline: "Civil society organisations transforming learning.", parentTier: "gold-blue-garnet" },
  { slug: "edtech-and-ai-innovation", name: "EdTech & AI Innovation", tagline: "Technology and AI advancing classrooms.", parentTier: "gold-blue-garnet" },
  { slug: "stem-education", name: "STEM Education", tagline: "Science, technology, engineering and mathematics champions.", parentTier: "gold-blue-garnet" },
  { slug: "tvet-and-technical-education", name: "TVET & Technical Education", tagline: "Skills, trade and technical training leaders.", parentTier: "gold-blue-garnet" },
  { slug: "media-and-journalism-for-education", name: "Media & Journalism for Education", tagline: "Editorial voices amplifying education.", parentTier: "gold-blue-garnet" },
  { slug: "school-transformation", name: "School Transformation", tagline: "Schools reinvented through bold leadership.", parentTier: "gold-blue-garnet" },
  { slug: "skills-development-and-employability", name: "Skills Development & Employability", tagline: "Bridging learning and the world of work.", parentTier: "gold-blue-garnet" },

  // ── Platinum (7) ──────────────────────────────────────────────────────────
  { slug: "universities-and-higher-education", name: "Universities & Higher Education", tagline: "Continental excellence in tertiary education.", parentTier: "platinum-recognition" },
  { slug: "libraries-and-knowledge-systems", name: "Libraries & Knowledge Systems", tagline: "Custodians of African knowledge.", parentTier: "platinum-recognition" },
  { slug: "research-and-curriculum-development", name: "Research & Curriculum Development", tagline: "Researchers and curriculum architects.", parentTier: "platinum-recognition" },
  { slug: "faith-based-organisations", name: "Faith-Based Organisations Advancing Education", tagline: "Religious institutions building schools and scholarships.", parentTier: "platinum-recognition" },
  { slug: "institutional-and-bilateral-grants", name: "Institutional & Bilateral Grants", tagline: "Multilateral and bilateral funding for education.", parentTier: "platinum-recognition" },
  { slug: "education-policy-and-government", name: "Education Policy & Government Leadership", tagline: "Public officials driving systemic reform.", parentTier: "platinum-recognition" },
  { slug: "regional-education-leadership", name: "Regional Education Leadership", tagline: "Honouring leaders across each African region.", parentTier: "platinum-recognition" },

  // ── Influencer Education Impact (1) ───────────────────────────────────────
  {
    slug: "influencer-education-impact",
    name: "Influencer Education Impact",
    tagline:
      "Social media, sports and music influence advancing Education for All across Africa.",
    parentTier: "influencer-education-impact",
    meta: true,
  },
];

export const TIER_LABEL: Record<TierSlug, string> = {
  "africa-education-icon": "Africa Education Icon",
  "gold-blue-garnet": "Gold–Blue Garnet",
  "platinum-recognition": "Platinum",
  "influencer-education-impact": "Influencer Impact",
};

export function listCategoriesByTier(tier: TierSlug): EighteenCategoryEntry[] {
  return EIGHTEEN_CATEGORIES.filter((c) => c.parentTier === tier);
}

export function findEighteenCategory(slug: string): EighteenCategoryEntry | undefined {
  return EIGHTEEN_CATEGORIES.find((c) => c.slug === slug);
}
