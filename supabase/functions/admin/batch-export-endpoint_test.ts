// End-to-end integration test for
//   GET /admin/nominations/batch-export/:batch_id?format=csv
//
// This test boots a minimal HTTP server that mirrors the production endpoint
// in index.ts (same path parsing, same response headers, same CSV builder).
// It then issues a real `fetch` against that server and asserts:
//   - HTTP status, Content-Type, Content-Disposition, and X-* meta headers
//   - The CSV header row matches the frozen CSV_HEADERS contract
//   - A few intake fields are correctly mapped into the right columns
//   - Audit trail entries expand into one CSV row per entry
//
// A real DB round-trip is intentionally stubbed: the production handler
// delegates to the `export_nomination_batch` RPC, whose output shape is
// reproduced here as a fixture. The CSV layer (which this test exercises
// end-to-end) does not care where the rows came from.

import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildBatchExportCsv, CSV_HEADERS } from "./batch-export-csv.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BATCH_ID = "22222222-2222-2222-2222-222222222222";

// Mock token that the test handler accepts as "valid admin"
const VALID_ADMIN_TOKEN = "test-admin-token-xyz";

const FIXTURE_ROWS = [
  {
    intake_id: "i-100",
    record_id: "rec-A",
    form_type: "award",
    award_group: "Africa Icon",
    award_category: "Education",
    award_subcategory: "Higher Ed",
    nominee_name_clean: "Acme University",
    nominee_type_clean: "organization",
    nominee_country_clean: "Kenya",
    nominee_region_clean: "East Africa",
    nominee_city_clean: "Nairobi",
    impact_summary_clean: "Scaled STEM access",
    evidence_status: "Provided",
    verification_status: "Pending",
    nomination_status: "Submitted",
    identity_hash: "hash-A",
    duplicate_status: "Unique",
    duplicate_of: null,
    ingested_at: "2026-06-06T10:00:00Z",
    ingested_by: "actor-x",
    updated_at: "2026-06-06T10:00:01Z",
    audit_trail: [
      {
        action: "canonical_promoted",
        reason: "first_seen",
        canonical_id: "i-100",
        previous_duplicate_status: null,
        new_duplicate_status: "Unique",
        actor_id: "actor-x",
        created_at: "2026-06-06T10:00:00Z",
      },
    ],
  },
  {
    intake_id: "i-101",
    record_id: "rec-B",
    form_type: "award",
    award_group: "Africa Icon",
    award_category: "Education",
    award_subcategory: "Higher Ed",
    nominee_name_clean: "Acme University",
    nominee_type_clean: "organization",
    nominee_country_clean: "Kenya",
    nominee_region_clean: "East Africa",
    nominee_city_clean: "Nairobi",
    impact_summary_clean: "Duplicate submission",
    evidence_status: "Provided",
    verification_status: "Pending",
    nomination_status: "Submitted",
    identity_hash: "hash-A",
    duplicate_status: "Potential Duplicate",
    duplicate_of: "i-100",
    ingested_at: "2026-06-06T10:05:00Z",
    ingested_by: "actor-y",
    updated_at: "2026-06-06T10:05:01Z",
    audit_trail: [
      {
        action: "duplicate_marked",
        reason: "identity_hash_match",
        canonical_id: "i-100",
        previous_duplicate_status: "Unique",
        new_duplicate_status: "Potential Duplicate",
        actor_id: "actor-y",
        created_at: "2026-06-06T10:05:00Z",
      },
    ],
  },
];

