import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Award, Mail, Lock, User, Gift, MapPin } from "lucide-react";

export default function Register() {
  const { t } = useTranslation("pages");
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") || "");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Fetch active chapters for dropdown
  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("id, name, country, region, referral_code")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Capture referral code from URL and auto-select chapter if it's a chapter code
  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferralCode(refCode);
      // Check if it's a chapter referral code (starts with CH-)
      if (refCode.startsWith("CH-")) {
        const matchingChapter = chapters.find(ch => ch.referral_code === refCode);
        if (matchingChapter) {
          setSelectedChapterId(matchingChapter.id);
        }
      }
    }
  }, [searchParams, chapters]);

  // When chapter is selected, update the referral code
  const handleChapterChange = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    if (chapterId && chapterId !== "none") {
      const chapter = chapters.find(ch => ch.id === chapterId);
      if (chapter?.referral_code) {
        setReferralCode(chapter.referral_code);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If a chapter is selected but no referral code, use the chapter's code
      let finalReferralCode = referralCode;
      if (selectedChapterId && selectedChapterId !== "none" && !referralCode) {
        const chapter = chapters.find(ch => ch.id === selectedChapterId);
        if (chapter?.referral_code) {
          finalReferralCode = chapter.referral_code;
        }
      }

      await signUp(email, password, fullName, finalReferralCode || undefined);
      toast.success(t("auth.register.successMessage"));
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || t("auth.register.failedMessage"));
    } finally {
      setLoading(false);
    }
  };

  // Group chapters by region for better UX
  const chaptersByRegion = chapters.reduce((acc, chapter) => {
    const region = chapter.region || "Other";
    if (!acc[region]) acc[region] = [];
    acc[region].push(chapter);
    return acc;
  }, {} as Record<string, typeof chapters>);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-12 pattern-african">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <Award className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="font-display text-2xl">{t("auth.register.title")}</CardTitle>
          <CardDescription>
            {t("auth.register.subtitle")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t("auth.register.fullName")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder={t("auth.register.fullNamePlaceholder")}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.register.email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.register.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.register.password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.register.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">{t("auth.register.passwordHint")}</p>
            </div>

            {/* Chapter Selection Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="chapter">Join a Local Chapter (Optional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
                <Select value={selectedChapterId} onValueChange={handleChapterChange}>
                  <SelectTrigger className="pl-10 bg-background">
                    <SelectValue placeholder="Select your country chapter" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50 max-h-60">
                    <SelectItem value="none">No chapter selected</SelectItem>
                    {Object.entries(chaptersByRegion).map(([region, regionChapters]) => (
                      <div key={region}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                          {region}
                        </div>
                        {regionChapters.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            {chapter.name} ({chapter.country})
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                Connect with educators in your country and earn chapter bonuses
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">{t("auth.register.referralCode")}</Label>
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="referralCode"
                  type="text"
                  placeholder={t("auth.register.referralCodePlaceholder")}
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="pl-10"
                />
              </div>
              {referralCode && (
                <p className="text-xs text-primary">{t("auth.register.referralBonus")}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-gradient-gold text-secondary font-semibold hover:opacity-90 shadow-gold"
              disabled={loading}
            >
              {loading ? t("auth.register.creatingAccount") : t("auth.register.createAccount")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("auth.register.haveAccount")}{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                {t("auth.register.signIn")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
