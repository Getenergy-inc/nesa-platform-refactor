// Admin bulk import of nominees from a parsed CSV/XLSX upload.
// The client parses the spreadsheet into row objects and POSTs them here;
// all matching, de-duplication and insertion happens server-side.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  buildSlug,
  isPlaceholderName,
  mapRow,
  matchCategory,
  matchSubcategory,
  normaliseRegion,
  normaliseTitle,
  type CategoryLike,
  type SubcategoryLike,
} from "./matching.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface Payload {
  filename?: string;
  rows?: Record<string, unknown>[];
  dry_run?: boolean;
  season_id?: string;
}

interface RowOutcome {
  row_number: number;
  name: string;
  outcome: "inserted" | "review_queue" | "duplicate" | "error";
  reason?: string;
  placeholder?: boolean;
  category?: string;
  subcategory?: string;
  confidence?: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
  const token = authHeader.slice("Bearer ".length);

  const authClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { auth: { persistSession: false } },
  );
  const { data: claims, error: claimsErr } = await authClient.auth.getClaims(token);
  const userId = claims?.claims?.sub as string | undefined;
  if (claimsErr || !userId) return json({ error: "Unauthorized" }, 401);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (isAdmin !== true) return json({ error: "Forbidden" }, 403);

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const rows = Array.isArray(payload.rows) ? payload.rows : [];
  const filename = String(payload.filename || "bulk-upload").slice(0, 200);
  const dryRun = payload.dry_run === true;

  if (rows.length === 0) return json({ error: "No rows supplied" }, 400);
  if (rows.length > 5000) return json({ error: "Maximum 5000 rows per upload" }, 400);

  // Season
  let seasonId = payload.season_id ?? null;
  if (!seasonId) {
    const { data: season } = await admin
      .from("seasons")
      .select("id")
      .eq("is_active", true)
      .maybeSingle();
    seasonId = season?.id ?? null;
  }
  if (!seasonId) return json({ error: "No active season configured" }, 400);

  // Taxonomy
  const [{ data: categories }, { data: subcategories }] = await Promise.all([
    admin.from("categories").select("id, name, slug").eq("is_active", true),
    admin.from("subcategories").select("id, category_id, name, slug").eq("is_active", true),
  ]);
  const cats = (categories ?? []) as CategoryLike[];
  const subs = (subcategories ?? []) as SubcategoryLike[];
  const subsByCategory = new Map<string, SubcategoryLike[]>();
  for (const s of subs) {
    const list = subsByCategory.get(s.category_id) ?? [];
    list.push(s);
    subsByCategory.set(s.category_id, list);
  }

  // Existing names for duplicate detection (this season only)
  const existing = new Map<string, string>(); // `${subcategory_id}|${normalised name}` -> id
  {
    let from = 0;
    const page = 1000;
    for (;;) {
      const { data } = await admin
        .from("nominees")
        .select("id, name, subcategory_id")
        .eq("season_id", seasonId)
        .range(from, from + page - 1);
      if (!data || data.length === 0) break;
      for (const n of data) {
        existing.set(`${n.subcategory_id}|${normaliseTitle(n.name) || String(n.name).toLowerCase()}`, n.id);
      }
      if (data.length < page) break;
      from += page;
    }
  }

  const batchId = crypto.randomUUID();
  const uploadedAt = new Date().toISOString();
  const legacySource = `${filename} (uploaded ${uploadedAt.slice(0, 10)})`;

  const outcomes: RowOutcome[] = [];
  const toInsert: Record<string, unknown>[] = [];
  const toQueue: Record<string, unknown>[] = [];
  const seenInBatch = new Set<string>();

  rows.forEach((raw, index) => {
    const rowNumber = index + 2; // header is row 1 in the source sheet
    const mapped = mapRow(raw);
    const name = mapped.name.trim();

    const queue = (reason: string) => {
      toQueue.push({
        batch_id: batchId,
        source_file: filename,
        row_number: rowNumber,
        raw_row: raw,
        reason,
        suggested_name: name || null,
        suggested_region: mapped.region || null,
        suggested_country: mapped.country || null,
        created_by: userId,
      });
      outcomes.push({ row_number: rowNumber, name: name || "(blank)", outcome: "review_queue", reason });
    };

    if (!name) {
      queue("Missing nominee/organisation name");
      return;
    }

    const region = normaliseRegion(mapped.region);
    const notes: string[] = [];
    const placeholder = isPlaceholderName(name);
    if (placeholder) notes.push("PLACEHOLDER NAME - needs real nominee data");
    if (mapped.region && !region) notes.push(`Unrecognised region value "${mapped.region}"`);

    const catMatch = matchCategory(mapped.category, cats);
    if (!catMatch.match) {
      queue(`No category match for "${mapped.category || "(blank)"}"`);
      return;
    }
    if (!catMatch.confident) {
      notes.push(
        `Low-confidence category match: "${mapped.category}" -> "${catMatch.match.name}" (${catMatch.score.toFixed(2)})`,
      );
    }

    const subMatch = matchSubcategory(
      mapped.subcategory,
      subsByCategory.get(catMatch.match.id) ?? [],
      region,
    );
    if (!subMatch.match) {
      queue(
        `Matched category "${catMatch.match.name}" but no subcategory match for "${mapped.subcategory || "(blank)"}"${region ? ` in ${region}` : ""}`,
      );
      return;
    }
    if (!subMatch.confident) {
      notes.push(
        `Low-confidence subcategory match: "${mapped.subcategory}" -> "${subMatch.match.name}" (${subMatch.score.toFixed(2)})`,
      );
    }

    const dupKey = `${subMatch.match.id}|${normaliseTitle(name) || name.toLowerCase()}`;
    if (existing.has(dupKey) || seenInBatch.has(dupKey)) {
      const reason = `Likely duplicate: "${name}" already exists in "${subMatch.match.name}" for this season`;
      toQueue.push({
        batch_id: batchId,
        source_file: filename,
        row_number: rowNumber,
        raw_row: raw,
        reason,
        suggested_name: name,
        suggested_region: region,
        suggested_country: mapped.country || null,
        status: "duplicate_warning",
        created_by: userId,
      });
      outcomes.push({
        row_number: rowNumber,
        name,
        outcome: "duplicate",
        reason,
        category: catMatch.match.name,
        subcategory: subMatch.match.name,
      });
      return;
    }
    seenInBatch.add(dupKey);

    const additionalEmails = mapped.additional_emails
      ? mapped.additional_emails.split(/[;,\s]+/).filter((e) => e.includes("@"))
      : [];
    if (additionalEmails.length > 0) notes.push(`Additional emails: ${additionalEmails.join(", ")}`);
    if (mapped.source_image) notes.push(`Source image reference: ${mapped.source_image}`);

    toInsert.push({
      subcategory_id: subMatch.match.id,
      season_id: seasonId,
      name,
      slug: buildSlug(name),
      bio: mapped.bio || null,
      country: mapped.country || null,
      region: region,
      email: mapped.email || null,
      phone: mapped.phone || null,
      legacy_source: legacySource,
      data_source: "historical_register_unconfirmed",
      review_notes: notes.length > 0 ? notes.join(" | ") : null,
      // Never publicly visible until the NRC workflow promotes it
      publication_status: "draft",
      status: "pending",
      nrc_verified: false,
      legacy_ids: [
        {
          batch_id: batchId,
          source_file: filename,
          row_number: rowNumber,
          source_image_path: mapped.source_image || null,
          additional_emails: additionalEmails,
        },
      ],
    });

    outcomes.push({
      row_number: rowNumber,
      name,
      outcome: "inserted",
      placeholder,
      category: catMatch.match.name,
      subcategory: subMatch.match.name,
      confidence: Math.min(catMatch.score, subMatch.score),
      reason: notes.length > 0 ? notes.join(" | ") : undefined,
    });
  });

  let insertedCount = 0;
  const errors: { row_number?: number; message: string }[] = [];

  if (!dryRun) {
    const chunk = 200;
    for (let i = 0; i < toInsert.length; i += chunk) {
      const slice = toInsert.slice(i, i + chunk);
      const { data, error } = await admin.from("nominees").insert(slice).select("id");
      if (error) {
        // fall back to per-row inserts so one bad row cannot fail the batch
        for (const row of slice) {
          const { error: rowErr } = await admin.from("nominees").insert(row);
          if (rowErr) {
            errors.push({ message: `${row.name}: ${rowErr.message}` });
            toQueue.push({
              batch_id: batchId,
              source_file: filename,
              raw_row: row,
              reason: `Insert failed: ${rowErr.message}`,
              suggested_name: row.name as string,
              created_by: userId,
            });
          } else {
            insertedCount += 1;
          }
        }
      } else {
        insertedCount += data?.length ?? slice.length;
      }
    }

    if (toQueue.length > 0) {
      const { error: queueErr } = await admin.from("import_review_queue").insert(toQueue);
      if (queueErr) errors.push({ message: `Review queue insert failed: ${queueErr.message}` });
    }
  }

  const placeholders = outcomes.filter((o) => o.outcome === "inserted" && o.placeholder);
  const queued = outcomes.filter((o) => o.outcome === "review_queue");
  const duplicates = outcomes.filter((o) => o.outcome === "duplicate");

  return json({
    ok: true,
    dry_run: dryRun,
    batch_id: batchId,
    filename,
    season_id: seasonId,
    summary: {
      rows_received: rows.length,
      inserted: dryRun ? toInsert.length : insertedCount,
      review_queue: queued.length,
      duplicates: duplicates.length,
      placeholders: placeholders.length,
      errors: errors.length,
    },
    review_queue: queued.map((q) => ({ row_number: q.row_number, name: q.name, reason: q.reason })),
    duplicates: duplicates.map((d) => ({ row_number: d.row_number, name: d.name, reason: d.reason })),
    placeholders: placeholders.map((p) => ({ row_number: p.row_number, name: p.name })),
    low_confidence: outcomes
      .filter((o) => o.outcome === "inserted" && o.reason)
      .map((o) => ({ row_number: o.row_number, name: o.name, note: o.reason })),
    errors,
  });
});
