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
import { validateEDIRatings } from "../_shared/ediMatrixRegistry.ts";

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
    social_links: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    impact_summary: z.string().trim().min(20).max(4000),
    reason: z.string().trim().min(20).max(4000),
    evidence_links: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    // Honeypot — must stay empty
    company_website: z.string().max(0).optional(),
  }),
  // Optional structured EDI submission. When present it is strictly validated
  // against the resolved category-specific EDI matrix (see _shared/ediMatrixRegistry.ts).
  edi: z
    .object({
      tier: z.string().trim().min(1).max(80),
      category: z.string().trim().min(1).max(120),
      pathway: z.string().trim().max(120).optional().nullable(),
      version: z.string().trim().max(60).optional().nullable(),
      ratings: z.record(z.string(), z.string()),
    })
    .optional(),
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

// ---- Africa Education Icon Lifetime Achievement Award (2006–2026) quotas ----
// Single source of truth mirrored in src/config/nomination/iconTaxonomy.ts.
// Each nominator may submit at most 1 nomination per (category × nominee_type),
// i.e. a maximum of 3 categories × 3 nominee types = 9 icon nominations total.
const ICON_CATEGORY_SLUGS = new Set([
  "literary-new-curriculum-advocate-icon-of-the-decade",
  "africa-technical-educator-icon-of-the-decade",
  "africa-education-philanthropy-icon-of-the-decade",
]);
const ICON_NOMINEE_TYPES = new Set([
  "africans in africa",
  "diaspora africans",
  "friends of africa",
]);
const ICON_MAX_TOTAL = 9;

