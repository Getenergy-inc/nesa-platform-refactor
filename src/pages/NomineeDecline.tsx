import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { declineNomination } from "@/api/nominations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { XCircle, Loader2, Home, ArrowLeft } from "lucide-react";
import { NESALogo } from "@/components/nesa/NESALogo";

export default function NomineeDecline() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [reason, setReason] = useState("");

  const handleDecline = async () => {
    if (!token) {
      toast.error("Invalid decline link");
      return;
    }

    setLoading(true);
    try {
      await declineNomination(token, reason || undefined);
      setDeclined(true);
      toast.success("Nomination declined");
    } catch (error: any) {
      toast.error(error.message || "Failed to decline nomination");
    } finally {
      setLoading(false);
    }
  };

  if (declined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="p-8 space-y-6">
            <XCircle className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Nomination Declined</h2>
              <p className="text-muted-foreground">
                We respect your decision. Thank you for considering the NESA-Africa recognition program.
                Your Local Chapter team wishes you well.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              If you change your mind in the future, you can always be nominated again in a subsequent season.
            </p>
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center space-y-4">
          <NESALogo variant="full" className="h-16 mx-auto opacity-50" />
          <CardTitle className="text-2xl font-display">Decline Nomination</CardTitle>
          <CardDescription>
            We're sorry to see you go. If you'd like, please let us know why you're declining.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Help us understand your decision..."
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              variant="destructive"
              size="lg" 
              onClick={handleDecline}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {!loading && <XCircle className="h-4 w-4 mr-2" />}
              Confirm Decline
            </Button>
            <Button 
              variant="outline" 
              asChild
            >
              <Link to={`/nominee/accept/${token}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back - I want to accept instead
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
