// Compact "Why it matters" trust/value strip — sits directly under the hero
// to reduce bounce by giving instant credibility + scroll cue.

import { Award, Users, Heart, GraduationCap, Building2, Globe2, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const PILLARS = [
  { icon: Award, label: "Recognition" },
  { icon: Users, label: "Participation" },
  { icon: Building2, label: "CSR Impact" },
  { icon: GraduationCap, label: "EduAid Africa" },
  { icon: Heart, label: "Rebuild My School" },
  { icon: Globe2, label: "Continental Reach" },
];

export function HeroValueStrip() {
  return (
    <section
      aria-label="Why NESA-Africa matters"
      className="relative bg-charcoal border-y border-gold/15"
    >
      {/* Soft gold wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-gold/[0.04] to-transparent" />

      <div className="container relative py-5 sm:py-7">
        <ul className="flex gap-3 sm:gap-6 md:gap-10 overflow-x-auto scrollbar-hide justify-start md:justify-center">
          {PILLARS.map((p, i) => (
            <motion.li
              key={p.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group flex flex-col items-center gap-1.5 min-w-[88px] sm:min-w-fit"
            >
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-gold transition-all duration-300 group-hover:bg-gold/20 group-hover:scale-110 group-hover:shadow-[0_0_18px_hsl(42_85%_52%/0.45)]">
                <p.icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-white/75 group-hover:text-gold transition-colors whitespace-nowrap">
                {p.label}
              </span>
            </motion.li>
          ))}
        </ul>

        {/* Scroll cue */}
        <div className="mt-4 hidden sm:flex justify-center">
          <motion.a
            href="#explore"
            aria-label="Explore the 2026 journey"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/55 hover:text-gold transition-colors"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>Explore the 2026 Journey</span>
            <ChevronDown className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}

export default HeroValueStrip;
