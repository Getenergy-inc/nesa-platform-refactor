// Section — Recognition Connected to Action
// Six content blocks (Recognition · Visibility · Partnerships · Funding · Intervention · Legacy).

import { motion } from "framer-motion";
import {
  Award,
  Eye,
  Handshake,
  Coins,
  Wrench,
  Infinity as InfinityIcon,
} from "lucide-react";


const FOCUS_AREAS = [
  { icon: Award, label: "Recognition", copy: "Evidence-based continental recognition for credible education impact." },
  { icon: Eye, label: "Visibility", copy: "Verified public profiles, media storytelling and continental discovery." },
  { icon: Handshake, label: "Partnerships", copy: "Connections among Education Enablers, funders, institutions, governments and development partners." },
  { icon: Coins, label: "Funding", copy: "Transparent support for approved programmes, interventions and education needs." },
  { icon: Wrench, label: "Intervention", copy: "Practical education services delivered through EduAid-Africa and connected SCEF programmes." },
  { icon: InfinityIcon, label: "Legacy", copy: "Living impact records and programmes that continue beyond the Recognition Gala." },
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
            <span className="text-gold">Recognition Connected to Action.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
