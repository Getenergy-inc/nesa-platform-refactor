/**
 * NESA Africa 2024 Nominee Archive
 * 
 * This file preserves the original 2024 category naming and nominee records
 * for historical traceability and governance auditing.
 * 
 * STATUS: ARCHIVED — Not used in active public listings.
 * All records have been merged/migrated into the 2025 nominee system.
 * 
 * Generated: 2026-03-08
 */

export const ARCHIVE_META = {
  archivedAt: "2026-03-08",
  reason: "Merged into 2025 nominee system",
  originalSeason: "2024",
  totalRecords: 1703,
  mergeStrategy: "All 2024 nominees carried forward into 2025 with enriched content",
  note: "Original category names preserved below for audit trail",
};

/** Original 2024 category names before migration to 2025 */
export const LEGACY_2024_CATEGORIES = [
  "Diaspora Association Educational Impact in Africa",
  "Overall best educational friendly state in Nigeria 2024",
  "The Overall Best CSR for Education in Nigeria Award 2024",
  "Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024",
  "Best NGO Education Support Recognition Award (Africa-Regional)",
  "Best EduTech Organization in Nigeria and Africa 2024",
  "The best library in Nigerian tertiary institutions award 2024",
  "The Overall Best Research and Development Contribution by Research Institutes",
  "Best Media and advocacy for education in Nigeria 2024",
  "Christian faith organization Educational Champion of the Decade Award",
  "Islamic faith organization Educational Champion of the Decade Award",
  "Political Leaders in Nigeria 2024 Recognition Award",
  "Creative Arts Industry Contribution to Education in Nigeria 2024",
  "Best STEM Education Program or Project (Africa-Regional)",
] as const;

/** Mapping from legacy 2024 names → updated 2025 names */
export const CATEGORY_MIGRATION_MAP: Record<string, string> = {
  "Overall best educational friendly state in Nigeria 2024": "Overall Best Educational Friendly State in Nigeria 2025",
  "The Overall Best CSR for Education in Nigeria Award 2024": "The Overall Best CSR for Education in Nigeria Award 2025",
  "Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2024": "Best Africa Regional Companies CSR for Education Special Recognition Award in Africa 2025",
  "Best EduTech Organization in Nigeria and Africa 2024": "Best EduTech Organization in Nigeria and Africa 2025",
  "The best library in Nigerian tertiary institutions award 2024": "The Best Library in Nigerian Tertiary Institutions Award 2025",
  "Best Media and advocacy for education in Nigeria 2024": "Best Media and Advocacy for Education in Nigeria 2025",
  "Political Leaders in Nigeria 2024 Recognition Award": "Political Leaders in Nigeria 2025 Recognition Award",
  "Creative Arts Industry Contribution to Education in Nigeria 2024": "Creative Arts Industry Contribution to Education in Nigeria 2025",
  // Categories without year suffix remain unchanged
  "Diaspora Association Educational Impact in Africa": "Diaspora Association Educational Impact in Africa",
  "Best NGO Education Support Recognition Award (Africa-Regional)": "Best NGO Education Support Recognition Award (Africa-Regional)",
  "The Overall Best Research and Development Contribution by Research Institutes": "The Overall Best Research and Development Contribution by Research Institutes",
  "Christian faith organization Educational Champion of the Decade Award": "Christian Faith Organization Educational Champion of the Decade Award",
  "Islamic faith organization Educational Champion of the Decade Award": "Islamic Faith Organization Educational Champion of the Decade Award",
  "Best STEM Education Program or Project (Africa-Regional)": "Best STEM Education Program or Project (Africa-Regional)",
};

/** Subcategory year fix */
export const SUBCATEGORY_MIGRATION_MAP: Record<string, string> = {
  "Hotels CSR in Education Award 2022-2024 in Nigeria": "Hotels CSR in Education Award 2022-2025 in Nigeria",
};
