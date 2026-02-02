// NESA Africa Regions Configuration
// Regional-based award structure: 5 African regions + Diaspora + Friends of Africa

export type AfricanRegion = 
  | "North Africa"
  | "West Africa"
  | "Central Africa"
  | "East Africa"
  | "Southern Africa"
  | "Diaspora"
  | "Friends of Africa";

export const AFRICAN_REGIONS: AfricanRegion[] = [
  "North Africa",
  "West Africa",
  "Central Africa",
  "East Africa",
  "Southern Africa",
  "Diaspora",
  "Friends of Africa",
];

export const REGION_DEFINITIONS = {
  "North Africa": "Algeria, Egypt, Libya, Morocco, Tunisia, Sudan, Western Sahara",
  "West Africa": "Benin, Burkina Faso, Cape Verde, Côte d'Ivoire, Gambia, Ghana, Guinea, Guinea-Bissau, Liberia, Mali, Mauritania, Niger, Nigeria, Senegal, Sierra Leone, Togo",
  "Central Africa": "Cameroon, Central African Republic, Chad, Congo, Democratic Republic of Congo, Equatorial Guinea, Gabon, São Tomé and Príncipe",
  "East Africa": "Burundi, Comoros, Djibouti, Eritrea, Ethiopia, Kenya, Madagascar, Malawi, Mauritius, Mozambique, Rwanda, Seychelles, Somalia, South Sudan, Tanzania, Uganda, Zambia, Zimbabwe",
  "Southern Africa": "Angola, Botswana, Eswatini, Lesotho, Namibia, South Africa",
  "Diaspora": "Africans and people of African descent living outside Africa — carrying forward Africa's educational legacy globally",
  "Friends of Africa": "Non-African allies, organizations, and institutions supporting Africa's growth, development, and educational transformation",
};

export const REGION_SHORT_DESCRIPTIONS = {
  "North Africa": "Algeria, Egypt, Libya, Morocco, Tunisia & more",
  "West Africa": "Nigeria, Ghana, Senegal, Côte d'Ivoire & more",
  "Central Africa": "Cameroon, DRC, Congo, Gabon & more",
  "East Africa": "Kenya, Ethiopia, Tanzania, Uganda & more",
  "Southern Africa": "South Africa, Botswana, Namibia & more",
  "Diaspora": "Africans living outside Africa",
  "Friends of Africa": "Global allies supporting Africa",
};

// Country to Region mapping
const COUNTRY_TO_REGION: Record<string, AfricanRegion> = {
  // North Africa
  "Algeria": "North Africa",
  "Egypt": "North Africa",
  "Libya": "North Africa",
  "Morocco": "North Africa",
  "Tunisia": "North Africa",
  "Sudan": "North Africa",
  "Western Sahara": "North Africa",
  
  // West Africa
  "Benin": "West Africa",
  "Burkina Faso": "West Africa",
  "Cape Verde": "West Africa",
  "Cabo Verde": "West Africa",
  "Côte d'Ivoire": "West Africa",
  "Ivory Coast": "West Africa",
  "Gambia": "West Africa",
  "The Gambia": "West Africa",
  "Ghana": "West Africa",
  "Guinea": "West Africa",
  "Guinea-Bissau": "West Africa",
  "Liberia": "West Africa",
  "Mali": "West Africa",
  "Mauritania": "West Africa",
  "Niger": "West Africa",
  "Nigeria": "West Africa",
  "Senegal": "West Africa",
  "Sierra Leone": "West Africa",
  "Togo": "West Africa",
  
  // Central Africa
  "Cameroon": "Central Africa",
  "Central African Republic": "Central Africa",
  "Chad": "Central Africa",
  "Congo": "Central Africa",
  "Republic of the Congo": "Central Africa",
  "Democratic Republic of Congo": "Central Africa",
  "DRC": "Central Africa",
  "Equatorial Guinea": "Central Africa",
  "Gabon": "Central Africa",
  "São Tomé and Príncipe": "Central Africa",
  
  // East Africa
  "Burundi": "East Africa",
  "Comoros": "East Africa",
  "Djibouti": "East Africa",
  "Eritrea": "East Africa",
  "Ethiopia": "East Africa",
  "Kenya": "East Africa",
  "Madagascar": "East Africa",
  "Malawi": "East Africa",
  "Mauritius": "East Africa",
  "Mozambique": "East Africa",
  "Rwanda": "East Africa",
  "Seychelles": "East Africa",
  "Somalia": "East Africa",
  "South Sudan": "East Africa",
  "Tanzania": "East Africa",
  "Uganda": "East Africa",
  "Zambia": "East Africa",
  "Zimbabwe": "East Africa",
  
  // Southern Africa
  "Angola": "Southern Africa",
  "Botswana": "Southern Africa",
  "Eswatini": "Southern Africa",
  "Swaziland": "Southern Africa",
  "Lesotho": "Southern Africa",
  "Namibia": "Southern Africa",
  "South Africa": "Southern Africa",
};

