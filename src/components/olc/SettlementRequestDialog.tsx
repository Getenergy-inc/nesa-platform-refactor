import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BadgeDollarSign, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { formatAgc } from "@/api/wallet";
import type { WalletBalance } from "@/types/wallet";

interface SettlementRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: WalletBalance | null;
  chapterName: string;
  onSuccess?: () => void;
}

export function SettlementRequestDialog({
  open,
  onOpenChange,
  balance,
  chapterName,
  onSuccess,
}: SettlementRequestDialogProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const withdrawableAgc = balance?.agc_withdrawable ?? 0;
  const hasWithdrawable = withdrawableAgc > 0;

  const handleSubmit = async () => {
    if (!hasWithdrawable) {
      toast.error("No withdrawable balance available");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call POST /api/v1/olc/settlements/request
      // For now, simulate success
      await new Promise((r) => setTimeout(r, 1000));

      toast.success("Settlement request submitted for admin review");
      onOpenChange(false);
      setNotes("");
      onSuccess?.();
    } catch (error) {
      console.error("Settlement request failed:", error);
      toast.error("Failed to submit settlement request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-emerald-600" />
            Request Settlement
          </DialogTitle>
          <DialogDescription>
            Submit a withdrawal request for {chapterName}'s earnings. Admin approval required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Balance Summary */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Withdrawable Balance</span>
              <Badge
                variant={hasWithdrawable ? "default" : "secondary"}
                className={hasWithdrawable ? "bg-emerald-600" : ""}
              >
                {formatAgc(withdrawableAgc)}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Non-Withdrawable</span>
              <span>{formatAgc(balance?.agc_non_withdrawable ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bonus (Locked)</span>
              <span>{formatAgc(balance?.agc_bonus ?? 0)}</span>
            </div>
          </div>

          {!hasWithdrawable && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No withdrawable balance available. Only withdrawable AGC can be settled.
              </AlertDescription>
            </Alert>
          )}

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes for the admin..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !hasWithdrawable}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
