import { Users, Trophy, Calendar, TrendingUp } from "lucide-react";
import { useRegionNomineeCounts } from "@/hooks/useRegionNomineeCounts";

interface VotingStatsStripProps {
  variant?: "amber" | "blue";
}

export function VotingStatsStrip({ variant = "amber" }: VotingStatsStripProps) {
  const { data } = useRegionNomineeCounts();
  const total = data?.totalCount || 0;
  const topRegions = (data?.regionCounts || [])
    .filter(r => r.nominee_count > 0)
    .sort((a, b) => b.nominee_count - a.nominee_count)
    .slice(0, 3);

  const colors = variant === "amber" 
    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-200"
    : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-200";

  const periodText = variant === "amber" ? "Apr 10 – May 16, 2026" : "May 18 – Jun 17, 2026";
  const awardText = variant === "amber" ? "Gold Certificate Award" : "Blue Garnet Award";
  const voteText = variant === "amber" ? "100% Public Vote" : "40% Public + 60% Jury";

  return (
    <section className={`${colors} border-b py-4`}>
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{periodText}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{voteText}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>{awardText}</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4" />
            <span>{total.toLocaleString()} Nominees</span>
          </div>
          {topRegions.length > 0 && (
            <div className="flex items-center gap-1 text-xs opacity-75">
              {topRegions.map((r, i) => (
                <span key={r.region_slug}>
                  {r.region_name}: {r.nominee_count}{i < topRegions.length - 1 ? " · " : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
