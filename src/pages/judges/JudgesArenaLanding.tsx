import { useMemo } from "react";
import { SmartLink } from "@/components/navigation/SmartLink";
import { PublicJudgesDirectorySection } from "@/components/judges/PublicJudgesDirectorySection";
import { ArenaExitButton } from "@/components/arena/ArenaExitLink";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ShieldCheck, Award, Users, Scale, ArrowRight, Lock, Sparkles,
  CheckCircle2, FileSearch, Vote, Gavel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ICON_PHASE_TIMELINE,
  getCurrentIconPhase,
} from "@/config/iconAward/calendar";
import { ArenaStatStrip } from "@/components/arena/ArenaChrome";
import { useArenaPublicStats, arenaCount } from "@/hooks/useArenaPublicStats";
import heroImg from "@/assets/judges-arena/jury-chamber-hero.jpg";

const WORKFLOW = [
  { icon: Users,        label: "Public Nomination" },
  { icon: FileSearch,   label: "Automated Screening" },
  { icon: ShieldCheck,  label: "NRRC Initial Review" },
  { icon: CheckCircle2, label: "Nominee Acceptance" },
  { icon: ShieldCheck,  label: "NRRC Full Verification" },
  { icon: Users,        label: "Verified Nominee Pool" },
  { icon: Scale,        label: "Specialist Panel Screening" },
  { icon: Award,        label: "Three Finalists per Group" },
  { icon: Vote,         label: "Decision Ballot" },
  { icon: Gavel,        label: "Governance Review" },
  { icon: Sparkles,     label: "Nine Laureates" },
  { icon: Award,        label: "Moderated Outcome" },
];

