import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface JudgeOTPGateProps {
  children: ReactNode;
}

/**
 * JudgeOTPGate - Enforces OTP verification for judges
 * 
 * Flow:
 * 1. If not logged in → redirect to /login?next=/judge/...
 * 2. If logged in but not a judge → show /unauthorized
 * 3. If judge but OTP not verified → redirect to OTP page
 * 4. If judge with verified OTP → render children
 * 
 * Note: This component should wrap JudgeProtectedRoute
 */
export function JudgeOTPGate({ children }: JudgeOTPGateProps) {
  const { user, roles, loading } = useAuth();
  const location = useLocation();
  const [otpVerified, setOtpVerified] = useState<boolean | null>(null);
  const [checkingOTP, setCheckingOTP] = useState(true);

  useEffect(() => {
    async function checkOTPStatus() {
      if (!user) {
        setCheckingOTP(false);
        return;
      }
      try {
        // Server-side check via judge_otp_sessions table (RLS-scoped to user)
        const { data: otpRow } = await supabase
          .from("judge_otp_sessions")
          .select("id, expires_at")
          .eq("user_id", user.id)
          .gt("expires_at", new Date().toISOString())
          .order("verified_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        setOtpVerified(!!otpRow);
      } catch (error) {
        console.error("Error checking OTP status:", error);
        setOtpVerified(false);
      } finally {
        setCheckingOTP(false);
      }
    }

    if (!loading) {
      checkOTPStatus();
    }
  }, [user, loading]);

  if (loading || checkingOTP) {
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
  if (!user) {
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`/login?next=${encodeURIComponent(returnUrl)}`} replace />;
  }

  // Check if user has jury role
  const isJudge = roles.includes("jury") || roles.includes("admin");

  if (!isJudge) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Judge but OTP not verified - redirect to OTP page
  if (!otpVerified) {
    const returnUrl = location.pathname + location.search;
    return (
      <Navigate 
        to={`/otp?email=${encodeURIComponent(user.email || "")}&redirect=${encodeURIComponent(returnUrl)}`} 
        replace 
      />
    );
  }

  // Authenticated judge with verified OTP - render children
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
