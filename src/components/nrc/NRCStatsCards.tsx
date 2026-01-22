import { Card, CardContent } from "@/components/ui/card";
import { Clock, Eye, CheckCircle, XCircle, Award } from "lucide-react";

interface NRCStatsCardsProps {
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  platinum: number;
}

export function NRCStatsCards({
  pending,
  underReview,
  approved,
  rejected,
  platinum,
}: NRCStatsCardsProps) {
  const stats = [
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      bgClass: "bg-muted/50",
      iconClass: "text-muted-foreground",
    },
    {
      label: "Under Review",
      value: underReview,
      icon: Eye,
      bgClass: "bg-warning/10",
      iconClass: "text-warning",
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle,
      bgClass: "bg-success/10",
      iconClass: "text-success",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      bgClass: "bg-destructive/10",
      iconClass: "text-destructive",
    },
    {
      label: "Platinum",
      value: platinum,
      icon: Award,
      bgClass: "bg-primary/10",
      iconClass: "text-primary",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgClass}`}>
              <stat.icon className={`h-6 w-6 ${stat.iconClass}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
