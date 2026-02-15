/**
 * AGC Dashboard Component
 * 
 * User-facing Afrigold Participation Credit dashboard showing:
 * - Live AGCc balance and converted AGC
 * - Votes used
 * - Next voting window
 * - Auto-conversion progress
 */

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Coins,
  ArrowRightLeft,
  Vote,
  Calendar,
  TrendingUp,
  ArrowRight,
  Shield,
} from "lucide-react";
import {
  AGC_CONVERSION_RATE,
  formatAgcc,
  formatAgc,
  getNextVotingPhase,
  getCurrentVotingPhase,
  VOTING_PHASES,
} from "@/config/agcConfig";

interface WalletData {
  accountId: string;
  balanceAgcc: number;
  balanceAgc: number;
  votesUsed: number;
}

function useAGCWallet() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["agc-wallet", user?.id],
    queryFn: async (): Promise<WalletData | null> => {
      if (!user) return null;

      const { data: account } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "USER")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!account) return null;

      const { data: balance } = await supabase
        .from("wallet_balances")
        .select("balance_agcc, balance_agc")
        .eq("account_id", account.id)
        .maybeSingle();

      // Count votes used this season
      const { count: votesUsed } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("voter_id", user.id);

      return {
        accountId: account.id,
        balanceAgcc: balance?.balance_agcc ?? 0,
        balanceAgc: Number(balance?.balance_agc ?? 0),
        votesUsed: votesUsed ?? 0,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
  });
}

export function AGCDashboard() {
  const { user } = useAuth();
  const { data: wallet, isLoading } = useAGCWallet();

  const currentPhase = getCurrentVotingPhase();
  const nextPhase = getNextVotingPhase();
  const activePhase = currentPhase || nextPhase;

  const conversionProgress = wallet
    ? ((wallet.balanceAgcc % AGC_CONVERSION_RATE) / AGC_CONVERSION_RATE) * 100
    : 0;
  const agccToNextConversion = wallet
    ? AGC_CONVERSION_RATE - (wallet.balanceAgcc % AGC_CONVERSION_RATE)
    : AGC_CONVERSION_RATE;

  if (!user) {
    return (
      <Card className="border-gold/20 bg-gradient-to-br from-card to-gold/5">
        <CardContent className="p-6 text-center">
          <Coins className="h-10 w-10 text-gold mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold mb-2">
            Afrigold Participation Credit
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create an account to start earning AGCc and voting for Africa's education champions.
          </p>
          <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
            <Link to="/auth/register">
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Balance Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* AGCc Balance */}
        <Card className="border-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">AGCc Balance</span>
              <Coins className="h-4 w-4 text-gold" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-display font-bold text-gold">
                {formatAgcc(wallet?.balanceAgcc ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* AGC (Voting Credits) */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Voting Credits</span>
              <Vote className="h-4 w-4 text-primary" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-display font-bold text-primary">
                {formatAgc(wallet?.balanceAgc ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Votes Used */}
        <Card className="border-muted">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Votes Cast</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-display font-bold">
                {wallet?.votesUsed ?? 0}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conversion Progress */}
      <Card className="border-gold/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowRightLeft className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium">Auto-Conversion Progress</span>
            <Badge variant="secondary" className="text-xs ml-auto">
              {AGC_CONVERSION_RATE} AGCc = 1 AGC
            </Badge>
          </div>
          <Progress value={conversionProgress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {agccToNextConversion} more AGCc until next auto-conversion to 1 AGC
          </p>
        </CardContent>
      </Card>

      {/* Next Voting Window */}
      {activePhase && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {currentPhase ? "Voting Open Now" : "Next Voting Window"}
              </span>
              {currentPhase && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs ml-auto">
                Live
              </Badge>
              )}
            </div>
            <p className="font-semibold text-sm">{activePhase.name}</p>
            <p className="text-xs text-muted-foreground mb-3">
              {activePhase.description} — {activePhase.dates.votingOpens} to {activePhase.dates.votingCloses}
            </p>
            <div className="flex gap-2">
              {currentPhase ? (
                <Button size="sm" asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                  <Link to="/vote">
                    Vote Now <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              ) : (
                <Button size="sm" variant="outline" asChild>
                  <Link to="/about-agc#calendar">
                    View Calendar <Calendar className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
              <Button size="sm" variant="ghost" asChild>
                <Link to="/about-agc">
                  Learn About AGC
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legal Disclaimer */}
      <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <Shield className="h-3 w-3 shrink-0" />
        <span>AGC is a non-tradeable participation credit — no withdrawals, no cash-out, no monetary value.</span>
      </div>
    </div>
  );
}
