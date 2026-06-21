// Section 9 — Explore Africa's Regions
// Cards that surface education champions, chapters, stories, and EduTourism per region.

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, Newspaper, Sparkles } from "lucide-react";

const FEATURED_REGIONS = [
  {
    slug: "southern-africa",
    title: "Southern Africa",
    tagline: "Rainbow Nations, Boundless Potential",
    countries: "South Africa · Botswana · Namibia · Lesotho · Eswatini · Angola · Zimbabwe",
    accent: "from-amber-500/20 to-orange-500/10",
  },
  {
    slug: "west-africa",
    title: "West Africa",
    tagline: "The Engine Room of Continental Education",
    countries: "Nigeria · Ghana · Senegal · Côte d'Ivoire · Sierra Leone · The Gambia · Liberia",
    accent: "from-green-500/20 to-emerald-500/10",
  },
  {
    slug: "east-africa",
    title: "East Africa",
    tagline: "Innovation, Inclusion, Impact",
    countries: "Kenya · Tanzania · Uganda · Rwanda · Burundi · South Sudan",
    accent: "from-sky-500/20 to-blue-500/10",
  },
  {
    slug: "diaspora",
    title: "Africans in Diaspora",
    tagline: "One Continent, Ten Time Zones, Every Continent",
    countries: "UK · USA · Canada · UAE · EU · Australia · Asia",
    accent: "from-purple-500/20 to-fuchsia-500/10",
  },
];

const FACETS = [
  { icon: Sparkles, label: "Regional Overview" },
  { icon: Users, label: "Education Leaders & Featured Nominees" },
  { icon: MapPin, label: "Local Chapters" },
  { icon: Newspaper, label: "Education Stories & EduTourism" },
];

export function ExploreRegionsSection() {
  return (
    <section className="bg-charcoal py-16 sm:py-20 px-4 sm:px-6" aria-labelledby="explore-regions-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-gold/80 uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 font-semibold">
            Explore Africa's Regions
          </p>
          <h2
            id="explore-regions-heading"
            className="font-playfair text-3xl sm:text-4xl md:text-5xl text-white mb-4"
          >
            Discover education champions across every region.
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto">
            Cultural heritage, educational innovation, partnerships, local chapters, and
            Afri-EduTourism opportunities across Africa and the diaspora.
          </p>
        </div>

        {/* Facets strip */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {FACETS.map((f) => (
            <div
              key={f.label}
              className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/[0.03] px-3 py-1.5 text-xs sm:text-sm text-white/80"
            >
              <f.icon className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              {f.label}
            </div>
          ))}
        </div>

        {/* Featured region cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {FEATURED_REGIONS.map((region, i) => (
            <motion.div
              key={region.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={`/region/${region.slug}`}
                className={`group relative block overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br ${region.accent} p-5 sm:p-6 hover:border-gold/50 transition-all`}
              >
                <h3 className="font-playfair text-xl sm:text-2xl text-white mb-1">{region.title}</h3>
                <p className="text-gold italic text-sm mb-3">{region.tagline}</p>
                <p className="text-white/70 text-xs sm:text-sm leading-snug mb-4">{region.countries}</p>
                <span className="inline-flex items-center text-gold text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Explore {region.title} <ArrowRight className="ml-1.5 h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg" className="border-gold/50 text-gold hover:bg-gold/10">
            <Link to="/region">
              View All 10 Education Regions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ExploreRegionsSection;
