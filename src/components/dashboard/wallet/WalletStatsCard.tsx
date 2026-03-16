import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { WalletLedgerEntry } from "@/types/wallet";

interface WalletStatsCardsProps {
  transactions: WalletLedgerEntry[];
  loading?: boolean;
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0.00";
  return value.toFixed(2);
}

function StatCardSkeleton() {
  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-900/30 to-black/60 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        <Skeleton className="h-4 w-24 bg-amber-500/20" />
        <Skeleton className="h-10 w-32 bg-amber-500/20" />
      </CardContent>
    </Card>
  );
}

export function WalletStatsCards({
  transactions,
  loading,
}: WalletStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const credits = transactions.filter((t) => t.walletDirection === "CREDIT");
  const debits = transactions.filter((t) => t.walletDirection === "DEBIT");

  const totalInflow = credits.reduce(
    (sum, t) => sum + Number(t.agcAmount || 0),
    0,
  );

  const totalOutflow = debits.reduce(
    (sum, t) => sum + Number(t.agcAmount || 0),
    0,
  );

  const now = new Date();

  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.createdAt);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });

  const monthlyPercent =
    transactions.length > 0
      ? (thisMonth.length / transactions.length) * 100
      : 0;

  const avgInflow = credits.length ? totalInflow / credits.length : 0;
  const avgOutflow = debits.length ? totalOutflow / debits.length : 0;

  const stats = [
    {
      key: "inflow",
      title: "Total Inflow",
      value: formatNumber(totalInflow),
      icon: ArrowUpCircle,
      color: "emerald",
      trend: "up",
      extra: `${formatNumber(avgInflow)} AGC avg`,
    },
    {
      key: "outflow",
      title: "Total Outflow",
      value: formatNumber(totalOutflow),
      icon: ArrowDownCircle,
      color: "rose",
      trend: "down",
      extra: `${formatNumber(avgOutflow)} AGC avg`,
    },
    {
      key: "transactions",
      title: "Transactions",
      value: transactions.length.toString(),
      icon: Clock,
      color: "blue",
      extra: "All time",
    },
    {
      key: "month",
      title: "This Month",
      value: thisMonth.length.toString(),
      icon: Calendar,
      color: "purple",
      trend:
        monthlyPercent > 0 ? "up" : monthlyPercent < 0 ? "down" : "neutral",
      extra: `${monthlyPercent.toFixed(1)}% activity`,
    },
  ];

  const colorMap = {
    emerald: {
      border: "border-emerald-500/20",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      glow: "shadow-emerald-500/20",
    },
    rose: {
      border: "border-rose-500/20",
      iconBg: "bg-rose-500/20",
      iconColor: "text-rose-400",
      glow: "shadow-rose-500/20",
    },
    blue: {
      border: "border-blue-500/20",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      glow: "shadow-blue-500/20",
    },
    purple: {
      border: "border-purple-500/20",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      glow: "shadow-purple-500/20",
    },
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const theme = colorMap[stat.color as keyof typeof colorMap];
        const Icon = stat.icon;

        return (
          <Card
            key={stat.key}
            className={cn(
              "group relative overflow-hidden bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
              theme.border,
              theme.glow,
            )}
          >
            {/* shimmer background */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_3s_linear_infinite]" />

            <CardContent className="relative p-6 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </p>

                  <p className="text-3xl font-bold text-white">
                    {stat.key === "inflow" || stat.key === "outflow" ? (
                      <>
                        {stat.value}
                        <span className="text-sm text-amber-400 ml-1">AGC</span>
                      </>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>

                <div
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center shadow-lg",
                    theme.iconBg,
                  )}
                >
                  <Icon className={cn("h-6 w-6", theme.iconColor)} />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{stat.extra}</span>

                {stat.trend && stat.trend !== "neutral" && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-0 text-xs font-medium",
                      stat.trend === "up"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-rose-500/20 text-rose-300",
                    )}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {monthlyPercent.toFixed(1)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
