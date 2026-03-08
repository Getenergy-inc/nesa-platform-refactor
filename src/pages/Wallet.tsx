import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { InstitutionalDashboardLayout } from "@/components/layout/InstitutionalDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import { Loader2, ArrowUpRight, ArrowDownLeft, Gift, Vote, Ticket, Users, ShoppingBag, Sparkles, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ReferralLinkCard } from "@/components/tickets";
import { AGC_NON_TRADEABLE_DISCLAIMER } from "@/constants/agc";
import { AGC_EARNING_METHODS, AGC_CONVERSION_RATE } from "@/config/agcConfig";

interface WalletBalance {
  agc_total: number;
  agc_withdrawable: number;
  agc_non_withdrawable: number;
  agc_bonus: number;
  usd_balance: number;
}

interface Transaction {
  id: string;
  direction: "CREDIT" | "DEBIT";
  amount: number;
  reason: string;
  source_type: string;
  created_at: string;
}

const REASON_ICONS: Record<string, React.ElementType> = {
  SPONSOR_PUBLIC_CREDIT: Gift,
  VOTE_SPEND: Vote,
  TICKET_BONUS: Ticket,
  REFERRAL_BONUS: Users,
  REFERRAL_BONUS_TICKET: Users,
  SHOP_BONUS: ShoppingBag,
  DAILY_SIGNIN: Gift,
  NOMINATION_REWARD: Gift,
  BONUS_FOR_PAYMENT: Ticket,
};

const REASON_LABELS: Record<string, string> = {
  SPONSOR_PUBLIC_CREDIT: "Sponsor Pool Credit",
  VOTE_SPEND: "Vote Spend",
  TICKET_BONUS: "Ticket Bonus AGC",
  REFERRAL_BONUS: "Referral Bonus AGC",
  REFERRAL_BONUS_TICKET: "Referral Bonus AGC",
  SHOP_BONUS: "Shop Bonus AGC",
  DAILY_SIGNIN: "Daily Sign-in",
  NOMINATION_REWARD: "Nomination Reward",
  BONUS_FOR_PAYMENT: "Ticket Bonus AGC",
};

export default function Wallet() {
  const { user, loading: authLoading } = useAuth();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWallet();
    }
  }, [user]);

  const loadWallet = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Get wallet account
      const { data: account } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "USER")
        .eq("owner_id", user.id)
        .single();

      if (account) {
        // Get balance using RPC
        const { data: balanceData } = await supabase.rpc("get_wallet_balance", {
          p_account_id: account.id,
        });

        if (balanceData && Array.isArray(balanceData) && balanceData.length > 0) {
          setBalance(balanceData[0] as WalletBalance);
        }

        // Get transactions - use amount column (the actual column name)
        const { data: txData } = await supabase
          .from("wallet_ledger_entries")
          .select("id, direction, amount, reason, source_type, created_at")
          .eq("account_id", account.id)
          .order("created_at", { ascending: false })
          .limit(20);

        if (txData) {
          setTransactions(txData as unknown as Transaction[]);
        }
      }
    } catch (e) {
      console.error("Failed to load wallet:", e);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirect=/wallet" replace />;
  }

  return (
    <InstitutionalDashboardLayout title="My Wallet" breadcrumbs={[{ label: "Wallet" }]}>
      <Helmet>
        <title>My Wallet | NESA-Africa</title>
        <meta name="description" content="View your AGC balance and transaction history." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">My Wallet</h1>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Balance Card */}
              <Card className="bg-gradient-to-r from-primary/10 to-gold/10 border-primary/30 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <GFAWalletIcon size={48} />
                    <div>
                      <p className="text-sm text-muted-foreground">Total AGC Balance</p>
                      <p className="text-4xl font-bold text-gold">
                        {balance?.agc_total?.toLocaleString() || 0} AGC
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-card/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Bonus AGC</p>
                      <p className="text-lg font-semibold text-gold">{balance?.agc_bonus || 0}</p>
                    </div>
                    <div className="text-center p-3 bg-card/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">USD Balance</p>
                      <p className="text-lg font-semibold">${balance?.usd_balance || 0}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link to="/vote">
                        <Vote className="mr-2 h-4 w-4" />
                        Vote with AGC
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/earn-voting-credits">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Earn More
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/gfawzip">
                        <GFAWalletIcon size={16} />
                        <span className="ml-2">Top Up</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Referral Section */}
              <div className="mb-8">
                <ReferralLinkCard />
              </div>

              {/* Transactions */}
              <Card className="bg-card border-border mb-8">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((tx) => {
                        const Icon = REASON_ICONS[tx.reason] || Gift;
                        const label = REASON_LABELS[tx.reason] || tx.reason;
                        const isCredit = tx.direction === "CREDIT";

                        return (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${isCredit ? "bg-primary/10" : "bg-destructive/10"}`}>
                                {isCredit ? (
                                  <ArrowDownLeft className="h-4 w-4 text-primary" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4 text-destructive" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(tx.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className={`font-bold ${isCredit ? "text-primary" : "text-destructive"}`}>
                              {isCredit ? "+" : "-"}{tx.amount} AGC
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Wallet FAQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="what-is-agc">
                      <AccordionTrigger>What is AGC?</AccordionTrigger>
                      <AccordionContent>
                        AGC (Afri Gold Coin) is a non-tradeable voting credit used within the NESA-Africa/SCEF ecosystem. You can earn AGC through various activities and use it to vote for nominees.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="how-to-earn">
                      <AccordionTrigger>How do I earn AGC?</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 text-sm">
                          {AGC_EARNING_METHODS.filter(m => m.isActive).map(method => (
                            <li key={method.id}>• {method.title}: {method.reward}</li>
                          ))}
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">
                          {AGC_CONVERSION_RATE} AGCc = 1 AGC (1 Vote)
                        </p>
                        <div className="mt-3">
                          <Button asChild size="sm" variant="outline">
                            <Link to="/earn-voting-credits">
                              <Sparkles className="mr-2 h-3 w-3" />
                              View All Earning Methods
                            </Link>
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="can-withdraw">
                      <AccordionTrigger>Can I withdraw or cash out AGC?</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-warning font-medium">
                          No. AGC is non-tradeable—no withdrawals, no cash-out, no payouts.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          AGC is used exclusively for voting within the NESA-Africa/SCEF ecosystem.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Disclaimer */}
                  <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                    <p className="text-xs text-warning text-center">
                      ⚠️ {AGC_NON_TRADEABLE_DISCLAIMER}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
