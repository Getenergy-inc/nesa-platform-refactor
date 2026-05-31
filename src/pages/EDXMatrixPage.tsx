// EDX Matrix — Education Development & Impact Matrix
// The central evaluation framework for NESA-Africa recognition.

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  TrendingUp,
  Globe2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Leaf,
  Lightbulb,
  Compass,
  Heart,
  Radio,
  Gavel,
  BookOpen,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    code: "E",
    title: "Education Impact",
    icon: GraduationCap,
    description:
      "Direct, measurable contribution to learning outcomes, school capacity, and the people who deliver education.",
    measures: [
      "Learning outcomes (pass rates, literacy, retention)",
      "School support (infrastructure, materials, capacity)",
      "Scholarship support (access, equity, completion)",
      "Teacher development (training, wellbeing, retention)",
      "Educational innovation (curriculum, tools, methods)",
    ],
  },
  {
    code: "D",
    title: "Development Contribution",
    icon: TrendingUp,
    description:
      "The broader development footprint — how the nominee advances Africa's social, economic, and policy progress through education.",
    measures: [
      "SDG contribution (SDG 4, 5, 10, 17 in particular)",
      "Community impact (local lives improved)",
      "Sustainability (funding, governance, continuity)",
      "Leadership (mentorship, succession, voice)",
      "Long-term change (measurable over years, not months)",
    ],
  },
  {
    code: "X",
    title: "Excellence & Reach",
    icon: Globe2,
    description:
      "How far the impact travels — replicability, visibility, and the power to inspire and scale.",
    measures: [
      "Visibility (recognition, media, public profile)",
      "Innovation (original models, breakthroughs)",
      "Replication potential (can others adopt it?)",
      "Influence (policy, peers, partners)",
      "Scalability (regional, continental, global)",
    ],
  },
];

const SCORECARDS = [
  { icon: GraduationCap, label: "Education Impact", description: "Learning gains, school strengthening, teacher uplift." },
  { icon: Users, label: "Community Impact", description: "Lives reached, communities served, partnerships built." },
  { icon: Leaf, label: "Sustainability", description: "Funding model, governance, multi-year continuity." },
  { icon: Lightbulb, label: "Innovation", description: "New ideas, original methods, breakthrough delivery." },
  { icon: Compass, label: "Leadership", description: "Vision, mentorship, voice, succession." },
  { icon: Heart, label: "Inclusion", description: "Gender, special needs, marginalised learners." },
  { icon: Radio, label: "Reach", description: "Geographic spread, replication, audience." },
  { icon: Gavel, label: "Governance", description: "Transparency, ethics, evidence integrity." },
];

const EXAMPLES = [
  {
    title: "School Founder, Lagos",
    edx: "E: 35 · D: 28 · X: 18",
    note: "Strong on Education Impact and Development; moderate Reach.",
  },
  {
    title: "Diaspora Scholarship Programme",
    edx: "E: 30 · D: 32 · X: 24",
    note: "Balanced contribution with notable continental Reach.",
  },
  {
    title: "Edu-Creator with Continental Audience",
    edx: "E: 22 · D: 20 · X: 38",
    note: "Excellence & Reach dominate; Education Impact track via Influencer tier.",
  },
];

