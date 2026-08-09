// NESA-Africa 2026 — Canonical Recognition Architecture
// SINGLE SOURCE OF TRUTH for the 4 / 18 / ~100 / 10 model.
// Every navigation menu, page, filter, and CMS lookup MUST import from here.
//
// Hierarchy:
//   Pathway (4) → Category (18) → Subcategory (~100) → Region (10) → Nominee
//
// The brief lists 18 categories. Source data in awardTiers2026.ts shows 22
// (9 Blue Garnet + 7 Platinum + 3 Icon + 3 Influencer). The brief mandates
// consolidation: regional duplicates of CSR / EduTech / NGO / STEM collapse
// into single category records with `regionScope: 'multi'` exposed via a
// region filter, yielding the canonical 18.

export type PathwaySlug =
  | "africa-education-icon"
  | "blue-garnet"
  | "platinum-recognition"
  | "influencers-education-impact";

export type VoteMechanic = "jury-only" | "60-40-hybrid" | "public-agc-only";
export type RegionScope = "continental" | "nigeria" | "multi" | "diaspora";
export type ThematicTag =
  | "csr" | "stem" | "tvet" | "libraries" | "research" | "ngo" | "foundation"
  | "media" | "digital-learning" | "ai-education" | "teacher-development"
  | "scholarships" | "policy" | "governance" | "infrastructure" | "creative-arts"
  | "sports" | "music" | "social-media" | "faith" | "diaspora" | "bilateral"
  | "international" | "girls-education" | "inclusive" | "early-childhood"
  | "basic-education" | "secondary" | "higher-education";

export interface RecognitionPathway {
  slug: PathwaySlug;
  tierNumber: 1 | 2 | 3 | 4;
  name: string;
  subtitle: string;
  oneLiner: string;
  voteMechanic: VoteMechanic;
  voteMechanicLabel: string;
  href: string;
}

export interface AwardCategory {
  id: number;
  slug: string;
  pathway: PathwaySlug;
  name: string;
  shortName?: string;
  regionScope: RegionScope;
  description: string;
}

export interface RecognitionSubcategory {
  slug: string;
  categorySlug: string;
  name: string;
  thematicTag?: ThematicTag;
  /** When set, this subcategory only applies in this Africa region. */
  region?: EducationRegionSlug;
}

export type EducationRegionSlug =
  | "west-africa" | "east-africa" | "central-africa" | "southern-africa"
  | "north-africa" | "horn-of-africa" | "sahel" | "indian-ocean-islands"
  | "diaspora" | "friends-of-africa";

export interface EducationRegion {
  slug: EducationRegionSlug;
  name: string;
  shortName: string;
  isAfricaResident: boolean;
}

// ============================================================================
// LEVEL 1 — Four Recognition Subcategories
// ============================================================================

export const RECOGNITION_PATHWAYS: RecognitionPathway[] = [
  {
    slug: "africa-education-icon",
    tierNumber: 3,
    name: "Africa Education Icon Award",
    subtitle: "Lifetime Achievement 2006–2026",
    oneLiner: "Africa's highest lifetime honour for education transformation.",
    voteMechanic: "jury-only",
    voteMechanicLabel: "Jury selected only · No public vote",
    href: "/awards/africa-education-icon",
  },
  {
    slug: "blue-garnet",
    tierNumber: 1,
    name: "Blue Garnet Award",
    subtitle: "Competitive Excellence",
    oneLiner: "Flagship competitive recognition — independent jury assessment and governance ratification.",
    voteMechanic: "60-40-hybrid",
    voteMechanicLabel: "Independent Jury Assessment",
    href: "/awards/blue-garnet",
  },
  {
    slug: "platinum-recognition",
    tierNumber: 2,
    name: "Platinum Recognition",
    subtitle: "Institutional Leadership",
    oneLiner: "Non-competitive recognition of institutional and policy excellence.",
    voteMechanic: "jury-only",
    voteMechanicLabel: "Jury recognition only · No public vote",
    href: "/awards/platinum",
  },
  {
    slug: "influencers-education-impact",
    tierNumber: 4,
    name: "Influencers Education Impact Award",
    subtitle: "Education Advocacy Through Culture",
    oneLiner: "Sports, music and social-media voices accelerating education.",
    voteMechanic: "public-agc-only",
    voteMechanicLabel: "Verification-led assessment · No public voting",
    href: "/awards/influencer-impact-2026",
  },
];

