import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, Shield } from "lucide-react";
import type { JuryAssignment } from "@/hooks/useJuryData";

interface COIDialogProps {
  assignment: JuryAssignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (nomineeId: string, reason: string) => Promise<void>;
  isSubmitting: boolean;
}

export function COIDialog({ assignment, open, onOpenChange, onSubmit, isSubmitting }: COIDialogProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!assignment || !reason.trim()) return;
    await onSubmit(assignment.nominee_id, reason.trim());
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoal border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-400">
            <Shield className="h-5 w-5" />
            Declare Conflict of Interest
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {assignment?.nominee?.name && (
              <>Nominee: <span className="text-gold font-medium">{assignment.nominee.name}</span></>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-orange-200 font-medium mb-1">Important Notice</p>
                <p className="text-xs text-orange-200/70">
                  Declaring a conflict of interest will remove this nominee from your scoring queue. 
                  This action cannot be undone. The nominee will be reassigned to another judge.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="reason" className="text-white/80 mb-2 block">
              Reason for Conflict <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your relationship or conflict with this nominee (e.g., colleague, family member, business partner, etc.)..."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
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
            disabled={isSubmitting || !reason.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Declaring...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Declare COI
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
