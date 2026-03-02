import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
<<<<<<< HEAD
import { Mail, Lock, User, Phone, Building2, Loader2 } from "lucide-react";
=======
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, Lock, User, Gift, MapPin, Phone, Building2, Globe, Info } from "lucide-react";
>>>>>>> 2eff4f71ba00876c4d5cebfd69bc5127ef9d6331
import { AccountType } from "./AccountTypeStep";

export interface PersonalInfoData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  organization: string;
}

interface PersonalInfoStepProps {
  accountType: AccountType;
  data: PersonalInfoData;
  onChange: (data: Partial<PersonalInfoData>) => void;
  onNext: () => Promise<void> | void;
  onBack: () => void;
}

const countries = [
  "Nigeria",
  "Kenya",
  "Ghana",
  "South Africa",
  "Ethiopia",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Senegal",
  "Cameroon",
  "Côte d'Ivoire",
  "Morocco",
  "Egypt",
  "Algeria",
  "Tunisia",
  "Zimbabwe",
  "Zambia",
  "Botswana",
  "Mozambique",
  "Angola",
  "Other",
];

export function PersonalInfoStep({
  accountType,
  data,
  onChange,
  onNext,
  onBack,
}: PersonalInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

<<<<<<< HEAD
=======
  // Auto-assign chapter when country changes
  useEffect(() => {
    if (!data.country || data.country === "Other" || chapters.length === 0) return;
    
    // Find chapters matching the selected country
    const matchingChapters = chapters.filter(
      (ch) => ch.country.toLowerCase() === data.country.toLowerCase()
    );
    
    if (matchingChapters.length === 1) {
      // Auto-select the only matching chapter
      const chapter = matchingChapters[0];
      onChange({
        chapterId: chapter.id,
        referralCode: data.referralCode || chapter.referral_code || "",
      });
    } else if (matchingChapters.length > 1 && !data.chapterId) {
      // Auto-select first match if none selected
      const chapter = matchingChapters[0];
      onChange({
        chapterId: chapter.id,
        referralCode: data.referralCode || chapter.referral_code || "",
      });
    }
  }, [data.country, chapters]);

  // Filter chapters by selected country (show all if no country or "Other")
  const filteredChapters = data.country && data.country !== "Other"
    ? chapters.filter((ch) => ch.country.toLowerCase() === data.country.toLowerCase())
    : chapters;

  // Group filtered chapters by region
  const chaptersByRegion = filteredChapters.reduce((acc, chapter) => {
    const region = chapter.region || "Other";
    if (!acc[region]) acc[region] = [];
    acc[region].push(chapter);
    return acc;
  }, {} as Record<string, typeof chapters>);

  // Get selected chapter details for badge display
  const selectedChapter = chapters.find((ch) => ch.id === data.chapterId);

  const handleChapterChange = (chapterId: string) => {
    if (chapterId && chapterId !== "none") {
      const chapter = chapters.find((ch) => ch.id === chapterId);
      if (chapter?.referral_code) {
        onChange({ chapterId, referralCode: data.referralCode || chapter.referral_code });
        return;
      }
    }
    if (chapterId === "none") {
      onChange({ chapterId: "" });
      return;
    }
    onChange({ chapterId });
  };

>>>>>>> 2eff4f71ba00876c4d5cebfd69bc5127ef9d6331
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.fullName?.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!data.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onNext(); // supports async backend call
    } catch (error) {
      console.error("Account creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showOrgField =
    accountType === "ORGANIZATION" || accountType === "SPONSOR";

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          Personal Information
        </h2>
        <p className="text-muted-foreground mt-2">
          Enter your details to create your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Account Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={data.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={data.password}
                onChange={(e) => onChange({ password: e.target.value })}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+234 xxx xxx xxxx"
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
<<<<<<< HEAD
            <Label>Country</Label>
            <Select
              value={data.country}
              onValueChange={(val) => onChange({ country: val })}
              disabled={isSubmitting}
            >
=======
            <Label>Country <span className="text-destructive">*</span></Label>
            <Select value={data.country} onValueChange={(val) => onChange({ country: val })}>
>>>>>>> 2eff4f71ba00876c4d5cebfd69bc5127ef9d6331
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

<<<<<<< HEAD
          {/* Organization */}
=======
          {/* Auto-assigned Chapter & Region Badges */}
          {selectedChapter && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Your Local Chapter & Region</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Your Local Chapter and Region are automatically assigned for your convenience. You can still explore other regions, categories, and local chapters once signed in.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <MapPin className="h-3 w-3 mr-1" />
                  {selectedChapter.name} Chapter
                </Badge>
                {selectedChapter.region && (
                  <Badge variant="secondary" className="bg-accent/50 border-accent">
                    <Globe className="h-3 w-3 mr-1" />
                    {selectedChapter.region}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Organization (for org/sponsor accounts) */}
>>>>>>> 2eff4f71ba00876c4d5cebfd69bc5127ef9d6331
          {showOrgField && (
            <div className="space-y-2">
              <Label htmlFor="organization">Organization Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="organization"
                  placeholder="Your organization name"
                  value={data.organization}
                  onChange={(e) => onChange({ organization: e.target.value })}
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
<<<<<<< HEAD
=======

          {/* Chapter Selection (manual override) */}
          {showChapterField && (
            <div className="space-y-2">
              <Label>
                {selectedChapter ? "Change Local Chapter" : "Join a Local Chapter (Optional)"}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
                <Select value={data.chapterId} onValueChange={handleChapterChange}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select your country chapter" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
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
              {!selectedChapter && (
                <p className="text-xs text-muted-foreground">
                  Connect with educators in your country and earn chapter bonuses
                </p>
              )}
            </div>
          )}

          {/* Referral Code */}
          <div className="space-y-2">
            <Label htmlFor="referralCode">Referral Code (Optional)</Label>
            <div className="relative">
              <Gift className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="referralCode"
                placeholder="Enter referral code"
                value={data.referralCode}
                onChange={(e) => onChange({ referralCode: e.target.value })}
                className="pl-10"
              />
            </div>
            {data.referralCode && (
              <p className="text-xs text-primary">🎁 You'll receive bonus AGC credits!</p>
            )}
          </div>
>>>>>>> 2eff4f71ba00876c4d5cebfd69bc5127ef9d6331
        </CardContent>
      </Card>

      {/* Nomination Awareness Banner */}
      <Card className="mt-4 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Earn Afrigold Points by Nominating</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submit verified nominations and earn +10 Afrigold Points per nomination. Use your points to vote for African education changemakers advocating Education for All.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex gap-4 justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>

        <Button
          size="lg"
          onClick={handleContinue}
          disabled={isSubmitting}
          className="min-w-[200px] bg-gradient-gold text-secondary font-semibold hover:opacity-90"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </div>
  );
}
