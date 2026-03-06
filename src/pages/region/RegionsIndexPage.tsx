import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, MapPin, Users, ArrowRight } from "lucide-react";
import { AFRICAN_REGIONS, REGION_SHORT_DESCRIPTIONS, GOVERNANCE_STATS } from "@/lib/regions";
import { Helmet } from "react-helmet-async";

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
        <title>Explore Africa's Regions | NESA-Africa</title>
        <meta name="description" content="Explore all 10 NESA-Africa award regions across the African continent, the Diaspora, and Friends of Africa." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto text-center max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Explore Africa's Regions
              </h1>
              <p className="text-lg text-muted-foreground">
                NESA-Africa recognizes excellence across {GOVERNANCE_STATS.regions} regional groups spanning the entire African continent and beyond.
              </p>
            </motion.div>
          </div>
        </section>

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
                      className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {region}
                      </h2>
                      {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
