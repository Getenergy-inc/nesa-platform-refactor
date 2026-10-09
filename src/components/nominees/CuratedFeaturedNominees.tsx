/**
 * CuratedFeaturedNominees — landing-page marquee strip highlighting
 * a fixed roster of notable approved nominees. Each card links into
 * the directory pre-filtered by name search, ensuring discovery even
 * when an exact profile slug is not yet wired.
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";

interface CuratedNominee {
  name: string;
  country: string;
  region: string;
  category: string;
  highlight: string;
  /** Initials shown when no photo asset is wired. */
  initials: string;
}

const CURATED: CuratedNominee[] = [
  { name: "Mo Ibrahim", country: "Sudan / UK", region: "Diaspora", category: "Africa Education Icon", highlight: "Lifetime philanthropic leadership across African education and governance.", initials: "MI" },
  { name: "Strive Masiyiwa", country: "Zimbabwe", region: "Southern Africa", category: "Africa Education Icon", highlight: "Higher Life Foundation: tens of thousands of orphan scholarships funded.", initials: "SM" },
  { name: "Folorunso Alakija", country: "Nigeria", region: "West Africa", category: "Education Philanthropy", highlight: "Rose of Sharon Foundation — scholarships, vocational training and orphan support.", initials: "FA" },
  { name: "SHOFCO", country: "Kenya", region: "East Africa", category: "Best STEM Education Program", highlight: "Girls' STEM clubs and free schools transforming informal settlements.", initials: "SH" },
  { name: "Shule Direct Foundation", country: "Tanzania", region: "East Africa", category: "EdTech for Access", highlight: "Digital learning platform reaching secondary students across Tanzania.", initials: "SD" },
  { name: "Building Tomorrow", country: "Uganda", region: "East Africa", category: "Education Infrastructure", highlight: "Rural primary schools and inclusive learning communities across Uganda.", initials: "BT" },
  { name: "African Maths Initiative", country: "Nigeria / Kenya", region: "Pan-African", category: "Quality Learning", highlight: "Maths camps, open resources and teacher training across the continent.", initials: "AMI" },
  { name: "COOPI", country: "DRC / Chad", region: "Central Africa", category: "Education in Crisis Settings", highlight: "Education for displaced and conflict-affected children across Central Africa.", initials: "CP" },
  { name: "BitCo", country: "South Africa", region: "Southern Africa", category: "Digital Inclusion", highlight: "Connectivity and digital skills enabling underserved schools to go online.", initials: "BC" },
];

const card = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function CuratedFeaturedNominees() {
  return (
    <section className="py-12 md:py-16 bg-charcoal" aria-labelledby="curated-nominees-heading">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-gold mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Hall of Fame Spotlight
            </span>
            <h2
              id="curated-nominees-heading"
              className="font-display text-2xl md:text-3xl font-bold text-ivory"
            >
              Discover Africa's Education Changemakers
            </h2>
            <p className="text-ivory/60 text-sm md:text-base max-w-2xl mt-1.5">
              A snapshot of approved individuals and organisations transforming education across
              Africa and the diaspora.
            </p>
          </div>
          <Link
            to="/nominees"
            className="group inline-flex items-center gap-2 self-start md:self-auto rounded-full border border-gold/40 bg-charcoal/60 px-4 py-2 text-sm text-ivory hover:border-gold hover:bg-gold/10 hover:text-gold transition-all"
          >
            See All Nominees
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURATED.map((n, i) => (
            <motion.div
              key={n.name}
              variants={card}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/nominees?search=${encodeURIComponent(n.name)}`}
                className="group h-full block rounded-2xl border border-gold/15 bg-charcoal-light/60 p-5 hover:border-gold/45 hover:bg-charcoal-light/80 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center text-gold font-display font-bold text-sm border border-gold/30">
                    {n.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-ivory font-semibold leading-tight group-hover:text-gold transition-colors truncate">
                      {n.name}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-ivory/55">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{n.country} · {n.region}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="inline-block text-[10px] font-semibold tracking-wider uppercase text-gold/90 bg-gold/10 border border-gold/20 rounded-full px-2 py-0.5">
                    {n.category}
                  </span>
                </div>
                <p className="text-sm text-ivory/65 mt-3 line-clamp-3">{n.highlight}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-gold/80 group-hover:text-gold">
                  View profile
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-[11px] text-ivory/40 mt-6 text-center max-w-3xl mx-auto">
          Listing does not imply finalist, winner, or endorsement status. All nominees remain
          subject to verification and judging.
        </p>
      </div>
    </section>
  );
}

export default CuratedFeaturedNominees;
