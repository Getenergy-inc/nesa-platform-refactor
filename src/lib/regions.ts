// NESA Africa Regions Configuration
// Regional-based award structure: 5 African regions + Diaspora + Friends of Africa

export type AfricanRegion = 
  | "North Africa"
  | "West Africa"
  | "Central Africa"
  | "East Africa"
  | "Southern Africa"
  | "Sahel Region"
  | "Horn of Africa"
  | "Indian Ocean Islands"
  | "Diaspora / Global Africa"
  | "Friends of Africa";

export const AFRICAN_REGIONS: AfricanRegion[] = [
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
  "Sahel Region",
  "Horn of Africa",
  "Indian Ocean Islands",
  "Diaspora / Global Africa",
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

// Complete list of all 54 African countries mapped to regions
const COUNTRY_TO_REGION: Record<string, AfricanRegion> = {
  // ============ NORTH AFRICA (7 countries) ============
  "Algeria": "North Africa",
  "People's Democratic Republic of Algeria": "North Africa",
  "Egypt": "North Africa",
  "Arab Republic of Egypt": "North Africa",
  "Libya": "North Africa",
  "State of Libya": "North Africa",
  "Morocco": "North Africa",
  "Kingdom of Morocco": "North Africa",
  "Tunisia": "North Africa",
  "Republic of Tunisia": "North Africa",
  "Sudan": "North Africa",
  "Republic of the Sudan": "North Africa",
  "Western Sahara": "North Africa",
  "Sahrawi Arab Democratic Republic": "North Africa",
  
  // ============ WEST AFRICA (16 countries) ============
  "Benin": "West Africa",
  "Republic of Benin": "West Africa",
  "Burkina Faso": "West Africa",
  "Burkina": "West Africa",
  "Cape Verde": "West Africa",
  "Cabo Verde": "West Africa",
  "Republic of Cabo Verde": "West Africa",
  "Côte d'Ivoire": "West Africa",
  "Cote d'Ivoire": "West Africa",
  "Ivory Coast": "West Africa",
  "Republic of Côte d'Ivoire": "West Africa",
  "Gambia": "West Africa",
  "The Gambia": "West Africa",
  "Republic of The Gambia": "West Africa",
  "Ghana": "West Africa",
  "Republic of Ghana": "West Africa",
  "Guinea": "West Africa",
  "Republic of Guinea": "West Africa",
  "Guinea-Bissau": "West Africa",
  "Republic of Guinea-Bissau": "West Africa",
  "Liberia": "West Africa",
  "Republic of Liberia": "West Africa",
  "Mali": "West Africa",
  "Republic of Mali": "West Africa",
  "Mauritania": "West Africa",
  "Islamic Republic of Mauritania": "West Africa",
  "Niger": "West Africa",
  "Republic of Niger": "West Africa",
  "Nigeria": "West Africa",
  "Federal Republic of Nigeria": "West Africa",
  "Senegal": "West Africa",
  "Republic of Senegal": "West Africa",
  "Sierra Leone": "West Africa",
  "Republic of Sierra Leone": "West Africa",
  "Togo": "West Africa",
  "Togolese Republic": "West Africa",
  
  // ============ CENTRAL AFRICA (9 countries) ============
  "Cameroon": "Central Africa",
  "Republic of Cameroon": "Central Africa",
  "Central African Republic": "Central Africa",
  "CAR": "Central Africa",
  "Chad": "Central Africa",
  "Republic of Chad": "Central Africa",
  "Congo": "Central Africa",
  "Republic of the Congo": "Central Africa",
  "Congo-Brazzaville": "Central Africa",
  "Democratic Republic of Congo": "Central Africa",
  "Democratic Republic of the Congo": "Central Africa",
  "DRC": "Central Africa",
  "DR Congo": "Central Africa",
  "Congo-Kinshasa": "Central Africa",
  "Equatorial Guinea": "Central Africa",
  "Republic of Equatorial Guinea": "Central Africa",
  "Gabon": "Central Africa",
  "Gabonese Republic": "Central Africa",
  "São Tomé and Príncipe": "Central Africa",
  "Sao Tome and Principe": "Central Africa",
  "Democratic Republic of São Tomé and Príncipe": "Central Africa",
  
  // ============ EAST AFRICA (18 countries) ============
  "Burundi": "East Africa",
  "Republic of Burundi": "East Africa",
  "Comoros": "East Africa",
  "Union of the Comoros": "East Africa",
  "Djibouti": "East Africa",
  "Republic of Djibouti": "East Africa",
  "Eritrea": "East Africa",
  "State of Eritrea": "East Africa",
  "Ethiopia": "East Africa",
  "Federal Democratic Republic of Ethiopia": "East Africa",
  "Kenya": "East Africa",
  "Republic of Kenya": "East Africa",
  "Madagascar": "East Africa",
  "Republic of Madagascar": "East Africa",
  "Malawi": "East Africa",
  "Republic of Malawi": "East Africa",
  "Mauritius": "East Africa",
  "Republic of Mauritius": "East Africa",
  "Mozambique": "East Africa",
  "Republic of Mozambique": "East Africa",
  "Rwanda": "East Africa",
  "Republic of Rwanda": "East Africa",
  "Seychelles": "East Africa",
  "Republic of Seychelles": "East Africa",
  "Somalia": "East Africa",
  "Federal Republic of Somalia": "East Africa",
  "South Sudan": "East Africa",
  "Republic of South Sudan": "East Africa",
  "Tanzania": "East Africa",
  "United Republic of Tanzania": "East Africa",
  "Uganda": "East Africa",
  "Republic of Uganda": "East Africa",
  "Zambia": "East Africa",
  "Republic of Zambia": "East Africa",
  "Zimbabwe": "East Africa",
  "Republic of Zimbabwe": "East Africa",
  
  // ============ SOUTHERN AFRICA (6 countries) ============
  "Angola": "Southern Africa",
  "Republic of Angola": "Southern Africa",
  "Botswana": "Southern Africa",
  "Republic of Botswana": "Southern Africa",
  "Eswatini": "Southern Africa",
  "Kingdom of Eswatini": "Southern Africa",
  "Swaziland": "Southern Africa", // Former name
  "Lesotho": "Southern Africa",
  "Kingdom of Lesotho": "Southern Africa",
  "Namibia": "Southern Africa",
  "Republic of Namibia": "Southern Africa",
  "South Africa": "Southern Africa",
  "Republic of South Africa": "Southern Africa",
  "RSA": "Southern Africa",
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
  if (!country) return "Diaspora / Global Africa";
  
  const normalizedCountry = country.trim();
  
  // Check if it's an African country
  const region = COUNTRY_TO_REGION[normalizedCountry];
  if (region) return region;
  
  // Check if it's a Friends of Africa country
  if (FRIENDS_OF_AFRICA_COUNTRIES.has(normalizedCountry)) {
    return "Friends of Africa";
  }
  
  // Default to Diaspora for non-African, non-Friends countries
  return "Diaspora / Global Africa";
}

/**
 * Normalizes a region name to the standard 7-group format.
 */
export function normalizeRegion(regionName: string | undefined | null): AfricanRegion {
  if (!regionName) return "Diaspora / Global Africa";
  
  const normalized = regionName.trim().toLowerCase();
  
  // Direct matches
  if (normalized.includes("north")) return "North Africa";
  if (normalized.includes("west")) return "West Africa";
  if (normalized.includes("central")) return "Central Africa";
  if (normalized.includes("east")) return "East Africa";
  if (normalized.includes("southern") || normalized.includes("south africa")) return "Southern Africa";
  if (normalized.includes("sahel")) return "Sahel Region";
  if (normalized.includes("horn")) return "Horn of Africa";
  if (normalized.includes("indian") || normalized.includes("island")) return "Indian Ocean Islands";
  if (normalized.includes("diaspora")) return "Diaspora / Global Africa";
  if (normalized.includes("friend")) return "Friends of Africa";
  
  // Check if it's a country name
  for (const [country, region] of Object.entries(COUNTRY_TO_REGION)) {
    if (normalized === country.toLowerCase()) {
      return region;
    }
  }
  
  return "Diaspora / Global Africa";
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
  tagline: "A regional-based award across Africa's 10 regions, the African Diaspora, and Friends of Africa",
  shortTagline: "10 Regions + Diaspora + Friends of Africa",
  reachStatement: "Across 10 African regions, the African Diaspora, and Friends of Africa",
  statsLabel: "10 Regional Groups",
};

// Governance stats
export const GOVERNANCE_STATS = {
  judges: 27,
  nrcVolunteers: 30,
  categories: 17,
  subcategories: 141,
  regions: 10,
  continentalRegions: 8,
};

export const NRC_DESCRIPTION = {
  name: "Nominee Research Corps (NRC)",
  model: "Hybrid NRC",
  volunteers: 30,
  shortDescription: "30 Hybrid NRC Volunteers verifying nominations across all regions",
  fullDescription: "The Hybrid NRC is a blended verification model combining core NRC members with volunteer NRC support. Operating both remotely and in-person where applicable, the 30-member Hybrid NRC ensures thorough, region-aware verification of all nominations before they advance to voting or jury evaluation.",
};
