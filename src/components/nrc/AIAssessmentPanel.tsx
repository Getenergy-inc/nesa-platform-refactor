/**
 * AI Assessment Panel Component
 * Displays AI NRC verification assessment with scores and recommendations
 */

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldAlert,
  Bot,
  RefreshCw,
  Loader2,
  Info,
} from "lucide-react";
import type { AINRCAssessment } from "@/types/nrcAutomation";
import { AI_RECOMMENDATION_LABELS, NRC_REASON_CODES } from "@/config/nrcConfig";

interface AIAssessmentPanelProps {
  assessment: AINRCAssessment | null | undefined;
  isLoading?: boolean;
  onRequestAssessment?: () => void;
  isRequesting?: boolean;
}

const recommendationConfig = {
  RECOMMEND_ELIGIBLE: {
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
  },
  RECOMMEND_INELIGIBLE: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
  },
  NEEDS_MORE_EVIDENCE: {
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
  },
  FLAG_FOR_RISK_REVIEW: {
    icon: ShieldAlert,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
  },
};

function ScoreGauge({ 
  label, 
  score, 
  maxScore = 100,
  thresholds = { low: 40, medium: 70 }
}: { 
  label: string; 
  score: number; 
  maxScore?: number;
  thresholds?: { low: number; medium: number };
}) {
  const percentage = (score / maxScore) * 100;
  const color = score < thresholds.low 
    ? "text-destructive" 
    : score < thresholds.medium 
    ? "text-warning" 
    : "text-success";
  const bgColor = score < thresholds.low 
    ? "bg-destructive" 
    : score < thresholds.medium 
    ? "bg-warning" 
    : "bg-success";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-semibold", color)}>{score}%</span>
      </div>
      <Progress value={percentage} className={cn("h-2", bgColor)} />
    </div>
  );
}

function ReasonCodeBadge({ code }: { code: string }) {
  const reasonCode = NRC_REASON_CODES.find(rc => rc.code === code);
  if (!reasonCode) return null;

  const severityColors = {
    info: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    warning: "bg-warning/10 text-warning border-warning/30",
    critical: "bg-destructive/10 text-destructive border-destructive/30",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn("text-xs cursor-help", severityColors[reasonCode.severity])}
          >
            {code}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[250px]">
          <p className="text-sm">{reasonCode.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function AIAssessmentPanel({
  assessment,
  isLoading,
  onRequestAssessment,
  isRequesting,
}: AIAssessmentPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!assessment) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Bot className="mx-auto mb-3 h-12 w-12 text-muted-foreground opacity-50" />
          <h4 className="font-semibold mb-1">No AI Assessment</h4>
          <p className="text-sm text-muted-foreground mb-4">
            AI verification has not been run for this nomination yet.
          </p>
          {onRequestAssessment && (
            <Button 
              onClick={onRequestAssessment} 
              disabled={isRequesting}
              variant="secondary"
            >
              {isRequesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Bot className="mr-2 h-4 w-4" />
              Run AI Assessment
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const config = recommendationConfig[assessment.recommendation as keyof typeof recommendationConfig] 
    || recommendationConfig.NEEDS_MORE_EVIDENCE;
  const Icon = config.icon;

  return (
    <Card className={cn("border", config.borderColor)}>
      <CardHeader className={cn("pb-3", config.bgColor)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("rounded-full p-2", config.bgColor)}>
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>
            <div>
              <CardTitle className="text-base">AI Verification</CardTitle>
              <p className="text-sm text-muted-foreground">
                Model: {assessment.model_version} • Rubric: {assessment.rubric_version}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={cn(config.bgColor, config.color)}>
            {AI_RECOMMENDATION_LABELS[assessment.recommendation as keyof typeof AI_RECOMMENDATION_LABELS] 
              || assessment.recommendation}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Scores */}
        <div className="space-y-3">
          <ScoreGauge label="Evidence Quality" score={assessment.evidence_score} />
          <ScoreGauge label="Category Fit" score={assessment.category_fit_score} />
          <ScoreGauge 
            label="Risk Score" 
            score={100 - assessment.risk_score} 
            thresholds={{ low: 30, medium: 60 }}
          />
        </div>

        <Separator />

        {/* Identity Verification */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Identity Verified</span>
          {assessment.identity_verified ? (
            <Badge variant="outline" className="bg-success/10 text-success">
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-destructive/10 text-destructive">
              <XCircle className="mr-1 h-3 w-3" />
              Not Verified
            </Badge>
          )}
        </div>

        {/* Reason Codes */}
        {assessment.reason_codes && assessment.reason_codes.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Reason Codes</p>
            <div className="flex flex-wrap gap-1.5">
              {assessment.reason_codes.map((code, i) => (
                <ReasonCodeBadge key={i} code={code} />
              ))}
            </div>
          </div>
        )}

        {/* Explanation */}
        {assessment.explanation_summary && (
          <div className="space-y-2">
            <p className="text-sm font-medium">AI Summary</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {assessment.explanation_summary}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>
            Processed: {new Date(assessment.created_at).toLocaleString()}
          </span>
          {assessment.processing_time_ms && (
            <span>{assessment.processing_time_ms}ms</span>
          )}
        </div>

        {/* Re-run button */}
        {onRequestAssessment && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRequestAssessment}
            disabled={isRequesting}
            className="w-full"
          >
            {isRequesting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Re-run Assessment
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