// Friends of Africa override list (non-African countries that are explicitly marked)
const FRIENDS_OF_AFRICA_COUNTRIES = new Set([
  "United States",
  "USA",
  "United Kingdom",
  "UK",
  "Canada",
  "Germany",
  "France",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "China",
  "India",
  "Japan",
  "Australia",
  "United Arab Emirates",
  "UAE",
  "Qatar",
  "Saudi Arabia",
  "Brazil",
  "Sweden",
  "Norway",
  "Denmark",
]);

/**
 * Maps a country name to its African region.
 * - African countries → respective region
 * - Non-African countries in Friends list → "Friends of Africa"
 * - Other non-African countries → "Diaspora" (default for Africans abroad)
 */
export function getRegionFromCountry(country: string | undefined | null): AfricanRegion {
  if (!country) return "Diaspora";
  
  const normalizedCountry = country.trim();
  
  // Check if it's an African country
  const region = COUNTRY_TO_REGION[normalizedCountry];
  if (region) return region;
  
  // Check if it's a Friends of Africa country
  if (FRIENDS_OF_AFRICA_COUNTRIES.has(normalizedCountry)) {
    return "Friends of Africa";
  }
  
  // Default to Diaspora for non-African, non-Friends countries
  return "Diaspora";
}

/**
 * Normalizes a region name to the standard 7-group format.
 */
export function normalizeRegion(regionName: string | undefined | null): AfricanRegion {
  if (!regionName) return "Diaspora";
  
  const normalized = regionName.trim().toLowerCase();
  
  // Direct matches
  if (normalized.includes("north")) return "North Africa";
  if (normalized.includes("west")) return "West Africa";
  if (normalized.includes("central")) return "Central Africa";
  if (normalized.includes("east")) return "East Africa";
  if (normalized.includes("southern") || normalized.includes("south africa")) return "Southern Africa";
  if (normalized.includes("diaspora")) return "Diaspora";
  if (normalized.includes("friend")) return "Friends of Africa";
  
  // Check if it's a country name
  for (const [country, region] of Object.entries(COUNTRY_TO_REGION)) {
    if (normalized === country.toLowerCase()) {
      return region;
    }
  }
  
  return "Diaspora";
}

/**
 * Gets all African regions (excluding Diaspora and Friends)
 */
export function getContinentalRegions(): AfricanRegion[] {
  return ["North Africa", "West Africa", "Central Africa", "East Africa", "Southern Africa"];
}

/**
 * Checks if a region is a continental African region
 */
export function isContinentalRegion(region: AfricanRegion): boolean {
  return getContinentalRegions().includes(region);
}

// Brand messaging constants
export const REGIONAL_BRAND_MESSAGING = {
  tagline: "A regional-based award across Africa's 5 regions, the African Diaspora, and Friends of Africa",
  shortTagline: "5 African Regions + Diaspora + Friends of Africa",
  reachStatement: "Across 5 African regions, the African Diaspora, and Friends of Africa",
  statsLabel: "7 Regional Groups",
};

// Governance stats
export const GOVERNANCE_STATS = {
  judges: 27,
  nrcVolunteers: 30,
  categories: 17,
  subcategories: 141,
  regions: 7,
  continentalRegions: 5,
};

export const NRC_DESCRIPTION = {
  name: "Nominee Research Corps (NRC)",
  model: "Hybrid NRC",
  volunteers: 30,
  shortDescription: "30 Hybrid NRC Volunteers verifying nominations across all regions",
  fullDescription: "The Hybrid NRC is a blended verification model combining core NRC members with volunteer NRC support. Operating both remotely and in-person where applicable, the 30-member Hybrid NRC ensures thorough, region-aware verification of all nominations before they advance to voting or jury evaluation.",
};
