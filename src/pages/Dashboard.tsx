import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSeason } from "@/contexts/SeasonContext";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  WalletHeaderCard,
  BalanceCard,
  AGCSummaryCard,
  QuickActionsRow,
  TransactionsList,
  ReferralCard,
  RevenueSharingCard,
  TopUpDialog,
  RoleSwitcher,
  type RevenueSplit,
} from "@/components/dashboard/wallet";
import { ChapterHighlightCard } from "@/components/dashboard/ChapterHighlightCard";
import { CampaignTimelineCard } from "@/components/dashboard/CampaignTimelineCard";
import type {
  WalletBalance,
  WalletLedgerEntry,
  Referral,
} from "@/types/wallet";
import type { AppRole } from "@/config/roles";

function DashboardContent() {
  const { user, roles } = useAuth();
  const { currentEdition } = useSeason();
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<AppRole>("user");
  
  // Wallet Data
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletLedgerEntry[]>([]);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [revenueSplits, setRevenueSplits] = useState<RevenueSplit[]>([]);
  const [totalReferralEarnings, setTotalReferralEarnings] = useState(0);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get user's wallet account
      const { data: walletAccount } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "USER")
        .eq("owner_id", user.id)
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

      // Get user's referral info
      const { data: referralData } = await supabase
        .from("referrals")
        .select("*")
        .eq("owner_type", "USER")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (referralData) {
        setReferral(referralData as Referral);
        
        // Calculate total referral earnings from events
        const { data: eventsData } = await supabase
          .from("referral_events")
          .select("reward_agc")
          .eq("referrer_type", "USER")
          .eq("referrer_id", user.id);

        if (eventsData) {
          const total = eventsData.reduce((sum, e) => sum + (e.reward_agc || 0), 0);
          setTotalReferralEarnings(total);
        }
      }

      // Get revenue splits for current season
      const { data: seasonData } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .maybeSingle();

      if (seasonData) {
        const { data: splitsData } = await supabase
          .from("revenue_splits")
          .select("split_key, percent, destination_description")
          .eq("season_id", seasonData.id)
          .eq("is_active", true);

        if (splitsData) {
          setRevenueSplits(splitsData as RevenueSplit[]);
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Set initial active role
  useEffect(() => {
    if (roles.length > 0 && !roles.includes(activeRole)) {
      setActiveRole(roles[0]);
    }
  }, [roles, activeRole]);

  const handleTopUpSuccess = () => {
    // Refresh wallet data after successful top-up
    loadDashboardData();
  };

  return (
    <DashboardLayout
      title="Dashboard"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-6">
        {/* Role Switcher (only if multiple roles) */}
        {roles.length > 1 && (
          <div className="flex justify-end">
            <RoleSwitcher currentRole={activeRole} onRoleChange={setActiveRole} />
          </div>
        )}

        {/* Chapter & Region Highlight */}
        <ChapterHighlightCard />

        {/* Wallet Header */}
        <WalletHeaderCard loading={loading} />

        {/* Campaign Timeline */}
        <CampaignTimelineCard />

        {/* Balance + AGC Summary Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <BalanceCard balance={balance} loading={loading} />
          <AGCSummaryCard balance={balance} loading={loading} />
          <RevenueSharingCard splits={revenueSplits} loading={loading} />
        </div>

        {/* Quick Actions */}
        <QuickActionsRow onTopUp={() => setTopUpOpen(true)} />

        {/* Transactions + Referral Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <TransactionsList transactions={transactions} loading={loading} limit={10} />
          <ReferralCard 
            referral={referral} 
            totalEarnings={totalReferralEarnings}
            loading={loading} 
          />
        </div>
      </div>

      {/* Top Up Dialog */}
      <TopUpDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        onSuccess={handleTopUpSuccess}
      />
    </DashboardLayout>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
