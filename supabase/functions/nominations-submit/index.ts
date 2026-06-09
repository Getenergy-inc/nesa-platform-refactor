// Native website nomination intake.
// Validates payload, upserts nominator, inserts a nomination row with
// source_channel='website_official', publication_status='under_review'.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const Body = z.object({
  // Nominator
  nominator: z.object({
    full_name: z.string().trim().min(2).max(160),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().max(40).optional().default(""),
    country_residence: z.string().trim().max(120).optional().default(""),
    country_origin: z.string().trim().max(120).optional().default(""),
    consent: z.boolean(),
  }),
  // Nomination
  nomination: z.object({
    award_family: z.string().trim().min(1).max(80),
    award_category_slug: z.string().trim().min(1).max(120),
    award_subcategory_slug: z.string().trim().max(120).optional().nullable(),
    recognition_class: z.string().trim().max(60).optional().nullable(),
    region_slug: z.string().trim().max(80).optional().nullable(),
    zone_slug: z.string().trim().max(80).optional().nullable(),
    state_slug: z.string().trim().max(80).optional().nullable(),
    nominee_name: z.string().trim().min(2).max(200),
    nominee_type: z.string().trim().max(40).optional().default("individual"),
    nominee_country: z.string().trim().max(120).optional().default(""),
    nominee_region: z.string().trim().max(120).optional().default(""),
    nominee_city: z.string().trim().max(120).optional().default(""),
    organization: z.string().trim().max(200).optional().default(""),
    website: z.string().trim().max(500).optional().default(""),
    social_links: z.string().trim().max(2000).optional().default(""),
    impact_summary: z.string().trim().min(20).max(4000),
    reason: z.string().trim().min(20).max(4000),
    evidence_links: z.string().trim().max(4000).optional().default(""),
    // Honeypot
    company_website: z.string().max(0).optional(),
  }),
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
    return json(400, { error: "Invalid JSON" });
  }

  const parsed = Body.safeParse(payload);
  if (!parsed.success) {
    return json(400, { error: "Validation failed", details: parsed.error.flatten() });
  }
  const { nominator, nomination } = parsed.data;

  // Honeypot — silently accept but do nothing
  if (nomination.company_website && nomination.company_website.length > 0) {
    return json(200, { ok: true, skipped: true });
  }
  if (!nominator.consent) {
    return json(400, { error: "Consent is required" });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Optional: derive user_id from JWT if present
  let userId: string | null = null;
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const { data } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    userId = data.user?.id ?? null;
  }

  const emailLower = nominator.email.toLowerCase();

  // Upsert nominator by email_lower
  const { data: existing } = await supabase
    .from("nominators")
    .select("id")
    .eq("email_lower", emailLower)
    .maybeSingle();

  let nominatorId = existing?.id as string | undefined;
  if (!nominatorId) {
    const { data: inserted, error: insErr } = await supabase
      .from("nominators")
      .insert({
        full_name: nominator.full_name,
        email_lower: emailLower,
        phone_raw: nominator.phone || null,
        country_residence: nominator.country_residence || null,
        country_origin: nominator.country_origin || null,
        consent: nominator.consent,
        user_id: userId,
      })
      .select("id")
      .single();
    if (insErr) return json(500, { error: "Failed to create nominator", details: insErr.message });
    nominatorId = inserted.id;
  } else {
    await supabase
      .from("nominators")
      .update({
        full_name: nominator.full_name,
        phone_raw: nominator.phone || null,
        country_residence: nominator.country_residence || null,
        country_origin: nominator.country_origin || null,
        consent: nominator.consent,
        ...(userId ? { user_id: userId } : {}),
      })
      .eq("id", nominatorId);
  }

  // Build evidence_urls array from website + social + evidence_links (comma/newline separated)
  const evidenceUrls = [
    nomination.website,
    ...nomination.social_links.split(/[\s,]+/),
    ...nomination.evidence_links.split(/[\s,]+/),
  ]
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /^https?:\/\//i.test(s));

  const bioParts = [
    nomination.impact_summary,
    nomination.nominee_city || nomination.nominee_region || nomination.nominee_country
      ? `Location: ${[nomination.nominee_city, nomination.nominee_region, nomination.nominee_country].filter(Boolean).join(", ")}`
      : "",
  ].filter(Boolean);

  const { data: nom, error: nomErr } = await supabase
    .from("nominations")
    .insert({
      nominator_id: nominatorId,
      source: "website",
      source_channel: "website_official",
      submission_kind: "official_nomination",
      publication_status: "under_review",
      workflow_status: "SUBMITTED",
      award_family: nomination.award_family,
      award_category_slug: nomination.award_category_slug,
      award_subcategory_slug: nomination.award_subcategory_slug ?? null,
      recognition_class: nomination.recognition_class ?? null,
      region_slug: nomination.region_slug ?? null,
      zone_slug: nomination.zone_slug ?? null,
      state_slug: nomination.state_slug ?? null,
      nominee_name: nomination.nominee_name,
      nominee_title: nomination.nominee_type,
      nominee_organization: nomination.organization || null,
      nominee_bio: bioParts.join("\n\n"),
      justification: nomination.reason,
      evidence_urls: evidenceUrls,
      status: "submitted",
    })
    .select("id")
    .single();

  if (nomErr) return json(500, { error: "Failed to create nomination", details: nomErr.message });

  await supabase.from("notification_logs").insert({
    channel: "system",
    event_type: "nomination_submitted",
    recipient: emailLower,
    subject: `Official nomination received: ${nomination.nominee_name}`,
    status: "queued",
    metadata: {
      nomination_id: nom.id,
      award_family: nomination.award_family,
      award_category_slug: nomination.award_category_slug,
    },
  });

  return json(200, { ok: true, nomination_id: nom.id, nominator_id: nominatorId });
});
