import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, XCircle, Info } from "lucide-react";
import { AGC_RULES, AGC_QUICK_SUMMARY } from "@/config/agcConfig";

interface AGCRulesCardProps {
  variant?: "compact" | "full";
  className?: string;
}

export function AGCRulesCard({ variant = "full", className }: AGCRulesCardProps) {
  if (variant === "compact") {
    return (
      <Card className={`border-orange-500/30 bg-orange-500/5 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm mb-1">Important: AGC is not money</p>
              <p className="text-xs text-muted-foreground">
                No cash-out • No transfers • No withdrawals • Voting only
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Important Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rules List */}
        <div className="space-y-2">
          {AGC_RULES.map((rule, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <XCircle className="h-4 w-4 text-destructive shrink-0" />
              <span>{rule}</span>
            </div>
          ))}
        </div>

        {/* Quick Summary */}
        <div className="rounded-lg bg-muted/50 p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Quick Summary
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {AGC_QUICK_SUMMARY.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-muted-foreground">{label}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