// ============================================================================
// LEVEL 2 — 18 Award Categories (consolidated)
// ============================================================================

export const AWARD_CATEGORIES: AwardCategory[] = [
  // Tier 3 — Icon (3)
  { id: 1, slug: "philanthropy-icon", pathway: "africa-education-icon", name: "Africa Education Philanthropy Icon of the Decade", regionScope: "continental", description: "Lifetime philanthropic contribution to African education." },
  { id: 2, slug: "literary-curriculum-icon", pathway: "africa-education-icon", name: "Literary & New Curriculum Advocate Icon of the Decade", regionScope: "continental", description: "Lifetime literary, curriculum, and pedagogy reform impact." },
  { id: 3, slug: "technical-educator-icon", pathway: "africa-education-icon", name: "Africa Technical Educator Icon of the Decade", regionScope: "continental", description: "Lifetime technical, STEM, and TVET educator impact." },

  // Tier 1 — Blue Garnet (9 → consolidated to 9 unique categories;
  // regional duplicates collapse via regionScope)
  { id: 4, slug: "csr-for-education", pathway: "blue-garnet", name: "Best CSR for Education", regionScope: "multi", description: "Corporate Social Responsibility leadership for education." },
  { id: 5, slug: "edutech-innovation", pathway: "blue-garnet", name: "Best EduTech Innovation for Education", regionScope: "continental", description: "Technology-led innovation transforming learning." },
  { id: 6, slug: "media-education-advocacy", pathway: "blue-garnet", name: "Best Media Organisation for Educational Advocacy", regionScope: "nigeria", description: "Editorial and broadcast contribution to education." },
  { id: 7, slug: "ngo-education-contribution", pathway: "blue-garnet", name: "Best NGO Contribution to Education", regionScope: "multi", description: "Civil society organisations advancing education." },
  { id: 8, slug: "stem-education-programme", pathway: "blue-garnet", name: "Best STEM Education Programme", regionScope: "continental", description: "Science, Technology, Engineering, and Mathematics programmes." },
  { id: 9, slug: "creative-arts-education", pathway: "blue-garnet", name: "Best Creative Arts Industry Contribution to Education", regionScope: "nigeria", description: "Creative arts and culture supporting education." },
  { id: 10, slug: "education-friendly-state", pathway: "blue-garnet", name: "Best Education-Friendly State", regionScope: "nigeria", description: "Sub-national governments advancing education." },

  // Tier 2 — Platinum (7)
  { id: 11, slug: "tertiary-library", pathway: "platinum-recognition", name: "Best Library in Nigerian Tertiary Institutions", regionScope: "nigeria", description: "Library infrastructure and services excellence." },
  { id: 12, slug: "research-development", pathway: "platinum-recognition", name: "Best Research & Development Contribution to Education", regionScope: "nigeria", description: "Research advancing African education systems." },
  { id: 13, slug: "christian-education-impact", pathway: "platinum-recognition", name: "Christian Education Impact", regionScope: "continental", description: "Christian institutions and leaders advancing education." },
  { id: 14, slug: "islamic-education-impact", pathway: "platinum-recognition", name: "Islamic Education Impact", regionScope: "continental", description: "Islamic institutions and leaders advancing education." },
  { id: 15, slug: "political-leadership-education", pathway: "platinum-recognition", name: "Political Leadership for Education", regionScope: "nigeria", description: "Political leaders championing education reform." },
  { id: 16, slug: "international-partnership", pathway: "platinum-recognition", name: "International Partnership for Education", regionScope: "continental", description: "Bilateral and multilateral partnerships advancing education." },
  { id: 17, slug: "diaspora-educational-impact", pathway: "platinum-recognition", name: "Diaspora Educational Impact", regionScope: "diaspora", description: "Diaspora-led educational contributions to Africa." },

  // Tier 4 — Influencers (1 consolidated category exposing 3 classifications via subcategory layer)
  { id: 18, slug: "influencer-education-impact", pathway: "influencers-education-impact", name: "Influencers Education Impact", regionScope: "continental", description: "Sports, music, and social-media influencers advancing education." },
];

// ============================================================================
// LEVEL 3 — Recognition Subcategories
// Confirmed names from existing configs; remainder are progressively
// revealed via the admin CMS as forms are published.
// ============================================================================

