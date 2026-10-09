import { ShieldCheck } from "lucide-react";

export function IntegrityNotice({ variant = "default" }: { variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <p className="text-[11px] leading-snug text-white/55 flex items-start gap-1.5">
        <ShieldCheck className="h-3 w-3 mt-0.5 text-gold/70 shrink-0" />
        Sponsorship, donation, ticket, merch, endorsement, media visibility, or wallet
        participation does not influence nomination, judging, or award selection.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-gold/20 bg-gold/5 p-4 text-sm text-white/80">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="font-semibold text-white">Integrity & Independence</p>
          <p className="text-white/70 leading-relaxed">
            Sponsorship, donation, ticket purchase, merchandise purchase, endorsement, media
            visibility, or wallet payment activity does not influence nomination approval,
            judging, finalist selection, honouree selection, regional intervention winner selection,
            or award winner selection.
          </p>
        </div>
      </div>
    </div>
  );
}
