/**
 * Dashboard Edge Function
 * 
 * Provides aggregated dashboard data for different user roles.
 * 
 * Endpoints:
 *   GET /dashboard/user  - User dashboard (auth required)
 *   GET /dashboard/olc   - OLC Coordinator dashboard (role required)
 *   GET /dashboard/admin - Admin dashboard (admin role required)
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const dashboardType = pathParts[1] || "";

    const supabase = createUserClient(req);
    const adminSupabase = createAdminClient();

    // ============================================================
    // GET /dashboard/user - User dashboard data
    // ============================================================
    if (dashboardType === "user" && req.method === "GET") {
      const userId = await getAuthUser(supabase, req);
      if (!userId) return err("Unauthorized", 401);

      // Fetch all user data in parallel
      const [profileRes, walletRes, referralRes, rolesRes, stagesRes, seasonRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("wallet_accounts").select("*").eq("owner_type", "USER").eq("owner_id", userId).maybeSingle(),
        supabase.from("referrals").select("*").eq("owner_type", "USER").eq("owner_id", userId).maybeSingle(),
        supabase.from("user_roles").select("role, role_code").eq("user_id", userId),
        supabase.from("stage_config").select("action, is_open").eq("is_open", true),
        supabase.from("seasons").select("*").eq("is_active", true).maybeSingle(),
      ]);

      let balance = null;
      let recentTransactions: unknown[] = [];

      if (walletRes.data) {
        const [balRes, txRes] = await Promise.all([
          supabase.from("wallet_balances").select("*").eq("account_id", walletRes.data.id).maybeSingle(),
          supabase.from("wallet_ledger_entries").select("*").eq("account_id", walletRes.data.id)
            .order("created_at", { ascending: false }).limit(10),
        ]);
        balance = balRes.data || { agc_total: 0, agc_withdrawable: 0, agc_non_withdrawable: 0, agc_bonus: 0, usd_balance: 0 };
        recentTransactions = txRes.data || [];
      }

      // Get revenue splits for display
      const { data: revenueSplits } = await adminSupabase
        .from("revenue_splits")
        .select("split_key, percent, destination_description")
        .eq("season_id", seasonRes.data?.id || "")
        .eq("is_active", true);

      return ok({
        profile: profileRes.data,
        wallet: walletRes.data ? { account: walletRes.data, balance } : null,
        recentTransactions,
        referral: referralRes.data,
        roles: rolesRes.data || [],
        stages: stagesRes.data || [],
        season: seasonRes.data,
        revenueSplits: revenueSplits || [],
      });
    }

    // ============================================================
    // GET /dashboard/olc - OLC Coordinator dashboard data
    // ============================================================
    if (dashboardType === "olc" && req.method === "GET") {
      const userId = await getAuthUser(supabase, req);
      if (!userId) return err("Unauthorized", 401);

      const [isOLC, isAdmin] = await Promise.all([
        hasRoleCode(supabase, userId, "OLC_COORDINATOR"),
        hasRole(supabase, userId, "admin"),
      ]);
      if (!isOLC && !isAdmin) return err("Forbidden", 403);

      // Get chapter where user is coordinator
      const { data: chapter } = await supabase
        .from("chapters")
        .select("*")
        .eq("coordinator_user_id", userId)
        .maybeSingle();

      if (!chapter && !isAdmin) return err("No chapter assigned", 404);

      const chapterId = chapter?.id;

      // Get chapter wallet and balance
      let chapterWallet = null;
      let chapterBalance = null;
      let chapterTransactions: unknown[] = [];

      if (chapterId) {
        const { data: walletData } = await supabase
          .from("wallet_accounts")
          .select("*")
          .eq("owner_type", "CHAPTER")
          .eq("owner_id", chapterId)
          .maybeSingle();

        chapterWallet = walletData;

        if (chapterWallet) {
          const [balRes, txRes] = await Promise.all([
            supabase.from("wallet_balances").select("*").eq("account_id", chapterWallet.id).maybeSingle(),
            supabase.from("wallet_ledger_entries").select("*").eq("account_id", chapterWallet.id)
              .order("created_at", { ascending: false }).limit(10),
          ]);
          chapterBalance = balRes.data || { agc_total: 0, agc_withdrawable: 0 };
          chapterTransactions = txRes.data || [];
        }
      }

      // Get referral data
      const [referralRes, eventsRes, membersRes] = await Promise.all([
        adminSupabase.from("referrals").select("*").eq("owner_type", "CHAPTER").eq("owner_id", chapterId || "").maybeSingle(),
        adminSupabase.from("referral_events").select("*").eq("referrer_type", "CHAPTER").eq("referrer_id", chapterId || "")
          .order("created_at", { ascending: false }).limit(50),
        adminSupabase.from("profiles").select("*", { count: "exact" }).eq("referred_by_chapter_id", chapterId || "").limit(50),
      ]);

      const referralEvents = eventsRes.data || [];
      const signups = referralEvents.filter(e => e.event_type === "SIGNUP").length;
      const paidConversions = referralEvents.filter(e => 
        ["NOMINATION_PAID", "VOTE_PAID", "TICKET", "DONATION"].includes(e.event_type)
      ).length;
      const totalAgcEarned = referralEvents.reduce((sum, e) => sum + (e.reward_agc || 0), 0);

      return ok({
        chapter,
        wallet: chapterWallet ? { account: chapterWallet, balance: chapterBalance } : null,
        recentTransactions: chapterTransactions,
        referral: referralRes.data,
        performance: {
          total_signups: signups,
          paid_conversions: paidConversions,
          total_agc_earned: totalAgcEarned,
        },
        members: membersRes.data || [],
        memberCount: membersRes.count || 0,
      });
    }

    // ============================================================
    // GET /dashboard/admin - Admin dashboard data
    // ============================================================
    if (dashboardType === "admin" && req.method === "GET") {
      const userId = await getAuthUser(supabase, req);
      if (!userId) return err("Unauthorized", 401);
      if (!(await hasRole(supabase, userId, "admin"))) return err("Forbidden", 403);

      // Get active season
      const { data: season } = await adminSupabase
        .from("seasons")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      // Fetch finance data
      const { data: ledgerData } = await adminSupabase
        .from("wallet_ledger_entries")
        .select("agc_amount, usd_amount, entry_type, direction");

      const totalAgc = ledgerData?.reduce((sum, entry) => 
        sum + (entry.direction === "CREDIT" ? entry.agc_amount : -entry.agc_amount), 0) || 0;

      const revenueByCategory = {
        nomination: ledgerData?.filter(e => e.entry_type === "NOMINATION_FEE").reduce((s, e) => s + e.usd_amount, 0) || 0,
        vote: ledgerData?.filter(e => e.entry_type === "VOTE_FEE").reduce((s, e) => s + e.usd_amount, 0) || 0,
        donation: ledgerData?.filter(e => e.entry_type === "DONATION").reduce((s, e) => s + e.usd_amount, 0) || 0,
        ticket: ledgerData?.filter(e => e.entry_type === "TICKET").reduce((s, e) => s + e.usd_amount, 0) || 0,
      };

      // Transaction counts
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const [dailyTxRes, weeklyTxRes, nominationsRes, pendingNomRes, votesRes] = await Promise.all([
        adminSupabase.from("wallet_ledger_entries").select("*", { count: "exact", head: true }).gte("created_at", dayAgo.toISOString()),
        adminSupabase.from("wallet_ledger_entries").select("*", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
        adminSupabase.from("nominations").select("*", { count: "exact", head: true }).eq("season_id", season?.id || ""),
        adminSupabase.from("nominations").select("*", { count: "exact", head: true }).eq("season_id", season?.id || "").eq("status", "pending"),
        adminSupabase.from("votes").select("*", { count: "exact", head: true }).eq("season_id", season?.id || ""),
      ]);

      // Top chapters
      const { data: chapters } = await adminSupabase.from("chapters").select("id, name, country").eq("is_active", true);
      const { data: chapterReferrals } = await adminSupabase.from("referral_events").select("referrer_id, event_type, reward_agc").eq("referrer_type", "CHAPTER");

      const chapterPerformance = (chapters || []).map(c => {
        const refs = chapterReferrals?.filter(r => r.referrer_id === c.id) || [];
        return {
          id: c.id, name: c.name, country: c.country,
          total_signups: refs.filter(r => r.event_type === "SIGNUP").length,
          total_agc_earned: refs.reduce((s, r) => s + (r.reward_agc || 0), 0),
        };
      }).sort((a, b) => b.total_agc_earned - a.total_agc_earned).slice(0, 10);

      // Stage config and audit logs
      const [stagesRes, splitsRes, auditRes] = await Promise.all([
        adminSupabase.from("stage_config").select("*").eq("season_id", season?.id || ""),
        adminSupabase.from("revenue_splits").select("*").eq("season_id", season?.id || ""),
        adminSupabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(20),
      ]);

      return ok({
        season,
        finance: {
          total_agc_circulation: totalAgc,
          total_usd_equivalence: totalAgc * 0.1,
          fx_rate: 0.1,
          revenue_by_category: revenueByCategory,
          transactions_summary: { daily: dailyTxRes.count || 0, weekly: weeklyTxRes.count || 0 },
        },
        nominations: { total: nominationsRes.count || 0, pending: pendingNomRes.count || 0 },
        votes: { total: votesRes.count || 0 },
        topChapters: chapterPerformance,
        stages: stagesRes.data || [],
        revenueSplits: splitsRes.data || [],
        recentAuditLogs: auditRes.data || [],
      });
    }

    return err("Not found", 404);
  } catch (error: unknown) {
    console.error("Dashboard function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return err(message, 500);
  }
});
