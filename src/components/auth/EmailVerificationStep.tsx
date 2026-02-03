import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmailVerificationStepProps {
  email: string;
  isVerifying: boolean;
  isVerified: boolean;
  error?: string;
  onResendCode: () => void;
  onVerify: (code: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EmailVerificationStep({
  email,
  isVerifying,
  isVerified,
  error,
  onResendCode,
  onVerify,
  onNext,
  onBack,
}: EmailVerificationStepProps) {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [codeExpiry, setCodeExpiry] = useState(300); // 5 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Start expiry countdown
    const expiryTimer = setInterval(() => {
      setCodeExpiry((prev) => {
        if (prev <= 1) {
          clearInterval(expiryTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(expiryTimer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length > 1) {
      // Handle paste of full code
      const pastedCode = numericValue.slice(0, 6).split("");
      const newCode = [...code];
      pastedCode.forEach((digit, i) => {
        if (i + index < 6) {
          newCode[i + index] = digit;
        }
      });
      setCode(newCode);
      // Focus last filled input or next empty
      const focusIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = numericValue;
    setCode(newCode);

    // Auto-focus next input
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    onResendCode();
    setResendCooldown(60);
    setCodeExpiry(300); // Reset expiry
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
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    onVerify(fullCode);
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
          We've sent a 6-digit verification code to:
        </p>
        <Card className="mt-3 inline-block">
          <CardContent className="py-2 px-4">
            <p className="font-semibold text-primary">{email}</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="mb-6 border-destructive/50 bg-destructive/10">
          <CardContent className="py-3 px-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {/* OTP Input */}
        <div className="space-y-2">
          <Label>Enter Verification Code</Label>
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  "w-12 h-14 text-center text-2xl font-bold",
                  error && "border-destructive"
                )}
              />
            ))}
          </div>
          {/* Expiry Timer */}
          <p className={cn(
            "text-center text-sm",
            codeExpiry < 60 ? "text-destructive" : "text-muted-foreground"
          )}>
            Code expires in: <span className="font-semibold">{formatTime(codeExpiry)}</span>
          </p>
        </div>

        <Button
          className="w-full bg-gradient-gold text-secondary font-semibold hover:opacity-90"
          size="lg"
          onClick={handleVerify}
          disabled={isVerifying || code.some(c => !c)}
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

        {/* Resend Code */}
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
