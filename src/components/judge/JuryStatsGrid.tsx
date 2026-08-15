import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Clock, CheckCircle, Calendar, AlertTriangle } from "lucide-react";
import type { JuryStats } from "@/hooks/useJuryData";

interface JuryStatsGridProps {
  stats: JuryStats | undefined;
  isLoading: boolean;
  /** Real days remaining, derived from the canonical Icon calendar. Omitted when unknown. */
  daysRemaining?: number;
}

export function JuryStatsGrid({ stats, isLoading, daysRemaining }: JuryStatsGridProps) {
  const statItems = [
    { 
      label: "Assigned Finalists", 
      value: stats?.total ?? 0, 
      icon: Trophy, 
      color: "text-gold" 
    },
    { 
      label: "Pending Scores", 
      value: stats?.pending ?? 0, 
      icon: Clock, 
      color: "text-yellow-500" 
    },
    { 
      label: "Completed", 
      value: stats?.completed ?? 0, 
      icon: CheckCircle, 
      color: "text-green-500" 
    },
    ...(typeof daysRemaining === "number"
      ? [{ label: "Days Remaining", value: daysRemaining, icon: Calendar, color: "text-gold/80" }]
      : []),
  ];

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-white/10 bg-arena-panel">
            <CardContent className="pt-6 text-center">
              <Skeleton className="h-6 w-6 mx-auto mb-2 rounded-full" />
              <Skeleton className="h-8 w-12 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {statItems.map((stat) => (
        <Card key={stat.label} className="rounded-xl border-white/10 bg-arena-panel">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </span>
            <div className="min-w-0 text-left">
              <p className="font-playfair text-2xl font-bold leading-none text-white">{stat.value}</p>
              <p className="mt-1 truncate text-sm text-white/70">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Show recused if any */}
      {stats && stats.recused > 0 && (
        <Card className="border-orange-500/20 bg-orange-500/5 col-span-2 md:col-span-4">
          <CardContent className="pt-4 flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <p className="text-sm text-orange-400">
              {stats.recused} assignment{stats.recused !== 1 ? 's' : ''} recused due to COI
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
