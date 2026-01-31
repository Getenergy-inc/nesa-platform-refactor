import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SETTLEMENT_SPLIT_DISPLAY, GFA_WZIP_MARKUP_PERCENT } from "@/types/settlement";
import { Clock, DollarSign, TrendingUp, RefreshCw, Percent } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { triggerSettlement } from "@/api/settlement";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";

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
        gfa_wzip_markup?: number;
        base_to_funds?: number;
        total_distributed?: number;
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

  const totalGfaWzipMarkup = lastRun?.totals_json?.currencies?.reduce(
    (sum, c) => sum + (c.gfa_wzip_markup || 0),
    0
  ) || 0;

  const totalBaseToFunds = lastRun?.totals_json?.currencies?.reduce(
    (sum, c) => sum + (c.base_to_funds || 0),
    0
  ) || 0;

  const totalDistributed = lastRun?.totals_json?.currencies?.reduce(
    (sum, c) => sum + (c.total_distributed || 0),
    0
  ) || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GFAWalletIcon size={20} />
              GFA Wzip Settlement Splitter
            </CardTitle>
            <CardDescription>
              +2% GFA Wzip additive markup + automatic daily revenue distribution
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
        {/* GFA Wzip 2% Additive Markup Banner */}
        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">GFA Wzip Processing Fee</span>
            <Badge variant="secondary">+2% Additive Markup</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Customer pays base + 2% markup. Fund accounts receive the full base amount;
            GFA Wzip receives the 2% markup on top.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Example: $100 base → Customer pays $102 → $100 to funds + $2 to GFA Wzip
          </p>
        </div>

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Payments</span>
                <p className="font-medium">{lastRun.payments_processed}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Net Collected</span>
                <p className="font-medium">${totalNet.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">GFA Wzip (+2%)</span>
                <p className="font-medium text-primary">${totalGfaWzipMarkup.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">To Funds</span>
                <p className="font-medium">${totalBaseToFunds.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Distributed</span>
                <p className="font-medium text-green-600">${totalDistributed.toLocaleString()}</p>
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
