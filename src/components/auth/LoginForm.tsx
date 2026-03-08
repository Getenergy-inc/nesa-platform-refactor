// Login Form — extracted for unified auth page
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Mail, Lock, Loader2 } from "lucide-react";
import { JudgeOTPNotice, JudgeOTPHelperText } from "@/components/auth/JudgeOTPNotice";
import { GoogleButton } from "@/components/auth/GoogleButton";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { t } = useTranslation("pages");
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const nextUrl = searchParams.get("next") || searchParams.get("from") || searchParams.get("callbackUrl") || searchParams.get("redirect") || "/dashboard";
  const isJudgeLogin = nextUrl.startsWith("/judge");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id);
        const isJudge = roles?.some(r => r.role === "jury" || r.role === "admin");
        if (isJudge && nextUrl.startsWith("/judge")) {
          toast.success(t("auth.login.welcomeBack"));
          await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
          navigate(`/otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(nextUrl)}`);
          return;
        }
        const { data: profile } = await supabase.from("profiles").select("full_name, referred_by_chapter_id").eq("user_id", userData.user.id).maybeSingle();
        if (profile?.referred_by_chapter_id) {
          const { data: chapter } = await supabase.from("chapters").select("name, region").eq("id", profile.referred_by_chapter_id).maybeSingle();
          if (chapter) {
            const name = profile.full_name?.split(" ")[0] || "";
            toast.success(`Welcome back${name ? `, ${name}` : ""}!`, {
              description: `Viewing: ${chapter.name} Chapter${chapter.region ? ` • ${chapter.region}` : ""}.`,
            });
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
    <div className="space-y-4">
      <GoogleButton label="Continue with Google" />

      <div className="relative my-5">
        <Separator className="bg-primary/8" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[hsl(30_8%_9%)] px-3 text-[11px] text-secondary-foreground/25 uppercase tracking-wider">
          or
        </span>
      </div>

      {isJudgeLogin && <JudgeOTPNotice />}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-secondary-foreground/60 text-xs font-medium">{t("auth.login.email")}</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-foreground/25" />
            <Input
              id="login-email"
              type="email"
              placeholder={t("auth.login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-secondary-foreground/[0.03] border-primary/10 text-secondary-foreground placeholder:text-secondary-foreground/20 focus:border-primary/30 focus:ring-1 focus:ring-primary/15 h-11 rounded-xl transition-colors"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-secondary-foreground/60 text-xs font-medium">{t("auth.login.password")}</Label>
            <Link to="/forgot-password" className="text-[11px] text-primary/60 hover:text-primary transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-foreground/25" />
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 bg-secondary-foreground/[0.03] border-primary/10 text-secondary-foreground placeholder:text-secondary-foreground/20 focus:border-primary/30 focus:ring-1 focus:ring-primary/15 h-11 rounded-xl transition-colors"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 rounded-xl shadow-md shadow-primary/15 hover:shadow-primary/25 transition-all mt-1"
          disabled={loading}
        >
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
        </Button>
      </form>

      {isJudgeLogin && <JudgeOTPHelperText />}
    </div>
  );
}
