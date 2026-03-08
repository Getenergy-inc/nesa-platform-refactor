// Register Entry — quick-start for unified auth page, redirects to full wizard
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Users, Building2, Gavel, Heart } from "lucide-react";
import { GoogleButton } from "@/components/auth/GoogleButton";

interface RegisterEntryProps {
  onSwitchToLogin?: () => void;
}

const accountTypes = [
  { id: "individual", label: "Individual", description: "Nominate, vote, and participate", icon: Users },
  { id: "organization", label: "Organization", description: "Institutional recognition", icon: Building2 },
  { id: "judge", label: "Judge / Jury", description: "Apply as an evaluator", icon: Gavel },
  { id: "volunteer", label: "Volunteer", description: "Join our chapters", icon: Heart },
];

export function RegisterEntry({ onSwitchToLogin }: RegisterEntryProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <GoogleButton label="Sign up with Google" />

      <div className="relative">
        <Separator className="bg-primary/10" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary px-3 text-xs text-secondary-foreground/30">
          or choose your account type
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {accountTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => navigate(`/register?type=${type.id}`)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-primary/10 bg-secondary-foreground/3 hover:border-primary/30 hover:bg-primary/5 transition-all text-center group min-h-[88px] touch-manipulation"
          >
            <type.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
            <div>
              <p className="text-sm font-medium text-secondary-foreground/90">{type.label}</p>
              <p className="text-[11px] text-secondary-foreground/40 leading-tight mt-0.5">{type.description}</p>
            </div>
          </button>
        ))}
      </div>

      <Link to="/register" className="block">
        <Button
          variant="outline"
          className="w-full border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30 h-12 rounded-xl font-medium gap-2 group"
        >
          Continue with Email
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}
