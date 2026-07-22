import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * Guards NRC Arena routes. Only authorised NRC members and admins pass.
 * Anonymous visitors are sent to /nrc/sign-in with a return URL.
 */
export function NRCProtectedRoute({ children }: { children: ReactNode }) {
  const { user, roles, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/nrc/sign-in?next=${next}`} replace />;
  }

  const authorised = (roles ?? []).some((r) => r === "nrc" || r === "admin");
  if (!authorised) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
}
