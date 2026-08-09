import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAYMENT_DESTINATIONS, type PaymentOrgId } from "@/config/walletBranding";

interface PaymentDestinationBadgeProps {
  org: PaymentOrgId;
  /** Optional description of the specific item being paid for. */
  detail?: string;
  className?: string;
}

/**
 * Always shows the visitor WHICH organisation receives the money, so the
 * NESA-Africa commercial, EduAid-Africa donation and SCEF membership paths
 * never collapse into one generic "payment".
 */
export function PaymentDestinationBadge({ org, detail, className }: PaymentDestinationBadgeProps) {
  const dest = PAYMENT_DESTINATIONS[org];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-4 text-left",
        className
      )}
    >
      <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
      <div className="text-sm">
        <p className="font-semibold text-gold">Payment goes to: {dest.payee}</p>
        <p className="mt-1 text-muted-foreground">
          {detail ?? dest.covers.join(" · ")}. Processed through the GFAwzip Wallet payment
          channel with a receipt issued on completion.
        </p>
      </div>
    </div>
  );
}

export default PaymentDestinationBadge;
