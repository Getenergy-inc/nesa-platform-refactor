// DonorTrustPanel — payment transparency + anti-fraud disclosure
// Use on /partners, /donate, /sponsor and any page that solicits funds.

import { ShieldCheck, Wallet, Building2, AlertTriangle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  /** Hide the policy/report links (e.g. when shown on a page that already lists them) */
  compactLinks?: boolean;
}

const channels = [
  {
    icon: Wallet,
    title: "GFA Wallet",
    description:
      "Approved digital channel for donations, sponsorship and AGC top-ups. Reconciled to the Master Account.",
  },
  {
    icon: Building2,
    title: "Verified Bank Transfer",
    description:
      "Direct transfer to the published NESA-Africa / SCEF account. Receipts are issued for every settlement.",
  },
];

export function DonorTrustPanel({ className, compactLinks = false }: Props) {
  return (
    <section
      aria-label="Donor and sponsor trust information"
      className={cn(
        "rounded-2xl border border-gold/25 bg-charcoal-light/60 p-6 md:p-8",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-gold/15 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-white">
            Payment Transparency & Donor Trust
          </h2>
          <p className="text-xs text-white/60">
            Approved channels, anti-fraud safeguards and legacy fund reporting.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        {channels.map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-gold/15 bg-white/3 p-4"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <c.icon className="h-4 w-4 text-gold" />
              <h3 className="font-semibold text-white text-sm">{c.title}</h3>
            </div>
            <p className="text-xs text-white/65 leading-relaxed">{c.description}</p>
          </div>
        ))}
      </div>

      <div
        role="note"
        className="flex items-start gap-3 rounded-xl border border-warning/25 bg-warning/5 p-4 mb-4"
      >
        <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
        <p className="text-xs text-warning/90 leading-relaxed">
          <span className="font-semibold">Anti-fraud notice:</span> NESA-Africa never
          requests payments to personal accounts, mobile-money wallets, crypto wallets or
          third-party links. If in doubt, verify via the Support Centre before sending
          funds. Report suspected fraud immediately to{" "}
          <a href="mailto:integrity@nesa.africa" className="underline hover:no-underline">
            integrity@nesa.africa
          </a>
          .
        </p>
      </div>

      <p className="text-xs text-white/60 leading-relaxed mb-4">
        Sponsorship, partnership, donations, endorsements and visibility opportunities do
        not influence nominees, judges, voting outcomes, finalists or winners.
      </p>

      {!compactLinks && (
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            to="/governance#sponsor-firewall"
            className="inline-flex items-center gap-1 text-gold hover:underline"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Sponsorship policy
          </Link>
          <Link
            to="/programs#legacy"
            className="inline-flex items-center gap-1 text-gold hover:underline"
          >
            <FileText className="h-3.5 w-3.5" /> Legacy fund reporting
          </Link>
          <Link
            to="/governance#data-protection"
            className="inline-flex items-center gap-1 text-gold hover:underline"
          >
            <ShieldCheck className="h-3.5 w-3.5" /> Data protection
          </Link>
        </div>
      )}
    </section>
  );
}

export default DonorTrustPanel;
