import { useEffect, useState } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * /judges/enter — unified Judges Arena entry flow.
 *
 * 1. Not authenticated → /judges/sign-in?next=<target>
 * 2. Authenticated → resolve role → redirect to the correct workspace:
 *    - ICON_MODERATOR / ICON_GOVERNANCE → /admin/icon-jury
 *    - ICON_JUDGE                       → /judges/dashboard
 *    - jury (competitive)               → /judges-arena
 *    - admin (platform)                 → /admin/icon-jury
 *    - none                             → /judgeapply
 *
 * The optional ?next= query overrides the resolved destination when it points
 * at a known judge/jury/arena route (auth is still enforced).
 */
export default function JudgesEntry() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [params] = useSearchParams();
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      const next = params.get("next") ?? "/judges/enter";
      setTarget(`/judges/sign-in?next=${encodeURIComponent(next)}`);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role_code, role")
        .eq("user_id", user.id);

      const codes = new Set<string>();
      (data ?? []).forEach((r: any) => {
        if (r.role_code) codes.add(String(r.role_code).toUpperCase());
        if (r.role) codes.add(String(r.role).toLowerCase());
      });

      let dest = "/judgeapply";
      if (codes.has("ICON_MODERATOR") || codes.has("ICON_GOVERNANCE")) {
        dest = "/admin/icon-jury";
      } else if (codes.has("ICON_JUDGE")) {
        dest = "/judges/dashboard";
      } else if (codes.has("jury")) {
        dest = "/judges-arena";
      } else if (codes.has("admin")) {
        dest = "/admin/icon-jury";
      }

      const requested = params.get("next");
      if (
        requested &&
        /^\/(judges|judges-arena|admin\/icon-jury|icon-jury|dashboard\/judge)(\/|$|\?)/.test(
          requested,
        )
      ) {
        dest = requested;
      }

      if (!cancelled) setTarget(dest);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loading, params]);

  if (loading || !target) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-sm">Routing you to your Judges Arena…</p>
        </div>
      </div>
    );
  }

  return <Navigate to={target} replace state={{ from: location.pathname }} />;
}
