import { useEffect, useState } from "react";
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
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { paymentApi } from "@/api/payment";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import { PaymentProvider, Currency } from "@/types/wallet";

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const providers: { value: PaymentProvider; label: string }[] = [
  { value: "FLUTTERWAVE", label: "Flutterwave" },
  { value: "PAYSTACK", label: "Paystack" },
  { value: "LEMFI", label: "LemFi" },
  { value: "TAPTAPSEND", label: "TapTap Send" },
];

const presetAmounts = [5, 10, 20, 50, 100];

export function TopUpDialog({
  open,
  onOpenChange,
  onSuccess,
}: TopUpDialogProps) {
  const { accessToken, user } = useAuth();

  const [amount, setAmount] = useState<number>(10);
  const [provider, setProvider] = useState<PaymentProvider>("FLUTTERWAVE");
  const [loading, setLoading] = useState(false);
  const [exchangeLoading, setExchangeLoading] = useState(false);

  const [coins, setCoins] = useState<number | null>(null);
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [currency] = useState<Currency>("USD");

  /*
  ===============================================
  FETCH EXCHANGE RATE (DEBOUNCED)
  ===============================================
  */
  useEffect(() => {
    if (!accessToken || amount < 1) return;

    const timeout = setTimeout(async () => {
      try {
        setExchangeLoading(true);

        const res = await paymentApi.fetchExchangeRate(
          accessToken,
          currency,
          amount,
        );

        setCoins(res.numberOfCoins);
        setBaseAmount(res.baseamount);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch exchange rate");
      } finally {
        setExchangeLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [amount, currency, accessToken]);

  /*
  ===============================================
  HANDLE PAYMENT
  ===============================================
  */
  const handleSubmit = async () => {
    if (!accessToken || !coins || !user) return;

    if (amount < 1) {
      toast.error("Minimum top-up amount is $1");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create payment in backend
      const payment = await paymentApi.createPayment(accessToken, {
        amount,
        currency,
        provider,
        agreedCoinAmount: coins,
        baseCurrencyAmount: baseAmount,
        paymentType: "TOPUP",
      });

      if (provider === "FLUTTERWAVE") {
        // 2️⃣ Build Flutterwave config dynamically
        const config = {
          public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
          tx_ref: payment.transactionRef, // ✅ DIRECT FROM BACKEND
          amount: payment.amount,
          currency: payment.currency,
          payment_options: "card, banktransfer, ussd",
          customer: {
            email: user.email ?? "",
            name: user.fullName ?? "",
            phone_number: user.phone ?? "0000000000",
          },
          customizations: {
            title: "NESA Africa Wallet Top-Up",
            description: "Purchase AGC coins",
            logo: "https://yourdomain.com/logo.png",
          },
        };

        // 3️⃣ Initialize Flutterwave with correct tx_ref
        const handleFlutterPayment = useFlutterwave(config);

        // 4️⃣ Launch Checkout
        handleFlutterPayment({
          callback: (response) => {
            closePaymentModal();

            if (response.status === "successful") {
              toast.success("Payment successful!");
              onSuccess?.();
              onOpenChange(false);
            } else {
              toast.error("Payment was not successful");
            }
          },
          onClose: () => {},
        });
      } else {
        toast.info("Selected provider not yet integrated.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  /*
  ===============================================
  UI
  ===============================================
  */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GFAWalletIcon size={20} />
            Top Up Wallet
          </DialogTitle>
          <DialogDescription>
            Add funds and receive AGC coins instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Section */}
          <div className="space-y-2">
            <Label>Amount ({currency})</Label>

            <div className="flex flex-wrap gap-2">
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
            />

            <p className="text-xs text-muted-foreground">
              {exchangeLoading
                ? "Calculating AGC..."
                : coins
                  ? `You will receive ${coins.toLocaleString()} AGC`
                  : "Enter amount to calculate AGC"}
            </p>
          </div>

          {/* Provider Section */}
          <div className="space-y-2">
            <Label>Payment Method</Label>

            <RadioGroup
              value={provider}
              onValueChange={(v) => setProvider(v as PaymentProvider)}
            >
              {providers.map((p) => (
                <div
                  key={p.value}
                  className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer ${
                    provider === p.value
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setProvider(p.value)}
                >
                  <RadioGroupItem value={p.value} id={p.value} />
                  <Label htmlFor={p.value}>{p.label}</Label>
                  <CreditCard className="ml-auto h-4 w-4" />
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            disabled={loading || !coins}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${amount} ${currency}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
