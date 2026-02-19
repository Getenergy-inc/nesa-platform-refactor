/**
 * AI Assessment Panel
 * Displays AI review result for NRC decision support
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
} from "lucide-react";

export interface AINominationResponse {
  score: number;
  recommendation: "approve" | "manual_review" | "reject";
  reasons: string[];
  verificationRequired: string[];
  flags: {
    spamLike: boolean;
    insufficientEvidence: boolean;
    categoryMismatch: boolean;
    inconsistentClaims: boolean;
  };
}

interface AIAssessmentPanelProps {
  assessment: AINominationResponse | null;
  isLoading?: boolean;
  onRun?: () => void;
}

export function AIAssessmentPanel({
  assessment,
  isLoading,
  onRun,
}: AIAssessmentPanelProps) {
  /* =========================
     LOADING STATE
  ========================= */

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            AI review in progress...
          </p>
        </CardContent>
      </Card>
    );
  }

  /* =========================
     EMPTY STATE
  ========================= */

  if (!assessment) {
    return (
      <Card className="h-full border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <Bot className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">AI Review Not Executed</p>
            <p className="text-xs text-muted-foreground mt-1">
              Run AI review to generate structured evaluation.
            </p>
          </div>

          {onRun && (
            <Button onClick={onRun}>
              <Bot className="mr-2 h-4 w-4" />
              Run AI Review
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  /* =========================
     RESULT STATE
  ========================= */

  const recommendationStyles = {
    approve: "bg-success/10 text-success border-success/30",
    manual_review: "bg-warning/10 text-warning border-warning/30",
    reject: "bg-destructive/10 text-destructive border-destructive/30",
  };

  const RecommendationIcon =
    assessment.recommendation === "approve"
      ? CheckCircle2
      : assessment.recommendation === "reject"
        ? XCircle
        : AlertTriangle;

  const activeFlags = Object.entries(assessment.flags).filter(
    ([, value]) => value,
  );

  return (
    <Card
      className={`h-full border ${
        recommendationStyles[assessment.recommendation]
      }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RecommendationIcon className="h-5 w-5" />
          AI Review Result
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Score */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Overall Confidence Score</span>
            <span className="font-semibold">{assessment.score}%</span>
          </div>
          <Progress value={assessment.score} />
        </div>
        {/* Recommendation */}
        <Badge variant="outline" className="capitalize">
          Recommendation: {assessment.recommendation.replace("_", " ")}
        </Badge>
        <Separator />
        {/* Reasons */}
        {assessment.reasons?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Evaluation Reasons</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {assessment.reasons.map((reason, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        Verification Required
        {assessment.verificationRequired?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-warning" />
              External Verification Required
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {assessment.verificationRequired.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Flags */}
        {activeFlags.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Risk Flags</h4>
            <div className="flex flex-wrap gap-2">
              {activeFlags.map(([key]) => (
                <Badge key={key} variant="destructive" className="capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
