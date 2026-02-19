import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, ShieldCheck } from "lucide-react";

const API_BASE = import.meta.env.VITE_BASE_API_URL;

export default function ResetPassword() {
  const { t } = useTranslation("pages");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");
  const email = params.get("email");

  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setValid(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/auth/password/reset/confirmlink?token=${token}&email=${email}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        setValid(res.ok);
      } catch {
        setValid(false);
      }
    })();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error(t("auth.resetPassword.mismatch"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error();

      toast.success(t("password reset successful"));
      navigate("/login");
    } catch {
      toast.error(t("password reset failed"));
    } finally {
      setLoading(false);
    }
  };

  if (valid === null) {
    return null; // or spinner
  }

  if (!valid) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardHeader>
            <CardTitle>{t("Link Invalid")}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <ShieldCheck className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="font-display text-2xl">
            {t("RESET PASSWORD")}
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("Enter your new password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("Confirm password")}</Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-gold text-secondary font-semibold"
              disabled={loading}
            >
              {loading ? t("resetting") : t("reset")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
