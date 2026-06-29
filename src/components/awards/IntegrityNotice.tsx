// ============================================================================
// IntegrityNotice — reusable NESA-Africa Integrity Firewall callout.
// Place on Directory, tier pages, category pages, subcategory pages.
// ============================================================================
import { ShieldCheck } from "lucide-react";

interface IntegrityNoticeProps {
  variant?: "default" | "compact";
  className?: string;
}

export function IntegrityNotice({ variant = "default", className = "" }: IntegrityNoticeProps) {
  if (variant === "compact") {
    return (
      <div
        role="note"
        aria-label="NESA-Africa Integrity Notice"
        className={`rounded-xl border border-gold/25 bg-charcoal/40 px-4 py-3 text-xs text-ivory/75 flex items-start gap-2 ${className}`}
      >
        <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
        <p>
          <strong className="text-gold">NESA-Africa Integrity Firewall:</strong>{" "}
          Sponsors, partners, donors and endorsers receive visibility only — they do not influence
          nominations, judging, verification, scoring, voting or winners.
        </p>
      </div>
    );
  }

  return (
    <section
      role="note"
      aria-label="NESA-Africa Integrity Notice"
      className={`rounded-2xl border border-gold/30 bg-gradient-to-br from-charcoal-dark/80 to-charcoal/60 p-6 md:p-8 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-gold/15 p-3 border border-gold/30 shrink-0">
          <ShieldCheck className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h3 className="font-playfair text-xl md:text-2xl text-gold mb-2">
            NESA-Africa Integrity Notice
          </h3>
          <p className="text-sm md:text-base text-ivory/80 leading-relaxed mb-3">
            NESA-Africa maintains a strict separation between sponsorship, partnership,
            endorsement, nomination, verification, judging, public voting, scoring, governance
            decisions and award outcomes.
          </p>
          <p className="text-sm md:text-base text-ivory/70 leading-relaxed">
            Sponsors, partners, donors, media partners, endorsers and advisory supporters may
            receive visibility, but they do <strong className="text-ivory">not</strong> influence
            nominations, judging, verification, scoring, voting or winners. Recognition is the
            beginning of measurable education impact — not the end.
          </p>
        </div>
      </div>
    </section>
  );
}

export default IntegrityNotice;
