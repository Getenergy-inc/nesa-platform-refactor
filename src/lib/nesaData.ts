/**
 * NESA-Africa CSV-Driven Nominee Data Layer
 * Single source of truth for all award nominees
 * Parses flattened nested CSV and provides view models for UI
 * 
 * Organized by:
 * - 5 African Regions (North, East, West, South, Central)
 * - Diaspora
 * - Friends of Africa / International
 */

import Papa from "papaparse";
import awardsCSV from "@/data/awards-nominees.csv?raw";

// ============================================================================
// TYPES
// ============================================================================

export type NomineeImageType = "photo" | "logo";

export interface Nominee {
  id: string;
  name: string;
  slug: string;
  image: string;
  imageUrl: string;
  achievement: string;
  state?: string;
  country?: string;
  /** Whether this is a person photo or organization logo */
  imageType: NomineeImageType;
}

export interface Subcategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  nominees: Nominee[];
}

export interface Award {
  id: string;
  title: string;
  slug: string;
  description: string;
  subcategories: Subcategory[];
  nomineeCount: number;
  subcategoryCount: number;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
  nomineeCount: number;
}

export interface RegionalAward {
  id: string;
  title: string;
  slug: string;
  description: string;
  regions: Region[];
  totalNominees: number;
}

// Geographic categories for UI filtering
export type GeographicCategory = 
  | "all"
  | "africa-regions" 
  | "diaspora" 
  | "friends-of-africa"
  | "north-africa"
  | "east-africa"
  | "west-africa"
  | "south-africa"
  | "central-africa";

export interface GeographicGroup {
  id: GeographicCategory;
  name: string;
  description: string;
  nomineeCount: number;
  subcategories?: string[];
}

export interface ParseWarning {
  row: number;
  field: string;
  reason: string;
}

