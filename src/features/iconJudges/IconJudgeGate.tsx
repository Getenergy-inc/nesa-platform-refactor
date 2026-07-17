import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldAlert } from "lucide-react";

interface Props { children: ReactNode; requireModerator?: boolean }

/**
 * Icon Judges Portal access gate.
 * - Requires auth
 * - Requires ICON_JUDGE (or moderator/governance) role
 * - Requires valid icon_judge_otp_sessions row (2FA)
 */
export function IconJudgeGate({ children, requireModerator = false }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [state, setState] = useState<
    { status: "checking" } | { status: "ok" } | { status: "no-role" } | { status: "no-otp" }
  >({ status: "checking" });

  useEffect(() => {
    async function check() {
      if (!user) return;
      try {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role_code")
          .eq("user_id", user.id);
        const codes = (roles ?? []).map((r: any) => r.role_code);
        const isJudge = codes.includes("ICON_JUDGE") || codes.includes("ICON_MODERATOR") || codes.includes("ICON_GOVERNANCE");
        const isMod = codes.includes("ICON_MODERATOR") || codes.includes("ICON_GOVERNANCE");
        if (!isJudge || (requireModerator && !isMod)) {
          setState({ status: "no-role" });
          return;
        }
        const { data: otp } = await supabase
          .from("icon_judge_otp_sessions")
          .select("id")
          .eq("user_id", user.id)
          .gt("expires_at", new Date().toISOString())
          .order("verified_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        setState({ status: otp ? "ok" : "no-otp" });
      } catch {
        setState({ status: "no-role" });
      }
    }
    if (!loading) check();
  }, [user, loading, requireModerator]);

  if (loading || state.status === "checking") {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-sm">Verifying jury access…</p>
        </div>
      </div>
    );
  }
  if (!user) {
    const next = location.pathname + location.search;
    return <Navigate to={`/icon-jury/sign-in?next=${encodeURIComponent(next)}`} replace />;
  }
  if (state.status === "no-role") {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <ShieldAlert className="h-10 w-10 text-gold mx-auto mb-4" />
          <h1 className="text-white text-xl font-semibold mb-2">Restricted Portal</h1>
          <p className="text-white/60 text-sm">
            The Africa Education Icon Judges Portal is invitation-only. Your account does not have
            Icon jury access.
          </p>
        </div>
      </div>
    );
  }
  if (state.status === "no-otp") {
    const next = location.pathname + location.search;
    return <Navigate to={`/icon-jury/sign-in?otp=1&next=${encodeURIComponent(next)}`} replace />;
  }
  return <>{children}</>;
}
