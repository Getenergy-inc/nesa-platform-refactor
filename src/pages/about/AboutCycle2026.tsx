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

const STATS_2026 = [
  { value: "9", label: "Icon Laureates", sub: "1 per pathway-classification group" },
  { value: "27", label: "Grand Jury Finalists", sub: "3 per group across 9 panels" },
  { value: "18", label: "Recognition Forms", sub: "22 category pages" },
  { value: "4", label: "Recognition Tiers", sub: "1 flagship · 3 certificate" },
  { value: "20", label: "Year Window", sub: "2006 → 2026 (Icon)" },
  { value: "15", label: "Regions", sub: "8 Africa + 7 Global" },
];

const PHASES_2026: TimelinePhase[] = [
  {
    phaseName: "Pre-Nomination",
    window: "15 Jan – 29 Aug 2026",
    status: "active",
    events: [
      { date: "15 Jan – 29 Aug", title: "NRC Data Entry", detail: "~2,700 pre-nominees populated; each requires acceptance" },
      { date: "15 Aug", title: "All four NRC teams activate" },
      { date: "20 Aug", title: "EduAid-Africa Webinar Series begins" },
    ],
  },
  {
    phaseName: "Nominations Open",
    window: "30 Aug – 20 Nov 2026",
    status: "upcoming",
    spotlight: true,
    events: [
      { date: "30 Aug", title: "Public Nominations Open — all four tiers" },
      { date: "30 Aug – 5 Sep", title: "Africa Education Icon window", detail: "Independent, shorter closing date" },
    ],
  },
  {
    phaseName: "NRC Verification",
    window: "30 Aug – 20 Dec 2026",
    status: "upcoming",
    events: [
      { date: "By 10 Sep", title: "Icon NRC verification complete" },
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
    phaseName: "Recognition Gala",
    window: "14 December 2026 · Lagos",
    status: "upcoming",
    spotlight: true,
    events: [
      { date: "14 Dec", title: "NESA-Africa 2026 Recognition Gala", detail: "9 Icon Laureates announced; Certificates presented" },
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
        description="NESA-Africa 2026 — the inaugural public award cycle: 18 recognition forms across 4 tiers and 15 regions (8 Africa + 7 Global), culminating in the 14 December 2026 Recognition Gala in Lagos."
        path="/about/nesa-africa-2026"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "NESA-Africa 2026", path: "/about/nesa-africa-2026" },
        ]}
        faqs={[
          { question: "When do NESA-Africa 2026 nominations open?", answer: "Public nominations open 30 August 2026 across all four tiers. The Africa Education Icon Award nomination window runs 30 August – 5 September 2026." },
          { question: "When is the NESA-Africa 2026 Recognition Gala?", answer: "The Recognition Gala takes place on 14 December 2026 in Lagos, Nigeria, where the 9 Icon Laureates are announced and all Certificates of Recognition are formally presented." },
          { question: "Is there any public voting in the 2026 cycle?", answer: "No. There is no public voting mechanism at any stage of the 2026 cycle. Recognition is determined exclusively through Nominee Research Corps verification, the EDI Matrix, and — for the Icon Award only — independent judging and Governance ratification." },
        ]}
      />

      <AboutSealHero
        eyebrow="Inaugural Public Cycle"
        title={<>About <span className="text-gold">NESA-Africa 2026</span></>}
        positioning="The platform's first public award cycle since incorporation — 18 recognition forms across four tiers, verified end-to-end, culminating in the Recognition Gala in Lagos on 14 December 2026."
        cyclePhase="Cycle Status · Pre-Nomination · Nominations open 30 August 2026"
        primaryCta={{ label: "Nominate Now", href: "/nominate", icon: "nominate" }}
        secondaryCta={{ label: "Non-Influence Declaration", href: "#non-influence-protocol" }}
      />

      <AboutStatStrip stats={STATS_2026} title="The 2026 Cycle in Numbers" />

      <AboutRecognitionTiers
        tiers={CANONICAL_TIERS}
        footerCta={{ label: "See all 18 recognition forms", href: "/nominate" }}
      />

      <AboutProcessPipeline
        stages={CANONICAL_PIPELINE}
        note="No submission automatically becomes a finalist, winner, or honouree. Every entry is evidence-reviewed, verified, and governance-ratified before recognition."
      />

      <AboutCycleTimeline
        title="The Road to the 14 December 2026 Gala"
        subtitle="Phase-based awards-season roadmap with confirmed dates from the 2026 cycle calendar."
        phases={PHASES_2026}
        footerCta={{ label: "View full cycle calendar", href: "/calendar" }}
      />

      <AboutGovernanceProtocol downloadHref="/governance" />

      <AboutContactBlock
        headline="Engage with the 2026 Cycle"
        intro="Nominate a changemaker, apply as a judge or NRC member, become a chapter volunteer, or attend the 14 December 2026 Gala."
        primaryCta={{ label: "Nominate Now", href: "/nominate" }}
        secondaryCta={{ label: "Contact the Cycle Desk", href: "mailto:info@nesa.africa" }}
      />
    </>
  );
}
