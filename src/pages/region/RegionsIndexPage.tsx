import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, MapPin, ArrowRight, Compass } from "lucide-react";
import { AFRICAN_REGIONS, REGION_SHORT_DESCRIPTIONS, GOVERNANCE_STATS } from "@/lib/regions";
import { Helmet } from "react-helmet-async";
import { ExploreNomineesCTA } from "@/components/nominees/ExploreNomineesCTA";
import { InteractiveAfricaMap } from "@/components/nesa/InteractiveAfricaMap";
import { Button } from "@/components/ui/button";

const regionSlugs: Record<string, string> = {
  "North Africa": "north-africa",
  "West Africa": "west-africa",
  "Central Africa": "central-africa",
  "East Africa": "east-africa",
  "Southern Africa": "southern-africa",
  "Sahel Region": "sahel",
  "Horn of Africa": "horn-of-africa",
  "Indian Ocean Islands": "indian-ocean-islands",
  "Diaspora / Global Africa": "diaspora",
  "Friends of Africa": "friends-of-africa",
};

export default function RegionsIndexPage() {
  return (
    <>
      <Helmet>
        <title>Explore Africa's Education Regions | NESA-Africa</title>
        <meta
          name="description"
          content="Discover education champions, educational innovation, cultural heritage, local chapters, partnerships, and Afri-EduTourism opportunities across Africa and the diaspora."
        />
        <link rel="canonical" href="https://nesa.africa/regions" />
      </Helmet>
      <div className="min-h-screen bg-charcoal text-ivory">
        {/* Hero */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-gold/10 to-charcoal">
          <div className="container mx-auto text-center max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block mb-3 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold tracking-wider uppercase">
                Continental Discovery
              </span>
              <Globe className="w-12 h-12 text-gold mx-auto mb-4" />
              <h1 className="font-playfair text-4xl md:text-5xl text-ivory mb-4">
                Explore Africa's Education Regions
              </h1>
              <p className="text-lg text-ivory/75 mb-3 max-w-2xl mx-auto">
                Discover education champions, educational innovation, cultural heritage, local chapters,
                partnerships, and Afri-EduTourism opportunities across Africa and the diaspora.
              </p>
              <p className="text-sm text-ivory/60">
                NESA-Africa operates across <span className="text-gold font-semibold">{GOVERNANCE_STATS.regions} regional zones</span>.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Interactive Map */}
        <section className="px-4">
          <div className="container mx-auto max-w-6xl">
            <InteractiveAfricaMap />
          </div>
        </section>

        {/* Regions Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-center font-playfair text-3xl text-ivory mb-2">All Ten Education Regions</h2>
            <p className="text-center text-ivory/65 text-sm mb-10 max-w-2xl mx-auto">
              Tap a region to explore its profile, featured nominees, local chapters and Afri-EduTourism opportunities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AFRICAN_REGIONS.map((region, i) => {
                const slug =
                  regionSlugs[region] || region.toLowerCase().replace(/\s+/g, "-").replace(/[/]/g, "");
                const description =
                  REGION_SHORT_DESCRIPTIONS[region as keyof typeof REGION_SHORT_DESCRIPTIONS] || "";
                return (
                  <motion.div
                    key={region}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link
                      to={`/regions/${slug}`}
                      className="group block rounded-xl border border-gold/10 bg-charcoal-light/60 p-6 hover:border-gold/40 hover:shadow-lg transition-all duration-300 h-full"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <MapPin className="w-5 h-5 text-gold" />
                        <ArrowRight className="w-4 h-4 text-ivory/60 group-hover:text-gold transition-colors" />
                      </div>
                      <h3 className="text-xl font-semibold text-ivory mb-2 group-hover:text-gold transition-colors">
                        {region}
                      </h3>
                      {description && <p className="text-sm text-ivory/70">{description}</p>}
                      <span className="mt-4 inline-flex items-center text-gold text-sm font-semibold opacity-80 group-hover:opacity-100">
                        Explore Region <ArrowRight className="ml-1.5 h-4 w-4" />
                      </span>
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

        {/* Afri-EduTourism teaser */}
        <section className="py-16 px-4 bg-gradient-to-t from-gold/10 to-charcoal border-t border-gold/10">
          <div className="container mx-auto max-w-3xl text-center">
            <Compass className="w-10 h-10 text-gold mx-auto mb-4" />
            <h2 className="font-playfair text-3xl md:text-4xl text-ivory mb-3">Afri-EduTourism</h2>
            <p className="text-ivory/75 mb-6 max-w-xl mx-auto">
              Heritage learning tours, school and university exchanges, STEM innovation visits, and conference
              journeys across Africa's living education ecosystem.
            </p>
            <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
              <Link to="/afri-edutourism">
                Discover Afri-EduTourism <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
