// ============================================================================
// Nominee enrichment — standardisation, region assignment and classification.
//
// Source of truth: the master register (`src/data/nominees-2025.ts`, imported
// verbatim from NESA_Award_Nominees_Master_List.xlsx). This module derives the
// governance fields the 2026 Recognition Framework requires — approved region
// and recognition classification — WITHOUT mutating or discarding the original
// imported values. Every helper returns a derived value plus the raw input so
// audits can always reconstruct the source row.
//
// Pure functions only. Nothing here writes to the database.
// ============================================================================

import { getRegionByCountry, resolveCanonicalCountry } from "@/config/regions/africaRegions";

/** The ten approved regions for the 2026 cycle. */
export const APPROVED_REGIONS = [
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
  "Horn of Africa",
  "Sahel Region",
  "Indian Ocean Islands",
  "Diaspora Africans",
  "Friends of Africa",
] as const;

export type ApprovedRegion = (typeof APPROVED_REGIONS)[number];

/** The three recognition classifications. */
export const CLASSIFICATIONS = [
  "Africans in Africa",
  "Diaspora Africans",
  "Friends of Africa",
] as const;

export type Classification = (typeof CLASSIFICATIONS)[number];

const NON_AFRICAN_ALLY_COUNTRIES = new Set(
  [
    "united states",
    "usa",
    "united kingdom",
    "uk",
    "canada",
    "germany",
    "france",
    "netherlands",
    "belgium",
    "switzerland",
    "sweden",
    "norway",
    "denmark",
    "finland",
    "ireland",
    "italy",
    "spain",
    "portugal",
    "australia",
    "new zealand",
    "japan",
    "china",
    "india",
    "brazil",
    "uae",
    "united arab emirates",
    "qatar",
    "saudi arabia",
    "turkey",
    "russia",
    "south korea",
  ].map((c) => c),
);

const lower = (v: string | null | undefined) => (v ?? "").trim().toLowerCase();

// ---------------------------------------------------------------------------
// Standardisation (original value always preserved by the caller)
// ---------------------------------------------------------------------------

/** Collapse whitespace and normalise casing artefacts in a person/org name. */
export function standardiseName(raw: string | null | undefined): string {
  return (raw ?? "")
    .replace(/\s+/g, " ")
    .replace(/\s*([,;])\s*/g, "$1 ")
    .trim();
}

/** Resolve a country string to its canonical spelling where one is known. */
export function standardiseCountry(raw: string | null | undefined): string {
  const cleaned = standardiseName(raw);
  if (!cleaned) return "";
  return resolveCanonicalCountry(cleaned) ?? cleaned;
}

/** Normalise an organisation/institution label for duplicate detection. */
export function organisationKey(raw: string | null | undefined): string {
  return lower(raw)
    .normalize("NFKD")
    .replace(/\b(the|ltd|limited|plc|inc|incorporated|foundation|initiative|organisation|organization)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Identity key for duplicate detection across name spellings. */
export function identityKey(name: string | null | undefined, country?: string | null): string {
  const n = lower(name)
    .normalize("NFKD")
    .replace(/\b(dr|prof|professor|mr|mrs|ms|chief|engr|hon|sir|alhaji|rev)\b\.?/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return country ? `${n}|${lower(standardiseCountry(country))}` : n;
}

// ---------------------------------------------------------------------------
// Region assignment
// ---------------------------------------------------------------------------

function regionFromLabel(label: string): ApprovedRegion | null {
  const v = lower(label);
  if (!v || v === "n/a") return null;
  if (v.includes("horn")) return "Horn of Africa";
  if (v.includes("sahel")) return "Sahel Region";
  if (v.includes("indian") || v.includes("island")) return "Indian Ocean Islands";
  if (v.includes("north")) return "North Africa";
  if (v.includes("west")) return "West Africa";
  if (v.includes("central")) return "Central Africa";
  if (v.includes("east")) return "East Africa";
  if (v.includes("southern") || v.includes("south africa") || v === "south")
    return "Southern Africa";
  if (v.includes("diaspora") || v.includes("global africa")) return "Diaspora Africans";
  if (v.includes("friend")) return "Friends of Africa";
  return null;
}

function regionFromCountry(country: string): ApprovedRegion | null {
  const def = getRegionByCountry(country);
  if (def) return def.name as ApprovedRegion;
  if (NON_AFRICAN_ALLY_COUNTRIES.has(lower(country))) return "Friends of Africa";
  return null;
}

export interface RegionInput {
  region?: string | null;
  country?: string | null;
  state?: string | null;
  category?: string | null;
}

/**
 * Assign one of the ten approved regions. Priority:
 * explicit region → country → state hint → category hint → Diaspora Africans.
 */
export function resolveNomineeRegion(input: RegionInput): ApprovedRegion {
  const fromRegion = regionFromLabel(input.region ?? "");
  if (fromRegion) return fromRegion;

  const fromCountry = input.country ? regionFromCountry(input.country) : null;
  if (fromCountry) return fromCountry;

  const stateTail = (input.state ?? "").split(",").pop()?.trim() ?? "";
  const fromState = stateTail ? regionFromCountry(stateTail) : null;
  if (fromState) return fromState;

  const cat = lower(input.category);
  if (cat.includes("diaspora")) return "Diaspora Africans";
  if (cat.includes("nigeria")) return "West Africa";

  return "Diaspora Africans";
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

export interface ClassificationInput {
  category?: string | null;
  subcategory?: string | null;
  country?: string | null;
  region?: string | null;
}

/** Every nominee belongs to exactly one of the three classifications. */
export function resolveClassification(input: ClassificationInput): Classification {
  const text = `${lower(input.category)} ${lower(input.subcategory)}`;
  if (text.includes("diaspora")) return "Diaspora Africans";
  if (text.includes("friend of africa") || text.includes("friends of africa"))
    return "Friends of Africa";

  const regionLabel = regionFromLabel(input.region ?? "");
  if (regionLabel === "Diaspora Africans") return "Diaspora Africans";
  if (regionLabel === "Friends of Africa") return "Friends of Africa";

  const country = standardiseCountry(input.country);
  if (country) {
    if (resolveCanonicalCountry(country)) return "Africans in Africa";
    if (NON_AFRICAN_ALLY_COUNTRIES.has(lower(country))) return "Friends of Africa";
  }

  // Region resolved to an African region with no contradicting signal.
  if (regionLabel) return "Africans in Africa";
  return "Africans in Africa";
}

/** Combined derivation used by the catalogue adapters. */
export function enrichNomineeGeography(input: RegionInput & ClassificationInput) {
  const region = resolveNomineeRegion(input);
  const classification = resolveClassification({ ...input, region: input.region || region });
  return {
    region,
    classification,
    /** Original imported values, preserved verbatim for audit. */
    source: {
      region: input.region ?? "",
      country: input.country ?? "",
      state: input.state ?? "",
    },
  };
}
