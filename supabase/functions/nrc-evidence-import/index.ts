// NESA-Africa NRC Evidence Refactor — Phase 1 Import
// POST /nrc-evidence-import { storage_path: "nrc/NESA_NIG_2026_NRC.xlsx" }
// Reads the workbook from the `nominee-media` bucket, parses the
// "NRC Evidence Matrix" sheet, and upserts into nrc_evidence_rows
// (+ exploded sources into nrc_evidence_sources + research queue).
// Admin-only. No bios on the existing `nominees` table are overwritten.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type Json = Record<string, unknown>;

function clean(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length === 0 ? null : s;
}
function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[^\d.\-]/g, ""));
  return Number.isFinite(n) ? n : null;
}
function classLevel(raw: string | null): string | null {
  if (!raw) return null;
  const r = raw.toLowerCase();
  if (r.includes("diaspora") || r.includes("international")) return "diaspora_international_linked";
  if (r.includes("nigeria")) return "nigeria_specific";
  if (r.includes("africa")) return "africa_wide";
  return "needs_verification";
}
function verificationStatus(raw: string | null): string | null {
  if (!raw) return "evidence_required";
  const r = raw.toLowerCase();
  if (r.includes("public") && r.includes("ready")) return "public_display_ready";
  if (r.includes("verified")) return "verified_contribution";
  if (r.includes("needs category")) return "needs_category_verification";
  if (r.includes("needs geography")) return "needs_geography_verification";
  if (r.includes("insufficient")) return "insufficient_evidence";
  if (r.includes("review")) return "under_review";
  return "evidence_required";
}
function priority(raw: string | null): string {
  if (!raw) return "medium";
  const r = raw.toLowerCase();
  if (r.includes("urgent")) return "urgent";
  if (r.includes("high")) return "high";
  if (r.includes("low")) return "low";
  return "medium";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Caller-auth check: must be admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const storagePath: string = body.storage_path || "nrc/NESA_NIG_2026_NRC.xlsx";

    // Download workbook from storage
    const { data: file, error: dlErr } = await supabase
      .storage.from("nominee-media").download(storagePath);
    if (dlErr || !file) {
      return new Response(JSON.stringify({ error: "Workbook not found", path: storagePath, detail: dlErr?.message }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const buf = new Uint8Array(await file.arrayBuffer());
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets["NRC Evidence Matrix"];
    if (!sheet) {
      return new Response(JSON.stringify({ error: "'NRC Evidence Matrix' sheet not found" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const rows = XLSX.utils.sheet_to_json<Json>(sheet, { defval: null });

    // Pre-load existing nominees for name matching
    const { data: existing } = await supabase
      .from("nominees").select("id,name").limit(10000);
    const nameToId = new Map<string, string>();
    (existing ?? []).forEach((n: any) => {
      if (n.name) nameToId.set(n.name.trim().toLowerCase(), n.id);
    });

    const evidenceRows: Json[] = [];
    const sourceRows: Json[] = [];
    const queueRows: Json[] = [];
    const iconRows: Json[] = [];

    for (const r of rows) {
      const nrc_no = num(r["NRC No."]);
      if (!nrc_no) continue;
      const name = clean(r["Nominee Name"]);
      if (!name) continue;
      const nominee_id = nameToId.get(name.toLowerCase()) ?? null;
      const category = clean(r["Award Category"]);
      const subcategory = clean(r["Award Subcategory"]);
      const region = clean(r["NESA 8-Region"]);

      const verification = verificationStatus(clean(r["Verification Status"]));
      const prio = priority(clean(r["Research Priority"]));

      // Place-holder row id we'll let the DB generate; we batch via upsert by nrc_no
      const rowData = {
        nrc_no,
        active_nominee_id: clean(r["Active Nominee ID"]),
        nominee_id,
        nominee_name: name,
        nominee_type: clean(r["Type"]),
        country_base: clean(r["Country / Base in Existing Register"]),
        nesa_region: region,
        nrc_classification_level: classLevel(clean(r["NRC Classification Level"])),
        nigeria_classification_group: clean(r["Nigeria Classification Group"]),
        award_category: category,
        award_subcategory: subcategory,
        education_contribution_summary: clean(r["Education Contribution Summary"]),
        work_description: clean(r["Work Description"]),
        education_impact_area: clean(r["Education Impact Area"]),
        impact_beneficiaries: clean(r["Impact Beneficiaries"]),
        impact_geography: clean(r["Impact Geography"]),
        evidence_strength_score: num(r["Evidence Strength /5"]),
        access_score: num(r["Access /5"]),
        equity_score: num(r["Equity /5"]),
        inclusion_safeguarding_score: num(r["Inclusion & Safeguarding /5"]),
        sustainability_reach_score: num(r["Sustainability & Reach /5"]),
        total_edi_20: num(r["Total EDI /20"]),
        verification_status: verification,
        consent_required: clean(r["Consent Required"]),
        research_priority: prio,
        search_query_pack: clean(r["Search Query Pack"]),
        researcher_note: clean(r["Researcher Note"]),
        public_website_wording: clean(r["Public Website Wording"]),
        original_status: clean(r["Original Status"]),
        source_type: clean(r["Source Type"]),
        original_official_category: clean(r["Original Official Category"]),
        original_legacy_subcategory: clean(r["Original Legacy Subcategory"]),
        public_display_status: "hidden",
      };
      evidenceRows.push(rowData);

      // Explode Ref 1/2/3 → sources (only when a title or url is present)
      for (const i of [1, 2, 3]) {
        const title = clean(r[`Ref ${i} Title`]);
        const url = clean(r[`Ref ${i} URL`]);
        const src = clean(r[`Ref ${i} Source`]);
        if (!title && !url && !src) continue;
        if (title === "Evidence Required") continue;
        sourceRows.push({
          nrc_no_link: nrc_no, // resolved after upsert
          nominee_id,
          reference_no: i,
          source_title: title,
          source_name: src,
          source_url: url,
          source_year: num(r[`Ref ${i} Year`]),
          evidence_type: clean(r[`Ref ${i} Evidence Type`]),
          verification_status: "evidence_required",
        });
      }

      // Research queue when evidence required
      if (verification === "evidence_required" || verification === "under_review") {
        queueRows.push({
          nrc_no_link: nrc_no,
          nominee_id,
          nominee_name: name,
          category,
          subcategory,
          region,
          evidence_need: "Add 2–3 credible source links, source titles, years, and evidence type; then score EDI.",
          search_query_pack: clean(r["Search Query Pack"]),
          researcher_note: clean(r["Researcher Note"]),
          priority: prio,
          status: "pending",
        });
      }

      // Icon classification only for the Africa Education Icon Award family
      if (category && /education icon|lifetime|icon of the decade/i.test(category)) {
        const country = clean(r["Country / Base in Existing Register"]) ?? "";
        let group: string = "needs_verification";
        const lvl = clean(r["NRC Classification Level"])?.toLowerCase() ?? "";
        if (lvl.includes("diaspora")) group = "africans_in_diaspora";
        else if (lvl.includes("friend")) group = "friends_of_africa";
        else if (lvl.includes("africa")) group = "africans_in_africa";
        iconRows.push({
          nominee_id,
          nrc_no_link: nrc_no,
          award_category: category,
          award_subcategory: subcategory,
          icon_classification_group: group,
          country_base: country,
          region_of_impact: region,
          evidence_status: verification,
        });
      }
    }

    // Chunked upserts (500 at a time)
    const chunk = <T,>(a: T[], n: number) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

    let evidenceInserted = 0;
    for (const batch of chunk(evidenceRows, 500)) {
      const { error } = await supabase
        .from("nrc_evidence_rows")
        .upsert(batch, { onConflict: "nrc_no" });
      if (error) throw new Error(`nrc_evidence_rows: ${error.message}`);
      evidenceInserted += batch.length;
    }

    // Resolve nrc_no → row id for sources/queue/icons
    const { data: idMapRows } = await supabase
      .from("nrc_evidence_rows").select("id,nrc_no");
    const nrcToRowId = new Map<number, string>();
    (idMapRows ?? []).forEach((r: any) => nrcToRowId.set(r.nrc_no, r.id));

    let sourcesInserted = 0;
    for (const batch of chunk(sourceRows, 500)) {
      const payload = batch
        .map((s: any) => ({ ...s, nrc_row_id: nrcToRowId.get(s.nrc_no_link), nrc_no_link: undefined }))
        .filter((s: any) => s.nrc_row_id);
      if (payload.length === 0) continue;
      const { error } = await supabase.from("nrc_evidence_sources").insert(payload);
      if (error) throw new Error(`nrc_evidence_sources: ${error.message}`);
      sourcesInserted += payload.length;
    }

    let queueInserted = 0;
    for (const batch of chunk(queueRows, 500)) {
      const payload = batch
        .map((q: any) => ({ ...q, nrc_row_id: nrcToRowId.get(q.nrc_no_link), nrc_no_link: undefined }))
        .filter((q: any) => q.nrc_row_id);
      if (payload.length === 0) continue;
      const { error } = await supabase.from("nrc_research_queue").insert(payload);
      if (error) throw new Error(`nrc_research_queue: ${error.message}`);
      queueInserted += payload.length;
    }

    let iconInserted = 0;
    for (const batch of chunk(iconRows, 500)) {
      const payload = batch
        .map((i: any) => ({ ...i, nrc_row_id: nrcToRowId.get(i.nrc_no_link), nrc_no_link: undefined }))
        .filter((i: any) => i.nrc_row_id);
      if (payload.length === 0) continue;
      const { error } = await supabase.from("nrc_icon_classifications")
        .upsert(payload, { onConflict: "nominee_id,award_subcategory", ignoreDuplicates: true });
      if (!error) iconInserted += payload.length;
    }

    return new Response(JSON.stringify({
      ok: true,
      evidence_rows_upserted: evidenceInserted,
      sources_inserted: sourcesInserted,
      queue_inserted: queueInserted,
      icon_classifications_inserted: iconInserted,
      total_workbook_rows: rows.length,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
