// One-shot import: fetch nominees-2026.json from the nominee-media
// bucket and stage every row into public.nominee_import_staging. After
// the merge step ships the rows into public.nominees, this function and
// the JSON file can be deleted. No request body required.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SOURCE_URL =
  "https://sjghitoydzpirpqjules.supabase.co/storage/v1/object/public/nominee-media/imports/nominees-2026.json";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const res = await fetch(SOURCE_URL);
  if (!res.ok) {
    return new Response(JSON.stringify({ error: `fetch_failed ${res.status}` }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const rows = (await res.json()) as Array<Record<string, unknown>>;
  if (!Array.isArray(rows) || rows.length === 0) {
    return new Response(JSON.stringify({ error: "empty_payload" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const chunkSize = 250;
  let staged = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supa
      .from("nominee_import_staging")
      .upsert(chunk, { onConflict: "record_id" });
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message, staged }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    staged += chunk.length;
  }

  return new Response(JSON.stringify({ staged, total: rows.length }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
