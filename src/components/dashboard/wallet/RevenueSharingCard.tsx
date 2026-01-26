import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { PieChart, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface RevenueSplit {
  split_key: string;
  percent: number;
  destination_description?: string;
}

interface RevenueSharingCardProps {
  splits: RevenueSplit[];
  loading?: boolean;
}

const splitColors: Record<string, string> = {
  NESA_PLATFORM: "bg-primary",
  EDUAID: "bg-blue-500",
  RMSA: "bg-green-500",
  CVO_FUND: "bg-purple-500",
  ADMIN_COST: "bg-orange-500",
  CHAPTER_POOL: "bg-pink-500",
};

const splitLabels: Record<string, string> = {
  NESA_PLATFORM: "NESA Platform",
  EDUAID: "EduAid-Africa",
  RMSA: "Rebuild My School",
  CVO_FUND: "CVO Fund",
  ADMIN_COST: "Admin & Operations",
  CHAPTER_POOL: "Chapter Pool",
};

function SplitItem({ split }: { split: RevenueSplit }) {
  const colorClass = splitColors[split.split_key] || "bg-muted";
  const label = splitLabels[split.split_key] || split.split_key;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${colorClass}`} />
          <span className="text-muted-foreground">{label}</span>
        </div>
        <span className="font-medium">{split.percent}%</span>
      </div>
      <Progress value={split.percent} className="h-1.5" />
    </div>
  );
}

export function RevenueSharingCard({ splits, loading }: RevenueSharingCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <PieChart className="h-4 w-4 text-primary" />
            Revenue Sharing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-1.5 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Sort by percentage descending
  const sortedSplits = [...splits].sort((a, b) => b.percent - a.percent);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" />
            Revenue Sharing
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px]">
              <p className="text-xs">
                Shows how contributions are distributed across NESA-Africa programs.
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedSplits.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No revenue split data available
          </p>
        ) : (
          <div className="space-y-3">
            {sortedSplits.map((split) => (
              <SplitItem key={split.split_key} split={split} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
