import { ShieldCheck } from "lucide-react";

export function JudgeOTPNotice() {
  return (
    <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-blue-400 mb-1">
            🔐 Additional Security for Judges
          </p>
          <p className="text-muted-foreground">
            For the security and integrity of the NESA-Africa judging process, 
            judges will be prompted to enter a one-time verification code (OTP) after logging in.
          </p>
        </div>
      </div>
    </div>
  );
}

export function JudgeOTPHelperText() {
  return (
    <p className="text-xs text-center text-muted-foreground">
      Judges are required to complete OTP verification before accessing the Judges Arena.
    </p>
  );
}
