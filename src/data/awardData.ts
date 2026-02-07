// ============================================================================
// NESA-AFRICA AWARD DATA - Data-Driven Category Structure
// Uses canonical 7-region structure: 5 African regions + Diaspora + Friends of Africa
// ============================================================================

import { 
  AFRICAN_REGIONS, 
  AfricanRegion, 
  REGION_SHORT_DESCRIPTIONS,
  getContinentalRegions,
  isContinentalRegion 
} from "@/lib/regions";

// Re-export region utilities for convenience
export { 
  AFRICAN_REGIONS, 
  REGION_SHORT_DESCRIPTIONS, 
  getContinentalRegions, 
  isContinentalRegion 
};
export type { AfricanRegion };

/**
 * Represents a nominee within a subcategory
 */
export interface Nominee {
  name: string;
  image?: string;
  achievement: string;
  state?: string;
  country?: string;
}

/**
 * Represents a subcategory within a category or region
 */
export interface SubCategory {
  title: string;
  description: string;
  nominees: Nominee[];
}

/**
 * Represents a region for region-based categories
 * Uses the canonical AfricanRegion type from regions.ts
 */
export interface Region {
  name: AfricanRegion;
  subCategories: SubCategory[];
}

/**
 * Represents a full award category
 * Categories can either have direct subcategories OR regions with subcategories
 */
export interface Category {
  title: string;
  description: string;
  regions?: Region[];
  subCategories?: SubCategory[];
  /** If true, includes Diaspora and Friends of Africa in region selector */
  includeGlobalRegions?: boolean;
}

// ============================================================================
// DEFAULT FALLBACK IMAGE
// ============================================================================
export const FALLBACK_IMAGE = "/images/nesa-card2.png";

