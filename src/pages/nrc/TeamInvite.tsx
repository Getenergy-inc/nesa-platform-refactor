import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { nrcApi } from "@/api/newnrc";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function AcceptTeamInvite() {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("teamId");
  const token = searchParams.get("token");
  console.log("teamid and token", teamId, token);

  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [teamInfo, setTeamInfo] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const validateInvite = async () => {
      if (!teamId || !token) {
        setError("Invalid invitation link.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await nrcApi.verifyInviteToken(accessToken, token, teamId);
        setTeamInfo({
          name: data.name,
          description: data.description,
        });
      } catch (err) {
        setError("This invitation is invalid or has expired.");
      } finally {
        setIsLoading(false);
      }
    };

    validateInvite();
  }, [teamId, token]);

  const handleAccept = async () => {
    if (!teamId || !token) return;

    try {
      setIsAccepting(true);
      await nrcApi.acceptTeamInvite(accessToken, teamId);
      setAccepted(true);
      toast.success("You have successfully joined the team.");
    } catch (err) {
      toast.error("Unable to accept invitation.");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              NRC Team Invitation
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <div className="flex flex-col items-center text-center space-y-3 py-6">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            )}

            {/* Success State */}
            {!isLoading && accepted && (
              <div className="flex flex-col items-center text-center space-y-3 py-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
                <p className="text-base font-medium">
                  You are now a member of this team.
                </p>
                <Button onClick={() => navigate("/dashboard")} className="mt-4">
                  Go to Dashboard
                </Button>
              </div>
            )}

            {/* Invite Info */}
            {!isLoading && !error && teamInfo && !accepted && (
              <>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Team Name
                    </p>
                    <p className="text-lg font-semibold">{teamInfo.name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Description
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {teamInfo.description}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6 flex justify-end">
                  <Button
                    onClick={handleAccept}
                    disabled={isAccepting}
                    className="min-w-[180px]"
                  >
                    {isAccepting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Accept Invitation
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AcceptTeamInvitePage() {
  return (
    <ProtectedRoute requiredRoles={["NRC", "admin", "FREE_MEMBER"]}>
      <AcceptTeamInvite />
    </ProtectedRoute>
  );
}
