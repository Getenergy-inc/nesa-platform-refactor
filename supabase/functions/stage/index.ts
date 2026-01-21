import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const path = url.pathname.replace("/stage", "");

    // GET /stage - Public endpoint to get current season and stage status
    if (req.method === "GET" && (path === "" || path === "/")) {
      // Get active season
      const { data: season, error: seasonError } = await supabase
        .from("seasons")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (seasonError) throw seasonError;

      if (!season) {
        return new Response(
          JSON.stringify({
            error: "No active season configured",
            currentEditionKey: null,
            edition: null,
            stages: [],
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Get stage configs for active season
      const { data: stages, error: stagesError } = await supabase
        .from("stage_config")
        .select("action, is_open, opens_at, closes_at")
        .eq("season_id", season.id);

      if (stagesError) throw stagesError;

      const editionKey = season.year.toString();
      
      const response = {
        currentEditionKey: editionKey,
        edition: {
          key: editionKey,
          name: season.name,
          displayYear: season.year,
          ceremonyYear: season.year + 1,
          isActive: season.is_active,
        },
        stages: (stages || []).map((s) => ({
          action: s.action,
          isOpen: s.is_open,
          opensAt: s.opens_at,
          closesAt: s.closes_at,
        })),
        transitionRules: {
          showNextEditionPreview: false,
          votingLockoutDays: 14,
          certificateAvailableDays: 30,
          allowArchiveAccess: true,
        },
        serverTime: new Date().toISOString(),
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // All other endpoints require authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user and check admin role
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin
    const { data: hasAdminRole } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!hasAdminRole) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /stage/switch - Switch active season (admin only)
    if (req.method === "POST" && path === "/switch") {
      const { seasonYear } = await req.json();

      if (!seasonYear || typeof seasonYear !== "number") {
        return new Response(
          JSON.stringify({ error: "seasonYear is required and must be a number" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Deactivate all seasons
      await supabase.from("seasons").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");

      // Activate target season
      const { data: updated, error: updateError } = await supabase
        .from("seasons")
        .update({ is_active: true })
        .eq("year", seasonYear)
        .select()
        .single();

      if (updateError) {
        // If season doesn't exist, create it
        if (updateError.code === "PGRST116") {
          const { data: created, error: createError } = await supabase
            .from("seasons")
            .insert({
              year: seasonYear,
              name: `NESA-Africa ${seasonYear}`,
              is_active: true,
            })
            .select()
            .single();

          if (createError) throw createError;

          // Create stage configs for new season
          const stages = ["nominations", "public_voting", "jury_scoring", "results", "certificates"];
          await supabase.from("stage_config").insert(
            stages.map((action) => ({
              season_id: created.id,
              action,
              is_open: false,
            }))
          );

          return new Response(
            JSON.stringify({ success: true, season: created, created: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw updateError;
      }

      return new Response(
        JSON.stringify({ success: true, season: updated }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /stage/update - Update stage flags (admin only)
    if (req.method === "POST" && path === "/update") {
      const { action, isOpen, opensAt, closesAt } = await req.json();

      if (!action) {
        return new Response(
          JSON.stringify({ error: "action is required" }),
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

      const updateData: Record<string, any> = {};
      if (typeof isOpen === "boolean") updateData.is_open = isOpen;
      if (opensAt !== undefined) updateData.opens_at = opensAt;
      if (closesAt !== undefined) updateData.closes_at = closesAt;

      const { data: updated, error: updateError } = await supabase
        .from("stage_config")
        .update(updateData)
        .eq("season_id", season.id)
        .eq("action", action)
        .select()
        .single();

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({ success: true, stage: updated }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /stage/all - Get all seasons (admin only)
    if (req.method === "GET" && path === "/all") {
      const { data: seasons, error } = await supabase
        .from("seasons")
        .select("*")
        .order("year", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ seasons }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Stage API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
