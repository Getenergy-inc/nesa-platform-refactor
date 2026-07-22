// Webinar RSVP intake — stores registration and queues a confirmation email.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const Schema = z.object({
  webinar_id: z.string().min(1).max(64),
  webinar_title: z.string().min(2).max(200),
  webinar_date: z.string().max(120).optional().default(""),
  webinar_time: z.string().max(80).optional().default(""),
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  organization: z.string().max(200).optional().nullable(),
  country: z.string().max(120).optional().nullable(),
  role: z.string().max(120).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  source: z.string().max(80).optional().default("webinars_page"),
});

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const parsed = Schema.safeParse(payload);
  if (!parsed.success) {
    return json(400, { error: "Validation failed", details: parsed.error.flatten().fieldErrors });
  }
  const body = parsed.data;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Best-effort auth: attach user_id if a valid session accompanies the request
  let user_id: string | null = null;
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const { data } = await supabase.auth.getUser(authHeader.slice(7));
      user_id = data.user?.id ?? null;
    } catch { /* ignore */ }
  }

  const email = body.email.toLowerCase();

  const { data: existing } = await supabase
    .from("webinar_registrations")
    .select("id")
    .eq("webinar_id", body.webinar_id)
    .eq("email", email)
    .maybeSingle();

  let registration_id = existing?.id as string | undefined;
  let alreadyRegistered = Boolean(existing);

  if (!existing) {
    const { data: inserted, error: insertErr } = await supabase
      .from("webinar_registrations")
      .insert({
        webinar_id: body.webinar_id,
        webinar_title: body.webinar_title,
        webinar_date: body.webinar_date,
        webinar_time: body.webinar_time,
        full_name: body.full_name,
        email,
        organization: body.organization ?? null,
        country: body.country ?? null,
        role: body.role ?? null,
        notes: body.notes ?? null,
        source: body.source,
        user_id,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("webinar_registrations insert failed", insertErr);
      return json(500, { error: "Could not save registration" });
    }
    registration_id = inserted.id;
  }

  // Queue confirmation email (drained by send-notifications)
  const origin = req.headers.get("origin") || "https://nesa.africa";
  try {
    await supabase.from("notifications").insert({
      template: "webinar_confirmation",
      subject: `You're registered — ${body.webinar_title}`,
      recipient_email: email,
      channels: ["email"],
      status: "queued",
      payload: {
        full_name: body.full_name,
        webinar_title: body.webinar_title,
        webinar_date: body.webinar_date,
        webinar_time: body.webinar_time,
        registration_id,
        details_url: `${origin}/media/webinars`,
        calendar_url: `${origin}/media/webinars?ics=${body.webinar_id}`,
      },
    });
  } catch (e) {
    console.warn("Failed to enqueue webinar confirmation email:", e);
    // non-fatal — registration is still saved
  }

  return json(200, {
    ok: true,
    already_registered: alreadyRegistered,
    registration_id,
  });
});
