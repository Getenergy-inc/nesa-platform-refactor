import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  AUDIT_CSV_COLUMNS,
  buildBatchExportCsv,
  CSV_HEADERS,
  escapeCsvField,
  INTAKE_CSV_COLUMNS,
} from "./batch-export-csv.ts";

const BATCH_ID = "11111111-1111-1111-1111-111111111111";

// Frozen expectations — any drift in column order or header names is a
// breaking change for downstream CSV consumers and must be made deliberately.
const EXPECTED_INTAKE_HEADERS = [
  "batch_id",
  "intake_id",
  "record_id",
  "form_type",
  "award_group",
  "award_category",
  "award_subcategory",
  "nominee_name_clean",
  "nominee_type_clean",
  "nominee_country_clean",
  "nominee_region_clean",
  "nominee_city_clean",
  "impact_summary_clean",
  "evidence_status",
  "verification_status",
  "nomination_status",
  "identity_hash",
  "duplicate_status",
  "duplicate_of",
  "ingested_at",
  "ingested_by",
  "updated_at",
];

const EXPECTED_AUDIT_HEADERS = [
  "audit_action",
  "audit_reason",
  "audit_canonical_id",
  "audit_previous_status",
  "audit_new_status",
  "audit_actor_id",
  "audit_created_at",
];

Deno.test("CSV intake headers: stable order and names", () => {
  assertEquals(
    INTAKE_CSV_COLUMNS.map((c) => c.header),
    EXPECTED_INTAKE_HEADERS,
  );
});

Deno.test("CSV audit headers: stable order and names", () => {
  assertEquals(
    AUDIT_CSV_COLUMNS.map((c) => c.header),
    EXPECTED_AUDIT_HEADERS,
  );
});

Deno.test("CSV_HEADERS = intake then audit, no duplicates", () => {
  assertEquals(CSV_HEADERS, [
    ...EXPECTED_INTAKE_HEADERS,
    ...EXPECTED_AUDIT_HEADERS,
  ]);
  assertEquals(new Set(CSV_HEADERS).size, CSV_HEADERS.length);
});

Deno.test("escapeCsvField quotes commas, quotes, and newlines", () => {
  assertEquals(escapeCsvField(null), "");
  assertEquals(escapeCsvField(undefined), "");
  assertEquals(escapeCsvField("plain"), "plain");
  assertEquals(escapeCsvField("a,b"), '"a,b"');
  assertEquals(escapeCsvField('he said "hi"'), '"he said ""hi"""');
  assertEquals(escapeCsvField("line1\nline2"), '"line1\nline2"');
  assertEquals(escapeCsvField({ x: 1 }), '"{""x"":1}"');
  assertEquals(escapeCsvField(42), "42");
});

Deno.test("buildBatchExportCsv: header row matches CSV_HEADERS", () => {
  const csv = buildBatchExportCsv([], BATCH_ID);
  assertEquals(csv, CSV_HEADERS.join(","));
});

Deno.test("buildBatchExportCsv: row with no audit_trail emits one row with empty audit cols", () => {
  const row = {
    intake_id: "i-1",
    record_id: "r-1",
    form_type: "award",
    award_group: "G1",
    award_category: "C1",
    award_subcategory: "S1",
    nominee_name_clean: "Acme",
    nominee_type_clean: "organization",
    nominee_country_clean: "Kenya",
    nominee_region_clean: "East Africa",
    nominee_city_clean: "Nairobi",
    impact_summary_clean: "impact",
    evidence_status: "Provided",
    verification_status: "Pending",
    nomination_status: "Submitted",
    identity_hash: "hash-1",
    duplicate_status: "Unique",
    duplicate_of: null,
    ingested_at: "2026-06-06T00:00:00Z",
    ingested_by: "actor-1",
    updated_at: "2026-06-06T00:00:01Z",
    audit_trail: [],
  };
  const csv = buildBatchExportCsv([row], BATCH_ID);
  const lines = csv.split("\n");
  assertEquals(lines.length, 2);
  const cells = lines[1].split(",");
  assertEquals(cells.length, CSV_HEADERS.length);
  // Field mapping spot checks
  assertEquals(cells[0], BATCH_ID); // batch_id from context
  assertEquals(cells[1], "i-1"); // intake_id
  assertEquals(cells[2], "r-1"); // record_id
  assertEquals(cells[3], "award"); // form_type
  assertEquals(cells[17], "Unique"); // duplicate_status
  // All 7 audit columns blank
  const auditCells = cells.slice(EXPECTED_INTAKE_HEADERS.length);
  assertEquals(auditCells, ["", "", "", "", "", "", ""]);
});

