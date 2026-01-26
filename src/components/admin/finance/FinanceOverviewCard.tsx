import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Coins, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { FinanceOverview } from "@/types/admin";

interface FinanceOverviewCardProps {
  data: FinanceOverview | null;
  loading?: boolean;
}

export function FinanceOverviewCard({ data, loading }: FinanceOverviewCardProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "AGC in Circulation",
      value: data?.total_agc_circulation?.toLocaleString() ?? "0",
      suffix: "AGC",
      icon: Coins,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "USD Equivalence",
      value: `$${(data?.total_usd_equivalence ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "FX Rate",
      value: `1 AGC = $${data?.fx_rate?.toFixed(4) ?? "0.0000"}`,
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      sublabel: data?.fx_rate_updated_at 
        ? `Updated ${new Date(data.fx_rate_updated_at).toLocaleDateString()}`
        : undefined,
    },
    {
      label: "Weekly Transactions",
      value: data?.transactions_summary?.weekly?.toLocaleString() ?? "0",
      icon: ArrowUpRight,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {stat.suffix}
                    </span>
                  )}
                </p>
                {stat.sublabel && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.sublabel}</p>
                )}
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
