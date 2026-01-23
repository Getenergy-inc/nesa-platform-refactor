import { Tv, Check } from "lucide-react";

interface Phase {
  number: number;
  name: string;
  subtitle: string;
  period: string;
  showDate: string;
  bullets: string[];
}

const phases: Phase[] = [
  {
    number: 2,
    name: "Platinum Certificate",
    subtitle: "Baseline Recognition of Service",
    period: "February – June 2026",
    showDate: "28 February 2026",
    bullets: [
      "Non-competitive entry layer",
      "Verification by NESA Nominee Research Corps (NRC)",
      "Governance & safeguarding checks",
      "Certificate validity: 1 year",
      "Global QR-code authentication",
    ],
  },
  {
    number: 3,
    name: "Africa Education Icon",
    subtitle: "Lifetime Impact Recognition",
    period: "March – April 2026",
    showDate: "28 March 2026",
    bullets: [
      "Honours 9 Icons only",
      "Documented impact 2005–2025",
      "African regions + diaspora + Friends of Africa",
      "Non-competitive lifetime recognition",
      "Independent verification",
    ],
  },
  {
    number: 4,
    name: "Gold Certificate",
    subtitle: "Competitive Classification Stage",
    period: "10 April – 16 May 2026",
    showDate: "17 May 2026",
    bullets: [
      "9 Award Categories",
      "135 Sub-Categories",
      "1 Gold Winner per Sub-Category",
      "Public voting only — no judges",
      "Transparent digital audit trail",
    ],
  },
  {
    number: 5,
    name: "Blue Garnet Award",
    subtitle: "Highest Competitive Honour",
    period: "18 May – 17 June 2026",
    showDate: "27 June 2026 (Gala)",
    bullets: [
      "From 135 Gold Certificate winners",
      "9 Blue Garnet Award winners",
      "40% Public Voting + 60% Jury Review",
      "Elite continental honour",
      "Blue Garnet stone in certificate & plaque",
    ],
  },
];

export function AwardPhasesSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Award Phases
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Four structured phases from baseline recognition to the highest continental honour.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {phases.map((phase) => (
            <div
              key={phase.name}
              className="bg-charcoal-light rounded-2xl p-6 border border-gold/20 hover:border-gold/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gold text-sm font-medium">Phase {phase.number}</p>
                  <h3 className="text-xl font-bold text-white">{phase.name}</h3>
                  <p className="text-white/70 text-sm">{phase.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <span className="text-white/70">
                  <span className="text-gold">Period:</span> {phase.period}
                </span>
                <span className="flex items-center gap-1 text-white/70">
                  <Tv className="h-3.5 w-3.5 text-gold" />
                  <span className="text-gold">Show:</span> {phase.showDate}
                </span>
              </div>

              <ul className="space-y-2">
                {phase.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-white/80">
                    <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
