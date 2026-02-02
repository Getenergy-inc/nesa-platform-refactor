import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

// JudgePortal acts as the entry point for /judge route
// It redirects authenticated judges to /judge/dashboard
// and unauthenticated users to login with a return URL
export default function JudgePortal() {
  const { user, roles, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to login with return URL
  if (!user) {
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`/login?next=${encodeURIComponent(returnUrl)}`} replace />;
  }

  // Check if user has jury role
  const isJudge = roles.includes("jury") || roles.includes("admin");

  if (!isJudge) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated judge - redirect to dashboard
  return <Navigate to="/judge/dashboard" replace />;
}
