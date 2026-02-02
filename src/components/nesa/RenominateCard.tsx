import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { renominateNominee } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Heart, Loader2, Award, Download, Trophy } from "lucide-react";

interface RenominateCardProps {
  nomineeId: string;
  nomineeName: string;
  initialRenominationCount?: number;
}

const PLATINUM_THRESHOLD = 200;

export function RenominateCard({
  nomineeId,
  nomineeName,
  initialRenominationCount = 0,
}: RenominateCardProps) {
  const { user } = useAuth();
  const [renominationCount, setRenominationCount] = useState(initialRenominationCount);
  const [isRenominating, setIsRenominating] = useState(false);
  const [hasRenominated, setHasRenominated] = useState(false);

  const progressPercent = Math.min((renominationCount / PLATINUM_THRESHOLD) * 100, 100);
  const remaining = Math.max(PLATINUM_THRESHOLD - renominationCount, 0);
  const hasReachedThreshold = renominationCount >= PLATINUM_THRESHOLD;

  const handleRenominate = async () => {
    if (!user) {
      toast.error("Please log in to endorse", {
        action: {
          label: "Log In",
          onClick: () => (window.location.href = "/auth/login"),
        },
      });
      return;
    }

    setIsRenominating(true);
    try {
      await renominateNominee(nomineeId, `Endorsement from profile page for ${nomineeName}`);
      setRenominationCount((prev) => prev + 1);
      setHasRenominated(true);
      toast.success(`Endorsed ${nomineeName}!`, {
        description: "Your support has been recorded. Thank you!",
      });
    } catch (error: any) {
      if (error.message?.includes("maximum")) {
        toast.info("Maximum endorsements reached", {
          description: `${nomineeName} has unlocked their Platinum Certificate!`,
        });
      } else {
        toast.error("Failed to endorse", {
          description: error.message || "Please try again",
        });
      }
    } finally {
      setIsRenominating(false);
    }
  };

  return (
    <Card className="bg-charcoal-light border-gold/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-ivory flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold" />
          Platinum Certificate Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ivory/60">Endorsements</span>
            <span className="text-gold font-semibold">
              {renominationCount} / {PLATINUM_THRESHOLD}
            </span>
          </div>
          <Progress value={progressPercent} className="h-3 bg-charcoal" />
          {!hasReachedThreshold && (
            <p className="text-xs text-ivory/50">
              {remaining} more endorsement{remaining !== 1 ? "s" : ""} needed to unlock the Platinum Certificate
            </p>
          )}
        </div>

        {/* Status Message */}
        {hasReachedThreshold ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gold/10 border border-gold/30">
            <Award className="w-5 h-5 text-gold" />
            <div>
              <p className="text-sm font-medium text-gold">Platinum Certificate Unlocked!</p>
              <p className="text-xs text-ivory/60">
                {nomineeName.split(" ")[0]} has earned the Platinum recognition.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ivory/60">
            Help {nomineeName.split(" ")[0]} reach {PLATINUM_THRESHOLD} endorsements to unlock their Platinum Certificate download.
          </p>
        )}

        {/* Action Button */}
        {hasReachedThreshold ? (
          <Button
            className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
            disabled
          >
            <Download className="w-4 h-4 mr-2" />
            Certificate Available
          </Button>
        ) : (
          <Button
            onClick={handleRenominate}
            disabled={isRenominating || hasRenominated}
            className={
              hasRenominated
                ? "w-full bg-green-600 hover:bg-green-600 text-white cursor-default"
                : "w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
            }
          >
            {isRenominating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Endorsing...
              </>
            ) : hasRenominated ? (
              <>
                <Heart className="w-4 h-4 mr-2 fill-current" />
                Endorsed!
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Endorse This Nominee
              </>
            )}
          </Button>
        )}

        {/* Login prompt for non-authenticated users */}
        {!user && (
          <p className="text-xs text-center text-ivory/50">
            <Link to="/auth/login" className="text-gold hover:underline">
              Log in
            </Link>{" "}
            to endorse this nominee
          </p>
        )}
      </CardContent>
    </Card>
  );
}