// Mirrors the production handler branch in index.ts for the CSV format.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function handler(req: Request): Response {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Auth middleware — mirror production requireAdmin() check
  const authHeader = req.headers.get("Authorization");
  const isAdmin = authHeader?.startsWith("Bearer ") &&
    authHeader.replace("Bearer ", "") === VALID_ADMIN_TOKEN;
  if (!isAdmin) {
    return new Response(
      JSON.stringify({ ok: false, error: "Forbidden" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  // /admin/{domain}/{action}/{id}
  const [, domain, action, resourceId] = parts;
  if (
    domain !== "nominations" ||
    action !== "batch-export" ||
    req.method !== "GET" ||
    !resourceId
  ) {
    return new Response(JSON.stringify({ ok: false, error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!UUID_RE.test(resourceId)) {
    return new Response(
      JSON.stringify({ ok: false, error: "batch_id must be a valid UUID" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const batchId = resourceId;
  const rows = FIXTURE_ROWS;
  const duplicateCount = rows.filter(
    (r) => r.duplicate_status === "Potential Duplicate",
  ).length;
  const uniqueCount = rows.filter((r) => r.duplicate_status === "Unique").length;
  const formatParam = url.searchParams.get("format");
  const format = (formatParam || "json").toLowerCase();
  if (formatParam && format !== "csv" && format !== "json") {
    return new Response(
      JSON.stringify({ ok: false, error: `Unsupported format "${format}". Use "csv" or "json".` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  if (format === "csv") {
    const csv = buildBatchExportCsv(rows, batchId);
    return new Response(csv, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          `attachment; filename="nomination-batch-${batchId}.csv"`,
        "X-Batch-Id": batchId,
        "X-Total-Rows": String(rows.length),
        "X-Duplicate-Count": String(duplicateCount),
        "X-Unique-Count": String(uniqueCount),
      },
    });
  }
  return new Response(JSON.stringify({ ok: true, data: rows }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function withServer<T>(fn: (baseUrl: string) => Promise<T>): Promise<T> {
  const ac = new AbortController();
  const server = Deno.serve(
    { port: 0, signal: ac.signal, onListen: () => {} },
    handler,
  );
  // @ts-ignore — `addr` is present at runtime
  const port = (server.addr as Deno.NetAddr).port;
  try {
    return await fn(`http://127.0.0.1:${port}`);
  } finally {
    ac.abort();
    await server.finished.catch(() => {});
  }
}

const adminAuth = { Authorization: `Bearer ${VALID_ADMIN_TOKEN}` };

Deno.test("E2E: CSV export — status, headers, and Content-Disposition", async () => {
  await withServer(async (base) => {
    const res = await fetch(
      `${base}/admin/nominations/batch-export/${BATCH_ID}?format=csv`,
      { headers: adminAuth },
    );
    const body = await res.text();
    assertEquals(res.status, 200);
    assertEquals(res.headers.get("Content-Type"), "text/csv; charset=utf-8");
    assertEquals(
      res.headers.get("Content-Disposition"),
      `attachment; filename="nomination-batch-${BATCH_ID}.csv"`,
    );
    assertEquals(res.headers.get("X-Batch-Id"), BATCH_ID);
    assertEquals(res.headers.get("X-Total-Rows"), "2");
    assertEquals(res.headers.get("X-Duplicate-Count"), "1");
    assertEquals(res.headers.get("X-Unique-Count"), "1");
    // First line must equal the frozen header contract.
    const [headerLine] = body.split("\n");
    assertEquals(headerLine, CSV_HEADERS.join(","));
  });
});

Deno.test("E2E: CSV export — field mapping for canonical and duplicate rows", async () => {
  await withServer(async (base) => {
    const res = await fetch(
      `${base}/admin/nominations/batch-export/${BATCH_ID}?format=csv`,
      { headers: adminAuth },
    );
    const body = await res.text();
    const lines = body.split("\n");
    // header + 1 row per intake (each has 1 audit entry) = 3 lines
    assertEquals(lines.length, 3);

    const headers = lines[0].split(",");
    const idx = (h: string) => headers.indexOf(h);

    const row1 = lines[1].split(",");
    const row2 = lines[2].split(",");

    // batch_id is sourced from URL context, not row data
    assertEquals(row1[idx("batch_id")], BATCH_ID);
    assertEquals(row2[idx("batch_id")], BATCH_ID);

    // Canonical row mapping
    assertEquals(row1[idx("intake_id")], "i-100");
    assertEquals(row1[idx("record_id")], "rec-A");
    assertEquals(row1[idx("duplicate_status")], "Unique");
    assertEquals(row1[idx("duplicate_of")], "");
    assertEquals(row1[idx("audit_action")], "canonical_promoted");
    assertEquals(row1[idx("audit_canonical_id")], "i-100");
    assertEquals(row1[idx("audit_new_status")], "Unique");

    // Duplicate row mapping
    assertEquals(row2[idx("intake_id")], "i-101");
    assertEquals(row2[idx("duplicate_status")], "Potential Duplicate");
    assertEquals(row2[idx("duplicate_of")], "i-100");
    assertEquals(row2[idx("audit_action")], "duplicate_marked");
    assertEquals(row2[idx("audit_previous_status")], "Unique");
    assertEquals(row2[idx("audit_new_status")], "Potential Duplicate");
    assertEquals(row2[idx("audit_canonical_id")], "i-100");
  });
});

Deno.test("E2E: default (no format) returns JSON, not CSV", async () => {
  await withServer(async (base) => {
    const res = await fetch(
      `${base}/admin/nominations/batch-export/${BATCH_ID}`,
      { headers: adminAuth },
    );
    const ct = res.headers.get("Content-Type") || "";
    const body = await res.json();
    assertStringIncludes(ct, "application/json");
    assertEquals(body.ok, true);
    assertEquals(Array.isArray(body.data), true);
    assertEquals(body.data.length, 2);
  });
});

Deno.test("E2E: invalid format=bad returns 400 JSON error, not CSV", async () => {
  await withServer(async (base) => {
    const res = await fetch(
      `${base}/admin/nominations/batch-export/${BATCH_ID}?format=bad`,
      { headers: adminAuth },
    );
    const ct = res.headers.get("Content-Type") || "";
    const body = await res.json();

    assertEquals(res.status, 400);
    assertStringIncludes(ct, "application/json");
    assertEquals(body.ok, false);
    assertStringIncludes(body.error, "Unsupported format");
    assertStringIncludes(body.error, "bad");
    // Ensure no CSV download artifacts are present
    assertEquals(res.headers.get("Content-Disposition"), null);
    assertEquals(ct.includes("text/csv"), false);
  });
});

Deno.test("E2E: missing batch_id returns 404 JSON error, not CSV", async () => {
  await withServer(async (base) => {
    const res = await fetch(
      `${base}/admin/nominations/batch-export/?format=csv`,
      { headers: adminAuth },
    );
    const ct = res.headers.get("Content-Type") || "";
    const body = await res.json();

    assertEquals(res.status, 404);
    assertStringIncludes(ct, "application/json");
    assertEquals(body.ok, false);
    assertStringIncludes(body.error, "Not found");
    assertEquals(res.headers.get("Content-Disposition"), null);
    assertEquals(ct.includes("text/csv"), false);
  });
});

Deno.test("E2E: invalid batch_id returns 400 JSON error, not CSV", async () => {
  await withServer(async (base) => {
    const res = await fetch(
      `${base}/admin/nominations/batch-export/not-a-uuid?format=csv`,
      { headers: adminAuth },
    );
    const ct = res.headers.get("Content-Type") || "";
    const body = await res.json();

    assertEquals(res.status, 400);
    assertStringIncludes(ct, "application/json");
    assertEquals(body.ok, false);
    assertStringIncludes(body.error, "batch_id must be a valid UUID");
    assertEquals(res.headers.get("Content-Disposition"), null);
    assertEquals(ct.includes("text/csv"), false);
  });
});