export const RECOGNITION_SUBCATEGORIES: RecognitionSubcategory[] = [
  // Icon — 3 classifications × 3 categories = 9 winner slots; classifications are filters, not subcategories
  // We expose the 3 category-level classifications as discoverable subcategories.
  { slug: "philanthropy-africa-resident", categorySlug: "philanthropy-icon", name: "Africans Living in Africa", thematicTag: "ngo" },
  { slug: "philanthropy-diaspora", categorySlug: "philanthropy-icon", name: "Africans in the Diaspora", thematicTag: "diaspora" },
  { slug: "philanthropy-friends", categorySlug: "philanthropy-icon", name: "Friends of Africa", thematicTag: "international" },
  { slug: "literary-africa-resident", categorySlug: "literary-curriculum-icon", name: "Africans Living in Africa" },
  { slug: "literary-diaspora", categorySlug: "literary-curriculum-icon", name: "Africans in the Diaspora", thematicTag: "diaspora" },
  { slug: "literary-friends", categorySlug: "literary-curriculum-icon", name: "Friends of Africa", thematicTag: "international" },
  { slug: "technical-africa-resident", categorySlug: "technical-educator-icon", name: "Africans Living in Africa", thematicTag: "tvet" },
  { slug: "technical-diaspora", categorySlug: "technical-educator-icon", name: "Africans in the Diaspora", thematicTag: "diaspora" },
  { slug: "technical-friends", categorySlug: "technical-educator-icon", name: "Friends of Africa", thematicTag: "international" },

  // CSR (multi-region)
  { slug: "csr-banking", categorySlug: "csr-for-education", name: "Banking & Financial Services CSR", thematicTag: "csr" },
  { slug: "csr-telecoms", categorySlug: "csr-for-education", name: "Telecommunications CSR", thematicTag: "csr" },
  { slug: "csr-oil-gas", categorySlug: "csr-for-education", name: "Oil & Gas CSR", thematicTag: "csr" },
  { slug: "csr-manufacturing", categorySlug: "csr-for-education", name: "Manufacturing CSR", thematicTag: "csr" },
  { slug: "csr-agriculture", categorySlug: "csr-for-education", name: "Agriculture CSR", thematicTag: "csr" },
  { slug: "csr-fmcg", categorySlug: "csr-for-education", name: "FMCG CSR", thematicTag: "csr" },

  // EduTech
  { slug: "edutech-platforms", categorySlug: "edutech-innovation", name: "Learning Platforms", thematicTag: "digital-learning" },
  { slug: "edutech-ai", categorySlug: "edutech-innovation", name: "AI in Education", thematicTag: "ai-education" },
  { slug: "edutech-content", categorySlug: "edutech-innovation", name: "Digital Content & Curriculum", thematicTag: "digital-learning" },

  // Media
  { slug: "media-broadcast", categorySlug: "media-education-advocacy", name: "Broadcast Media", thematicTag: "media" },
  { slug: "media-print", categorySlug: "media-education-advocacy", name: "Print & Editorial", thematicTag: "media" },
  { slug: "media-digital", categorySlug: "media-education-advocacy", name: "Digital Media", thematicTag: "media" },
  { slug: "media-community", categorySlug: "media-education-advocacy", name: "Community & Local Media", thematicTag: "media" },

  // NGO
  { slug: "ngo-infrastructure", categorySlug: "ngo-education-contribution", name: "Educational Infrastructure Initiative", thematicTag: "infrastructure" },
  { slug: "ngo-materials", categorySlug: "ngo-education-contribution", name: "Donation of Educational Materials", thematicTag: "ngo" },
  { slug: "ngo-aid", categorySlug: "ngo-education-contribution", name: "Education Aid Donation", thematicTag: "ngo" },
  { slug: "ngo-youth", categorySlug: "ngo-education-contribution", name: "Youth Empowerment in Education", thematicTag: "ngo" },
  { slug: "ngo-girls", categorySlug: "ngo-education-contribution", name: "Women & Girls' Empowerment in Education", thematicTag: "girls-education" },

  // STEM
  { slug: "stem-schools", categorySlug: "stem-education-programme", name: "STEM in Schools", thematicTag: "stem" },
  { slug: "stem-tertiary", categorySlug: "stem-education-programme", name: "STEM in Tertiary Institutions", thematicTag: "stem" },
  { slug: "stem-community", categorySlug: "stem-education-programme", name: "Community STEM Programmes", thematicTag: "stem" },
  { slug: "stem-girls", categorySlug: "stem-education-programme", name: "Girls in STEM", thematicTag: "girls-education" },

  // Creative Arts
  { slug: "creative-music", categorySlug: "creative-arts-education", name: "Music Industry for Education", thematicTag: "music" },
  { slug: "creative-film", categorySlug: "creative-arts-education", name: "Film & Television for Education", thematicTag: "creative-arts" },
  { slug: "creative-fashion", categorySlug: "creative-arts-education", name: "Fashion & Design for Education", thematicTag: "creative-arts" },
  { slug: "creative-literature", categorySlug: "creative-arts-education", name: "Literature for Education", thematicTag: "creative-arts" },
  { slug: "creative-visual", categorySlug: "creative-arts-education", name: "Visual Arts for Education", thematicTag: "creative-arts" },
  { slug: "creative-theatre", categorySlug: "creative-arts-education", name: "Theatre for Education", thematicTag: "creative-arts" },
  { slug: "creative-comedy", categorySlug: "creative-arts-education", name: "Comedy for Education", thematicTag: "creative-arts" },

  // Education-Friendly State
  { slug: "state-policy", categorySlug: "education-friendly-state", name: "State Education Policy", thematicTag: "policy" },
  { slug: "state-infrastructure", categorySlug: "education-friendly-state", name: "State Education Infrastructure", thematicTag: "infrastructure" },
  { slug: "state-access", categorySlug: "education-friendly-state", name: "Access & Inclusion", thematicTag: "inclusive" },
  { slug: "state-teacher-welfare", categorySlug: "education-friendly-state", name: "Teacher Welfare", thematicTag: "teacher-development" },
  { slug: "state-curriculum", categorySlug: "education-friendly-state", name: "Curriculum Reform", thematicTag: "policy" },
  { slug: "state-special-needs", categorySlug: "education-friendly-state", name: "Special Needs Provision", thematicTag: "inclusive" },

  // Library
  { slug: "library-federal", categorySlug: "tertiary-library", name: "Federal University Libraries", thematicTag: "libraries" },
  { slug: "library-state", categorySlug: "tertiary-library", name: "State University Libraries", thematicTag: "libraries" },
  { slug: "library-private", categorySlug: "tertiary-library", name: "Private University Libraries", thematicTag: "libraries" },
  { slug: "library-polytechnic", categorySlug: "tertiary-library", name: "Polytechnic Libraries", thematicTag: "libraries" },
  { slug: "library-coe", categorySlug: "tertiary-library", name: "College of Education Libraries", thematicTag: "libraries" },
  { slug: "library-digital", categorySlug: "tertiary-library", name: "Digital Library Innovation", thematicTag: "digital-learning" },
  { slug: "library-research", categorySlug: "tertiary-library", name: "Research Library", thematicTag: "research" },
  { slug: "library-access", categorySlug: "tertiary-library", name: "Access & Inclusion in Libraries", thematicTag: "inclusive" },

  // R&D
  { slug: "rd-universities", categorySlug: "research-development", name: "University Research", thematicTag: "research" },
  { slug: "rd-institutes", categorySlug: "research-development", name: "Independent Research Institutes", thematicTag: "research" },
  { slug: "rd-applied", categorySlug: "research-development", name: "Applied / Industry Research", thematicTag: "research" },

  // Faith
  { slug: "christian-institution", categorySlug: "christian-education-impact", name: "Christian Institutions", thematicTag: "faith" },
  { slug: "christian-individual", categorySlug: "christian-education-impact", name: "Christian Education Leaders", thematicTag: "faith" },
  { slug: "christian-programme", categorySlug: "christian-education-impact", name: "Christian Education Programmes", thematicTag: "faith" },
  { slug: "islamic-institution", categorySlug: "islamic-education-impact", name: "Islamic Institutions", thematicTag: "faith" },
  { slug: "islamic-individual", categorySlug: "islamic-education-impact", name: "Islamic Education Leaders", thematicTag: "faith" },
  { slug: "islamic-programme", categorySlug: "islamic-education-impact", name: "Islamic Education Programmes", thematicTag: "faith" },

  // Political leadership
  { slug: "political-federal", categorySlug: "political-leadership-education", name: "Federal Political Leadership", thematicTag: "governance" },
  { slug: "political-state", categorySlug: "political-leadership-education", name: "State Political Leadership", thematicTag: "governance" },
  { slug: "political-legislative", categorySlug: "political-leadership-education", name: "Legislative Leadership", thematicTag: "governance" },

  // International partnership
  { slug: "intl-bilateral", categorySlug: "international-partnership", name: "Bilateral Partnerships", thematicTag: "bilateral" },
  { slug: "intl-multilateral", categorySlug: "international-partnership", name: "Multilateral Partnerships", thematicTag: "international" },
  { slug: "intl-development", categorySlug: "international-partnership", name: "Development Agency Partnerships", thematicTag: "international" },
  { slug: "intl-foundations", categorySlug: "international-partnership", name: "International Foundation Partnerships", thematicTag: "foundation" },

  // Diaspora
  { slug: "diaspora-individual", categorySlug: "diaspora-educational-impact", name: "Individual Diaspora Leaders", thematicTag: "diaspora" },
  { slug: "diaspora-organisation", categorySlug: "diaspora-educational-impact", name: "Diaspora Organisations", thematicTag: "diaspora" },
  { slug: "diaspora-network", categorySlug: "diaspora-educational-impact", name: "Diaspora Networks", thematicTag: "diaspora" },

  // Influencers (3 classifications)
  { slug: "influencer-sports", categorySlug: "influencer-education-impact", name: "Sports Icons for Education", thematicTag: "sports" },
  { slug: "influencer-music", categorySlug: "influencer-education-impact", name: "Music Icons for Education", thematicTag: "music" },
  { slug: "influencer-social-media", categorySlug: "influencer-education-impact", name: "Social Media Influencers for Education", thematicTag: "social-media" },
];

