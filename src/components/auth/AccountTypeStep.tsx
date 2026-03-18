import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Scale, Users, Megaphone, Heart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccountType = "individual" | "organization" | "judge" | "chapter" | "sponsor" | "volunteer";

interface AccountTypeOption {
  type: AccountType;
  icon: React.ReactNode;
  title: string;
  tagline: string;
  features: string[];
  badge?: string;
}

const accountTypes: AccountTypeOption[] = [
  {
    type: "individual",
    icon: <User className="h-7 w-7" />,
    title: "Individual",
    tagline: "Celebrate educators making a difference",
    features: [
      "Nominate outstanding educators",
      "Vote for your favorites with AGC",
      "Earn referral rewards",
      "Access exclusive content",
    ],
    badge: "Most Popular",
  },
  {
    type: "organization",
    icon: <Building2 className="h-7 w-7" />,
    title: "Organization",
    tagline: "Register your institution or NGO",
    features: [
      "Official institutional profile",
      "Nominate staff & programs",
      "Bulk voting credits",
      "Priority support access",
    ],
  },
  {
    type: "judge",
    icon: <Scale className="h-7 w-7" />,
    title: "Judge / Jury",
    tagline: "Shape the future of African education",
    features: [
      "Evaluate nominations",
      "Access confidential dossiers",
      "Exclusive jury training",
      "Recognition & certification",
    ],
    badge: "By Application",
  },
  {
    type: "chapter",
    icon: <Users className="h-7 w-7" />,
    title: "Chapter Leader",
    tagline: "Lead NESA in your country",
    features: [
      "Manage local chapter",
      "Earn commission on referrals",
      "Coordinate regional events",
      "Direct settlement payouts",
    ],
  },
  {
    type: "sponsor",
    icon: <Megaphone className="h-7 w-7" />,
    title: "Sponsor",
    tagline: "Partner with NESA Africa",
    features: [
      "Brand visibility across Africa",
      "Category sponsorship options",
      "VIP gala access",
      "Impact reports & recognition",
    ],
  },
  {
    type: "volunteer",
    icon: <Heart className="h-7 w-7" />,
    title: "Volunteer",
    tagline: "Join the movement",
    features: [
      "Support award operations",
      "Community engagement",
      "Training & development",
      "Volunteer certification",
    ],
  },
];

interface AccountTypeStepProps {
  selectedType: AccountType | null;
  onSelect: (type: AccountType) => void;
  onNext: () => void;
}

export function AccountTypeStep({ selectedType, onSelect, onNext }: AccountTypeStepProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold">Choose Your Account Type</h2>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Select the type of account that best describes you. This personalizes your NESA experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountTypes.map((option) => (
          <Card
            key={option.type}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 relative overflow-hidden",
              selectedType === option.type && "border-2 border-primary bg-primary/5 shadow-lg"
            )}
            onClick={() => onSelect(option.type)}
          >
            {option.badge && (
              <Badge 
                variant="secondary" 
                className="absolute top-3 right-3 text-xs bg-primary/10 text-primary border-0"
              >
                {option.badge}
              </Badge>
            )}
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    selectedType === option.type
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base">{option.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{option.tagline}</p>
                </div>
              </div>
              
              <ul className="mt-4 space-y-2">
                {option.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className={cn(
                      "h-4 w-4 mt-0.5 shrink-0",
                      selectedType === option.type ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          onClick={onNext}
          disabled={!selectedType}
          className="min-w-[200px] bg-gradient-gold text-secondary font-semibold hover:opacity-90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
