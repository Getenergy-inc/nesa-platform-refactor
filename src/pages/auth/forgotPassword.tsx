import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { Mail, ShieldCheck } from "lucide-react";

const API_BASE = import.meta.env.VITE_BASE_API_URL;

export default function ForgotPassword() {
  const { t } = useTranslation("pages");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(
        `${API_BASE}/auth/password/reset/verificationlink?email=${email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      // Always succeed visually
      setSubmitted(true);
      toast.success(t("Reset Link sent to your email"));
    } catch {
      toast.success(t("Check your email for reset link"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <ShieldCheck className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="font-display text-2xl">
            {t("FORGOT PASSWORD")}
          </CardTitle>
          <CardDescription>{t("")}</CardDescription>
        </CardHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {loading ? t("sending") : t("Request password reset link")}
              </Button>

              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:underline"
              >
                {t("back to login")}
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("check your email")}
            </p>
            <Link to="/login" className="text-sm text-primary hover:underline">
              {t("back to login")}
            </Link>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
