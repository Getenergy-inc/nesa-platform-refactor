import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { declineNomination } from "@/api/nominations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { XCircle, Loader2, Home, ArrowLeft, AlertCircle } from "lucide-react";
import { NESALogo } from "@/components/nesa/NESALogo";
import { nominationApi } from "@/api/nomination";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function NomineeDecline() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [reason, setReason] = useState("");
  const { accessToken } = useAuth();

  // Safely split token with error handling
  const declineToken = token?.split("_")[0] || "";
  const nominationId = token?.split("_")[1] || "";

  console.log("nomination id", nominationId);

  const handleDecline = async () => {
    if (!token || !nominationId) {
      toast.error("Invalid decline link");
      return;
    }

    setLoading(true);
    try {
      await nominationApi.rejectNomination(accessToken, nominationId);
      setDeclined(true);
      toast.success("Nomination declined successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to decline nomination");
    } finally {
      setLoading(false);
    }
  };

  if (declined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-3 sm:p-4 md:p-6">
        <Card className="max-w-md sm:max-w-lg w-full mx-auto shadow-lg">
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted/30 flex items-center justify-center">
                <XCircle className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-2 sm:space-y-3 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold">
                Nomination Declined
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                We respect your decision. Thank you for considering the
                NESA-Africa recognition program.
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-muted/30 p-3 sm:p-4 rounded-lg text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                If you change your mind in the future, you can always be
                nominated again in a subsequent season.
              </p>
            </div>

            {/* Action Button */}
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto sm:min-w-[200px] mx-auto"
            >
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

  // Invalid token state
  if (!token || !nominationId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid Link</AlertTitle>
              <AlertDescription>
                The decline link you're using is invalid or has expired.
              </AlertDescription>
            </Alert>
            <Button asChild className="w-full">
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-3 sm:p-4 md:p-6">
      <Card className="max-w-lg w-full mx-auto shadow-lg">
        <CardHeader className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 md:p-8">
          {/* Logo - Responsive sizing */}
          <div className="flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-muted/20 flex items-center justify-center">
              <NESALogo
                variant="full"
                className="h-12 sm:h-14 md:h-16 w-auto opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-display">
              Decline Nomination
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm max-w-md mx-auto">
              We're sorry to see you go. If you'd like, please let us know why
              you're declining.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 pt-0">
          {/* Reason Input */}
          <div className="space-y-2 sm:space-y-3">
            <Label
              htmlFor="reason"
              className="text-sm sm:text-base font-medium"
            >
              Reason{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Help us understand your decision..."
              rows={4}
              className="min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground text-right">
              {reason.length}/500 characters
            </p>
          </div>

          <Separator className="my-2" />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button
              variant="destructive"
              size="lg"
              onClick={handleDecline}
              disabled={loading}
              className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {!loading && <XCircle className="h-4 w-4 mr-2" />}
              Confirm Decline
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full h-11 sm:h-12 text-sm sm:text-base"
              disabled={loading}
            >
              <Link
                to={`/nomination/accept?token=${token}&nominationId=${nominationId}`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="truncate">
                  Go Back - I want to accept instead
                </span>
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-center text-muted-foreground/60 pt-2">
            This action cannot be undone. You'll need a new nomination to
            participate in future seasons.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
