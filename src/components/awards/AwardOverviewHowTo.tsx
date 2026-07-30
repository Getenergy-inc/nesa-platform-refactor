import { FileText, UserPlus, ShieldCheck, Trophy, Sparkles } from "lucide-react";

interface AwardOverviewHowToProps {
  /** Display name of the category or subcategory */
  name: string;
  /** Short tagline / description */
  tagline?: string;
  /** Long-form overview paragraph(s). Falls back to tagline if omitted. */
  overview?: string | string[];
  /** Tier label shown in the badge, e.g. "Gold–Blue Garnet · Tier 3" */
  tierLabel?: string;
  /** Href for the primary "Start Nomination" CTA — defaults to on-page #nominate anchor */
  nominateHref?: string;
  /** Optional secondary link, e.g. tier overview */
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Kind — controls the "Who is eligible" hint wording */
  kind?: "category" | "subcategory";
}

const STEPS = [
  {
    icon: FileText,
    title: "Review the criteria",
    body: "Confirm the enabler meets the eligibility bar for this recognition — evidence of impact across 12+ months.",
  },
  {
    icon: UserPlus,
    title: "Complete the form",
    body: "Fill the on-page nomination form with nominee details, evidence links and a supporting statement (150–500 words).",
  },
  {
    icon: ShieldCheck,
    title: "NRC verification",
    body: "Our Nominee Review Committee verifies claims, checks evidence and screens for conflicts of interest.",
  },
  {
    icon: Trophy,
    title: "Recognition path",
    body: "Verified nominees advance to public endorsement and jury review, culminating at the December 2026 Gala.",
  },
] as const;

export function AwardOverviewHowTo({
  name,
  tagline,
  overview,
  tierLabel,
  nominateHref = "#nominate",
  secondaryHref,
  secondaryLabel,
  kind = "category",
}: AwardOverviewHowToProps) {
  const paragraphs = Array.isArray(overview)
    ? overview
    : overview
      ? [overview]
      : tagline
        ? [tagline]
        : [];

  return (
    <section
      aria-labelledby="overview-how-to-heading"
      className="border-y border-gold/15 bg-gradient-to-b from-charcoal via-charcoal-light to-charcoal"
    >
      <div className="container mx-auto px-4 py-10 md:py-14 max-w-5xl">
        {/* Overview */}
        <div className="mb-10">
          {tierLabel ? (
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gold">
              <Sparkles className="h-3 w-3" /> {tierLabel}
            </p>
          ) : null}
          <h2
            id="overview-how-to-heading"
            className="font-serif text-2xl md:text-3xl text-ivory"
          >
            Overview
          </h2>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gold/80">
            About the {kind === "subcategory" ? "subcategory" : "category"}: {name}
          </p>
          <div className="mt-4 space-y-3 text-ivory/80 text-sm md:text-base leading-relaxed">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>
                {name} recognises enablers of education for all across Africa whose work
                has produced measurable, verifiable learning impact.
              </p>
            )}
          </div>
        </div>

        {/* How to nominate */}
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-ivory">How to Nominate</h2>
          <p className="mt-2 text-sm text-ivory/70 max-w-2xl">
            Four transparent steps — from evidence to recognition. Nominations are free,
            open to Africans and non-Africans, and NRC-verified before advancing.
          </p>

          <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-gold/20 bg-black/30 p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold font-semibold">
                      {idx + 1}
                    </span>
                    <Icon className="h-4 w-4 text-gold/80" aria-hidden />
                  </div>
                  <h3 className="mt-3 font-semibold text-ivory">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-ivory/70 leading-relaxed">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={nominateHref}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold/90"
            >
              Start Nomination for {name}
            </a>
            {secondaryHref && secondaryLabel ? (
              <a
                href={secondaryHref}
                className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-6 py-3 text-sm font-semibold text-ivory transition hover:bg-ivory/10"
              >
                {secondaryLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
