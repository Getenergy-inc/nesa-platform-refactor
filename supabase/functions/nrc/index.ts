import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NRCDecisionPayload {
  nominationId: string;
  queueItemId?: string;
  decision: "APPROVE" | "REJECT" | "NEEDS_INFO" | "PUSH_RENOMINATION" | "PUSH_VOTING";
  notes?: string;
  createNominee?: boolean;
  targetTier?: "gold" | "blue_garnet" | "platinum";
}

interface InvitePayload {
  email: string;
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

    // GET /nrc/my-queue - Get current user's assigned queue
    if (req.method === "GET" && path === "/my-queue") {
      const { data, error } = await supabase
        .from("nrc_queue")
        .select(`
          *,
          nominations (
            id, nominee_name, nominee_title, nominee_organization,
            nominee_bio, nominee_photo_url, evidence_urls, justification,
            status, created_at,
            subcategories (id, name, categories (id, name, slug))
          )
        `)
        .eq("assigned_to", userData.user.id)
        .in("status", ["assigned", "in_review"])
        .order("priority", { ascending: false })
        .order("due_date", { ascending: true });

      if (error) throw error;

      return new Response(
        JSON.stringify({ data: data || [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /nrc/members - Get NRC members (admin only)
    if (req.method === "GET" && path === "/members") {
      if (!hasAdminRole) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: members, error } = await supabase
        .from("nrc_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get profiles
      const userIds = members?.map(m => m.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, avatar_url")
        .in("user_id", userIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const enriched = members?.map(m => ({
        ...m,
        profile: profilesMap.get(m.user_id) || null,
      }));

      return new Response(
        JSON.stringify({ data: enriched || [], total_capacity: 30 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /nrc/invite - Invite new NRC member (admin only)
    if (req.method === "POST" && path === "/invite") {
      if (!hasAdminRole) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { email }: InvitePayload = await req.json();

      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check member cap
      const { count } = await supabase
        .from("nrc_members")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "active"]);

      if ((count || 0) >= 30) {
        return new Response(
          JSON.stringify({ error: "NRC member limit (30) reached" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { data, error } = await supabase.from("nrc_invitations").insert({
        email: email.toLowerCase().trim(),
        token,
        invited_by: userData.user.id,
        expires_at: expiresAt.toISOString(),
      }).select().single();

      if (error) throw error;

      // Log audit
      await supabase.from("audit_events").insert({
        actor_id: userData.user.id,
        actor_role: "admin",
        action: "nrc_invite_sent",
        entity_type: "nrc_invitation",
        entity_id: data.id,
        metadata: { email },
      });

      return new Response(
        JSON.stringify({ success: true, invitation: data }),
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

      // Insert into queue with due date
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const { data, error } = await supabase
        .from("nrc_queue")
        .insert({
          nomination_id: nominationId,
          assigned_to: reviewerId || userData.user.id,
          assigned_by: userData.user.id,
          due_date: dueDate.toISOString(),
        })
        .select()
        .single();

      if (error) {
        // If already assigned, update
        if (error.code === "23505") {
          const { data: updated, error: updateError } = await supabase
            .from("nrc_queue")
            .update({
              assigned_to: reviewerId || userData.user.id,
              assigned_by: userData.user.id,
              status: "reassigned",
            })
            .eq("nomination_id", nominationId)
            .select()
            .single();

          if (updateError) throw updateError;

          return new Response(
            JSON.stringify({ success: true, queue_item: updated, reassigned: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw error;
      }

      // Update nomination status
      await supabase
        .from("nominations")
        .update({ status: "under_review", nrc_reviewer_id: reviewerId || userData.user.id })
        .eq("id", nominationId);

      // Log audit
      await supabase.from("audit_logs").insert({
        action: "nrc_assign",
        entity_type: "nomination",
        entity_id: nominationId,
        user_id: userData.user.id,
        new_values: { assigned_to: reviewerId || userData.user.id },
      });

      return new Response(
        JSON.stringify({ success: true, queue_item: data }),
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

      const validDecisions = ["APPROVE", "REJECT", "NEEDS_INFO", "PUSH_RENOMINATION", "PUSH_VOTING"];
      if (!validDecisions.includes(payload.decision)) {
        return new Response(
          JSON.stringify({ error: `Invalid decision. Must be: ${validDecisions.join(", ")}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get nomination details
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
        case "PUSH_VOTING":
          newStatus = payload.targetTier === "platinum" ? "platinum" : "approved";
          
          // Create nominee if not exists
          if (!createdNomineeId && payload.createNominee !== false) {
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
                status: newStatus,
                acceptance_status: "PENDING",
                first_letter_sent: false,
                renomination_count: 1,
                is_platinum: payload.targetTier === "platinum",
              })
              .select("id")
              .single();

            if (createError) throw createError;
            createdNomineeId = newNominee.id;
          } else if (createdNomineeId) {
            // Update existing nominee
            await supabase
              .from("nominees")
              .update({
                nrc_verified: true,
                nrc_verified_at: new Date().toISOString(),
                nrc_reviewer_id: userData.user.id,
                review_notes: payload.notes,
                status: newStatus,
                is_platinum: payload.targetTier === "platinum",
              })
              .eq("id", createdNomineeId);
          }
          break;

        case "REJECT":
          newStatus = "rejected";
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
        case "PUSH_RENOMINATION":
          newStatus = "pending";
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

      // Complete queue item if provided
      if (payload.queueItemId) {
        await supabase
          .from("nrc_queue")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            notes: payload.notes,
          })
          .eq("id", payload.queueItemId);
      }

      // Log audit events
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
          target_tier: payload.targetTier,
          notes: payload.notes,
          created_nominee_id: createdNomineeId,
          source: nomination.source,
        },
      });

      await supabase.from("audit_logs").insert({
        action: `nrc_decision_${payload.decision.toLowerCase()}`,
        entity_type: "nomination",
        entity_id: payload.nominationId,
        user_id: userData.user.id,
        old_values: { status: nomination.status },
        new_values: {
          status: newStatus,
          decision: payload.decision,
          target_tier: payload.targetTier,
          notes: payload.notes,
          created_nominee_id: createdNomineeId,
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          nomination: updated,
          createdNomineeId,
          nrc_verified: ["APPROVE", "PUSH_VOTING"].includes(payload.decision),
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

      // Member stats
      const { count: totalMembers } = await supabase
        .from("nrc_members")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "active"]);

      const { count: activeMembers } = await supabase
        .from("nrc_members")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      const { count: pendingInvitations } = await supabase
        .from("nrc_invitations")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Queue stats
      const { count: totalQueueItems } = await supabase
        .from("nrc_queue")
        .select("*", { count: "exact", head: true })
        .in("status", ["assigned", "in_review"]);

      const { count: completedReviews } = await supabase
        .from("nrc_queue")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");

      // Nomination status stats (if season exists)
      let nominationStats = { pending: 0, under_review: 0, approved: 0, rejected: 0 };
      if (season) {
        for (const status of ["pending", "under_review", "approved", "rejected"]) {
          const { count } = await supabase
            .from("nominations")
            .select("*", { count: "exact", head: true })
            .eq("season_id", season.id)
            .eq("status", status);
          nominationStats[status as keyof typeof nominationStats] = count || 0;
        }
      }

      return new Response(
        JSON.stringify({
          total_members: totalMembers || 0,
          active_members: activeMembers || 0,
          pending_invitations: pendingInvitations || 0,
          total_queue_items: totalQueueItems || 0,
          completed_reviews: completedReviews || 0,
          member_capacity: 30,
          ...nominationStats,
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
        .like("action", "nrc_%")
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
