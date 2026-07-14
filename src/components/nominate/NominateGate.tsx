import { ReactNode } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { StageGate } from "@/components/StageGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Gate for the /nominate flow.
 *
 * Layered checks (fail-closed):
 *  1. StageGate("nominations") — respects season/edition timeline. When the
 *     nominations stage is closed the `StageLocked` fallback renders.
 *  2. Authentication — anonymous visitors are redirected to /account/login
 *     with `?next=` so they return to the nomination flow after signing in.
 *  3. Conflict-of-interest RBAC — Jury members and Sponsors cannot submit
 *     nominations. Admins/NRC/Chapter leads can (they may submit on behalf
 *     of the public); standard users can.
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
  const { user, roles, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12" role="status" aria-live="polite">
        <div className="animate-pulse text-muted-foreground">Loading nomination portal…</div>
      </div>
    );
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return (
      <div className="container max-w-2xl py-12">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-center text-center py-10">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <LogIn className="h-8 w-8 text-primary" aria-hidden />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">
              Sign in to nominate
            </h2>
            <p className="text-muted-foreground max-w-md">
              Nominations require a verified NESA-Africa account so we can
              contact you if the review committee needs supporting evidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <Link to={`/account/login?next=${next}`}>Sign in</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/register?next=${next}`}>Create account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (roles.some((r) => COI_BLOCKED_ROLES.has(r as "jury" | "sponsor"))) {
    return <COIBlocked />;
  }

  return <StageGate action="nominations">{children}</StageGate>;
}

export default NominateGate;
