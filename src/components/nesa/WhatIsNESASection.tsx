import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Globe2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * WhatIsNESASection — "What is NESA-Africa?" trust primer
 * Placed after the hero/countdown to give first-time visitors a clear
 * one-paragraph definition before they enter deeper sections.
 */
export function WhatIsNESASection() {
  return (
    <section className="relative py-16 md:py-24 bg-charcoal" aria-labelledby="what-is-nesa-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light/10 to-charcoal" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-[0.18em] uppercase mb-5">
            <Globe2 className="h-3 w-3" /> About NESA-Africa
          </span>

          <h2
            id="what-is-nesa-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            What is <span className="text-gold">NESA-Africa?</span>
          </h2>

          <div className="space-y-5 text-white/80 text-base md:text-lg leading-relaxed text-left md:text-center">
            <p>
              NESA-Africa — the <span className="text-gold font-semibold">New Education Standard Awards Africa</span> —
              is a continental honours and impact platform celebrating the changemakers and enablers of
              Education for All across 54 African countries and the diaspora.
            </p>
            <p>
              It recognises the people and organisations building the systems that make education possible:
              those funding schools, shaping policy, supporting learners, developing technology, telling education
              stories, promoting inclusion, strengthening institutions, and creating access for underserved
              communities.
            </p>
            <p className="text-white/90">
              NESA-Africa is not only an award ceremony. It is a recognition engine that turns education impact into
              <span className="text-gold font-semibold"> visibility, credibility, partnership, sponsorship,</span> and
              long-term support.
            </p>
          </div>

          <div className="mt-10">
            <Link
              to="/about"
              onClick={() => trackEvent("home_cta_click", { cta: "learn_about_nesa", to: "/about", section: "what_is_nesa" })}
              className="inline-flex items-center gap-2 rounded-full border-2 border-gold/60 bg-charcoal/40 px-6 py-3 text-gold font-semibold hover:bg-gold hover:text-charcoal transition-all"
            >
              Learn About NESA-Africa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default WhatIsNESASection;
