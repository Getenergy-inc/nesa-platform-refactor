/**
 * OLC (Offline Local Chapter) Edge Function
 * 
 * Provides chapter coordinator management endpoints.
 * 
 * Endpoints:
 *   GET  /olc/members           - Get chapter members
 *   POST /olc/members/verify    - Verify a member
 *   GET  /olc/settlements       - Get settlement requests
 *   POST /olc/settlements/request - Request settlement
 *   POST /olc/media/submit      - Submit chapter media
 */

import {
  corsHeaders,
  handleCorsPreflightRequest,
  ok,
  err,
  createUserClient,
  createAdminClient,
  getAuthUser,
  hasRole,
  hasRoleCode,
} from "../_shared/index.ts";

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper: Get coordinator's chapter
async function getCoordinatorChapter(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("chapters")
    .select("*")
    .eq("coordinator_user_id", userId)
    .maybeSingle();
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const action = pathParts[1] || "";
    const subAction = pathParts[2] || "";

    const supabase = createUserClient(req);
    const adminSupabase = createAdminClient();

    // ============================================================
    // GET /olc/members - Get chapter members
    // ============================================================
    if (action === "members" && req.method === "GET" && !subAction) {
      const userId = await getAuthUser(supabase, req);
      if (!userId) return err("Unauthorized", 401);

      const [isOLC, isAdmin] = await Promise.all([
        hasRoleCode(supabase, userId, "OLC_COORDINATOR"),
        hasRole(supabase, userId, "admin"),
      ]);
      if (!isOLC && !isAdmin) return err("Forbidden", 403);

      const chapter = await getCoordinatorChapter(supabase, userId);
      if (!chapter && !isAdmin) return err("No chapter assigned", 404);

      const chapterId = chapter?.id;
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
      const offset = (page - 1) * limit;

      // Get members referred by this chapter
      const { data: members, count, error } = await adminSupabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("referred_by_chapter_id", chapterId || "")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

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

      return ok(enrichedMembers, {
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
      const userId = await getAuthUser(supabase, req);
      if (!userId) return err("Unauthorized", 401);

      const [isOLC, isAdmin] = await Promise.all([
        hasRoleCode(supabase, userId, "OLC_COORDINATOR"),
        hasRole(supabase, userId, "admin"),
      ]);
      if (!isOLC && !isAdmin) return err("Forbidden", 403);

      const chapter = await getCoordinatorChapter(supabase, userId);
      if (!chapter && !isAdmin) return err("No chapter assigned", 404);

      const body = await req.json();
      const { member_user_id, status } = body;

      if (!member_user_id) return err("member_user_id required");
      if (!["verified", "rejected"].includes(status)) return err("Invalid status");

      // Verify the member belongs to this chapter
      const { data: member } = await adminSupabase
        .from("profiles")
        .select("*")
        .eq("user_id", member_user_id)
        .eq("referred_by_chapter_id", chapter?.id || "")
        .maybeSingle();

      if (!member && !isAdmin) return err("Member not found in this chapter", 404);

      // If verified, add AMBASSADOR role
      if (status === "verified") {
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

      return ok({ verified: status === "verified", member_user_id });
    }

    // ============================================================
    // GET /olc/settlements - Get settlement requests
    // ============================================================
    if (action === "settlements" && req.method === "GET" && !subAction) {
      const userId = await getAuthUser(supabase, req);
      if (!userId) return err("Unauthorized", 401);

      const [isOLC, isAdmin] = await Promise.all([
        hasRoleCode(supabase, userId, "OLC_COORDINATOR"),
        hasRole(supabase, userId, "admin"),
      ]);
      if (!isOLC && !isAdmin) return err("Forbidden", 403);

      const chapter = await getCoordinatorChapter(supabase, userId);
      if (!chapter && !isAdmin) return err("No chapter assigned", 404);

      // Get chapter wallet
      const { data: wallet } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "CHAPTER")
        .eq("owner_id", chapter?.id || "")
        .maybeSingle();

      if (!wallet) return ok([]);

      // Get withdrawal-related entries
      const { data: settlements } = await adminSupabase
        .from("wallet_ledger_entries")
        .select("*")
        .eq("account_id", wallet.id)
        .in("entry_type", ["WITHDRAW_REQUEST", "WITHDRAW_APPROVED"])
        .order("created_at", { ascending: false })
        .limit(50);

      return ok(settlements || []);
    }

    // ============================================================
    // POST /olc/settlements/request - Request settlement
    // ============================================================
    if (action === "settlements" && subAction === "request" && req.method === "POST") {
      const userId = await getAuthUser(supabase, req);
      if (!userId) return err("Unauthorized", 401);

      if (!(await hasRoleCode(supabase, userId, "OLC_COORDINATOR"))) {
        return err("Forbidden", 403);
      }

      const chapter = await getCoordinatorChapter(supabase, userId);
      if (!chapter) return err("No chapter assigned", 404);

      const body = await req.json();
      const { amount_usd, notes } = body;

      if (!amount_usd || amount_usd <= 0) return err("Invalid amount");

      // Get chapter wallet
      const { data: wallet } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "CHAPTER")
        .eq("owner_id", chapter.id)
        .maybeSingle();

      if (!wallet) return err("Chapter wallet not found", 404);

      // Check balance
      const { data: balance } = await supabase
        .from("wallet_balances")
        .select("agc_withdrawable, usd_balance")
        .eq("account_id", wallet.id)
        .maybeSingle();

      const availableUsd = balance?.usd_balance || 0;
      if (amount_usd > availableUsd) {
        return err("Insufficient balance");
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

      return ok({
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
      const userId = await getAuthUser(supabase, req);
      if (!userId) return err("Unauthorized", 401);

      if (!(await hasRoleCode(supabase, userId, "OLC_COORDINATOR"))) {
        return err("Forbidden", 403);
      }

      const chapter = await getCoordinatorChapter(supabase, userId);
      if (!chapter) return err("No chapter assigned", 404);

      const body = await req.json();
      const { url: mediaUrl, title, description, media_type } = body;

      if (!mediaUrl || !title) return err("URL and title required");

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

      return ok({
        media_id: media.id,
        status: "pending_approval",
        message: "Media submitted for admin review",
      });
    }

    return err("Not found", 404);
  } catch (error: unknown) {
    console.error("OLC function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return err(message, 500);
  }
});
