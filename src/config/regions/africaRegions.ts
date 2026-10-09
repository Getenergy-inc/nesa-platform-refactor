// ============================================================
// NESA-Africa canonical region source of truth
// One Continent. Eight Africa Regions. One African Diaspora Community.
// ============================================================
// This file is the ONLY place where the Africa region taxonomy,
// slugs, order and country-to-region mapping should live.
// All other modules (lib/regions, lib/regionClassifier, forms,
// directory filters, dashboards) must re-export from here.
// ------------------------------------------------------------

export type AfricaRegionCode =
  | "NORTH_AFRICA"
  | "WEST_AFRICA"
  | "CENTRAL_AFRICA"
  | "EAST_AFRICA"
  | "HORN_OF_AFRICA"
  | "SOUTHERN_AFRICA"
  | "SAHEL_REGION"
  | "INDIAN_OCEAN_ISLANDS";

export type DiasporaContinentCode =
  | "NORTH_AMERICA"
  | "SOUTH_AMERICA"
  | "EUROPE"
  | "CARIBBEAN"
  | "MIDDLE_EAST"
  | "ASIA"
  | "OCEANIA";

export type RegionType = "africa_region" | "global_community";

export interface AfricaRegionDefinition {
  code: AfricaRegionCode;
  slug: string;
  name: string;
  shortName: string;
  order: number;
  description: string;
  countries: string[]; // canonical English country names
  regionType: "africa_region";
}

export interface DiasporaRegionDefinition {
  code: DiasporaContinentCode;
  slug: string;
  name: string;
  order: number;
  regionType: "global_community";
}

// ------------------------------------------------------------
// The approved 8 Africa regions (canonical display order)
// ------------------------------------------------------------
export const AFRICA_REGIONS: AfricaRegionDefinition[] = [
  {
    code: "NORTH_AFRICA",
    slug: "north-africa",
    name: "North Africa",
    shortName: "North",
    order: 1,
    regionType: "africa_region",
    description:
      "Mediterranean-facing nations advancing literacy, university excellence, and cross-border education partnerships.",
    countries: ["Algeria", "Egypt", "Libya", "Morocco", "Tunisia"],
  },
  {
    code: "WEST_AFRICA",
    slug: "west-africa",
    name: "West Africa",
    shortName: "West",
    order: 2,
    regionType: "africa_region",
    description:
      "The most populous African region, home to large education systems, EdTech innovation hubs and youth movements.",
    countries: [
      "Benin",
      "Cabo Verde",
      "Côte d'Ivoire",
      "The Gambia",
      "Ghana",
      "Guinea",
      "Guinea-Bissau",
      "Liberia",
      "Nigeria",
      "Senegal",
      "Sierra Leone",
      "Togo",
    ],
  },
  {
    code: "CENTRAL_AFRICA",
    slug: "central-africa",
    name: "Central Africa",
    shortName: "Central",
    order: 3,
    regionType: "africa_region",
    description:
      "Equatorial nations expanding access to schooling, teacher training and francophone learning networks.",
    countries: [
      "Angola",
      "Cameroon",
      "Central African Republic",
      "Chad",
      "Democratic Republic of the Congo",
      "Republic of the Congo",
      "Equatorial Guinea",
      "Gabon",
      "São Tomé and Príncipe",
    ],
  },
  {
    code: "EAST_AFRICA",
    slug: "east-africa",
    name: "East Africa",
    shortName: "East",
    order: 4,
    regionType: "africa_region",
    description:
      "The East African Community and neighbours advancing STEM, digital learning and community-based schooling.",
    countries: [
      "Burundi",
      "Kenya",
      "Rwanda",
      "South Sudan",
      "Tanzania",
      "Uganda",
    ],
  },
  {
    code: "HORN_OF_AFRICA",
    slug: "horn-of-africa",
    name: "Horn of Africa",
    shortName: "Horn",
    order: 5,
    regionType: "africa_region",
    description:
      "Resilient education systems in the Horn advancing access in crisis, refugee education and higher-learning renewal.",
    countries: ["Djibouti", "Eritrea", "Ethiopia", "Somalia"],
  },
  {
    code: "SOUTHERN_AFRICA",
    slug: "southern-africa",
    name: "Southern Africa",
    shortName: "Southern",
    order: 6,
    regionType: "africa_region",
    description:
      "SADC nations leading on inclusive schooling, TVET reform, higher-education research and public-private partnerships.",
    countries: [
      "Botswana",
      "Eswatini",
      "Lesotho",
      "Malawi",
      "Mozambique",
      "Namibia",
      "South Africa",
      "Zambia",
      "Zimbabwe",
    ],
  },
  {
    code: "SAHEL_REGION",
    slug: "sahel-region",
    name: "Sahel Region",
    shortName: "Sahel",
    order: 7,
    regionType: "africa_region",
    description:
      "Sahelian countries expanding access, girls' education and community learning amid climate and security challenges.",
    countries: ["Burkina Faso", "Mali", "Mauritania", "Niger", "Sudan"],
  },
  {
    code: "INDIAN_OCEAN_ISLANDS",
    slug: "indian-ocean-islands",
    name: "Indian Ocean Islands",
    shortName: "Indian Ocean",
    order: 8,
    regionType: "africa_region",
    description:
      "Island nations of the Indian Ocean advancing multilingual education, marine science and inclusive schooling.",
    countries: ["Comoros", "Madagascar", "Mauritius", "Seychelles"],
  },
];

// ------------------------------------------------------------
// African Diaspora (Global Community — NOT counted as an Africa region)
// ------------------------------------------------------------
export const AFRICAN_DIASPORA_SLUG = "african-diaspora";

