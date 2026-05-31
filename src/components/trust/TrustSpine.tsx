// Site-wide Trust Spine components
// Reusable institutional-grade trust signals: governance, sponsor non-influence,
// reporting commitment, privacy/financial controls, SDG 4 / AU Agenda 2063 alignment.
// Use these on funder-facing pages and inside PublicLayout above the footer.

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Scale,
  FileText,
  Lock,
  Landmark,
  Globe2,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Primitives ---------- */

interface TrustCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  href?: string;
  className?: string;
}

function TrustCard({ icon, title, children, href, className }: TrustCardProps) {
  const inner = (
    <div
      className={cn(
        "h-full rounded-xl border border-gold/20 bg-charcoal/60 p-5 backdrop-blur-sm",
        "transition-colors hover:border-gold/40 hover:bg-charcoal/80",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2 text-gold">
        <span className="shrink-0">{icon}</span>
        <h3 className="font-serif text-base font-semibold tracking-wide">
          {title}
        </h3>
      </div>
      <div className="text-sm leading-relaxed text-white/80">{children}</div>
    </div>
  );
  return href ? (
    <Link to={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl">
      {inner}
    </Link>
  ) : (
    inner
  );
}

/* ---------- Individual trust notes (compose anywhere) ---------- */

export function GovernanceNote({ className }: { className?: string }) {
  return (
    <TrustCard
      icon={<Landmark className="h-5 w-5" />}
      title="Independent Governance"
      href="/governance"
      className={className}
    >
      NESA-Africa is governed by an independent Board, a separate Awards Council
      and an arms-length Nomination Review Committee. Judging panels are
      conflict-of-interest screened and bound by published rubrics.
    </TrustCard>
  );
}

export function SponsorNonInfluenceNote({ className }: { className?: string }) {
  return (
    <TrustCard
      icon={<Scale className="h-5 w-5" />}
      title="Sponsors Do Not Influence Results"
      className={className}
    >
      Sponsorship, partnership and donations never affect nominations, judging,
      scoring, or winner selection. Commercial relationships are firewalled from
      the EDI scoring engine and Blue Garnet finalist process.
    </TrustCard>
  );
}

export function ReportingCommitmentNote({ className }: { className?: string }) {
  return (
    <TrustCard
      icon={<FileText className="h-5 w-5" />}
      title="Public Reporting"
      href="/impact"
      className={className}
    >
      We publish annual impact, financial summaries and program outcomes. Every
      ceremony cycle ships an audited recap covering nominees, funds raised and
      Rebuild My School Africa allocations.
    </TrustCard>
  );
}

export function PrivacyFinancialControlsNote({ className }: { className?: string }) {
  return (
    <TrustCard
      icon={<Lock className="h-5 w-5" />}
      title="Privacy & Financial Controls"
      href="/support"
      className={className}
    >
      Personal data is protected under strict access controls. Wallet ledgers
      are append-only, balance adjustments require a 2-person rule, and AGC
      participation credits carry no monetary value.
    </TrustCard>
  );
}

export function SDGAlignmentNote({ className }: { className?: string }) {
  return (
    <TrustCard
      icon={<GraduationCap className="h-5 w-5" />}
      title="Aligned with SDG 4"
      className={className}
    >
      Every award track maps to UN Sustainable Development Goal 4 — inclusive,
      equitable, quality education and lifelong learning opportunities for all
      Africans.
    </TrustCard>
  );
}

export function AUAlignmentNote({ className }: { className?: string }) {
  return (
    <TrustCard
      icon={<Globe2 className="h-5 w-5" />}
      title="Aligned with AU Agenda 2063"
      className={className}
    >
      NESA-Africa advances Aspiration 1 of the African Union's Agenda 2063 — a
      prosperous Africa based on inclusive growth and sustainable development,
      with education as the foundational pillar.
    </TrustCard>
  );
}

/* ---------- Composite strips ---------- */

interface TrustSpineProps {
  variant?: "full" | "compact" | "alignment" | "governance";
  className?: string;
  heading?: string;
  subheading?: string;
}

/**
 * Site-wide Trust Spine strip — sits above the footer or inside funder pages.
 * Variants:
 *  - full: governance + non-influence + reporting + privacy + SDG + AU
 *  - compact: governance + non-influence + reporting
 *  - governance: governance + non-influence + privacy
 *  - alignment: SDG + AU
 */
export function TrustSpine({
  variant = "compact",
  className,
  heading = "Built for Trust",
  subheading = "Independent governance, transparent reporting, and zero sponsor influence on awards.",
}: TrustSpineProps) {
  const cards = (() => {
    switch (variant) {
      case "full":
        return [
          <GovernanceNote key="g" />,
          <SponsorNonInfluenceNote key="s" />,
          <ReportingCommitmentNote key="r" />,
          <PrivacyFinancialControlsNote key="p" />,
          <SDGAlignmentNote key="sdg" />,
          <AUAlignmentNote key="au" />,
        ];
      case "alignment":
        return [<SDGAlignmentNote key="sdg" />, <AUAlignmentNote key="au" />];
      case "governance":
        return [
          <GovernanceNote key="g" />,
          <SponsorNonInfluenceNote key="s" />,
          <PrivacyFinancialControlsNote key="p" />,
        ];
      case "compact":
      default:
        return [
          <GovernanceNote key="g" />,
          <SponsorNonInfluenceNote key="s" />,
          <ReportingCommitmentNote key="r" />,
        ];
    }
  })();

  const gridCols =
    cards.length >= 6
      ? "md:grid-cols-2 lg:grid-cols-3"
      : cards.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

  return (
    <section
      aria-label="Trust and accountability"
      className={cn(
        "border-y border-gold/10 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal py-12 lg:py-16",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 max-w-3xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-xs uppercase tracking-widest text-gold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trust & Accountability
          </div>
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            {heading}
          </h2>
          {subheading && (
            <p className="mt-2 text-sm text-white/70 sm:text-base">{subheading}</p>
          )}
        </div>
        <div className={cn("grid grid-cols-1 gap-4", gridCols)}>{cards}</div>
      </div>
    </section>
  );
}

export default TrustSpine;
