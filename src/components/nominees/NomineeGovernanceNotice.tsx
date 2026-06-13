import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "chip" | "banner";
  className?: string;
}

/**
 * Standard governance disclaimer for nominee surfaces.
 * Required on hub, profiles, cards, and cross-surface embeds.
 */
export function NomineeGovernanceNotice({ variant = "chip", className }: Props) {
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "rounded-xl border border-gold/20 bg-charcoal-light/40 px-4 py-3 flex items-start gap-3",
          className,
        )}
        role="note"
      >
        <ShieldAlert className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
        <p className="text-xs text-ivory/70 leading-relaxed">
          Being listed as a nominee does not imply finalist status, jury endorsement, winner
          status, or any official award. All nominees are subject to verification, evaluation,
          and governance procedures.
        </p>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-charcoal-light/50 px-3 py-1 text-[11px] text-ivory/65",
        className,
      )}
    >
      <ShieldAlert className="w-3 h-3 text-gold" />
      Nominee listing — not a finalist or winner status
    </span>
  );
}

export default NomineeGovernanceNotice;
