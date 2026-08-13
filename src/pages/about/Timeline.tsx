// /timeline — NESA-Africa 2026 Recognition Journey.
//
// Content source: "NESA-Africa 2026 — CORRECTED Complete Timeline Set", held in
// `@/data/masterTimeline2026` (chronological milestones) and
// `@/data/eduaidWebinarSeries2026` (the 7 webinar weeks).
//
// Date literals are never typed here:
//  • Nomination windows → @/config/nominationWindows2026
//  • Gala               → @/config/programme
//
// The source document's internal editorial/production checklist section is
// deliberately NOT rendered on this public page.

import { Link } from "react-router-dom";
import { AboutSeo } from "@/pages/about/AboutSeo";
import { useCountdown } from "@/hooks/useCountdown";
import { useTimelineStatus, formatCount } from "@/hooks/useTimelineStatus";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ICON_GOVERNANCE_STATEMENT } from "@/config/brandHierarchy";
import {
  MASTER_TIMELINE_CHRONOLOGICAL,
  MASTER_TIMELINE_NOMINATION_WINDOWS,
  MASTER_TIMELINE_TRACK_LABELS,
  type MasterTimelineEntry,
  type MasterTimelineTrack,
} from "@/data/masterTimeline2026";
import { EDUAID_WEBINAR_SERIES_2026 } from "@/data/eduaidWebinarSeries2026";
import { PROGRAMME_END_LABEL, GALA_COUNTDOWN_TARGET } from "@/config/programme";
import {
  NOMINATIONS_OPEN_LABEL,
  NOMINATIONS_OPEN_ISO,
  ICON_WINDOW_LABEL,
  CERTIFICATE_WINDOW_LABEL,
} from "@/config/nominationWindows2026";
import "@/features/landing/editorial/editorial.css";

type Tone = "gold" | "stone" | "sapphire";

/** Static class map — Tailwind cannot extract dynamically composed class names. */
const TONE_CLASS: Record<Tone, string> = {
  gold: "text-[#e8c468] border-[#c9a227]/45 bg-[#c9a227]/10",
  stone: "text-[#b0afa8] border-white/15 bg-white/[0.04]",
  sapphire: "text-[#9db9e8] border-[#1b3a6b]/60 bg-[#1b3a6b]/25",
};

/** Static per-track chip classes — no template-literal class construction. */
const TRACK_CHIP: Record<MasterTimelineTrack, string> = {
  activation: "border-[#c9a227]/35 bg-[#c9a227]/10 text-[#e8c468]",
  nominations: "border-[#c9a227]/45 bg-[#c9a227]/15 text-[#e8c468]",
  verification: "border-[#2e6b63]/60 bg-[#2e6b63]/20 text-[#8fd3c7]",
  webinar: "border-[#2f6b45]/60 bg-[#2f6b45]/20 text-[#9fd6b4]",
  podcast: "border-[#4b3a70]/60 bg-[#4b3a70]/25 text-[#c3b0e8]",
  judging: "border-white/15 bg-white/[0.05] text-[#cfcdc5]",
  showcase: "border-[#1b3a6b]/60 bg-[#1b3a6b]/25 text-[#9db9e8]",
  gala: "border-[#c9a227]/55 bg-[#c9a227]/20 text-[#f0d78d]",
  news: "border-[#1f4d63]/60 bg-[#1f4d63]/25 text-[#9ecbdd]",
  legacy: "border-[#4a5f22]/60 bg-[#4a5f22]/25 text-[#c6d98a]",
};

const MONTH_LABEL = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

/** Maps `webinar-N` chronological entries to their episode narrative. */
const WEBINAR_BY_TIMELINE_ID = Object.fromEntries(
  EDUAID_WEBINAR_SERIES_2026.map((ep) => [`webinar-${ep.episode}`, ep]),
) as Record<string, (typeof EDUAID_WEBINAR_SERIES_2026)[number] | undefined>;

/** Group the chronological milestones by month for a scannable reading rhythm. */
function groupByMonth(entries: MasterTimelineEntry[]) {
  const groups: { key: string; label: string; items: MasterTimelineEntry[] }[] = [];
  for (const entry of entries) {
    const key = entry.startsAt.slice(0, 7);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(entry);
    else groups.push({ key, label: MONTH_LABEL(entry.startsAt), items: [entry] });
  }
  return groups;
}

