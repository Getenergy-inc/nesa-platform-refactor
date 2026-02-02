import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { 
  ShieldCheck, 
  Loader2, 
  Mail,
  RefreshCw,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { markOTPVerified } from "@/components/judge/JudgeArenaGuard";

export default function OTPVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get("email");
  const redirectUrl = searchParams.get("redirect") || searchParams.get("next") || "/judge/dashboard";
  
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const cooldownInterval = useRef<NodeJS.Timeout | null>(null);

  // Start cooldown on mount (OTP was just sent)
  useEffect(() => {
    setResendCooldown(60);
    cooldownInterval.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownInterval.current) clearInterval(cooldownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (cooldownInterval.current) clearInterval(cooldownInterval.current);
    };
  }, []);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Verify OTP using Supabase Auth
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email || "",
        token: otp,
        type: "email",
      });

      if (verifyError) {
        if (verifyError.message.includes("expired")) {
          setError("This code has expired. Please request a new one.");
        } else if (verifyError.message.includes("invalid")) {
          setError("Invalid verification code. Please try again.");
        } else {
          throw verifyError;
        }
        return;
      }

      if (data?.session) {
        // Mark OTP as verified in session storage
        markOTPVerified(data.session.user.id);
        toast.success("Verification successful!");
        navigate(redirectUrl);
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError(err.message || "Failed to verify code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;

    setIsResending(true);
    setError(null);

    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (resendError) throw resendError;

      toast.success("New verification code sent!");
      setOtp("");
      setResendCooldown(60);
      
      cooldownInterval.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownInterval.current) clearInterval(cooldownInterval.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      toast.error(err.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  // Handle OTP completion
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  if (!email) {
    return (
      <>
        <Helmet>
          <title>OTP Verification | NESA-Africa</title>
        </Helmet>
        <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-white/10 bg-charcoal-light">
            <CardContent className="py-8 text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Session Error</h3>
              <p className="text-white/60 mb-6">
                Missing email information. Please sign in again.
              </p>
              <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                <Link to="/login">
                  Return to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Verify Your Identity | NESA-Africa</title>
      </Helmet>

      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gold/20 bg-charcoal-light">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-gold" />
            </div>
            <CardTitle className="text-2xl text-white">Verify Your Identity</CardTitle>
            <CardDescription className="text-white/70">
              A one-time verification code has been sent to your email.
              <br />
              <span className="text-gold font-medium">This step is required for all judges before accessing the Judges Arena.</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Email Info */}
            <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-center">
              <Mail className="h-6 w-6 text-gold mx-auto mb-2" />
              <p className="text-sm text-white/70">
                Code sent to:
              </p>
              <p className="text-white font-medium">{email}</p>
            </div>

            {/* OTP Input */}
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
                disabled={isVerifying}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="bg-white/5 border-white/20 text-white text-lg w-12 h-14" />
                  <InputOTPSlot index={1} className="bg-white/5 border-white/20 text-white text-lg w-12 h-14" />
                  <InputOTPSlot index={2} className="bg-white/5 border-white/20 text-white text-lg w-12 h-14" />
                  <InputOTPSlot index={3} className="bg-white/5 border-white/20 text-white text-lg w-12 h-14" />
                  <InputOTPSlot index={4} className="bg-white/5 border-white/20 text-white text-lg w-12 h-14" />
                  <InputOTPSlot index={5} className="bg-white/5 border-white/20 text-white text-lg w-12 h-14" />
                </InputOTPGroup>
              </InputOTP>

              {error && (
                <div className="w-full p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
              size="lg"
              className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Verify & Continue
                </>
              )}
            </Button>

            {/* Resend */}
            <div className="text-center space-y-2">
              <p className="text-sm text-white/60">Didn't receive the code?</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className="text-gold hover:text-gold-dark hover:bg-gold/10"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            {/* Security Note */}
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-white/70">
                  <p className="font-medium text-blue-400 mb-1">Security Notice</p>
                  <p>
                    This additional verification protects the integrity of the 
                    NESA-Africa judging process and ensures only authorized judges 
                    access sensitive nominee information.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to login */}
            <p className="text-center text-sm text-white/50">
              Need to use a different account?{" "}
              <Link to="/login" className="text-gold hover:underline">
                Sign in again
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
