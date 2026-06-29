import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users, ArrowRight, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChapterRegion = {
  slug: string;
  name: string;
  countries: string;
  group: "africa" | "global";
};

const AFRICA_REGIONS: ChapterRegion[] = [
  { slug: "west-africa", name: "West Africa", countries: "Nigeria, Ghana, Senegal, Côte d'Ivoire…", group: "africa" },
  { slug: "east-africa", name: "East Africa", countries: "Kenya, Uganda, Tanzania, Rwanda…", group: "africa" },
  { slug: "southern-africa", name: "Southern Africa", countries: "South Africa, Zambia, Zimbabwe…", group: "africa" },
  { slug: "central-africa", name: "Central Africa", countries: "DRC, Cameroon, Gabon…", group: "africa" },
  { slug: "north-africa", name: "North Africa", countries: "Egypt, Morocco, Tunisia, Algeria…", group: "africa" },
  { slug: "horn-africa", name: "Horn of Africa", countries: "Ethiopia, Somalia, Djibouti, Eritrea…", group: "africa" },
  { slug: "sahel", name: "Sahel", countries: "Mali, Burkina Faso, Niger, Chad…", group: "africa" },
  { slug: "indian-ocean", name: "Indian Ocean Islands", countries: "Madagascar, Mauritius, Seychelles, Comoros…", group: "africa" },
];

const GLOBAL_REGIONS: ChapterRegion[] = [
  { slug: "diaspora-north-america", name: "North America", countries: "USA, Canada, Mexico", group: "global" },
  { slug: "diaspora-south-america", name: "South America", countries: "Brazil, Argentina, Colombia, Chile…", group: "global" },
  { slug: "diaspora-europe", name: "Europe", countries: "France, Germany, Netherlands, Italy, Spain…", group: "global" },
  { slug: "diaspora-uk-ireland", name: "UK & Ireland", countries: "United Kingdom, Ireland", group: "global" },
  { slug: "diaspora-middle-east", name: "Middle East", countries: "UAE, Saudi Arabia, Qatar, Kuwait…", group: "global" },
  { slug: "diaspora-asia-pacific", name: "Asia-Pacific", countries: "India, China, Japan, Australia, Singapore…", group: "global" },
  { slug: "diaspora-caribbean", name: "Caribbean", countries: "Jamaica, Trinidad & Tobago, Barbados, Bahamas…", group: "global" },
];

const REGIONS: ChapterRegion[] = [...AFRICA_REGIONS, ...GLOBAL_REGIONS];

export default function Chapters() {
  return (
    <div className="min-h-screen bg-charcoal pb-24">
      <Helmet>
        <title>NESA-Africa Chapters — Local Communities Across Africa & Diaspora</title>
        <meta
          name="description"
          content="Discover NESA-Africa local chapters across 10 regions. Join, lead, or partner with a chapter near you to advance education."
        />
      </Helmet>

      <section className="relative py-20 px-4 text-center bg-gradient-to-b from-black to-charcoal border-b border-gold/20">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-widest mb-4">
            <Globe2 className="h-3 w-3" /> Pan-African Network
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl text-gold mb-4">
            NESA-Africa Chapters
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Local communities of educators, students, volunteers, and partners
            advancing the African education movement region by region.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/join-local-chapter">
                Join a Local Chapter <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/volunteer">Lead a Chapter</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REGIONS.map((r, i) => (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6 hover:border-gold/50 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <Users className="h-4 w-4 text-white/40" />
              </div>
              <h3 className="font-playfair text-xl text-gold mb-1">{r.name}</h3>
              <p className="text-xs text-white/50 mb-4">{r.countries}</p>
              <Link
                to={`/join-local-chapter?region=${r.slug}`}
                className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold/80"
              >
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
