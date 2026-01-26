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
    const dashboardType = pathParts[1] || "";

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

    // Auth middleware
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

    // ============================================================
    // GET /dashboard/user - User dashboard data
    // ============================================================
    if (dashboardType === "user" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      // Get wallet
      const { data: wallet } = await supabase
        .from("wallet_accounts")
        .select("*")
        .eq("owner_type", "USER")
        .eq("owner_id", userId)
        .maybeSingle();

      let balance = null;
      let recentTransactions: unknown[] = [];

      if (wallet) {
        // Get balance
        const { data: balData } = await supabase
          .from("wallet_balances")
          .select("*")
          .eq("account_id", wallet.id)
          .maybeSingle();
        balance = balData || { agc_total: 0, agc_withdrawable: 0, agc_non_withdrawable: 0, agc_bonus: 0, usd_balance: 0 };

        // Get recent transactions
        const { data: txData } = await supabase
          .from("wallet_ledger_entries")
          .select("*")
          .eq("account_id", wallet.id)
          .order("created_at", { ascending: false })
          .limit(10);
        recentTransactions = txData || [];
      }

      // Get referral info
      const { data: referral } = await supabase
        .from("referrals")
        .select("*")
        .eq("owner_type", "USER")
        .eq("owner_id", userId)
        .maybeSingle();

      // Get user roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role, role_code")
        .eq("user_id", userId);

      // Get stage config
      const { data: stages } = await supabase
        .from("stage_config")
        .select("action, is_open")
        .eq("is_open", true);

      // Get active season
      const { data: season } = await supabase
        .from("seasons")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      // Get revenue splits for display
      const { data: revenueSplits } = await adminSupabase
        .from("revenue_splits")
        .select("split_key, percent, destination_description")
        .eq("season_id", season?.id || "")
        .eq("is_active", true);

      return respond({
        profile,
        wallet: wallet ? { account: wallet, balance } : null,
        recentTransactions,
        referral,
        roles: roles || [],
        stages: stages || [],
        season,
        revenueSplits: revenueSplits || [],
      });
    }

    // ============================================================
    // GET /dashboard/olc - OLC Coordinator dashboard data
    // ============================================================
    if (dashboardType === "olc" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      // Check OLC_COORDINATOR role
      const isOLC = await hasRoleCode(userId, "OLC_COORDINATOR");
      const isAdmin = await hasRole(userId, "admin");
      if (!isOLC && !isAdmin) return errorResponse("Forbidden", 403);

      // Get chapter where user is coordinator
      const { data: chapter } = await supabase
        .from("chapters")
        .select("*")
        .eq("coordinator_user_id", userId)
        .maybeSingle();

      if (!chapter && !isAdmin) return errorResponse("No chapter assigned", 404);

      const chapterId = chapter?.id;

      // Get chapter wallet
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
          const { data: balData } = await supabase
            .from("wallet_balances")
            .select("*")
            .eq("account_id", chapterWallet.id)
            .maybeSingle();
          chapterBalance = balData || { agc_total: 0, agc_withdrawable: 0, agc_non_withdrawable: 0, agc_bonus: 0, usd_balance: 0 };

          const { data: txData } = await supabase
            .from("wallet_ledger_entries")
            .select("*")
            .eq("account_id", chapterWallet.id)
            .order("created_at", { ascending: false })
            .limit(10);
          chapterTransactions = txData || [];
        }
      }

      // Get chapter referral data
      const { data: chapterReferral } = await adminSupabase
        .from("referrals")
        .select("*")
        .eq("owner_type", "CHAPTER")
        .eq("owner_id", chapterId || "")
        .maybeSingle();

      // Get referral events for this chapter
      const { data: referralEvents } = await adminSupabase
        .from("referral_events")
        .select("*")
        .eq("referrer_type", "CHAPTER")
        .eq("referrer_id", chapterId || "")
        .order("created_at", { ascending: false })
        .limit(50);

      // Compute performance metrics
      const signups = referralEvents?.filter(e => e.event_type === "SIGNUP").length || 0;
      const paidConversions = referralEvents?.filter(e => 
        ["NOMINATION_PAID", "VOTE_PAID", "TICKET", "DONATION"].includes(e.event_type)
      ).length || 0;
      const totalAgcEarned = referralEvents?.reduce((sum, e) => sum + (e.reward_agc || 0), 0) || 0;

      // Get chapter members (profiles referred by this chapter)
      const { data: members, count: memberCount } = await adminSupabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("referred_by_chapter_id", chapterId || "")
        .limit(50);

      return respond({
        chapter,
        wallet: chapterWallet ? { account: chapterWallet, balance: chapterBalance } : null,
        recentTransactions: chapterTransactions,
        referral: chapterReferral,
        performance: {
          total_signups: signups,
          paid_conversions: paidConversions,
          total_agc_earned: totalAgcEarned,
        },
        members: members || [],
        memberCount: memberCount || 0,
      });
    }

    // ============================================================
    // GET /dashboard/admin - Admin dashboard data
    // ============================================================
    if (dashboardType === "admin" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);
      if (!(await hasRole(userId, "admin"))) return errorResponse("Forbidden", 403);

      // Get active season
      const { data: season } = await adminSupabase
        .from("seasons")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      // Finance overview - total AGC in circulation
      const { data: ledgerData } = await adminSupabase
        .from("wallet_ledger_entries")
        .select("agc_amount, usd_amount, entry_type, direction");

      const totalAgc = ledgerData?.reduce((sum, entry) => {
        return sum + (entry.direction === "CREDIT" ? entry.agc_amount : -entry.agc_amount);
      }, 0) || 0;

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

      const { count: dailyTx } = await adminSupabase
        .from("wallet_ledger_entries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", dayAgo.toISOString());

      const { count: weeklyTx } = await adminSupabase
        .from("wallet_ledger_entries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString());

      // Nomination stats
      const { count: totalNominations } = await adminSupabase
        .from("nominations")
        .select("*", { count: "exact", head: true })
        .eq("season_id", season?.id || "");

      const { count: pendingNominations } = await adminSupabase
        .from("nominations")
        .select("*", { count: "exact", head: true })
        .eq("season_id", season?.id || "")
        .eq("status", "pending");

      // Vote stats
      const { count: totalVotes } = await adminSupabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("season_id", season?.id || "");

      // Top chapters
      const { data: chapters } = await adminSupabase
        .from("chapters")
        .select("id, name, country")
        .eq("is_active", true);

      const { data: chapterReferrals } = await adminSupabase
        .from("referral_events")
        .select("referrer_id, event_type, reward_agc")
        .eq("referrer_type", "CHAPTER");

      const chapterPerformance = (chapters || []).map(c => {
        const refs = chapterReferrals?.filter(r => r.referrer_id === c.id) || [];
        return {
          id: c.id,
          name: c.name,
          country: c.country,
          total_signups: refs.filter(r => r.event_type === "SIGNUP").length,
          total_agc_earned: refs.reduce((s, r) => s + (r.reward_agc || 0), 0),
        };
      }).sort((a, b) => b.total_agc_earned - a.total_agc_earned).slice(0, 10);

      // Stage config
      const { data: stages } = await adminSupabase
        .from("stage_config")
        .select("*")
        .eq("season_id", season?.id || "");

      // Revenue splits
      const { data: revenueSplits } = await adminSupabase
        .from("revenue_splits")
        .select("*")
        .eq("season_id", season?.id || "");

      // Recent audit logs
      const { data: recentAudit } = await adminSupabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      return respond({
        season,
        finance: {
          total_agc_circulation: totalAgc,
          total_usd_equivalence: totalAgc * 0.1, // 10 AGC = 1 USD
          fx_rate: 0.1,
          revenue_by_category: revenueByCategory,
          transactions_summary: {
            daily: dailyTx || 0,
            weekly: weeklyTx || 0,
          },
        },
        nominations: {
          total: totalNominations || 0,
          pending: pendingNominations || 0,
        },
        votes: {
          total: totalVotes || 0,
        },
        topChapters: chapterPerformance,
        stages: stages || [],
        revenueSplits: revenueSplits || [],
        recentAuditLogs: recentAudit || [],
      });
    }

    return errorResponse("Not found", 404);

  } catch (error: unknown) {
    console.error("Dashboard function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
