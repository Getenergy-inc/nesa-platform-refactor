import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ShieldCheck, Award, Users, Scale, ArrowRight, Lock, Sparkles,
  CheckCircle2, FileSearch, Vote, Gavel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ICON_ARENA_STATS,
  ICON_PHASE_TIMELINE,
  getCurrentIconPhase,
} from "@/config/iconAward/calendar";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/judges-arena/jury-chamber-hero.jpg";

const WORKFLOW = [
  { icon: Users,        label: "Public Nomination" },
  { icon: FileSearch,   label: "Automated Screening" },
  { icon: ShieldCheck,  label: "NRC Initial Review" },
  { icon: CheckCircle2, label: "Nominee Acceptance" },
  { icon: ShieldCheck,  label: "NRC Full Verification" },
  { icon: Users,        label: "Verified Nominee Pool" },
  { icon: Scale,        label: "Specialist Panel Screening" },
  { icon: Award,        label: "Three Finalists per Group" },
  { icon: Vote,         label: "27-Judge Grand Jury Vote" },
  { icon: Gavel,        label: "Governance Review" },
  { icon: Sparkles,     label: "Nine Laureates" },
  { icon: Award,        label: "Hall of Fame & Gala" },
];

export default function JudgesArenaLanding() {
  const phase = useMemo(() => getCurrentIconPhase(), []);
  const [nomineeCount, setNomineeCount] = useState<number>(ICON_ARENA_STATS.minNominees);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { count } = await supabase
        .from("nominees")
        .select("id", { count: "exact", head: true });
      if (!cancelled && typeof count === "number" && count > ICON_ARENA_STATS.minNominees) {
        setNomineeCount(count);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const stats = [
    { value: ICON_ARENA_STATS.judges,      label: "Judges" },
    { value: ICON_ARENA_STATS.pathways,    label: "Pathways" },
    { value: ICON_ARENA_STATS.panels,      label: "Screening Panels" },
    { value: ICON_ARENA_STATS.finalists,   label: "Finalists" },
    { value: ICON_ARENA_STATS.laureates,   label: "Laureates" },
    { value: `${nomineeCount.toLocaleString()}+`, label: "Nominees" },
  ];

  return (
    <div className="min-h-screen bg-[#050b1a] text-white">
      <Helmet>
        <title>2026 Africa Education Icon Judges Arena | NESA-Africa</title>
        <meta
          name="description"
          content="Learn how 27 independent judges review NRC-verified nominees across three pathways and nine finalist groups to select the nine Africa Education Icon Laureates for 2006–2026."
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b1a]/70 via-[#050b1a]/85 to-[#050b1a]" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4b6cff]/40 bg-[#0b1a3a]/70 px-3 py-1 text-xs uppercase tracking-widest text-[#8ea6ff]">
            <Lock className="h-3 w-3" /> Invitation-only jury portal
          </div>
          <h1 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-4xl">
            2026 <span className="text-[#c9a24a]">Africa Education Icon</span> Judges Arena
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/75 max-w-3xl leading-relaxed">
            A secure, independent jury platform for reviewing verified lifetime education
            impact and selecting the nine Africa Education Icon Laureates for 2006–2026.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-[#c9a24a] text-[#050b1a] hover:bg-[#e0b96b]">
              <Link to="/judges/sign-in">Judge Sign In <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10">
              <a href="#workflow">Learn About the Judging Process</a>
            </Button>
          </div>

          <div className="mt-10 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#c9a24a] animate-pulse" />
            <span className="text-white/80">Current phase:</span>
            <span className="text-white font-medium">{phase.label}</span>
            {phase.nextLabel && (
              <span className="text-white/50 hidden sm:inline">· Next: {phase.nextLabel}</span>
            )}
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-white/10 bg-[#0b1a3a]/60">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-3xl lg:text-4xl text-[#c9a24a]">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-white/60">{s.label}</div>
            </div>
          ))}
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
                className="relative rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-[#c9a24a]/40 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#c9a24a]/15 border border-[#c9a24a]/30 p-2">
                    <Icon className="h-5 w-5 text-[#c9a24a]" />
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
      <section className="bg-[#08122b] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-8">
          {[
            {
              title: "Recognition Structure",
              body: "Three lifetime-impact pathways — Literary & New Curriculum Advocate, Africa Technical Educator, Africa Education Philanthropy — each with three classifications: African in Africa, African in the Diaspora, and Friend of Africa. Nine laureates in total.",
            },
            {
              title: "NRC Verification Before Judging",
              body: "The Nominee Research Corps completes identity, duplicate, eligibility, evidence and pathway verification. Only NRC-Verified nominees ever reach the judges.",
            },
            {
              title: "Nine-Panel Jury Matrix",
              body: "27 judges are divided into nine specialist panels of three. Each panel screens only its assigned pathway and classification, then all 27 judges vote in the grand jury round.",
            },
            {
              title: "Screening to Final Vote Timeline",
              body: "Specialist screening runs from the second week of September through 30 September 2026. Grand jury ranked-choice voting opens 1 October and closes 7 October 2026.",
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
              <h3 className="font-serif text-xl text-[#c9a24a]">{s.title}</h3>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

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
        <div className="rounded-2xl border border-[#c9a24a]/30 bg-gradient-to-br from-[#0b1a3a] to-[#050b1a] p-10 lg:p-14 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl">
            27 Judges. 3 Pathways. 9 Screening Panels. 27 Finalists. 9 Laureates.
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            One independent, evidence-based and auditable jury process for Africa's
            highest lifetime education recognition.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-[#c9a24a] text-[#050b1a] hover:bg-[#e0b96b]">
              <Link to="/judges/sign-in">Judge Sign In</Link>
            </Button>
            <Button asChild size="lg" variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/10">
              <Link to="/judges/help">Technical Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
