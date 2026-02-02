import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { submitRenomination } from "@/lib/api";
import { RotateCcw, Loader2, Award, Info, User, MapPin, Mail, FileText } from "lucide-react";
import { Link } from "react-router-dom";

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

const MAX_NOTE_LENGTH = 500;
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
  awardSlug,
  awardTitle,
  subcategorySlug,
  subcategoryTitle,
  groupSlug,
  groupName,
  currentCount = 0,
  onRenominateSuccess,
}: RenominateModalProps) {
  const { user } = useAuth();
  
  // Form state
  const [updatedName, setUpdatedName] = useState("");
  const [updatedAchievement, setUpdatedAchievement] = useState("");
  const [updatedCountry, setUpdatedCountry] = useState("");
  const [updatedState, setUpdatedState] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setUpdatedName("");
      setUpdatedAchievement("");
      setUpdatedCountry("");
      setUpdatedState("");
      setContactEmail("");
      setNote("");
      setConfirmed(false);
    }
  }, [open]);

  const resetAndClose = () => {
    onOpenChange(false);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!nomineeId && !nomineeSlug) {
      toast.error("Nominee information missing");
      return;
    }

    if (!confirmed) {
      toast.error("Please confirm the information is accurate");
      return;
    }

    if (contactEmail && !validateEmail(contactEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (note.length > MAX_NOTE_LENGTH) {
      toast.error(`Note must be ${MAX_NOTE_LENGTH} characters or less`);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRenomination({
        nomineeId,
        nomineeSlug: nomineeSlug || nomineeId,
        nomineeName,
        awardSlug,
        awardTitle,
        subcategorySlug,
        subcategoryTitle,
        groupSlug,
        groupName,
        updatedName: updatedName.trim() || undefined,
        updatedAchievement: updatedAchievement.trim() || undefined,
        updatedCountry: updatedCountry.trim() || undefined,
        updatedState: updatedState.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        note: note.trim() || undefined,
        sessionId: user ? undefined : getSessionId(),
      });
      
      toast.success("Renomination submitted!", {
        description: `Your endorsement for ${nomineeName} has been recorded. Thank you!`,
      });
      
      onRenominateSuccess?.();
      resetAndClose();
    } catch (error: any) {
      if (error.message?.includes("rate limit") || error.message?.includes("too many")) {
        toast.error("Too many submissions", {
          description: "Please wait a moment before submitting again.",
        });
      } else if (error.message?.includes("maximum") || error.message?.includes("200")) {
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

  // Logged-in state - full form
  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="bg-charcoal-light border-gold/20 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-ivory flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-gold" />
            Renominate / Endorse
          </DialogTitle>
          <DialogDescription className="text-ivory/60">
            Submit an update or endorsement for this nominee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Nominee Info (Read-only) */}
          <div className="bg-charcoal p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-ivory/60">Nominee</span>
              <span className="text-ivory font-medium text-right max-w-[200px] truncate">{nomineeName}</span>
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
            {groupName && (
              <div className="flex justify-between text-sm">
                <span className="text-ivory/60">Group</span>
                <span className="text-ivory/80 text-right max-w-[200px] truncate">{groupName}</span>
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

          {/* Optional Update Fields */}
          <div className="space-y-4 border-t border-gold/10 pt-4">
            <h4 className="text-sm font-medium text-ivory/80 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold/60" />
              Optional Updates
            </h4>
            
            {/* Updated Name */}
            <div className="space-y-1.5">
              <Label htmlFor="updatedName" className="text-ivory/70 text-sm flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Updated Name
              </Label>
              <Input
                id="updatedName"
                placeholder="Suggest a name correction (if any)"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="bg-charcoal border-gold/20 text-ivory placeholder:text-ivory/40"
                maxLength={100}
              />
            </div>

            {/* Updated Achievement */}
            <div className="space-y-1.5">
              <Label htmlFor="updatedAchievement" className="text-ivory/70 text-sm">
                Updated Achievement / Description
              </Label>
              <Textarea
                id="updatedAchievement"
                placeholder="Add new achievements or update the description..."
                value={updatedAchievement}
                onChange={(e) => setUpdatedAchievement(e.target.value)}
                className="bg-charcoal border-gold/20 text-ivory placeholder:text-ivory/40 resize-none"
                rows={2}
                maxLength={500}
              />
            </div>

            {/* Country & State */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="updatedCountry" className="text-ivory/70 text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Country
                </Label>
                <Input
                  id="updatedCountry"
                  placeholder="Country"
                  value={updatedCountry}
                  onChange={(e) => setUpdatedCountry(e.target.value)}
                  className="bg-charcoal border-gold/20 text-ivory placeholder:text-ivory/40"
                  maxLength={60}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="updatedState" className="text-ivory/70 text-sm">
                  State / Region
                </Label>
                <Input
                  id="updatedState"
                  placeholder="State / Region"
                  value={updatedState}
                  onChange={(e) => setUpdatedState(e.target.value)}
                  className="bg-charcoal border-gold/20 text-ivory placeholder:text-ivory/40"
                  maxLength={60}
                />
              </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail" className="text-ivory/70 text-sm flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Contact Email <span className="text-ivory/40">(optional)</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="nominee@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="bg-charcoal border-gold/20 text-ivory placeholder:text-ivory/40"
              />
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <Label htmlFor="note" className="text-ivory/70 text-sm">
                Reason / Note <span className="text-ivory/40">(optional)</span>
              </Label>
              <Textarea
                id="note"
                placeholder="Share why you're endorsing this nominee or any additional updates..."
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE_LENGTH))}
                className="bg-charcoal border-gold/20 text-ivory placeholder:text-ivory/40 resize-none"
                rows={3}
              />
              <div className="flex justify-end text-xs text-ivory/40">
                <span>{note.length} / {MAX_NOTE_LENGTH}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3 p-3 bg-charcoal rounded-lg border border-gold/10">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
              className="mt-0.5 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
            />
            <Label
              htmlFor="confirm"
              className="text-sm text-ivory/80 cursor-pointer leading-tight"
            >
              I confirm this information is accurate to the best of my knowledge.
            </Label>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-ivory/60">
              Renominations help nominees gain visibility and contribute toward their Platinum Certificate qualification. Your submission will be reviewed by our team.
            </p>
          </div>

          {/* Submit */}
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
                  Submit Renomination
                </>
              )}
            </Button>
          </div>

          {/* Login prompt for non-authenticated users */}
          {!user && (
            <p className="text-xs text-center text-ivory/50">
              <Link to="/auth/login" className="text-gold hover:underline">Log in</Link>
              {" "}to track your submissions and get updates.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
