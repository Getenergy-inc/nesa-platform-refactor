// About NESA-Africa 2028–2030 — governance-evolution outlook.
// Timeline is NOT a single-cycle calendar; it is a 3-year phased
// rollout diagram showing when and how public engagement enters
// the Gold-Blue Garnet tier only, with Icon and Platinum staying
// verification-only indefinitely.
import { AboutSeo } from "@/pages/about/AboutSeo";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Vote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AboutSealHero,
  AboutStatStrip,
  AboutRecognitionTiers,
  AboutGovernanceProtocol,
  AboutContactBlock,
  CANONICAL_TIERS,
} from "@/pages/about/AboutSharedBlocks";
import { AboutCanonicalContent } from "@/pages/about/AboutCanonicalContent";

const STATS_2028 = [
  { value: "3", label: "Cycle Window", sub: "2028 · 2029 · 2030" },
  { value: "1 of 4", label: "Tier with Capped Public Input", sub: "Gold-Blue Garnet only" },
  { value: "0", label: "Paid Voting", sub: "No monetary influence, ever" },
  { value: "∞", label: "Icon & Platinum Verification", sub: "No public voting, indefinitely" },
];

interface EvolutionYear {
  year: string;
  posture: string;
  icon: typeof Lock;
  status: "locked" | "transition" | "review";
  points: string[];
}

const EVOLUTION: EvolutionYear[] = [
  {
    year: "2026 · 2027",
    posture: "Verification Foundation",
    icon: ShieldCheck,
    status: "locked",
    points: [
      "All four tiers verification-only.",
      "NRC + EDI Matrix + Judges (Icon only) + Governance ratification.",
      "Zero public voting; zero monetary influence.",
    ],
  },
  {
    year: "2028",
    posture: "Capped Public Engagement Introduced",
    icon: Vote,
    status: "transition",
    points: [
      "Gold-Blue Garnet Regional Certificates only.",
      "Capped, non-monetary public input as one signal alongside NRC & EDI.",
      "Per-person and per-session caps enforced at platform level.",
      "Governance retains final ratification authority.",
    ],
  },
  {
    year: "2029",
    posture: "Independent Review",
    icon: ShieldCheck,
    status: "review",
    points: [
      "Independent review of the 2028 public engagement mechanic.",
      "Adjustments published before nominations open.",
      "Icon & Platinum unchanged.",
    ],
  },
  {
    year: "2030",
    posture: "Vision 2035 Alignment Checkpoint",
    icon: Lock,
    status: "review",
    points: [
      "Third full cycle under the phased model.",
      "SCEF Vision 2035 alignment checkpoint.",
      "Icon & Platinum tiers remain verification-only indefinitely.",
    ],
  },
];

const STATUS_STYLES = {
  locked: "border-gold/40 bg-gold/5",
  transition: "border-gold/60 bg-gold/10 ring-1 ring-gold/40",
  review: "border-ivory/25 bg-charcoal-light/25",
} as const;

