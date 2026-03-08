// Register Entry — quick-start for unified auth page
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Users, Building2, Gavel, Heart } from "lucide-react";
import { GoogleButton } from "@/components/auth/GoogleButton";

interface RegisterEntryProps {
  onSwitchToLogin?: () => void;
}

const accountTypes = [
  { id: "individual", label: "Individual", description: "Nominate & vote", icon: Users },
  { id: "organization", label: "Organization", description: "Institutional access", icon: Building2 },
  { id: "judge", label: "Judge", description: "Apply as evaluator", icon: Gavel },
  { id: "volunteer", label: "Volunteer", description: "Join chapters", icon: Heart },
];

export function RegisterEntry({ onSwitchToLogin }: RegisterEntryProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <GoogleButton label="Sign up with Google" />

      <div className="relative my-5">
        <Separator className="bg-primary/8" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[hsl(30_8%_9%)] px-3 text-[11px] text-secondary-foreground/25 uppercase tracking-wider">
          or
        </span>
      </div>

      {/* Account type grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {accountTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => navigate(`/register?type=${type.id}`)}
            className="flex flex-col items-center gap-1.5 p-3.5 rounded-xl border border-primary/8 bg-secondary-foreground/[0.02] hover:border-primary/25 hover:bg-primary/5 transition-all text-center group min-h-[76px] touch-manipulation active:scale-[0.98]"
          >
            <type.icon className="h-4.5 w-4.5 text-primary/50 group-hover:text-primary transition-colors" />
            <div>
              <p className="text-[13px] font-semibold text-secondary-foreground/80 group-hover:text-secondary-foreground transition-colors">{type.label}</p>
              <p className="text-[10px] text-secondary-foreground/35 leading-tight">{type.description}</p>
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={() => navigate("/register")}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 rounded-xl shadow-md shadow-primary/15 hover:shadow-primary/25 transition-all gap-2 group"
      >
        Create Account
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </div>
  );
}
