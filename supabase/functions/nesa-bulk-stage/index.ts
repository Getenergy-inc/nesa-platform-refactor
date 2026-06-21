// Bulk-stage rows from the NESA-Africa 2026 nominee master spreadsheet
// into public.nominee_import_staging. Service-role internally so RLS
// stays strict, but the function itself only accepts calls bearing the
// shared NESA_BULK_IMPORT_TOKEN (kept in Lovable Cloud secrets).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-import-token",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = req.headers.get("x-import-token");
  const expected = Deno.env.get("NESA_BULK_IMPORT_TOKEN");
  if (!expected || token !== expected) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { rows?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (rows.length === 0) {
    return new Response(JSON.stringify({ staged: 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const chunkSize = 200;
  let staged = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supa
      .from("nominee_import_staging")
      .upsert(chunk as any, { onConflict: "record_id" });
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message, staged }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    staged += chunk.length;
  }

  return new Response(JSON.stringify({ staged }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
