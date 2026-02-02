import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { renominateNominee } from "@/lib/api";
import { RotateCcw, Loader2, Award, Info } from "lucide-react";
import { Link } from "react-router-dom";

interface RenominateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomineeId: string;
  nomineeName: string;
  awardTitle?: string;
  subcategoryTitle?: string;
  currentCount?: number;
  onRenominateSuccess?: () => void;
}

const MAX_NOTE_LENGTH = 500;
const PLATINUM_THRESHOLD = 200;

export function RenominateModal({
  open,
  onOpenChange,
  nomineeId,
  nomineeName,
  awardTitle,
  subcategoryTitle,
  currentCount = 0,
  onRenominateSuccess,
}: RenominateModalProps) {
  const { user } = useAuth();
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetAndClose = () => {
    setNote("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!nomineeId) return;

    setIsSubmitting(true);
    try {
      await renominateNominee(nomineeId, note.trim() || undefined);
      
      toast.success("Endorsement submitted!", {
        description: `You've endorsed ${nomineeName}. Thank you for your support!`,
      });
      
      onRenominateSuccess?.();
      resetAndClose();
    } catch (error: any) {
      if (error.message?.includes("maximum") || error.message?.includes("200")) {
        toast.error("Endorsement limit reached", {
          description: "This nominee has reached the maximum endorsement count.",
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

  const progressTowardPlatinum = Math.min((currentCount / PLATINUM_THRESHOLD) * 100, 100);
  const endorsementsNeeded = Math.max(PLATINUM_THRESHOLD - currentCount, 0);

  // Not logged in state
  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-charcoal-light border-gold/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-ivory flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-gold" />
              Login Required
            </DialogTitle>
            <DialogDescription className="text-ivory/60">
              You need to be logged in to endorse nominees.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-ivory/70">
              Create a free account to endorse <span className="text-gold font-medium">{nomineeName}</span> and help them reach Platinum status.
            </p>
            <div className="flex gap-3">
              <Button asChild className="flex-1 bg-gold hover:bg-gold-dark text-charcoal">
                <Link to="/auth/login">Log In</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 border-gold/30 text-gold hover:bg-gold/10">
                <Link to="/auth/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="bg-charcoal-light border-gold/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-ivory flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-gold" />
            Endorse Nominee
          </DialogTitle>
          <DialogDescription className="text-ivory/60">
            Show your support for this nominee's recognition.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nominee Info (Read-only) */}
          <div className="bg-charcoal p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ivory/60">Nominee</span>
              <span className="text-ivory font-medium">{nomineeName}</span>
            </div>
            {awardTitle && (
              <div className="flex justify-between text-sm">
                <span className="text-ivory/60">Award</span>
                <span className="text-ivory/80 text-right max-w-[200px] truncate">{awardTitle}</span>
              </div>
            )}
            {subcategoryTitle && (
              <div className="flex justify-between text-sm">
                <span className="text-ivory/60">Category</span>
                <span className="text-gold text-right max-w-[200px] truncate">{subcategoryTitle}</span>
              </div>
            )}
          </div>

          {/* Progress toward Platinum */}
          {currentCount < PLATINUM_THRESHOLD && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-ivory/60">
                <span>Progress to Platinum</span>
                <span>{currentCount} / {PLATINUM_THRESHOLD} endorsements</span>
              </div>
              <div className="h-2 bg-charcoal rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-amber-400 transition-all duration-500"
                  style={{ width: `${progressTowardPlatinum}%` }}
                />
              </div>
              <p className="text-xs text-ivory/50">
                {endorsementsNeeded} more endorsements needed for Platinum Certificate
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

          {/* Optional Note */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-ivory/80 flex items-center gap-2">
              Add a note <span className="text-ivory/40">(optional)</span>
            </Label>
            <Textarea
              id="note"
              placeholder="Share why you're endorsing this nominee..."
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE_LENGTH))}
              className="bg-charcoal border-gold/20 text-ivory placeholder:text-ivory/40 resize-none"
              rows={3}
            />
            <div className="flex justify-between text-xs text-ivory/40">
              <span>{note.length} / {MAX_NOTE_LENGTH}</span>
            </div>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-ivory/60">
              Endorsements help nominees gain visibility and contribute toward their Platinum Certificate qualification.
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetAndClose}
              className="flex-1 border-gold/30 text-gold hover:bg-gold/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gold hover:bg-gold-dark text-charcoal"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Endorse
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
