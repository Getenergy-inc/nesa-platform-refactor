// ============================================================
// LEGACY WRAPPER — retained for backward compatibility only.
// The canonical Africa region taxonomy now lives in:
//   src/config/regions/africaRegions.ts
// Prefer importing from that module in NEW code.
// ============================================================

import {
  AFRICA_REGIONS as CANONICAL_AFRICA_REGIONS,
  DIASPORA_REGIONS,
  getRegionByCountry,
  resolveCanonicalCountry,
  isAfricanCountry,
  REGIONAL_TAGLINE,
  REGION_STATS,
  type AfricaRegionDefinition,
} from "@/config/regions/africaRegions";

export type AfricanRegion =
  | "North Africa"
  | "West Africa"
  | "Central Africa"
  | "East Africa"
  | "Horn of Africa"
  | "Southern Africa"
  | "Sahel Region"
  | "Indian Ocean Islands"
  | "African Diaspora"
  | "Diaspora / Global Africa" // retained alias for legacy consumers
  | "Friends of Africa";

// Canonical display order for the 8 Africa regions, then Diaspora.
export const AFRICAN_REGIONS: AfricanRegion[] = [
  "North Africa",
  "West Africa",
  "Central Africa",
  "East Africa",
  "Horn of Africa",
  "Southern Africa",
  "Sahel Region",
  "Indian Ocean Islands",
  "African Diaspora",
];

export const REGION_DEFINITIONS: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  for (const r of CANONICAL_AFRICA_REGIONS) {
    out[r.name] = r.countries.join(", ");
  }
  out["African Diaspora"] =
    "Africans and people of African descent living outside Africa — recognised separately as a Global Community track.";
  out["Diaspora / Global Africa"] = out["African Diaspora"];
  out["Friends of Africa"] =
    "Non-African allies and institutions supporting Africa's educational transformation.";
  return out;
})();

export const REGION_SHORT_DESCRIPTIONS: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  for (const r of CANONICAL_AFRICA_REGIONS) {
    const preview = r.countries.slice(0, 4).join(", ");
    out[r.name] = r.countries.length > 4 ? `${preview} & more` : preview;
  }
  out["African Diaspora"] = "Africans living outside Africa";
  out["Diaspora / Global Africa"] = out["African Diaspora"];
  out["Friends of Africa"] = "Global allies supporting Africa";
  return out;
})();

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
 * Maps a country name to its Africa region using the approved 8-region model.
 * Non-African, non-Friends countries default to "African Diaspora".
 */
export function getRegionFromCountry(
  country: string | undefined | null,
): AfricanRegion {
  if (!country) return "African Diaspora";
  const region = getRegionByCountry(country);
  if (region) return region.name as AfricanRegion;
  const trimmed = country.trim();
  if (FRIENDS_OF_AFRICA_COUNTRIES.has(trimmed)) return "Friends of Africa";
  return "African Diaspora";
}

/** Normalise any legacy region label to the approved 8-region names. */
export function normalizeRegion(
  regionName: string | undefined | null,
): AfricanRegion {
  if (!regionName) return "African Diaspora";
  const normalized = regionName.trim().toLowerCase();

  if (normalized.includes("horn")) return "Horn of Africa";
  if (normalized.includes("sahel")) return "Sahel Region";
  if (normalized.includes("indian") || normalized.includes("island"))
    return "Indian Ocean Islands";
  if (normalized.includes("north")) return "North Africa";
  if (normalized.includes("west")) return "West Africa";
  if (normalized.includes("central")) return "Central Africa";
  if (normalized.includes("east")) return "East Africa";
  if (normalized.includes("southern") || normalized.includes("south africa"))
    return "Southern Africa";
  if (normalized.includes("diaspora") || normalized.includes("global africa"))
    return "African Diaspora";
  if (normalized.includes("friend")) return "Friends of Africa";

  // Try to resolve as a country
  const asCountry = getRegionByCountry(regionName);
  if (asCountry) return asCountry.name as AfricanRegion;

  return "African Diaspora";
}

/** All eight Africa regions (excluding Diaspora + Friends). */
export function getContinentalRegions(): AfricanRegion[] {
  return CANONICAL_AFRICA_REGIONS.map((r) => r.name as AfricanRegion);
}

export function isContinentalRegion(region: AfricanRegion): boolean {
  return getContinentalRegions().includes(region);
}

// Re-exports for downstream modules that want the canonical config.
export {
  CANONICAL_AFRICA_REGIONS as CANONICAL_AFRICA_REGIONS,
  DIASPORA_REGIONS,
  isAfricanCountry,
  resolveCanonicalCountry,
  type AfricaRegionDefinition,
};

// Brand messaging constants (updated to 8-region model).
export const REGIONAL_BRAND_MESSAGING = {
  tagline: REGIONAL_TAGLINE,
  shortTagline: "8 Africa Regions + 7 Global Regions",
  reachStatement:
    "Across 8 Africa regions and 7 global diaspora regions",
  statsLabel: "15 Regions (8 Africa + 7 Global)",
};

export const GOVERNANCE_STATS = {
  judges: 27,
  nrcVolunteers: 30,
  categories: 17,
  subcategories: 141,
  regions: REGION_STATS.africaRegions + 1, // 8 Africa + Diaspora
  continentalRegions: REGION_STATS.africaRegions, // 8
};

export const NRC_DESCRIPTION = {
  name: "Nominee Research Corps (NRC)",
  model: "Hybrid NRC",
  volunteers: 30,
  shortDescription:
    "30 Hybrid NRC Volunteers verifying nominations across all 8 Africa regions and the African Diaspora",
  fullDescription:
    "The Hybrid NRC is a blended verification model combining core NRC members with volunteer NRC support. Operating both remotely and in-person, the 30-member Hybrid NRC ensures thorough, region-aware verification across the 8 Africa regions and the African Diaspora community before nominations advance to voting or jury evaluation.",
};
