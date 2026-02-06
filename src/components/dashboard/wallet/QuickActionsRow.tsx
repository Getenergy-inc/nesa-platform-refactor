import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileText,
  Vote,
  Ticket,
  Heart,
  Users,
  Zap,
} from "lucide-react";
import { useSeason } from "@/contexts/SeasonContext";

interface QuickActionsRowProps {
  onTopUp?: () => void;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string;
  variant?: "default" | "outline" | "secondary";
}

export function QuickActionsRow({ onTopUp }: QuickActionsRowProps) {
  const { isStageOpen } = useSeason();

  const nominationsOpen = isStageOpen("nominations");
  const votingOpen = isStageOpen("public_voting");

  const actions: QuickAction[] = [
    {
      label: "Top Up",
      icon: <Zap className="h-4 w-4" />,
      onClick: onTopUp,
      variant: "default",
    },
    {
      label: "Nominate",
      icon: <FileText className="h-4 w-4" />,
      href: "/nominate",
      disabled: !nominationsOpen,
      tooltip: !nominationsOpen ? "Nominations Closed" : undefined,
      variant: "outline",
    },
    {
      label: "Vote",
      icon: <Vote className="h-4 w-4" />,
      href: "/vote",
      disabled: !votingOpen,
      tooltip: !votingOpen ? "Voting Closed" : undefined,
      variant: "outline",
    },
    {
      label: "Buy Ticket",
      icon: <Ticket className="h-4 w-4" />,
      href: "/tickets",
      variant: "outline",
    },
    {
      label: "Donate",
      icon: <Heart className="h-4 w-4" />,
      href: "/donate",
      variant: "outline",
    },
    {
      label: "Refer",
      icon: <Users className="h-4 w-4" />,
      href: "/dashboard#referral",
      variant: "outline",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {actions.map((action) => {
            const buttonContent = (
              <Button
                key={action.label}
                variant={action.variant}
                size="sm"
                className="w-full flex-col gap-1 h-auto py-3"
                disabled={action.disabled}
                onClick={action.onClick}
                asChild={!!action.href && !action.disabled}
              >
                {action.href && !action.disabled ? (
                  <Link to={action.href}>
                    {action.icon}
                    <span className="text-xs">{action.label}</span>
                  </Link>
                ) : (
                  <>
                    {action.icon}
                    <span className="text-xs">{action.label}</span>
                  </>
                )}
              </Button>
            );

            if (action.tooltip && action.disabled) {
              return (
                <Tooltip key={action.label}>
                  <TooltipTrigger asChild>
                    {buttonContent}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return buttonContent;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
