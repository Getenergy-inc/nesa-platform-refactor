import { CalendarDays, Megaphone, ShieldCheck, Vote, Trophy, Sparkles } from "lucide-react";
import { useSeason } from "@/contexts/SeasonContext";
import type { StageAction } from "@/config/season";

interface TimelineMilestone {
  id: string;
  date: string;
  phase: string;
  description: string;
  icon: typeof CalendarDays;
}

function fmtRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return "Date TBA";
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;
  if (s && e) {
    const sameYear = s.getFullYear() === e.getFullYear();
    const sFmt = s.toLocaleDateString("en-GB", sameYear ? { day: "numeric", month: "short" } : opts);
    const eFmt = e.toLocaleDateString("en-GB", opts);
    return `${sFmt} – ${eFmt}`;
  }
  return (s ?? e)!.toLocaleDateString("en-GB", opts);
}

function fmtDate(iso?: string | null): string {
  if (!iso) return "Date TBA";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function ProjectTimelineSection() {
  const { currentEdition, getStage } = useSeason();

  const stageDates = (action: StageAction) => {
    const s = getStage(action);
    return { opens: s?.opensAt ?? null, closes: s?.closesAt ?? null };
  };

  const nominations = stageDates("nominations");
  const voting = stageDates("public_voting");
  const jury = stageDates("jury_scoring");
  const results = stageDates("results");
  const certs = stageDates("certificates");

  // Fallbacks to edition config when stage_config rows aren't populated
  const nominationsOpen = nominations.opens ?? currentEdition.nominationsOpen;
  const nominationsClose = nominations.closes ?? currentEdition.nominationsClose;
  const votingOpen = voting.opens ?? currentEdition.votingOpen;
  const votingClose = voting.closes ?? currentEdition.votingClose;
  const juryOpen = jury.opens ?? votingClose;
  const juryClose = jury.closes ?? currentEdition.ceremonyDate;
  const ceremony = results.opens ?? currentEdition.ceremonyDate;

  // Derived secondary windows
  const verificationStart = (() => {
    const d = new Date(nominationsOpen);
    d.setDate(d.getDate() + 1);
    return d.toISOString();
  })();
  const legacyStart = (() => {
    const d = new Date(ceremony);
    d.setMonth(d.getMonth() + 1);
    return d.toISOString();
  })();
  const legacyEnd = (() => {
    const d = new Date(ceremony);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString();
  })();

  const MILESTONES: TimelineMilestone[] = [
    {
      id: "launch",
      date: fmtDate(nominationsOpen),
      phase: "Project Launch & Nominations Open",
      description: `${currentEdition.name} officially launches. Public and institutional nominations open across Social Media, Sports and Music tracks.`,
      icon: Megaphone,
    },
    {
      id: "verification",
      date: fmtRange(verificationStart, nominationsClose),
      phase: "Nominee Verification & EDX Evidence Review",
      description:
        "NRC verifies nominee identity, evidence of education impact, and EDX framework alignment (25% Reach · 30% Engagement · 45% Impact).",
      icon: ShieldCheck,
    },
    {
      id: "shortlist",
      date: fmtRange(nominationsClose, votingOpen),
      phase: "Regional Shortlisting",
      description:
        "Verified nominees shortlisted across 8 African regions plus the African Diaspora, ready for public discovery and voting.",
      icon: CalendarDays,
    },
    {
      id: "voting",
      date: fmtRange(votingOpen, votingClose),
      phase: "Public Voting Window",
      description:
        "AGC-powered public voting opens across all three categories — Social Media platforms, Sports areas and Music genres.",
      icon: Vote,
    },
    {
      id: "jury",
      date: fmtRange(juryOpen, juryClose),
      phase: "Independent Jury Review",
      description:
        "Independent jury combines public vote (40%) with expert review (60%) to determine Blue Garnet finalists.",
      icon: ShieldCheck,
    },
    {
      id: "gala",
      date: fmtDate(ceremony),
      phase: "Blue Garnet Awards Gala",
      description: `Winners of the ${currentEdition.name} Influencer Education Impact Award announced at the Blue Garnet Gala with live broadcast.`,
      icon: Trophy,
    },
    {
      id: "legacy",
      date: fmtRange(certs.opens ?? legacyStart, certs.closes ?? legacyEnd),
      phase: "Legacy & Impact Reporting",
      description:
        "Recognised influencers activate education legacy commitments and publish 12-month impact reports.",
      icon: Sparkles,
    },
  ];

  const headlineDate = fmtDate(nominationsOpen);
  const headlineGala = fmtDate(ceremony);

  return (
    <section id="project-timeline" className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-gold text-sm font-medium uppercase tracking-wider mb-2">
            Project Timeline
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            From {headlineDate} to the Blue Garnet Gala
          </h2>
          <p className="text-white/70">
            The complete project timeline for the {currentEdition.name} Influencer Education Impact Award — from launch through verification, voting, gala ({headlineGala}) and post-award legacy.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gold/20 hidden md:block" />

            <div className="space-y-4">
              {MILESTONES.map((m, index) => {
                const Icon = m.icon;
                return (
                  <div key={m.id} className="flex gap-4 md:gap-6">
                    <div className="relative flex-shrink-0">
                      <div className="h-12 w-12 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gold" />
                      </div>
                    </div>

                    <div className="flex-1 bg-charcoal-light rounded-xl p-4 border border-gold/20">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                        <h3 className="font-semibold text-white">
                          <span className="text-gold/70 mr-2 text-sm">{String(index + 1).padStart(2, "0")}</span>
                          {m.phase}
                        </h3>
                        <span className="text-gold text-sm whitespace-nowrap">{m.date}</span>
                      </div>
                      <p className="text-white/70 text-sm">{m.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