export const DIASPORA_REGIONS: DiasporaRegionDefinition[] = [
  { code: "NORTH_AMERICA", slug: "north-america", name: "North America", order: 1, regionType: "global_community" },
  { code: "SOUTH_AMERICA", slug: "south-america", name: "South America", order: 2, regionType: "global_community" },
  { code: "EUROPE", slug: "europe", name: "Europe", order: 3, regionType: "global_community" },
  { code: "CARIBBEAN", slug: "caribbean", name: "Caribbean", order: 4, regionType: "global_community" },
  { code: "MIDDLE_EAST", slug: "middle-east", name: "Middle East", order: 5, regionType: "global_community" },
  { code: "ASIA", slug: "asia", name: "Asia", order: 6, regionType: "global_community" },
  { code: "OCEANIA", slug: "oceania", name: "Oceania", order: 7, regionType: "global_community" },
];

// ------------------------------------------------------------
// Country → Region map (canonical + common aliases)
// Built from AFRICA_REGIONS with additional accepted variants.
// ------------------------------------------------------------
const ALIAS_TO_CANONICAL: Record<string, string> = {
  // West Africa
  "cape verde": "Cabo Verde",
  "cote d'ivoire": "Côte d'Ivoire",
  "ivory coast": "Côte d'Ivoire",
  "gambia": "The Gambia",
  // Central Africa
  "car": "Central African Republic",
  "drc": "Democratic Republic of the Congo",
  "dr congo": "Democratic Republic of the Congo",
  "democratic republic of congo": "Democratic Republic of the Congo",
  "congo-kinshasa": "Democratic Republic of the Congo",
  "congo": "Republic of the Congo",
  "congo-brazzaville": "Republic of the Congo",
  "sao tome and principe": "São Tomé and Príncipe",
  // Southern Africa
  "swaziland": "Eswatini",
  "rsa": "South Africa",
};

export const COUNTRY_TO_REGION_CODE: Record<string, AfricaRegionCode> = (() => {
  const map: Record<string, AfricaRegionCode> = {};
  for (const region of AFRICA_REGIONS) {
    for (const country of region.countries) {
      map[country] = region.code;
    }
  }
  return map;
})();

// ------------------------------------------------------------
// Legacy 5-region → new 8-region migration hints.
// Used ONLY to prompt manual review when we cannot infer a region
// from country data. Never silently reassign.
// ------------------------------------------------------------
export const LEGACY_REGION_MIGRATION_HINTS: Record<string, AfricaRegionCode[]> = {
  "East Africa": ["EAST_AFRICA", "HORN_OF_AFRICA", "INDIAN_OCEAN_ISLANDS"],
  "West Africa": ["WEST_AFRICA", "SAHEL_REGION"],
  "North Africa": ["NORTH_AFRICA", "SAHEL_REGION"],
  "Central Africa": ["CENTRAL_AFRICA"],
  "Southern Africa": ["SOUTHERN_AFRICA", "INDIAN_OCEAN_ISLANDS"],
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Resolve any country string (canonical or alias) to its canonical name, if known. */
export function resolveCanonicalCountry(country: string | null | undefined): string | null {
  if (!country) return null;
  const raw = country.trim();
  if (COUNTRY_TO_REGION_CODE[raw]) return raw;
  const aliased = ALIAS_TO_CANONICAL[normalize(raw)];
  if (aliased) return aliased;
  // Try case-insensitive canonical match
  const lower = normalize(raw);
  for (const canonical of Object.keys(COUNTRY_TO_REGION_CODE)) {
    if (normalize(canonical) === lower) return canonical;
  }
  return null;
}

/** Get the Africa region for a country. Returns null for non-African / unknown. */
export function getRegionByCountry(country: string | null | undefined): AfricaRegionDefinition | null {
  const canonical = resolveCanonicalCountry(country);
  if (!canonical) return null;
  const code = COUNTRY_TO_REGION_CODE[canonical];
  return AFRICA_REGIONS.find((r) => r.code === code) ?? null;
}

export function getRegionBySlug(slug: string): AfricaRegionDefinition | null {
  return AFRICA_REGIONS.find((r) => r.slug === slug) ?? null;
}

export function getRegionByCode(code: AfricaRegionCode): AfricaRegionDefinition | null {
  return AFRICA_REGIONS.find((r) => r.code === code) ?? null;
}

export function listAfricaRegions(): AfricaRegionDefinition[] {
  return [...AFRICA_REGIONS].sort((a, b) => a.order - b.order);
}

export function listDiasporaContinents(): DiasporaRegionDefinition[] {
  return [...DIASPORA_REGIONS].sort((a, b) => a.order - b.order);
}

export function isAfricanCountry(country: string | null | undefined): boolean {
  return resolveCanonicalCountry(country) !== null;
}

// ------------------------------------------------------------
// Canonical brand copy
// ------------------------------------------------------------
export const REGIONAL_TAGLINE =
  "One Continent. Eight Africa Regions. One African Diaspora Community. One Mission.";

export const REGIONAL_SUBLINE =
  "NESA-Africa recognises the Education Enablers advancing Education for All across North, West, Central, East, Horn, Southern, Sahel, and Indian Ocean Islands Africa — alongside Africans in the Diaspora.";

export const REGION_STATS = {
  africaRegions: AFRICA_REGIONS.length, // 8
  diasporaContinents: DIASPORA_REGIONS.length,
  totalCountries: AFRICA_REGIONS.reduce((n, r) => n + r.countries.length, 0),
};
