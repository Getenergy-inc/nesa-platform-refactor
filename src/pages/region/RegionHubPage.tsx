import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, BookOpen, Compass, GraduationCap, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { getRegionHubBySlug, REGION_HUBS } from "@/config/regionHubs";
import { RegionLegacySection } from "@/components/region/RegionLegacySection";

// Map public region-hub slugs to the 8 legacy hub slugs used in RegionalLegacyEcosystem.
const LEGACY_SLUG_MAP: Record<string, string> = {
  "west-africa": "west-africa",
  "east-africa": "east-africa",
  "central-africa": "central-africa",
  "southern-africa": "southern-africa",
  "north-africa": "north-africa",
  "indian-ocean-islands": "indian-ocean-islands",
  "diaspora": "diaspora",
  "friends-of-africa": "friends-of-africa",
  // Sub-regions roll up into the closest legacy hub
  "sahel": "west-africa",
  "horn-of-africa": "east-africa",
};

// Dynamic image imports
const regionImages: Record<string, string> = {};
const imageModules = import.meta.glob("@/assets/regions/*.jpg", { eager: true, import: "default" }) as Record<string, string>;
Object.entries(imageModules).forEach(([path, url]) => {
  const filename = path.split("/").pop()?.replace(".jpg", "") || "";
  regionImages[filename] = url;
});

export function RegionHubPage() {
  const { slug } = useParams<{ slug: string }>();
  const hub = slug ? getRegionHubBySlug(slug) : undefined;

  if (!hub) {
    return (
      <div className="min-h-screen bg-charcoal text-ivory">
        <NESAHeader />
        <div className="container py-32 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Region Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return Home</Link>
        </div>
        <NESAFooter />
      </div>
    );
  }

  const heroImg = regionImages[hub.heroImage] || "";

  return (
    <>
      <Helmet>
        <title>{`${hub.name} | NESA-Africa Edu-Tourism & Education Awards`}</title>
        <meta name="description" content={`${hub.tagline}. Discover education champions, cultural heritage, and edu-tourism in ${hub.name}. ${hub.countries.slice(0, 4).join(", ")} & more.`} />
        <meta property="og:title" content={`${hub.name} — NESA-Africa`} />
        <meta property="og:description" content={hub.tagline} />
        <link rel="canonical" href={`https://nesa.africa/region/${hub.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            {heroImg && <img src={heroImg} alt={`${hub.name} traditional culture and dance`} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
          </div>

          <div className="container relative z-10 pb-16 pt-32 max-w-5xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-semibold mb-4 tracking-widest uppercase">
                {hub.shortName} Region
              </span>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mb-4 leading-tight">
                {hub.name}
              </h1>

              <p className="text-xl md:text-2xl text-gold font-medium mb-4">{hub.tagline}</p>

              <p className="text-ivory/80 text-lg max-w-3xl leading-relaxed">{hub.description}</p>
            </motion.div>
          </div>
        </section>

        {/* Countries Strip */}
        <section className="py-10 border-y border-gold/10">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-sm font-semibold text-ivory/70 uppercase tracking-widest mb-4">Countries in this Region</h2>
            <div className="flex flex-wrap gap-2">
              {hub.countries.map(country => (
                <span key={country} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-charcoal-light/60 border border-gold/15 rounded-full text-ivory/80 text-sm">
                  <MapPin className="w-3 h-3 text-gold" />
                  {country}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Cultural Highlights */}
        <section className="py-16 md:py-24">
          <div className="container max-w-5xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-8">
                <Compass className="w-6 h-6 text-gold" />
                <h2 className="text-2xl md:text-3xl font-bold text-ivory">Cultural Highlights & Traditions</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {hub.culturalHighlights.map((highlight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-charcoal-light/60 border border-gold/10 rounded-xl p-5 hover:bg-gold/5 hover:border-gold/30 transition-all"
                  >
                    <p className="text-ivory font-medium">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Edu-Tourism Facts */}
        <section className="py-16 md:py-24 bg-charcoal-light/30">
          <div className="container max-w-5xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="w-6 h-6 text-gold" />
                <h2 className="text-2xl md:text-3xl font-bold text-ivory">Edu-Tourism Facts</h2>
              </div>
              <div className="space-y-4">
                {hub.eduTourismFacts.map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-4 bg-charcoal-light/60 border border-gold/10 rounded-xl p-5"
                  >
                    <BookOpen className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <p className="text-ivory/80">{fact}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Users className="w-10 h-10 text-gold mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-4">
                Know an Education Champion in {hub.shortName === "Friends" ? "Friends of Africa" : hub.name}?
              </h2>
              <p className="text-ivory/70 mb-8 max-w-xl mx-auto">
                Nominate exceptional educators, institutions, and innovators from this region for the NESA-Africa awards.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild className="rounded-full gap-2 bg-gold hover:bg-gold-dark text-charcoal px-8 py-3 font-semibold">
                  <Link to="/nominate">
                    Nominate Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full gap-2 border-gold/30 text-gold hover:bg-gold/10 px-8 py-3">
                  <Link to="/nominees">
                    Browse Nominees <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Other Regions */}
        <section className="py-16 border-t border-gold/10">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-lg font-semibold text-ivory/70 uppercase tracking-widest mb-6 text-center">Explore Other Regions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {REGION_HUBS.filter(r => r.slug !== hub.slug).map(region => (
                <Link
                  key={region.slug}
                  to={`/region/${region.slug}`}
                  className="group bg-charcoal-light/60 border border-gold/10 rounded-lg p-3 text-center hover:bg-gold/10 hover:border-gold/30 transition-all"
                >
                  <p className="text-ivory/80 group-hover:text-ivory text-sm font-medium transition-colors">{region.shortName}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}

export default RegionHubPage;
