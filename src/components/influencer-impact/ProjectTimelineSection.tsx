import { CalendarDays, Megaphone, ShieldCheck, Trophy, Sparkles, FileCheck } from "lucide-react";

/**
 * Influencer Education Impact 2026 — project timeline.
 *
 * Dates are fixed to the "NESA-Africa 2026 — Complete Timeline Set":
 *   • Nominations: 30 August – 14 November 2026 (Influencer tier)
 *   • Rolling NRC verification: 16 September – 14 December 2026
 *   • Gala: Monday, 14 December 2026
 * There is no public voting in this tier — recognition is NRC-verified.
 */

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
    date: "Sunday, 30 August 2026",
    phase: "Nominations Open",
    description:
      "Public and institutional nominations open across the three Influencer Education Impact subcategories — Social Media, Sports and Music.",
    icon: Megaphone,
  },
  {
    id: "verification",
    date: "16 September – 14 December 2026",
    phase: "Rolling NRC Verification",
    description:
      "The Nominee Research Corps verifies identity, category fit, duplicates and documented evidence of education impact, applying the EDX framework (25% Education Impact · 30% Development Contribution · 45% Excellence & Reach).",
    icon: ShieldCheck,
  },
  {
    id: "close",
    date: "Saturday, 14 November 2026",
    phase: "Nominations Close",
    description:
      "The Influencer Education Impact nomination window closes. Late submissions are carried into the next recognition cycle.",
    icon: CalendarDays,
  },
  {
    id: "certificates",
    date: "15 November – 13 December 2026",
    phase: "Certificate Approval & Publication",
    description:
      "Verified nominees are approved for Certificates of Recognition, published to the directory, and may request physical printed certificates ahead of the Gala.",
    icon: FileCheck,
  },
  {
    id: "gala",
    date: "Monday, 14 December 2026",
    phase: "NESA-Africa 2026 Gold-Blue Garnet Awards Gala",
    description:
      "Recognised Education Enablers are celebrated at the NESA-Africa 2026 Gala with live broadcast across Africa and the African Diaspora.",
    icon: Trophy,
  },
  {
    id: "legacy",
    date: "January – December 2027",
    phase: "Legacy & Impact Reporting",
    description:
      "Recognised influencers activate their education legacy commitments and publish 12-month impact reports.",
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
            From 30 August 2026 to the 14 December 2026 Gala
          </h2>
          <p className="text-white/70">
            The complete project timeline for the NESA-Africa 2026 Influencer Education
            Impact Award — nominations, rolling NRC verification, certificate approval,
            Gala and post-award legacy. There is no public voting in this tier.
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
