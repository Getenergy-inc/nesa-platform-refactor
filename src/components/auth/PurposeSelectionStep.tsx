import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Vote, 
  GraduationCap, 
  Users, 
  Calendar, 
  Heart, 
  Scale, 
  MapPin, 
  UserPlus, 
  Search, 
  Ticket,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PurposeOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
}

const purposeOptions: Omit<PurposeOption, "selected">[] = [
  {
    id: "vote_nominate",
    icon: <Vote className="h-5 w-5" />,
    title: "Vote or Nominate",
    description: "Participate in voting and nominate deserving candidates",
  },
  {
    id: "scholarship",
    icon: <GraduationCap className="h-5 w-5" />,
    title: "Apply for EduAid Scholarship",
    description: "Access educational scholarships and funding opportunities",
  },
  {
    id: "ambassador",
    icon: <Users className="h-5 w-5" />,
    title: "Become Ambassador",
    description: "Represent NESA in your community and earn rewards",
  },
  {
    id: "webinar",
    icon: <Calendar className="h-5 w-5" />,
    title: "Join Webinar/Expo",
    description: "Attend educational webinars and expo events",
  },
  {
    id: "sponsor",
    icon: <Heart className="h-5 w-5" />,
    title: "Sponsor or CSR Partner",
    description: "Support education through sponsorship and CSR initiatives",
  },
  {
    id: "judge",
    icon: <Scale className="h-5 w-5" />,
    title: "Apply as Judge",
    description: "Evaluate nominees and participate in judging panels",
  },
  {
    id: "chapter",
    icon: <MapPin className="h-5 w-5" />,
    title: "Join Local Chapter",
    description: "Connect with your local NESA chapter community",
  },
  {
    id: "team",
    icon: <UserPlus className="h-5 w-5" />,
    title: "Join NESA Team",
    description: "Volunteer or work with the NESA team",
  },
  {
    id: "nrc",
    icon: <Search className="h-5 w-5" />,
    title: "Apply as NRC Volunteer",
    description: "Join the Nominee Research Corps to identify education leaders",
  },
  {
    id: "gala",
    icon: <Ticket className="h-5 w-5" />,
    title: "Get Gala Ticket",
    description: "Attend the prestigious NESA-Africa Awards Gala",
  },
];

interface PurposeSelectionStepProps {
  selectedPurposes: string[];
  onToggle: (purposeId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PurposeSelectionStep({ 
  selectedPurposes, 
  onToggle, 
  onNext, 
  onBack 
}: PurposeSelectionStepProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold">What Would You Like to Do?</h2>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Select all that apply. This helps us personalize your NESA experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {purposeOptions.map((option) => {
          const isSelected = selectedPurposes.includes(option.id);
          
          return (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md hover:border-primary/50 relative",
                isSelected && "border-2 border-primary bg-primary/5"
              )}
              onClick={() => onToggle(option.id)}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{option.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </p>
                </div>
                <div className="shrink-0">
                  <Checkbox 
                    checked={isSelected}
                    className={cn(
                      "h-5 w-5 rounded-full",
                      isSelected && "bg-primary border-primary"
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <Button variant="outline" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          className="min-w-[200px] bg-gradient-gold text-secondary font-semibold hover:opacity-90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
