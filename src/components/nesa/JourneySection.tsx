// The NESA-Africa 2026 Journey — 7-phase lifecycle.
// Uses charcoal/gold tokens, no custom CSS.

import { motion } from "framer-motion";
import {
  Users,
  ClipboardCheck,
  LayoutGrid,
  Vote,
  Scale,
  Trophy,
  Landmark,
  ArrowRight,
} from "lucide-react";

const PHASES = [
  {
    phase: "Phase 1",
    title: "Public Nominations",
    icon: Users,
    description:
      "Education changemakers are nominated from Africa, the diaspora, and Friends of Africa communities.",
    includes: [
      "Individuals",
      "Schools",
      "Universities",
      "NGOs",
      "Foundations",
      "Governments",
      "Corporations",
      "Media Organisations",
      "Influencers",
      "Philanthropists",
      "Researchers",
      "Education Innovators",
    ],
  },
  {
    phase: "Phase 2",
    title: "Verification & Screening",
    icon: ClipboardCheck,
    description:
      "The Nomination Review Committee (NRC) validates eligibility, evidence, impact claims, category alignment, and governance compliance.",
    includes: ["Eligibility", "Evidence", "Impact claims", "Category alignment", "Governance compliance"],
  },
  {
    phase: "Phase 3",
    title: "EDI Matrix Evaluation",
    icon: LayoutGrid,
    description:
      "Nominees are assessed using the NESA-Africa Education Development Impact (EDI) Matrix.",
    includes: [
      "Education Access",
      "Learning Quality",
      "Innovation",
      "Inclusion",
      "Infrastructure",
      "Leadership",
      "Sustainability",
      "Community Impact",
    ],
  },
  {
    phase: "Phase 4",
    title: "AGC Voting & Public Engagement",
    icon: Vote,
    description:
      "Eligible categories proceed to public engagement. Nominate and earn AGC Voting Coin.",
    includes: [
      "Support nominees",
      "Earn AGC Voting Coin",
      "Participate in education advocacy",
      "Increase awareness of educational impact stories",
    ],
  },
  {
    phase: "Phase 5",
    title: "Jury Review",
    icon: Scale,
    description:
      "Independent judges evaluate nominees using evidence, EDI Matrix Scores, governance criteria, and public participation data.",
    includes: ["Evidence", "EDI Matrix Scores", "Governance Criteria", "Public Participation Data"],
  },
  {
    phase: "Phase 6",
    title: "Blue Garnet Awards Gala",
    icon: Trophy,
    description:
      "Finalists and winners are celebrated during Africa's premier education recognition gala.",
    includes: ["22 October 2026", "Lagos, Nigeria"],
  },
  {
    phase: "Phase 7",
    title: "Legacy Impact Cycle (2026–2027)",
    icon: Landmark,
    description:
      "Recognition becomes action through sustained continental programmes.",
    includes: [
      "EduAid-Africa",
      "Rebuild My School Africa",
      "Special Needs Education Support",
      "Afri-EduTourism",
      "Regional Education Projects",
      "GFA Wzip Funding Pathways",
    ],
  },
];

export function JourneySection() {
  return (
    <section
      aria-labelledby="journey-heading"
      className="bg-charcoal py-12 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-semibold tracking-[0.18em] uppercase mb-4">
            The 2026 Cycle
          </p>
          <h2
            id="journey-heading"
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3"
          >
            The NESA-Africa 2026 <span className="text-gold">Journey</span>
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            From nomination to legacy — how education changemakers are discovered,
            evaluated, celebrated, and supported across Africa.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line — desktop only */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gold/20 hidden md:block" />

            <div className="space-y-6">
              {PHASES.map((item, index) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="flex gap-4 md:gap-6"
                >
                  {/* Phase circle */}
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 rounded-full border bg-gold/10 border-gold/30 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-gold" />
                    </div>
                    {index < PHASES.length - 1 && (
                      <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gold/20" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-charcoal-light rounded-xl p-5 border border-gold/20">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-2">
                      <span className="text-gold text-xs font-semibold uppercase tracking-wider">
                        {item.phase}
                      </span>
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Includes list */}
                    {item.includes.length > 0 && (
                      <ul className="flex flex-wrap gap-2">
                        {item.includes.map((inc) => (
                          <li
                            key={inc}
                            className="px-2.5 py-1 rounded-full bg-gold/5 border border-gold/20 text-white/80 text-xs"
                          >
                            {inc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneySection;
