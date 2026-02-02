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
        // Check if the user has verified OTP in this session
        // We use the session's AMR (Authentication Methods Reference) to check
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.aud === "authenticated") {
          // For now, we consider password login sufficient
          // In production, you'd check session metadata for OTP verification
          const amr = (session as any)?.amr;
          
          // Check if OTP was verified in current session
          // Note: This is a simplified check. In production, you'd track this in the database
          const hasOTPVerification = amr?.some((m: any) => m.method === "otp") || 
            sessionStorage.getItem(`otp_verified_${user.id}`) === "true";
          
          setOtpVerified(hasOTPVerification);
        } else {
          setOtpVerified(false);
        }
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
