// Pure mapper: Raw Form Responses → Cleaned Data rows.
// Consumed by the admin /admin/nominations/ingest endpoint and admin tests.
// Follows src/config/nomination/dataIntakeSpec.ts (CLEANED_DATA_COLUMNS).

import type { AwardFamilyId } from "@/config/nomination/types";
import {
  buildAwardRecordId,
  buildRmsaRecordId,
  CLEANED_DATA_COLUMNS,
  type EvidenceStatus,
  type NominationStatus,
} from "@/config/nomination/dataIntakeSpec";

export type FormType = "award" | "rmsa";

export interface AwardIngestContext {
  formType: "award";
  family: AwardFamilyId;
  categorySlug: string;
  /** Display name forwarded to award_category column */
  categoryName: string;
  subcategorySlug?: string;
  defaultRegion?: string;
}

export interface RmsaIngestContext {
  formType: "rmsa";
  regionSlug: string;
  regionName: string;
}

export type IngestContext = AwardIngestContext | RmsaIngestContext;

export interface MapRowInput {
  /** Raw header row from the Google Sheet (column titles in original case) */
  headers: string[];
  /** Single raw data row, same length / order as headers */
  row: (string | null | undefined)[];
  /** 1-based row number across the form-response sheet (drives record_id) */
  rowNumber: number;
  /** Submission timestamp; if omitted the mapper uses the column value or `now()`. */
  submittedAt?: Date;
  context: IngestContext;
}

export type CleanedRow = Record<(typeof CLEANED_DATA_COLUMNS)[number], string>;

export interface MapRowResult {
  cleaned: CleanedRow;
  warnings: string[];
}

// ----- helpers -----
const URL_RE = /^https?:\/\/[^\s]+$/i;
const PLACEHOLDER_EVIDENCE = new Set([
  "yes", "no", "google it", "instagram", "facebook", "twitter", "x", "tiktok", "n/a", "na", "none",
]);

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function buildHeaderIndex(headers: string[]): Map<string, number> {
  const idx = new Map<string, number>();
  headers.forEach((h, i) => {
    const key = normalizeHeader(h);
    if (key && !idx.has(key)) idx.set(key, i);
  });
  return idx;
}

function getField(
  row: (string | null | undefined)[],
  idx: Map<string, number>,
  ...aliases: string[]
): string {
  for (const a of aliases) {
    const pos = idx.get(normalizeHeader(a));
    if (pos != null) {
      const v = row[pos];
      if (v != null && String(v).trim().length > 0) return String(v).trim();
    }
  }
  return "";
}

function properCase(s: string): string {
  if (!s) return s;
  // Preserve all-caps acronyms (UNICEF, NGO, etc.)
  return s
    .split(/(\s+|[-/])/)
    .map((tok) => {
      if (!tok.trim() || /[-/\s]/.test(tok)) return tok;
      if (tok.length > 1 && tok === tok.toUpperCase() && /^[A-Z0-9]+$/.test(tok)) return tok;
      return tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase();
    })
    .join("");
}

function classifyEvidence(links: string[]): EvidenceStatus {
  const real = links.filter((l) => URL_RE.test(l) && !PLACEHOLDER_EVIDENCE.has(l.toLowerCase()));
  if (real.length === 0) return "Evidence Missing";
  if (real.length === 1) return "Evidence Weak";
  return "Evidence Review Pending";
}

