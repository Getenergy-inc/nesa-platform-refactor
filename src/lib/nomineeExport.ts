/**
 * CSV to Database Nominee Export Utility
 * Extracts nominees from nesaData and formats for database import
 */

import { getAllNominees, type EnrichedNominee } from "@/lib/nesaData";

// Map CSV subcategory slugs to database subcategory slugs
const SUBCATEGORY_MAPPING: Record<string, string> = {
  // Banking & Finance mappings
  "banking--finance": "csr-ng-banking",
  "banking-and-finance": "csr-ng-banking",
  "banking": "csr-ng-banking",
  
  // Technology mappings
  "technology": "csr-ng-tech-it",
  "technology--software": "csr-ng-software",
  "technology-and-it": "csr-ng-tech-it",
  
  // Telecommunications
  "telecommunications": "csr-ng-telecom",
  "telecom": "csr-ng-telecom",
  
  // Oil & Gas
  "oil--gas": "csr-ng-oil",
  "oil-and-gas": "csr-ng-oil",
  
  // Food & Beverages
  "food--beverages": "csr-ng-food",
  "food-and-beverages": "csr-ng-food",
  
  // Aviation
  "aviation": "csr-ng-aviation",
  
  // Manufacturing
  "manufacturing": "csr-ng-manufacturing",
  
  // Healthcare
  "health-care--hospitals": "csr-ng-health",
  "healthcare": "csr-ng-health",
  
  // Insurance
  "insurance": "csr-ng-insurance",
  
  // Conglomerates
  "conglomerates": "csr-ng-conglomerates",
  
  // Media
  "media--entertainment": "csr-ng-media",
  
  // Real Estate
  "real-estate--construction": "csr-ng-realestate",
  
  // Professional Services
  "professional-services": "csr-ng-professional",
  
  // Agriculture
  "agriculture--agribusiness": "csr-ng-agric",
  
  // FinTech
  "fintech": "csr-ng-fintech",
  
  // Hospitality
  "hotels--hospitality": "csr-ng-hospitality",
  
  // Retail
  "retail--e-commerce": "csr-ng-retail",
  
  // Microfinance
  "microfinance-banks": "csr-ng-microfinance",
  
  // Pharma
  "pharmaceuticals": "csr-ng-pharma",
  
  // Education
  "education-aid--scholarship-support": "ngo-ng-scholarship",
  "scholarship-support": "ngo-ng-scholarship",
  "teacher-training--capacity-building": "ngo-ng-training",
  "girl-child-education": "ngo-ng-girlchild",
  "special-needs-education": "ngo-ng-special-needs",
  "community-development": "ngo-ng-community",
  
  // Media categories
  "print-media-educational-advocacy": "media-ng-print",
  "broadcast-media-educational-advocacy": "media-ng-broadcast",
  "digital-media-educational-advocacy": "media-ng-digital",
  
  // Creative Arts
  "music-industry-contribution": "arts-ng-music",
  "nollywood-educational-content": "arts-ng-nollywood",
  "literature--artistic-works": "arts-ng-literature",
  "creative-advocacy-campaigns": "arts-ng-campaigns",
  "film--media-for-education": "arts-ng-film",
  "performing-arts--education": "arts-ng-performing",
  "visual-arts-educational-impact": "arts-ng-visual",
  
  // Library categories
  "federal-universities": "library-ng-federal",
  "state-universities": "library-ng-state",
  "private-universities": "library-ng-private",
  "polytechnics--monotechnics": "library-ng-poly",
  "colleges-of-education": "library-ng-coe",
  
  // R&D
  "medical--health-research": "rd-ng-medical",
  "engineering--technology": "rd-ng-engineering",
  "environmental--sustainability": "rd-ng-environmental",
  "social-sciences--humanities": "rd-ng-social",
  "agricultural--food-research": "rd-ng-agric",
  
  // Political Leaders
  "governors": "political-ng-governors",
  "senators": "political-ng-senators",
  "house-of-representatives": "political-ng-reps",
  "state-legislators": "political-ng-state-leg",
  "local-government-chairmen": "political-ng-lga",
  
  // State categories
  "north-central": "state-ng-north-central",
  "north-east": "state-ng-north-east",
  "north-west": "state-ng-north-west",
  "south-east": "state-ng-south-east",
  "south-south": "state-ng-south-south",
  "south-west": "state-ng-south-west",
  
  // Christian Education
  "faith-based-schools--institutions": "christian-schools",
  "christian-education-ngos": "christian-ngos",
  "christian-foundations--philanthropy": "christian-foundations",
  
  // Islamic Education
  "islamic-foundations--waqf": "islamic-foundations",
  "madrasah--islamic-schools": "islamic-schools",
  "islamic-education-ngos": "islamic-ngos",
  
  // Diaspora
  "americas-based-associations": "diaspora-americas",
  "europe-based-associations": "diaspora-europe",
  "middle-east--asia-pacific-associations": "diaspora-asia-me",
  
  // International
  "bilateral-aid-agencies": "intl-bilateral",
  "multinational-corporations": "intl-mnc",
  "un-agencies": "intl-un",
  "international-ngos": "intl-ngo",
  
  // Icon awards
  "africa-education-pioneer-icon-of-the-decade": "icon-pioneer",
  "africa-education-philanthropy-icon-of-the-decade": "icon-philanthropy",
  "africa-technical-educator-icon-of-the-decade": "icon-technical",
  "africa-stem-innovator-icon-of-the-decade": "icon-stem",
  "africa-education-policy-champion-of-the-decade": "icon-policy",
};

