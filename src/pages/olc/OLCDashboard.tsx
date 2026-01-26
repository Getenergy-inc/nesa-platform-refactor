import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  ChapterHeaderCard,
  ChapterPerformanceCard,
  ChapterActionsRow,
  SettlementRequestDialog,
  type ChapterPerformance,
} from "@/components/olc";
import { BalanceCard, AGCSummaryCard, TransactionsList } from "@/components/dashboard/wallet";
import type { WalletBalance, WalletLedgerEntry } from "@/types/wallet";
import type { Chapter } from "@/types/olc";

function OLCDashboardContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [settlementOpen, setSettlementOpen] = useState(false);
  
  // Data
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletLedgerEntry[]>([]);
  const [performance, setPerformance] = useState<ChapterPerformance | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Find the chapter where user is coordinator
      const { data: chapterData } = await supabase
        .from("chapters")
        .select("*")
        .eq("coordinator_user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (!chapterData) {
        // User is not a coordinator of any active chapter
        navigate("/unauthorized");
        return;
      }

      setChapter(chapterData as Chapter);

      // Get chapter's wallet account
      const { data: walletAccount } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "CHAPTER")
        .eq("owner_id", chapterData.id)
        .maybeSingle();

      if (walletAccount) {
        // Get balance from view
        const { data: balanceData } = await supabase
          .from("wallet_balances")
          .select("*")
          .eq("account_id", walletAccount.id)
          .maybeSingle();

        if (balanceData) {
          setBalance(balanceData as WalletBalance);
        }

        // Get recent transactions
        const { data: txData } = await supabase
          .from("wallet_ledger_entries")
          .select("*")
          .eq("account_id", walletAccount.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (txData) {
          setTransactions(txData as WalletLedgerEntry[]);
        }
      }

      // Calculate performance from referral events
      const { data: referralEvents } = await supabase
        .from("referral_events")
        .select("*")
        .eq("referrer_type", "CHAPTER")
        .eq("referrer_id", chapterData.id);

      if (referralEvents) {
        const signups = referralEvents.filter(e => e.event_type === "SIGNUP").length;
        const nominationsPaid = referralEvents.filter(e => e.event_type === "NOMINATION_PAID").length;
        const votesPaid = referralEvents.filter(e => e.event_type === "VOTE_PAID").length;
        const paidConversions = nominationsPaid + votesPaid;
        const totalEarningsAgc = referralEvents.reduce((sum, e) => sum + (e.reward_agc || 0), 0);
        const conversionRate = signups > 0 ? (paidConversions / signups) * 100 : 0;

        setPerformance({
          totalSignups: signups,
          paidConversions,
          nominationsPaid,
          votesPaid,
          totalEarningsAgc,
          conversionRate,
        });
      }
    } catch (error) {
      console.error("Failed to load OLC dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSettlementSuccess = () => {
    loadDashboardData();
  };

  return (
    <DashboardLayout
      title="Chapter Dashboard"
      breadcrumbs={[
        { label: "OLC", href: "/olc/dashboard" },
        { label: "Dashboard" },
      ]}
    >
      <div className="space-y-6">
        {/* Chapter Header */}
        <ChapterHeaderCard chapter={chapter} loading={loading} />

        {/* Balance + AGC Summary + Performance Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <BalanceCard balance={balance} loading={loading} />
          <AGCSummaryCard balance={balance} loading={loading} />
        </div>

        {/* Chapter Performance */}
        <ChapterPerformanceCard performance={performance} loading={loading} />

        {/* Chapter Actions */}
        <ChapterActionsRow onSettlementRequest={() => setSettlementOpen(true)} />

        {/* Transactions */}
        <TransactionsList transactions={transactions} loading={loading} limit={10} />
      </div>

      {/* Settlement Request Dialog */}
      <SettlementRequestDialog
        open={settlementOpen}
        onOpenChange={setSettlementOpen}
        balance={balance}
        chapterName={chapter?.name || "Chapter"}
        onSuccess={handleSettlementSuccess}
      />
    </DashboardLayout>
  );
}

export default function OLCDashboard() {
  return (
    <ProtectedRoute requiredRoles={["chapter", "admin"]}>
      <OLCDashboardContent />
    </ProtectedRoute>
  );
}
