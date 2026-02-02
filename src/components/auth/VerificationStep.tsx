import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface VerificationStepProps {
  email: string;
  isVerifying: boolean;
  isVerified: boolean;
  onResendCode: () => void;
  onVerify: (code: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function VerificationStep({
  email,
  isVerifying,
  isVerified,
  onResendCode,
  onVerify,
  onNext,
  onBack,
}: VerificationStepProps) {
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResend = () => {
    onResendCode();
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = () => {
    if (code.length < 6) {
      toast.error("Please enter the full verification code");
      return;
    }
    onVerify(code);
  };

  if (isVerified) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
      <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Email Verified!</h2>
        <p className="text-muted-foreground mb-8">
          Your email has been successfully verified. You're almost done!
        </p>
        <Button
          size="lg"
          onClick={onNext}
          className="min-w-[200px] bg-gradient-gold text-secondary font-semibold hover:opacity-90"
        >
          Complete Registration
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold">Verify Your Email</h2>
        <p className="text-muted-foreground mt-2">
          We've sent a verification code to:
        </p>
        <p className="font-semibold text-primary mt-1">{email}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="text-center text-2xl tracking-widest"
            maxLength={6}
          />
        </div>

        <Button
          className="w-full bg-gradient-gold text-secondary font-semibold hover:opacity-90"
          size="lg"
          onClick={handleVerify}
          disabled={isVerifying || code.length < 6}
        >
          {isVerifying ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Didn't receive the code?
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={resendCooldown > 0}
          >
            {resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Code
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
