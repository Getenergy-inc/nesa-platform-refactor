import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";
import {
  logFormAutoPromotion,
  type FormKind,
} from "@/lib/audit/logFormAutoPromotion";

interface Props {
  rawStatus: string;
  resolvedStatus: string;
  size?: "sm" | "md";
  /** Identifier of the form record (e.g. region slug or category slug). */
  formSlug?: string;
  /** Which config the form lives in. Defaults to RMSA regional forms. */
  formKind?: FormKind;
}

/**
 * Admin-only badge that appears when a form was auto-promoted
 * from "Link Pending" to "Active" by the status resolver.
 * Renders nothing for non-admin users or non-promoted forms.
 *
 * Side effect: when an admin sees a promoted form for the first time
 * in a session, records an `audit_events` row (`form_auto_promoted`).
 */
export function FormAutoPromotedBadge({
  rawStatus,
  resolvedStatus,
  size = "sm",
  formSlug,
  formKind = "rmsa-region",
}: Props) {
  const { hasRole, user } = useAuth();
  const isAdmin = hasRole("admin");
  const promoted = rawStatus === "Link Pending" && resolvedStatus === "Active";

  useEffect(() => {
    if (!isAdmin || !promoted || !formSlug || !user?.id) return;
    void logFormAutoPromotion({
      formKind,
      formSlug,
      actorId: user.id,
      rawStatus,
      resolvedStatus,
    });
  }, [isAdmin, promoted, formSlug, formKind, user?.id, rawStatus, resolvedStatus]);

  if (!isAdmin || !promoted) return null;

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
