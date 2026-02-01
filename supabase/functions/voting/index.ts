import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const path = url.pathname.replace("/voting", "");

    // GET /voting/eligibility - Check voting eligibility (public)
    if (req.method === "GET" && path === "/eligibility") {
      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .maybeSingle();

      if (!season) {
        return new Response(
          JSON.stringify({
            canVote: false,
            reason: "No active season",
            stagesOpen: {},
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: stages } = await supabase
        .from("stage_config")
        .select("action, is_open, opens_at, closes_at")
        .eq("season_id", season.id);

      const stagesOpen: Record<string, boolean> = {};
      for (const stage of stages || []) {
        stagesOpen[stage.action] = stage.is_open || false;
      }

      const authHeader = req.headers.get("Authorization");
      let userId: string | null = null;
      
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabase.auth.getUser(token);
        userId = userData.user?.id || null;
      }

      if (!userId) {
        return new Response(
          JSON.stringify({
            canVote: false,
            reason: "Authentication required",
            stagesOpen,
            authenticated: false,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const publicVotingOpen = stagesOpen["public_voting"] || false;

      return new Response(
        JSON.stringify({
          canVote: publicVotingOpen,
          reason: publicVotingOpen ? null : "Public voting is not currently open",
          stagesOpen,
          authenticated: true,
          userId,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /voting/balance - Get user's AGC balance for voting
    if (req.method === "GET" && path === "/balance") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
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

      // Ensure user has wallet
      const { data: accountId } = await supabase.rpc("ensure_user_wallet", {
        _user_id: userData.user.id,
      });

      // Get balance
      const { data: balance } = await supabase.rpc("get_user_wallet_balance", {
        _user_id: userData.user.id,
      });

      const walletBalance = balance?.[0] || { account_id: accountId, balance_agcc: 0, balance_agc: 0 };

      return new Response(
        JSON.stringify({
          accountId: walletBalance.account_id,
          balanceAgcc: walletBalance.balance_agcc || 0,
          balanceAgc: Number(walletBalance.balance_agc) || 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /voting/tally - Get public vote tallies (public, stage-gated)
    if (req.method === "GET" && path === "/tally") {
      const categorySlug = url.searchParams.get("category");
      const subcategoryId = url.searchParams.get("subcategory");

      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .maybeSingle();

      if (!season) {
        return new Response(
          JSON.stringify({ error: "No active season", data: [] }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let query = supabase
        .from("nominees")
        .select(`
          id,
          name,
          slug,
          organization,
          photo_url,
          public_votes,
          is_platinum,
          subcategory_id,
          subcategories!inner(
            id,
            name,
            slug,
            categories!inner(id, name, slug)
          )
        `)
        .eq("season_id", season.id)
        .in("status", ["approved", "platinum"])
        .order("public_votes", { ascending: false });

      if (subcategoryId) {
        query = query.eq("subcategory_id", subcategoryId);
      }

      if (categorySlug) {
        query = query.eq("subcategories.categories.slug", categorySlug);
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;

      const tally: Record<string, any> = {};
      
      for (const nominee of data || []) {
        const cat = (nominee.subcategories as any)?.categories;
        if (!cat) continue;

        if (!tally[cat.slug]) {
          tally[cat.slug] = {
            categoryId: cat.id,
            categoryName: cat.name,
            categorySlug: cat.slug,
            totalVotes: 0,
            nominees: [],
          };
        }

        tally[cat.slug].totalVotes += nominee.public_votes || 0;
        tally[cat.slug].nominees.push({
          id: nominee.id,
          name: nominee.name,
          slug: nominee.slug,
          organization: nominee.organization,
          photoUrl: nominee.photo_url,
          votes: nominee.public_votes || 0,
          isPlatinum: nominee.is_platinum,
          subcategoryId: nominee.subcategory_id,
          subcategoryName: (nominee.subcategories as any)?.name,
        });
      }

      return new Response(
        JSON.stringify({
          seasonId: season.id,
          data: Object.values(tally),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /voting/my-votes - Get user's vote history
    if (req.method === "GET" && (path === "/me" || path === "/my-votes")) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
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

      const { data, error } = await supabase
        .from("votes")
        .select(`
          id,
          vote_type,
          score,
          created_at,
          nominees(id, name, slug, photo_url),
          seasons(id, name, year)
        `)
        .eq("voter_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({
          data: (data || []).map((v: any) => ({
            id: v.id,
            voteType: v.vote_type,
            score: v.score,
            createdAt: v.created_at,
            nominee: v.nominees,
            season: v.seasons,
          })),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /voting/vote - Cast a vote (authenticated, stage-gated, AGC-deducted)
    if (req.method === "POST" && (path === "" || path === "/" || path === "/vote")) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
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

      const { nomineeId, voteType = "public", voteCount = 1 } = await req.json();

      if (!nomineeId) {
        return new Response(
          JSON.stringify({ error: "nomineeId required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const votes = Math.max(1, Math.min(100, parseInt(voteCount) || 1)); // Limit to 1-100 votes
      const agcCost = votes; // 1 AGC per vote

      // Get active season
      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .single();

      if (!season) {
        return new Response(
          JSON.stringify({ error: "No active season" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check stage is open
      const stageAction = voteType === "jury" ? "jury_scoring" : "public_voting";
      const { data: isOpen } = await supabase.rpc("is_stage_open", { _action: stageAction });

      if (!isOpen) {
        return new Response(
          JSON.stringify({ error: `${stageAction} is not currently open` }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check jury role if jury vote
      if (voteType === "jury") {
        const { data: hasJuryRole } = await supabase.rpc("has_role", {
          _user_id: userData.user.id,
          _role: "jury",
        });
        if (!hasJuryRole) {
          return new Response(
            JSON.stringify({ error: "Jury role required" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Check for duplicate vote (only for public votes, jury can update)
      if (voteType === "public") {
        const { data: existing } = await supabase
          .from("votes")
          .select("id")
          .eq("voter_id", userData.user.id)
          .eq("nominee_id", nomineeId)
          .eq("season_id", season.id)
          .eq("vote_type", voteType)
          .maybeSingle();

        if (existing) {
          return new Response(
            JSON.stringify({ error: "Already voted for this nominee" }),
            { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Ensure user has wallet
      const { data: accountId, error: walletError } = await supabase.rpc("ensure_user_wallet", {
        _user_id: userData.user.id,
      });

      if (walletError || !accountId) {
        return new Response(
          JSON.stringify({ error: "Failed to access wallet" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get current balance
      const { data: balanceData } = await supabase.rpc("get_user_wallet_balance", {
        _user_id: userData.user.id,
      });

      const currentBalance = balanceData?.[0]?.balance_agc || 0;

      if (currentBalance < agcCost) {
        return new Response(
          JSON.stringify({ 
            error: "Insufficient AGC balance",
            required: agcCost,
            available: currentBalance,
          }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Insert vote
      const { data: vote, error: voteError } = await supabase
        .from("votes")
        .insert({
          voter_id: userData.user.id,
          nominee_id: nomineeId,
          season_id: season.id,
          vote_type: voteType,
          score: votes,
        })
        .select()
        .single();

      if (voteError) throw voteError;

      // Deduct AGC from wallet
      const { error: txError } = await supabase.rpc("record_wallet_transaction", {
        _account_id: accountId,
        _tx_type: "SPEND",
        _source: "VOTE_SPEND",
        _amount_agcc: 0,
        _amount_agc: -agcCost, // Negative for deduction
        _reference_type: "VOTE",
        _reference_id: vote.id,
        _description: `Voted ${votes} time(s) for nominee`,
        _metadata: { nominee_id: nomineeId, vote_count: votes },
        _created_by: userData.user.id,
      });

      if (txError) {
        // Rollback vote if transaction fails
        await supabase.from("votes").delete().eq("id", vote.id);
        throw txError;
      }

      // Increment nominee vote count
      for (let i = 0; i < votes; i++) {
        await supabase.rpc("increment_public_votes", { nominee_id: nomineeId });
      }

      // Get new balance
      const { data: newBalanceData } = await supabase.rpc("get_user_wallet_balance", {
        _user_id: userData.user.id,
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          vote,
          agcSpent: agcCost,
          newBalance: newBalanceData?.[0]?.balance_agc || 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Voting API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
