import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NRCDecisionPayload {
  nominationId: string;
  decision: "APPROVE" | "REJECT" | "NEEDS_INFO";
  notes?: string;
  createNominee?: boolean; // For APPROVE - should create nominee record
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
    const path = url.pathname.replace("/nrc", "");

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

    // Check if user is NRC or Admin
    const { data: hasNrcRole } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "nrc",
    });
    const { data: hasAdminRole } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });

    if (!hasNrcRole && !hasAdminRole) {
      return new Response(
        JSON.stringify({ error: "NRC or Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /nrc/queue - Get pending nominations for review
    if (req.method === "GET" && (path === "" || path === "/" || path === "/queue")) {
      const status = url.searchParams.get("status") || "pending";
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const limit = parseInt(url.searchParams.get("limit") || "20", 10);
      const offset = (page - 1) * limit;

      // Get active season
      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .maybeSingle();

      if (!season) {
        return new Response(
          JSON.stringify({ error: "No active season", data: [], total: 0 }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Count total
      const { count } = await supabase
        .from("nominations")
        .select("*", { count: "exact", head: true })
        .eq("season_id", season.id)
        .eq("status", status);

      // Fetch nominations
      const { data, error } = await supabase
        .from("nominations")
        .select(`
          *,
          subcategories(id, name, slug, categories(id, name, slug))
        `)
        .eq("season_id", season.id)
        .eq("status", status)
        .order("created_at", { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({
          data: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /nrc/assign - Assign nomination to reviewer
    if (req.method === "POST" && path === "/assign") {
      const { nominationId, reviewerId } = await req.json();

      if (!nominationId) {
        return new Response(
          JSON.stringify({ error: "nominationId required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("nominations")
        .update({
          nrc_reviewer_id: reviewerId || userData.user.id,
          status: "under_review",
        })
        .eq("id", nominationId)
        .select()
        .single();

      if (error) throw error;

      // Log audit event
      await supabase.from("audit_logs").insert({
        action: "nrc_assign",
        entity_type: "nomination",
        entity_id: nominationId,
        user_id: userData.user.id,
        new_values: { nrc_reviewer_id: reviewerId || userData.user.id },
      });

      return new Response(
        JSON.stringify({ success: true, nomination: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /nrc/decision - Make decision on nomination
    if (req.method === "POST" && path === "/decision") {
      const payload: NRCDecisionPayload = await req.json();

      if (!payload.nominationId || !payload.decision) {
        return new Response(
          JSON.stringify({ error: "nominationId and decision required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const validDecisions = ["APPROVE", "REJECT", "NEEDS_INFO"];
      if (!validDecisions.includes(payload.decision)) {
        return new Response(
          JSON.stringify({ error: `Invalid decision. Must be: ${validDecisions.join(", ")}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get nomination details with source
      const { data: nomination, error: fetchError } = await supabase
        .from("nominations")
        .select("*, source")
        .eq("id", payload.nominationId)
        .single();

      if (fetchError || !nomination) {
        return new Response(
          JSON.stringify({ error: "Nomination not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let newStatus = nomination.status;
      let createdNomineeId = nomination.created_nominee_id;

      switch (payload.decision) {
        case "APPROVE":
          newStatus = "approved";
          
          // If nominee already exists (via dedup), just update NRC verification
          if (createdNomineeId) {
            await supabase
              .from("nominees")
              .update({
                nrc_verified: true,
                nrc_verified_at: new Date().toISOString(),
                nrc_reviewer_id: userData.user.id,
                review_notes: payload.notes,
                status: "approved",
              })
              .eq("id", createdNomineeId);
          } else if (payload.createNominee !== false) {
            // Create nominee record from nomination
            const slug = nomination.nominee_name
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim() + `-${Date.now()}`;

            const { data: newNominee, error: createError } = await supabase
              .from("nominees")
              .insert({
                name: nomination.nominee_name,
                slug,
                title: nomination.nominee_title,
                organization: nomination.nominee_organization,
                bio: nomination.nominee_bio,
                photo_url: nomination.nominee_photo_url,
                evidence_urls: nomination.evidence_urls,
                subcategory_id: nomination.subcategory_id,
                season_id: nomination.season_id,
                nominator_user_id: nomination.nominator_id,
                nrc_reviewer_id: userData.user.id,
                nrc_verified: true,
                nrc_verified_at: new Date().toISOString(),
                reviewed_at: new Date().toISOString(),
                status: "approved",
                acceptance_status: "PENDING",
                first_letter_sent: false,
                renomination_count: 1,
              })
              .select("id")
              .single();

            if (createError) throw createError;
            createdNomineeId = newNominee.id;
          }
          break;

        case "REJECT":
          newStatus = "rejected";
          // If nominee exists, mark as rejected too
          if (createdNomineeId) {
            await supabase
              .from("nominees")
              .update({
                nrc_verified: false,
                nrc_reviewer_id: userData.user.id,
                review_notes: payload.notes,
                status: "rejected",
              })
              .eq("id", createdNomineeId);
          }
          break;

        case "NEEDS_INFO":
          newStatus = "pending"; // Reset to pending for resubmission
          break;
      }

      // Update nomination
      const { data: updated, error: updateError } = await supabase
        .from("nominations")
        .update({
          status: newStatus,
          review_notes: payload.notes,
          reviewed_at: new Date().toISOString(),
          nrc_reviewer_id: userData.user.id,
          created_nominee_id: createdNomineeId,
        })
        .eq("id", payload.nominationId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Log audit event
      await supabase.from("audit_events").insert({
        actor_id: userData.user.id,
        actor_role: hasAdminRole ? "admin" : "nrc",
        action: `nrc_decision_${payload.decision.toLowerCase()}`,
        entity_type: "nomination",
        entity_id: payload.nominationId,
        metadata: {
          old_status: nomination.status,
          new_status: newStatus,
          decision: payload.decision,
          notes: payload.notes,
          created_nominee_id: createdNomineeId,
          source: nomination.source,
        },
      });

      // Also log to legacy audit_logs for compatibility
      await supabase.from("audit_logs").insert({
        action: `nrc_decision_${payload.decision.toLowerCase()}`,
        entity_type: "nomination",
        entity_id: payload.nominationId,
        user_id: userData.user.id,
        old_values: { status: nomination.status },
        new_values: {
          status: newStatus,
          decision: payload.decision,
          notes: payload.notes,
          created_nominee_id: createdNomineeId,
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          nomination: updated,
          createdNomineeId,
          nrc_verified: payload.decision === "APPROVE",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /nrc/logs - Get audit logs for NRC actions
    if (req.method === "GET" && path === "/logs") {
      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const limit = parseInt(url.searchParams.get("limit") || "50", 10);
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from("audit_logs")
        .select("*", { count: "exact" })
        .in("action", ["nrc_assign", "nrc_decision_approve", "nrc_decision_reject", "nrc_decision_needs_info"])
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({
          data: data || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /nrc/stats - Get NRC dashboard stats
    if (req.method === "GET" && path === "/stats") {
      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .maybeSingle();

      if (!season) {
        return new Response(
          JSON.stringify({ pending: 0, under_review: 0, approved: 0, rejected: 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const statuses = ["pending", "under_review", "approved", "rejected"];
      const stats: Record<string, number> = {};

      for (const status of statuses) {
        const { count } = await supabase
          .from("nominations")
          .select("*", { count: "exact", head: true })
          .eq("season_id", season.id)
          .eq("status", status);
        stats[status] = count || 0;
      }

      return new Response(
        JSON.stringify(stats),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("NRC API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
