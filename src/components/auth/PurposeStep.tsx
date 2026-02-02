import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Lock, User, Gift, MapPin, Building2, Phone } from "lucide-react";
import { AccountType } from "./AccountTypeStep";

interface PurposeStepProps {
  accountType: AccountType;
  formData: RegistrationFormData;
  onChange: (data: Partial<RegistrationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export interface RegistrationFormData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  organization: string;
  country: string;
  chapterId: string;
  referralCode: string;
}

export function PurposeStep({ accountType, formData, onChange, onNext, onBack }: PurposeStepProps) {
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});

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

  // Group chapters by region
  const chaptersByRegion = chapters.reduce((acc, chapter) => {
    const region = chapter.region || "Other";
    if (!acc[region]) acc[region] = [];
    acc[region].push(chapter);
    return acc;
  }, {} as Record<string, typeof chapters>);

  const handleChapterChange = (chapterId: string) => {
    onChange({ chapterId });
    if (chapterId && chapterId !== "none") {
      const chapter = chapters.find((ch) => ch.id === chapterId);
      if (chapter?.referral_code) {
        onChange({ chapterId, referralCode: chapter.referral_code });
      }
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof RegistrationFormData, string>> = {};
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    
    if (accountType === "organization" && !formData.organization) {
      newErrors.organization = "Organization name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onNext();
    }
  };

  const showOrgField = accountType === "organization" || accountType === "sponsor";
  const showChapterField = accountType !== "judge";

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold">Tell Us About Yourself</h2>
        <p className="text-muted-foreground mt-2">
          Complete your profile information to get started.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              className="pl-10"
            />
          </div>
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="pl-10"
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={(e) => onChange({ password: e.target.value })}
              className="pl-10"
            />
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        {/* Phone (optional) */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+234 xxx xxx xxxx"
              value={formData.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Organization (for org/sponsor accounts) */}
        {showOrgField && (
          <div className="space-y-2">
            <Label htmlFor="organization">Organization Name *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="organization"
                type="text"
                placeholder="Your organization or company name"
                value={formData.organization}
                onChange={(e) => onChange({ organization: e.target.value })}
                className="pl-10"
              />
            </div>
            {errors.organization && <p className="text-xs text-destructive">{errors.organization}</p>}
          </div>
        )}

        {/* Chapter Selection (not for judges) */}
        {showChapterField && (
          <div className="space-y-2">
            <Label htmlFor="chapter">Join a Local Chapter (Optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
              <Select value={formData.chapterId} onValueChange={handleChapterChange}>
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
        )}

        {/* Referral Code */}
        <div className="space-y-2">
          <Label htmlFor="referralCode">Referral Code (Optional)</Label>
          <div className="relative">
            <Gift className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="referralCode"
              type="text"
              placeholder="Enter referral code"
              value={formData.referralCode}
              onChange={(e) => onChange({ referralCode: e.target.value })}
              className="pl-10"
            />
          </div>
          {formData.referralCode && (
            <p className="text-xs text-primary">🎁 You'll receive bonus AGC credits!</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleSubmit}
          className="min-w-[200px] bg-gradient-gold text-secondary font-semibold hover:opacity-90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
