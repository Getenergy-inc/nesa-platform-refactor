import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InstitutionalDashboardLayout } from "@/components/layout/InstitutionalDashboardLayout";

import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { InstitutionalCards } from "@/components/dashboard/InstitutionalCards";
import { AnnouncementsPanel } from "@/components/dashboard/AnnouncementsPanel";
import { CampaignTimelineCard } from "@/components/dashboard/CampaignTimelineCard";

import {
  TransactionsList,
  ReferralCard,
  TopUpDialog,
} from "@/components/dashboard/wallet";

import type {
  WalletBalance,
  WalletLedgerEntry,
  Referral,
} from "@/types/wallet";

import { userApi, type UserDetails } from "@/api/user";

function DashboardContent() {
  const { user, accessToken } = useAuth();

  const [loading, setLoading] = useState(true);

  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletLedgerEntry[]>([]);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [totalReferralEarnings, setTotalReferralEarnings] = useState(0);

  const [userDetails, setUserDetails] = useState<UserDetails>();

  const [topUpOpen, setTopUpOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    if (!user || !accessToken) return;

    try {
      setLoading(true);

      const userDetails = await userApi.fetchUserDetails(accessToken);
      setUserDetails(userDetails);

      /**
       * Wallet Balance
       */
      const userBalance = Number(userDetails.wallet.balance).toFixed(2);

      setBalance({
        agc_total: userBalance,
      } as WalletBalance);

      /**
       * Transactions
       */
      const sortedTransactions = userDetails.wallet.walletTransactions
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 10);

      setTransactions(sortedTransactions as WalletLedgerEntry[]);

      /**
       * Referral
       */
      // if (userDetails.referral) {
      //   setReferral(userDetails.referral);

      //   const total = userDetails.referral.events.reduce(
      //     (sum: number, e: any) => sum + (e.reward_agc || 0),
      //     0,
      //   );

      //   setTotalReferralEarnings(total);
      // }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }, [user, accessToken]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <InstitutionalDashboardLayout
      title="Dashboard"
      breadcrumbs={[{ label: "Overview" }]}
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Hero */}
        <DashboardHero />

        {/* Campaign Timeline */}
        <CampaignTimelineCard />

        {/* Institutional Cards */}
        <InstitutionalCards />

        {/* Announcements + Quick Links */}
        <AnnouncementsPanel onTopUp={() => setTopUpOpen(true)} />

        {/* Wallet + Referral */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* <TransactionsList
            transactions={transactions}
            loading={loading}
            limit={10}
          /> */}

          {/* <ReferralCard
            referral={referral}
            totalEarnings={totalReferralEarnings}
            loading={loading}
          /> */}
        </div>
      </div>
      <TopUpDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        onSuccess={loadDashboardData}
      />
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
