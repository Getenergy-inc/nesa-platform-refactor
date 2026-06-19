// Impact Programs grid — EduAid-Africa, Rebuild My School Africa,
// Special Needs Education, Afri-EduTourism. Mobile-first, charcoal/gold.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Wrench, HeartHandshake, Plane, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Program = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
};

const PROGRAMS: Program[] = [
  {
    id: "eduaid",
    icon: GraduationCap,
    title: "EduAid-Africa",
    tagline: "Scholarships · Conferences · Training",
    description:
      "Continental learning hub funding scholarships, hosting regional Afri-EduTourism Conferences, and delivering teacher and youth training.",
    bullets: ["Send-A-Child-To-School", "Regional Conferences", "Teacher Training"],
    href: "/eduaid",
    cta: "Explore EduAid-Africa",
  },
  {
    id: "rmsa",
    icon: Wrench,
    title: "Rebuild My School Africa",
    tagline: "Infrastructure & School Transformation",
    description:
      "Post-award legacy programme rebuilding classrooms, libraries, sanitation, and digital labs in under-resourced African schools.",
    bullets: ["Classroom Rebuilds", "Digital Labs", "WASH Facilities"],
    href: "/eduaid-africa/rebuild-my-school",
    cta: "Visit RMSA Hub",
  },
  {
    id: "special-needs",
    icon: HeartHandshake,
    title: "Special Needs Education",
    tagline: "Inclusive Learning Support",
    description:
      "Dedicated support for schools, teachers, and innovators serving learners with disabilities and special educational needs.",
    bullets: ["Inclusive Schools", "Assistive Tech", "Teacher Capacity"],
    href: "/programs/special-needs",
    cta: "Support Inclusion",
  },
  {
    id: "afri-edutourism",
    icon: Plane,
    title: "Afri-EduTourism",
    tagline: "Learn · Serve · Tour · Transform",
    description:
      "Afri-EduTourism brings diaspora and global partners to Africa to learn, volunteer, and co-fund education impact in host regions.",
    bullets: ["Regional Tours", "Diaspora Volunteers", "Cultural Exchange"],
    href: "/programs/edu-tourism",
    cta: "Plan a Journey",
  },
];

export function ImpactProgramsSection() {
  return (
    <section
      aria-labelledby="impact-programs-heading"
      className="bg-gradient-to-b from-charcoal via-charcoal-light/30 to-charcoal py-12 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-semibold tracking-[0.18em] uppercase mb-4">
            Continental Impact
          </p>
          <h2
            id="impact-programs-heading"
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3"
          >
            Beyond Recognition — <span className="text-gold">Real Impact.</span>
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Every NESA-Africa award is connected to a measurable, on-the-ground
            programme — funded, governed, and reported transparently.
          </p>
        </div>

        <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((program, idx) => (
            <motion.article
              key={program.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className={cn(
                "group relative rounded-2xl border border-gold/20 bg-charcoal/70 p-5 md:p-6",
                "hover:border-gold/50 hover:bg-charcoal-light/40 transition-all duration-300 flex flex-col",
              )}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold mb-4">
                <program.icon className="h-5 w-5" aria-hidden="true" />
              </span>

              <h3 className="font-display text-lg md:text-xl font-bold text-white leading-tight mb-1">
                {program.title}
              </h3>
              <p className="text-gold/90 text-[11px] md:text-xs font-medium tracking-wide mb-3">
                {program.tagline}
              </p>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                {program.description}
              </p>

              <ul className="space-y-1.5 mb-5">
                {program.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-white/60 text-xs flex items-start gap-2"
                  >
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-gold flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              <Link
                to={program.href}
                className="mt-auto inline-flex items-center gap-1.5 text-gold text-sm font-semibold hover:gap-2.5 transition-all"
              >
                {program.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactProgramsSection;
