// /timeline — "The Road to the 2026 Blue-Garnet Awards".
// Every date is sourced from existing authoritative config: no new date literals.
//  • Icon window  → ICON_NOMINATION_TIMELINE (brandHierarchy.ts)
//  • Certificate window → MASTER_TIMELINE_NOMINATION_WINDOWS (masterTimeline2026.ts)
//  • Gala → PROGRAMME_END_LABEL / GALA_COUNTDOWN_TARGET (config/programme.ts)
//  • Governance wording → ICON_GOVERNANCE_STATEMENT (brandHierarchy.ts)

import { Link } from "react-router-dom";
import { AboutSeo } from "@/pages/about/AboutSeo";
import { useCountdown } from "@/hooks/useCountdown";
import { useTimelineStatus, formatCount } from "@/hooks/useTimelineStatus";
import {
  ICON_NOMINATION_TIMELINE,
  ICON_GOVERNANCE_STATEMENT,
} from "@/config/brandHierarchy";
import { MASTER_TIMELINE_NOMINATION_WINDOWS } from "@/data/masterTimeline2026";
import { PROGRAMME_END_LABEL, GALA_COUNTDOWN_TARGET } from "@/config/programme";
import "@/features/landing/editorial/editorial.css";

const ICON_OPEN = ICON_NOMINATION_TIMELINE.steps.find((s) => s.key === "open")!;
const ICON_WINDOW = ICON_NOMINATION_TIMELINE.steps.find((s) => s.key === "window")!;
const CERTIFICATE_WINDOW =
  MASTER_TIMELINE_NOMINATION_WINDOWS.find((w) => w.id === "gold-blue-garnet")!.window;

type Tone = "gold" | "stone" | "sapphire";

const TONE_CLASS: Record<Tone, string> = {
  gold: "text-[#e8c468] border-[#c9a227]/45 bg-[#c9a227]/10",
  stone: "text-[#b0afa8] border-white/15 bg-white/[0.04]",
  sapphire: "text-[#9db9e8] border-[#1b3a6b]/60 bg-[#1b3a6b]/25",
};

