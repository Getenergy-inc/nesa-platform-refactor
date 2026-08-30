import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Loader2, Lock, AlertTriangle } from "lucide-react";
import { useNRCOnboarding, isNRCOnboardingComplete } from "@/hooks/useNRCOnboarding";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

/**
 * Blocks the live review queue until the member's onboarding record exists and
 * every compliance step is complete. Admins bypass the gate.
 */
export function NRCOnboardingGate({ children }: { children: ReactNode }) {
  const { hasRole } = useAuth();
  const { data: row, isLoading, error, refetch } = useNRCOnboarding();

  if (hasRole("admin")) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" aria-label="Loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center text-white">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-destructive" aria-hidden />
          <h1 className="font-display text-lg font-bold">Could not verify your onboarding status</h1>
          <p className="mt-2 text-sm text-white/70">{(error as Error).message}</p>
          <Button variant="outline" className="mt-4 border-white/20 text-white" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!isNRCOnboardingComplete(row)) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-gold/25 bg-gold/5 p-6 text-center text-white">
          <Lock className="mx-auto mb-3 h-8 w-8 text-gold" aria-hidden />
          <h1 className="font-display text-lg font-bold">Onboarding not complete</h1>
          <p className="mt-2 text-sm text-white/70">
            Your review queue unlocks once every NRC compliance step is complete.
          </p>
          <Button asChild className="mt-4 bg-gold text-charcoal hover:bg-gold/90">
            <Link to="/nrc/onboarding">Go to onboarding</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
