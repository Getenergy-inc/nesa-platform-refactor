import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const respond = (data: unknown, meta?: Record<string, unknown>, status = 200) =>
  new Response(
    JSON.stringify({ ok: true, data, ...(meta && { meta }) }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );

const errorResponse = (message: string, status = 400) =>
  new Response(
    JSON.stringify({ ok: false, error: message }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const action = pathParts[1] || "";

    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader || "" } } }
    );

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const requireAuth = async (): Promise<string | null> => {
      if (!authHeader?.startsWith("Bearer ")) return null;
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user.id;
    };

    const hasRoleCode = async (userId: string, roleCode: string) => {
      const { data } = await supabase.rpc("has_role_code", { p_user_id: userId, p_role_code: roleCode });
      return data === true;
    };

    // ============================================================
    // GET /referrals/me - Get user's referral info
    // ============================================================
    if (action === "me" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const { data: referral } = await supabase
        .from("referrals")
        .select("*")
        .eq("owner_type", "USER")
        .eq("owner_id", userId)
        .maybeSingle();

      const { data: events } = await supabase
        .from("referral_events")
        .select("*")
        .eq("referrer_type", "USER")
        .eq("referrer_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      // Calculate earnings summary
      const earnings = {
        total_agc: events?.reduce((sum, e) => sum + (e.reward_agc || 0), 0) || 0,
        total_referrals: events?.filter(e => e.event_type === "SIGNUP").length || 0,
        paid_conversions: events?.filter(e => 
          ["NOMINATION_PAID", "VOTE_PAID", "TICKET", "DONATION"].includes(e.event_type)
        ).length || 0,
      };

      return respond({
        referral,
        recentEvents: events || [],
        earnings,
      });
    }

    // ============================================================
    // POST /referrals/invite - Generate/get invite link
    // ============================================================
    if (action === "invite" && req.method === "POST") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      // Get or create referral
      let { data: referral } = await supabase
        .from("referrals")
        .select("*")
        .eq("owner_type", "USER")
        .eq("owner_id", userId)
        .maybeSingle();

      if (!referral) {
        // Create new referral (trigger should handle this, but fallback)
        const { data: newReferral, error } = await adminSupabase
          .from("referrals")
          .insert({
            owner_type: "USER",
            owner_id: userId,
            referral_code: `U-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          })
          .select()
          .single();

        if (error) throw error;
        referral = newReferral;
      }

      const baseUrl = Deno.env.get("SITE_URL") || "https://nesa.africa";
      const inviteLink = `${baseUrl}/register?ref=${referral.referral_code}`;

      return respond({
        referral_code: referral.referral_code,
        invite_link: inviteLink,
        is_active: referral.is_active,
      });
    }

    // ============================================================
    // GET /referrals/tree - Get referral tree
    // ============================================================
    if (action === "tree" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const scope = url.searchParams.get("scope") || "user";

      if (scope === "user") {
        // Get users referred by this user
        const { data: referred } = await adminSupabase
          .from("profiles")
          .select("id, user_id, full_name, email, created_at")
          .eq("referred_by_user_id", userId)
          .order("created_at", { ascending: false });

        // Get referral events for these users
        const referredUserIds = referred?.map(r => r.user_id) || [];
        const { data: events } = await adminSupabase
          .from("referral_events")
          .select("*")
          .eq("referrer_type", "USER")
          .eq("referrer_id", userId)
          .in("referred_user_id", referredUserIds.length > 0 ? referredUserIds : ["none"]);

        const tree = (referred || []).map(r => {
          const userEvents = events?.filter(e => e.referred_user_id === r.user_id) || [];
          return {
            user_id: r.user_id,
            full_name: r.full_name,
            email: r.email,
            joined_at: r.created_at,
            events: userEvents,
            total_agc: userEvents.reduce((s, e) => s + (e.reward_agc || 0), 0),
          };
        });

        return respond(tree);
      }

      if (scope === "chapter") {
        // Get chapter where user is coordinator
        const isOLC = await hasRoleCode(userId, "OLC_COORDINATOR");
        if (!isOLC) return errorResponse("Forbidden", 403);

        const { data: chapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("coordinator_user_id", userId)
          .maybeSingle();

        if (!chapter) return errorResponse("No chapter assigned", 404);

        // Get users referred by this chapter
        const { data: referred } = await adminSupabase
          .from("profiles")
          .select("id, user_id, full_name, email, created_at")
          .eq("referred_by_chapter_id", chapter.id)
          .order("created_at", { ascending: false });

        const referredUserIds = referred?.map(r => r.user_id) || [];
        const { data: events } = await adminSupabase
          .from("referral_events")
          .select("*")
          .eq("referrer_type", "CHAPTER")
          .eq("referrer_id", chapter.id)
          .in("referred_user_id", referredUserIds.length > 0 ? referredUserIds : ["none"]);

        const tree = (referred || []).map(r => {
          const userEvents = events?.filter(e => e.referred_user_id === r.user_id) || [];
          return {
            user_id: r.user_id,
            full_name: r.full_name,
            email: r.email,
            joined_at: r.created_at,
            events: userEvents,
            total_agc: userEvents.reduce((s, e) => s + (e.reward_agc || 0), 0),
          };
        });

        return respond(tree);
      }

      return errorResponse("Invalid scope");
    }

    // ============================================================
    // GET /referrals/earnings - Get earnings breakdown
    // ============================================================
    if (action === "earnings" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const groupBy = url.searchParams.get("groupBy") || "type";

      const { data: events } = await supabase
        .from("referral_events")
        .select("*")
        .eq("referrer_type", "USER")
        .eq("referrer_id", userId);

      if (groupBy === "type") {
        const byType: Record<string, { count: number; total_agc: number }> = {};
        (events || []).forEach(e => {
          if (!byType[e.event_type]) {
            byType[e.event_type] = { count: 0, total_agc: 0 };
          }
          byType[e.event_type].count += 1;
          byType[e.event_type].total_agc += e.reward_agc || 0;
        });
        return respond(byType);
      }

      if (groupBy === "month") {
        const byMonth: Record<string, { count: number; total_agc: number }> = {};
        (events || []).forEach(e => {
          const month = e.created_at?.substring(0, 7) || "unknown";
          if (!byMonth[month]) {
            byMonth[month] = { count: 0, total_agc: 0 };
          }
          byMonth[month].count += 1;
          byMonth[month].total_agc += e.reward_agc || 0;
        });
        return respond(byMonth);
      }

      return respond(events || []);
    }

    // ============================================================
    // GET /referrals/lookup/:code - Public code validation (no auth)
    // ============================================================
    if (action === "lookup" && req.method === "GET") {
      const code = pathParts[2];
      if (!code) return errorResponse("Code required");

      const { data: referral } = await adminSupabase
        .from("referrals")
        .select("owner_type, owner_id, is_active")
        .eq("referral_code", code.toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (!referral) {
        return respond({ valid: false });
      }

      // Get owner name for display
      let ownerName = null;
      if (referral.owner_type === "USER") {
        const { data: profile } = await adminSupabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", referral.owner_id)
          .maybeSingle();
        ownerName = profile?.full_name;
      } else if (referral.owner_type === "CHAPTER") {
        const { data: chapter } = await adminSupabase
          .from("chapters")
          .select("name")
          .eq("id", referral.owner_id)
          .maybeSingle();
        ownerName = chapter?.name;
      }

      return respond({
        valid: true,
        owner_type: referral.owner_type,
        owner_name: ownerName,
      });
    }

    return errorResponse("Not found", 404);

  } catch (error: unknown) {
    console.error("Referrals function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
