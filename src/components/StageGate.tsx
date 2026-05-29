import { ReactNode } from "react";
import { useSeason, useStageGate } from "@/contexts/SeasonContext";
import { STAGE_LABELS, STAGE_DESCRIPTIONS, type StageAction } from "@/config/season";
import { Lock, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StageGateProps {
  action: StageAction;
  children: ReactNode;
  fallback?: ReactNode;
}

export function StageGate({ action, children, fallback }: StageGateProps) {
  const { isOpen, loading } = useStageGate(action);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading stage status...</div>
      </div>
    );
  }

  if (isOpen) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <StageLocked action={action} />;
}

interface StageLockedProps {
  action: StageAction;
}

export function StageLocked({ action }: StageLockedProps) {
  const { stage, opensAt } = useStageGate(action);
  const { currentEdition } = useSeason();
  const label = STAGE_LABELS[action];
  const description = STAGE_DESCRIPTIONS[action];

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-xl font-display font-bold">
          {label} Currently Closed
        </h3>
        <p className="mb-4 max-w-md text-muted-foreground">
          {description} for {currentEdition.name} is not currently open. 
          Please check back later or subscribe for updates.
        </p>
        {opensAt && (
          <div className="mb-4 flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Opens: {opensAt.toLocaleDateString("en-US", { 
              month: "long", 
              day: "numeric", 
              year: "numeric" 
            })}</span>
          </div>
        )}
        <Button variant="outline" className="mt-2">
          <Clock className="mr-2 h-4 w-4" />
          Notify Me When Open
        </Button>
      </CardContent>
    </Card>
  );
}

interface StageStatusBadgeProps {
  action: StageAction;
  showLabel?: boolean;
}

export function StageStatusBadge({ action, showLabel = true }: StageStatusBadgeProps) {
  const { isOpen } = useStageGate(action);
  const label = STAGE_LABELS[action];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        isOpen
          ? "bg-success/10 text-success"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
      {showLabel && <span>{label}</span>}
      <span>{isOpen ? "Open" : "Closed"}</span>
    </span>
  );
}

// Component to show all stage statuses
export function StageOverview() {
  const stages: StageAction[] = ["nominations", "public_voting", "jury_scoring", "results", "certificates"];

  return (
    <div className="flex flex-wrap gap-2">
      {stages.map((action) => (
        <StageStatusBadge key={action} action={action} />
      ))}
    </div>
  );
}
