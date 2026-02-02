/**
 * NESA-Africa CSV-Driven Nominee Data Layer
 * Single source of truth for all award nominees
 * Parses flattened nested CSV and provides view models for UI
 */

import Papa from "papaparse";
import awardsCSV from "@/data/awards-nominees.csv?raw";

// ============================================================================
// TYPES
// ============================================================================

export interface Nominee {
  id: string;
  name: string;
  slug: string;
  image: string;
  imageUrl: string;
  achievement: string;
  state?: string;
  country?: string;
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

export interface ParseWarning {
  row: number;
  field: string;
  reason: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL || "";
const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

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
 * Generate unique ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
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

    // Get award-level data
    const awardTitle = row["title"];
    const awardDescription = row["description"] || "";

    if (!awardTitle) {
      warnings.push({ row: rowNum, field: "title", reason: "Missing award title" });
      return;
    }

    const awardSlug = generateSlug(awardTitle);

    // Parse regular subcategories (subCategories/N/...)
    const subcategories: Subcategory[] = [];
    for (let i = 0; i <= 20; i++) {
      const subcatTitle = row[`subCategories/${i}/title`];
      if (!subcatTitle) continue;

      const subcatDescription = row[`subCategories/${i}/description`] || "";
      const subcatSlug = generateSlug(subcatTitle);

      // Parse nominees for this subcategory
      const nominees: Nominee[] = [];
      for (let j = 0; j <= 20; j++) {
        const nomineeName = row[`subCategories/${i}/nominees/${j}/name`];
        if (!nomineeName) continue;

        const nomineeImage = row[`subCategories/${i}/nominees/${j}/image`] || "";
        const nomineeAchievement = row[`subCategories/${i}/nominees/${j}/achievement`] || "";
        const nomineeState = row[`subCategories/${i}/nominees/${j}/state`] || "";
        const nomineeCountry = row[`subCategories/${i}/nominees/${j}/country`] || "";

        nominees.push({
          id: generateId(),
          name: nomineeName,
          slug: generateSlug(nomineeName),
          image: nomineeImage,
          imageUrl: getImageUrl(nomineeImage),
          achievement: nomineeAchievement,
          state: nomineeState || undefined,
          country: nomineeCountry || undefined,
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
        const subcatTitle = row[`regions/${r}/subCategories/${s}/title`];
        if (!subcatTitle) continue;

        const subcatDescription = row[`regions/${r}/subCategories/${s}/description`] || "";
        const subcatSlug = generateSlug(subcatTitle);

        // Parse nominees for this regional subcategory
        const nominees: Nominee[] = [];
        for (let n = 0; n <= 20; n++) {
          const nomineeName = row[`regions/${r}/subCategories/${s}/nominees/${n}/name`];
          if (!nomineeName) continue;

          const nomineeImage = row[`regions/${r}/subCategories/${s}/nominees/${n}/image`] || "";
          const nomineeAchievement = row[`regions/${r}/subCategories/${s}/nominees/${n}/achievement`] || "";
          const nomineeState = row[`regions/${r}/subCategories/${s}/nominees/${n}/state`] || "";
          const nomineeCountry = row[`regions/${r}/subCategories/${s}/nominees/${n}/country`] || "";

          nominees.push({
            id: generateId(),
            name: nomineeName,
            slug: generateSlug(nomineeName),
            image: nomineeImage,
            imageUrl: getImageUrl(nomineeImage),
            achievement: nomineeAchievement,
            state: nomineeState || undefined,
            country: nomineeCountry || undefined,
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
 * Get all nominees across all awards (flattened)
 */
export function getAllNominees(): Array<Nominee & { awardTitle: string; awardSlug: string; subcategoryTitle: string; subcategorySlug: string; regionName?: string }> {
  const data = getParsedData();
  const allNominees: Array<Nominee & { awardTitle: string; awardSlug: string; subcategoryTitle: string; subcategorySlug: string; regionName?: string }> = [];

  // From regular awards
  data.awards.forEach((award) => {
    award.subcategories.forEach((subcat) => {
      subcat.nominees.forEach((nominee) => {
        allNominees.push({
          ...nominee,
          awardTitle: award.title,
          awardSlug: award.slug,
          subcategoryTitle: subcat.title,
          subcategorySlug: subcat.slug,
        });
      });
    });
  });

  // From regional awards
  data.regionalAwards.forEach((award) => {
    award.regions.forEach((region) => {
      region.subcategories.forEach((subcat) => {
        subcat.nominees.forEach((nominee) => {
          allNominees.push({
            ...nominee,
            awardTitle: award.title,
            awardSlug: award.slug,
            subcategoryTitle: subcat.title,
            subcategorySlug: subcat.slug,
            regionName: region.name,
          });
        });
      });
    });
  });

  return allNominees;
}

/**
 * Search nominees by name or achievement
 */
export function searchNominees(query: string): Array<Nominee & { awardTitle: string; awardSlug: string; subcategoryTitle: string; subcategorySlug: string; regionName?: string }> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  return getAllNominees().filter(
    (nominee) =>
      nominee.name.toLowerCase().includes(lowerQuery) ||
      nominee.achievement.toLowerCase().includes(lowerQuery) ||
      nominee.country?.toLowerCase().includes(lowerQuery) ||
      nominee.state?.toLowerCase().includes(lowerQuery)
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
} {
  const data = getParsedData();
  
  let totalSubcategories = 0;
  let totalNominees = 0;
  
  data.awards.forEach((award) => {
    totalSubcategories += award.subcategoryCount;
    totalNominees += award.nomineeCount;
  });

  let totalRegions = 0;
  data.regionalAwards.forEach((award) => {
    totalRegions += award.regions.length;
    totalNominees += award.totalNominees;
  });

  return {
    totalAwards: data.awards.length,
    totalRegionalAwards: data.regionalAwards.length,
    totalSubcategories,
    totalNominees,
    totalRegions,
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

// ============================================================================
// IMAGE COMPONENT HELPER
// ============================================================================

/**
 * Handler for image load errors - returns placeholder URL
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>): void {
  const img = event.currentTarget;
  if (!img.src.includes(PLACEHOLDER_IMAGE)) {
    img.src = PLACEHOLDER_IMAGE;
  }
}