Deno.test("buildBatchExportCsv: falls back to row.id when intake_id missing", () => {
  const row = { id: "fallback-id", record_id: "r-2", audit_trail: [] };
  const csv = buildBatchExportCsv([row], BATCH_ID);
  const cells = csv.split("\n")[1].split(",");
  assertEquals(cells[1], "fallback-id");
});

Deno.test("buildBatchExportCsv: emits one row per audit trail entry, repeating intake base", () => {
  const row = {
    intake_id: "i-2",
    record_id: "r-3",
    duplicate_status: "Potential Duplicate",
    duplicate_of: "i-1",
    audit_trail: [
      {
        action: "canonical_promoted",
        reason: "first_seen",
        canonical_id: "i-2",
        previous_duplicate_status: null,
        new_duplicate_status: "Unique",
        actor_id: "actor-a",
        created_at: "2026-06-06T00:00:00Z",
      },
      {
        action: "duplicate_marked",
        reason: "identity_hash_match",
        canonical_id: "i-1",
        previous_duplicate_status: "Unique",
        new_duplicate_status: "Potential Duplicate",
        actor_id: "actor-b",
        created_at: "2026-06-06T00:00:05Z",
      },
    ],
  };
  const csv = buildBatchExportCsv([row], BATCH_ID);
  const lines = csv.split("\n");
  assertEquals(lines.length, 3); // header + 2 audit rows

  const row1 = lines[1].split(",");
  const row2 = lines[2].split(",");

  // intake base repeats
  assertEquals(row1[1], "i-2");
  assertEquals(row2[1], "i-2");
  assertEquals(row1[2], "r-3");
  assertEquals(row2[2], "r-3");

  // audit fields differ per trail entry, in declared order
  const auditStart = EXPECTED_INTAKE_HEADERS.length;
  assertEquals(row1[auditStart + 0], "canonical_promoted");
  assertEquals(row1[auditStart + 1], "first_seen");
  assertEquals(row1[auditStart + 2], "i-2");
  assertEquals(row1[auditStart + 3], ""); // previous_duplicate_status null
  assertEquals(row1[auditStart + 4], "Unique");
  assertEquals(row1[auditStart + 5], "actor-a");
  assertEquals(row1[auditStart + 6], "2026-06-06T00:00:00Z");

  assertEquals(row2[auditStart + 0], "duplicate_marked");
  assertEquals(row2[auditStart + 1], "identity_hash_match");
  assertEquals(row2[auditStart + 2], "i-1");
  assertEquals(row2[auditStart + 3], "Unique");
  assertEquals(row2[auditStart + 4], "Potential Duplicate");
  assertEquals(row2[auditStart + 5], "actor-b");
});

Deno.test("buildBatchExportCsv: escapes commas, quotes and newlines in field values", () => {
  const row = {
    intake_id: "i-3",
    nominee_name_clean: 'Acme, "Africa" Ltd',
    impact_summary_clean: "line1\nline2",
    audit_trail: [],
  };
  const csv = buildBatchExportCsv([row], BATCH_ID);
  assertStringIncludes(csv, '"Acme, ""Africa"" Ltd"');
  assertStringIncludes(csv, '"line1\nline2"');
});

Deno.test("buildBatchExportCsv: missing intake fields render as empty cells, not 'undefined'", () => {
  const row = { intake_id: "i-4", audit_trail: [] };
  const csv = buildBatchExportCsv([row], BATCH_ID);
  const cells = csv.split("\n")[1].split(",");
  // record_id (index 2) and everything else after intake_id should be empty
  assertEquals(cells[2], "");
  assertEquals(cells.includes("undefined"), false);
  assertEquals(cells.includes("null"), false);
});
