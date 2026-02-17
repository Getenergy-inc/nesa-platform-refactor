// ============================================================================
// NESA-AFRICA AUTHORITATIVE AWARD CATEGORIES CONFIGURATION
// ============================================================================
// This is the SINGLE SOURCE OF TRUTH for all award categories.
// Last Updated: 2025-01-25
// Total Categories: 17
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================

export type CategoryScope = "AFRICA_REGIONAL" | "NIGERIA" | "INTERNATIONAL" | "ICON";

export type AwardTier = "platinum" | "gold" | "blue-garnet" | "icon" | "gold-special";

export type TierApplicability = {
  platinum: boolean;
  gold: boolean;
  blueGarnet: boolean;
  icon: boolean;
  goldSpecial?: boolean;
};

export interface SubcategoryDefinition {
  id: string;
  name: string;
  description?: string;
  /** If true, this subcategory is multiplied across 5 African regions */
  regionMultiplied?: boolean;
  /** For Nigeria political categories - zone attribute for scoring */
  zoneAttribute?: boolean;
}

export interface CategoryDefinition {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  scope: CategoryScope;
  /** Which tiers this category can progress through */
  tierApplicability: TierApplicability;
  /** Selection method description */
  selectionMethod: string;
  subcategories: SubcategoryDefinition[];
  /** Display order in UI */
  displayOrder: number;
  /** Icon name for UI (lucide-react) */
  iconName: string;
  /** Whether this category is currently active */
  isActive: boolean;
}

// ============================================================================
// AFRICAN REGIONS (for region-first multiplication)
// ============================================================================

export const AFRICAN_REGIONS = [
  { id: "north-africa", name: "North Africa", code: "NA" },
  { id: "west-africa", name: "West Africa", code: "WA" },
  { id: "east-africa", name: "East Africa", code: "EA" },
  { id: "central-africa", name: "Central Africa", code: "CA" },
  { id: "southern-africa", name: "Southern Africa", code: "SA" },
] as const;

export type AfricanRegion = typeof AFRICAN_REGIONS[number];

// ============================================================================
// NIGERIAN GEOPOLITICAL ZONES (for zone-based categories)
// ============================================================================

export const NIGERIAN_ZONES = [
  { id: "north-central", name: "North Central", code: "NC" },
  { id: "north-east", name: "North East", code: "NE" },
  { id: "north-west", name: "North West", code: "NW" },
  { id: "south-east", name: "South East", code: "SE" },
  { id: "south-south", name: "South South", code: "SS" },
  { id: "south-west", name: "South West", code: "SW" },
] as const;

export type NigerianZone = typeof NIGERIAN_ZONES[number];

// ============================================================================
// TIER CONFIGURATION
// ============================================================================

/**
 * Platinum tier categories are divided into two threshold groups:
 * - CORE (7 categories): 100 renominations to unlock certificate
 * - STANDARD (10 categories): 200 renominations to unlock certificate
 */
export const PLATINUM_THRESHOLDS = {
  CORE: 100,      // 7 core categories
  STANDARD: 200,  // 10 standard categories
} as const;

/**
 * Core Platinum category IDs (100 renomination threshold)
 * These are the specialized/institutional categories
 */
export const CORE_PLATINUM_CATEGORY_IDS = [
  "cat-10", // Library
  "cat-11", // R&D
  "cat-12", // Christian Education
  "cat-13", // Islamic Education
  "cat-14", // Political Leaders
  "cat-15", // International Contributors
  "cat-16", // Diaspora Impact
] as const;

export const TIER_INFO: Record<AwardTier, {
  name: string;
  shortName: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  votingMethod: string;
  validity: string;
}> = {
  platinum: {
    name: "Platinum Certificate",
    shortName: "Platinum",
    description: "Baseline recognition for all 17 categories through NRC verification",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
    votingMethod: "NRC Verification",
    validity: "1 year (renewable)",
  },
  gold: {
    name: "Gold Certificate",
    shortName: "Gold",
    description: "Competitive classification with 100% public voting — Top 3 per subcategory (405 Gold Certificate winners)",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
    votingMethod: "100% Public Voting",
    validity: "Annual",
  },
  "blue-garnet": {
    name: "Blue Garnet Award",
    shortName: "Blue Garnet",
    description: "Elite recognition with 40% public + 60% jury evaluation (9 categories)",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    votingMethod: "40% Public + 60% Jury",
    validity: "Lifetime",
  },
  icon: {
    name: "Africa Education Icon",
    shortName: "Icon",
    description: "Lifetime achievement — 1 category with 3 subcategories (2005–2025)",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    votingMethod: "Jury Selection Only",
    validity: "Lifetime",
  },
  "gold-special": {
    name: "Gold Special Recognition",
    shortName: "Gold Special",
    description: "Cultural impact recognition for Sports, Music, and Social Media education advocacy (2025 Edition)",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
    votingMethod: "Editorial Selection",
    validity: "Annual (2025)",
  },
};

