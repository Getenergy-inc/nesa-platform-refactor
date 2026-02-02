import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ArrowRight,
  Mail,
  Clock
} from "lucide-react";

export default function JudgeVerify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setError("No verification token provided.");
        setIsVerifying(false);
        return;
      }

      try {
        // Find the application with this token
        const { data: application, error: fetchError } = await supabase
          .from("judge_applications")
          .select("id, email, status, verification_token_expires_at")
          .eq("verification_token", token)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!application) {
          setError("Invalid or expired verification link. Please check your application status.");
          setIsVerifying(false);
          return;
        }

        // Check if already verified
        if (application.status !== "submitted") {
          setEmail(application.email);
          setIsSuccess(true);
          setIsVerifying(false);
          return;
        }

        // Check if token expired
        if (application.verification_token_expires_at) {
          const expiresAt = new Date(application.verification_token_expires_at);
          if (expiresAt < new Date()) {
            setError("This verification link has expired. Please contact us to resend.");
            setIsVerifying(false);
            return;
          }
        }

        // Update the application status
        const { error: updateError } = await supabase
          .from("judge_applications")
          .update({
            status: "email_verified",
            verified_at: new Date().toISOString(),
          })
          .eq("id", application.id);

        if (updateError) throw updateError;

        setEmail(application.email);
        setIsSuccess(true);
      } catch (err: any) {
        console.error("Verification error:", err);
        setError("Failed to verify your email. Please try again or contact support.");
      } finally {
        setIsVerifying(false);
      }
    }

    verifyToken();
  }, [token]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-4" />
          <p className="text-white/70">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Email Verification | NESA-Africa Judges</title>
      </Helmet>

      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        {isSuccess ? (
          <Card className="max-w-md w-full border-green-500/20 bg-charcoal-light">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-white">Email Verified!</CardTitle>
              <CardDescription className="text-white/70">
                Your email has been successfully verified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                <Mail className="h-6 w-6 text-gold mx-auto mb-2" />
                <p className="text-white/80 text-sm">
                  {email && <strong className="text-gold">{email}</strong>}
                </p>
              </div>

              <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
                <Clock className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-yellow-400">
                  <strong>What's next?</strong>
                </p>
                <p className="text-sm text-white/70 mt-1">
                  Your application is now under review. Our committee will evaluate your 
                  qualifications and notify you within 5-7 business days.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                  <Link to={`/judge-signup?email=${encodeURIComponent(email || "")}`}>
                    Create Judge Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/judge-status">Check Application Status</Link>
                </Button>
                <Button asChild variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5">
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-md w-full border-red-500/20 bg-charcoal-light">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-white">Verification Failed</CardTitle>
              <CardDescription className="text-white/70">
                We couldn't verify your email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-white/60">{error}</p>

              <div className="flex flex-col gap-2 pt-4">
                <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                  <Link to="/judge-status">
                    Check Application Status
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
