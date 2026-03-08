import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileSearch, Shield, XCircle, Users } from "lucide-react";
import { type NomineeWorkflowStatus, WORKFLOW_STATUS_CONFIG } from "@/lib/nomineeMasterData";

interface NomineeWorkflowStatusProps {
  status: NomineeWorkflowStatus;
  showSteps?: boolean;
  compact?: boolean;
}

const STEP_ICONS = [
  { icon: Clock, label: "Submitted" },
  { icon: FileSearch, label: "Screening" },
  { icon: Shield, label: "Verification" },
  { icon: Users, label: "NRC Review" },
  { icon: CheckCircle, label: "Cleared" },
];

export function NomineeWorkflowStatusBadge({ status, showSteps = false, compact = false }: NomineeWorkflowStatusProps) {
  const config = WORKFLOW_STATUS_CONFIG[status];

  if (compact) {
    return (
      <Badge variant="outline" className={`${config.color} border-0 text-xs`}>
        {config.label}
      </Badge>
    );
  }

  return (
    <div className="space-y-3">
      <Badge variant="outline" className={`${config.color} border-0`}>
        {config.label}
      </Badge>

      {showSteps && status !== "rejected" && (
        <div className="flex items-center gap-1">
          {STEP_ICONS.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === config.step;
            const isComplete = stepNum < config.step;
            const Icon = step.icon;

            return (
              <div key={step.label} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                    isComplete
                      ? "bg-emerald-500/20 text-emerald-400"
                      : isActive
                      ? "bg-gold/20 text-gold ring-2 ring-gold/30"
                      : "bg-charcoal-light/50 text-ivory/30"
                  }`}
                  title={step.label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {index < STEP_ICONS.length - 1 && (
                  <div
                    className={`w-4 h-0.5 ${
                      isComplete ? "bg-emerald-500/40" : "bg-charcoal-light/30"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NomineeWorkflowStatusBadge;
