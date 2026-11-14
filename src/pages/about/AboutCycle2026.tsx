// About NESA-Africa 2026 — inaugural public award cycle.
// Institutional-register refactor: seal-anchored hero (AU/UN),
// Nobel-style stat strip, Oscar-style tier spotlight, process
// pipeline, awards-season timeline, non-influence declaration.
import { AboutSeo } from "@/pages/about/AboutSeo";
import {
  AboutSealHero,
  AboutStatStrip,
  AboutRecognitionTiers,
  AboutProcessPipeline,
  AboutCycleTimeline,
  AboutGovernanceProtocol,
  AboutContactBlock,
  CANONICAL_TIERS,
  CANONICAL_PIPELINE,
  type TimelinePhase,
} from "@/pages/about/AboutSharedBlocks";
import { AboutCanonicalContent } from "@/pages/about/AboutCanonicalContent";

const STATS_2026 = [
  { value: "4", label: "Recognition Tiers", sub: "22 awards · 90 subcategories" },
  { value: "9", label: "Africa Education Icons", sub: "Up to nine recognised" },
  { value: "9", label: "Icon NRRC Members", sub: "Three per Icon category" },
  { value: "9", label: "Independent Icon Judges", sub: "Icon tier only" },
  { value: "0", label: "Public Voting", sub: "No public voting in 2026" },
  { value: "13 Dec", label: "Online Programme", sub: "Sunday 13 December 2026" },
];

const PHASES_2026: TimelinePhase[] = [
  {
    phaseName: "Pre-Nomination",
    window: "15 Jan – 29 Aug 2026",
    status: "active",
    events: [
      { date: "15 Jan – 29 Aug", title: "NRRC Data Entry", detail: "~2,700 pre-nominees populated; each requires acceptance" },
      { date: "15 Aug", title: "All four NRRC teams activate" },
      { date: "20 Aug", title: "EduAid-Africa Webinar Series begins" },
    ],
  },
  {
    phaseName: "Nominations Open",
    window: "9 Nov 2026 – 31 Mar 2027",
    status: "upcoming",
    spotlight: true,
    events: [
      { date: "9 Nov", title: "Public Nominations Open — all four tiers" },
      { date: "6 Sep – 6 Oct", title: "Africa Education Icon window", detail: "Independent, shorter closing date" },
    ],
  },
  {
    phaseName: "NRRC Verification",
    window: "9 Nov 2026 – 31 Mar 2027",
    status: "upcoming",
    events: [
      { date: "By 10 Sep", title: "Icon NRRC verification complete" },
      { date: "By 20 Dec", title: "Influencer / Platinum / Gold-Blue Garnet verification complete" },
    ],
  },
  {
    phaseName: "Judges & Grand Jury",
    window: "1 Sep – 12 Oct 2026",
    status: "upcoming",
    events: [
      { date: "1 Sep – 12 Oct", title: "Panel Scoring & Grand Jury Deliberation", detail: "Africa Education Icon Award only" },
    ],
  },
  {
    phaseName: "Finalists Revealed",
    window: "Nov – Dec 2026",
    status: "upcoming",
    events: [
      { date: "28 Nov", title: "First Online TV Award Show", detail: "Certificate of Recognition finalists" },
      { date: "6 Dec", title: "Second Online TV Award Show", detail: "Africa Education Icon finalists" },
    ],
  },
  {
    phaseName: "Online Recognition Programme",
    window: "Sunday 13 December 2026 · Online",
    status: "upcoming",
    spotlight: true,
    events: [
      { date: "13 Dec", title: "NESA-Africa 2026 Online Recognition Programme", detail: "Approximately 20–30 invited live participants; up to nine Africa Education Icons" },
    ],
  },
  {
    phaseName: "Certificate Window",
    window: "14 – 30 Dec 2026",
    status: "upcoming",
    events: [
      { date: "14 – 30 Dec", title: "Certificate & digital badge downloads", detail: "1-year validity from download" },
    ],
  },
];

export default function AboutCycle2026() {
  return (
    <>
      <AboutSeo
        title="About NESA-Africa 2026 · Inaugural Public Award Cycle"
        description="NESA-Africa 2026 is a focused evidence-led recognition and documentation programme culminating in an online programme on 13 December 2026."
        path="/about/nesa-africa-2026"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "NESA-Africa 2026", path: "/about/nesa-africa-2026" },
        ]}
        faqs={[
          { question: "When do NESA-Africa 2026 nominations open?", answer: "Public nominations are open 9 November 2026 – 31 March 2027." },
          { question: "When is the NESA-Africa 2026 Online Recognition Programme?", answer: "The online programme takes place on Sunday, 13 December 2026 with approximately 20–30 invited live participants and up to nine Africa Education Icons." },
          { question: "Is there any public voting in the 2026 cycle?", answer: "No. There is no public voting mechanism at any stage of the 2026 cycle. Recognition is determined exclusively through Nominee Research and Review Corps verification, the EDI Matrix, and — for the Icon Award only — independent judging and Governance ratification." },
        ]}
      />

      <AboutSealHero
        eyebrow="Inaugural Public Cycle"
        title={<>About <span className="text-gold">NESA-Africa 2026</span></>}
        positioning="NESA-Africa 2026 is a focused evidence-led recognition and documentation programme culminating in an online programme on 13 December 2026."
        cyclePhase="Four recognition tiers · 22 main awards · 90 subcategories · Nine Icon NRRC members · Nine independent Icon judges · No public or AGC voting"
        primaryCta={{ label: "Submit a Nomination", href: "/nominate", icon: "nominate" }}
        secondaryCta={{ label: "Non-Influence Declaration", href: "#non-influence-protocol" }}
      />

      <AboutStatStrip stats={STATS_2026} title="The 2026 Cycle in Numbers" />

      <AboutRecognitionTiers
        tiers={CANONICAL_TIERS}
        footerCta={{ label: "Explore the Four Tiers", href: "/recognition" }}
      />

      <AboutProcessPipeline
        stages={CANONICAL_PIPELINE}
        note="No submission automatically becomes a finalist, winner, or honouree. Every entry is evidence-reviewed, verified, and governance-ratified before recognition."
      />

      <AboutCycleTimeline
        title="NESA-Africa 2026 Timeline"
        subtitle="The timeline may change where necessary to protect integrity, safeguarding, security or technical readiness."
        phases={PHASES_2026}
        footerCta={{ label: "View full cycle calendar", href: "/events/calendar" }}
      />

      <AboutCanonicalContent />

      <AboutGovernanceProtocol downloadHref="/governance" />

      <AboutContactBlock
        headline="Engage with the 2026 Cycle"
        intro="The central 2026 focus is the recognition of up to nine Africa Education Icons across three Icon categories and three participation pathways. Other tiers follow their approved research, evidence and governance processes; their certificates are not automatically competitive awards."
        primaryCta={{ label: "Submit a Nomination", href: "/nominate" }}
        secondaryCta={{ label: "Receive Programme Updates", href: "/contact" }}
      />
    </>
  );
}