export function mapRawRowToCleaned(input: MapRowInput): MapRowResult {
  const { headers, row, rowNumber, context } = input;
  const warnings: string[] = [];

  if (row.length !== headers.length) {
    warnings.push(`row length ${row.length} ≠ headers length ${headers.length}`);
  }

  const idx = buildHeaderIndex(headers);

  // Submission timestamp: prefer column, fallback to caller-provided or now()
  const stampRaw = getField(row, idx, "Timestamp", "Submitted At", "timestamp");
  const submittedAt =
    (stampRaw && !Number.isNaN(Date.parse(stampRaw)) && new Date(stampRaw)) ||
    input.submittedAt ||
    new Date();

  // Build record_id
  let recordId = "";
  try {
    recordId =
      context.formType === "award"
        ? buildAwardRecordId({
            family: context.family,
            categorySlug: context.categorySlug,
            submittedAt,
            rowNumber,
          })
        : buildRmsaRecordId({
            regionSlug: context.regionSlug,
            submittedAt,
            rowNumber,
          });
  } catch (err) {
    warnings.push(`record_id build failed: ${(err as Error).message}`);
  }

  // Nominee fields
  const nomineeName = properCase(getField(row, idx, "Nominee Name", "Nominee Full Name", "Name"));
  const nomineeType = getField(row, idx, "Nominee Type", "Type of Nominee");
  const nomineeCountry = getField(
    row,
    idx,
    "Nominee Country",
    "Country",
    "Nominee Current Country of Residence",
  );
  const nomineeRegion = getField(
    row,
    idx,
    "African Region Connected to Nominee",
    "Region",
    "Nominee Region",
  );
  const nomineeCity = getField(row, idx, "City", "City / State / Province", "City State Province");

  const impact =
    getField(
      row,
      idx,
      "What education impact has the nominee made",
      "Education Impact",
      "Impact Summary",
      "Why should this nominee be considered for recognition",
    ) || "";

  // Evidence links — gather across all known evidence columns
  const evidenceLinks = [
    getField(row, idx, "Evidence Link 1", "Evidence Link", "Evidence URL"),
    getField(row, idx, "Evidence Link 2"),
    getField(row, idx, "Website or Public Profile Link", "Website"),
    getField(row, idx, "Social Media Link", "Social Media"),
    getField(row, idx, "News Article or Public Record Link", "News Article"),
  ].filter(Boolean);

  const evidenceStatus = classifyEvidence(evidenceLinks);

  const declarationRaw = getField(row, idx, "I agree", "Declaration", "Consent");
  const declarationOk = /^(yes|true|i agree|agree|y|1|checked)$/i.test(declarationRaw);

  // Initial nomination_status
  let nominationStatus: NominationStatus = "New Submission";
  if (!nomineeName || !nomineeCountry) nominationStatus = "Incomplete";
  else if (evidenceStatus === "Evidence Missing") nominationStatus = "Evidence Missing";
  else if (evidenceStatus === "Evidence Weak") nominationStatus = "Evidence Weak";

  if (!declarationOk) warnings.push("declaration checkbox not confirmed");

  const subcategory =
    getField(row, idx, "Award Subcategory", "Subcategory") ||
    (context.formType === "award" ? context.subcategorySlug ?? "" : "");

  const awardCategory =
    context.formType === "award" ? context.categoryName : "RMSA Special Needs School Intervention";

  const awardGroup =
    context.formType === "award"
      ? context.family
      : "rmsa";

  const cleaned: CleanedRow = {
    record_id: recordId,
    form_type: context.formType,
    award_group: awardGroup,
    award_category: awardCategory,
    award_subcategory: subcategory,
    nominee_name_clean: nomineeName,
    nominee_type_clean: nomineeType,
    nominee_country_clean: nomineeCountry,
    nominee_region_clean:
      nomineeRegion ||
      (context.formType === "award"
        ? context.defaultRegion ?? ""
        : context.regionName),
    nominee_city_clean: nomineeCity,
    impact_summary_clean: impact.replace(/\s+/g, " ").trim().slice(0, 2000),
    evidence_status: evidenceStatus,
    duplicate_status: "Not Checked",
    verification_status: "Verification Pending",
    nomination_status: nominationStatus,
    assigned_reviewer: "",
    reviewer_notes: "",
    website_sync_status: "Not Published",
  };

  return { cleaned, warnings };
}

export interface IngestBatchInput {
  headers: string[];
  rows: (string | null | undefined)[][];
  /** First sheet row number for `rows[0]` (defaults to 1). */
  startingRowNumber?: number;
  context: IngestContext;
}

export interface IngestBatchResult {
  cleaned: CleanedRow[];
  warnings: { rowNumber: number; messages: string[] }[];
  total: number;
}

export function ingestBatch(input: IngestBatchInput): IngestBatchResult {
  const start = input.startingRowNumber ?? 1;
  const cleaned: CleanedRow[] = [];
  const warnings: { rowNumber: number; messages: string[] }[] = [];

  input.rows.forEach((row, i) => {
    const rowNumber = start + i;
    const result = mapRawRowToCleaned({
      headers: input.headers,
      row,
      rowNumber,
      context: input.context,
    });
    cleaned.push(result.cleaned);
    if (result.warnings.length) warnings.push({ rowNumber, messages: result.warnings });
  });

  return { cleaned, warnings, total: cleaned.length };
}
