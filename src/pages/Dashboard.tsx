import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InstitutionalDashboardLayout } from "@/components/layout/InstitutionalDashboardLayout";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { InstitutionalCards } from "@/components/dashboard/InstitutionalCards";
import { AnnouncementsPanel } from "@/components/dashboard/AnnouncementsPanel";
import { CampaignTimelineCard } from "@/components/dashboard/CampaignTimelineCard";
import {
  BalanceCard,
  TransactionsList,
  ReferralCard,
  type RevenueSplit,
} from "@/components/dashboard/wallet";
import type { WalletBalance, WalletLedgerEntry, Referral } from "@/types/wallet";

function DashboardContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletLedgerEntry[]>([]);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [totalReferralEarnings, setTotalReferralEarnings] = useState(0);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data: walletAccount } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "USER")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (walletAccount) {
        const { data: balanceData } = await supabase
          .from("wallet_balances")
          .select("*")
          .eq("account_id", walletAccount.id)
          .maybeSingle();
        if (balanceData) setBalance(balanceData as WalletBalance);

        const { data: txData } = await supabase
          .from("wallet_ledger_entries")
          .select("*")
          .eq("account_id", walletAccount.id)
          .order("created_at", { ascending: false })
          .limit(5);
        if (txData) setTransactions(txData as WalletLedgerEntry[]);
      }

      const { data: referralData } = await supabase
        .from("referrals")
        .select("*")
        .eq("owner_type", "USER")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (referralData) {
        setReferral(referralData as Referral);
        const { data: eventsData } = await supabase
          .from("referral_events")
          .select("reward_agc")
          .eq("referrer_type", "USER")
          .eq("referrer_id", user.id);
        if (eventsData) {
          setTotalReferralEarnings(eventsData.reduce((s, e) => s + (e.reward_agc || 0), 0));
        }
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <InstitutionalDashboardLayout
      title="Dashboard"
      breadcrumbs={[{ label: "Overview" }]}
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Hero Welcome */}
        <DashboardHero />

        {/* Campaign Timeline */}
        <CampaignTimelineCard />

        {/* Institutional Content Cards */}
        <InstitutionalCards />

        {/* Announcements + Quick Links */}
        <AnnouncementsPanel />

        {/* Wallet + Referral row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <TransactionsList transactions={transactions} loading={loading} limit={5} />
          <ReferralCard referral={referral} totalEarnings={totalReferralEarnings} loading={loading} />
        </div>
      </div>
    </InstitutionalDashboardLayout>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
