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
    const subAction = pathParts[2] || "";

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

    const hasRole = async (userId: string, role: string) => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: role });
      return data === true;
    };

    const hasRoleCode = async (userId: string, roleCode: string) => {
      const { data } = await supabase.rpc("has_role_code", { p_user_id: userId, p_role_code: roleCode });
      return data === true;
    };

    // Get coordinator's chapter
    const getCoordinatorChapter = async (userId: string) => {
      const { data } = await supabase
        .from("chapters")
        .select("*")
        .eq("coordinator_user_id", userId)
        .maybeSingle();
      return data;
    };

    // ============================================================
    // GET /olc/members - Get chapter members
    // ============================================================
    if (action === "members" && req.method === "GET" && !subAction) {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const isOLC = await hasRoleCode(userId, "OLC_COORDINATOR");
      const isAdmin = await hasRole(userId, "admin");
      if (!isOLC && !isAdmin) return errorResponse("Forbidden", 403);

      const chapter = await getCoordinatorChapter(userId);
      if (!chapter && !isAdmin) return errorResponse("No chapter assigned", 404);

      const chapterId = chapter?.id;
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
      const offset = (page - 1) * limit;
      const status = url.searchParams.get("status");

      // Get members referred by this chapter
      let query = adminSupabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("referred_by_chapter_id", chapterId || "")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      const { data: members, count, error } = await query;
      if (error) throw error;

      // Get user roles for each member
      const memberUserIds = members?.map(m => m.user_id) || [];
      const { data: memberRoles } = await adminSupabase
        .from("user_roles")
        .select("user_id, role, role_code")
        .in("user_id", memberUserIds.length > 0 ? memberUserIds : ["none"]);

      // Enrich members with roles
      const enrichedMembers = (members || []).map(m => ({
        ...m,
        roles: memberRoles?.filter(r => r.user_id === m.user_id) || [],
      }));

      return respond(enrichedMembers, {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      });
    }

    // ============================================================
    // POST /olc/members/verify - Verify a member
    // ============================================================
    if (action === "members" && subAction === "verify" && req.method === "POST") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const isOLC = await hasRoleCode(userId, "OLC_COORDINATOR");
      const isAdmin = await hasRole(userId, "admin");
      if (!isOLC && !isAdmin) return errorResponse("Forbidden", 403);

      const chapter = await getCoordinatorChapter(userId);
      if (!chapter && !isAdmin) return errorResponse("No chapter assigned", 404);

      const body = await req.json();
      const { member_user_id, status } = body;

      if (!member_user_id) return errorResponse("member_user_id required");
      if (!["verified", "rejected"].includes(status)) return errorResponse("Invalid status");

      // Verify the member belongs to this chapter
      const { data: member } = await adminSupabase
        .from("profiles")
        .select("*")
        .eq("user_id", member_user_id)
        .eq("referred_by_chapter_id", chapter?.id || "")
        .maybeSingle();

      if (!member && !isAdmin) return errorResponse("Member not found in this chapter", 404);

      // If verified, add AMBASSADOR role
      if (status === "verified") {
        // Check if already has ambassador role
        const { data: existingRole } = await adminSupabase
          .from("user_roles")
          .select("id")
          .eq("user_id", member_user_id)
          .eq("role_code", "AMBASSADOR")
          .maybeSingle();

        if (!existingRole) {
          await adminSupabase.from("user_roles").insert({
            user_id: member_user_id,
            role: "user",
            role_code: "AMBASSADOR",
            scope_chapter_id: chapter?.id,
          });
        }
      }

      // Audit log
      await adminSupabase.from("audit_logs").insert({
        action: `member_${status}`,
        entity_type: "profile",
        entity_id: member_user_id,
        user_id: userId,
        new_values: { status, chapter_id: chapter?.id },
      });

      return respond({ verified: status === "verified", member_user_id });
    }

    // ============================================================
    // GET /olc/settlements - Get settlement requests
    // ============================================================
    if (action === "settlements" && req.method === "GET" && !subAction) {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const isOLC = await hasRoleCode(userId, "OLC_COORDINATOR");
      const isAdmin = await hasRole(userId, "admin");
      if (!isOLC && !isAdmin) return errorResponse("Forbidden", 403);

      const chapter = await getCoordinatorChapter(userId);
      if (!chapter && !isAdmin) return errorResponse("No chapter assigned", 404);

      // Get chapter wallet
      const { data: wallet } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "CHAPTER")
        .eq("owner_id", chapter?.id || "")
        .maybeSingle();

      if (!wallet) return respond([]);

      // Get withdrawal-related entries
      const { data: settlements } = await adminSupabase
        .from("wallet_ledger_entries")
        .select("*")
        .eq("account_id", wallet.id)
        .in("entry_type", ["WITHDRAW_REQUEST", "WITHDRAW_APPROVED"])
        .order("created_at", { ascending: false })
        .limit(50);

      return respond(settlements || []);
    }

    // ============================================================
    // POST /olc/settlements/request - Request settlement
    // ============================================================
    if (action === "settlements" && subAction === "request" && req.method === "POST") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const isOLC = await hasRoleCode(userId, "OLC_COORDINATOR");
      if (!isOLC) return errorResponse("Forbidden", 403);

      const chapter = await getCoordinatorChapter(userId);
      if (!chapter) return errorResponse("No chapter assigned", 404);

      const body = await req.json();
      const { amount_usd, notes } = body;

      if (!amount_usd || amount_usd <= 0) return errorResponse("Invalid amount");

      // Get chapter wallet
      const { data: wallet } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "CHAPTER")
        .eq("owner_id", chapter.id)
        .maybeSingle();

      if (!wallet) return errorResponse("Chapter wallet not found", 404);

      // Check balance
      const { data: balance } = await supabase
        .from("wallet_balances")
        .select("agc_withdrawable, usd_balance")
        .eq("account_id", wallet.id)
        .maybeSingle();

      const availableUsd = balance?.usd_balance || 0;
      if (amount_usd > availableUsd) {
        return errorResponse("Insufficient balance");
      }

      const agcAmount = amount_usd * 10; // 1 USD = 10 AGC

      // Create settlement request
      const { data: entry, error } = await adminSupabase
        .from("wallet_ledger_entries")
        .insert({
          account_id: wallet.id,
          entry_type: "WITHDRAW_REQUEST",
          direction: "DEBIT",
          agc_amount: agcAmount,
          usd_amount: amount_usd,
          is_withdrawable: true,
          description: notes || "Chapter settlement request",
          reference_type: "chapter_settlement",
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      await adminSupabase.from("audit_logs").insert({
        action: "chapter_settlement_request",
        entity_type: "wallet_ledger_entry",
        entity_id: entry.id,
        user_id: userId,
        new_values: { chapter_id: chapter.id, amount_usd, agc_amount: agcAmount },
      });

      return respond({
        request_id: entry.id,
        status: "pending",
        amount_usd,
        agc_amount: agcAmount,
      });
    }

    // ============================================================
    // POST /olc/media/submit - Submit media for chapter
    // ============================================================
    if (action === "media" && subAction === "submit" && req.method === "POST") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const isOLC = await hasRoleCode(userId, "OLC_COORDINATOR");
      if (!isOLC) return errorResponse("Forbidden", 403);

      const chapter = await getCoordinatorChapter(userId);
      if (!chapter) return errorResponse("No chapter assigned", 404);

      const body = await req.json();
      const { url: mediaUrl, title, description, media_type } = body;

      if (!mediaUrl || !title) return errorResponse("URL and title required");

      // Generate slug from title
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const { data: media, error } = await adminSupabase
        .from("media")
        .insert({
          title,
          description,
          slug: `${chapter.slug}-${slug}-${Date.now()}`,
          media_type: media_type || "video",
          video_url: mediaUrl,
          published_at: null, // Needs admin approval
        })
        .select()
        .single();

      if (error) throw error;

      await adminSupabase.from("audit_logs").insert({
        action: "chapter_media_submitted",
        entity_type: "media",
        entity_id: media.id,
        user_id: userId,
        new_values: { chapter_id: chapter.id, title, media_type },
      });

      return respond({
        media_id: media.id,
        status: "pending_approval",
        message: "Media submitted for admin review",
      });
    }

    return errorResponse("Not found", 404);

  } catch (error: unknown) {
    console.error("OLC function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
