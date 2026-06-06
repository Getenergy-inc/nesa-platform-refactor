import { Sparkles } from "lucide-react";

export function ComingSoonBanner({
  title = "Nomination Submission Launching After Verification",
  message = "Your nomination interest has been recorded. Final submission and email verification activate as soon as backend governance is live.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-charcoal p-5 text-white">
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <div>
          <p className="font-display text-lg font-semibold text-gold">{title}</p>
          <p className="text-sm text-white/75 mt-1 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function LaunchingAfterVerificationBanner() {
  return (
    <ComingSoonBanner
      title="Account verification launching after system validation"
      message="Your details have been captured. Account creation and email verification will activate once governance & integrity systems complete validation."
    />
  );
}
