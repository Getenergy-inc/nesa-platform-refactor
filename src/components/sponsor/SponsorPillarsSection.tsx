// SponsorPillarsSection — 4 governance-grade sponsorship pillars for NESA-Africa 2026.
// Positions sponsorship as Education Impact, CSR Investment, Visibility Partnership,
// Legacy Project Support — NOT award/voting/judging influence.

import { Award, Tv, GraduationCap, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type Pillar = {
  id: string;
  number: string;
  title: string;
  summary: string;
  includes: string[];
  benefits: string[];
  icon: typeof Award;
  href: string;
  cta: string;
};

const PILLARS: Pillar[] = [
  {
    id: "awards",
    number: "01",
    title: "NESA-Africa Award Sponsorship",
    summary: "Support recognition and celebration of Africa's education changemakers.",
    includes: [
      "Africa Education Icon Sponsorship",
      "Blue Garnet Sponsorship",
      "Platinum Recognition Sponsorship",
      "Influencer Education Impact Sponsorship",
      "Category & Subcategory Sponsorship",
    ],
    benefits: [
      "Website visibility",
      "Event branding",
      "Programme guide visibility",
      "NESA TV recognition",
      "Media mentions",
    ],
    icon: Award,
    href: "/sponsor/categories",
    cta: "Sponsor an award",
  },
  {
    id: "media",
    number: "02",
    title: "NESA-Africa TV & Media Sponsorship",
    summary: "Power education storytelling across Africa through TV, documentaries and webinars.",
    includes: [
      "NESA-Africa TV Sponsorship",
      "Documentary Sponsorship",
      "Webinar Sponsorship",
      "Media Partner Sponsorship",
      "Education Storytelling Sponsorship",
    ],
    benefits: [
      "Media visibility",
      "Branded episodes",
      "Sponsor acknowledgements",
      "Interview opportunities",
    ],
    icon: Tv,
    href: "/sponsor/nesa-tv",
    cta: "Sponsor media",
  },
  {
    id: "eduaid",
    number: "03",
    title: "EduAid-Africa Sponsorship",
    summary: "Fund scholarships, teacher development, special-needs education and digital learning.",
    includes: [
      "Scholarship Sponsorship",
      "Conference Sponsorship",
      "Webinar Sponsorship",
      "Teacher Development Sponsorship",
      "Digital Learning Sponsorship",
    ],
    benefits: [
      "Measurable CSR impact",
      "Donor recognition",
      "Co-branded scholarships",
      "Annual impact reports",
    ],
    icon: GraduationCap,
    href: "/sponsor/eduaid-africa",
    cta: "Sponsor EduAid",
  },
  {
    id: "rmsa",
    number: "04",
    title: "Rebuild My School Africa Legacy Sponsorship",
    summary: "Fund school infrastructure, accessibility upgrades and special-needs schools (Oct 2026 – Oct 2027).",
    includes: [
      "School infrastructure",
      "Accessibility upgrades",
      "Special needs schools",
      "Assistive learning",
      "School rehabilitation",
      "Learning resources",
    ],
    benefits: [
      "Tangible legacy outcomes",
      "Documentary storytelling",
      "Ministerial handover branding",
      "Year-long CSR narrative",
    ],
    icon: Building2,
    href: "/sponsor/rebuild-my-school-africa",
    cta: "Sponsor RMSA",
  },
];

export function SponsorPillarsSection() {
  return (
    <section id="pillars" className="bg-charcoal py-14 md:py-20 border-t border-gold/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
            Four pillars of education impact
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-ivory mt-2 mb-3">
            Governance-driven sponsorship framework
          </h2>
          <p className="text-ivory/65 text-sm md:text-base">
            Every NESA-Africa sponsorship is structured as education impact support, not award influence.
            Choose the pillar that matches your CSR strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group relative rounded-2xl border border-gold/20 hover:border-gold/60 bg-charcoal-light/40 p-5 md:p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-gold/50 font-display text-xl font-bold">{p.number}</span>
                  </div>
                </div>

                <h3 className="font-display text-lg md:text-xl font-bold text-ivory leading-tight mb-2">
                  {p.title}
                </h3>
                <p className="text-ivory/70 text-sm leading-relaxed mb-4">{p.summary}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-gold/80 font-semibold mb-2">
                      Includes
                    </div>
                    <ul className="space-y-1">
                      {p.includes.map((it) => (
                        <li key={it} className="text-ivory/75 text-xs leading-snug flex gap-1.5">
                          <span className="text-gold">•</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-gold/80 font-semibold mb-2">
                      Benefits
                    </div>
                    <ul className="space-y-1">
                      {p.benefits.map((b) => (
                        <li key={b} className="text-ivory/75 text-xs leading-snug flex gap-1.5">
                          <span className="text-gold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  to={p.href}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
                >
                  {p.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {p.id === "awards" && (
                  <p className="mt-4 text-[11px] text-ivory/50 border-t border-gold/10 pt-3 leading-relaxed">
                    Sponsorship does not influence nominations, voting, judging, shortlisting, finalists or winners.
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SponsorPillarsSection;
