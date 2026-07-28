// About NESA-Africa 2027 — second public cycle, pre-launch state.
// Same institutional shell as 2026; phases greyed / unconfirmed
// except the known December 2027 Gala month in Lagos.
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

const STATS_2027 = [
  { value: "9", label: "Icon Laureates", sub: "Rolling window 2007 → 2027" },
  { value: "27", label: "Grand Jury Finalists", sub: "Same 9-panel structure" },
  { value: "18", label: "Recognition Forms", sub: "Unchanged framework" },
  { value: "4", label: "Recognition Tiers", sub: "Still verification-only" },
  { value: "15", label: "Regions", sub: "8 Africa + 7 Global" },
  { value: "0", label: "Public Vote Weight", sub: "Verification-only cycle" },
];

const PHASES_2027: TimelinePhase[] = [
  { phaseName: "Pre-Nomination", window: "Dates to be confirmed", status: "unconfirmed", events: [] },
  { phaseName: "Nominations Open", window: "Dates to be confirmed", status: "unconfirmed", events: [] },
  { phaseName: "NRC Verification", window: "Dates to be confirmed", status: "unconfirmed", events: [] },
  { phaseName: "Judges & Grand Jury", window: "Icon Award only · dates to be confirmed", status: "unconfirmed", events: [] },
  { phaseName: "Finalists Revealed", window: "Two TV shows · dates to be confirmed", status: "unconfirmed", events: [] },
  {
    phaseName: "Recognition Gala",
    window: "December 2027 · Lagos",
    status: "upcoming",
    spotlight: true,
    events: [{ date: "December 2027", title: "NESA-Africa 2027 Recognition Gala", detail: "Exact date to be confirmed" }],
  },
  { phaseName: "Certificate Window", window: "Post-gala · dates to be confirmed", status: "unconfirmed", events: [] },
];

export default function AboutCycle2027() {
  return (
    <>
      <AboutSeo
        title="About NESA-Africa 2027 · Second Public Award Cycle"
        description="NESA-Africa 2027 — the second public award cycle. Continues verification-only recognition across all four tiers, culminating in the December 2027 Recognition Gala in Lagos."
        path="/about/nesa-africa-2027"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "NESA-Africa 2027", path: "/about/nesa-africa-2027" },
        ]}
      />

      <AboutSealHero
        eyebrow="Second Public Cycle · Pre-Launch"
        title={<>About <span className="text-gold">NESA-Africa 2027</span></>}
        positioning="The second cycle builds on the 2026 inaugural launch — still fully verification-based across every tier, expanded chapter coverage, deeper EduAid-Africa integration."
        cyclePhase="Cycle Status · Pre-Launch · Full calendar pending 2026 cycle close"
        primaryCta={{ label: "Notify Me When 2027 Opens", href: "/subscribe?cycle=2027", icon: "notify" }}
        secondaryCta={{ label: "Non-Influence Declaration", href: "#non-influence-protocol" }}
      />

      <AboutStatStrip stats={STATS_2027} title="The 2027 Cycle in Numbers · Structural" />

      <AboutRecognitionTiers
        tiers={CANONICAL_TIERS}
        footerCta={{ label: "See all 18 recognition forms", href: "/nominate" }}
      />

      <AboutProcessPipeline
        stages={CANONICAL_PIPELINE}
        note="The 2027 cycle inherits the verified 2026 pipeline in full. No public voting at any tier."
      />

      <AboutCycleTimeline
        title="The Road to the December 2027 Gala"
        subtitle="Same seven-phase structure as 2026. Phases remain unconfirmed until the 2026 cycle closes; the December 2027 Gala month is fixed."
        phases={PHASES_2027}
        footerCta={{ label: "View 2026 cycle for reference", href: "/about/nesa-africa-2026" }}
      />

      <AboutGovernanceProtocol downloadHref="/governance" />

      <AboutContactBlock
        headline="Stay With the 2027 Cycle"
        intro="Register interest to be the first to know when 2027 nominations open. Judge and NRC applications reopen after the 2026 gala."
        primaryCta={{ label: "Notify Me When 2027 Opens", href: "/subscribe?cycle=2027" }}
        secondaryCta={{ label: "Contact the Cycle Desk", href: "mailto:info@nesa.africa" }}
      />
    </>
  );
}
