import { AboutSeo } from "@/pages/about/AboutSeo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Trophy,
  Heart,
  Handshake,
  Globe,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecognitionJourneyTimeline } from "@/components/timeline/RecognitionJourneyTimeline";
import { MasterTimelineTable } from "@/components/timeline/MasterTimelineTable";
import { RECOGNITION_JOURNEY_2026 } from "@/data/recognitionJourney2026";

const SUMMARY_CARDS = [
  {
    icon: Calendar,
    label: "Recognition Campaign",
    value: "1 July → 14 Dec 2026",
    detail: "Pre-nomination activation, nominations, NRC verification, TV showcases and the Recognition Gala",
  },
  {
    icon: Trophy,
    label: "Recognition Gala",
    value: "14 December 2026",
    detail: "NESA-Africa 2026 Recognition Gala, Lagos — Africa's flagship education recognition moment",
  },
  {
    icon: Heart,
    label: "Impact & Legacy Phase",
    value: "Dec 2026 → Dec 2027",
    detail: "EduAid-Africa · Rebuild My School Africa · Afri-EduTourism · Scholarships",
  },
  {
    icon: Handshake,
    label: "Continental Reach",
    value: "8 Regions + 2 Communities",
    detail: "Eight Africa Regions, the Diaspora and Friends of Africa",
  },
];

const PARTICIPANT_TRACKS = [
  { label: "Nominees", to: "/nominate", desc: "Discover your subcategory and submit a nomination from 30 August 2026." },
  { label: "NRC Verifiers", to: "/nrc", desc: "Research, verify and evidence every nomination against the EDI Matrix." },
  { label: "Judges", to: "/judges/directory", desc: "Icon judges' onboarding, calibration and final review." },
  { label: "Partners", to: "/partners", desc: "Sponsor, fund or co-host recognition moments." },
  { label: "Volunteers", to: "/volunteer", desc: "Power regional activation and storytelling." },
  { label: "Media", to: "/media", desc: "Broadcast, interviews and continental coverage." },
];


export default function Timeline() {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <AboutSeo
        title="NESA-Africa 2026 Recognition Journey | Continental Roadmap"
        description="The official 2026 recognition journey for NESA-Africa — 13 phases from public pre-nomination activation to the Gold-Blue Garnet Awards Gala, plus the continuous Media & EduAid-Africa engagement track."
        path="/about/timeline"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Timeline", path: "/about/timeline" },
        ]}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="container relative mx-auto px-4 py-20 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge className="mb-6 border-amber-500/40 bg-amber-500/10 text-amber-200">
              <Sparkles className="mr-1.5 h-3 w-3" /> Africa's Education Recognition & Impact Platform
            </Badge>
            <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
              NESA-Africa 2026 <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">Recognition Journey</span>
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/80 sm:text-xl">
              The Continental Roadmap to Recognising the Enablers of Education for All.
            </p>
            <p className="mx-auto mt-6 max-w-3xl text-base text-white/70">
              NESA-Africa 2026 unfolds through a carefully designed recognition journey that
              identifies, verifies, celebrates and supports the people and organisations enabling
              Education for All across <span className="text-white">Eight Africa Regions</span>, Africans in the
              <span className="text-white"> Diaspora</span>, and <span className="text-white">Friends of Africa</span>.
              Each milestone builds momentum toward the Gold-Blue Garnet Awards Gala while
              opening doors for participation, partnerships, storytelling and measurable impact.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-yellow-600 text-charcoal hover:from-amber-400 hover:to-yellow-500">
                <Link to="/nominate">Nominate an Enabler <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                <Link to="/awards/gold-blue-garnet">Explore Recognition</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/5">
                <Link to="/programs">Explore Impact Programmes</Link>
              </Button>
            </div>
          </motion.div>

          {/* Summary cards */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUMMARY_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
                  <Icon className="h-5 w-5 text-amber-300" />
                  <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/50">{c.label}</div>
                  <div className="mt-1 font-serif text-lg text-white">{c.value}</div>
                  <div className="mt-2 text-xs text-white/60">{c.detail}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MASTER TIMELINE (dated milestones) */}
      <section className="container mx-auto px-4 py-16">
        <MasterTimelineTable />
      </section>

      {/* TIMELINE (phase view) */}
      <section className="container mx-auto px-4 pb-20">
        <RecognitionJourneyTimeline
          heading="The 13 Phases of the 2026 Journey"
          intro="From continental activation to recognition, gala and a year-long impact and legacy phase. Every milestone is designed to convert visibility into measurable education impact."
        />
      </section>

      {/* Recognition → Impact → Legacy strip */}
      <section className="border-y border-white/10 bg-gradient-to-r from-amber-500/10 via-transparent to-emerald-500/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Recognition", desc: "Identify, verify and honour Education Enablers across the continent.", tone: "amber" },
              { label: "Impact", desc: "Translate visibility into partnerships, funding and education interventions.", tone: "blue" },
              { label: "Legacy", desc: "Build a continental hall of fame and a measurable impact record year-on-year.", tone: "emerald" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <div className={`text-[11px] uppercase tracking-[0.2em] text-${s.tone}-300`}>Stage</div>
                <h3 className="mt-1 font-serif text-2xl text-white">{s.label}</h3>
                <p className="mt-2 text-sm text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participant tracks */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Badge variant="outline" className="border-white/15 text-white/70">
            <Users className="mr-1.5 h-3 w-3" /> Choose Your Track
          </Badge>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Who Participates &amp; How</h2>
          <p className="mt-2 text-white/70">
            The recognition journey is designed for nominees, NRC verifiers, judges, partners, volunteers and media — each with a clear pathway.
          </p>

        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARTICIPANT_TRACKS.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-amber-500/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-white group-hover:text-amber-200">{t.label}</h3>
                <ArrowRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-1 group-hover:text-amber-300" />
              </div>
              <p className="mt-2 text-sm text-white/70">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Regional positioning footer */}
      <section className="border-t border-white/10 bg-white/[0.02] py-12">
        <div className="container mx-auto px-4 text-center">
          <Globe className="mx-auto h-6 w-6 text-amber-300" />
          <p className="mt-3 font-serif text-2xl text-white sm:text-3xl">
            One Continent. Eight Africa Regions. Two Global Communities. One Mission.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/65">
            {RECOGNITION_JOURNEY_2026.length} phases · 4 Recognition Tiers · 9 Recognition Pillars · powered by AfriGold Coin (AGC).
          </p>
        </div>
      </section>
    </div>
  );
}
