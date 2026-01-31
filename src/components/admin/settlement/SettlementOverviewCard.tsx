import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SETTLEMENT_SPLIT_DISPLAY } from "@/types/settlement";
import { Clock, DollarSign, TrendingUp, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { triggerSettlement } from "@/api/settlement";

interface SettlementOverviewProps {
  lastRun?: {
    id: string;
    status: string;
    payments_processed: number;
    completed_at: string | null;
    totals_json?: {
      currencies?: Array<{
        currency: string;
        net: number;
      }>;
    };
  };
  onRefresh?: () => void;
}

export function SettlementOverviewCard({ lastRun, onRefresh }: SettlementOverviewProps) {
  const [isTriggering, setIsTriggering] = useState(false);

  const handleManualTrigger = async () => {
    setIsTriggering(true);
    try {
      const result = await triggerSettlement({ dryRun: false });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Settlement ${result.data?.skipped ? 'already completed' : 'triggered successfully'}`);
        onRefresh?.();
      }
    } catch {
      toast.error("Failed to trigger settlement");
    } finally {
      setIsTriggering(false);
    }
  };

  const totalNet = lastRun?.totals_json?.currencies?.reduce(
    (sum, c) => sum + (c.net || 0),
    0
  ) || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              24-Hour Settlement Splitter
            </CardTitle>
            <CardDescription>
              Automatic daily revenue distribution to fund accounts
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualTrigger}
            disabled={isTriggering}
          >
            {isTriggering ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Run Now
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Last Run Status */}
        {lastRun && (
          <div className="mb-6 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Last Settlement</span>
              <Badge
                variant={
                  lastRun.status === "COMPLETED"
                    ? "default"
                    : lastRun.status === "FAILED"
                    ? "destructive"
                    : "secondary"
                }
              >
                {lastRun.status}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Payments</span>
                <p className="font-medium">{lastRun.payments_processed}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Net Distributed</span>
                <p className="font-medium">${totalNet.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Completed</span>
                <p className="font-medium">
                  {lastRun.completed_at
                    ? new Date(lastRun.completed_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Split Allocation Visual */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenue Split Allocation
          </h4>
          <div className="space-y-2">
            {SETTLEMENT_SPLIT_DISPLAY.map((split) => (
              <div key={split.key} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: split.color }}
                />
                <span className="flex-1 text-sm">{split.name}</span>
                <span className="text-sm font-medium">{split.percent}%</span>
                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${split.percent}%`,
                      backgroundColor: split.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Info */}
        <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium">Daily Settlement Schedule</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Runs automatically at 00:10 UTC daily. All SUCCESS payments from the
            previous 24 hours are processed and split to fund accounts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
