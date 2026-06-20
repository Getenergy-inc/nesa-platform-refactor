import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, Users, ArrowRight } from "lucide-react";
import { AFRICAN_REGIONS, REGION_SHORT_DESCRIPTIONS, GOVERNANCE_STATS } from "@/lib/regions";
import { Helmet } from "react-helmet-async";
import { ExploreNomineesCTA } from "@/components/nominees/ExploreNomineesCTA";

const InteractiveAfricaMap = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));


const regionSlugs: Record<string, string> = {
  "North Africa": "north-africa",
  "West Africa": "west-africa",
  "Central Africa": "central-africa",
  "East Africa": "east-africa",
  "Southern Africa": "southern-africa",
  "Sahel Region": "sahel-region",
  "Horn of Africa": "horn-of-africa",
  "Indian Ocean Islands": "indian-ocean-islands",
  "Diaspora / Global Africa": "diaspora",
  "Friends of Africa": "friends-of-africa",
};

export default function RegionsIndexPage() {
  return (
    <>
      <Helmet>
        <title>Explore Africa's Regions | NESA-Africa 2026</title>
        <meta name="description" content="NESA-Africa operates across 10 regional zones — driving nominations, voting, partnerships, and storytelling across the continent and the diaspora." />
      </Helmet>
      <div className="min-h-screen bg-charcoal text-ivory">
        {/* Hero */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-gold/5 to-charcoal">
          <div className="container mx-auto text-center max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block mb-3 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold tracking-wider uppercase">
                Continental Reach
              </span>
              <Globe className="w-12 h-12 text-gold mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-ivory mb-4">
                Explore Africa's Regions
              </h1>
              <p className="text-lg text-ivory/70 mb-3">
                NESA-Africa operates across <span className="text-gold font-semibold">{GOVERNANCE_STATS.regions} regional zones</span> — including Africa's core regions and global diaspora communities.
              </p>
              <p className="text-sm text-ivory/60 max-w-2xl mx-auto">
                Regions drive nominations, voting participation, partner engagement, school visibility, and NESA TV storytelling.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Interactive Continental Map */}
        <Suspense fallback={<div className="h-96" />}>
          <InteractiveAfricaMap />
        </Suspense>

        {/* Bridge → 2026–2027 Legacy Impact pathway */}
        <div className="container mx-auto max-w-4xl px-4 -mt-6 mb-8">
          <div className="rounded-2xl border border-gold/25 bg-gold/5 px-5 py-4 text-center">
            <p className="text-ivory/80 text-xs md:text-sm leading-relaxed mb-3">
              Each region now connects to the{" "}
              <span className="text-gold font-semibold">2026–2027 NESA-Africa Legacy Impact pathway</span>
              {" "}— EduAid-Africa Edu-Tourism Conferences, Special Needs School
              nominations, regional voting, GFA Wzip regional wallets, and Rebuild My
              School Africa interventions.
            </p>
            <a
              href="/eduaid-africa/rebuild-my-school"
              className="inline-flex items-center gap-1.5 text-gold text-xs md:text-sm font-semibold hover:underline"
            >
              Explore the full Continental Impact Ecosystem →
            </a>
          </div>
        </div>

        {/* Regions Grid */}
        <section className="py-16 px-4">

          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AFRICAN_REGIONS.map((region, i) => {
                const slug = regionSlugs[region] || region.toLowerCase().replace(/\s+/g, "-").replace(/[/]/g, "");
                const description = REGION_SHORT_DESCRIPTIONS[region as keyof typeof REGION_SHORT_DESCRIPTIONS] || "";
                return (
                  <motion.div
                    key={region}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link
                      to={`/region/${slug}`}
                      className="group block rounded-xl border border-gold/10 bg-charcoal-light/60 p-6 hover:border-gold/40 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <MapPin className="w-5 h-5 text-gold" />
                        <ArrowRight className="w-4 h-4 text-ivory/60 group-hover:text-gold transition-colors" />
                      </div>
                      <h2 className="text-xl font-semibold text-ivory mb-2 group-hover:text-gold transition-colors">
                        {region}
                      </h2>
                      {description && (
                        <p className="text-sm text-ivory/70">{description}</p>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10">
              <ExploreNomineesCTA description="See every approved nominee across all 10 regions in Africa's Education Impact Directory." />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