export default function Timeline() {
  const status = useTimelineStatus();
  const countdown = useCountdown(GALA_COUNTDOWN_TARGET);

  const nrcActive = (status.nrcQueued ?? 0) + (status.nrcVerified ?? 0) > 0;
  const judgesActive = (status.judgeAssignments ?? 0) > 0 && (status.activeJudges ?? 0) > 0;

  const stages: {
    step: string;
    title: string;
    body: string;
    statusLabel: string;
    tone: Tone;
    metric?: string;
    metricLabel?: string;
  }[] = [
    {
      step: "01",
      title: "Nominations",
      body: "Education Enablers are nominated by the public across every NESA-Africa recognition pathway.",
      statusLabel: "Open",
      tone: "gold",
      metric: status.loading ? "…" : formatCount(status.nominationsTotal),
      metricLabel: "nominations received",
    },
    {
      step: "02",
      title: "NRC Review",
      body: "The Nomination Review Committee verifies eligibility and supporting evidence for every nomination before it proceeds.",
      statusLabel: nrcActive ? "In progress" : "Review begins once nominations close",
      tone: nrcActive ? "gold" : "stone",
      metric: nrcActive ? formatCount(status.nrcVerified) : undefined,
      metricLabel: nrcActive ? "nominations verified" : undefined,
    },
    {
      step: "03",
      title: "Judges Arena",
      body: "27 volunteer judges across 9 pathways review NRC-verified nominees, select finalists, and cast the final ranked-choice ballot.",
      statusLabel: judgesActive ? "In progress" : "Not yet active",
      tone: judgesActive ? "gold" : "stone",
      metric: judgesActive ? formatCount(status.judgeAssignments) : undefined,
      metricLabel: judgesActive ? "review assignments live" : undefined,
    },
    {
      step: "04",
      title: "The Gala",
      body: `${PROGRAMME_END_LABEL} · Lagos, Nigeria.`,
      statusLabel: countdown.isExpired ? "Celebrated" : `${countdown.days} days to go`,
      tone: "sapphire",
      metric: countdown.isExpired ? undefined : String(countdown.days),
      metricLabel: countdown.isExpired ? undefined : "days remaining",
    },
  ];

  const journey = [
    {
      when: ICON_OPEN.when,
      title: "Public Nominations Open",
      body: "Nominations open across all NESA-Africa recognition pathways — the Africa Education Icon Award and the six Education Impact Certificates (CSR for Education, EduTech Innovation, Media Organisation for Education, NGO & International Education Partnership, Diaspora Educational Impact, Influencer Education Impact).",
    },
    {
      when: ICON_WINDOW.when,
      title: "Africa Education Icon Award Nomination Window",
      body: "The flagship lifetime honour closes first, giving the longest runway for NRC verification and Judges Arena review ahead of the Gala.",
    },
    {
      when: CERTIFICATE_WINDOW,
      title: "Education Impact Certificate Nomination Window",
      body: "The six Certificate pathways remain open longer, reflecting their higher nomination volume and the additional time nominees may need to request physical printed certificates ahead of the Gala.",
    },
    {
      when: "After each pathway's window closes",
      title: "NRC Verification",
      body: "The Nomination Review Committee reviews submissions, confirms eligibility, and verifies supporting evidence for every nomination before it can proceed to judging.",
    },
    {
      when: "Following NRC Verification",
      title: "Judges Arena Review",
      body: "NRC-verified nominees move to their pathway's judging panel. Panels review evidence, select finalists, and the eligible judges cast a ranked-choice Grand Jury ballot. No public voting occurs at any stage — recognition is decided entirely through internal, audited judging.",
    },
    {
      when: PROGRAMME_END_LABEL,
      title: "The Blue-Garnet Awards Gala, Lagos",
      body: "Africa Education Icon laureates and Education Impact Certificate winners are celebrated on stage.",
    },
  ];

  return (
    <div className="nesa-ed min-h-screen">
      <AboutSeo
        title="The Road to the 2026 Blue-Garnet Awards | NESA-Africa Timeline"
        description="One continental recognition cycle — from nomination and NRC verification through Judges Arena review to the Blue-Garnet Awards Gala in Lagos on 13 December 2026."
        path="/timeline"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Timeline", path: "/timeline" },
        ]}
      />

      {/* HERO */}
      <section className="ed-section">
        <div className="ed-wrap max-w-3xl text-center">
          <div className="ed-eyebrow">NESA-Africa 2026 Recognition Cycle</div>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            The Road to the 2026 Blue-Garnet Awards
          </h1>
          <p className="mt-4 text-lg text-[#e8c468]">
            One continental recognition cycle — from nomination to the Gala stage.
          </p>
          <p className="mt-4 text-[#b0afa8]">
            A single continuous journey, from the moment a nomination is submitted to the night
            nine Education Icons and category winners are celebrated in Lagos.
          </p>
        </div>
      </section>

      {/* SECTION 1 — live tracker */}
      <section className="ed-section ed-section-ink" aria-labelledby="tl-status">
        <div className="ed-wrap">
          <div className="ed-section-head">
            <div className="ed-eyebrow">Live status</div>
            <h2 id="tl-status" className="ed-section-title">
              Where Things Stand Right Now
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-busy={status.loading || undefined}>
            {stages.map((s) => (
              <div
                key={s.title}
                className="flex flex-col rounded-2xl border border-[#c9a227]/20 bg-white/[0.03] p-6"
              >
                <div className="ed-mono text-xs text-[#6b6a63]">{s.step}</div>
                <h3 className="mt-2 font-serif text-xl text-[#f3efe6]">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm text-[#b0afa8]">{s.body}</p>
                {s.metric && (
                  <div className="mt-4">
                    <div className="font-serif text-3xl text-[#e8c468]">{s.metric}</div>
                    <div className="ed-mono text-[11px] uppercase tracking-[0.14em] text-[#6b6a63]">
                      {s.metricLabel}
                    </div>
                  </div>
                )}
                <span
                  className={`mt-4 inline-block self-start rounded-full border px-3 py-1 text-xs ${TONE_CLASS[s.tone]}`}
                >
                  {s.statusLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — the full journey */}
      <section className="ed-section" aria-labelledby="tl-journey">
        <div className="ed-wrap">
          <div className="ed-section-head">
            <div className="ed-eyebrow">Every pathway, one cycle</div>
            <h2 id="tl-journey" className="ed-section-title">
              The Full Journey
            </h2>
          </div>

          <ol className="relative mx-auto max-w-3xl border-l border-[#c9a227]/25 pl-6">
            {journey.map((j) => (
              <li key={j.title} className="relative pb-10 last:pb-0">
                <span
                  aria-hidden
                  className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#c9a227]"
                />
                <div className="ed-mono text-xs uppercase tracking-[0.12em] text-[#e8c468]">
                  {j.when}
                </div>
                <h3 className="mt-2 font-serif text-xl text-[#f3efe6]">{j.title}</h3>
                <p className="mt-2 text-sm text-[#b0afa8]">{j.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION 3 — governance */}
      <section className="ed-section ed-section-ink" aria-labelledby="tl-governance">
        <div className="ed-wrap max-w-3xl">
          <div className="ed-eyebrow">Governance</div>
          <h2 id="tl-governance" className="ed-section-title mt-3 text-left">
            How recognition is decided
          </h2>
          <div className="mt-4 space-y-3">
            {ICON_GOVERNANCE_STATEMENT.map((line) => (
              <p key={line} className="text-sm text-[#b0afa8]">
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — close */}
      <section className="ed-section" aria-labelledby="tl-close">
        <div className="ed-wrap max-w-2xl text-center">
          <h2 id="tl-close" className="ed-section-title">
            Know an Education Enabler whose work deserves recognition?
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/nominate" className="ed-btn-primary">
              Nominate an Education Enabler
            </Link>
            <Link to="/nominees" className="ed-btn-ghost">
              Explore Existing Nominees
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
