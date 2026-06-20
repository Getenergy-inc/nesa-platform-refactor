// What Makes NESA-Africa Different — Impact chain beyond recognition.
// Uses charcoal/gold tokens, no custom CSS.

import { motion } from "framer-motion";
import { ArrowRight, Eye, Handshake, Banknote, Wrench, Landmark } from "lucide-react";

const IMPACT_CHAIN = [
  { label: "Recognition", icon: Eye },
  { label: "Visibility", icon: Eye },
  { label: "Partnerships", icon: Handshake },
  { label: "Funding", icon: Banknote },
  { label: "Intervention", icon: Wrench },
  { label: "Legacy", icon: Landmark },
];

export function WhatMakesDifferentSection() {
  return (
    <section
      aria-labelledby="different-heading"
      className="bg-charcoal py-12 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-semibold tracking-[0.18em] uppercase mb-4">
            Beyond Recognition
          </p>
          <h2
            id="different-heading"
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
          >
            What Makes NESA-Africa <span className="text-gold">Different?</span>
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            Most awards stop at recognition. NESA-Africa continues beyond
            recognition into measurable educational impact.
          </p>
        </div>

        {/* Impact chain — horizontal on desktop, stacked on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0">
            {IMPACT_CHAIN.map((step, index) => (
              <div key={step.label} className="flex items-center gap-3 md:gap-0 w-full md:w-auto">
                {/* Step card */}
                <div className="flex-1 md:flex-none flex items-center gap-3 px-4 py-3 rounded-xl border border-gold/20 bg-charcoal-light/40">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold">
                    <step.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-white font-semibold text-sm">{step.label}</span>
                </div>

                {/* Arrow (except last) */}
                {index < IMPACT_CHAIN.length - 1 && (
                  <div className="flex md:hidden justify-center py-1">
                    <ArrowRight className="h-4 w-4 text-gold/50 rotate-90" />
                  </div>
                )}
                {index < IMPACT_CHAIN.length - 1 && (
                  <div className="hidden md:flex items-center px-2">
                    <ArrowRight className="h-4 w-4 text-gold/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Supporting paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-3xl mx-auto text-center mt-8"
        >
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            Every nomination, sponsorship, partnership, AGC voting activity,
            conference, and public engagement contributes toward strengthening
            educational opportunities across Africa.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default WhatMakesDifferentSection;
