import { CalendarDays, Megaphone, ShieldCheck, Vote, Trophy, Sparkles } from "lucide-react";

interface TimelineMilestone {
  id: string;
  date: string;
  phase: string;
  description: string;
  icon: typeof CalendarDays;
}

const MILESTONES: TimelineMilestone[] = [
  {
    id: "launch",
    date: "20 May 2026",
    phase: "Project Launch & Nominations Open",
    description:
      "Influencer Education Impact Award 2026 officially launches. Public and institutional nominations open across Social Media, Sports and Music tracks.",
    icon: Megaphone,
  },
  {
    id: "verification",
    date: "21 May – 30 Jun 2026",
    phase: "Nominee Verification & EDX Evidence Review",
    description:
      "NRC verifies nominee identity, evidence of education impact, and EDX framework alignment (25% Reach · 30% Engagement · 45% Impact).",
    icon: ShieldCheck,
  },
  {
    id: "shortlist",
    date: "1 – 31 Jul 2026",
    phase: "Regional Shortlisting",
    description:
      "Verified nominees shortlisted across 8 African regions plus the African Diaspora, ready for public discovery and voting.",
    icon: CalendarDays,
  },
  {
    id: "voting",
    date: "15 Aug – 25 Sep 2026",
    phase: "Public Voting Window",
    description:
      "AGC-powered public voting opens across all three categories — Social Media platforms, Sports areas and Music genres.",
    icon: Vote,
  },
  {
    id: "jury",
    date: "26 Sep – 15 Oct 2026",
    phase: "Independent Jury Review",
    description:
      "Independent jury combines public vote (40%) with expert review (60%) to determine Blue Garnet finalists.",
    icon: ShieldCheck,
  },
  {
    id: "gala",
    date: "22 October 2026",
    phase: "Blue Garnet Awards Gala",
    description:
      "Winners of the Influencer Education Impact Award 2026 announced at the Blue Garnet Gala in Lagos with live broadcast.",
    icon: Trophy,
  },
  {
    id: "legacy",
    date: "Nov 2026 – Oct 2027",
    phase: "Legacy & Impact Reporting",
    description:
      "Recognised influencers activate education legacy commitments and publish 12-month impact reports.",
    icon: Sparkles,
  },
];

export function ProjectTimelineSection() {
  return (
    <section id="project-timeline" className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-gold text-sm font-medium uppercase tracking-wider mb-2">
            Project Timeline
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            From 20 May 2026 to the Blue Garnet Gala
          </h2>
          <p className="text-white/70">
            The complete project timeline for the Influencer Education Impact Award 2026 — from launch through verification, voting, gala and post-award legacy.
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
