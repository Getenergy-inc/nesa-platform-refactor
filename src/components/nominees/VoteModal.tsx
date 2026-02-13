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
} from "lucide-react";
import { Link } from "react-router-dom";

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
  const [step, setStep] = useState<Step>("type");
  const [voteType, setVoteType] = useState<VoteType | null>(null);
  const [voteCategory, setVoteCategory] = useState<VoteCategoryId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          description: "You have already cast your vote for this nominee in this category.",
        });
      } else if (error.message?.includes("Insufficient")) {
        toast.error("Insufficient Afrigold Points", {
          description: "Earn more Afrigold Points by nominating verified changemakers, then return to vote.",
          action: {
            label: "Earn Points",
            onClick: () => window.location.href = "/earn-voting-credits",
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

  // Not logged in state
  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-charcoal-light border-gold/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-ivory flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              Login Required
            </DialogTitle>
            <DialogDescription className="text-ivory/60">
              You need to be logged in to vote for nominees.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-ivory/70">
              Sign up to earn Afrigold Points and vote for <span className="text-gold font-medium">{nomineeName}</span>. Support African education changemakers advocating Education for All.
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
      <DialogContent className="bg-charcoal-light border-gold/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-ivory flex items-center gap-2">
            <Award className="w-5 h-5 text-gold" />
            Vote for {nomineeName}
          </DialogTitle>
          {awardTitle && (
            <DialogDescription className="text-ivory/60">
              {awardTitle} {subcategoryTitle && `• ${subcategoryTitle}`}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 py-2">
          {["type", "category", "confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === s
                    ? "bg-gold text-charcoal"
                    : i < ["type", "category", "confirm"].indexOf(step)
                    ? "bg-gold/20 text-gold"
                    : "bg-charcoal text-ivory/40"
                }`}
              >
                {i < ["type", "category", "confirm"].indexOf(step) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && (
                <div className={`w-12 h-0.5 ${i < ["type", "category", "confirm"].indexOf(step) ? "bg-gold/40" : "bg-charcoal"}`} />
              )}
            </div>
          ))}
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
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                      voteType === type.id
                        ? "border-gold bg-gold/10"
                        : "border-gold/20 hover:border-gold/40 bg-charcoal/50"
                    }`}
                  >
                    <div className={`p-3 rounded-full ${type.id === "gold_garnet" ? "bg-amber-500/20" : "bg-blue-500/20"}`}>
                      <Gem className={`w-6 h-6 ${type.id === "gold_garnet" ? "text-amber-500" : "text-blue-500"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-ivory">{type.label}</div>
                      <div className="text-sm text-ivory/60">{type.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-end">
              <Button
                onClick={() => setStep("category")}
                disabled={!voteType}
                className="bg-gold hover:bg-gold-dark text-charcoal"
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
            <p className="text-sm text-ivory/70">Select the category that best describes their excellence:</p>
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {VOTE_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon ? ICON_MAP[cat.icon] : Award;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-all ${
                      voteCategory === cat.id
                        ? "border-gold bg-gold/10"
                        : "border-gold/20 hover:border-gold/40 bg-charcoal/50"
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${voteCategory === cat.id ? "text-gold" : "text-ivory/60"}`} />
                    <span className={`text-xs font-medium ${voteCategory === cat.id ? "text-gold" : "text-ivory/80"}`}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("type")}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setStep("confirm")}
                disabled={!voteCategory}
                className="bg-gold hover:bg-gold-dark text-charcoal"
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
            <div className="bg-charcoal p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-ivory/60">Nominee</span>
                <span className="text-ivory font-medium">{nomineeName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ivory/60">Vote Type</span>
                <Badge className={voteType === "gold_garnet" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}>
                  {VOTE_TYPES.find((t) => t.id === voteType)?.label}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ivory/60">Category</span>
                <span className="text-gold">{VOTE_CATEGORIES.find((c) => c.id === voteCategory)?.label}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gold/10 pt-3 mt-3">
                <span className="text-ivory/60">Cost</span>
                <span className="text-gold font-semibold">1 AGC</span>
              </div>
            </div>

            <p className="text-xs text-ivory/50 text-center">
              1 vote = 1 AGC. This action cannot be undone.
            </p>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("category")}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold-dark text-charcoal min-w-[120px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
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
