import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, XCircle, FileCheck2, ClipboardList, Users, Sparkles } from "lucide-react";
import type { TierClusterConfig } from "@/config/awards/tierCluster";
import { StageGate, StageStatusBadge } from "@/components/governance/StageGate";

const accentBtn: Record<TierClusterConfig["accent"], string> = {
  gold: "bg-gold text-charcoal hover:bg-amber-400",
  "blue-garnet": "bg-blue-500 text-white hover:bg-blue-400",
  platinum: "bg-slate-200 text-charcoal hover:bg-white",
  coral: "bg-orange-500 text-white hover:bg-orange-400",
};

const outlineBtn: Record<TierClusterConfig["accent"], string> = {
  gold: "border-gold/60 text-gold hover:bg-gold/10",
  "blue-garnet": "border-blue-400/60 text-blue-300 hover:bg-blue-500/10",
  platinum: "border-slate-200/60 text-slate-200 hover:bg-white/5",
  coral: "border-orange-400/60 text-orange-300 hover:bg-orange-500/10",
};

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl h-11 px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";

// ────────────────────────────────────────────────────────────────────
export function TierAboutSection({ tier }: { tier: TierClusterConfig }) {
  const { about } = tier;
  return (
    <div className="grid gap-6 md:gap-8 md:grid-cols-3">
      <article className="md:col-span-2 space-y-6">
        <section aria-labelledby="mission-heading" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 id="mission-heading" className="font-display text-lg sm:text-xl font-bold">Mission</h2>
          <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">{about.mission}</p>
        </section>

        <section aria-labelledby="who-heading" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 id="who-heading" className="font-display text-lg sm:text-xl font-bold">Who qualifies</h2>
          <ul className="mt-3 space-y-2">
            {about.whoQualifies.map((line) => (
              <li key={line} className="flex gap-2 text-sm sm:text-base text-white/80">
                <CheckCircle2 className="h-4 w-4 mt-1 shrink-0 text-emerald-400" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="integrity-heading" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 id="integrity-heading" className="font-display text-lg sm:text-xl font-bold">Governance & integrity</h2>
          <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">{about.integrityModel}</p>
        </section>
      </article>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/50">Positioning</p>
          <p className="mt-2 font-display text-lg leading-snug">{about.positioning}</p>
        </div>
        <TierCTAStack tier={tier} />
      </aside>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
export function TierCriteriaSection({ tier }: { tier: TierClusterConfig }) {
  const { criteria } = tier;
  return (
    <div className="space-y-8">
      <p className="text-sm sm:text-base text-white/80 max-w-3xl">{criteria.intro}</p>

      <section aria-labelledby="pillars-heading">
        <h2 id="pillars-heading" className="font-display text-lg sm:text-xl font-bold mb-3">Evaluation pillars</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {criteria.pillars.map((p) => (
            <li key={p.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm sm:text-base">{p.title}</h3>
                {p.weight && (
                  <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/70">
                    {p.weight}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs sm:text-sm text-white/70 leading-relaxed">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="font-display text-lg sm:text-xl font-bold mb-3">Evidence we accept</h2>
        <ul className="space-y-2">
          {criteria.evidence.map((e) => (
            <li key={e.label} className="flex gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <FileCheck2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" aria-hidden />
              <div>
                <p className="text-sm font-semibold">{e.label}</p>
                <p className="text-xs sm:text-sm text-white/70">{e.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="dq-heading">
        <h2 id="dq-heading" className="font-display text-lg sm:text-xl font-bold mb-3">Disqualifiers</h2>
        <ul className="space-y-2">
          {criteria.disqualifiers.map((d) => (
            <li key={d} className="flex gap-2 text-sm text-white/80">
              <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-rose-400" aria-hidden />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs sm:text-sm text-white/70">
        <ClipboardList className="inline h-4 w-4 mr-1.5 -mt-0.5" aria-hidden />
        {criteria.timelineNote}
      </p>

      <TierCTAStack tier={tier} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
export function TierNomineesSection({ tier }: { tier: TierClusterConfig }) {
  const directoryHref = `/nominees?tier=${encodeURIComponent(tier.nominees.directoryFilterKey)}`;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Users className={`h-5 w-5 mt-0.5 shrink-0`} aria-hidden />
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold">Africa Education Impact Directory</h2>
            <p className="mt-1 text-sm sm:text-base text-white/80">{tier.nominees.highlight}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-white/70">{tier.nominees.empty}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to={directoryHref}
            className={`${btnBase} ${accentBtn[tier.accent]}`}
          >
            {tier.nominees.directoryLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to={`/awards/${tier.slug}`} className={`${btnBase} border-2 bg-transparent ${outlineBtn[tier.accent]}`}>
            Back to {tier.shortName} overview
          </Link>
        </div>
      </div>

      <TierCTAStack tier={tier} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
export function TierNominateSection({ tier }: { tier: TierClusterConfig }) {
  const { nominate } = tier;
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" aria-hidden />
          <h2 className="font-display text-lg sm:text-xl font-bold">Nominate an Education Enabler</h2>
        </div>
        <p className="mt-2 text-sm sm:text-base text-white/80">{nominate.intro}</p>

        <ol className="mt-4 space-y-2">
          {nominate.steps.map((step, i) => (
            <li key={step} className="flex gap-3 rounded-lg border border-white/10 bg-charcoal/60 p-3 text-sm text-white/85">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-bold">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={nominate.ctaHref} className={`${btnBase} ${accentBtn[tier.accent]}`}>
            {nominate.ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to={nominate.supportHref} className={`${btnBase} border-2 bg-transparent ${outlineBtn[tier.accent]}`}>
            {nominate.supportLabel}
          </Link>
        </div>
      </div>

      <aside className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-white/50">Already nominated?</p>
        <p className="mt-2 text-sm text-white/80">
          If you received a nomination invitation, use your acceptance link to confirm your profile.
        </p>
        <Link to="/nominees/accept" className={`${btnBase} mt-3 w-full border-2 bg-transparent ${outlineBtn[tier.accent]}`}>
          Accept your nomination
        </Link>
      </aside>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
function TierCTAStack({ tier }: { tier: TierClusterConfig }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
      <Link to={tier.nominate.ctaHref} className={`${btnBase} w-full ${accentBtn[tier.accent]}`}>
        {tier.nominate.ctaLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <Link
        to={`/nominees?tier=${encodeURIComponent(tier.nominees.directoryFilterKey)}`}
        className={`${btnBase} w-full border-2 bg-transparent ${outlineBtn[tier.accent]}`}
      >
        Browse {tier.shortName} nominees
      </Link>
    </div>
  );
}
