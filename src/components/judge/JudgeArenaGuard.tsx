import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface JudgeArenaGuardProps {
  children: ReactNode;
}

type JudgeStatus = "loading" | "not_logged_in" | "not_judge" | "otp_required" | "pending_approval" | "approved";

/**
 * JudgeArenaGuard - Comprehensive protection for /judge/* routes
 * 
 * Enforces the complete judges journey:
 * 1. Not logged in → redirect to /login?next=/judge/...
 * 2. Logged in but not a judge → show /unauthorized
 * 3. Judge but OTP not verified → redirect to OTP page
 * 4. Judge but pending approval → redirect to /judge-status
 * 5. Judge approved + OTP verified → render children
 */
export function JudgeArenaGuard({ children }: JudgeArenaGuardProps) {
  const { user, roles, loading } = useAuth();
  const location = useLocation();
  const [status, setStatus] = useState<JudgeStatus>("loading");
  const [judgeEmail, setJudgeEmail] = useState<string>("");

  useEffect(() => {
    async function checkJudgeAccess() {
      if (loading) return;

      // Not logged in
      if (!user) {
        setStatus("not_logged_in");
        return;
      }

      // Check if user has jury role
      const isJudge = roles.includes("jury") || roles.includes("admin");
      if (!isJudge) {
        setStatus("not_judge");
        return;
      }

      // Check OTP verification status (session-based)
      const otpVerified = sessionStorage.getItem(`otp_verified_${user.id}`) === "true";
      if (!otpVerified) {
        setJudgeEmail(user.email || "");
        setStatus("otp_required");
        return;
      }

      // For non-admin judges, check judge application status
      if (!roles.includes("admin")) {
        try {
          const { data: application } = await supabase
            .from("judge_applications")
            .select("status")
            .eq("email", user.email?.toLowerCase())
            .maybeSingle();

          // If application exists and is not fully approved/onboarded
          if (application) {
            const approvedStatuses = ["approved", "account_created", "onboarded"];
            if (!approvedStatuses.includes(application.status)) {
              setStatus("pending_approval");
              return;
            }
          }
        } catch (error) {
          console.error("Error checking judge application:", error);
          // If we can't verify, allow access (they have the role)
        }
      }

      // All checks passed
      setStatus("approved");
    }

    checkJudgeAccess();
  }, [user, roles, loading]);

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-white/70">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in - redirect to login with return URL
  if (status === "not_logged_in") {
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`/login?next=${encodeURIComponent(returnUrl)}`} replace />;
  }

  // Not a judge - show unauthorized
  if (status === "not_judge") {
    return <Navigate to="/unauthorized" replace />;
  }

  // OTP required - redirect to OTP page
  if (status === "otp_required") {
    const returnUrl = location.pathname + location.search;
    return (
      <Navigate 
        to={`/otp?email=${encodeURIComponent(judgeEmail)}&redirect=${encodeURIComponent(returnUrl)}`} 
        replace 
      />
    );
  }

  // Pending approval - redirect to status page
  if (status === "pending_approval") {
    return <Navigate to="/judge-status" replace />;
  }

  // Approved - render children
  return <>{children}</>;
}

/**
 * Helper to mark OTP as verified in session
 * Call this after successful OTP verification
 */
export function markOTPVerified(userId: string) {
  sessionStorage.setItem(`otp_verified_${userId}`, "true");
}

/**
 * Helper to clear OTP verification on logout
 */
export function clearOTPVerification(userId: string) {
  sessionStorage.removeItem(`otp_verified_${userId}`);
}
