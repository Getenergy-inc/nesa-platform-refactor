/**
 * Rules governing research-compilation nominee imports (e.g. the
 * "Research compilation — Aug 2026" NGO Africa Regional batch).
 *
 * These rules are enforced in two places:
 *  - the database trigger `enforce_research_import_review()` on public.nominees
 *  - the unit tests in src/config/__tests__/researchImportRules.test.ts
 */

export const RESEARCH_SOURCE_PREFIX = "Research compilation";

/** Regions that region-scoped subcategory slugs may be scoped to. */
export const SCOPED_REGIONS = [
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
] as const;

export type ScopedRegion = (typeof SCOPED_REGIONS)[number];

/** Suffix used by region-scoped subcategory slugs, e.g. `ngo-africa-girlchild-west-africa`. */
export const REGION_SLUG_SUFFIX: Record<ScopedRegion, string> = {
  "West Africa": "west-africa",
  "East Africa": "east-africa",
  "Central Africa": "central-africa",
  "Southern Africa": "southern-africa",
  "North Africa": "north-africa",
};

export interface ResearchImportRecord {
  name: string;
  region: string;
  subcategorySlug: string;
  status: string;
  publicationStatus: string;
  nrcVerified: boolean;
  nominationSource: string | null;
  legacySource?: string | null;
}

export function isResearchCompilation(source: string | null | undefined): boolean {
  return !!source && source.toLowerCase().includes(RESEARCH_SOURCE_PREFIX.toLowerCase());
}

/**
 * A region-scoped subcategory slug must end with the suffix of the record's region.
 */
export function subcategoryMatchesRegion(subcategorySlug: string, region: string): boolean {
  const suffix = REGION_SLUG_SUFFIX[region as ScopedRegion];
  if (!suffix) return false;
  return subcategorySlug.endsWith(`-${suffix}`);
}

export interface ValidationIssue {
  record: string;
  rule: "region-scope" | "review-gate" | "source-field";
  message: string;
}

/**
 * Validates a research-compilation import batch.
 * Returns every violated rule; an empty array means the batch is importable.
 */
export function validateResearchImport(records: ResearchImportRecord[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const record of records) {
    if (!isResearchCompilation(record.nominationSource)) {
      issues.push({
        record: record.name,
        rule: "source-field",
        message:
          "Research imports must set nomination_source (not legacy_source) to the research compilation attribution.",
      });
      continue;
    }

    if (isResearchCompilation(record.legacySource)) {
      issues.push({
        record: record.name,
        rule: "source-field",
        message: "legacy_source must not carry research-compilation attribution.",
      });
    }

    if (!subcategoryMatchesRegion(record.subcategorySlug, record.region)) {
      issues.push({
        record: record.name,
        rule: "region-scope",
        message: `Subcategory "${record.subcategorySlug}" is not scoped to region "${record.region}".`,
      });
    }

    if (
      record.status !== "under_review" ||
      record.publicationStatus !== "unpublished" ||
      record.nrcVerified !== false
    ) {
      issues.push({
        record: record.name,
        rule: "review-gate",
        message:
          "Research imports must be created with status=under_review, publication_status=unpublished and nrc_verified=false.",
      });
    }
  }

  return issues;
}