function isIconFamily(family: string, categorySlug: string): boolean {
  if (ICON_CATEGORY_SLUGS.has(categorySlug)) return true;
  return /icon|lifetime|legend/i.test(family);
}
function normType(v: string): string {
  return v.trim().toLowerCase().replace(/\s+/g, " ");
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
  const { nominator, nomination, edi } = parsed.data;

  // Honeypot — silently accept but do nothing (bot filled hidden field)
  if (nomination.company_website && nomination.company_website.length > 0) {
    return json(200, { ok: true, skipped: true });
  }
  if (!nominator.consent) {
    return json(400, { error: "Consent is required" });
  }

  // Strict server-side EDI validation. Ratings must match the resolved
  // category-specific matrix — no extra slots, no missing slots, allowed values only.
  let ediValidated: { matrixKey: string; matrixVersion: string; ratings: Record<string, string> } | null = null;
  if (edi) {
    const result = validateEDIRatings({
      tier: edi.tier,
      category: edi.category,
      pathway: edi.pathway ?? null,
      version: edi.version ?? null,
      ratings: edi.ratings,
    });
    if (!result.ok) return json(400, { error: result.error });
    ediValidated = {
      matrixKey: result.matrixKey,
      matrixVersion: result.matrixVersion,
      ratings: result.ratings,
    };
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
        consent_given: nominator.consent,
        consent_at: nominator.consent ? new Date().toISOString() : null,
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
        consent_given: nominator.consent,
        consent_at: nominator.consent ? new Date().toISOString() : null,
        ...(userId ? { user_id: userId } : {}),
      })
      .eq("id", nominatorId);
  }

  // Africa Education Icon Lifetime Achievement Award (2006–2026) — enforce
  // 3 categories × 3 nominee types = max 9 icon nominations per nominator,
  // with unique (category, nominee_type) slots.
  if (isIconFamily(nomination.award_family, nomination.award_category_slug)) {
    if (!ICON_CATEGORY_SLUGS.has(nomination.award_category_slug)) {
      return json(400, {
        error:
          "For the Africa Education Icon Lifetime Achievement Award, category must be one of: Literary & New Curriculum Advocate Icon of the Decade, Africa Technical Educator Icon of the Decade, Africa Education Philanthropy Icon of the Decade.",
      });
    }
    const nomineeTypeNorm = normType(nomination.nominee_type || "");
    if (!ICON_NOMINEE_TYPES.has(nomineeTypeNorm)) {
      return json(400, {
        error:
          "Nominee type must be one of: Africans in Africa, Diaspora Africans, Friends of Africa.",
      });
    }

    const { data: existingIcon } = await supabase
      .from("nominations")
      .select("id, award_family, award_category_slug, nominee_title")
      .eq("nominator_id", nominatorId)
      .eq("season_id", season.id);

    const iconRows = (existingIcon ?? []).filter((r) =>
      isIconFamily(String(r.award_family ?? ""), String(r.award_category_slug ?? "")),
    );

    if (iconRows.length >= ICON_MAX_TOTAL) {
      return json(409, {
        error: `You have reached the maximum of ${ICON_MAX_TOTAL} Africa Education Icon nominations (3 categories × 3 nominee types).`,
      });
    }

    const duplicateSlot = iconRows.some(
      (r) =>
        String(r.award_category_slug ?? "") === nomination.award_category_slug &&
        normType(String(r.nominee_title ?? "")) === nomineeTypeNorm,
    );
    if (duplicateSlot) {
      return json(409, {
        error: `You have already nominated someone for "${nomination.award_category_slug}" as "${nomination.nominee_type}". Each nominator may submit only 1 nominee per category × nominee type.`,
      });
    }
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
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  let subcategoryId: string | null = null;
  if (slugCandidates.length > 0) {
    // Match by exact slug OR by slugified name, so both the DB canonical slugs
    // (e.g. "icon-philanthropy") and the form/config slugs (the slugified
    // category name, e.g. "africa-education-philanthropy-icon-of-the-decade")
    // resolve to the same subcategory.
    const targets = new Set(slugCandidates.map(norm));
    const { data: subs } = await supabase
      .from("subcategories")
      .select("id, name, slug")
      .limit(2000);
    const match = (subs ?? []).find(
      (su: { id: string; name: string; slug: string }) =>
        targets.has(norm(su.slug)) || targets.has(norm(su.name)),
    );
    subcategoryId = match?.id ?? null;
  }

  // subcategory_id is NOT NULL on both nominees and nominations — fail clearly
  // (400) rather than 500 if the slug does not map to a known subcategory.
  if (!subcategoryId) {
    return json(400, {
      error: `Unknown award category "${slugCandidates.join('" / "')}". Nomination not saved.`,
    });
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

  // Link fields may arrive as a string or a string[] (different forms).
  const toTokens = (v: string | string[] | null | undefined): string[] =>
    Array.isArray(v) ? v : (v ?? "").split(/[\s,]+/);

  // Build evidence + bio.
  const evidenceUrls = [
    nomination.website,
    ...toTokens(nomination.social_links),
    ...toTokens(nomination.evidence_links),
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
    // Derive Influencer Education Impact recognition pathway from the subcategory slug.
    const subSlug = (nomination.award_subcategory_slug || nomination.award_category_slug || "").toLowerCase();
    let recognitionPathway: "social_media" | "sports" | "music" | null = null;
    if (subSlug.startsWith("africa-social-media")) recognitionPathway = "social_media";
    else if (subSlug.startsWith("africa-sports")) recognitionPathway = "sports";
    else if (subSlug.startsWith("africa-music")) recognitionPathway = "music";

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
        recognition_pathway: recognitionPathway,
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
      source: "PUBLIC",
      source_channel: "website",
      submission_kind: "official_nomination",
      publication_status: "queued",
      workflow_status: "SUBMITTED_PENDING_ACCEPTANCE",
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
      status: "pending",
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
    // Public site domain for acceptance links. Defaults to the production
    // domain (nesa.africa); override with the PUBLIC_SITE_URL secret if needed
    // (e.g. to point at a preview deployment while testing).
    const publicBase = (Deno.env.get("PUBLIC_SITE_URL") || "https://nesa.africa").replace(/\/+$/, "");

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

  // Option A: fire the email dispatcher so the acceptance + confirmation emails
  // go out right after the nominee is created. Runs as a background task on the
  // Supabase runtime so it does not delay this response.
  const svcKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const dispatch = fetch(`${supabaseUrl}/functions/v1/send-notifications`, {
    method: "POST",
    headers: { Authorization: `Bearer ${svcKey}`, apikey: svcKey },
  }).catch((e) => console.error("send-notifications dispatch failed:", e));
  const rt = (globalThis as { EdgeRuntime?: { waitUntil?: (p: Promise<unknown>) => void } }).EdgeRuntime;
  if (rt?.waitUntil) rt.waitUntil(dispatch);
  else await dispatch;

  return json(200, {
    ok: true,
    nomination_id: nom.id,
    nominee_id: nomineeId,
    nominator_id: nominatorId,
    is_renomination: !isNewNominee,
    acceptance_link_generated: acceptanceLinkGenerated,
  });
});
