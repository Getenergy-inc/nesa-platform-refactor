import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSeason } from "@/contexts/SeasonContext";
import { castVote } from "@/api/voting";
import {
  VOTE_CATEGORIES,
  VOTE_TYPES,
  type VoteType,
  type VoteCategoryId,
} from "@/config/voteCategories";
import {
  Lightbulb,
  Users,
  Leaf,
  Heart,
  Crown,
  Handshake,
  Monitor,
  BookOpen,
  Megaphone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Award,
  Gem,
  Check,
  Calendar,
  AlertCircle,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Icon map for vote categories
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Users,
  Leaf,
  Heart,
  Crown,
  Handshake,
  Monitor,
  BookOpen,
  Megaphone,
};

interface VoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomineeId: string;
  nomineeName: string;
  nomineeSlug: string;
  awardTitle?: string;
  subcategoryTitle?: string;
  onVoteSuccess?: () => void;
}

type Step = "type" | "category" | "confirm";

export function VoteModal({
  open,
  onOpenChange,
  nomineeId,
  nomineeName,
  awardTitle,
  subcategoryTitle,
  onVoteSuccess,
}: VoteModalProps) {
  const { user } = useAuth();
  const { isStageOpen, getStage, currentEdition } = useSeason();
  const [step, setStep] = useState<Step>("type");
  const [voteType, setVoteType] = useState<VoteType | null>(null);
  const [voteCategory, setVoteCategory] = useState<VoteCategoryId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const votingStage = getStage("public_voting");
  const isVotingActive = isStageOpen("public_voting");

  const resetAndClose = () => {
    setStep("type");
    setVoteType(null);
    setVoteCategory(null);
    onOpenChange(false);
  };

  const handleVoteTypeSelect = (type: VoteType) => {
    setVoteType(type);
  };

  const handleCategorySelect = (categoryId: VoteCategoryId) => {
    setVoteCategory(categoryId);
  };

  const handleSubmit = async () => {
    if (!nomineeId || !voteType || !voteCategory) return;

    setIsSubmitting(true);
    try {
      // Cast the vote (1 AGC = 1 vote)
      await castVote(nomineeId, 1);

      toast.success("Vote Recorded Successfully!", {
        description: `Your vote for ${nomineeName} in ${voteCategory} has been recorded. Thank you for participating! Track your Afrigold Points on your dashboard.`,
      });

      onVoteSuccess?.();
      resetAndClose();
    } catch (error: any) {
      if (error.message?.includes("already voted")) {
        toast.error("Already voted", {
          description:
            "You have already cast your vote for this nominee in this category.",
        });
      } else if (error.message?.includes("Insufficient")) {
        toast.error("Insufficient Afrigold Points", {
          description:
            "Earn more Afrigold Points by nominating verified changemakers, then return to vote.",
          action: {
            label: "Earn Points",
            onClick: () => (window.location.href = "/earn-voting-credits"),
          },
        });
      } else {
        toast.error("Something went wrong", {
          description: "Please try again later",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voting season check
  if (!isVotingActive) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-charcoal-light border-gold/20 max-w-md w-[95%] sm:w-full mx-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-ivory flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="w-5 h-5 text-gold" />
              Voting Season Closed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-sm text-amber-400">
                Voting is currently closed for the{" "}
                {currentEdition?.name || "current"} season.
              </p>
            </div>

            {votingStage && (
              <div className="space-y-2 text-sm">
                <p className="text-ivory/70">
                  <span className="text-gold font-medium">
                    Next voting window:
                  </span>
                </p>
                <div className="bg-charcoal p-3 rounded-lg space-y-1">
                  {votingStage.opensAt && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-ivory/60">Opens:</span>
                      <span className="text-ivory font-medium">
                        {new Date(votingStage.opensAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {votingStage.closesAt && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-ivory/60">Closes:</span>
                      <span className="text-ivory font-medium">
                        {new Date(votingStage.closesAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-sm text-ivory/70">
              Stay tuned for the next voting season to support{" "}
              <span className="text-gold font-medium">{nomineeName}</span> and
              other education champions.
            </p>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={resetAndClose}
                className="flex-1 border-gold/30 text-gold hover:bg-gold/10 text-sm"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button
                asChild
                className="flex-1 bg-gold hover:bg-gold-dark text-charcoal text-sm"
              >
                <Link to="/voting-calendar">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-charcoal-light border-gold/20 max-w-md w-[95%] sm:w-full mx-auto rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-ivory flex items-center gap-2 text-lg sm:text-xl">
              <Award className="w-5 h-5 text-gold" />
              Login Required
            </DialogTitle>
            <DialogDescription className="text-ivory/60 text-sm">
              You need to be logged in to vote for nominees.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-ivory/70">
              Sign up to earn Afrigold Points and vote for{" "}
              <span className="text-gold font-medium">{nomineeName}</span>.
              Support African education changemakers advocating Education for
              All.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="flex-1 bg-gold hover:bg-gold-dark text-charcoal text-sm"
              >
                <Link to="/auth/login">Log In</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-gold/30 text-gold hover:bg-gold/10 text-sm"
              >
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
      <DialogContent className="bg-charcoal-light border-gold/20 max-w-lg w-[95%] sm:w-full mx-auto rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-ivory flex items-center gap-2 text-lg sm:text-xl">
            <Award className="w-5 h-5 text-gold" />
            <span className="truncate">Vote for {nomineeName}</span>
          </DialogTitle>
          {awardTitle && (
            <DialogDescription className="text-ivory/60 text-sm">
              {awardTitle} {subcategoryTitle && `• ${subcategoryTitle}`}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Step Indicator - Responsive */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 py-2">
          {["type", "category", "confirm"].map((s, i) => {
            const stepIndex = ["type", "category", "confirm"].indexOf(step);
            return (
              <div key={s} className="flex items-center gap-1 sm:gap-2">
                <div
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors",
                    step === s
                      ? "bg-gold text-charcoal"
                      : i < stepIndex
                        ? "bg-gold/20 text-gold"
                        : "bg-charcoal text-ivory/40",
                  )}
                >
                  {i < stepIndex ? (
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={cn(
                      "w-8 sm:w-12 h-0.5",
                      i < stepIndex ? "bg-gold/40" : "bg-charcoal",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Vote Type */}
        {step === "type" && (
          <div className="space-y-4">
            <p className="text-sm text-ivory/70">Select your vote type:</p>
            <RadioGroup
              value={voteType || ""}
              onValueChange={(v) => handleVoteTypeSelect(v as VoteType)}
              className="space-y-3"
            >
              {VOTE_TYPES.map((type) => (
                <div key={type.id}>
                  <RadioGroupItem
                    value={type.id}
                    id={type.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={type.id}
                    className={cn(
                      "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border cursor-pointer transition-all",
                      voteType === type.id
                        ? "border-gold bg-gold/10"
                        : "border-gold/20 hover:border-gold/40 bg-charcoal/50",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 sm:p-3 rounded-full",
                        type.id === "gold_garnet"
                          ? "bg-amber-500/20"
                          : "bg-blue-500/20",
                      )}
                    >
                      <Gem
                        className={cn(
                          "w-5 h-5 sm:w-6 sm:h-6",
                          type.id === "gold_garnet"
                            ? "text-amber-500"
                            : "text-blue-500",
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-ivory text-sm sm:text-base truncate">
                        {type.label}
                      </div>
                      <div className="text-xs sm:text-sm text-ivory/60 line-clamp-2">
                        {type.description}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-end">
              <Button
                onClick={() => setStep("category")}
                disabled={!voteType}
                className="bg-gold hover:bg-gold-dark text-charcoal text-sm sm:text-base w-full sm:w-auto"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Vote Category */}
        {step === "category" && (
          <div className="space-y-4">
            <p className="text-sm text-ivory/70">
              Select the category that best describes their excellence:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {VOTE_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon ? ICON_MAP[cat.icon] : Award;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-2 sm:p-3 rounded-lg border text-center transition-all",
                      voteCategory === cat.id
                        ? "border-gold bg-gold/10"
                        : "border-gold/20 hover:border-gold/40 bg-charcoal/50",
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6",
                        voteCategory === cat.id ? "text-gold" : "text-ivory/60",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-medium line-clamp-2",
                        voteCategory === cat.id ? "text-gold" : "text-ivory/80",
                      )}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("type")}
                className="border-gold/30 text-gold hover:bg-gold/10 text-sm w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setStep("confirm")}
                disabled={!voteCategory}
                className="bg-gold hover:bg-gold-dark text-charcoal text-sm w-full sm:w-auto"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && (
          <div className="space-y-4">
            <div className="bg-charcoal p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
                <span className="text-ivory/60">Nominee</span>
                <span className="text-ivory font-medium break-words">
                  {nomineeName}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
                <span className="text-ivory/60">Vote Type</span>
                <Badge
                  className={cn(
                    "self-start sm:self-auto",
                    voteType === "gold_garnet"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400",
                  )}
                >
                  {VOTE_TYPES.find((t) => t.id === voteType)?.label}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm">
                <span className="text-ivory/60">Category</span>
                <span className="text-gold break-words text-right">
                  {VOTE_CATEGORIES.find((c) => c.id === voteCategory)?.label}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs sm:text-sm border-t border-gold/10 pt-2 sm:pt-3 mt-2 sm:mt-3">
                <span className="text-ivory/60">Cost</span>
                <span className="text-gold font-semibold">1 AGC</span>
              </div>
            </div>

            <p className="text-xs text-ivory/50 text-center">
              1 vote = 1 AGC. This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("category")}
                className="border-gold/30 text-gold hover:bg-gold/10 text-sm w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold-dark text-charcoal text-sm w-full sm:w-auto min-w-[120px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirm Vote
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
