import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Award, Mail, Lock, Loader2 } from "lucide-react";
import { JudgeOTPNotice, JudgeOTPHelperText } from "@/components/auth/JudgeOTPNotice";
import { motion } from "framer-motion";
import nesaStamp from "@/assets/nesa-stamp.jpeg";

export default function Login() {
  const { t } = useTranslation("pages");
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const nextUrl = searchParams.get("next") 
    || searchParams.get("from") 
    || searchParams.get("callbackUrl") 
    || searchParams.get("redirect") 
    || "/dashboard";

  const isJudgeLogin = nextUrl.startsWith("/judge");

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id);
        
        const isJudge = roles?.some(r => r.role === "jury" || r.role === "admin");
        
        if (isJudge && nextUrl.startsWith("/judge")) {
          toast.success(t("auth.login.welcomeBack"));
          
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email: email,
            options: { shouldCreateUser: false },
          });

          if (otpError) {
            console.error("OTP send error:", otpError);
            toast.warning("OTP verification may be required");
          }

          navigate(`/otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(nextUrl)}`);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, referred_by_chapter_id")
          .eq("user_id", userData.user.id)
          .maybeSingle();

        if (profile?.referred_by_chapter_id) {
          const { data: chapter } = await supabase
            .from("chapters")
            .select("name, region")
            .eq("id", profile.referred_by_chapter_id)
            .maybeSingle();

          if (chapter) {
            const name = profile.full_name?.split(" ")[0] || "";
            toast.success(
              `Welcome back${name ? `, ${name}` : ""}!`, {
                description: `Viewing: ${chapter.name} Chapter${chapter.region ? ` • ${chapter.region}` : ""}. Track your Afrigold Points and active campaigns on your dashboard.`,
              }
            );
            navigate(nextUrl);
            return;
          }
        }
      }
      
      toast.success(t("auth.login.welcomeBack"));
      navigate(nextUrl);
    } catch (error: any) {
      toast.error(error.message || t("auth.login.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In | NESA-Africa</title>
      </Helmet>
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/" className="flex items-center gap-3">
            <img src={nesaStamp} alt="NESA Africa" className="h-14 w-14 rounded-full object-contain" />
            <span className="font-display text-xl font-bold text-white">NESA Africa</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="border-white/10 bg-charcoal-light shadow-2xl">
            <CardHeader className="space-y-2 text-center pb-4">
              <CardTitle className="font-display text-2xl text-white">{t("auth.login.title")}</CardTitle>
              <CardDescription className="text-white/60">
                {t("auth.login.subtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Google Sign-In */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white gap-3 h-11"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="relative">
                <Separator className="bg-white/10" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-charcoal-light px-3 text-xs text-white/40">
                  or sign in with email
                </span>
              </div>

              {/* Judge OTP Notice */}
              {isJudgeLogin && <JudgeOTPNotice />}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">{t("auth.login.email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("auth.login.emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-gold/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white/80">{t("auth.login.password")}</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-gold hover:underline"
                    >
                      {t("auth.login.forgotPassword")}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t("auth.login.passwordPlaceholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-gold/50"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold h-11"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                  ) : (
                    t("auth.login.signIn")
                  )}
                </Button>
              </form>

              {isJudgeLogin && <JudgeOTPHelperText />}
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-0">
              <p className="text-center text-sm text-white/50">
                {t("auth.login.noAccount")}{" "}
                <Link to="/register" className="font-medium text-gold hover:underline">
                  {t("auth.login.createOne")}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
