// Impact Wrap-Up + Regional Reach
// Extracted from AwardSpotlightSection so other sections can be slotted before it.

import { motion } from "framer-motion";
import {
  School,
  ArrowRight,
  Heart,
  HandCoins,
  MapPin,
  Building2,
  Globe2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import impactBgImg from "@/assets/rebuild-school-impact.jpg";
import eduaidLogo from "@/assets/partners/eduaid-africa-logo.jpeg";

const PatternOverlay = () => (
  <svg
    className="absolute inset-0 h-full w-full opacity-[0.04]"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <pattern id="iwu-pattern" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
        <path d="M 18 0 L 36 18 L 18 36 L 0 18 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#iwu-pattern)" />
  </svg>
);

export function ImpactWrapUpSection() {
  return (
    <section className="relative py-16 md:py-20 bg-charcoal">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* ════ IMPACT WRAP-UP ════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="relative overflow-hidden rounded-3xl ring-1 ring-gold/30 shadow-[0_0_60px_-15px_hsl(var(--gold)/0.4)]">
            <img
              src={impactBgImg}
              alt="Children with wheelchairs at an African school courtyard at sunset"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/50" />
            <div className="absolute inset-0 bg-charcoal/30" />
            <div className="text-gold">
              <PatternOverlay />
            </div>

            <div className="pointer-events-none absolute right-0 top-0 opacity-10">
              <School className="h-72 w-72 text-gold" strokeWidth={1} />
            </div>

            <div className="relative p-6 sm:p-10 md:p-12">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={eduaidLogo}
                    alt="EduAid Africa logo"
                    loading="lazy"
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover ring-1 ring-gold/40 bg-white/5 shadow-md shadow-black/40"
                  />
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/40">
                    <Heart className="h-3.5 w-3.5 text-gold" />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gold">
                      Impact Wrap-Up
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  From Recognition to <span className="text-gold">Real Impact</span>
                </h3>
                <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed mb-7">
                  Through <span className="text-gold font-semibold">EduAid Africa</span> and{" "}
                  <span className="text-gold font-semibold">Rebuild My School Africa</span>, the
                  2026 season connects recognition to practical education intervention.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: School, label: "Special school grants support (2026–2027)" },
                    { icon: HandCoins, label: "Education infrastructure crowdfunding" },
                    { icon: Building2, label: "CSR for Education contributions" },
                    { icon: MapPin, label: "Regional school interventions across Africa" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-gold/20 backdrop-blur-sm hover:bg-white/10 hover:border-gold/40 transition-all"
                    >
                      <div className="h-9 w-9 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-gold" />
                      </div>
                      <span className="text-white/85 text-xs sm:text-sm font-medium">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/nominate?type=school">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 px-7 shadow-[0_0_30px_-8px_hsl(var(--gold)/0.6)]"
                    >
                      Nominate a School
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/partners">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2 px-7"
                    >
                      Partner for Impact
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default ImpactWrapUpSection;
