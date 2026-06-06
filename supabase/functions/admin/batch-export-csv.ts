// Stable CSV column definitions and builder for the nomination batch export.
// Extracted from index.ts so it can be unit-tested independently and remain
// stable across refactors. Any change to header names or column order is a
// breaking change to downstream consumers and must update the tests in
// batch-export-csv_test.ts.

export type IntakeRow = Record<string, unknown>;
export type AuditRow = Record<string, unknown>;

export interface IntakeColumn {
  header: string;
  accessor: (row: IntakeRow, ctx: { batchId: string }) => unknown;
}

export interface AuditColumn {
  header: string;
  accessor: (audit: AuditRow) => unknown;
}

// Intake columns align with export_nomination_batch RPC output.
export const INTAKE_CSV_COLUMNS: IntakeColumn[] = [
  { header: "batch_id", accessor: (_row, ctx) => ctx.batchId },
  { header: "intake_id", accessor: (row) => row.intake_id ?? row.id },
  { header: "record_id", accessor: (row) => row.record_id },
  { header: "form_type", accessor: (row) => row.form_type },
  { header: "award_group", accessor: (row) => row.award_group },
  { header: "award_category", accessor: (row) => row.award_category },
  { header: "award_subcategory", accessor: (row) => row.award_subcategory },
  { header: "nominee_name_clean", accessor: (row) => row.nominee_name_clean },
  { header: "nominee_type_clean", accessor: (row) => row.nominee_type_clean },
  { header: "nominee_country_clean", accessor: (row) => row.nominee_country_clean },
  { header: "nominee_region_clean", accessor: (row) => row.nominee_region_clean },
  { header: "nominee_city_clean", accessor: (row) => row.nominee_city_clean },
  { header: "impact_summary_clean", accessor: (row) => row.impact_summary_clean },
  { header: "evidence_status", accessor: (row) => row.evidence_status },
  { header: "verification_status", accessor: (row) => row.verification_status },
  { header: "nomination_status", accessor: (row) => row.nomination_status },
  { header: "identity_hash", accessor: (row) => row.identity_hash },
  { header: "duplicate_status", accessor: (row) => row.duplicate_status },
  { header: "duplicate_of", accessor: (row) => row.duplicate_of },
  { header: "ingested_at", accessor: (row) => row.ingested_at },
  { header: "ingested_by", accessor: (row) => row.ingested_by },
  { header: "updated_at", accessor: (row) => row.updated_at },
];

// Audit columns align with nomination_ingest_audit schema.
export const AUDIT_CSV_COLUMNS: AuditColumn[] = [
  { header: "audit_action", accessor: (a) => a.action },
  { header: "audit_reason", accessor: (a) => a.reason },
  { header: "audit_canonical_id", accessor: (a) => a.canonical_id },
  { header: "audit_previous_status", accessor: (a) => a.previous_duplicate_status },
  { header: "audit_new_status", accessor: (a) => a.new_duplicate_status },
  { header: "audit_actor_id", accessor: (a) => a.actor_id },
  { header: "audit_created_at", accessor: (a) => a.created_at },
];

export const CSV_HEADERS: string[] = [
  ...INTAKE_CSV_COLUMNS.map((c) => c.header),
  ...AUDIT_CSV_COLUMNS.map((c) => c.header),
];

export function escapeCsvField(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildBatchExportCsv(
  rows: IntakeRow[],
  batchId: string,
): string {
  const ctx = { batchId };
  const lines: string[] = [CSV_HEADERS.join(",")];
  for (const row of rows) {
    const trail = Array.isArray(row.audit_trail)
      ? (row.audit_trail as AuditRow[])
      : [];
    const base = INTAKE_CSV_COLUMNS.map((c) => c.accessor(row, ctx));
    if (trail.length === 0) {
      lines.push(
        [...base, ...AUDIT_CSV_COLUMNS.map(() => "")].map(escapeCsvField).join(","),
      );
    } else {
      for (const a of trail) {
        lines.push(
          [...base, ...AUDIT_CSV_COLUMNS.map((c) => c.accessor(a))]
            .map(escapeCsvField)
            .join(","),
        );
      }
    }
  }
  return lines.join("\n");
}