function GovernanceEvolutionDiagram() {
  return (
    <section aria-label="Governance evolution 2026-2030" className="bg-charcoal py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 space-y-2">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gold/70">Governance Evolution · Not a Nomination Calendar</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory">The 2026–2030 Phased Rollout</h2>
          <p className="text-ivory/70 text-sm md:text-base max-w-3xl mx-auto">
            The 2028–2030 window is a disclosed, multi-year governance evolution — announced years in
            advance so no participant, sponsor, or nominee is ever surprised by a change in how
            recognition works.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {EVOLUTION.map((e) => {
            const Icon = e.icon;
            return (
              <li key={e.year} className={`rounded-xl border p-5 ${STATUS_STYLES[e.status]}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gold" />
                  </span>
                  {e.status === "transition" && <Badge className="bg-gold text-charcoal">Transition</Badge>}
                  {e.status === "locked" && <Badge variant="outline" className="border-gold/40 text-gold">Verification</Badge>}
                  {e.status === "review" && <Badge variant="outline" className="border-ivory/30 text-ivory/70">Review</Badge>}
                </div>
                <p className="font-display text-lg font-bold text-gold">{e.year}</p>
                <p className="text-ivory font-semibold text-sm mt-1">{e.posture}</p>
                <ul className="text-ivory/70 text-xs mt-3 space-y-1.5 list-disc pl-4">
                  {e.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </li>
            );
          })}
        </ol>
        <div className="mt-10 rounded-xl border border-gold/25 bg-charcoal-light/25 p-6 max-w-4xl mx-auto">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gold/70 mb-2">Tier-by-Tier Posture · Across 2028–2030</p>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-ivory/85">
            <li className="flex gap-2"><Lock className="w-4 h-4 text-gold shrink-0 mt-0.5" /><span><strong className="text-gold">Africa Education Icon Award</strong> — verification-only, indefinitely.</span></li>
            <li className="flex gap-2"><Lock className="w-4 h-4 text-gold shrink-0 mt-0.5" /><span><strong className="text-gold">Platinum Certificates</strong> — verification-only, indefinitely.</span></li>
            <li className="flex gap-2"><ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" /><span><strong className="text-gold">Influencer Education Impact</strong> — verification-based; any future change disclosed with equal lead time.</span></li>
            <li className="flex gap-2"><Vote className="w-4 h-4 text-gold shrink-0 mt-0.5" /><span><strong className="text-gold">Gold-Blue Garnet</strong> — capped public engagement from 2028; Governance retains ratification.</span></li>
          </ul>
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full">
            <Link to="/about#vision-2035">Read the SCEF Vision 2035 roadmap</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function AboutCycle2028_2030() {
  return (
    <>
      <AboutSeo
        title="About NESA-Africa 2028–2030 · Governance Evolution Outlook"
        description="NESA-Africa 2028–2030 outlook — a disclosed, phased governance evolution. Capped public engagement introduced on the Gold-Blue Garnet tier only; Icon and Platinum remain verification-based indefinitely."
        path="/about/nesa-africa-2028-2030"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "NESA-Africa 2028–2030", path: "/about/nesa-africa-2028-2030" },
        ]}
        faqs={[
          { question: "Will public voting influence the Africa Education Icon Award from 2028?", answer: "No. The Africa Education Icon Award and Platinum Certificates of Recognition remain fully verification-based indefinitely, with no public voting at any point." },
          { question: "What changes on the Gold-Blue Garnet tier from 2028?", answer: "From the 2028 cycle, the Gold-Blue Garnet tier alone introduces a capped, non-monetary public engagement element — disclosed here in advance, years ahead of implementation." },
        ]}
      />

      <AboutSealHero
        eyebrow="Medium-Term Outlook · Governance Disclosure"
        title={<>About <span className="text-gold">NESA-Africa 2028–2030</span></>}
        positioning="A disclosed, phased evolution — announced years in advance so no participant, sponsor, or nominee is ever surprised by a change in how recognition works."
        cyclePhase="Disclosure Status · Published in advance of the 2028 cycle"
        primaryCta={{ label: "Read the 2028 Governance Disclosure", href: "#non-influence-protocol", icon: "read" }}
        secondaryCta={{ label: "Non-Influence Declaration", href: "#non-influence-protocol" }}
      />

      <AboutStatStrip stats={STATS_2028} title="The 2028–2030 Posture in Numbers" />

      <AboutRecognitionTiers
        tiers={CANONICAL_TIERS}
        footerCta={{ label: "See all 18 recognition forms", href: "/nominate" }}
      />

      <GovernanceEvolutionDiagram />

      <AboutCanonicalContent />

      <AboutGovernanceProtocol downloadHref="/governance" />

      <AboutContactBlock
        headline="Track the 2028–2030 Evolution"
        intro="Register for governance disclosures, methodology publications, and cap/anti-manipulation notes as they release."
        primaryCta={{ label: "Read the Governance Disclosure", href: "/governance" }}
        secondaryCta={{ label: "Compare with 2026 cycle", href: "/about/nesa-africa-2026" }}
      />
    </>
  );
}
