import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, Scale, Users, Megaphone, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccountType = "individual" | "organization" | "judge" | "chapter" | "sponsor" | "volunteer";

interface AccountTypeOption {
  type: AccountType;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const accountTypes: AccountTypeOption[] = [
  {
    type: "individual",
    icon: <User className="h-8 w-8" />,
    title: "Individual",
    description: "Nominate educators, vote, and earn AGC rewards",
  },
  {
    type: "organization",
    icon: <Building2 className="h-8 w-8" />,
    title: "Organization",
    description: "Register your school, NGO, or educational institution",
  },
  {
    type: "judge",
    icon: <Scale className="h-8 w-8" />,
    title: "Judge / Jury",
    description: "Apply to become a NESA Awards jury member",
  },
  {
    type: "chapter",
    icon: <Users className="h-8 w-8" />,
    title: "Chapter Leader",
    description: "Lead a local NESA chapter in your country",
  },
  {
    type: "sponsor",
    icon: <Megaphone className="h-8 w-8" />,
    title: "Sponsor",
    description: "Partner with NESA to support African education",
  },
  {
    type: "volunteer",
    icon: <Heart className="h-8 w-8" />,
    title: "Volunteer",
    description: "Join the NESA movement as a volunteer",
  },
];

interface AccountTypeStepProps {
  selectedType: AccountType | null;
  onSelect: (type: AccountType) => void;
  onNext: () => void;
}

export function AccountTypeStep({ selectedType, onSelect, onNext }: AccountTypeStepProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold">Choose Your Account Type</h2>
        <p className="text-muted-foreground mt-2">
          Select the type of account that best describes you or your organization.
          <br />
          This helps us personalize your NESA platform experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountTypes.map((option) => (
          <Card
            key={option.type}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg hover:border-primary/50",
              selectedType === option.type && "border-2 border-primary bg-primary/5 shadow-lg"
            )}
            onClick={() => onSelect(option.type)}
          >
            <CardContent className="p-6 text-center">
              <div
                className={cn(
                  "mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
                  selectedType === option.type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {option.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
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
