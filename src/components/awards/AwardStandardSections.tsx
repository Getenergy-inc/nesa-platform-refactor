// Reusable standard sections for NESA-Africa award & category pages.
// Implements the approved Premium Platform Standard:
// Hero (provided by page) → Why This Award Exists → Eligibility →
// EDX Evaluation → Timeline → FAQs → Sponsor This Category.
//
// All sections are mobile-first, use charcoal/gold tokens, and accept
// content as props so each page can stay specific without duplicating layout.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  GraduationCap,
  TrendingUp,
  Globe2,
  CheckCircle2,
  ArrowRight,
  Handshake,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Why this award exists
// ─────────────────────────────────────────────────────────────────────────────

export interface WhyAwardExistsProps {
  eyebrow?: string;
  title: string;
  pillars: { label: string; description: string }[];
}

export function WhyAwardExists({ eyebrow = "Why This Award Exists", title, pillars }: WhyAwardExistsProps) {
  return (
    <section className="bg-charcoal py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2 text-center md:text-left">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-8 text-center md:text-left">
          {title}
        </h2>
        <div className="grid gap-4 md:gap-5 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-2xl border border-gold/20 bg-charcoal-light/30 p-5 md:p-6"
            >
              <h3 className="text-gold font-semibold text-base md:text-lg mb-2">{p.label}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Eligibility
// ─────────────────────────────────────────────────────────────────────────────

export interface EligibilityBlockProps {
  title?: string;
  intro?: string;
  bullets: string[];
  disqualifiers?: string[];
}

export function EligibilityBlock({
  title = "Who Qualifies",
  intro,
  bullets,
  disqualifiers,
}: EligibilityBlockProps) {
  return (
    <section className="bg-charcoal-light/20 py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2 text-center md:text-left">
          Eligibility
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3 text-center md:text-left">
          {title}
        </h2>
        {intro && (
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 text-center md:text-left max-w-3xl">
            {intro}
          </p>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gold/20 bg-charcoal/60 p-5 md:p-6">
            <p className="text-gold text-sm font-semibold mb-3 inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Qualifies
            </p>
            <ul className="space-y-2.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-white/80 text-sm leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          {disqualifiers && disqualifiers.length > 0 && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 md:p-6">
              <p className="text-red-300 text-sm font-semibold mb-3">Does Not Qualify</p>
              <ul className="space-y-2.5">
                {disqualifiers.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-white/70 text-sm leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EDX evaluation block (reusable)
// ─────────────────────────────────────────────────────────────────────────────

const EDX_PILLARS = [
  {
    code: "E",
    title: "Education Impact",
    icon: GraduationCap,
    bullets: ["Learning outcomes", "School support", "Scholarship support", "Teacher development", "Educational innovation"],
  },
  {
    code: "D",
    title: "Development Contribution",
    icon: TrendingUp,
    bullets: ["SDG contribution", "Community impact", "Sustainability", "Leadership", "Long-term change"],
  },
  {
    code: "X",
    title: "Excellence & Reach",
    icon: Globe2,
    bullets: ["Visibility", "Innovation", "Replication potential", "Influence", "Scalability"],
  },
];

export interface EDXEvaluationBlockProps {
  awardName?: string;
  /** Optional weighting hint per pillar (e.g. "40%") */
  weights?: { E?: string; D?: string; X?: string };
  /** Highlight relevant scorecard areas for this award */
  highlights?: string[];
}

export function EDXEvaluationBlock({ awardName, weights, highlights }: EDXEvaluationBlockProps) {
  return (
    <section className="bg-charcoal py-12 md:py-16" aria-labelledby="edx-eval-heading">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2 text-center md:text-left">
              How We Evaluate
            </p>
            <h2
              id="edx-eval-heading"
              className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight text-center md:text-left"
            >
              The <span className="text-gold">EDX Matrix</span>
              {awardName && <span className="text-white/70 text-base md:text-lg block mt-1 font-sans font-normal">applied to {awardName}</span>}
            </h2>
          </div>
          <Link
            to="/edx-matrix"
            className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold hover:gap-2.5 transition-all self-center md:self-end"
          >
            Read full EDX framework <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:gap-5 md:grid-cols-3">
          {EDX_PILLARS.map((p, i) => (
            <motion.div
              key={p.code}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light/40 to-charcoal p-5 md:p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold font-display text-xl font-bold">
                  {p.code}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-base md:text-lg leading-tight">{p.title}</h3>
                  {weights?.[p.code as "E" | "D" | "X"] && (
                    <p className="text-gold/80 text-xs">Weight: {weights[p.code as "E" | "D" | "X"]}</p>
                  )}
                </div>
              </div>
              <ul className="space-y-1.5">
                {p.bullets.map((b) => (
                  <li key={b} className="text-white/70 text-sm flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-gold/70 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {highlights && highlights.length > 0 && (
          <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 p-5">
            <p className="text-gold text-xs font-semibold tracking-wide uppercase mb-2">
              Scorecard focus for this award
            </p>
            <div className="flex flex-wrap gap-2">
              {highlights.map((h) => (
                <span
                  key={h}
                  className="px-3 py-1 rounded-full bg-charcoal/70 border border-gold/25 text-white/85 text-xs"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-white/55 text-xs leading-relaxed mt-4 text-center md:text-left">
          NESA-Africa does not recognise popularity alone. Every recognition is anchored in
          measurable education impact, verified through the EDX Matrix.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Evaluation Timeline
// ─────────────────────────────────────────────────────────────────────────────

export interface TimelineStep {
  label: string;
  description: string;
}

const DEFAULT_TIMELINE: TimelineStep[] = [
  { label: "Nomination", description: "Public and institutional nominations open via the NESA-Africa portal." },
  { label: "Verification", description: "NRC automated review screens evidence, eligibility, and duplicates." },
  { label: "Review", description: "Independent jury panels apply the EDX Matrix rubric." },
  { label: "Assessment", description: "Independent jury assessment for eligible Blue Garnet tracks." },
  { label: "Recognition", description: "Certificates, gala honours, and legacy programme assignment." },
];

export interface EvaluationTimelineProps {
  steps?: TimelineStep[];
  intro?: string;
}

export function EvaluationTimeline({ steps = DEFAULT_TIMELINE, intro }: EvaluationTimelineProps) {
  return (
    <section className="bg-charcoal-light/20 py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2 text-center md:text-left">
          Process
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3 text-center md:text-left">
          From Nomination to Recognition
        </h2>
        {intro && (
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 text-center md:text-left max-w-3xl">
            {intro}
          </p>
        )}

        <ol className="relative space-y-5 md:space-y-0 md:grid md:grid-cols-5 md:gap-3">
          {steps.map((step, i) => (
            <li key={step.label} className="relative">
              <div className="rounded-2xl border border-gold/20 bg-charcoal/60 p-4 md:p-5 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 border border-gold/40 text-gold text-sm font-bold">
                    {i + 1}
                  </span>
                  <h3 className="text-white font-semibold text-sm md:text-base leading-tight">
                    {step.label}
                  </h3>
                </div>
                <p className="text-white/65 text-xs md:text-sm leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-white/50 text-xs mt-4 inline-flex items-start gap-1.5">
          <Calendar className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          Dates follow the official NESA-Africa 2026 stage timeline.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ accordion
// ─────────────────────────────────────────────────────────────────────────────

export interface AwardFAQItem {
  q: string;
  a: string;
}

export interface AwardFAQProps {
  items: AwardFAQItem[];
  title?: string;
}

export function AwardFAQ({ items, title = "Frequently Asked Questions" }: AwardFAQProps) {
  return (
    <section className="bg-charcoal py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2 text-center">
          FAQs
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-8 text-center">
          {title}
        </h2>
        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-gold/20 bg-charcoal-light/30 open:border-gold/40 transition-colors"
            >
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none p-4 md:p-5">
                <span className="text-white font-medium text-sm md:text-base leading-snug">
                  {item.q}
                </span>
                <ChevronDown className="h-4 w-4 text-gold transition-transform group-open:rotate-180 flex-shrink-0" />
              </summary>
              <div className="px-4 md:px-5 pb-4 md:pb-5 text-white/70 text-sm leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sponsor This Category
// ─────────────────────────────────────────────────────────────────────────────

export interface SponsorThisCategoryBlockProps {
  categoryLabel: string;
  /** Optional inquiry route override (defaults to /sponsorship-packages with category prefill) */
  inquiryHref?: string;
}

export function SponsorThisCategoryBlock({
  categoryLabel,
  inquiryHref,
}: SponsorThisCategoryBlockProps) {
  const href =
    inquiryHref ||
    `/sponsorship-packages?category=${encodeURIComponent(categoryLabel)}`;

  return (
    <section className="bg-charcoal-light/20 py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-gold/30 p-6 md:p-10",
            "bg-gradient-to-br from-gold/10 via-charcoal-light/30 to-charcoal",
          )}
        >
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="relative grid gap-6 md:grid-cols-[1.4fr,1fr] md:items-center">
            <div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/20 border border-gold/40 text-gold mb-3">
                <Handshake className="h-5 w-5" />
              </span>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-1">
                Category Partnership
              </p>
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                Sponsor {categoryLabel}
              </h3>
              <p className="text-white/75 text-sm md:text-base leading-relaxed mb-4">
                Power recognition, gala visibility, certificate co-branding, and
                measurable education impact for this category — while supporting
                Rebuild My School Africa through our 5% legacy contribution.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                {[
                  "Category naming visibility",
                  "Gala stage recognition",
                  "Media & broadcast credits",
                  "Annual impact report",
                ].map((b) => (
                  <li
                    key={b}
                    className="text-white/80 text-xs md:text-sm flex items-start gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  to={href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-charcoal font-semibold text-sm hover:bg-gold/90 transition-colors shadow-md shadow-gold/20"
                >
                  Sponsor This Category <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/sponsorship-packages"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/40 text-gold text-sm font-semibold hover:bg-gold/10 transition-colors"
                >
                  All Sponsorship Packages
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-gold/25 bg-charcoal/70 p-5">
              <p className="text-gold text-xs font-semibold tracking-wide uppercase mb-2 inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Governance Notice
              </p>
              <p className="text-white/75 text-xs md:text-sm leading-relaxed">
                Sponsors <span className="text-gold font-semibold">cannot influence</span>{" "}
                nominees, voting, judges, finalists, or winners. Recognition outcomes
                are governed independently through the NRC engine, EDX scoring, jury
                panels, and audited governance ratification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience composite: bundles the full standard stack
// ─────────────────────────────────────────────────────────────────────────────

export interface AwardStandardStackProps {
  awardName: string;
  why: WhyAwardExistsProps;
  eligibility: EligibilityBlockProps;
  edx?: EDXEvaluationBlockProps;
  timeline?: EvaluationTimelineProps;
  faqs: AwardFAQItem[];
  showSponsorBlock?: boolean;
}

export function AwardStandardStack({
  awardName,
  why,
  eligibility,
  edx,
  timeline,
  faqs,
  showSponsorBlock = true,
}: AwardStandardStackProps) {
  return (
    <>
      <WhyAwardExists {...why} />
      <EligibilityBlock {...eligibility} />
      <EDXEvaluationBlock awardName={awardName} {...edx} />
      <EvaluationTimeline {...timeline} />
      <AwardFAQ items={faqs} />
      {showSponsorBlock && <SponsorThisCategoryBlock categoryLabel={awardName} />}
    </>
  );
}