// Enriched nominee with context
export interface EnrichedNominee extends Nominee {
  awardTitle: string;
  awardSlug: string;
  subcategoryTitle: string;
  subcategorySlug: string;
  regionName?: string;
  regionSlug?: string;
  geographicCategory: GeographicCategory;
  // All CSV-imported nominees are considered approved by default
  status: "approved" | "pending" | "rejected";
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL || "";
const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

// Keywords to identify geographic categories
const DIASPORA_KEYWORDS = ["diaspora"];
const FRIENDS_OF_AFRICA_KEYWORDS = [
  "global education excellence",
  "international",
  "bilateral",
  "embassy",
  "global",
  "leadership training organization"
];

const AFRICA_REGION_NAMES: Record<string, GeographicCategory> = {
  "north africa": "north-africa",
  "east africa": "east-africa",
  "west africa": "west-africa",
  "south africa": "south-africa",
  "central africa": "central-africa",
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a URL-safe slug from a string
 */
export function generateSlug(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generate a unique slug for a nominee by combining name, award, subcategory, and optionally region
 * Format: name--award--subcategory or name--award--subcategory--region
 */
export function generateUniqueNomineeSlug(
  nomineeName: string,
  awardSlug: string,
  subcategorySlug: string,
  regionSlug?: string
): string {
  const nameSlug = generateSlug(nomineeName);
  const parts = [nameSlug, awardSlug, subcategorySlug];
  if (regionSlug) {
    parts.push(regionSlug);
  }
  return parts.join("--");
}

// Keywords indicating an organization/company (vs a person)
const ORGANIZATION_KEYWORDS = [
  "ltd", "limited", "inc", "llc", "company", "corporation", "corp", "group",
  "foundation", "ministry", "university", "college", "school", "institute",
  "bank", "plc", "ngo", "association", "society", "council", "commission",
  "agency", "authority", "department", "organization", "organisation",
  "trust", "charity", "network", "alliance", "centre", "center", "hospital",
  "clinic", "media", "broadcast", "television", "radio", "press", "publishing"
];

/**
 * Determine if a nominee name represents an organization (logo) vs a person (photo)
 */
export function isOrganization(name: string): boolean {
  const lowerName = name.toLowerCase();
  return ORGANIZATION_KEYWORDS.some(keyword => lowerName.includes(keyword));
}

/**
 * Get the image type based on nominee name
 */
export function getImageType(name: string): NomineeImageType {
  return isOrganization(name) ? "logo" : "photo";
}

/**
 * Normalize year references in text: replace 2024 with 2025, 2014-2024 with 2005-2025
 */
export function normalizeYearReferences(text: string): string {
  if (!text) return text;
  return text
    // Replace ranges
    .replace(/2014[-–—]2024/g, "2005–2025")
    .replace(/2014 to 2024/gi, "2005 to 2025")
    .replace(/2020[-–—]2024/g, "2020–2025")
    .replace(/2013[-–—]2024/g, "2013–2025")
    // Replace standalone years in award context
    .replace(/Award[s]?\s+2024/gi, "Awards 2025")
    .replace(/NESA[\s-]*2024/gi, "NESA 2025")
    .replace(/2024\s+Award/gi, "2025 Award")
    .replace(/\(2014-2024\)/g, "(2005–2025)")
    .replace(/\(2024\)/g, "(2025)");
}

/**
 * Get the full image URL with fallback
 */
export function getImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath || imagePath.trim() === "") {
    return PLACEHOLDER_IMAGE;
  }
  // If it's already a full URL, return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // Prepend the asset base URL
  return `${ASSET_BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

/**
 * Handle image error by setting placeholder
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.currentTarget;
  if (target.src !== PLACEHOLDER_IMAGE) {
    target.src = PLACEHOLDER_IMAGE;
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Determine geographic category from award title
 */
function getGeographicCategoryFromTitle(title: string): GeographicCategory {
  const lowerTitle = title.toLowerCase();
  
  if (DIASPORA_KEYWORDS.some(k => lowerTitle.includes(k))) {
    return "diaspora";
  }
  
  if (FRIENDS_OF_AFRICA_KEYWORDS.some(k => lowerTitle.includes(k))) {
    return "friends-of-africa";
  }
  
  return "all";
}

/**
 * Determine geographic category from region name
 */
function getGeographicCategoryFromRegion(regionName: string): GeographicCategory {
  const lowerRegion = regionName.toLowerCase();
  
  for (const [key, category] of Object.entries(AFRICA_REGION_NAMES)) {
    if (lowerRegion.includes(key)) {
      return category;
    }
  }
  
  return "africa-regions";
}

// ============================================================================
// CSV PARSING
// ============================================================================

interface ParsedRow {
  [key: string]: string;
}

interface ParsedData {
  awards: Award[];
  regionalAwards: RegionalAward[];
  warnings: ParseWarning[];
}

/**
 * Parse the flattened nested CSV structure into typed objects
 */
function parseCSV(): ParsedData {
  const warnings: ParseWarning[] = [];
  const awards: Award[] = [];
  const regionalAwards: RegionalAward[] = [];

  const result = Papa.parse<ParsedRow>(awardsCSV, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  if (result.errors.length > 0) {
    result.errors.forEach((err) => {
      console.warn(`CSV Parse Error at row ${err.row}: ${err.message}`);
      warnings.push({
        row: err.row || 0,
        field: "CSV",
        reason: err.message,
      });
    });
  }

  // Process each row (each row is an award)
  result.data.forEach((row, rowIndex) => {
    const rowNum = rowIndex + 2; // Account for header row

    // Get award-level data - normalize year references
    const rawAwardTitle = row["title"];
    const rawAwardDescription = row["description"] || "";
    
    const awardTitle = normalizeYearReferences(rawAwardTitle);
    const awardDescription = normalizeYearReferences(rawAwardDescription);

    if (!awardTitle) {
      warnings.push({ row: rowNum, field: "title", reason: "Missing award title" });
      return;
    }

    const awardSlug = generateSlug(awardTitle);

    // Parse regular subcategories (subCategories/N/...)
    const subcategories: Subcategory[] = [];
    for (let i = 0; i <= 20; i++) {
      const rawSubcatTitle = row[`subCategories/${i}/title`];
      if (!rawSubcatTitle) continue;

      const subcatTitle = normalizeYearReferences(rawSubcatTitle);
      const subcatDescription = normalizeYearReferences(row[`subCategories/${i}/description`] || "");
      const subcatSlug = generateSlug(subcatTitle);

      // Parse nominees for this subcategory
      const nominees: Nominee[] = [];
      for (let j = 0; j <= 20; j++) {
        const nomineeName = row[`subCategories/${i}/nominees/${j}/name`];
        if (!nomineeName) continue;

        const nomineeImage = row[`subCategories/${i}/nominees/${j}/image`] || "";
        const rawAchievement = row[`subCategories/${i}/nominees/${j}/achievement`] || "";
        const nomineeAchievement = normalizeYearReferences(rawAchievement);
        const nomineeState = row[`subCategories/${i}/nominees/${j}/state`] || "";
        const nomineeCountry = row[`subCategories/${i}/nominees/${j}/country`] || "";

        // Generate unique slug: name--award--subcategory
        const uniqueSlug = generateUniqueNomineeSlug(nomineeName, awardSlug, subcatSlug);

        nominees.push({
          id: generateId(),
          name: nomineeName,
          slug: uniqueSlug,
          image: nomineeImage,
          imageUrl: getImageUrl(nomineeImage),
          achievement: nomineeAchievement,
          state: nomineeState || undefined,
          country: nomineeCountry || undefined,
          imageType: getImageType(nomineeName),
        });
      }

      if (nominees.length > 0) {
        subcategories.push({
          id: generateId(),
          title: subcatTitle,
          slug: subcatSlug,
          description: subcatDescription,
          nominees,
        });
      }
    }

    // If this award has non-regional subcategories, add it to awards
    if (subcategories.length > 0) {
      const totalNominees = subcategories.reduce((sum, sc) => sum + sc.nominees.length, 0);
      awards.push({
        id: generateId(),
        title: awardTitle,
        slug: awardSlug,
        description: awardDescription,
        subcategories,
        nomineeCount: totalNominees,
        subcategoryCount: subcategories.length,
      });
    }

    // Parse regional data (regions/N/...)
    const regions: Region[] = [];
    for (let r = 0; r <= 10; r++) {
      const regionName = row[`regions/${r}/name`];
      if (!regionName) continue;

      const regionSlug = generateSlug(regionName);
      const regionSubcategories: Subcategory[] = [];

      // Parse subcategories within this region
      for (let s = 0; s <= 10; s++) {
        const rawSubcatTitle = row[`regions/${r}/subCategories/${s}/title`];
        if (!rawSubcatTitle) continue;

        const subcatTitle = normalizeYearReferences(rawSubcatTitle);
        const subcatDescription = normalizeYearReferences(row[`regions/${r}/subCategories/${s}/description`] || "");
        const subcatSlug = generateSlug(subcatTitle);

        // Parse nominees for this regional subcategory
        const nominees: Nominee[] = [];
        for (let n = 0; n <= 20; n++) {
          const nomineeName = row[`regions/${r}/subCategories/${s}/nominees/${n}/name`];
          if (!nomineeName) continue;

          const nomineeImage = row[`regions/${r}/subCategories/${s}/nominees/${n}/image`] || "";
          const rawAchievement = row[`regions/${r}/subCategories/${s}/nominees/${n}/achievement`] || "";
          const nomineeAchievement = normalizeYearReferences(rawAchievement);
          const nomineeState = row[`regions/${r}/subCategories/${s}/nominees/${n}/state`] || "";
          const nomineeCountry = row[`regions/${r}/subCategories/${s}/nominees/${n}/country`] || "";

          // Generate unique slug: name--award--subcategory--region
          const uniqueSlug = generateUniqueNomineeSlug(nomineeName, awardSlug, subcatSlug, regionSlug);

          nominees.push({
            id: generateId(),
            name: nomineeName,
            slug: uniqueSlug,
            image: nomineeImage,
            imageUrl: getImageUrl(nomineeImage),
            achievement: nomineeAchievement,
            state: nomineeState || undefined,
            country: nomineeCountry || undefined,
            imageType: getImageType(nomineeName),
          });
        }

        if (nominees.length > 0) {
          regionSubcategories.push({
            id: generateId(),
            title: subcatTitle,
            slug: subcatSlug,
            description: subcatDescription,
            nominees,
          });
        }
      }

      if (regionSubcategories.length > 0) {
        const regionNomineeCount = regionSubcategories.reduce((sum, sc) => sum + sc.nominees.length, 0);
        regions.push({
          id: generateId(),
          name: regionName,
          slug: regionSlug,
          subcategories: regionSubcategories,
          nomineeCount: regionNomineeCount,
        });
      }
    }

    // If this award has regional data, add to regional awards
    if (regions.length > 0) {
      const totalNominees = regions.reduce((sum, r) => sum + r.nomineeCount, 0);
      regionalAwards.push({
        id: generateId(),
        title: awardTitle,
        slug: awardSlug,
        description: awardDescription,
        regions,
        totalNominees,
      });
    }
  });

  // Log warnings for debugging
  if (warnings.length > 0) {
    console.warn(`NESA Data: ${warnings.length} warnings during CSV parse:`, warnings);
  }

  console.log(`NESA Data: Loaded ${awards.length} awards, ${regionalAwards.length} regional awards`);

  return { awards, regionalAwards, warnings };
}

// ============================================================================
// SINGLETON DATA STORE
// ============================================================================

let _parsedData: ParsedData | null = null;

function getParsedData(): ParsedData {
  if (!_parsedData) {
    _parsedData = parseCSV();
  }
  return _parsedData;
}

// ============================================================================
// VIEW MODEL FUNCTIONS
// ============================================================================

/**
 * Get all awards with counts
 */
export function getAwards(): Award[] {
  return getParsedData().awards;
}

/**
 * Get award detail by slug
 */
export function getAwardDetail(awardSlug: string): Award | undefined {
  return getParsedData().awards.find((a) => a.slug === awardSlug);
}

/**
 * Get all regional awards
 */
export function getRegionalAwards(): RegionalAward[] {
  return getParsedData().regionalAwards;
}

/**
 * Get regional award detail by slug
 */
export function getRegionalAwardDetail(awardSlug: string): RegionalAward | undefined {
  return getParsedData().regionalAwards.find((a) => a.slug === awardSlug);
}

/**
 * Get all nominees across all awards (flattened) with enriched data
 */
export function getAllNominees(): EnrichedNominee[] {
  const data = getParsedData();
  const allNominees: EnrichedNominee[] = [];

  // From regular awards
  data.awards.forEach((award) => {
    const awardGeoCategory = getGeographicCategoryFromTitle(award.title);
    
    award.subcategories.forEach((subcat) => {
      subcat.nominees.forEach((nominee) => {
        allNominees.push({
          ...nominee,
          awardTitle: award.title,
          awardSlug: award.slug,
          subcategoryTitle: subcat.title,
          subcategorySlug: subcat.slug,
          geographicCategory: awardGeoCategory,
          status: "approved", // All CSV-imported nominees are approved by default
        });
      });
    });
  });

  // From regional awards
  data.regionalAwards.forEach((award) => {
    award.regions.forEach((region) => {
      const regionGeoCategory = getGeographicCategoryFromRegion(region.name);
      
      region.subcategories.forEach((subcat) => {
        subcat.nominees.forEach((nominee) => {
          allNominees.push({
            ...nominee,
            awardTitle: award.title,
            awardSlug: award.slug,
            subcategoryTitle: subcat.title,
            subcategorySlug: subcat.slug,
            regionName: region.name,
            regionSlug: region.slug,
            geographicCategory: regionGeoCategory,
            status: "approved", // All CSV-imported nominees are approved by default
          });
        });
      });
    });
  });

  return allNominees;
}

/**
 * Get nominees filtered by geographic category
 */
export function getNomineesByGeography(category: GeographicCategory): EnrichedNominee[] {
  const allNominees = getAllNominees();
  
  if (category === "all") {
    return allNominees;
  }
  
  if (category === "africa-regions") {
    // Include all African regions
    const africaCategories: GeographicCategory[] = [
      "north-africa", "east-africa", "west-africa", "south-africa", "central-africa"
    ];
    return allNominees.filter(n => africaCategories.includes(n.geographicCategory));
  }
  
  return allNominees.filter(n => n.geographicCategory === category);
}

/**
 * Get geographic group summaries for UI tabs
 */
export function getGeographicGroups(): GeographicGroup[] {
  const allNominees = getAllNominees();
  
  const africaCategories: GeographicCategory[] = [
    "north-africa", "east-africa", "west-africa", "south-africa", "central-africa"
  ];
  
  const groups: GeographicGroup[] = [
    {
      id: "all",
      name: "All Nominees",
      description: "View all nominees across all categories",
      nomineeCount: allNominees.length,
    },
    {
      id: "africa-regions",
      name: "Africa Regions",
      description: "Nominees from the 5 African regions",
      nomineeCount: allNominees.filter(n => africaCategories.includes(n.geographicCategory)).length,
      subcategories: ["North Africa", "East Africa", "West Africa", "South Africa", "Central Africa"],
    },
    {
      id: "diaspora",
      name: "Diaspora",
      description: "African diaspora educational contributions",
      nomineeCount: allNominees.filter(n => n.geographicCategory === "diaspora").length,
    },
    {
      id: "friends-of-africa",
      name: "Friends of Africa",
      description: "International organizations supporting African education",
      nomineeCount: allNominees.filter(n => n.geographicCategory === "friends-of-africa").length,
    },
  ];
  
  return groups;
}

/**
 * Get Africa region breakdown
 */
export function getAfricaRegions(): GeographicGroup[] {
  const allNominees = getAllNominees();
  
  const regions: { id: GeographicCategory; name: string; description: string }[] = [
    { id: "north-africa", name: "North Africa", description: "Egypt, Morocco, Algeria, Tunisia, Libya" },
    { id: "east-africa", name: "East Africa", description: "Kenya, Tanzania, Uganda, Ethiopia, Rwanda" },
    { id: "west-africa", name: "West Africa", description: "Nigeria, Ghana, Senegal, Ivory Coast" },
    { id: "south-africa", name: "Southern Africa", description: "South Africa, Botswana, Zimbabwe, Namibia" },
    { id: "central-africa", name: "Central Africa", description: "DRC, Cameroon, Congo, Gabon" },
  ];
  
  return regions.map(r => ({
    ...r,
    nomineeCount: allNominees.filter(n => n.geographicCategory === r.id).length,
  }));
}

/**
 * Get a single nominee by slug
 */
export function getNomineeBySlug(slug: string): EnrichedNominee | undefined {
  if (!slug) return undefined;
  const lowerSlug = slug.toLowerCase().trim();
  return getAllNominees().find((n) => n.slug === lowerSlug);
}

/**
 * Get related nominees (same subcategory, excluding current)
 */
export function getRelatedNominees(nominee: EnrichedNominee, limit: number = 4): EnrichedNominee[] {
  return getAllNominees()
    .filter((n) => n.subcategorySlug === nominee.subcategorySlug && n.slug !== nominee.slug)
    .slice(0, limit);
}

/**
 * Search nominees by name or achievement
 */
export function searchNominees(query: string): EnrichedNominee[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  return getAllNominees().filter(
    (nominee) =>
      nominee.name.toLowerCase().includes(lowerQuery) ||
      nominee.achievement.toLowerCase().includes(lowerQuery) ||
      nominee.country?.toLowerCase().includes(lowerQuery) ||
      nominee.state?.toLowerCase().includes(lowerQuery) ||
      nominee.regionName?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get total statistics
 */
export function getStats(): {
  totalAwards: number;
  totalRegionalAwards: number;
  totalSubcategories: number;
  totalNominees: number;
  totalRegions: number;
  africaRegionsCount: number;
  diasporaCount: number;
  friendsOfAfricaCount: number;
} {
  const data = getParsedData();
  const allNominees = getAllNominees();
  
  let totalSubcategories = 0;
  
  data.awards.forEach((award) => {
    totalSubcategories += award.subcategoryCount;
  });

  let totalRegions = 0;
  data.regionalAwards.forEach((award) => {
    totalRegions += award.regions.length;
  });

  const africaCategories: GeographicCategory[] = [
    "north-africa", "east-africa", "west-africa", "south-africa", "central-africa"
  ];

  return {
    totalAwards: data.awards.length,
    totalRegionalAwards: data.regionalAwards.length,
    totalSubcategories,
    totalNominees: allNominees.length,
    totalRegions,
    africaRegionsCount: allNominees.filter(n => africaCategories.includes(n.geographicCategory)).length,
    diasporaCount: allNominees.filter(n => n.geographicCategory === "diaspora").length,
    friendsOfAfricaCount: allNominees.filter(n => n.geographicCategory === "friends-of-africa").length,
  };
}

/**
 * Get parse warnings (for debugging)
 */
export function getParseWarnings(): ParseWarning[] {
  return getParsedData().warnings;
}

/**
 * Get unique categories/awards for filter dropdowns
 */
export function getAwardOptions(): Array<{ value: string; label: string }> {
  const awards = getAwards();
  const regional = getRegionalAwards();
  
  const options: Array<{ value: string; label: string }> = [];
  
  awards.forEach((a) => {
    options.push({ value: a.slug, label: a.title });
  });
  
  regional.forEach((a) => {
    if (!options.find(o => o.value === a.slug)) {
      options.push({ value: a.slug, label: `${a.title} (Regional)` });
    }
  });
  
  return options;
}

/**
 * Get unique regions for filter dropdowns
 */
export function getRegionOptions(): Array<{ value: string; label: string }> {
  const regional = getRegionalAwards();
  const regionsSet = new Map<string, string>();
  
  regional.forEach((award) => {
    award.regions.forEach((region) => {
      if (!regionsSet.has(region.slug)) {
        regionsSet.set(region.slug, region.name);
      }
    });
  });
  
  return Array.from(regionsSet.entries()).map(([value, label]) => ({ value, label }));
}

/**
 * Get geographic category options for filter dropdown
 */
export function getGeographicCategoryOptions(): Array<{ value: GeographicCategory; label: string }> {
  return [
    { value: "all", label: "All Categories" },
    { value: "africa-regions", label: "Africa Regions" },
    { value: "north-africa", label: "North Africa" },
    { value: "east-africa", label: "East Africa" },
    { value: "west-africa", label: "West Africa" },
    { value: "south-africa", label: "Southern Africa" },
    { value: "central-africa", label: "Central Africa" },
    { value: "diaspora", label: "Diaspora" },
    { value: "friends-of-africa", label: "Friends of Africa" },
  ];
}

// ============================================================================
// EXPORT FOR IMAGE ERROR HANDLING
// ============================================================================

export { PLACEHOLDER_IMAGE };
