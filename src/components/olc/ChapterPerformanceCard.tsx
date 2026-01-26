import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Wallet, CheckCircle, ArrowUpRight } from "lucide-react";
import { formatAgc } from "@/api/wallet";

export interface ChapterPerformance {
  totalSignups: number;
  paidConversions: number;
  nominationsPaid: number;
  votesPaid: number;
  totalEarningsAgc: number;
  conversionRate: number;
}

interface ChapterPerformanceCardProps {
  performance: ChapterPerformance | null;
  loading?: boolean;
}

export function ChapterPerformanceCard({ performance, loading }: ChapterPerformanceCardProps) {
  if (loading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Chapter Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: "Total Signups",
      value: performance?.totalSignups ?? 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Paid Conversions",
      value: performance?.paidConversions ?? 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      subLabel: `${performance?.nominationsPaid ?? 0} nominations, ${performance?.votesPaid ?? 0} votes`,
    },
    {
      label: "Total AGC Earned",
      value: formatAgc(performance?.totalEarningsAgc ?? 0),
      icon: Wallet,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      isFormatted: true,
    },
    {
      label: "Conversion Rate",
      value: `${(performance?.conversionRate ?? 0).toFixed(1)}%`,
      icon: ArrowUpRight,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      isFormatted: true,
    },
  ];

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          Chapter Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {stat.label === "Conversion Rate" && (
                  <Badge
                    variant="secondary"
                    className={
                      (performance?.conversionRate ?? 0) >= 50
                        ? "bg-green-100 text-green-700"
                        : (performance?.conversionRate ?? 0) >= 25
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {(performance?.conversionRate ?? 0) >= 50
                      ? "Excellent"
                      : (performance?.conversionRate ?? 0) >= 25
                      ? "Good"
                      : "Needs Work"}
                  </Badge>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">
                  {stat.isFormatted ? stat.value : stat.value.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                {stat.subLabel && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.subLabel}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Scorecard Progress */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Performance Score</span>
            <span className="font-medium">
              {Math.min(100, Math.round((performance?.conversionRate ?? 0) * 2))}%
            </span>
          </div>
          <Progress
            value={Math.min(100, Math.round((performance?.conversionRate ?? 0) * 2))}
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}
