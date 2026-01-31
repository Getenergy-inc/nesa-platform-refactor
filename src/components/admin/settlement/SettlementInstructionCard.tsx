import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SETTLEMENT_SPLIT_DISPLAY, GFA_WZIP_MARKUP_PERCENT } from "@/types/settlement";
import { Building2, FileText, Info, Percent } from "lucide-react";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";

export function SettlementInstructionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Third-Party Collection Partner Instructions
        </CardTitle>
        <CardDescription>
          Share this with any revenue collection partner integrating with GFA Wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Master Account Info */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Settlement Destination
          </h4>
          <p className="text-sm">
            All collections must settle into:{" "}
            <strong>NESA-Africa Master Multi-Currency Account</strong>
          </p>
        </div>

        {/* GFA Wzip 2% Additive Markup */}
        <div className="p-4 rounded-lg bg-chart-1/10 border border-chart-1/30">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <GFAWalletIcon size={16} />
            <Percent className="h-4 w-4" />
            GFA Wzip Processing Markup
          </h4>
          <p className="text-sm mb-2">
            <strong>+{GFA_WZIP_MARKUP_PERCENT}% additive processing fee</strong> is charged on top of 
            all payments. Fund accounts receive the full base amount; GFA Wzip receives the markup.
          </p>
          <Badge variant="outline">Additive: $100 base → $102 total → $100 to funds + $2 to GFA Wzip</Badge>
        </div>

        {/* Split Breakdown */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Daily Split Allocation (Fund accounts receive 100% of base)
          </h4>
          <div className="space-y-2">
            {SETTLEMENT_SPLIT_DISPLAY.map((split) => (
              <div
                key={split.key}
                className={`flex items-center justify-between p-2 rounded ${
                  'isMarkup' in split && split.isMarkup ? 'bg-chart-1/10 border border-chart-1/30' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: split.color }}
                  />
                  <span className="text-sm">{split.name}</span>
                  {'isMarkup' in split && split.isMarkup && (
                    <Badge variant="secondary" className="text-xs">First</Badge>
                  )}
                </div>
                <Badge variant="outline">{split.percent}%</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Requirements */}
        <div>
          <h4 className="font-medium mb-3">Partner Requirements</h4>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Provide settlement reports (gross, fees, net, reference IDs)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Send webhook events or reconciliation exports
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Support multi-currency settlement without forced conversion
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Report refunds/chargebacks for proportional reversal
            </li>
          </ul>
        </div>

        {/* Supported Partners */}
        <div>
          <h4 className="font-medium mb-3">Integrated Payment Rails</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "Paystack",
              "Transactpay",
              "Flutterwave",
              "TapTap Send",
              "Zelle",
              "Bancable",
              "Moniepoint",
              "OPay",
              "MoMo",
            ].map((partner) => (
              <Badge key={partner} variant="secondary">
                {partner}
              </Badge>
            ))}
          </div>
        </div>

        {/* Audit Note */}
        <div className="text-xs text-muted-foreground border-t pt-4">
          GFA Wallet maintains internal audit logs and can reconcile partner
          settlement vs internal ledger. All disbursements are recorded with
          full audit trail.
        </div>
      </CardContent>
    </Card>
  );
}
