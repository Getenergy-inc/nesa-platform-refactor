import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
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
import { Award, Mail, Lock } from "lucide-react";
import {
  JudgeOTPNotice,
  JudgeOTPHelperText,
} from "@/components/auth/JudgeOTPNotice";

export default function Login() {
  const { t } = useTranslation("pages");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, hasRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nextUrl =
    searchParams.get("next") ||
    searchParams.get("from") ||
    searchParams.get("callbackUrl") ||
    searchParams.get("redirect");

  const isJudgeLogin = nextUrl?.startsWith("/judge");

  const resolvePostLoginRoute = () => {
    if (hasRole("admin")) return "/admin";
    if (hasRole("jury")) return "/judge";
    return "/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);

      toast.success(t("auth.login.welcomeBack"));

      // Judge access requires OTP
      if (hasRole("jury") && isJudgeLogin) {
        navigate(
          `/otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(
            nextUrl!,
          )}`,
        );
        return;
      }
      const route = resolvePostLoginRoute();

      navigate(route);
    } catch (err) {
      toast.error(err.message || t("auth.login.invalidCredentials"));
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
          <CardTitle className="font-display text-2xl">
            {t("auth.login.title")}
          </CardTitle>
          <CardDescription>{t("auth.login.subtitle")}</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isJudgeLogin && <JudgeOTPNotice />}

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.login.email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
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
              className="w-full bg-gradient-gold text-secondary font-semibold"
              disabled={loading}
            >
              {loading ? t("auth.login.signingIn") : t("auth.login.signIn")}
            </Button>

            {isJudgeLogin && <JudgeOTPHelperText />}

            <p className="text-center text-sm text-muted-foreground">
              {t("auth.login.noAccount")}{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                {t("auth.login.createOne")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
