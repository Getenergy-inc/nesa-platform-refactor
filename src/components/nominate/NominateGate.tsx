import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { StageGate } from "@/components/StageGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Gate for the /nominate flow — "Nominate First" model.
 *
 *  1. StageGate("nominations") — respects the season/edition timeline.
 *  2. Conflict-of-interest RBAC — signed-in Jury/Sponsors cannot submit
 *     (anonymous visitors are welcome; the account creation step happens at
 *     or after submission via `AccountAtSubmitPanel`).
 *
 *  Authentication is intentionally NOT required to view or complete the
 *  nomination form. See `src/features/nominate/` for draft persistence and
 *  the inline account-at-submit component.
 */
const COI_BLOCKED_ROLES = new Set(["jury", "sponsor"] as const);

function COIBlocked() {
  return (
    <div className="container max-w-2xl py-12">
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-col items-center text-center py-10">
          <div className="mb-4 rounded-full bg-destructive/10 p-4">
            <ShieldAlert className="h-8 w-8 text-destructive" aria-hidden />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Nominations are not available for your role
          </h2>
          <p className="text-muted-foreground max-w-md">
            Jury members and Sponsors cannot submit nominations. This
            conflict-of-interest firewall protects the integrity of the
            NESA-Africa recognition process.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/">Return home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface NominateGateProps {
  children: ReactNode;
}

export function NominateGate({ children }: NominateGateProps) {
  const { roles, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12" role="status" aria-live="polite">
        <div className="animate-pulse text-muted-foreground">Loading nomination portal…</div>
      </div>
    );
  }

  if (roles.some((r) => COI_BLOCKED_ROLES.has(r as "jury" | "sponsor"))) {
    return <COIBlocked />;
  }

  return (
    <StageGate action="nominations">
      <div className="border-b border-gold/20 bg-charcoal/40">
        <div className="container mx-auto px-4 py-2.5 flex items-center gap-2 text-xs text-foreground/75">
          <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden />
          <span>
            Takes about two minutes · <span className="text-gold">No account required to begin.</span>{" "}
            You&apos;ll create or confirm your free account at submission to track this nomination.
          </span>
        </div>
      </div>
      {children}
    </StageGate>
  );
}

export default NominateGate;

