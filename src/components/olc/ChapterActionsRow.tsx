import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Upload,
  BadgeDollarSign,
  ArrowRight,
} from "lucide-react";

interface ChapterActionsRowProps {
  onSettlementRequest?: () => void;
}

export function ChapterActionsRow({ onSettlementRequest }: ChapterActionsRowProps) {
  const actions = [
    {
      label: "Verify Members",
      description: "Review local member list",
      icon: Users,
      href: "/olc/members",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Local Events",
      description: "Track chapter events",
      icon: Calendar,
      href: "/olc/events",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "Submit Media",
      description: "Upload chapter content",
      icon: Upload,
      href: "/olc/media",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link key={action.label} to={action.href}>
                <Button
                  variant="outline"
                  className="h-auto py-3 px-4 flex items-center gap-3 hover:bg-muted/50"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.bgColor}`}>
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              </Link>
            ))}
          </div>

          {/* Settlement Request CTA */}
          <Button
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={onSettlementRequest}
          >
            <BadgeDollarSign className="mr-2 h-4 w-4" />
            Request Settlement
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
