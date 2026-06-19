// Section 9 — Final CTA with six action cards.
// Charcoal/Gold tokens. No custom CSS, no inline styles.
import { Link } from "react-router-dom";
import {
  Trophy, Heart, Handshake, MapPin, Megaphone, ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

const ACTIONS = [
  { icon: Trophy,    label: "Nominate a Changemaker",  to: "/nominate",       cta: "nominate", featured: true },
  { icon: Heart,     label: "Become a Volunteer",      to: "/volunteer",      cta: "volunteer" },
  { icon: Handshake, label: "Become a Sponsor",        to: "/sponsor",        cta: "sponsor" },
  { icon: MapPin,    label: "Join a Local Chapter",    to: "/local-chapters", cta: "chapter" },
  { icon: Megaphone, label: "Become an Ambassador",    to: "/ambassadors",    cta: "ambassador" },
];

export function FinalCTASection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-charcoal">
      <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-sm font-medium mb-2 uppercase tracking-wide">
            Take Action
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to Shape Africa's{" "}
            <span className="text-gold">Education Future?</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed">
            Choose how you want to make an impact in the NESA-Africa 2026 cycle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.to}
                to={a.to}
                onClick={() =>
                  trackEvent("final_cta_click", { cta: a.cta, to: a.to, location: "final_cta" })
                }
                className={`group rounded-2xl border p-6 transition-all hover:-translate-y-0.5 ${
                  a.featured
                    ? "border-gold bg-gold/10 hover:bg-gold/15"
                    : "border-gold/25 bg-charcoal-light hover:border-gold/55"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`inline-flex items-center justify-center h-11 w-11 shrink-0 rounded-full ${
                      a.featured ? "bg-gold text-charcoal" : "bg-gold/15 text-gold"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold text-white leading-tight mb-1">
                      {a.label}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-gold text-sm font-semibold">
                      Get started
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