// ============================================================================
// REGION STYLING (visual differentiation for continental vs global regions)
// ============================================================================
export const REGION_STYLES: Record<AfricanRegion, { bg: string; text: string; border: string; icon: string }> = {
  "North Africa": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", icon: "🌍" },
  "West Africa": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", icon: "🌍" },
  "Central Africa": { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/30", icon: "🌍" },
  "East Africa": { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30", icon: "🌍" },
  "Southern Africa": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30", icon: "🌍" },
  "Diaspora": { bg: "bg-gold/10", text: "text-gold", border: "border-gold/30", icon: "✈️" },
  "Friends of Africa": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", icon: "🤝" },
};

// ============================================================================
// HELPER: Generate standard region structure for Africa-wide categories
// ============================================================================
function createAfricaRegionalSubcategories(subcategoryTemplates: Omit<SubCategory, "nominees">[]): Region[] {
  return AFRICAN_REGIONS.map((regionName) => ({
    name: regionName,
    subCategories: subcategoryTemplates.map(template => ({
      ...template,
      nominees: [],
    })),
  }));
}

// ============================================================================
// CATEGORIES DATA
// ============================================================================

export const categories: Category[] = [
  // =========================================================================
  // CATEGORY 1 — BEST CSR IN EDUCATION (AFRICA REGIONAL)
  // Uses all 7 regions including Diaspora and Friends of Africa
  // =========================================================================
  {
    title: "Best CSR in Education (Africa Regional)",
    description: "Recognizing corporate social responsibility initiatives advancing education across Africa, the Diaspora, and Friends of Africa",
    includeGlobalRegions: true,
    regions: createAfricaRegionalSubcategories([
      { title: "Banking & Finance CSR", description: "Banks and financial institutions supporting educational initiatives" },
      { title: "Telecommunications CSR", description: "Telecom companies investing in education" },
      { title: "Technology & ICT CSR", description: "Tech companies driving educational innovation" },
      { title: "Oil & Gas CSR", description: "Energy sector contributions to education" },
      { title: "Food & Beverages CSR", description: "Food industry supporting educational causes" },
      { title: "Aviation CSR", description: "Aviation industry educational initiatives" },
    ]),
  },

  // =========================================================================
  // CATEGORY 2 — BEST CSR IN EDUCATION (NIGERIA)
  // =========================================================================
  {
    title: "Best CSR in Education (Nigeria)",
    description: "Celebrating Nigerian corporations making outstanding contributions to education",
    subCategories: [
      { title: "Banking & Finance", description: "Nigerian banks supporting educational initiatives", nominees: [] },
      { title: "Telecommunications", description: "Telecom companies investing in Nigerian education", nominees: [] },
      { title: "Oil & Gas", description: "Energy sector contributions to Nigerian education", nominees: [] },
      { title: "Food & Beverages", description: "Food industry supporting educational causes in Nigeria", nominees: [] },
      { title: "Manufacturing", description: "Manufacturing sector educational initiatives", nominees: [] },
      { title: "Aviation", description: "Aviation industry educational contributions", nominees: [] },
      { title: "Technology & IT", description: "Tech companies driving educational innovation", nominees: [] },
      { title: "Real Estate & Construction", description: "Real estate sector supporting education", nominees: [] },
      { title: "Retail & E-Commerce", description: "Retail sector educational initiatives", nominees: [] },
      { title: "Pharmaceuticals", description: "Pharma companies supporting education", nominees: [] },
      { title: "Insurance", description: "Insurance sector educational contributions", nominees: [] },
      { title: "Conglomerates", description: "Multi-sector corporations supporting education", nominees: [] },
      { title: "Media & Entertainment", description: "Media companies advancing educational causes", nominees: [] },
      { title: "Agriculture & Agribusiness", description: "Agribusiness supporting rural education", nominees: [] },
      { title: "Health Care & Hospitals", description: "Healthcare sector educational initiatives", nominees: [] },
      { title: "Professional Services", description: "Professional services firms supporting education", nominees: [] },
      { title: "FinTech", description: "FinTech companies driving financial literacy education", nominees: [] },
      { title: "Microfinance Banks", description: "Microfinance institutions supporting education", nominees: [] },
      { title: "Emerging Telecommunications", description: "New telecom entrants investing in education", nominees: [] },
      { title: "Technology & Software", description: "Software companies supporting educational technology", nominees: [] },
      { title: "Real Estate Development", description: "Real estate developers building educational facilities", nominees: [] },
      { title: "Commercial Retail", description: "Commercial retailers supporting education", nominees: [] },
      { title: "Hotels & Hospitality", description: "Hospitality industry educational contributions", nominees: [] },
    ],
  },

  // =========================================================================
  // CATEGORY 3 — BEST EDUTECH ORGANISATION (AFRICA REGIONAL)
  // =========================================================================
  {
    title: "Best EduTech Organisation (Africa Regional)",
    description: "Honoring technology-driven education innovations transforming learning across Africa and the Diaspora",
    includeGlobalRegions: true,
    regions: createAfricaRegionalSubcategories([
      { title: "EduTech Startup", description: "Innovative startups transforming African education" },
      { title: "EduTech Established Company", description: "Established companies with proven educational technology" },
      { title: "EduTech Social Impact Initiative", description: "Tech initiatives driving educational access" },
    ]),
  },

  // =========================================================================
  // CATEGORY 4 — BEST MEDIA ORGANISATION IN EDUCATIONAL ADVOCACY (NIGERIA)
  // =========================================================================
  {
    title: "Best Media Organisation in Educational Advocacy (Nigeria)",
    description: "Recognizing media organizations championing educational causes in Nigeria",
    subCategories: [
      { title: "Print Media Educational Advocacy", description: "Newspapers and magazines championing education", nominees: [] },
      { title: "Radio Educational Programme Excellence", description: "Radio stations with outstanding educational content", nominees: [] },
      { title: "Television Educational Content", description: "TV channels producing quality educational programming", nominees: [] },
      { title: "Digital Media Educational Advocacy", description: "Online platforms advancing educational causes", nominees: [] },
    ],
  },

  // =========================================================================
  // CATEGORY 5 — BEST NGO CONTRIBUTION TO EDUCATION (NIGERIA)
  // =========================================================================
  {
    title: "Best NGO Contribution to Education (Nigeria)",
    description: "Celebrating non-governmental organizations driving educational impact in Nigeria",
    subCategories: [
      { title: "Educational Infrastructure Development", description: "NGOs building schools and facilities", nominees: [] },
      { title: "Donation of Educational Materials", description: "Organizations providing books and supplies", nominees: [] },
      { title: "Education Aid & Scholarship Support", description: "NGOs offering scholarships and financial aid", nominees: [] },
      { title: "Youth Empowerment through Education", description: "Youth-focused educational initiatives", nominees: [] },
      { title: "Women & Girls' Education Empowerment", description: "Organizations championing female education", nominees: [] },
    ],
  },

  // =========================================================================
  // CATEGORY 6 — BEST NGO CONTRIBUTION TO EDUCATION FOR ALL (AFRICA REGIONAL)
  // =========================================================================
  {
    title: "Best NGO Contribution to Education for All (Africa Regional)",
    description: "Honoring NGOs advancing inclusive education across Africa, the Diaspora, and Friends of Africa",
    includeGlobalRegions: true,
    regions: createAfricaRegionalSubcategories([
      { title: "Educational Infrastructure", description: "Building educational facilities across Africa" },
      { title: "Education Aid & Scholarships", description: "Providing scholarships and financial support" },
      { title: "Educational Materials & Resources", description: "Distributing learning materials" },
      { title: "Youth Skills & Learning Programmes", description: "Skills training for African youth" },
      { title: "Women & Girls' Education Advocacy", description: "Championing female education" },
    ]),
  },

  // =========================================================================
  // CATEGORY 7 — BEST STEM EDUCATION PROGRAMME (AFRICA REGIONAL)
  // =========================================================================
  {
    title: "Best STEM Education Programme (Africa Regional)",
    description: "Recognizing excellence in Science, Technology, Engineering, and Mathematics education across Africa",
    includeGlobalRegions: true,
    regions: createAfricaRegionalSubcategories([
      { title: "Inclusive STEM Programme", description: "STEM programs promoting accessibility" },
      { title: "Digital STEM Innovation", description: "Digital platforms for STEM learning" },
      { title: "Community-Based STEM Outreach", description: "Grassroots STEM education initiatives" },
      { title: "Girls in STEM Advancement", description: "Programs encouraging girls in STEM" },
    ]),
  },

  // =========================================================================
  // CATEGORY 8 — CREATIVE ARTS INDUSTRY CONTRIBUTION TO EDUCATION (NIGERIA)
  // =========================================================================
  {
    title: "Creative Arts Industry Contribution to Education (Nigeria)",
    description: "Celebrating creative industries contributing to educational advancement in Nigeria",
    subCategories: [
      { title: "Nollywood Educational Content", description: "Nigerian film industry educational contributions", nominees: [] },
      { title: "Music Industry Contribution", description: "Musicians supporting educational causes", nominees: [] },
      { title: "Literature & Artistic Works", description: "Authors and artists advancing education", nominees: [] },
      { title: "Visual Arts Educational Impact", description: "Visual artists promoting educational awareness", nominees: [] },
      { title: "Performing Arts & Education", description: "Theatre and performance art education", nominees: [] },
      { title: "Film & Media for Education", description: "Documentary and educational media production", nominees: [] },
      { title: "Creative Advocacy Campaigns", description: "Creative campaigns for educational causes", nominees: [] },
    ],
  },

  // =========================================================================
  // CATEGORY 9 — BEST EDUCATION-FRIENDLY STATE (NIGERIA)
  // =========================================================================
  {
    title: "Best Education-Friendly State (Nigeria)",
    description: "Recognizing Nigerian states excelling in education policy and implementation",
    subCategories: [
      { title: "North Central", description: "States in the North Central geopolitical zone", nominees: [] },
      { title: "North East", description: "States in the North East geopolitical zone", nominees: [] },
      { title: "North West", description: "States in the North West geopolitical zone", nominees: [] },
      { title: "South East", description: "States in the South East geopolitical zone", nominees: [] },
      { title: "South South", description: "States in the South South geopolitical zone", nominees: [] },
      { title: "South West", description: "States in the South West geopolitical zone", nominees: [] },
    ],
  },

  // =========================================================================
  // CATEGORY 10 — BEST LIBRARY IN NIGERIAN TERTIARY INSTITUTIONS
  // =========================================================================
  {
    title: "Best Library in Nigerian Tertiary Institutions",
    description: "Celebrating excellence in library services across Nigerian higher education",
    subCategories: [
      { title: "Federal Universities", description: "Libraries in federal universities", nominees: [] },
      { title: "State Universities", description: "Libraries in state universities", nominees: [] },
      { title: "Private Universities", description: "Libraries in private universities", nominees: [] },
      { title: "Federal Polytechnics", description: "Libraries in federal polytechnics", nominees: [] },
      { title: "State Polytechnics", description: "Libraries in state polytechnics", nominees: [] },
      { title: "Colleges of Education", description: "Libraries in colleges of education", nominees: [] },
      { title: "Private Colleges & Specialised Institutions", description: "Libraries in private and specialized institutions", nominees: [] },
      { title: "Colleges of Nursing & Allied Health", description: "Libraries in nursing and health colleges", nominees: [] },
    ],
  },

  // =========================================================================
  // CATEGORY 11 — BEST RESEARCH & DEVELOPMENT CONTRIBUTION TO EDUCATION (NIGERIA)
  // =========================================================================
  {
    title: "Best Research & Development Contribution to Education (Nigeria)",
    description: "Honoring research institutions driving educational advancement in Nigeria",
    subCategories: [
      { title: "Agricultural & Food Research", description: "Agricultural research supporting education", nominees: [] },
      { title: "Health & Medical Research", description: "Medical research advancing educational health", nominees: [] },
      { title: "Environmental & Climate Research", description: "Environmental research for sustainable education", nominees: [] },
    ],
  },

  // =========================================================================
  // CATEGORY 12 — CHRISTIAN EDUCATION IMPACT (AFRICA REGIONAL)
  // =========================================================================
  {
    title: "Christian Education Impact (Africa Regional)",
    description: "Recognizing faith-based Christian contributions to education across Africa and the Diaspora",
    includeGlobalRegions: true,
    regions: createAfricaRegionalSubcategories([
      { title: "Faith-Based Schools & Institutions", description: "Christian schools making educational impact" },
      { title: "Christian Education NGOs", description: "Christian NGOs supporting education" },
      { title: "Christian Foundations & Philanthropy", description: "Christian philanthropic contributions to education" },
    ]),
  },

  // =========================================================================
  // CATEGORY 13 — ISLAMIC EDUCATION IMPACT (AFRICA REGIONAL)
  // =========================================================================
  {
    title: "Islamic Education Impact (Africa Regional)",
    description: "Honoring Islamic contributions to education across Africa and the Diaspora",
    includeGlobalRegions: true,
    regions: createAfricaRegionalSubcategories([
      { title: "Qur'anic & Islamiyya Schools", description: "Traditional Islamic educational institutions" },
      { title: "Integrated Islamic-Formal Education", description: "Schools combining Islamic and formal education" },
      { title: "Islamic Education NGOs & Foundations", description: "Islamic organizations supporting education" },
    ]),
  },

  // =========================================================================
  // CATEGORY 14 — POLITICAL LEADERS' EDUCATIONAL SUPPORT (NIGERIA)
  // =========================================================================
  {
    title: "Political Leaders' Educational Support (Nigeria)",
    description: "Recognizing political leaders championing educational development in Nigeria",
    subCategories: [
      { title: "Governors' Educational Impact", description: "State governors advancing education", nominees: [] },
      { title: "National Assembly Education Support", description: "Legislators supporting educational legislation", nominees: [] },
      { title: "Ministers / Commissioners / Advisers", description: "Political appointees advancing education", nominees: [] },
    ],
  },

  // =========================================================================
  // CATEGORY 15 — INTERNATIONAL & BILATERAL CONTRIBUTORS TO EDUCATION
  // (Friends of Africa category)
  // =========================================================================
  {
    title: "International & Bilateral Contributors to Education",
    description: "Celebrating international partners and Friends of Africa advancing education on the continent",
    subCategories: [
      { title: "Embassies & High Commissions", description: "Diplomatic missions supporting African education", nominees: [] },
      { title: "Bilateral Aid Agencies", description: "International development agencies in education", nominees: [] },
      { title: "Multilateral & International NGOs", description: "Global NGOs advancing African education", nominees: [] },
      { title: "Global Education Grant Foundations", description: "International foundations funding education", nominees: [] },
    ],
  },

  // =========================================================================
  // CATEGORY 16 — DIASPORA ASSOCIATION EDUCATIONAL IMPACT
  // =========================================================================
  {
    title: "Diaspora Association Educational Impact",
    description: "Honoring diaspora organizations contributing to African education from around the world",
    subCategories: [
      { title: "Europe-based Associations", description: "European diaspora supporting African education", nominees: [] },
      { title: "Americas-based Associations", description: "American diaspora supporting African education", nominees: [] },
      { title: "Middle East / Asia-Pacific Associations", description: "ME/APAC diaspora supporting education", nominees: [] },
    ],
  },

  // =========================================================================
  // CATEGORY 17 — AFRICA EDUCATION ICON AWARD (2005–2025)
  // =========================================================================
  {
    title: "Africa Education Icon Award (2005–2025)",
    description: "Lifetime achievement recognition for transformational leaders in African education",
    subCategories: [
      { title: "Africa Education Philanthropy Icon of the Decade", description: "Philanthropists with lifetime educational impact", nominees: [] },
      { title: "Literary & New Curriculum Advocate Icon of the Decade", description: "Literary figures advancing curriculum development", nominees: [] },
      { title: "Africa Technical Educator Icon of the Decade", description: "Technical education pioneers", nominees: [] },
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Find a category by its exact title
 */
export function getCategoryByTitle(title: string): Category | undefined {
  return categories.find((cat) => cat.title === title);
}

/**
 * Get all category titles
 */
export function getCategoryTitles(): string[] {
  return categories.map((cat) => cat.title);
}

/**
 * Get the first nominee image from a subcategory, with fallback
 */
export function getSubCategoryImage(subCategory: SubCategory): string {
  if (subCategory.nominees.length > 0 && subCategory.nominees[0].image) {
    return subCategory.nominees[0].image;
  }
  return FALLBACK_IMAGE;
}

/**
 * Check if a category has regions
 */
export function hasRegions(category: Category): boolean {
  return !!category.regions && category.regions.length > 0;
}

/**
 * Get subcategories for a category, either directly or from a selected region
 */
export function getSubCategories(category: Category, selectedRegion?: string): SubCategory[] {
  if (category.subCategories) {
    return category.subCategories;
  }
  
  if (category.regions && selectedRegion) {
    const region = category.regions.find((r) => r.name === selectedRegion);
    return region?.subCategories || [];
  }
  
  // Default to first region if none selected
  if (category.regions && category.regions.length > 0) {
    return category.regions[0].subCategories;
  }
  
  return [];
}

/**
 * Get regions for a category (returns empty array if no regions)
 */
export function getCategoryRegions(category: Category): AfricanRegion[] {
  if (!category.regions) return [];
  return category.regions.map((r) => r.name);
}

/**
 * Check if a category includes global regions (Diaspora + Friends of Africa)
 */
export function includesGlobalRegions(category: Category): boolean {
  return category.includeGlobalRegions === true;
}
