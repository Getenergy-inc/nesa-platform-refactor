import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NominationPayload {
  nominee_name: string;
  nominee_email?: string;
  nominee_phone?: string;
  nominee_country?: string;
  nominee_title?: string;
  nominee_organization?: string;
  nominee_bio?: string;
  nominee_photo_url?: string;
  nominee_logo_url?: string;
  subcategory_id: string;
  justification: string;
  evidence_urls?: string[];
  source?: "START_MEMBER" | "NRC" | "PUBLIC";
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const path = url.pathname.replace("/nominations", "");

    // ===========================================
    // POST /nominations - Submit new nomination
    // ===========================================
    if (req.method === "POST" && (path === "" || path === "/")) {
      // Verify authorization
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !userData.user) {
        return new Response(
          JSON.stringify({ error: "Invalid token" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if nominations stage is open
      const { data: stageOpen } = await supabase.rpc("is_stage_open", { _action: "nominations" });
      if (!stageOpen) {
        return new Response(
          JSON.stringify({ error: "Nominations are currently closed" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const payload: NominationPayload = await req.json();

      // Validate required fields
      if (!payload.nominee_name?.trim() || !payload.subcategory_id || !payload.justification?.trim()) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: nominee_name, subcategory_id, justification" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get current season
      const { data: season, error: seasonError } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .single();

      if (seasonError || !season) {
        return new Response(
          JSON.stringify({ error: "No active season found" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate identity hash for deduplication
      const { data: identityHash } = await supabase.rpc("generate_identity_hash", {
        p_name: payload.nominee_name,
        p_email: payload.nominee_email || null,
        p_phone: payload.nominee_phone || null,
        p_country: payload.nominee_country || null,
      });

      // Check if nominee already exists (deduplication)
      const { data: existingNominee } = await supabase
        .from("nominees")
        .select("id, first_letter_sent, renomination_count, acceptance_status")
        .eq("identity_hash", identityHash)
        .eq("season_id", season.id)
        .maybeSingle();

      let nomineeId: string;
      let isNewNominee = false;
      let firstLetterNeeded = false;

      if (existingNominee) {
        // Nominee exists - increment renomination count
        nomineeId = existingNominee.id;
        
        const { error: updateError } = await supabase
          .from("nominees")
          .update({ 
            renomination_count: existingNominee.renomination_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq("id", nomineeId);

        if (updateError) throw updateError;

        // Log the renomination
        await supabase.from("audit_events").insert({
          actor_id: userData.user.id,
          action: "renomination",
          entity_type: "nominee",
          entity_id: nomineeId,
          metadata: { 
            old_count: existingNominee.renomination_count,
            new_count: existingNominee.renomination_count + 1,
            source: payload.source || "PUBLIC"
          },
        });

      } else {
        // Create new nominee profile
        isNewNominee = true;
        const slug = payload.nominee_name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim() + `-${Date.now()}`;

        const { data: newNominee, error: createError } = await supabase
          .from("nominees")
          .insert({
            name: payload.nominee_name.trim(),
            slug,
            email: payload.nominee_email || null,
            phone: payload.nominee_phone || null,
            country: payload.nominee_country || null,
            title: payload.nominee_title || null,
            organization: payload.nominee_organization || null,
            bio: payload.nominee_bio || null,
            photo_url: payload.nominee_photo_url || null,
            logo_url: payload.nominee_logo_url || null,
            evidence_urls: payload.evidence_urls || [],
            subcategory_id: payload.subcategory_id,
            season_id: season.id,
            identity_hash: identityHash,
            renomination_count: 1,
            first_letter_sent: false,
            acceptance_status: "PENDING",
            nominator_user_id: userData.user.id,
            status: "pending",
          })
          .select("id")
          .single();

        if (createError) throw createError;
        nomineeId = newNominee.id;
        firstLetterNeeded = true;

        // Create wallet account for nominee (non-custodial)
        await supabase.from("wallet_accounts").insert({
          owner_type: "USER",
          owner_id: userData.user.id, // Associated with nominator initially
        });

        // Log new nominee creation
        await supabase.from("audit_events").insert({
          actor_id: userData.user.id,
          action: "nominee_created",
          entity_type: "nominee",
          entity_id: nomineeId,
          metadata: { 
            name: payload.nominee_name,
            source: payload.source || "PUBLIC",
            subcategory_id: payload.subcategory_id
          },
        });
      }

      // Create nomination record (regardless of dedup)
      const { data: nomination, error: nomError } = await supabase
        .from("nominations")
        .insert({
          season_id: season.id,
          subcategory_id: payload.subcategory_id,
          nominee_name: payload.nominee_name.trim(),
          nominee_title: payload.nominee_title || null,
          nominee_organization: payload.nominee_organization || null,
          nominee_bio: payload.nominee_bio || null,
          nominee_photo_url: payload.nominee_photo_url || null,
          evidence_urls: payload.evidence_urls || [],
          justification: payload.justification.trim(),
          nominator_id: userData.user.id,
          source: payload.source || "PUBLIC",
          identity_hash: identityHash,
          created_nominee_id: nomineeId,
          status: "pending",
        })
        .select("id")
        .single();

      if (nomError) throw nomError;

      // Create evidence bundle if files provided
      if (payload.evidence_urls && payload.evidence_urls.length > 0) {
        await supabase.from("evidence_bundles").insert({
          nomination_id: nomination.id,
          nominee_id: nomineeId,
          file_urls: payload.evidence_urls,
          uploaded_by: userData.user.id,
        });
      }

      // Queue acceptance letter notification (idempotent - only if not sent)
      if (firstLetterNeeded) {
        const acceptanceToken = crypto.randomUUID();
        const tokenExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

        // Create acceptance letter record
        const { error: letterError } = await supabase
          .from("acceptance_letters")
          .insert({
            nominee_id: nomineeId,
            token: acceptanceToken,
            token_expires_at: tokenExpiry.toISOString(),
            delivery_channel: payload.nominee_email ? "email" : "sms",
          });

        if (!letterError) {
          // Update nominee with acceptance token
          await supabase
            .from("nominees")
            .update({
              first_letter_sent: true,
              acceptance_token: acceptanceToken,
              acceptance_token_expires_at: tokenExpiry.toISOString(),
              acceptance_status: "SENT",
            })
            .eq("id", nomineeId);

          // Queue notification
          await supabase.from("notifications").insert({
            recipient_email: payload.nominee_email || null,
            recipient_phone: payload.nominee_phone || null,
            template: "acceptance_letter",
            subject: "You've Been Nominated for NESA-Africa 2025!",
            payload: {
              nominee_name: payload.nominee_name,
              accept_url: `${supabaseUrl.replace('.supabase.co', '.lovable.app')}/nominee/accept/${acceptanceToken}`,
              decline_url: `${supabaseUrl.replace('.supabase.co', '.lovable.app')}/nominee/decline/${acceptanceToken}`,
            },
            channels: payload.nominee_email ? ["email"] : ["sms"],
            idempotency_key: `acceptance_letter_${nomineeId}`,
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          nomination_id: nomination.id,
          nominee_id: nomineeId,
          is_renomination: !isNewNominee,
          first_letter_sent: firstLetterNeeded,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===========================================
    // POST /nominations/accept - Nominee accepts
    // ===========================================
    if (req.method === "POST" && path === "/accept") {
      const { token } = await req.json();

      if (!token) {
        return new Response(
          JSON.stringify({ error: "Token required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Find nominee by acceptance token
      const { data: nominee, error: findError } = await supabase
        .from("nominees")
        .select("id, name, acceptance_token_expires_at, acceptance_status, renomination_count, subcategory_id, season_id")
        .eq("acceptance_token", token)
        .maybeSingle();

      if (findError || !nominee) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired token" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check token expiry
      if (nominee.acceptance_token_expires_at && new Date(nominee.acceptance_token_expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: "Token has expired" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if already accepted/declined
      if (nominee.acceptance_status === "ACCEPTED" || nominee.acceptance_status === "DECLINED") {
        return new Response(
          JSON.stringify({ error: `Nomination already ${nominee.acceptance_status.toLowerCase()}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update nominee to ACCEPTED
      const { error: updateError } = await supabase
        .from("nominees")
        .update({
          acceptance_status: "ACCEPTED",
          accepted_at: new Date().toISOString(),
          status: "approved", // Progress to approved since they accepted
        })
        .eq("id", nominee.id);

      if (updateError) throw updateError;

      // Update acceptance letter record
      await supabase
        .from("acceptance_letters")
        .update({
          responded_at: new Date().toISOString(),
          response: "ACCEPTED",
        })
        .eq("nominee_id", nominee.id);

      // Issue Platinum Certificate (download locked until 200 renominations)
      const verificationCode = `NESA-PL-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
      const verificationHash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(verificationCode)
      ).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));
      
      const serialNumber = `NESA-${new Date().getFullYear()}-PL-${String(Date.now()).slice(-8)}`;
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

      const { data: certificate, error: certError } = await supabase
        .from("certificates")
        .insert({
          nominee_id: nominee.id,
          season_id: nominee.season_id,
          tier: "platinum",
          verification_code: verificationCode,
          verification_hash: verificationHash.slice(0, 32),
          serial_number: serialNumber,
          is_lifetime: false,
          expires_at: expiresAt.toISOString(),
          download_locked: nominee.renomination_count < 200,
          status: "ACTIVE",
        })
        .select("id")
        .single();

      if (certError) throw certError;

      // Log acceptance and certificate issuance
      await supabase.from("audit_events").insert([
        {
          action: "nominee_accepted",
          entity_type: "nominee",
          entity_id: nominee.id,
          metadata: { name: nominee.name },
        },
        {
          action: "certificate_issued",
          entity_type: "certificate",
          entity_id: certificate.id,
          metadata: { 
            tier: "platinum",
            download_locked: nominee.renomination_count < 200,
            serial_number: serialNumber
          },
        },
      ]);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Nomination accepted successfully",
          certificate_issued: true,
          certificate_download_locked: nominee.renomination_count < 200,
          renominations_needed: Math.max(0, 200 - nominee.renomination_count),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===========================================
    // POST /nominations/decline - Nominee declines
    // ===========================================
    if (req.method === "POST" && path === "/decline") {
      const { token, reason } = await req.json();

      if (!token) {
        return new Response(
          JSON.stringify({ error: "Token required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Find nominee by acceptance token
      const { data: nominee } = await supabase
        .from("nominees")
        .select("id, name, acceptance_status")
        .eq("acceptance_token", token)
        .maybeSingle();

      if (!nominee) {
        return new Response(
          JSON.stringify({ error: "Invalid token" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update nominee to DECLINED
      const { error: updateError } = await supabase
        .from("nominees")
        .update({
          acceptance_status: "DECLINED",
          status: "rejected", // Halt progression
        })
        .eq("id", nominee.id);

      if (updateError) throw updateError;

      // Update acceptance letter record
      await supabase
        .from("acceptance_letters")
        .update({
          responded_at: new Date().toISOString(),
          response: "DECLINED",
        })
        .eq("nominee_id", nominee.id);

      // Log decline
      await supabase.from("audit_events").insert({
        action: "nominee_declined",
        entity_type: "nominee",
        entity_id: nominee.id,
        metadata: { name: nominee.name, reason },
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Nomination declined",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===========================================
    // GET /nominations/status/:nomineeId
    // ===========================================
    if (req.method === "GET" && path.startsWith("/status/")) {
      const nomineeId = path.replace("/status/", "");

      const { data: nominee, error } = await supabase
        .from("nominees")
        .select(`
          id, name, slug, acceptance_status, renomination_count, nrc_verified,
          certificates(id, tier, download_locked, status, verification_code)
        `)
        .eq("id", nomineeId)
        .maybeSingle();

      if (error || !nominee) {
        return new Response(
          JSON.stringify({ error: "Nominee not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          nominee_id: nominee.id,
          name: nominee.name,
          slug: nominee.slug,
          acceptance_status: nominee.acceptance_status,
          renomination_count: nominee.renomination_count,
          nrc_verified: nominee.nrc_verified,
          certificate: nominee.certificates?.[0] || null,
          progress_to_unlock: nominee.renomination_count >= 200 ? 100 : Math.round((nominee.renomination_count / 200) * 100),
          renominations_needed: Math.max(0, 200 - nominee.renomination_count),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Nominations API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
