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
      // Get active season
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

      // Get stage config
      const { data: stages } = await supabase
        .from("stage_config")
        .select("action, is_open, opens_at, closes_at")
        .eq("season_id", season.id);

      const stagesOpen: Record<string, boolean> = {};
      for (const stage of stages || []) {
        stagesOpen[stage.action] = stage.is_open || false;
      }

      // Check auth
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

      // Check if public voting is open
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

    // GET /voting/tally - Get public vote tallies (public, stage-gated)
    if (req.method === "GET" && path === "/tally") {
      const categorySlug = url.searchParams.get("category");
      const subcategoryId = url.searchParams.get("subcategory");

      // Get active season
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

      // Build query for approved nominees with vote counts
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

      // Aggregate by category
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

    // POST /voting/vote - Cast a vote (authenticated, stage-gated)
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

      const { nomineeId, voteType = "public" } = await req.json();

      if (!nomineeId) {
        return new Response(
          JSON.stringify({ error: "nomineeId required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

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

      // Check for duplicate vote
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

      // Insert vote
      const { data: vote, error: voteError } = await supabase
        .from("votes")
        .insert({
          voter_id: userData.user.id,
          nominee_id: nomineeId,
          season_id: season.id,
          vote_type: voteType,
          score: 1,
        })
        .select()
        .single();

      if (voteError) throw voteError;

      // Increment nominee vote count
      await supabase.rpc("increment_public_votes", { nominee_id: nomineeId });

      return new Response(
        JSON.stringify({ success: true, vote }),
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
