import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header (if present)
    const authHeader = req.headers.get("Authorization");
    let user = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user: authUser } } = await supabase.auth.getUser(token);
      user = authUser;
    }

    const body = await req.json();
    const { action, slug, campaignId } = body;

    // ================================================================
    // GET SPONSOR DATA
    // ================================================================
    if (action === "get") {
      if (!slug) {
        return new Response(JSON.stringify({ ok: false, error: "Missing slug" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Get sponsor
      const { data: sponsor, error: sponsorError } = await supabase
        .from("sponsors")
        .select("*")
        .eq("slug", slug)
        .eq("status", "ACTIVE")
        .single();

      if (sponsorError || !sponsor) {
        return new Response(JSON.stringify({ ok: false, error: "Sponsor not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      // Get active campaign
      const now = new Date().toISOString();
      const { data: campaign } = await supabase
        .from("sponsor_campaigns")
        .select("*")
        .eq("sponsor_id", sponsor.id)
        .eq("status", "ACTIVE")
        .lte("start_at", now)
        .gte("end_at", now)
        .gt("pool_remaining_agc", 0)
        .single();

      return new Response(
        JSON.stringify({
          ok: true,
          sponsor: {
            id: sponsor.id,
            name: sponsor.name,
            slug: sponsor.slug,
            tier: sponsor.tier,
            logo_url: sponsor.logo_url,
            description: sponsor.description,
            website_url: sponsor.website_url,
            cta_links: sponsor.cta_links_json || [],
          },
          campaign: campaign ? {
            id: campaign.id,
            name: campaign.name,
            credit_per_claim_agc: campaign.credit_per_claim_agc,
            pool_remaining_agc: campaign.pool_remaining_agc,
            status: campaign.status,
            start_at: campaign.start_at,
            end_at: campaign.end_at,
          } : null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ================================================================
    // LOG CLICK
    // ================================================================
    if (action === "click") {
      if (!slug) {
        return new Response(JSON.stringify({ ok: false, error: "Missing slug" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Get sponsor and campaign
      const { data: sponsor } = await supabase
        .from("sponsors")
        .select("id")
        .eq("slug", slug)
        .single();

      if (sponsor) {
        const { data: campaign } = await supabase
          .from("sponsor_campaigns")
          .select("id")
          .eq("sponsor_id", sponsor.id)
          .eq("status", "ACTIVE")
          .single();

        // Log click
        await supabase.from("sponsor_clicks").insert({
          campaign_id: campaign?.id || null,
          user_id: user?.id || null,
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ================================================================
    // CHECK EXISTING CLAIM
    // ================================================================
    if (action === "check-claim") {
      if (!user) {
        return new Response(JSON.stringify({ ok: false, error: "Not authenticated" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      if (!campaignId) {
        return new Response(JSON.stringify({ ok: false, error: "Missing campaignId" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      const { data: claim } = await supabase
        .from("sponsor_claims")
        .select("id")
        .eq("campaign_id", campaignId)
        .eq("user_id", user.id)
        .single();

      return new Response(JSON.stringify({ ok: true, claimed: !!claim }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ================================================================
    // CLAIM CREDITS (ATOMIC)
    // ================================================================
    if (action === "claim") {
      if (!user) {
        return new Response(JSON.stringify({ ok: false, error: "Not authenticated" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        });
      }

      if (!slug) {
        return new Response(JSON.stringify({ ok: false, error: "Missing slug" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Get sponsor and active campaign
      const { data: sponsor, error: sponsorError } = await supabase
        .from("sponsors")
        .select("id, name")
        .eq("slug", slug)
        .eq("status", "ACTIVE")
        .single();

      if (sponsorError || !sponsor) {
        return new Response(JSON.stringify({ ok: false, error: "Sponsor not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      const now = new Date().toISOString();
      const { data: campaign, error: campaignError } = await supabase
        .from("sponsor_campaigns")
        .select("*")
        .eq("sponsor_id", sponsor.id)
        .eq("status", "ACTIVE")
        .lte("start_at", now)
        .gte("end_at", now)
        .gt("pool_remaining_agc", 0)
        .single();

      if (campaignError || !campaign) {
        return new Response(JSON.stringify({ ok: false, error: "No active campaign" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Check if already claimed
      const { data: existingClaim } = await supabase
        .from("sponsor_claims")
        .select("id")
        .eq("campaign_id", campaign.id)
        .eq("user_id", user.id)
        .single();

      if (existingClaim) {
        return new Response(JSON.stringify({ ok: false, error: "Already claimed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Check pool has enough
      if (campaign.pool_remaining_agc < campaign.credit_per_claim_agc) {
        return new Response(JSON.stringify({ ok: false, error: "Campaign pool exhausted" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Get user's wallet account
      const { data: walletAccount } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "USER")
        .eq("owner_id", user.id)
        .single();

      if (!walletAccount) {
        return new Response(JSON.stringify({ ok: false, error: "Wallet not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // Decrement campaign pool
      const { error: updateError } = await supabase
        .from("sponsor_campaigns")
        .update({
          pool_remaining_agc: campaign.pool_remaining_agc - campaign.credit_per_claim_agc,
        })
        .eq("id", campaign.id)
        .gte("pool_remaining_agc", campaign.credit_per_claim_agc);

      if (updateError) {
        return new Response(JSON.stringify({ ok: false, error: "Failed to update pool" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      // Insert claim record
      const { error: claimError } = await supabase.from("sponsor_claims").insert({
        campaign_id: campaign.id,
        user_id: user.id,
        amount_agc: campaign.credit_per_claim_agc,
        status: "SUCCESS",
      });

      if (claimError) {
        // Rollback pool update
        await supabase
          .from("sponsor_campaigns")
          .update({
            pool_remaining_agc: campaign.pool_remaining_agc,
          })
          .eq("id", campaign.id);

        return new Response(JSON.stringify({ ok: false, error: "Failed to record claim" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      // Credit wallet
      const { error: ledgerError } = await supabase.from("wallet_ledger_entries").insert({
        account_id: walletAccount.id,
        direction: "CREDIT",
        amount: campaign.credit_per_claim_agc,
        reason: "SPONSOR_PUBLIC_CREDIT",
        source_type: "sponsor_claim",
        source_id: campaign.id,
        metadata: { sponsor_name: sponsor.name, campaign_name: campaign.name },
      });

      if (ledgerError) {
        console.error("Ledger entry failed:", ledgerError);
        // Continue anyway - claim was recorded
      }

      return new Response(
        JSON.stringify({
          ok: true,
          claimed_amount: campaign.credit_per_claim_agc,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ ok: false, error: "Unknown action" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ ok: false, error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
