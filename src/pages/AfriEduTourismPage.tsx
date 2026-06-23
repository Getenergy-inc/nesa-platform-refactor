import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Compass,
  Globe,
  Building2,
  Users,
  Microscope,
  Heart,
  Award,
  Landmark,
  BookOpen,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PROGRAMMES = [
  { icon: School, title: "School Exchange Programmes", desc: "Cross-border learning between African schools, fostering cultural fluency and pedagogical exchange." },
  { icon: GraduationCap, title: "University Exchange Programmes", desc: "Continental mobility for students and faculty across leading African universities." },
  { icon: Landmark, title: "Heritage Learning Tours", desc: "Curated visits to historic learning sites: Timbuktu, Al-Qarawiyyin, Alexandria, Aksum and more." },
  { icon: Award, title: "Education Leadership Tours", desc: "Immersive journeys for ministers, principals and education executives across reform models." },
  { icon: Microscope, title: "STEM Innovation Tours", desc: "Visits to Africa's emerging tech hubs, innovation labs and STEM research institutions." },
  { icon: Users, title: "Teacher Exchange Programmes", desc: "Peer-to-peer teacher residencies advancing best practice and professional development." },
  { icon: Globe, title: "Diaspora Heritage Education Tours", desc: "Roots-based learning journeys for diaspora Africans reconnecting with the continent." },
  { icon: Heart, title: "Special Needs Education Learning Tours", desc: "Inclusive education site visits showcasing models for disability and accessibility." },
  { icon: Building2, title: "NESA-Africa Conference Tours", desc: "Delegate experiences anchored around continental education conferences and summits." },
  { icon: BookOpen, title: "RMSA Commissioning Tours", desc: "Witness Rebuild My School Africa legacy projects coming to life across regions." },
];

const ECOSYSTEM = [
  "Educational Heritage Sites",
  "Universities",
  "Research Centres",
  "Innovation Hubs",
  "Museums",
  "Libraries",
  "Community Learning Centres",
  "Historical Education Landmarks",
  "Educational Conferences",
  "Local Cultural Experiences",
];

const REGION_LINKS = [
  { slug: "west-africa", label: "West Africa" },
  { slug: "east-africa", label: "East Africa" },
  { slug: "central-africa", label: "Central Africa" },
  { slug: "southern-africa", label: "Southern Africa" },
  { slug: "north-africa", label: "North Africa" },
  { slug: "horn-of-africa", label: "Horn of Africa" },
  { slug: "sahel", label: "Sahel Region" },
  { slug: "indian-ocean-islands", label: "Indian Ocean Islands" },
  { slug: "diaspora", label: "Africans in Diaspora" },
  { slug: "friends-of-africa", label: "Friends of Africa" },
];

export default function AfriEduTourismPage() {
  return (
    <>
      <Helmet>
        <title>Afri-EduTourism | NESA-Africa</title>
        <meta
          name="description"
          content="Afri-EduTourism connects educational discovery, cultural heritage, institutional visits, research exchanges, and continental learning experiences across Africa."
        />
        <link rel="canonical" href="https://nesa.africa/afri-edutourism" />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-ivory">
        {/* Hero */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-gold/10 to-charcoal">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block mb-3 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase">
                Educational Exploration
              </span>
              <Compass className="w-12 h-12 text-gold mx-auto mb-4" />
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">Afri-EduTourism</h1>
              <p className="text-xl md:text-2xl text-gold/90 mb-4">
                Learning Through Africa's Stories, Heritage, and Educational Ecosystems
              </p>
              <p className="text-ivory/75 max-w-2xl mx-auto leading-relaxed">
                Afri-EduTourism connects educational discovery, cultural heritage, institutional visits, research
                exchanges, educational conferences, school partnerships, and continental learning experiences.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Programmes */}
        <section className="py-16 md:py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl text-ivory mb-3">Afri-EduTourism Programmes</h2>
              <p className="text-ivory/70 max-w-2xl mx-auto">Ten flagship pathways into Africa's living education ecosystem.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PROGRAMMES.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="rounded-xl border border-gold/15 bg-charcoal-light/60 p-6 hover:border-gold/40 hover:bg-gold/5 transition-all"
                >
                  <p.icon className="h-7 w-7 text-gold mb-3" />
                  <h3 className="text-lg font-semibold text-ivory mb-2">{p.title}</h3>
                  <p className="text-sm text-ivory/70 leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="py-16 md:py-20 px-4 bg-charcoal-light/30 border-y border-gold/10">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="font-playfair text-3xl md:text-4xl text-ivory mb-3">The Afri-EduTourism Ecosystem</h2>
              <p className="text-ivory/70 max-w-2xl mx-auto">
                Every region opens a different door into Africa's learning landscape.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {ECOSYSTEM.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/20 bg-white/[0.03] text-sm text-ivory/85"
                >
                  <Compass className="h-3.5 w-3.5 text-gold" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Region connectors */}
        <section className="py-16 md:py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="font-playfair text-3xl md:text-4xl text-ivory mb-3">
                Explore Afri-EduTourism by Region
              </h2>
              <p className="text-ivory/70 max-w-2xl mx-auto">
                Each region page surfaces the heritage sites, institutions, and cultural experiences that anchor its learning ecosystem.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {REGION_LINKS.map((r) => (
                <Link
                  key={r.slug}
                  to={`/regions/${r.slug}`}
                  className="group block rounded-lg border border-gold/15 bg-charcoal-light/50 px-3 py-3 text-sm text-ivory/85 hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all text-center"
                >
                  {r.label}
                  <ArrowRight className="inline-block ml-1 h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-t from-gold/10 to-charcoal border-t border-gold/10">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="font-playfair text-3xl md:text-4xl text-ivory mb-4">
              Bring your community on an Afri-EduTourism journey
            </h2>
            <p className="text-ivory/75 mb-8 max-w-xl mx-auto">
              Partner with NESA-Africa to design school exchanges, leadership tours, and heritage learning experiences across the continent.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                <Link to="/contact">
                  Partner with Us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                <Link to="/regions">
                  Browse All Regions <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