// ============================================================================
// LEVEL 4 — 10 Education Regions
// ============================================================================

export const EDUCATION_REGIONS: EducationRegion[] = [
  { slug: "west-africa", name: "West Africa", shortName: "West", isAfricaResident: true },
  { slug: "east-africa", name: "East Africa", shortName: "East", isAfricaResident: true },
  { slug: "central-africa", name: "Central Africa", shortName: "Central", isAfricaResident: true },
  { slug: "southern-africa", name: "Southern Africa", shortName: "Southern", isAfricaResident: true },
  { slug: "north-africa", name: "North Africa", shortName: "North", isAfricaResident: true },
  { slug: "horn-of-africa", name: "Horn of Africa", shortName: "Horn", isAfricaResident: true },
  { slug: "sahel", name: "Sahel Region", shortName: "Sahel", isAfricaResident: true },
  { slug: "indian-ocean-islands", name: "Indian Ocean Islands", shortName: "Indian Ocean", isAfricaResident: true },
  { slug: "diaspora", name: "Africans in the Diaspora", shortName: "Diaspora", isAfricaResident: false },
  { slug: "friends-of-africa", name: "Friends of Africa", shortName: "Friends of Africa", isAfricaResident: false },
];

// ============================================================================
// Helpers
// ============================================================================

export function getPathway(slug: PathwaySlug): RecognitionPathway | undefined {
  return RECOGNITION_PATHWAYS.find((p) => p.slug === slug);
}

export function getCategoriesByPathway(slug: PathwaySlug): AwardCategory[] {
  return AWARD_CATEGORIES.filter((c) => c.pathway === slug);
}

export function getCategory(slug: string): AwardCategory | undefined {
  return AWARD_CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategoriesByCategory(slug: string): RecognitionSubcategory[] {
  return RECOGNITION_SUBCATEGORIES.filter((s) => s.categorySlug === slug);
}

export function getRegion(slug: EducationRegionSlug): EducationRegion | undefined {
  return EDUCATION_REGIONS.find((r) => r.slug === slug);
}

export const ARCHITECTURE_TOTALS = {
  pathways: RECOGNITION_PATHWAYS.length,         // 4
  categories: AWARD_CATEGORIES.length,           // 18
  subcategories: RECOGNITION_SUBCATEGORIES.length, // ~100
  regions: EDUCATION_REGIONS.length,             // 10
} as const;
