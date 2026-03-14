/**
 * Campaign Timeline — dark theme version
 */

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock } from "lucide-react";
import { differenceInDays, isPast, isFuture, isWithinInterval, format } from "date-fns";

interface Campaign {
  name: string;
  startDate: Date;
  endDate: Date;
  color: string;
  badge: string;
}

const campaigns: Campaign[] = [
  {
    name: "Platinum Nomination",
    startDate: new Date("2026-03-01"),
    endDate: new Date("2026-06-27"),
    color: "bg-[#E5E4E2]",
    badge: "Platinum",
  },
  {
    name: "Gold Certificate Voting",
    startDate: new Date("2026-04-10"),
    endDate: new Date("2026-05-16"),
    color: "bg-gold",
    badge: "Gold",
  },
  {
    name: "Blue Garnet Voting",
    startDate: new Date("2026-05-18"),
    endDate: new Date("2026-06-17"),
    color: "bg-[#1E3A5F]",
    badge: "Blue Garnet",
  },
  {
    name: "Grand Gala",
    startDate: new Date("2026-06-27"),
    endDate: new Date("2026-06-27"),
    color: "bg-gold",
    badge: "Gala",
  },
];

function getCampaignStatus(campaign: Campaign) {
  const now = new Date();
  if (isPast(campaign.endDate)) return "completed";
  if (isFuture(campaign.startDate)) return "upcoming";
  if (isWithinInterval(now, { start: campaign.startDate, end: campaign.endDate })) return "active";
  return "upcoming";
}

function getProgress(campaign: Campaign) {
  const now = new Date();
  const total = differenceInDays(campaign.endDate, campaign.startDate) || 1;
  const elapsed = differenceInDays(now, campaign.startDate);
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

function getDaysRemaining(campaign: Campaign) {
  const now = new Date();
  const status = getCampaignStatus(campaign);
  if (status === "completed") return "Ended";
  if (status === "upcoming") {
    const days = differenceInDays(campaign.startDate, now);
    return `Starts in ${days}d`;
  }
  const days = differenceInDays(campaign.endDate, now);
  return `${days}d left`;
}

export function CampaignTimelineCard() {
  return (
    <div className="rounded-xl border border-white/5 bg-[hsl(30_8%_8%)] p-5 md:p-6">
      <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-gold" />
        Campaign Timeline — NESA 2025
      </h3>
      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const status = getCampaignStatus(campaign);
          const progress = getProgress(campaign);
          const remaining = getDaysRemaining(campaign);

          return (
            <div
              key={campaign.name}
              className={`rounded-lg border p-3 transition-colors ${
                status === "active"
                  ? "border-gold/20 bg-gold/5"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${campaign.color}`} />
                  <span className="text-sm font-medium text-white/80">{campaign.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {status === "active" && (
                    <Badge className="text-[10px] h-5 px-1.5 bg-gold/20 text-gold border-gold/30 hover:bg-gold/30">
                      LIVE
                    </Badge>
                  )}
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {remaining}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={status === "completed" ? 100 : progress} className="h-1.5 flex-1 bg-white/5" />
                <span className="text-[10px] text-white/30 whitespace-nowrap">
                  {format(campaign.startDate, "MMM d")} – {format(campaign.endDate, "MMM d")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
