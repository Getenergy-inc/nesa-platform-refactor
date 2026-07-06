// Native website nomination intake — FULL PIPELINE (public, no login required).
//
// Flow: validate payload -> honeypot/rate-limit -> ensure stage open ->
//   upsert nominator -> resolve subcategory from slug -> dedupe/create nominee
//   -> insert nomination -> generate acceptance token + letter -> queue emails.
//
// Runs with the service role, so it is the single trusted writer for public
// nominations (RLS blocks anonymous direct inserts by design).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const Body = z.object({
  nominator: z.object({
    full_name: z.string().trim().min(2).max(160),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().max(40).optional().default(""),
    country_residence: z.string().trim().max(120).optional().default(""),
    country_origin: z.string().trim().max(120).optional().default(""),
    consent: z.boolean(),
  }),
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
    nominee_email: z.string().trim().email().max(255).optional().or(z.literal("")).nullable(),
    nominee_phone: z.string().trim().max(40).optional().default(""),
    nominee_country: z.string().trim().max(120).optional().default(""),
    nominee_region: z.string().trim().max(120).optional().default(""),
    nominee_city: z.string().trim().max(120).optional().default(""),
    organization: z.string().trim().max(200).optional().default(""),
    website: z.string().trim().max(500).optional().default(""),
    social_links: z.string().trim().max(2000).optional().default(""),
    impact_summary: z.string().trim().min(20).max(4000),
    reason: z.string().trim().min(20).max(4000),
    evidence_links: z.string().trim().max(4000).optional().default(""),
    // Honeypot — must stay empty
    company_website: z.string().max(0).optional(),
  }),
});

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) + `-${Date.now().toString(36)}`
  );
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

  // Honeypot — silently accept but do nothing (bot filled hidden field)
  if (nomination.company_website && nomination.company_website.length > 0) {
    return json(200, { ok: true, skipped: true });
  }
  if (!nominator.consent) {
    return json(400, { error: "Consent is required" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabase = createClient(
    supabaseUrl,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Derive user_id from JWT if the nominator happens to be logged in (optional).
  let userId: string | null = null;
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const { data } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    userId = data.user?.id ?? null;
  }

  // Governance: nominations must be open for the active season.
  const { data: stageOpen } = await supabase.rpc("is_stage_open", { _action: "nominations" });
  if (!stageOpen) {
    return json(403, { error: "Nominations are currently closed." });
  }

  // Active season (all downstream records are scoped to it).
  const { data: season, error: seasonError } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_active", true)
    .single();
  if (seasonError || !season) {
    return json(400, { error: "No active season found." });
  }

  const emailLower = nominator.email.toLowerCase();

  // Upsert nominator by email_lower.
  const { data: existingNominator } = await supabase
    .from("nominators")
    .select("id")
    .eq("email_lower", emailLower)
    .maybeSingle();

  let nominatorId = existingNominator?.id as string | undefined;
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
    if (insErr) { console.error("Nominator insert failed:", insErr); return json(500, { error: "Failed to create nominator" }); }
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

  // Lightweight rate-limit: max 5 nominations per nominator per rolling minute.
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
  const { count: recentCount } = await supabase
    .from("nominations")
    .select("id", { count: "exact", head: true })
    .eq("nominator_id", nominatorId)
    .gte("created_at", oneMinuteAgo);
  if ((recentCount ?? 0) >= 5) {
    return json(429, { error: "Too many nominations submitted. Please wait a moment and try again." });
  }

  // Resolve canonical subcategory (by slug) so the nomination is classified and
  // shows up correctly in NRC / profile / judging. Prefer the subcategory slug,
  // fall back to the category slug. Nulls are tolerated (still stored as strings).
  const slugCandidates = [nomination.award_subcategory_slug, nomination.award_category_slug]
    .map((s) => (s ?? "").trim())
    .filter(Boolean);
  let subcategoryId: string | null = null;
  if (slugCandidates.length > 0) {
    const { data: sub } = await supabase
      .from("subcategories")
      .select("id")
      .in("slug", slugCandidates)
      .limit(1)
      .maybeSingle();
    subcategoryId = sub?.id ?? null;
  }

  const nomineeEmail = (nomination.nominee_email || "").trim() || null;
  const nomineePhone = (nomination.nominee_phone || "").trim() || null;

  // Identity hash for dedup (same person nominated twice => renomination).
  const { data: identityHash } = await supabase.rpc("generate_identity_hash", {
    p_name: nomination.nominee_name,
    p_email: nomineeEmail,
    p_phone: nomineePhone,
    p_country: nomination.nominee_country || null,
  });

  // Build evidence + bio.
  const evidenceUrls = [
    nomination.website,
    ...nomination.social_links.split(/[\s,]+/),
    ...nomination.evidence_links.split(/[\s,]+/),
  ]
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /^https?:\/\//i.test(s));

  const locationLine = [nomination.nominee_city, nomination.nominee_region, nomination.nominee_country]
    .filter(Boolean)
    .join(", ");
  const bio = [nomination.impact_summary, locationLine ? `Location: ${locationLine}` : ""]
    .filter(Boolean)
    .join("\n\n");

  // Dedupe / create nominee.
  const { data: existingNominee } = await supabase
    .from("nominees")
    .select("id, renomination_count")
    .eq("identity_hash", identityHash)
    .eq("season_id", season.id)
    .maybeSingle();

  let nomineeId: string;
  let isNewNominee = false;
  if (existingNominee) {
    nomineeId = existingNominee.id;
    await supabase
      .from("nominees")
      .update({
        renomination_count: (existingNominee.renomination_count ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", nomineeId);
  } else {
    isNewNominee = true;
    const { data: newNominee, error: createError } = await supabase
      .from("nominees")
      .insert({
        name: nomination.nominee_name.trim(),
        slug: slugify(nomination.nominee_name),
        email: nomineeEmail,
        phone: nomineePhone,
        country: nomination.nominee_country || null,
        title: nomination.nominee_type || null,
        organization: nomination.organization || null,
        bio,
        evidence_urls: evidenceUrls,
        subcategory_id: subcategoryId,
        season_id: season.id,
        identity_hash: identityHash,
        renomination_count: 1,
        first_letter_sent: false,
        acceptance_status: "PENDING",
        nominator_user_id: userId,
        status: "pending",
      })
      .select("id")
      .single();
    if (createError) { console.error("Nominee insert failed:", createError); return json(500, { error: "Failed to create nominee" }); }
    nomineeId = newNominee.id;
  }

  // Insert the nomination row (keeps slug metadata AND links to nominee/subcategory).
  const { data: nom, error: nomErr } = await supabase
    .from("nominations")
    .insert({
      nominator_id: nominatorId,
      created_nominee_id: nomineeId,
      season_id: season.id,
      subcategory_id: subcategoryId,
      identity_hash: identityHash,
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
      nominee_name: nomination.nominee_name.trim(),
      nominee_title: nomination.nominee_type || null,
      nominee_organization: nomination.organization || null,
      nominee_bio: bio,
      justification: nomination.reason,
      evidence_urls: evidenceUrls,
      status: "submitted",
    })
    .select("id")
    .single();
  if (nomErr) { console.error("Nomination insert failed:", nomErr); return json(500, { error: "Failed to create nomination" }); }

  // Evidence bundle (best-effort).
  if (evidenceUrls.length > 0) {
    await supabase.from("evidence_bundles").insert({
      nomination_id: nom.id,
      nominee_id: nomineeId,
      file_urls: evidenceUrls,
    }).then(({ error }) => { if (error) console.error("Evidence bundle failed:", error); });
  }

  // Generate acceptance token + letter the first time this nominee is created.
  let acceptanceLinkGenerated = false;
  if (isNewNominee) {
    const acceptanceToken = crypto.randomUUID();
    const tokenExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const publicBase = supabaseUrl.replace(".supabase.co", ".lovable.app");

    const { error: letterError } = await supabase
      .from("acceptance_letters")
      .insert({
        nominee_id: nomineeId,
        token: acceptanceToken,
        token_expires_at: tokenExpiry,
        delivery_channel: nomineeEmail ? "email" : "manual",
      });

    if (!letterError) {
      acceptanceLinkGenerated = true;
      await supabase
        .from("nominees")
        .update({
          first_letter_sent: true,
          acceptance_token: acceptanceToken,
          acceptance_token_expires_at: tokenExpiry,
          acceptance_status: "SENT",
        })
        .eq("id", nomineeId);

      // Only queue an email if we actually have the nominee's address.
      if (nomineeEmail) {
        await supabase.from("notifications").insert({
          recipient_email: nomineeEmail,
          recipient_phone: nomineePhone,
          template: "acceptance_letter",
          subject: "You have been nominated for NESA-Africa 2026",
          payload: {
            nominee_name: nomination.nominee_name,
            accept_url: `${publicBase}/nominee/accept/${acceptanceToken}`,
            decline_url: `${publicBase}/nominee/decline/${acceptanceToken}`,
          },
          channels: ["email"],
          status: "queued",
          idempotency_key: `acceptance_letter_${nomineeId}`,
        });
      }
    } else {
      console.error("Acceptance letter failed:", letterError);
    }
  }

  // Confirmation email to the nominator (best-effort).
  await supabase.from("notifications").insert({
    recipient_email: emailLower,
    template: "nomination_received",
    subject: `Nomination received: ${nomination.nominee_name}`,
    payload: {
      nominator_name: nominator.full_name,
      nominee_name: nomination.nominee_name,
      award_family: nomination.award_family,
      award_category_slug: nomination.award_category_slug,
    },
    channels: ["email"],
    status: "queued",
    idempotency_key: `nomination_received_${nom.id}`,
  }).then(({ error }) => { if (error) console.error("Nominator confirmation failed:", error); });

  return json(200, {
    ok: true,
    nomination_id: nom.id,
    nominee_id: nomineeId,
    nominator_id: nominatorId,
    is_renomination: !isNewNominee,
    acceptance_link_generated: acceptanceLinkGenerated,
  });
});
