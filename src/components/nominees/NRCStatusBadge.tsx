import { Badge } from "@/components/ui/badge";
import { ShieldCheck, BadgeCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type NRCStatus = "auto-verified" | "fully-approved" | "in-review" | null | undefined;

interface Props {
  status?: NRCStatus;
  className?: string;
  /** "sm" used on cards, "md" on profile headers */
  size?: "sm" | "md";
}

/**
 * Public-facing NRC trust badge.
 * - auto-verified  → silver, machine-screened by Automated NRC
 * - fully-approved → gold, signed-off by human reviewers (2-of-3 quorum)
 * - in-review      → muted, currently with NRC
 */
export function NRCStatusBadge({ status, className, size = "sm" }: Props) {
  if (!status) return null;

  const config = {
    "auto-verified": {
      label: "NRC Auto-Verified",
      Icon: ShieldCheck,
      classes: "border-slate-300/60 bg-slate-200/10 text-slate-200",
    },
    "fully-approved": {
      label: "NRC Fully Approved",
      Icon: BadgeCheck,
      classes: "border-gold/60 bg-gold/15 text-gold",
    },
    "in-review": {
      label: "NRC In Review",
      Icon: Clock,
      classes: "border-white/20 bg-white/5 text-white/70",
    },
  }[status];

  const { Icon } = config;
  const iconSize = size === "md" ? "h-4 w-4" : "h-3 w-3";

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium",
        size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]",
        config.classes,
        className,
      )}
      title={`${config.label} — verified by NESA-Africa NRC governance`}
    >
      <Icon className={iconSize} aria-hidden />
      {config.label}
    </Badge>
  );
}

export default NRCStatusBadge;