export default function EDXMatrixPage() {
  return (
    <>
      <Helmet>
        <title>EDX Matrix — How NESA-Africa Evaluates Education Impact</title>
        <meta
          name="description"
          content="The EDX Matrix (Education Development & Impact Matrix) is the framework NESA-Africa uses to evaluate, verify, recognise, and support measurable education impact across Africa."
        />
        <link rel="canonical" href="https://nesa.africa/edx-matrix" />
      </Helmet>

      <PublicLayout>
        {/* HERO */}
        <section className="relative bg-charcoal py-14 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 max-w-5xl relative">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-semibold tracking-[0.18em] uppercase mb-4">
              <ShieldCheck className="h-3 w-3" />
              Recognition Framework
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4">
              The <span className="text-gold">EDX Matrix</span>
            </h1>
            <p className="text-gold text-lg md:text-xl font-medium mb-4">
              Education Development &amp; Impact Matrix
            </p>
            <p className="text-white/80 text-sm md:text-base lg:text-lg leading-relaxed max-w-3xl mb-6">
              NESA-Africa does not focus on popularity alone. Every recognition is
              anchored in <span className="text-gold font-semibold">measurable education impact</span>,
              evaluated through three independent pillars and a transparent
              eight-dimension scorecard.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                to="/nominate"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-charcoal font-semibold text-sm hover:bg-gold/90 transition-colors shadow-md shadow-gold/20"
              >
                Nominate Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/governance"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/40 text-gold text-sm font-semibold hover:bg-gold/10 transition-colors"
              >
                Governance Framework
              </Link>
            </div>
          </div>
        </section>

        {/* PILLARS */}
        <section className="bg-charcoal py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2 text-center">
              Evaluation Pillars
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3 text-center">
              Three Independent Pillars
            </h2>
            <p className="text-white/70 text-sm md:text-base text-center max-w-2xl mx-auto mb-10 leading-relaxed">
              Each nominee is scored on E, D, and X independently. Pillar weights
              vary by award tier to fit the nature of the recognition.
            </p>

            <div className="grid gap-5 md:gap-6 md:grid-cols-3">
              {PILLARS.map((p, i) => (
                <motion.article
                  key={p.code}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className={cn(
                    "relative rounded-2xl border border-gold/20 p-6",
                    "bg-gradient-to-br from-charcoal-light/40 via-charcoal to-charcoal",
                    "hover:border-gold/50 transition-colors",
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 border border-gold/40 text-gold font-display text-2xl font-bold">
                      {p.code}
                    </span>
                    <div>
                      <h3 className="font-display text-lg md:text-xl font-bold text-white leading-tight">
                        {p.title}
                      </h3>
                      <p.icon className="h-4 w-4 text-gold mt-1" aria-hidden="true" />
                    </div>
                  </div>
                  <p className="text-white/75 text-sm leading-relaxed mb-4">
                    {p.description}
                  </p>
                  <p className="text-gold text-xs font-semibold tracking-wide uppercase mb-2">
                    Measures
                  </p>
                  <ul className="space-y-1.5">
                    {p.measures.map((m) => (
                      <li key={m} className="text-white/70 text-sm flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-gold/70 flex-shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* SCORECARD GRID */}
        <section className="bg-charcoal-light/20 py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2 text-center">
              Scorecard
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-3 text-center">
              Eight Dimensions, One Score
            </h2>
            <p className="text-white/70 text-sm md:text-base text-center max-w-2xl mx-auto mb-10 leading-relaxed">
              Within the three pillars, the scorecard breaks impact into eight
              transparent dimensions. Every dimension is evidenced before any
              recognition is awarded.
            </p>

            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              {SCORECARDS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="rounded-2xl border border-gold/20 bg-charcoal/60 p-4 md:p-5 hover:border-gold/40 transition-colors"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold mb-3">
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1 leading-tight">
                    {s.label}
                  </h3>
                  <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                    {s.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT'S ASSESSED */}
        <section className="bg-charcoal py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2 text-center md:text-left">
              How Categories Are Assessed
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-8 text-center md:text-left">
              From Evidence to Score
            </h2>
            <ol className="space-y-4 md:space-y-5">
              {[
                {
                  step: "1",
                  title: "Evidence intake",
                  body: "Nominees submit verifiable evidence: links, reports, beneficiary numbers, citations. The NRC engine deduplicates and screens.",
                },
                {
                  step: "2",
                  title: "Pillar scoring",
                  body: "Independent reviewers score E, D, and X separately using a rubric calibrated to the award tier.",
                },
                {
                  step: "3",
                  title: "Scorecard rollup",
                  body: "The eight scorecard dimensions are mapped into the three pillars, producing a deterministic composite score.",
                },
                {
                  step: "4",
                  title: "Jury & voting layer",
                  body: "For Blue Garnet, public AGC voting and jury panels combine with EDX scores under the audited Blue Garnet formula.",
                },
                {
                  step: "5",
                  title: "Recognition & legacy",
                  body: "Recognised nominees enter the certificate pipeline and, where eligible, the Rebuild My School Africa legacy programme.",
                },
              ].map((row) => (
                <li
                  key={row.step}
                  className="flex gap-4 rounded-2xl border border-gold/15 bg-charcoal-light/30 p-4 md:p-5"
                >
                  <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 border border-gold/40 text-gold font-bold text-sm">
                    {row.step}
                  </span>
                  <div>
                    <h3 className="text-white font-semibold text-sm md:text-base mb-1">
                      {row.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">{row.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* EXAMPLES */}
        <section className="bg-charcoal-light/20 py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gold/80 mb-2 text-center md:text-left">
              Illustrative Examples
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-8 text-center md:text-left">
              EDX in Practice
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {EXAMPLES.map((ex) => (
                <div
                  key={ex.title}
                  className="rounded-2xl border border-gold/20 bg-charcoal/60 p-5"
                >
                  <BookOpen className="h-5 w-5 text-gold mb-3" aria-hidden="true" />
                  <h3 className="text-white font-semibold text-base mb-2 leading-tight">
                    {ex.title}
                  </h3>
                  <p className="text-gold/90 text-sm font-mono mb-2">{ex.edx}</p>
                  <p className="text-white/65 text-xs leading-relaxed">{ex.note}</p>
                </div>
              ))}
            </div>
            <p className="text-white/45 text-xs mt-6 text-center md:text-left">
              Examples are illustrative composites and do not represent specific nominees.
            </p>
          </div>
        </section>

        {/* GOVERNANCE FOOTER */}
        <section className="bg-charcoal py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-charcoal-light/30 to-charcoal p-6 md:p-10 text-center">
              <ShieldCheck className="h-10 w-10 text-gold mx-auto mb-4" />
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                Integrity is non-negotiable.
              </h3>
              <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-5">
                Sponsors, donors, partners, judges, and volunteers cannot influence
                nominations, voting, judging, finalists, or winners. Every EDX score
                is logged, auditable, and verifiable.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                <Link
                  to="/governance"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-charcoal font-semibold text-sm hover:bg-gold/90 transition-colors"
                >
                  Governance Framework <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/nominate"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/40 text-gold text-sm font-semibold hover:bg-gold/10 transition-colors"
                >
                  Start a Nomination
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    </>
  );
}
