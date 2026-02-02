import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const action = pathParts[1] || "";

    // Create Supabase client with auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const userId = user.id;

    // Check jury or admin role
    const { data: hasJuryRole } = await supabase.rpc("has_role", { _user_id: userId, _role: "jury" });
    const { data: hasAdminRole } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    
    if (!hasJuryRole && !hasAdminRole) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Jury access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Route handling
    switch (action) {
      case "assignments": {
        if (req.method === "GET") {
          // Get judge's assigned nominees
          const { data, error } = await supabase
            .from("jury_assignments")
            .select(`
              *,
              nominee:nominees(
                id, name, slug, title, organization, bio, photo_url,
                subcategory:subcategories(id, name, slug, category:categories(id, name, slug))
              )
            `)
            .eq("judge_user_id", userId)
            .order("assigned_at", { ascending: false });

          if (error) throw error;
          return new Response(
            JSON.stringify({ assignments: data || [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Admin can create assignments
        if (req.method === "POST" && hasAdminRole) {
          const body = await req.json();
          const { judge_user_id, nominee_id, season_id, category_id } = body;

          const { data, error } = await supabase
            .from("jury_assignments")
            .insert({
              judge_user_id,
              nominee_id,
              season_id,
              category_id,
            })
            .select()
            .single();

          if (error) throw error;

          // Audit log
          await supabase.from("audit_logs").insert({
            action: "jury_assignment_created",
            entity_type: "jury_assignment",
            entity_id: data.id,
            user_id: userId,
            new_values: { judge_user_id, nominee_id },
          });

          return new Response(
            JSON.stringify({ assignment: data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "score": {
        if (req.method === "POST") {
          const body = await req.json();
          const { nominee_id, score, comment } = body;

          // Validate score range
          if (typeof score !== "number" || score < 0 || score > 100) {
            return new Response(
              JSON.stringify({ error: "Score must be between 0 and 100" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Check stage is open
          const { data: stageOpen } = await supabase.rpc("is_stage_open", { _action: "jury_scoring" });
          if (!stageOpen && !hasAdminRole) {
            return new Response(
              JSON.stringify({ error: "Jury scoring stage is closed" }),
              { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Check for COI
          const { data: coiExists } = await supabase
            .from("coi_declarations")
            .select("id")
            .eq("judge_user_id", userId)
            .eq("nominee_id", nominee_id)
            .maybeSingle();

          if (coiExists) {
            return new Response(
              JSON.stringify({ error: "Cannot score: Conflict of Interest declared for this nominee" }),
              { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Update assignment with score
          const { data, error } = await supabase
            .from("jury_assignments")
            .update({
              score,
              comment,
              scored_at: new Date().toISOString(),
              status: "completed",
            })
            .eq("judge_user_id", userId)
            .eq("nominee_id", nominee_id)
            .select()
            .single();

          if (error) throw error;

          // Audit log
          await supabase.from("audit_logs").insert({
            action: "jury_score_submitted",
            entity_type: "jury_assignment",
            entity_id: data.id,
            user_id: userId,
            new_values: { score, nominee_id },
          });

          return new Response(
            JSON.stringify({ success: true, assignment: data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "coi": {
        if (req.method === "POST") {
          const body = await req.json();
          const { nominee_id, reason } = body;

          if (!nominee_id || !reason) {
            return new Response(
              JSON.stringify({ error: "nominee_id and reason are required" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Create COI declaration
          const { data: coi, error: coiError } = await supabase
            .from("coi_declarations")
            .insert({
              judge_user_id: userId,
              nominee_id,
              reason,
            })
            .select()
            .single();

          if (coiError) throw coiError;

          // Update assignment status to recused
          await supabase
            .from("jury_assignments")
            .update({ status: "recused" })
            .eq("judge_user_id", userId)
            .eq("nominee_id", nominee_id);

          // Audit log
          await supabase.from("audit_logs").insert({
            action: "coi_declared",
            entity_type: "coi_declaration",
            entity_id: coi.id,
            user_id: userId,
            new_values: { nominee_id, reason },
          });

          return new Response(
            JSON.stringify({ success: true, coi }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (req.method === "GET") {
          // Get judge's COI declarations
          const { data, error } = await supabase
            .from("coi_declarations")
            .select(`
              *,
              nominee:nominees(id, name, slug)
            `)
            .eq("judge_user_id", userId);

          if (error) throw error;
          return new Response(
            JSON.stringify({ declarations: data || [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "stats": {
        if (req.method === "GET") {
          // Get jury dashboard stats
          const { data: assignments } = await supabase
            .from("jury_assignments")
            .select("id, status, score")
            .eq("judge_user_id", userId);

          const total = assignments?.length || 0;
          const completed = assignments?.filter(a => a.status === "completed").length || 0;
          const pending = assignments?.filter(a => a.status === "pending").length || 0;
          const recused = assignments?.filter(a => a.status === "recused").length || 0;
          const scoredAssignments = assignments?.filter(a => a.score !== null) || [];
          const totalScore = scoredAssignments.reduce((acc, a) => acc + (a.score || 0), 0);
          const avgScore = scoredAssignments.length > 0 ? totalScore / scoredAssignments.length : 0;

          return new Response(
            JSON.stringify({
              stats: {
                total,
                completed,
                pending,
                recused,
                averageScore: Math.round(avgScore * 100) / 100,
                completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
              },
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "dossier": {
        // GET /jury/dossier/:nomineeId - Read-only evidence access
        if (req.method === "GET") {
          const nomineeId = pathParts[2];
          if (!nomineeId) {
            return new Response(
              JSON.stringify({ error: "Nominee ID required" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Check assignment exists
          const { data: assignment } = await supabase
            .from("jury_assignments")
            .select("id")
            .eq("judge_user_id", userId)
            .eq("nominee_id", nomineeId)
            .maybeSingle();

          if (!assignment && !hasAdminRole) {
            return new Response(
              JSON.stringify({ error: "Not assigned to this nominee" }),
              { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const { data: nominee, error } = await supabase
            .from("nominees")
            .select(`
              id, name, slug, title, organization, bio, photo_url, evidence_urls, region,
              subcategory:subcategories(
                id, name, slug,
                category:categories(id, name, slug)
              )
            `)
            .eq("id", nomineeId)
            .single();

          if (error) throw error;

          return new Response(
            JSON.stringify({ dossier: nominee }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Jury function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
