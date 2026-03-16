import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { submitRenomination } from "@/lib/api";
import { RotateCcw, Loader2, Award, Info, User, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export interface RenominateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomineeId: string;
  nomineeName: string;
  nomineeSlug?: string;
  awardSlug?: string;
  awardTitle?: string;
  subcategorySlug?: string;
  subcategoryTitle?: string;
  groupSlug?: string;
  groupName?: string;
  currentCount?: number;
  onRenominateSuccess?: () => void;
}

const PLATINUM_THRESHOLD = 200;

// Generate or retrieve session ID for anonymous users
function getSessionId(): string {
  const key = "nesa_session_id";
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export function RenominateModal({
  open,
  onOpenChange,
  nomineeId,
  nomineeName,
  nomineeSlug,
  awardTitle,
  subcategoryTitle,
  groupName,
  currentCount = 0,
  onRenominateSuccess,
}: RenominateModalProps) {
  const { user, accessToken } = useAuth();

  // Form state - only confirmation needed
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setConfirmed(false);
    }
  }, [open]);

  const resetAndClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!nomineeId && !nomineeSlug) {
      toast.error("Nominee information missing");
      return;
    }

    if (!confirmed) {
      toast.error("Please confirm your endorsement");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRenomination({ accessToken, nominationId: nomineeId });
      toast.success("Endorsement Submitted!", {
        description: `Your endorsement for ${nomineeName} has been recorded. Thank you for contributing to quality education!`,
      });

      onRenominateSuccess?.();
      resetAndClose();
    } catch (error: any) {
      if (error.message?.includes("only one renomination")) {
        toast.error("Renomination max reached", {
          description: "You can renominate a nominee only once.",
        });
      }
      if (
        error.message?.includes("rate limit") ||
        error.message?.includes("too many")
      ) {
        toast.error("Too many submissions", {
          description: "Please wait a moment before submitting again.",
        });
      } else if (
        error.message?.includes("maximum") ||
        error.message?.includes("200")
      ) {
        toast.error("Endorsement limit reached", {
          description:
            "This nominee has reached the maximum endorsement count.",
        });
      } else {
        toast.error("Something went wrong", {
          description: error.message || "Please try again later",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressTowardPlatinum = Math.min(
    (currentCount / PLATINUM_THRESHOLD) * 100,
    100,
  );
  const endorsementsNeeded = Math.max(PLATINUM_THRESHOLD - currentCount, 0);

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="bg-charcoal-light border-gold/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-ivory flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-gold" />
            Endorse Nominee
          </DialogTitle>
          <DialogDescription className="text-ivory/60">
            Add your endorsement to help this nominee gain recognition.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Nominee Info Card */}
          <div className="bg-charcoal p-5 rounded-lg border border-gold/10">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-ivory font-semibold text-lg truncate">
                  {nomineeName}
                </h3>
                {subcategoryTitle && (
                  <p className="text-gold text-sm truncate">
                    {subcategoryTitle}
                  </p>
                )}
                {awardTitle && (
                  <p className="text-ivory/60 text-xs mt-1">{awardTitle}</p>
                )}
                {groupName && (
                  <p className="text-ivory/40 text-xs">{groupName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Progress toward Platinum */}
          {currentCount < PLATINUM_THRESHOLD && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-ivory/60">
                <span>Progress to Platinum</span>
                <span className="font-medium">
                  {currentCount} / {PLATINUM_THRESHOLD}
                </span>
              </div>
              <div className="h-2 bg-charcoal rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-amber-400 transition-all duration-500"
                  style={{ width: `${progressTowardPlatinum}%` }}
                />
              </div>
              <p className="text-xs text-ivory/50">
                {endorsementsNeeded} more endorsement
                {endorsementsNeeded !== 1 ? "s" : ""} needed for Platinum
                Certificate
              </p>
            </div>
          )}

          {currentCount >= PLATINUM_THRESHOLD && (
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-amber-400">
                This nominee has achieved Platinum status!
              </span>
            </div>
          )}

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-charcoal rounded-lg border border-gold/10">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
              className="mt-0.5 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
            />
            <label
              htmlFor="confirm"
              className="text-sm text-ivory/80 cursor-pointer leading-tight"
            >
              I confirm that I believe this nominee deserves recognition for
              their contribution to education in Africa.
            </label>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-ivory/60">
              Your endorsement helps this nominee gain visibility and
              contributes toward their Platinum Certificate qualification.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={resetAndClose}
              className="flex-1 border-gold/30 text-gold hover:bg-gold/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !confirmed}
              className="flex-1 bg-gold hover:bg-gold-dark text-charcoal disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Confirm Endorsement
                </>
              )}
            </Button>
          </div>

          {/* Login prompt for non-authenticated users */}
          {!user && (
            <p className="text-xs text-center text-ivory/50">
              <Link to="/auth/login" className="text-gold hover:underline">
                Log in
              </Link>{" "}
              to track your endorsements.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
