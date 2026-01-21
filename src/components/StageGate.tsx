import { ReactNode } from "react";
import { useStage } from "@/contexts/StageContext";
import { STAGE_LABELS, type StageAction } from "@/config/season";
import { Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StageGateProps {
  action: StageAction;
  children: ReactNode;
  fallback?: ReactNode;
}

export function StageGate({ action, children, fallback }: StageGateProps) {
  const { isOpen, getStage, loading } = useStage();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isOpen(action)) {
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
  const { getStage } = useStage();
  const stage = getStage(action);
  const label = STAGE_LABELS[action];

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-amber-100 p-4">
          <Lock className="h-8 w-8 text-amber-600" />
        </div>
        <h3 className="mb-2 text-xl font-display font-bold text-amber-900">
          {label} Closed
        </h3>
        <p className="mb-4 max-w-md text-amber-700">
          {label} is currently not open. Please check back later or subscribe to updates.
        </p>
        {stage?.opensAt && (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <Clock className="h-4 w-4" />
            <span>Opens: {stage.opensAt.toLocaleDateString()}</span>
          </div>
        )}
        <Button variant="outline" className="mt-6 border-amber-300 text-amber-700 hover:bg-amber-100">
          Notify Me When Open
        </Button>
      </CardContent>
    </Card>
  );
}

interface StageStatusBadgeProps {
  action: StageAction;
}

export function StageStatusBadge({ action }: StageStatusBadgeProps) {
  const { isOpen } = useStage();
  const open = isOpen(action);
  const label = STAGE_LABELS[action];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        open
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-green-500" : "bg-gray-400"}`} />
      {label} {open ? "Open" : "Closed"}
    </span>
  );
}
