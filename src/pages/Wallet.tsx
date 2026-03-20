import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InstitutionalDashboardLayout } from "@/components/layout/InstitutionalDashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";

import { TopUpDialog } from "@/components/dashboard/wallet";

import { userApi, type UserDetails } from "@/api/user";
import type {
  WalletBalance,
  WalletLedgerEntry,
  Referral,
} from "@/types/wallet";
import { WalletBalanceCard } from "@/components/dashboard/wallet/WalletBalanceCard";
import { WalletStatsCards } from "@/components/dashboard/wallet/WalletStatsCard";
import { TopUpSection } from "@/components/dashboard/wallet/TopUpSection";
import { ReferralSection } from "@/components/dashboard/wallet/ReferralSection";
import { TransactionsTable } from "@/components/dashboard/wallet/TransactionTables";
import { WalletSettings } from "@/components/dashboard/wallet/WalletSettings";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function WalletContent() {
  const { user, accessToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletLedgerEntry[]>([]);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [totalReferralEarnings, setTotalReferralEarnings] = useState(0);

  const [topUpOpen, setTopUpOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const loadWalletData = useCallback(
    async (showRefresh = false) => {
      if (!user || !accessToken) return;

      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const userDetails = await userApi.fetchUserDetails(accessToken);

        // Wallet Balance
        const userBalance = Number(userDetails.wallet.balance).toFixed(2);
        setBalance({
          agc_total: userBalance,
        } as WalletBalance);

        // Transactions
        const sortedTransactions = userDetails.wallet.walletTransactions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setTransactions(sortedTransactions as WalletLedgerEntry[]);

        // Referral
        if (userDetails.referral) {
          setReferral(userDetails.referral);
          const total = userDetails.referral.events.reduce(
            (sum: number, e: any) => sum + (e.reward_agc || 0),
            0,
          );
          setTotalReferralEarnings(total);
        }
      } catch (err) {
        console.error("Wallet data load error:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user, accessToken],
  );

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  return (
    <>
      <Helmet>
        <title>Wallet | NESA-Africa</title>
        <meta
          name="description"
          content="Manage your AGC wallet, view transactions, and top up your balance."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">
              Wallet
            </h1>
            <p className="text-ivory/60 text-sm sm:text-base">
              Manage your AGC coins and view transaction history
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => loadWalletData(true)}
            disabled={refreshing}
            className="w-full sm:w-auto border-gold/30 text-gold hover:bg-gold/10"
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")}
            />
            Refresh
          </Button>
        </div>

        {/* Balance */}
        <WalletBalanceCard balance={balance} loading={loading} />

        {/* Stats */}
        <WalletStatsCards transactions={transactions} loading={loading} />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          {/* Tabs List */}
          <div className="overflow-x-auto">
            <TabsList className="w-full sm:w-auto flex-nowrap bg-white/5 border border-white/10">
              <TabsTrigger
                value="overview"
                className="flex-1 sm:flex-none data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="flex-1 sm:flex-none data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex-1 sm:flex-none data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Up */}
              <TopUpSection onTopUp={() => setTopUpOpen(true)} />

              {/* Recent Transactions */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
                  Recent Transactions
                </h2>
                <TransactionsTable
                  transactions={transactions.slice(0, 5)}
                  loading={loading}
                  showViewAll={true}
                  onViewAll={() => setActiveTab("transactions")}
                />
              </div>

              {/* Optional Referral Section (if re-enabled later) */}
              {/* <ReferralSection
              referral={referral}
              totalEarnings={totalReferralEarnings}
              loading={loading}
            /> */}
            </div>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-4">
            <TransactionsTable
              transactions={transactions}
              loading={loading}
              showAll={true}
            />
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
            <WalletSettings />
          </TabsContent>
        </Tabs>
      </div>

      <TopUpDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        onSuccess={() => loadWalletData()}
      />
    </>
  );
}

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <InstitutionalDashboardLayout
        title="Wallet"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Wallet" },
        ]}
      >
        <WalletContent />
      </InstitutionalDashboardLayout>
    </ProtectedRoute>
  );
}
