import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

interface Props {
  rawStatus: string;
  resolvedStatus: string;
  size?: "sm" | "md";
}

/**
 * Admin-only badge that appears when a form was auto-promoted
 * from "Link Pending" to "Active" by the status resolver.
 * Renders nothing for non-admin users or non-promoted forms.
 */
export function FormAutoPromotedBadge({
  rawStatus,
  resolvedStatus,
  size = "sm",
}: Props) {
  const { hasRole } = useAuth();

  if (!hasRole("admin")) return null;
  if (!(rawStatus === "Link Pending" && resolvedStatus === "Active")) {
    return null;
  }

  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 ${textSize} text-gold uppercase tracking-wider`}
      title="Auto-promoted by resolver: raw status is Link Pending, both URLs present"
    >
      <Sparkles className={iconSize} />
      Auto-promoted
    </span>
  );
}
