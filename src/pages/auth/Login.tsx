import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Award, Mail, Lock, ShieldCheck } from "lucide-react";
import { JudgeOTPNotice, JudgeOTPHelperText } from "@/components/auth/JudgeOTPNotice";
import { markOTPVerified } from "@/components/judge/JudgeOTPGate";

export default function Login() {
  const { t } = useTranslation("pages");
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Get the redirect URL from query params (supports 'next', 'from', 'callbackUrl', 'redirect')
  const nextUrl = searchParams.get("next") 
    || searchParams.get("from") 
    || searchParams.get("callbackUrl") 
    || searchParams.get("redirect") 
    || "/dashboard";

  // Check if this is a judge-related redirect
  const isJudgeLogin = nextUrl.startsWith("/judge");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      
      // Check if user is a judge (has jury role)
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id);
        
        const isJudge = roles?.some(r => r.role === "jury" || r.role === "admin");
        
        if (isJudge && nextUrl.startsWith("/judge")) {
          // Redirect judges to OTP verification for arena access
          toast.success(t("auth.login.welcomeBack"));
          
          // Send OTP email
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
              shouldCreateUser: false,
            },
          });

          if (otpError) {
            console.error("OTP send error:", otpError);
            // If OTP fails, still proceed but log the error
            toast.warning("OTP verification may be required");
          }

          navigate(`/otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(nextUrl)}`);
          return;
        }
      }
      
      toast.success(t("auth.login.welcomeBack"));
      // Navigate to the next URL or dashboard
      navigate(nextUrl);
    } catch (error: any) {
      toast.error(error.message || t("auth.login.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <Award className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="font-display text-2xl">{t("auth.login.title")}</CardTitle>
          <CardDescription>
            {t("auth.login.subtitle")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Judge OTP Notice - Show for judge-related logins */}
            {isJudgeLogin && (
              <JudgeOTPNotice />
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.login.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("auth.login.password")}</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.login.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-gradient-gold text-secondary font-semibold hover:opacity-90 shadow-gold"
              disabled={loading}
            >
              {loading ? t("auth.login.signingIn") : t("auth.login.signIn")}
            </Button>
            
            {/* Judge OTP helper text */}
            {isJudgeLogin && (
              <JudgeOTPHelperText />
            )}
            
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.login.noAccount")}{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                {t("auth.login.createOne")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
