import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Vote, TrendingUp, Target, Gift } from "lucide-react";

interface NomineeStatsGridProps {
  endorsementCount: number;
  endorsementGoal: number;
  publicVotes: number;
  referralClicks: number;
  profileViews: number;
  certificateStatus: "locked" | "unlocked" | "pending";
}

export function NomineeStatsGrid({
  endorsementCount,
  endorsementGoal,
  publicVotes,
  referralClicks,
  profileViews,
  certificateStatus,
}: NomineeStatsGridProps) {
  const progressPercent = Math.min(100, Math.round((endorsementCount / endorsementGoal) * 100));
  const endorsementsRemaining = Math.max(0, endorsementGoal - endorsementCount);

  const stats = [
    {
      label: "Endorsements",
      value: endorsementCount,
      subtext: `${endorsementsRemaining} more to unlock`,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Public Votes",
      value: publicVotes,
      subtext: "From community",
      icon: Vote,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Referral Clicks",
      value: referralClicks,
      subtext: "Via your link",
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "Profile Views",
      value: profileViews,
      subtext: "This month",
      icon: Target,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Progress to Certificate Unlock */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${certificateStatus === "unlocked" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-muted"}`}>
                <Award className={`h-6 w-6 ${certificateStatus === "unlocked" ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h3 className="font-semibold">Platinum Certificate</h3>
                <p className="text-sm text-muted-foreground">
                  {certificateStatus === "unlocked" 
                    ? "Ready for download!" 
                    : `Collect ${endorsementGoal} endorsements to unlock`}
                </p>
              </div>
            </div>
            {certificateStatus === "unlocked" && (
              <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{endorsementCount} / {endorsementGoal}</span>
              <span className="text-muted-foreground">{progressPercent}% complete</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Milestone markers */}
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>0</span>
              <span className={endorsementCount >= 50 ? "text-primary font-medium" : ""}>50</span>
              <span className={endorsementCount >= 100 ? "text-primary font-medium" : ""}>100</span>
              <span className={endorsementCount >= 150 ? "text-primary font-medium" : ""}>150</span>
              <span className={endorsementCount >= 200 ? "text-primary font-medium" : ""}>200</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
              <p className="text-sm font-medium text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