// ============================================================================
// THE 17 OFFICIAL NESA-AFRICA CATEGORIES
// ============================================================================

export const NESA_CATEGORIES: CategoryDefinition[] = [
  // =========================================================================
  // CATEGORY 1 — BEST CSR IN EDUCATION (AFRICA REGIONAL)
  // Standard Platinum (200 threshold) + Gold + Blue Garnet track
  // =========================================================================
  {
    id: "cat-01",
    slug: "best-csr-education-africa",
    name: "Best CSR for Education (Africa Regional)",
    shortName: "CSR Africa",
    description: "Recognizing corporate social responsibility initiatives advancing education across the African continent",
    scope: "AFRICA_REGIONAL",
    tierApplicability: { platinum: false, gold: true, blueGarnet: true, icon: false },
    selectionMethod: "Public voting → Jury evaluation",
    displayOrder: 1,
    iconName: "Building2",
    isActive: true,
    subcategories: [
      { id: "csr-africa-banking", name: "Banking & Finance CSR", regionMultiplied: true },
      { id: "csr-africa-telecom", name: "Telecommunications CSR", regionMultiplied: true },
      { id: "csr-africa-tech", name: "Technology & ICT CSR", regionMultiplied: true },
      { id: "csr-africa-oil", name: "Oil & Gas CSR", regionMultiplied: true },
      { id: "csr-africa-food", name: "Food & Beverages CSR", regionMultiplied: true },
      { id: "csr-africa-aviation", name: "Aviation CSR", regionMultiplied: true },
    ],
  },

  // =========================================================================
  // CATEGORY 2 — BEST CSR IN EDUCATION (NIGERIA)
  // Gold + Blue Garnet track
  // =========================================================================
  {
    id: "cat-02",
    slug: "best-csr-education-nigeria",
    name: "Best CSR for Education (Nigeria)",
    shortName: "CSR Nigeria",
    description: "Celebrating Nigerian corporations making outstanding contributions to education",
    scope: "NIGERIA",
    tierApplicability: { platinum: true, gold: true, blueGarnet: true, icon: false },
    selectionMethod: "Public voting → Jury evaluation",
    displayOrder: 2,
    iconName: "Building",
    isActive: true,
    subcategories: [
      { id: "csr-ng-banking", name: "Banking & Finance" },
      { id: "csr-ng-telecom", name: "Telecommunications" },
      { id: "csr-ng-oil", name: "Oil & Gas" },
      { id: "csr-ng-food", name: "Food & Beverages" },
      { id: "csr-ng-manufacturing", name: "Manufacturing" },
      { id: "csr-ng-aviation", name: "Aviation" },
      { id: "csr-ng-tech-it", name: "Technology & IT" },
      { id: "csr-ng-realestate", name: "Real Estate & Construction" },
      { id: "csr-ng-retail", name: "Retail & E-Commerce" },
      { id: "csr-ng-pharma", name: "Pharmaceuticals" },
      { id: "csr-ng-insurance", name: "Insurance" },
      { id: "csr-ng-conglomerates", name: "Conglomerates" },
      { id: "csr-ng-media", name: "Media & Entertainment" },
      { id: "csr-ng-agric", name: "Agriculture & Agribusiness" },
      { id: "csr-ng-health", name: "Health Care & Hospitals" },
      { id: "csr-ng-professional", name: "Professional Services" },
      { id: "csr-ng-fintech", name: "FinTech" },
      { id: "csr-ng-microfinance", name: "Microfinance Banks" },
      { id: "csr-ng-emerging-telecom", name: "Emerging Telecommunications" },
      { id: "csr-ng-software", name: "Technology & Software" },
      { id: "csr-ng-realestate-dev", name: "Real Estate Development" },
      { id: "csr-ng-commercial-retail", name: "Commercial Retail" },
      { id: "csr-ng-hospitality", name: "Hotels & Hospitality" },
    ],
  },

  // =========================================================================
  // CATEGORY 3 — BEST EDUTECH ORGANISATION (AFRICA REGIONAL)
  // Gold + Blue Garnet track
  // =========================================================================
  {
    id: "cat-03",
    slug: "best-edutech-organisation-africa",
    name: "Best EduTech Innovation for Education (Africa Regional)",
    shortName: "EduTech Africa",
    description: "Honoring technology-driven education innovations transforming learning across Africa",
    scope: "AFRICA_REGIONAL",
    tierApplicability: { platinum: true, gold: true, blueGarnet: true, icon: false },
    selectionMethod: "Public voting → Jury evaluation",
    displayOrder: 3,
    iconName: "Laptop",
    isActive: true,
    subcategories: [
      { id: "edutech-startup", name: "EduTech Startup", regionMultiplied: true },
      { id: "edutech-established", name: "EduTech Established Company", regionMultiplied: true },
      { id: "edutech-social", name: "EduTech Social Impact Initiative", regionMultiplied: true },
    ],
  },

  // =========================================================================
  // CATEGORY 4 — BEST MEDIA ORGANISATION IN EDUCATIONAL ADVOCACY (NIGERIA)
  // Gold + Blue Garnet track
  // =========================================================================
  {
    id: "cat-04",
    slug: "best-media-educational-advocacy-nigeria",
    name: "Best Media Organisation for Education Advocacy (Nigeria)",
    shortName: "Media Advocacy Nigeria",
    description: "Recognizing media organisations championing education advocacy in Nigeria",
    scope: "NIGERIA",
    tierApplicability: { platinum: true, gold: true, blueGarnet: true, icon: false },
    selectionMethod: "Public voting → Jury evaluation",
    displayOrder: 4,
    iconName: "Radio",
    isActive: true,
    subcategories: [
      { id: "media-ng-print", name: "Print Media Educational Advocacy" },
      { id: "media-ng-radio", name: "Radio Educational Programme Excellence" },
      { id: "media-ng-tv", name: "Television Educational Content" },
      { id: "media-ng-digital", name: "Digital Media Educational Advocacy" },
    ],
  },

  // =========================================================================
  // CATEGORY 5 — BEST NGO CONTRIBUTION TO EDUCATION (NIGERIA)
  // Gold + Blue Garnet track
  // =========================================================================
  {
    id: "cat-05",
    slug: "best-ngo-education-nigeria",
    name: "Best NGO for Education Advancement (Nigeria)",
    shortName: "NGO Nigeria",
    description: "Celebrating non-governmental organisations advancing education impact in Nigeria",
    scope: "NIGERIA",
    tierApplicability: { platinum: true, gold: true, blueGarnet: true, icon: false },
    selectionMethod: "Public voting → Jury evaluation",
    displayOrder: 5,
    iconName: "Heart",
    isActive: true,
    subcategories: [
      { id: "ngo-ng-infrastructure", name: "Educational Infrastructure Development" },
      { id: "ngo-ng-materials", name: "Donation of Educational Materials" },
      { id: "ngo-ng-scholarship", name: "Education Aid & Scholarship Support" },
      { id: "ngo-ng-youth", name: "Youth Empowerment through Education" },
      { id: "ngo-ng-women", name: "Women & Girls' Education Empowerment" },
    ],
  },

  // =========================================================================
  // CATEGORY 6 — BEST NGO CONTRIBUTION TO EDUCATION FOR ALL (AFRICA REGIONAL)
  // Gold + Blue Garnet track
  // =========================================================================
  {
    id: "cat-06",
    slug: "best-ngo-education-africa",
    name: "Best NGO for Education Advancement (Africa Regional)",
    shortName: "NGO Africa",
    description: "Honoring NGOs advancing inclusive education across the African continent",
    scope: "AFRICA_REGIONAL",
    tierApplicability: { platinum: true, gold: true, blueGarnet: true, icon: false },
    selectionMethod: "Public voting → Jury evaluation",
    displayOrder: 6,
    iconName: "Users",
    isActive: true,
    subcategories: [
      { id: "ngo-africa-infrastructure", name: "Educational Infrastructure", regionMultiplied: true },
      { id: "ngo-africa-scholarship", name: "Education Aid & Scholarships", regionMultiplied: true },
      { id: "ngo-africa-materials", name: "Educational Materials & Resources", regionMultiplied: true },
      { id: "ngo-africa-youth", name: "Youth Skills & Learning Programmes", regionMultiplied: true },
      { id: "ngo-africa-women", name: "Women & Girls' Education Advocacy", regionMultiplied: true },
    ],
  },

  // =========================================================================
  // CATEGORY 7 — BEST STEM EDUCATION PROGRAMME (AFRICA REGIONAL)
  // Gold + Blue Garnet track
  // =========================================================================
  {
    id: "cat-07",
    slug: "best-stem-education-africa",
    name: "Best STEM Education Programme (Africa Regional)",
    shortName: "STEM Africa",
    description: "Recognizing excellence in Science, Technology, Engineering, and Mathematics education",
    scope: "AFRICA_REGIONAL",
    tierApplicability: { platinum: true, gold: true, blueGarnet: true, icon: false },
    selectionMethod: "Public voting → Jury evaluation",
    displayOrder: 7,
    iconName: "FlaskConical",
    isActive: true,
    subcategories: [
      { id: "stem-inclusive", name: "Inclusive STEM Programme", regionMultiplied: true },
      { id: "stem-digital", name: "Digital STEM Innovation", regionMultiplied: true },
      { id: "stem-community", name: "Community-Based STEM Outreach", regionMultiplied: true },
      { id: "stem-girls", name: "Girls in STEM Advancement", regionMultiplied: true },
    ],
  },

  // =========================================================================
  // CATEGORY 8 — CREATIVE ARTS INDUSTRY CONTRIBUTION TO EDUCATION (NIGERIA)
  // Gold + Blue Garnet track
  // =========================================================================
  {
    id: "cat-08",
    slug: "creative-arts-education-nigeria",
    name: "Best Creative Arts Contribution to Education (Nigeria)",
    shortName: "Creative Arts Nigeria",
    description: "Celebrating creative industries advancing education impact in Nigeria",
    scope: "NIGERIA",
    tierApplicability: { platinum: true, gold: true, blueGarnet: true, icon: false },
    selectionMethod: "Public voting → Jury evaluation",
    displayOrder: 8,
    iconName: "Palette",
    isActive: true,
    subcategories: [
      { id: "arts-ng-nollywood", name: "Nollywood Educational Content" },
      { id: "arts-ng-music", name: "Music Industry Contribution" },
      { id: "arts-ng-literature", name: "Literature & Artistic Works" },
      { id: "arts-ng-visual", name: "Visual Arts Educational Impact" },
      { id: "arts-ng-performing", name: "Performing Arts & Education" },
      { id: "arts-ng-film", name: "Film & Media for Education" },
      { id: "arts-ng-campaigns", name: "Creative Advocacy Campaigns" },
    ],
  },

  // =========================================================================
  // CATEGORY 9 — BEST EDUCATION-FRIENDLY STATE (NIGERIA)
  // Gold + Blue Garnet track
  // =========================================================================
  {
    id: "cat-09",
    slug: "best-education-friendly-state-nigeria",
    name: "Best Education Policy & Implementation State (Nigeria)",
    shortName: "Education Policy State",
    description: "Recognizing Nigerian states excelling in education policy and implementation",
    scope: "NIGERIA",
    tierApplicability: { platinum: true, gold: true, blueGarnet: true, icon: false },
    selectionMethod: "Public voting → Jury evaluation",
    displayOrder: 9,
    iconName: "MapPin",
    isActive: true,
    subcategories: [
      { id: "state-ng-nc", name: "North Central" },
      { id: "state-ng-ne", name: "North East" },
      { id: "state-ng-nw", name: "North West" },
      { id: "state-ng-se", name: "South East" },
      { id: "state-ng-ss", name: "South South" },
      { id: "state-ng-sw", name: "South West" },
    ],
  },

  // =========================================================================
  // CATEGORY 10 — BEST LIBRARY IN NIGERIAN TERTIARY INSTITUTIONS
  // CORE PLATINUM (100 threshold) — Platinum only, no Gold/Blue Garnet
  // =========================================================================
  {
    id: "cat-10",
    slug: "best-library-tertiary-nigeria",
    name: "Best Tertiary Institution Library (Nigeria)",
    shortName: "Library Nigeria",
    description: "Celebrating excellence in library services across Nigerian higher education",
    scope: "NIGERIA",
    tierApplicability: { platinum: true, gold: false, blueGarnet: false, icon: false },
    selectionMethod: "Public voting → Jury evaluation",
    displayOrder: 10,
    iconName: "BookOpen",
    isActive: true,
    subcategories: [
      { id: "library-ng-fed-uni", name: "Federal Universities" },
      { id: "library-ng-state-uni", name: "State Universities" },
      { id: "library-ng-private-uni", name: "Private Universities" },
      { id: "library-ng-fed-poly", name: "Federal Polytechnics" },
      { id: "library-ng-state-poly", name: "State Polytechnics" },
      { id: "library-ng-coe", name: "Colleges of Education" },
      { id: "library-ng-private-colleges", name: "Private Colleges & Specialised Institutions" },
      { id: "library-ng-nursing", name: "Colleges of Nursing & Allied Health" },
    ],
  },

  // =========================================================================
  // CATEGORY 11 — BEST RESEARCH & DEVELOPMENT CONTRIBUTION TO EDUCATION (NIGERIA)
  // CORE PLATINUM (100 threshold) — Platinum only, no Gold/Blue Garnet
  // =========================================================================
  {
    id: "cat-11",
    slug: "best-research-development-nigeria",
    name: "Excellence in Research & Development for Education (Nigeria)",
    shortName: "R&D Nigeria",
    description: "Honoring research institutions advancing education in Nigeria",
    scope: "NIGERIA",
    tierApplicability: { platinum: true, gold: false, blueGarnet: false, icon: false },
    selectionMethod: "NRC verification",
    displayOrder: 11,
    iconName: "Microscope",
    isActive: true,
    subcategories: [
      { id: "rd-ng-agric", name: "Agricultural & Food Research" },
      { id: "rd-ng-health", name: "Health & Medical Research" },
      { id: "rd-ng-environment", name: "Environmental & Climate Research" },
    ],
  },

  // =========================================================================
  // CATEGORY 12 — CHRISTIAN EDUCATION IMPACT (AFRICA REGIONAL)
  // CORE PLATINUM (100 threshold) — Platinum only, no Gold/Blue Garnet
  // =========================================================================
  {
    id: "cat-12",
    slug: "christian-education-impact-africa",
    name: "Excellence in Christian Education Impact (Africa Regional)",
    shortName: "Christian Education Africa",
    description: "Recognizing faith-based Christian impact on education across Africa",
    scope: "AFRICA_REGIONAL",
    tierApplicability: { platinum: true, gold: false, blueGarnet: false, icon: false },
    selectionMethod: "NRC verification",
    displayOrder: 12,
    iconName: "Church",
    isActive: true,
    subcategories: [
      { id: "christian-schools", name: "Faith-Based Schools & Institutions" },
      { id: "christian-ngos", name: "Christian Education NGOs" },
      { id: "christian-foundations", name: "Christian Foundations & Philanthropy" },
    ],
  },

  // =========================================================================
  // CATEGORY 13 — ISLAMIC EDUCATION IMPACT (AFRICA REGIONAL)
  // CORE PLATINUM (100 threshold) — Platinum only, no Gold/Blue Garnet
  // =========================================================================
  {
    id: "cat-13",
    slug: "islamic-education-impact-africa",
    name: "Excellence in Islamic Education Impact (Africa Regional)",
    shortName: "Islamic Education Africa",
    description: "Honoring Islamic impact on education across the African continent",
    scope: "AFRICA_REGIONAL",
    tierApplicability: { platinum: true, gold: false, blueGarnet: false, icon: false },
    selectionMethod: "NRC verification",
    displayOrder: 13,
    iconName: "Moon",
    isActive: true,
    subcategories: [
      { id: "islamic-quranic", name: "Qur'anic & Islamiyya Schools" },
      { id: "islamic-integrated", name: "Integrated Islamic-Formal Education" },
      { id: "islamic-ngos", name: "Islamic Education NGOs & Foundations" },
    ],
  },

  // =========================================================================
  // CATEGORY 14 — POLITICAL LEADERS' EDUCATIONAL SUPPORT (NIGERIA)
  // CORE PLATINUM (100 threshold) — Platinum only, no Gold/Blue Garnet
  // =========================================================================
  {
    id: "cat-14",
    slug: "political-leaders-education-nigeria",
    name: "Excellence in Political Leadership for Education (Nigeria)",
    shortName: "Political Leaders Nigeria",
    description: "Recognizing political leaders championing education advancement in Nigeria",
    scope: "NIGERIA",
    tierApplicability: { platinum: true, gold: false, blueGarnet: false, icon: false },
    selectionMethod: "NRC verification → Zone-based assessment",
    displayOrder: 14,
    iconName: "Landmark",
    isActive: true,
    subcategories: [
      { id: "political-ng-governors", name: "Governors' Educational Impact", zoneAttribute: true },
      { id: "political-ng-nass", name: "National Assembly Education Support", zoneAttribute: true },
      { id: "political-ng-ministers", name: "Ministers / Commissioners / Advisers", zoneAttribute: true },
    ],
  },

  // =========================================================================
  // CATEGORY 15 — INTERNATIONAL & BILATERAL CONTRIBUTORS TO EDUCATION
  // CORE PLATINUM (100 threshold) — Platinum only, no Gold/Blue Garnet
  // =========================================================================
  {
    id: "cat-15",
    slug: "international-bilateral-education",
    name: "Excellence in International Partnership for Education (Africa)",
    shortName: "International Partners",
    description: "Celebrating international partners advancing education across Africa",
    scope: "INTERNATIONAL",
    tierApplicability: { platinum: true, gold: false, blueGarnet: false, icon: false },
    selectionMethod: "NRC verification",
    displayOrder: 15,
    iconName: "Globe",
    isActive: true,
    subcategories: [
      { id: "intl-embassies", name: "Embassies & High Commissions" },
      { id: "intl-bilateral", name: "Bilateral Aid Agencies" },
      { id: "intl-multilateral", name: "Multilateral & International NGOs" },
      { id: "intl-foundations", name: "Global Education Grant Foundations" },
    ],
  },

  // =========================================================================
  // CATEGORY 16 — DIASPORA ASSOCIATION EDUCATIONAL IMPACT
  // CORE PLATINUM (100 threshold) — Platinum only, no Gold/Blue Garnet
  // =========================================================================
  {
    id: "cat-16",
    slug: "diaspora-education-impact",
    name: "Excellence in Diaspora Educational Impact (International)",
    shortName: "Diaspora Impact",
    description: "Honoring diaspora organisations advancing education in Africa",
    scope: "INTERNATIONAL",
    tierApplicability: { platinum: true, gold: false, blueGarnet: false, icon: false },
    selectionMethod: "NRC verification",
    displayOrder: 16,
    iconName: "Plane",
    isActive: true,
    subcategories: [
      { id: "diaspora-europe", name: "Europe-based Associations" },
      { id: "diaspora-americas", name: "Americas-based Associations" },
      { id: "diaspora-asia-me", name: "Middle East / Asia-Pacific Associations" },
    ],
  },

  // =========================================================================
  // CATEGORY 17 — AFRICA EDUCATION ICON BLUE GARNET (2005–2025)
  // Special Icon tier — 1 category with 3 subcategories
  // =========================================================================
  {
    id: "cat-17",
    slug: "africa-education-icon-award",
    name: "Africa Education Icon Lifetime Achievement Award (2005–2025)",
    shortName: "Africa Education Icon",
    description: "Continental honour recognising transformational leaders in African education",
    scope: "ICON",
    tierApplicability: { platinum: false, gold: false, blueGarnet: false, icon: true },
    selectionMethod: "Jury Selection Only — 9 Icons (3 per subcategory)",
    displayOrder: 17,
    iconName: "Crown",
    isActive: true,
    subcategories: [
      { id: "icon-philanthropy", name: "Africa Education Philanthropy Icon of the Decade" },
      { id: "icon-literary", name: "Literary & New Curriculum Advocate Icon of the Decade" },
      { id: "icon-technical", name: "Africa Technical Educator Icon of the Decade" },
    ],
  },

  // =========================================================================
  // GOLD SPECIAL RECOGNITION — 2025 EDITION
  // 3 standalone categories, not merged with Blue Garnet
  // =========================================================================

  {
    id: "cat-gs-01",
    slug: "africa-sports-education-impact",
    name: "Africa Sports Education Impact Recognition",
    shortName: "Sports for Education",
    description: "Recognizing sportsmen and sportswomen championing education advocacy across Africa",
    scope: "AFRICA_REGIONAL",
    tierApplicability: { platinum: false, gold: false, blueGarnet: false, icon: false, goldSpecial: true },
    selectionMethod: "Editorial Selection — Cultural Impact Recognition 2025",
    displayOrder: 101,
    iconName: "Users",
    isActive: true,
    subcategories: [
      { id: "gs-sports-man", name: "Sportsman Supporting Education" },
      { id: "gs-sports-woman", name: "Sportswoman Supporting Education" },
    ],
  },

  {
    id: "cat-gs-02",
    slug: "africa-music-education-impact",
    name: "Africa Music Education Impact Recognition",
    shortName: "Music for Education",
    description: "Recognizing music artists championing education advocacy across Africa",
    scope: "AFRICA_REGIONAL",
    tierApplicability: { platinum: false, gold: false, blueGarnet: false, icon: false, goldSpecial: true },
    selectionMethod: "Editorial Selection — Cultural Impact Recognition 2025",
    displayOrder: 102,
    iconName: "Palette",
    isActive: true,
    subcategories: [
      { id: "gs-music-artist", name: "Music Artist Supporting Education" },
    ],
  },

  {
    id: "cat-gs-03",
    slug: "africa-social-media-education-impact",
    name: "Africa Social Media Education Impact Recognition",
    shortName: "Social Media for Education",
    description: "Recognizing social media influencers championing education advocacy across Africa",
    scope: "AFRICA_REGIONAL",
    tierApplicability: { platinum: false, gold: false, blueGarnet: false, icon: false, goldSpecial: true },
    selectionMethod: "Editorial Selection — Cultural Impact Recognition 2025",
    displayOrder: 103,
    iconName: "Globe",
    isActive: true,
    subcategories: [
      { id: "gs-social-edu-content", name: "Educational Content Creator" },
      { id: "gs-social-csr", name: "Social Media CSR Advocate for Education" },
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all categories filtered by scope
 */
export function getCategoriesByScope(scope: CategoryScope): CategoryDefinition[] {
  return NESA_CATEGORIES.filter((cat) => cat.scope === scope);
}

/**
 * Get all Africa Regional categories (for "Categories (Africa First)" view)
 */
export function getAfricaRegionalCategories(): CategoryDefinition[] {
  return NESA_CATEGORIES.filter(
    (cat) => cat.scope === "AFRICA_REGIONAL" || cat.scope === "INTERNATIONAL" || cat.scope === "ICON"
  );
}

/**
 * Get all Nigeria-specific categories
 */
export function getNigeriaCategories(): CategoryDefinition[] {
  return NESA_CATEGORIES.filter((cat) => cat.scope === "NIGERIA");
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return NESA_CATEGORIES.find((cat) => cat.slug === slug);
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): CategoryDefinition | undefined {
  return NESA_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Calculate total subcategory count for a category (applying region multiplication)
 */
export function getSubcategoryCount(category: CategoryDefinition): number {
  return category.subcategories.reduce((total, sub) => {
    if (sub.regionMultiplied) {
      return total + AFRICAN_REGIONS.length;
    }
    return total + 1;
  }, 0);
}

/**
 * Generate all subcategories for a category (expanding region-multiplied ones)
 */
export function getExpandedSubcategories(category: CategoryDefinition): Array<{
  id: string;
  name: string;
  region?: AfricanRegion;
  baseSubcategory: SubcategoryDefinition;
}> {
  const expanded: Array<{
    id: string;
    name: string;
    region?: AfricanRegion;
    baseSubcategory: SubcategoryDefinition;
  }> = [];

  for (const sub of category.subcategories) {
    if (sub.regionMultiplied) {
      for (const region of AFRICAN_REGIONS) {
        expanded.push({
          id: `${sub.id}-${region.id}`,
          name: `${sub.name} (${region.name})`,
          region: region,
          baseSubcategory: sub,
        });
      }
    } else {
      expanded.push({
        id: sub.id,
        name: sub.name,
        baseSubcategory: sub,
      });
    }
  }

  return expanded;
}

/**
 * Get total subcategory count across all categories
 */
export function getTotalSubcategoryCount(): number {
  return NESA_CATEGORIES.reduce((total, cat) => total + getSubcategoryCount(cat), 0);
}

/**
 * Get categories by tier applicability
 */
export function getCategoriesByTier(tier: AwardTier): CategoryDefinition[] {
  return NESA_CATEGORIES.filter((cat) => {
    switch (tier) {
      case "platinum":
        return cat.tierApplicability.platinum;
      case "gold":
        return cat.tierApplicability.gold;
      case "blue-garnet":
        return cat.tierApplicability.blueGarnet;
      case "icon":
        return cat.tierApplicability.icon;
      case "gold-special":
        return cat.tierApplicability.goldSpecial === true;
      default:
        return false;
    }
  });
}

/**
 * Get categories grouped by visual tier for the category grid
 * Returns 4 groups: Blue Garnet (competitive), Platinum (institutional), Lifetime, Gold Special
 */
export function getCategoriesGrouped() {
  return {
    blueGarnet: NESA_CATEGORIES.filter(c => c.tierApplicability.blueGarnet && !c.tierApplicability.icon && !c.tierApplicability.goldSpecial),
    platinum: NESA_CATEGORIES.filter(c => c.tierApplicability.platinum && !c.tierApplicability.blueGarnet && !c.tierApplicability.icon),
    lifetime: NESA_CATEGORIES.filter(c => c.tierApplicability.icon),
    goldSpecial: NESA_CATEGORIES.filter(c => c.tierApplicability.goldSpecial === true),
  };
}

/**
 * Get the track type for a category
 */
export type CategoryTrack = "competitive" | "institutional" | "special-recognition" | "lifetime";
export function getCategoryTrack(category: CategoryDefinition): CategoryTrack {
  if (category.tierApplicability.icon) return "lifetime";
  if (category.tierApplicability.goldSpecial) return "special-recognition";
  if (category.tierApplicability.blueGarnet) return "competitive";
  return "institutional";
}

/**
 * Get tier progression path for a category
 */
export function getTierPath(category: CategoryDefinition): AwardTier[] {
  const path: AwardTier[] = [];
  if (category.tierApplicability.platinum) path.push("platinum");
  if (category.tierApplicability.gold) path.push("gold");
  if (category.tierApplicability.blueGarnet) path.push("blue-garnet");
  if (category.tierApplicability.icon) path.push("icon");
  return path;
}

/**
 * Check if a category is competitive (has public voting)
 */
export function isCompetitiveCategory(category: CategoryDefinition): boolean {
  return category.tierApplicability.gold || category.tierApplicability.blueGarnet;
}

/**
 * Get display badge for category scope
 */
export function getScopeBadge(scope: CategoryScope): { label: string; color: string } {
  switch (scope) {
    case "AFRICA_REGIONAL":
      return { label: "Africa Regional", color: "bg-green-100 text-green-800" };
    case "NIGERIA":
      return { label: "Nigeria", color: "bg-emerald-100 text-emerald-800" };
    case "INTERNATIONAL":
      return { label: "International", color: "bg-blue-100 text-blue-800" };
    case "ICON":
      return { label: "Lifetime Achievement", color: "bg-purple-100 text-purple-800" };
    default:
      return { label: scope, color: "bg-gray-100 text-gray-800" };
  }
}

// ============================================================================
// SUMMARY STATISTICS
// ============================================================================

export const CATEGORY_STATS = {
  totalCategories: NESA_CATEGORIES.length,
  africaRegionalCategories: getCategoriesByScope("AFRICA_REGIONAL").length,
  nigeriaCategories: getCategoriesByScope("NIGERIA").length,
  internationalCategories: getCategoriesByScope("INTERNATIONAL").length,
  iconCategories: getCategoriesByScope("ICON").length,
  totalSubcategories: getTotalSubcategoryCount(),
  competitiveCategories: NESA_CATEGORIES.filter(isCompetitiveCategory).length,
  platinumEligible: getCategoriesByTier("platinum").length, // Should be 17 (all categories)
  goldEligible: getCategoriesByTier("gold").length,          // Should be 9 categories
  blueGarnetEligible: getCategoriesByTier("blue-garnet").length, // Should be 9 + 1 Icon = 10
  corePlatinumCategories: CORE_PLATINUM_CATEGORY_IDS.length, // 7 core (100 threshold)
  standardPlatinumCategories: NESA_CATEGORIES.length - CORE_PLATINUM_CATEGORY_IDS.length - 1, // 10 standard (200 threshold), minus Icon
};

/**
 * Helper to check if a category is core platinum (100 threshold)
 */
export function isCorePlatinumCategory(categoryId: string): boolean {
  return (CORE_PLATINUM_CATEGORY_IDS as readonly string[]).includes(categoryId);
}

/**
 * Get the renomination threshold for a category
 */
export function getRenominationThreshold(categoryId: string): number {
  if (isCorePlatinumCategory(categoryId)) {
    return PLATINUM_THRESHOLDS.CORE;
  }
  return PLATINUM_THRESHOLDS.STANDARD;
}
