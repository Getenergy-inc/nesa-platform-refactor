// Section 8/9 — Homepage Regions Preview
// Lean preview only. Full descriptions live on /regions and /regions/:slug.

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";

const ALL_REGIONS = [
  { slug: "west-africa", label: "West Africa" },
  { slug: "east-africa", label: "East Africa" },
  { slug: "central-africa", label: "Central Africa" },
  { slug: "southern-africa", label: "Southern Africa" },
  { slug: "north-africa", label: "North Africa" },
  { slug: "horn-of-africa", label: "Horn of Africa" },
  { slug: "sahel", label: "Sahel Region" },
  { slug: "indian-ocean-islands", label: "Indian Ocean Islands" },
  { slug: "diaspora", label: "Diaspora Africans" },
  { slug: "friends-of-africa", label: "Friends of Africa" },
];

export function ExploreRegionsSection() {
  return (
    <section
      className="bg-charcoal py-16 sm:py-20 px-4 sm:px-6"
      aria-labelledby="explore-regions-heading"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-gold/80 uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 font-semibold">
          One Continent · Eight African Regions · Two Global Communities
        </p>
        <h2
          id="explore-regions-heading"
          className="font-playfair text-3xl sm:text-4xl md:text-5xl text-white mb-4"
        >
          Explore Africa's Education Regions and Global Communities
        </h2>
        <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto mb-10">
          NESA-Africa connects Education Enablers across <span className="text-gold font-semibold">eight African regions</span>, among <span className="text-gold font-semibold">Diaspora Africans</span> and through <span className="text-gold font-semibold">Friends of Africa</span>.
        </p>


        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-10">
          {ALL_REGIONS.map((r, i) => (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <Link
                to={`/regions/${r.slug}`}
                className="block rounded-lg border border-gold/20 bg-white/[0.03] px-3 py-3 text-sm text-white/85 hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all"
              >
                {r.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
          <Link to="/regions">
            <Globe className="mr-2 h-4 w-4" />
            Explore Regions and Communities
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default ExploreRegionsSection;
