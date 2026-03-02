import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSeason } from "@/contexts/SeasonContext";
import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useRegionNomineeCounts } from "@/hooks/useRegionNomineeCounts";
import { toast } from "sonner";
import {
  FinanceOverviewCard,
  RevenueByCategoryCard,
  FXRateCard,
  NominationTrendsCard,
  TopPerformersCard,
  VoteLogsCard,
  RevenueSplitsCard,
  DisbursementRunsCard,
  StageControlCard,
  AuditTrailCard,
  PaymentProviderStatusCard,
  APILogsCard,
} from "@/components/admin";
import type {
  FinanceOverview,
  NominationTrend,
  ChapterPerformance,
  AmbassadorPerformance,
  VoteLog,
  RiskFlag,
  RevenueSplit,
  DisbursementRun,
  StageConfig,
  AuditLogEntry,
  PaymentProviderStatus,
  APILogSummary,
} from "@/types/admin";

export default function AdminDashboard() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const { currentEdition } = useSeason();

  // State for all data
  const [loading, setLoading] = useState(true);
  const [seasonId, setSeasonId] = useState<string | null>(null);
  const [financeData, setFinanceData] = useState<FinanceOverview | null>(null);
  const [nominationTrends, setNominationTrends] = useState<NominationTrend[]>(
    [],
  );
  const [chapters, setChapters] = useState<ChapterPerformance[]>([]);
  const [ambassadors, setAmbassadors] = useState<AmbassadorPerformance[]>([]);
  const [voteLogs, setVoteLogs] = useState<VoteLog[]>([]);
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>([]);
  const [voteLogsPage, setVoteLogsPage] = useState(1);
  const [voteLogsTotalPages, setVoteLogsTotalPages] = useState(1);
  const [revenueSplits, setRevenueSplits] = useState<RevenueSplit[]>([]);
  const [disbursementRuns, setDisbursementRuns] = useState<DisbursementRun[]>(
    [],
  );
  const [stages, setStages] = useState<StageConfig[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [providerStatus, setProviderStatus] = useState<PaymentProviderStatus[]>(
    [],
  );
  const [apiLogs, setApiLogs] = useState<APILogSummary[]>([]);

  // Fetch current season ID - must be before early returns
  useEffect(() => {
    const fetchSeasonId = async () => {
      const { data } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .maybeSingle();
      if (data) setSeasonId(data.id);
    };
    fetchSeasonId();
  }, [currentEdition]);

  // Load initial data - must be before early returns
  useEffect(() => {
    if (!seasonId || authLoading || !user || !hasRole("admin")) return;
    loadDashboardData();
  }, [seasonId, authLoading, user]);

  // Check authorization - after all hooks
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // if (!authLoading) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadFinanceData(),
        loadNominationTrends(),
        loadChapterPerformance(),
        loadAmbassadorPerformance(),
        loadVoteLogs(1),
        loadRevenueSplits(),
        loadDisbursementRuns(),
        loadStages(),
        loadAuditLogs(1),
        loadProviderStatus(),
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadFinanceData = async () => {
    // Aggregate finance data from ledger
    const { data: ledgerData } = await supabase
      .from("wallet_ledger_entries")
      .select("agc_amount, usd_amount, entry_type, direction");

    const totalAgc =
      ledgerData?.reduce((sum, entry) => {
        return (
          sum +
          (entry.direction === "CREDIT" ? entry.agc_amount : -entry.agc_amount)
        );
      }, 0) ?? 0;

    const revenueByCategory = {
      nomination:
        ledgerData
          ?.filter((e) => e.entry_type === "NOMINATION_FEE")
          .reduce((s, e) => s + e.usd_amount, 0) ?? 0,
      vote:
        ledgerData
          ?.filter((e) => e.entry_type === "VOTE_FEE")
          .reduce((s, e) => s + e.usd_amount, 0) ?? 0,
      donation:
        ledgerData
          ?.filter((e) => e.entry_type === "DONATION")
          .reduce((s, e) => s + e.usd_amount, 0) ?? 0,
      ticket:
        ledgerData
          ?.filter((e) => e.entry_type === "TICKET")
          .reduce((s, e) => s + e.usd_amount, 0) ?? 0,
    };

    // Get transaction counts
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const { count: dailyCount } = await supabase
      .from("wallet_ledger_entries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", dayAgo.toISOString());

    const { count: weeklyCount } = await supabase
      .from("wallet_ledger_entries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString());

    const { count: monthlyCount } = await supabase
      .from("wallet_ledger_entries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthAgo.toISOString());

    const fxRate = 0.01; // Default FX rate - should come from a config table

    setFinanceData({
      total_agc_circulation: totalAgc,
      total_usd_equivalence: totalAgc * fxRate,
      fx_rate: fxRate,
      fx_rate_updated_at: new Date().toISOString(),
      revenue_by_category: revenueByCategory,
      transactions_summary: {
        daily: dailyCount ?? 0,
        weekly: weeklyCount ?? 0,
        monthly: monthlyCount ?? 0,
      },
    });
  };

  const loadNominationTrends = async () => {
    // Get nomination counts by day for the last 30 days
    const { data } = await supabase
      .from("nominations")
      .select("created_at")
      .order("created_at", { ascending: true });

    // Group by date
    const grouped = new Map<string, number>();
    data?.forEach((n) => {
      const date = new Date(n.created_at!).toISOString().split("T")[0];
      grouped.set(date, (grouped.get(date) ?? 0) + 1);
    });

    const trends: NominationTrend[] = Array.from(grouped.entries()).map(
      ([date, count]) => ({
        date,
        count,
      }),
    );

    setNominationTrends(trends);
  };

  const loadChapterPerformance = async () => {
    const { data: chaptersData } = await supabase
      .from("chapters")
      .select("id, name, country")
      .eq("is_active", true);

    const { data: referralData } = await supabase
      .from("referral_events")
      .select("referrer_id, referrer_type, event_type, reward_agc")
      .eq("referrer_type", "CHAPTER");

    const performance: ChapterPerformance[] = (chaptersData ?? []).map(
      (chapter) => {
        const chapterReferrals =
          referralData?.filter((r) => r.referrer_id === chapter.id) ?? [];
        return {
          id: chapter.id,
          name: chapter.name,
          country: chapter.country,
          total_signups: chapterReferrals.filter(
            (r) => r.event_type === "SIGNUP",
          ).length,
          paid_conversions: chapterReferrals.filter((r) =>
            ["NOMINATION_PAID", "VOTE_PAID"].includes(r.event_type),
          ).length,
          total_agc_earned: chapterReferrals.reduce(
            (sum, r) => sum + (r.reward_agc ?? 0),
            0,
          ),
        };
      },
    );

    setChapters(
      performance.sort((a, b) => b.total_agc_earned - a.total_agc_earned),
    );
  };

  const loadAmbassadorPerformance = async () => {
    const { data: referralData } = await supabase
      .from("referrals")
      .select("owner_id, total_referrals, total_earnings_agc")
      .eq("owner_type", "USER")
      .order("total_earnings_agc", { ascending: false })
      .limit(10);

    const userIds = referralData?.map((r) => r.owner_id) ?? [];

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", userIds);

    const ambassadors: AmbassadorPerformance[] = (referralData ?? []).map(
      (r) => {
        const profile = profiles?.find((p) => p.user_id === r.owner_id);
        return {
          user_id: r.owner_id,
          full_name: profile?.full_name ?? null,
          email: profile?.email ?? "",
          total_referrals: r.total_referrals ?? 0,
          total_agc_earned: r.total_earnings_agc ?? 0,
        };
      },
    );

    setAmbassadors(ambassadors);
  };

  const loadVoteLogs = async (page: number) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const { data, count } = await supabase
      .from("votes")
      .select(
        `
        id,
        voter_id,
        nominee_id,
        vote_type,
        created_at,
        nominees!inner(name)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const logs: VoteLog[] = (data ?? []).map((v) => ({
      id: v.id,
      voter_id: v.voter_id,
      nominee_id: v.nominee_id,
      nominee_name: (v.nominees as any)?.name ?? "Unknown",
      vote_type: v.vote_type,
      created_at: v.created_at!,
    }));

    setVoteLogs(logs);
    setVoteLogsPage(page);
    setVoteLogsTotalPages(Math.ceil((count ?? 0) / limit));
  };

  const loadRevenueSplits = async () => {
    if (!seasonId) return;

    const { data } = await supabase
      .from("revenue_splits")
      .select("*")
      .eq("season_id", seasonId)
      .order("split_key");

    setRevenueSplits((data ?? []) as RevenueSplit[]);
  };

  const loadDisbursementRuns = async () => {
    if (!seasonId) return;

    const { data } = await supabase
      .from("disbursement_runs")
      .select("*")
      .eq("season_id", seasonId)
      .order("run_date", { ascending: false });

    setDisbursementRuns((data ?? []) as DisbursementRun[]);
  };

  const loadStages = async () => {
    if (!seasonId) return;

    const { data } = await supabase
      .from("stage_config")
      .select("*")
      .eq("season_id", seasonId)
      .order("action");

    setStages((data ?? []) as StageConfig[]);
  };

  const loadAuditLogs = async (
    page: number,
    filters?: { action?: string; entity_type?: string },
  ) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.action) query = query.eq("action", filters.action);
    if (filters?.entity_type)
      query = query.eq("entity_type", filters.entity_type);

    const { data, count } = await query;

    setAuditLogs((data ?? []) as AuditLogEntry[]);
    setAuditPage(page);
    setAuditTotalPages(Math.ceil((count ?? 0) / limit));
  };

  const loadProviderStatus = async () => {
    // Mock provider status - in production, this would ping actual endpoints
    const providers: PaymentProviderStatus[] = [
      {
        provider: "PAYSTACK",
        status: "online",
        last_ping_at: new Date().toISOString(),
        response_time_ms: 120,
        success_rate_24h: 99.8,
      },
      {
        provider: "FLUTTERWAVE",
        status: "online",
        last_ping_at: new Date().toISOString(),
        response_time_ms: 150,
        success_rate_24h: 99.5,
      },
      {
        provider: "LEMFI",
        status: "online",
        last_ping_at: new Date().toISOString(),
        response_time_ms: 200,
        success_rate_24h: 98.9,
      },
      {
        provider: "TAPTAPSEND",
        status: "degraded",
        last_ping_at: new Date().toISOString(),
        response_time_ms: 450,
        success_rate_24h: 95.2,
      },
    ];
    setProviderStatus(providers);
  };

  // Action handlers
  const handleUpdateFXRate = async (newRate: number) => {
    // In production, save to a config table
    setFinanceData((prev) =>
      prev
        ? {
            ...prev,
            fx_rate: newRate,
            fx_rate_updated_at: new Date().toISOString(),
          }
        : null,
    );
  };

  const handleUpdateSplit = async (
    id: string,
    updates: Partial<RevenueSplit>,
  ) => {
    const { error } = await supabase
      .from("revenue_splits")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    await loadRevenueSplits();
  };

  const handleAddSplit = async (
    split: Omit<RevenueSplit, "id" | "created_at" | "updated_at">,
  ) => {
    const { error } = await supabase.from("revenue_splits").insert(split);

    if (error) throw error;
    await loadRevenueSplits();
  };

  const handleRunDisbursement = async (notes: string) => {
    if (!seasonId) return;

    const { error } = await supabase.from("disbursement_runs").insert({
      season_id: seasonId,
      run_date: new Date().toISOString().split("T")[0],
      status: "DRAFT",
      notes,
      total_amount_usd: 0,
    });

    if (error) throw error;
    await loadDisbursementRuns();
  };

  const handleUpdateStage = async (
    id: string,
    updates: Partial<StageConfig>,
  ) => {
    const { error } = await supabase
      .from("stage_config")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    await loadStages();
  };

  const handleExportAuditLogs = async () => {
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Audit logs exported");
  };

  if (authLoading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Super Admin Dashboard"
      breadcrumbs={[{ label: "Admin" }]}
    >
      <Tabs defaultValue="finance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
          <TabsTrigger value="stages">Stages</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Finance Tab */}
        <TabsContent value="finance" className="space-y-6">
          <FinanceOverviewCard data={financeData} loading={loading} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueByCategoryCard data={financeData} loading={loading} />
            <FXRateCard
              currentRate={financeData?.fx_rate ?? 0.01}
              lastUpdated={financeData?.fx_rate_updated_at ?? null}
              onUpdateRate={handleUpdateFXRate}
            />
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <RegionNomineeStatsCard />
          <NominationTrendsCard data={nominationTrends} loading={loading} />
          <TopPerformersCard
            chapters={chapters}
            ambassadors={ambassadors}
            loading={loading}
          />
          <VoteLogsCard
            logs={voteLogs}
            riskFlags={riskFlags}
            loading={loading}
            page={voteLogsPage}
            totalPages={voteLogsTotalPages}
            onPageChange={loadVoteLogs}
          />
        </TabsContent>

        {/* Disbursements Tab */}
        <TabsContent value="disbursements" className="space-y-6">
          <RevenueSplitsCard
            splits={revenueSplits}
            loading={loading}
            onUpdateSplit={handleUpdateSplit}
            onAddSplit={handleAddSplit}
          />
          <DisbursementRunsCard
            runs={disbursementRuns}
            loading={loading}
            onRunDisbursement={handleRunDisbursement}
            onViewDetails={(id) => console.log("View details:", id)}
          />
        </TabsContent>

        {/* Stages Tab */}
        <TabsContent value="stages" className="space-y-6">
          <StageControlCard
            stages={stages}
            loading={loading}
            onUpdateStage={handleUpdateStage}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentProviderStatusCard
              providers={providerStatus}
              loading={loading}
              onRefresh={loadProviderStatus}
            />
            <APILogsCard logs={apiLogs} loading={loading} />
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <AuditTrailCard
            logs={auditLogs}
            loading={loading}
            page={auditPage}
            totalPages={auditTotalPages}
            onPageChange={loadAuditLogs}
            onFilter={(filters) => loadAuditLogs(1, filters)}
            onExport={handleExportAuditLogs}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

function RegionNomineeStatsCard() {
  const { data, isLoading } = useRegionNomineeCounts();
  const { regionCounts = [], totalCount = 0 } = data || {};

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Nominees by Region</h3>
        <span className="text-2xl font-bold text-primary">{totalCount.toLocaleString()}</span>
      </div>
      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {regionCounts.map((r) => (
            <div key={r.region_slug} className="rounded-lg bg-muted/50 p-3 text-center">
              <div className="text-xl font-bold">{r.nominee_count}</div>
              <div className="text-xs text-muted-foreground truncate">{r.region_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
