import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, Zap } from "lucide-react";
import { toast } from "sonner";
import { initTopup } from "@/api/wallet";
import type { PaymentProvider } from "@/types/wallet";

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const providers: { value: PaymentProvider; label: string; description: string }[] = [
  { value: "PAYSTACK", label: "Paystack", description: "Cards, Bank Transfer (Nigeria)" },
  { value: "FLUTTERWAVE", label: "Flutterwave", description: "Cards, Mobile Money (Africa)" },
  { value: "LEMFI", label: "LemFi", description: "Bank Transfer (UK, EU, Canada)" },
  { value: "TAPTAPSEND", label: "TapTap Send", description: "Mobile Transfer (Diaspora)" },
];

const presetAmounts = [5, 10, 20, 50, 100];

export function TopUpDialog({ open, onOpenChange, onSuccess }: TopUpDialogProps) {
  const [amount, setAmount] = useState<number>(10);
  const [provider, setProvider] = useState<PaymentProvider>("PAYSTACK");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (amount < 1) {
      toast.error("Minimum top-up amount is $1");
      return;
    }

    setLoading(true);
    try {
      const result = await initTopup({
        amount_usd: amount,
        provider,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // In a real implementation, redirect to payment gateway
      toast.success("Payment initiated! Redirecting to payment gateway...");
      
      // Redirect to payment gateway if URL provided
      if (result.data?.payment_url) {
        window.open(result.data.payment_url, "_blank");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Top Up Wallet
          </DialogTitle>
          <DialogDescription>
            Add funds to your GFA Wallet using your preferred payment method.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Selection */}
          <div className="space-y-2">
            <Label>Amount (USD)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={amount === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(preset)}
                >
                  ${preset}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter custom amount"
            />
            <p className="text-xs text-muted-foreground">
              You'll receive approximately {(amount * 100).toFixed(0)} AGC
            </p>
          </div>

          {/* Provider Selection */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup value={provider} onValueChange={(v) => setProvider(v as PaymentProvider)}>
              {providers.map((p) => (
                <div
                  key={p.value}
                  className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    provider === p.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setProvider(p.value)}
                >
                  <RadioGroupItem value={p.value} id={p.value} />
                  <div className="flex-1">
                    <Label htmlFor={p.value} className="cursor-pointer font-medium">
                      {p.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || amount < 1}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay ${amount} USD
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
