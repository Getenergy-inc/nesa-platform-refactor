import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";
import type { JuryAssignment } from "@/hooks/useJuryData";

interface ScoreDialogProps {
  assignment: JuryAssignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (nomineeId: string, score: number, comment?: string) => Promise<void>;
  isSubmitting: boolean;
}

export function ScoreDialog({ assignment, open, onOpenChange, onSubmit, isSubmitting }: ScoreDialogProps) {
  const [score, setScore] = useState<number>(70);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!assignment) return;
    await onSubmit(assignment.nominee_id, score, comment || undefined);
    setScore(70);
    setComment("");
    onOpenChange(false);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Outstanding";
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Very Good";
    if (score >= 60) return "Good";
    if (score >= 50) return "Satisfactory";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-gold";
    if (score >= 40) return "text-yellow-500";
    return "text-red-400";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoal border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-gold" />
            Score Finalist
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {assignment?.nominee?.name && (
              <>Evaluating: <span className="text-gold font-medium">{assignment.nominee.name}</span></>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label className="text-white/80 mb-4 block">Score (0-100)</Label>
            <div className="space-y-4">
              <div className="text-center">
                <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
                <p className={`text-sm mt-1 ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
              </div>
              <Slider
                value={[score]}
                onValueChange={([value]) => setScore(value)}
                min={0}
                max={100}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-white/40">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="comment" className="text-white/80 mb-2 block">
              Comment (optional)
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide feedback or justification for your score..."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Submit Score
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