export default function Timeline() {
  const status = useTimelineStatus();
  const countdown = useCountdown(GALA_COUNTDOWN_TARGET);

  const nrcActive = (status.nrcQueued ?? 0) + (status.nrcVerified ?? 0) > 0;
  const judgesActive = (status.judgeAssignments ?? 0) > 0 && (status.activeJudges ?? 0) > 0;
  const nominationsOpen = Date.now() >= new Date(`${NOMINATIONS_OPEN_ISO}T00:00:00Z`).getTime();

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
      body: `Education Enablers are nominated by the public from ${NOMINATIONS_OPEN_LABEL} across every NESA-Africa recognition pathway.`,
      statusLabel: nominationsOpen ? "Open" : `Opens ${NOMINATIONS_OPEN_LABEL}`,
      tone: nominationsOpen ? "gold" : "stone",
      metric: status.loading ? "…" : formatCount(status.nominationsTotal),
      metricLabel: "nominations received",
    },
    {
      step: "02",
      title: "NRC Verification",
      body: "The Nominee Research Corps verifies eligibility, identity and supporting evidence for every nomination before it proceeds.",
      statusLabel: nrcActive ? "In progress" : "Begins once nominations open",
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

  const months = groupByMonth(MASTER_TIMELINE_CHRONOLOGICAL);

  return (
    <div className="nesa-ed min-h-screen">
      <AboutSeo
        title="NESA-Africa 2026 Recognition Journey | Full Timeline"
        description={`Every dated milestone in the NESA-Africa 2026 cycle — nominations from ${NOMINATIONS_OPEN_LABEL}, NRC verification, Icon judging, the EduAid-Africa webinar weeks, TV showcases and the Recognition Gala in Lagos on ${PROGRAMME_END_LABEL}.`}
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
            The NESA-Africa 2026 Recognition Journey
          </h1>
          <p className="mt-4 text-lg text-[#e8c468]">
            From public activation in July 2026 to the Recognition Gala in Lagos on{" "}
            {PROGRAMME_END_LABEL}.
          </p>
          <p className="mt-4 text-[#b0afa8]">
            One continuous cycle — nomination, verification, judging, broadcast and the
            year-long Impact &amp; Legacy phase that follows.
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

          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            aria-busy={status.loading || undefined}
          >
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

      {/* SECTION 2 — nomination windows at a glance */}
      <section className="ed-section" aria-labelledby="tl-windows">
        <div className="ed-wrap">
          <div className="ed-section-head">
            <div className="ed-eyebrow">Key dates</div>
            <h2 id="tl-windows" className="ed-section-title">
              Nomination Windows
            </h2>
            <p className="mt-3 text-sm text-[#b0afa8]">
              All pathways open {NOMINATIONS_OPEN_LABEL}. The Africa Education Icon Award
              closes first ({ICON_WINDOW_LABEL}) so judging can complete; the certificate
              pathways stay open to {CERTIFICATE_WINDOW_LABEL.split("– ")[1]}.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {MASTER_TIMELINE_NOMINATION_WINDOWS.map((w) => (
              <Link
                key={w.id}
                to={w.href}
                className="rounded-2xl border border-[#c9a227]/20 bg-white/[0.03] p-6 transition hover:border-[#c9a227]/50"
              >
                <h3 className="font-serif text-lg text-[#f3efe6]">{w.tier}</h3>
                <div className="ed-mono mt-2 text-xs uppercase tracking-[0.12em] text-[#e8c468]">
                  {w.window}
                </div>
                <p className="mt-3 text-sm text-[#b0afa8]">{w.verification}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — the full chronological schedule */}
      <section className="ed-section ed-section-ink" aria-labelledby="tl-schedule">
        <div className="ed-wrap">
          <div className="ed-section-head">
            <div className="ed-eyebrow">Every milestone, in order</div>
            <h2 id="tl-schedule" className="ed-section-title">
              The Full 2026 Schedule
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-12">
            {months.map((group) => (
              <div key={group.key}>
                <h3 className="ed-mono text-xs uppercase tracking-[0.2em] text-[#6b6a63]">
                  {group.label}
                </h3>
                <ol className="mt-4 border-l border-[#c9a227]/25 pl-6">
                  {group.items.map((e) => (
                    <li key={e.id} className="relative pb-8 last:pb-0">
                      <span
                        aria-hidden
                        className={`absolute -left-[31px] top-2 h-2.5 w-2.5 rounded-full ${
                          e.highlight ? "bg-[#e8c468]" : "bg-[#c9a227]/50"
                        }`}
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="ed-mono text-xs uppercase tracking-[0.12em] text-[#e8c468]">
                          {e.dateLabel}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${TRACK_CHIP[e.track]}`}
                        >
                          {MASTER_TIMELINE_TRACK_LABELS[e.track]}
                        </span>
                        {e.toBeConfirmed && (
                          <span className="rounded-full border border-white/15 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-[#b0afa8]">
                            To be confirmed
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2 font-serif text-lg text-[#f3efe6]">
                        {e.href ? (
                          <Link to={e.href} className="hover:text-[#e8c468]">
                            {e.milestone}
                          </Link>
                        ) : (
                          e.milestone
                        )}
                      </h4>
                      <p className="mt-1 text-sm text-[#b0afa8]">{e.activity}</p>
                      <p className="ed-mono mt-2 text-[11px] uppercase tracking-[0.12em] text-[#6b6a63]">
                        {e.outcome}
                      </p>
                      {e.details && e.details.length > 0 && (
                        <details className="mt-3 rounded-lg border border-[#1b3a6b]/50 bg-[#1b3a6b]/[0.18]">
                          <summary className="cursor-pointer list-none px-4 py-2.5 text-xs font-semibold text-[#9db9e8]">
                            {DETAILS_SUMMARY_LABEL[e.track] ?? "More detail"}
                          </summary>
                          <ul className="space-y-2 px-4 pb-4">
                            {e.details.map((d) => (
                              <li key={d} className="text-sm text-[#cfcdc5]">
                                {d}
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                      {WEBINAR_BY_TIMELINE_ID[e.id] && (
                        <details className="mt-3 rounded-lg border border-[#c9a227]/25 bg-[#c9a227]/[0.05]">
                          <summary className="cursor-pointer list-none px-4 py-2.5 text-xs font-semibold text-[#e8c468]">
                            See the full webinar narrative
                          </summary>
                          <div className="px-4 pb-4">
                            <p className="text-sm italic text-[#cfcdc5]">
                              {WEBINAR_BY_TIMELINE_ID[e.id].subtitle}
                            </p>
                            <div className="ed-mono mt-3 text-[11px] uppercase tracking-[0.14em] text-[#6b6a63]">
                              Promotes
                            </div>
                            <ul className="mt-2 flex flex-wrap gap-2">
                              {WEBINAR_BY_TIMELINE_ID[e.id].promotes.map((p) => (
                                <li
                                  key={p}
                                  className="rounded-full border border-[#c9a227]/25 bg-[#c9a227]/[0.08] px-3 py-1 text-xs text-[#e8c468]"
                                >
                                  {p}
                                </li>
                              ))}
                            </ul>
                            <p className="mt-3 text-xs text-[#8a8981]">
                              {WEBINAR_BY_TIMELINE_ID[e.id].tiers} ·{" "}
                              {WEBINAR_BY_TIMELINE_ID[e.id].competitiveLabel}
                            </p>
                          </div>
                        </details>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — EduAid-Africa webinar weeks */}
      <section className="ed-section" aria-labelledby="tl-webinars">
        <div className="ed-wrap">
          <div className="ed-section-head">
            <div className="ed-eyebrow">EduAid-Africa Webinar Series</div>
            <h2 id="tl-webinars" className="ed-section-title">
              The Seven Webinar Weeks
            </h2>
            <p className="mt-3 text-sm text-[#b0afa8]">
              Bi-weekly Thursdays, 27 August – 19 November 2026. Open each week for the full
              theme and the recognition pathways it promotes.
            </p>
          </div>

          <Accordion type="single" collapsible className="mx-auto max-w-3xl">
            {EDUAID_WEBINAR_SERIES_2026.map((ep) => (
              <AccordionItem
                key={ep.id}
                value={ep.id}
                className="border-b border-[#c9a227]/20"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="flex flex-col gap-1 pr-4">
                    <span className="ed-mono text-xs uppercase tracking-[0.12em] text-[#e8c468]">
                      Week {ep.episode} · {ep.dateLabel}
                      {ep.pilot ? " · pilot" : ""}
                    </span>
                    <span className="font-serif text-lg text-[#f3efe6]">{ep.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-[#cfcdc5]">{ep.subtitle}</p>
                  <div className="ed-mono mt-4 text-[11px] uppercase tracking-[0.14em] text-[#6b6a63]">
                    Promotes
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {ep.promotes.map((p) => (
                      <li
                        key={p}
                        className="rounded-full border border-[#c9a227]/25 bg-[#c9a227]/[0.08] px-3 py-1 text-xs text-[#e8c468]"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-[#8a8981]">
                    {ep.tiers} · {ep.competitiveLabel}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* SECTION 5 — governance */}
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

      {/* SECTION 6 — close */}
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
