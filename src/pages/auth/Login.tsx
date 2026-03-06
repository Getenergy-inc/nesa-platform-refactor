import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, Loader2 } from "lucide-react";
import {
  JudgeOTPNotice,
  JudgeOTPHelperText,
} from "@/components/auth/JudgeOTPNotice";
import { motion } from "framer-motion";
import nesaStamp from "@/assets/nesa-stamp.jpeg";
import { AppRole } from "@/config/roles";

export default function Login() {
  const { t } = useTranslation("pages");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, hasRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const nextUrl =
    searchParams.get("next") ||
    searchParams.get("from") ||
    searchParams.get("callbackUrl") ||
    searchParams.get("redirect");

  const isJudgeLogin = nextUrl?.startsWith("/judge");

  const resolvePostLoginRoute = (role: AppRole) => {
    console.log("role", role);
    switch (role) {
      case "NOMINEE":
        return "/nominee/dashboard";
      case "jury":
        return "/judge";
      case "ADMIN":
        return "/admin";
      case "NRC":
        return "/nrc";
      default:
        return "/dashboard";
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (error) throw error;
    } catch (error) {
      toast.error(error.message || "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const role = await signIn(email, password);
      toast.success(t("auth.login.welcomeBack"));
      console.log("the role is this", role);

      // Jury requires OTP if accessing judge panel
      if (hasRole("jury") && isJudgeLogin) {
        navigate(
          `/otp?email=${encodeURIComponent(
            email,
          )}&redirect=${encodeURIComponent(nextUrl || "/judge")}`,
        );
        return;
      }
      const resolvedRoute = resolvePostLoginRoute(role);
      console.log("resolved route", resolvedRoute);

      navigate(resolvedRoute);
    } catch (err) {
      toast.error(err.message || t("auth.login.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In | NESA Africa</title>
      </Helmet>

      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link to="/" className="flex items-center gap-3">
            <img
              src={nesaStamp}
              alt="NESA Africa"
              className="h-14 w-14 rounded-full object-contain"
            />
            <span className="font-display text-xl font-bold text-white">
              NESA Africa
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <Card className="border-white/10 bg-charcoal-light shadow-2xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl text-white">
                {t("auth.login.title")}
              </CardTitle>
              <CardDescription className="text-white/60">
                {t("auth.login.subtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {isJudgeLogin && <JudgeOTPNotice />}

              {/* Google */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 gap-3 h-11"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Continue with Google"
                )}
              </Button>

              {/* Divider */}
              <div className="text-center text-xs text-white/40">
                or sign in with email
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white/80">
                    {t("auth.login.email")}
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("auth.login.emailPlaceholder")}
                      className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white/80">
                      {t("auth.login.password")}
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-gold hover:underline"
                    >
                      {t("auth.login.forgotPassword")}
                    </Link>
                  </div>

                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("auth.login.passwordPlaceholder")}
                      className="pl-10 bg-white/5 border-white/15 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold h-11"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    t("auth.login.signIn")
                  )}
                </Button>
              </form>

              {isJudgeLogin && <JudgeOTPHelperText />}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <p className="text-center text-sm text-white/50">
                {t("auth.login.noAccount")}{" "}
                <Link
                  to="/register"
                  className="font-medium text-gold hover:underline"
                >
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
