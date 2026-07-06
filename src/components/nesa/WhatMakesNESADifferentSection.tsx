// Section 6 — What Makes NESA-Africa Different
// Eight focus areas that distinguish NESA-Africa from a traditional awards programme.

import { motion } from "framer-motion";
import {
  Award,
  Eye,
  Handshake,
  Sparkles,
  Building2,
  GraduationCap,
  Users,
  Infinity as InfinityIcon,
} from "lucide-react";

const FOCUS_AREAS = [
  { icon: Award, label: "Recognition", copy: "Continental honours grounded in measurable educational impact." },
  { icon: Eye, label: "Visibility", copy: "Amplifying the work of education changemakers, institutions and communities." },
  { icon: Handshake, label: "Partnerships", copy: "Connecting honourees with funders, governments, sponsors and development ecosystems." },
  { icon: Building2, label: "School Interventions", copy: "Supporting classrooms, accessibility, inclusive learning spaces and Rebuild My School Africa projects." },
  { icon: GraduationCap, label: "Scholarships", copy: "Creating EduAid-Africa pathways for learners, teachers and institutions." },
  { icon: Users, label: "Community Engagement", copy: "Mobilising local chapters, volunteers and ambassadors across Africa and the Diaspora." },
  { icon: InfinityIcon, label: "Legacy", copy: "Building post-award programmes that continue beyond the gala." },
];


export function WhatMakesNESADifferentSection() {
  return (
    <section className="bg-charcoal py-16 sm:py-20 px-4 sm:px-6" aria-labelledby="what-makes-different-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-gold/80 uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 font-semibold">
            What Makes NESA-Africa Different
          </p>
          <h2
            id="what-makes-different-heading"
            className="font-playfair text-3xl sm:text-4xl md:text-5xl text-white leading-tight"
          >
            Unlike traditional awards,<br className="hidden sm:block" />
            <span className="text-gold">NESA-Africa connects recognition to action.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {FOCUS_AREAS.map((area, i) => (
            <motion.div
              key={area.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group relative rounded-xl border border-gold/15 bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-4 sm:p-5 hover:border-gold/40 hover:bg-gold/5 transition-all"
            >
              <area.icon className="h-6 w-6 sm:h-7 sm:w-7 text-gold mb-3" aria-hidden="true" />
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1">{area.label}</h3>
              <p className="text-white/60 text-xs sm:text-sm leading-snug">{area.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatMakesNESADifferentSection;