// Region mapping for generating proper subcategory slugs
const REGION_SLUG_MAP: Record<string, string> = {
  "north-africa": "north-africa",
  "east-africa": "east-africa",
  "west-africa": "west-africa",
  "south-africa": "southern-africa",
  "southern-africa": "southern-africa",
  "central-africa": "central-africa",
};

interface DatabaseNomineeInput {
  name: string;
  slug: string;
  bio?: string;
  title?: string;
  organization?: string;
  country?: string;
  region?: string;
  photo_url?: string;
  logo_url?: string;
  subcategory_slug: string;
}

/**
 * Get region-specific subcategory slug
 */
function getRegionalSubcategorySlug(baseSlug: string, regionSlug: string): string {
  // Try to map to regional version
  const regionName = REGION_SLUG_MAP[regionSlug] || regionSlug;
  
  // Check for CSR Africa pattern
  if (baseSlug.includes("banking")) {
    return `csr-africa-banking-${regionName}`;
  }
  if (baseSlug.includes("telecom")) {
    return `csr-africa-telecom-${regionName}`;
  }
  if (baseSlug.includes("tech") || baseSlug.includes("technology")) {
    return `csr-africa-tech-${regionName}`;
  }
  if (baseSlug.includes("oil") || baseSlug.includes("gas")) {
    return `csr-africa-oil-${regionName}`;
  }
  if (baseSlug.includes("food") || baseSlug.includes("beverage")) {
    return `csr-africa-food-${regionName}`;
  }
  if (baseSlug.includes("aviation")) {
    return `csr-africa-aviation-${regionName}`;
  }
  
  // Check for EduTech pattern
  if (baseSlug.includes("edutech") && baseSlug.includes("established")) {
    return `edutech-established-${regionName}`;
  }
  if (baseSlug.includes("edutech") && baseSlug.includes("startup")) {
    return `edutech-startup-${regionName}`;
  }
  if (baseSlug.includes("edutech") && baseSlug.includes("impact")) {
    return `edutech-impact-${regionName}`;
  }
  
  // Check for STEM pattern
  if (baseSlug.includes("stem") && baseSlug.includes("digital")) {
    return `stem-digital-${regionName}`;
  }
  if (baseSlug.includes("stem") && baseSlug.includes("community")) {
    return `stem-community-${regionName}`;
  }
  if (baseSlug.includes("stem") && baseSlug.includes("women")) {
    return `stem-women-${regionName}`;
  }
  if (baseSlug.includes("stem") && baseSlug.includes("youth")) {
    return `stem-youth-${regionName}`;
  }
  if (baseSlug.includes("stem") && baseSlug.includes("institutional")) {
    return `stem-institutional-${regionName}`;
  }
  
  // Check for NGO pattern
  if (baseSlug.includes("scholarship") || baseSlug.includes("aid")) {
    return `ngo-africa-scholarship-${regionName}`;
  }
  if (baseSlug.includes("teacher") || baseSlug.includes("training")) {
    return `ngo-africa-training-${regionName}`;
  }
  if (baseSlug.includes("girl") || baseSlug.includes("child")) {
    return `ngo-africa-girlchild-${regionName}`;
  }
  if (baseSlug.includes("special") || baseSlug.includes("needs")) {
    return `ngo-africa-special-needs-${regionName}`;
  }
  if (baseSlug.includes("community")) {
    return `ngo-africa-community-${regionName}`;
  }
  
  // Return as-is with region appended
  return `${baseSlug}-${regionName}`;
}

/**
 * Export all nominees from CSV in database-ready format
 */
export function exportNomineesForDatabase(): {
  nominees: DatabaseNomineeInput[];
  unmapped: Array<{ name: string; subcategorySlug: string }>;
} {
  const csvNominees = getAllNominees();
  const nominees: DatabaseNomineeInput[] = [];
  const unmapped: Array<{ name: string; subcategorySlug: string }> = [];
  const seen = new Set<string>();

  for (const nominee of csvNominees) {
    // Skip duplicates
    if (seen.has(nominee.slug)) continue;
    seen.add(nominee.slug);

    // Try to map subcategory
    let dbSubcategorySlug = SUBCATEGORY_MAPPING[nominee.subcategorySlug];
    
    // If not found and has region, try regional mapping
    if (!dbSubcategorySlug && nominee.regionSlug) {
      dbSubcategorySlug = getRegionalSubcategorySlug(nominee.subcategorySlug, nominee.regionSlug);
    }
    
    // If still not found, use the original slug and track it
    if (!dbSubcategorySlug) {
      dbSubcategorySlug = nominee.subcategorySlug;
      unmapped.push({ name: nominee.name, subcategorySlug: nominee.subcategorySlug });
    }

    nominees.push({
      name: nominee.name,
      slug: nominee.slug,
      bio: nominee.achievement || undefined,
      country: nominee.country || undefined,
      region: nominee.regionName || undefined,
      photo_url: nominee.imageUrl || undefined,
      subcategory_slug: dbSubcategorySlug,
    });
  }

  return { nominees, unmapped };
}

/**
 * Get count of nominees to import
 */
export function getNomineeExportStats() {
  const { nominees, unmapped } = exportNomineesForDatabase();
  return {
    total: nominees.length,
    mapped: nominees.length - unmapped.length,
    unmapped: unmapped.length,
    unmappedSlugs: [...new Set(unmapped.map(u => u.subcategorySlug))],
  };
}
