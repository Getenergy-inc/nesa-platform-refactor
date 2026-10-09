// Section 8 — One Continent. Ten Education Regions. One Mission.
// Signature banner that frames the 10-region model before the explorer.

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const REGIONS = [
  { label: "West Africa", slug: "west-africa" },
  { label: "East Africa", slug: "east-africa" },
  { label: "Central Africa", slug: "central-africa" },
  { label: "Southern Africa", slug: "southern-africa" },
  { label: "North Africa", slug: "north-africa" },
  { label: "Horn of Africa", slug: "horn-of-africa" },
  { label: "Sahel Region", slug: "sahel" },
  { label: "Indian Ocean Islands", slug: "indian-ocean-islands" },
  { label: "Africans in Diaspora", slug: "diaspora" },
  { label: "Friends of Africa", slug: "friends-of-africa" },
];

export function TenRegionsBannerSection() {
  return (
    <section
      className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-charcoal via-black to-charcoal overflow-hidden"
      aria-labelledby="ten-regions-heading"
    >
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,theme(colors.gold)_1px,transparent_1px)] bg-[length:32px_32px]" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto text-center">
        <p className="text-gold uppercase tracking-[0.3em] text-xs sm:text-sm mb-4 font-semibold">
          One Continent. Ten Education Regions. One Mission.
        </p>
        <h2
          id="ten-regions-heading"
          className="font-playfair text-3xl sm:text-5xl md:text-6xl text-white mb-6 leading-tight"
        >
          Africa, organised for <span className="text-gold">recognition.</span>
        </h2>
        <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto mb-10">
          Every nominee, chapter, volunteer, and award belongs to one of ten education regions —
          designed for discovery, accountability, and continental coverage.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {REGIONS.map((r, i) => (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link
                to={`/region/${r.slug}`}
                className="block rounded-lg border border-gold/20 bg-white/[0.03] hover:bg-gold/10 hover:border-gold/50 transition-all py-3 px-2 text-xs sm:text-sm text-white/85 hover:text-gold font-medium"
              >
                {r.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90 font-semibold">
          <Link to="/region">
            Explore Africa's Regions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default TenRegionsBannerSection;
