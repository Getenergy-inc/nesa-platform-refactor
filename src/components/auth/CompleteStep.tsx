import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Award, ArrowRight, Vote, Trophy } from "lucide-react";
import { AccountType } from "./AccountTypeStep";

interface CompleteStepProps {
  accountType: AccountType;
  fullName: string;
}

const nextStepsConfig: Record<AccountType, { title: string; steps: { icon: React.ReactNode; text: string; link: string }[] }> = {
  individual: {
    title: "Start Your NESA Journey",
    steps: [
      { icon: <Award className="h-5 w-5" />, text: "Nominate an educator", link: "/nominate" },
      { icon: <Vote className="h-5 w-5" />, text: "Vote for nominees", link: "/vote" },
      { icon: <Trophy className="h-5 w-5" />, text: "Explore award categories", link: "/categories" },
    ],
  },
  organization: {
    title: "Set Up Your Organization",
    steps: [
      { icon: <Award className="h-5 w-5" />, text: "Complete organization profile", link: "/dashboard" },
      { icon: <Award className="h-5 w-5" />, text: "Submit institutional nominations", link: "/nominate" },
      { icon: <Trophy className="h-5 w-5" />, text: "Explore partnership options", link: "/partners" },
    ],
  },
  judge: {
    title: "Next Steps",
    steps: [
      { icon: <Award className="h-5 w-5" />, text: "Complete your judge application", link: "/judgeapply" },
      { icon: <Award className="h-5 w-5" />, text: "Review judging guidelines", link: "/judge/guidelines" },
      { icon: <Trophy className="h-5 w-5" />, text: "Check application status", link: "/judge-status" },
    ],
  },
  chapter: {
    title: "Chapter Leader Onboarding",
    steps: [
      { icon: <Award className="h-5 w-5" />, text: "Set up your chapter profile", link: "/olc" },
      { icon: <Award className="h-5 w-5" />, text: "Invite chapter members", link: "/olc/members" },
      { icon: <Trophy className="h-5 w-5" />, text: "View chapter dashboard", link: "/olc" },
    ],
  },
  sponsor: {
    title: "Sponsor Dashboard",
    steps: [
      { icon: <Award className="h-5 w-5" />, text: "View sponsorship packages", link: "/sponsors" },
      { icon: <Award className="h-5 w-5" />, text: "Access sponsor portal", link: "/dashboard" },
      { icon: <Trophy className="h-5 w-5" />, text: "Contact our team", link: "/contact" },
    ],
  },
  volunteer: {
    title: "Volunteer Opportunities",
    steps: [
      { icon: <Award className="h-5 w-5" />, text: "View volunteer programs", link: "/volunteer" },
      { icon: <Award className="h-5 w-5" />, text: "Join a local chapter", link: "/chapters" },
      { icon: <Trophy className="h-5 w-5" />, text: "Explore the platform", link: "/" },
    ],
  },
};

export function CompleteStep({ accountType, fullName }: CompleteStepProps) {
  const config = nextStepsConfig[accountType];
  const firstName = fullName.split(" ")[0] || "there";

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-gold flex items-center justify-center mb-6 shadow-gold">
        <CheckCircle2 className="h-12 w-12 text-secondary" />
      </div>

      <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
        Welcome to NESA, {firstName}! 🎉
      </h2>
      <p className="text-muted-foreground mb-8">
        Your account has been created successfully. You're now part of the NESA community
        dedicated to celebrating excellence in African education.
      </p>

      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">{config.title}</h3>
        <div className="space-y-3">
          {config.steps.map((step, index) => (
            <Link
              key={index}
              to={step.link}
              className="flex items-center gap-3 p-3 rounded-lg bg-background hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {step.icon}
              </div>
              <span className="flex-1 text-left font-medium">{step.text}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="bg-gradient-gold text-secondary font-semibold hover:opacity-90">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/">Explore Platform</Link>
        </Button>
      </div>
    </div>
  );
}
