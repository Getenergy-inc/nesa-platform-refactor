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
import {
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Loader2,
  Gift,
} from "lucide-react";
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
            <Label>Country</Label>
            <Select
              value={data.country}
              onValueChange={(val) => onChange({ country: val })}
              disabled={isSubmitting}
            >
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

          {/* Organization */}
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
        </CardContent>
      </Card>

      {/* Nomination Awareness Banner */}
      <Card className="mt-4 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Earn Afrigold Points by Nominating
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submit verified nominations and earn +10 Afrigold Points per
              nomination. Use your points to vote for African education
              changemakers advocating Education for All.
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