export default function JudgesArenaLanding() {
  const phase = useMemo(() => getCurrentIconPhase(), []);
  const { data: publicStats, isLoading: statsLoading } = useArenaPublicStats();

  // Every figure below is a live query result. Nothing is hardcoded: when the
  // jury has not been appointed yet the count is genuinely zero and renders "—".
  const stats = [
    {
      icon: Gavel,
      value: arenaCount(publicStats?.publicJudges, statsLoading),
      label: "Confirmed judges listed",
      detail: "Published only after appointment & consent",
    },
    {
      icon: Users,
      value: arenaCount(publicStats?.publicNrcMembers, statsLoading),
      label: "NRRC researchers listed",
      detail: "Verification corps, opt-in profiles",
    },
    {
      icon: FileSearch,
      value: arenaCount(publicStats?.nominees, statsLoading),
      label: "Nominees in the directory",
      detail: "Across every 2026 recognition pathway",
    },
    {
      icon: ShieldCheck,
      value: phase.label,
      label: "Current jury phase",
      detail: phase.nextLabel ? `Next: ${phase.nextLabel}` : "Canonical 2026 calendar",
    },
  ];

  return (
    <div className="min-h-screen bg-arena-bg text-white">
      <Helmet>
        <title>2026 Africa Education Icon Judges Arena | NESA-Africa</title>
        <meta
          name="description"
          content="Nine independent judges assess eligible Africa Education Icon dossiers after NRRC research, review and quality assurance."
        />
        <link rel="canonical" href="https://nesa.africa/judges" />
        <meta property="og:title" content="2026 Africa Education Icon Judges Arena | NESA-Africa" />
        <meta property="og:description" content="Independent, evidence-based and auditable jury process for Africa's highest lifetime education recognition." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/judges" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${heroImg})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-arena-bg/70 via-arena-bg/85 to-arena-bg" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4b6cff]/40 bg-arena-panel px-3 py-1 text-xs uppercase tracking-widest text-[#8ea6ff]">
            <Lock className="h-3 w-3" /> Invitation-only jury portal
          </div>
          <div className="mt-4"><ArenaExitButton /></div>
          <h1 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-4xl">
            Independent <span className="text-gold">Africa Education Icon</span> Judges
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/75 max-w-3xl leading-relaxed">
            Nine independent judges assess eligible Africa Education Icon dossiers after NRRC research, review and quality assurance. Three judges per Icon category; no public voting; conflict screening and governance oversight.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-gold text-arena-bg hover:bg-gold/90">
              <SmartLink to="/judges/sign-in">View Judging Standards <ArrowRight className="ml-2 h-4 w-4" /></SmartLink>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10">
              <a href="#workflow">How Icon Judging Works</a>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-white/80 hover:text-gold">
              <SmartLink to="/judges/directory">Meet Confirmed Judges</SmartLink>
            </Button>
          </div>


          <div className="mt-10 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="text-white/80">Current phase:</span>
            <span className="text-white font-medium">{phase.label}</span>
            {phase.nextLabel && (
              <span className="text-white/50 hidden sm:inline">· Next: {phase.nextLabel}</span>
            )}
          </div>
        </div>
      </section>

      {/* Stat strip — live counts only */}
      <section className="border-y border-white/10 bg-arena-rail">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <ArenaStatStrip stats={stats} />
        </div>
      </section>

      {/* Workflow timeline */}
      <section id="workflow" className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl sm:text-4xl">The Recognition Journey</h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            Every laureate reaches the podium through a transparent, evidence-based
            process. No public voting. No sponsorship influence. Only verified impact,
            independent judges, and governance oversight.
          </p>
        </div>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKFLOW.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-gold/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gold/15 border border-gold/30 p-2">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <span className="text-xs text-white/50">Step {i + 1}</span>
                </div>
                <p className="mt-3 text-white/90 font-medium">{step.label}</p>
              </motion.li>
            );
          })}
        </ol>
      </section>

      {/* About sections */}
      <section className="bg-arena-panel border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-8">
          {[
            {
              title: "Recognition Structure",
              body: "Three lifetime-impact pathways — Literary & New Curriculum Advocate, Africa Technical Educator, Africa Education Philanthropy — each with three classifications: African in Africa, African in the Diaspora, and Friend of Africa. Nine laureates in total.",
            },
            {
              title: "NRRC Verification Before Judging",
              body: "The Nominee Research and Review Corps completes identity, duplicate, eligibility, evidence and pathway verification. Only NRRC-Verified nominees ever reach the judges.",
            },
            {
              title: "Independent judging structure",
              body: "Nine judges · Three Icon categories · Three judges per category · Independent assessment · Governance oversight.",
            },
            {
              title: "Publication conditions",
              body: "Written acceptance, identity confirmation, confidentiality agreement, conflict declaration, category assignment, calibration and secure-access testing are required before publication.",
            },
            {
              title: "Independence & Conflict Safeguards",
              body: "Judges must declare personal, professional, financial, political, institutional or family conflicts. Recusal automatically removes the assignment and reallocates.",
            },
            {
              title: "Confidentiality Statement",
              body: "Every score, note, ballot and deliberation is confidential and immutable. Ballots are locked on submission with a cryptographic receipt for the judge's records.",
            },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-serif text-xl text-gold">{s.title}</h3>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicJudgesDirectorySection />

      {/* Phase key dates */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="font-serif text-3xl">Key Dates</h2>
        <div className="mt-8 divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
          {ICON_PHASE_TIMELINE.map((p) => (
            <div key={p.key} className="flex items-center justify-between px-5 py-4 bg-white/[0.02]">
              <span className="text-white/90">{p.label}</span>
              <span className="text-white/60 text-sm">
                {p.date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-arena-panel to-arena-bg p-10 lg:p-14 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl">
            Judging preparation is in progress.
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            The Judges Arena will be activated only after appointments, conflict declarations, calibration and secure-access testing are complete.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-arena-bg hover:bg-gold/90">
              <SmartLink to="/judges/sign-in">View Judging Standards</SmartLink>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10">
              <SmartLink to="/judges/help">Technical Support</SmartLink>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
