import { Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGC_DISCLAIMER_FULL, AGC_NON_TRADEABLE_DISCLAIMER } from "@/constants/agc";

interface AgcDisclosureProps {
  variant?: "inline" | "card" | "banner";
  className?: string;
}

export function AgcDisclosure({ variant = "inline", className }: AgcDisclosureProps) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2 text-xs text-warning", className)}>
        <AlertTriangle className="h-3 w-3 shrink-0" />
        <span>{AGC_NON_TRADEABLE_DISCLAIMER}</span>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={cn(
        "rounded-lg bg-warning/10 border border-warning/30 p-4 text-center",
        className
      )}>
        <p className="text-sm text-warning font-medium">
          ⚠️ {AGC_NON_TRADEABLE_DISCLAIMER}
        </p>
      </div>
    );
  }

  // Card variant
  return (
    <div className={cn(
      "rounded-xl border border-amber-500/30 bg-amber-500/5 p-4",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-5 w-5 text-amber-500" />
        <h4 className="font-semibold text-foreground">Afri-Gold Coins (AGC) Disclosure</h4>
      </div>
      <ul className="space-y-2">
        {AGC_DISCLAIMER_FULL.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-amber-500">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
