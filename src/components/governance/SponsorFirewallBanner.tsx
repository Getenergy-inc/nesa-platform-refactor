// SponsorFirewallBanner — reusable governance disclosure
// Drop into Awards, Nominate, Vote, Sponsor, Partners pages to make the
// firewall between sponsorship and award outcomes explicit and persistent.

import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  /** "full" = full paragraph (default). "compact" = single-line strip. */
  variant?: "full" | "compact";
  className?: string;
}

const STATEMENT =
  "Sponsorship, partnership, donations, endorsements, and visibility opportunities do not influence nominees, judges, finalists, laureate selection, or winners.";

export function SponsorFirewallBanner({ variant = "full", className }: Props) {
  if (variant === "compact") {
    return (
      <div
        role="note"
        aria-label="Sponsor firewall disclosure"
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border border-gold/25 bg-charcoal-light/60 text-[12px] text-white/75",
          className,
        )}
      >
        <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
        <span className="truncate">{STATEMENT}</span>
        <Link
          to="/governance#sponsor-firewall"
          className="ml-auto shrink-0 text-gold hover:underline whitespace-nowrap"
        >
          Read policy
        </Link>
      </div>
    );
  }

  return (
    <section
      role="note"
      aria-label="Sponsor firewall disclosure"
      className={cn(
        "rounded-2xl border border-gold/25 bg-gold/5 p-5 md:p-6",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5 text-gold" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base md:text-lg font-semibold text-white mb-1">
            Sponsor Firewall
          </h3>
          <p className="text-sm text-white/75 leading-relaxed">{STATEMENT}</p>
          <Link
            to="/governance#sponsor-firewall"
            className="inline-flex items-center text-sm text-gold hover:underline mt-2"
          >
            Read the full integrity policy →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SponsorFirewallBanner;
