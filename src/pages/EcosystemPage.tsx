import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Globe2, MapPin, Sparkles, ArrowRight, Building2, Megaphone, School } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RecognitionFlashCard } from "@/components/nesa/RecognitionFlashCard";
import { AfricaEducationIconHero } from "@/components/nesa/AfricaEducationIconHero";

const extendedFramework = [
  {
    icon: Building2,
    title: "CSR for Education",
    description:
      "Recognizing corporations driving education funding, infrastructure support, and inclusive education initiatives across Africa.",
    categorySlugPatterns: ["%csr%"],
    exploreHref: "/nominees?category=csr",
  },
  {
    icon: Megaphone,
    title: "Africa Education Influencers",
    description:
      "Celebrating public figures — social media advocates, music industry contributors, and sports personalities — using their influence for education.",
    categorySlugPatterns: ["%influencer%", "%media%", "%creative%"],
    exploreHref: "/nominees?category=influencer",
  },
  {
    icon: Globe2,
    title: "Global & Institutional Support",
    description:
      "Honoring bilateral and multilateral organizations, development partners, embassies, and international agencies supporting African education.",
    categorySlugPatterns: ["%diaspora%", "%bilateral%", "%multilateral%", "%global%", "%ngo%"],
    exploreHref: "/nominees?category=global-support",
  },
  {
    icon: School,
    title: "Special School Impact (2026–2027)",
    description:
      "Through EduAid Africa and Rebuild My School Africa — delivering special needs school support, infrastructure, and regional interventions.",
    categorySlugPatterns: ["%school%", "%special%", "%education-friendly%"],
    exploreHref: "/impact/rebuild-my-school-africa",
  },
];

const regions = [
  "West Africa",
  "East Africa",
  "North Africa",
  "Central Africa",
  "Southern Africa",
  "Diaspora & Global",
];

const fullCycle = ["Recognition", "Visibility", "Engagement", "Partnerships", "Funding", "Impact"];

export default function EcosystemPage() {
  return (
    <>
      <Helmet>
        <title>The NESA Africa Ecosystem — Recognition, Regions & Impact</title>
        <meta
          name="description"
          content="Explore the full NESA Africa ecosystem: extended recognition framework, regional system, and the full cycle from recognition to continental impact."
        />
      </Helmet>

      <section className="relative py-20 md:py-28 bg-charcoal overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold tracking-widest uppercase mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              The NESA Africa Ecosystem
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
              A Continental <span className="text-gold">Recognition Ecosystem</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Africans living in Africa, Africans in the diaspora, and friends of Africa globally —
              united by a single mission: achieving Education for All.
            </p>
          </motion.div>

          <AfricaEducationIconHero />

          <div className="mb-16 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <p className="text-[11px] tracking-widest uppercase text-gold/70 font-semibold mb-3">
                Extended Recognition Framework
              </p>
              <h2 className="font-display text-2xl md:text-4xl font-bold text-white">
                Recognition Across <span className="text-gold">Multiple Impact Layers</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5">
              {extendedFramework.map((item, i) => (
                <RecognitionFlashCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  categorySlugPatterns={item.categorySlugPatterns}
                  exploreHref={item.exploreHref}
                  toneIndex={i}
                />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-gold/20 bg-charcoal-light/40 backdrop-blur-sm p-8 md:p-10 mb-16"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-[11px] tracking-widest uppercase text-gold/70 font-semibold">
                  Regional System
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                  Fair Representation. Continental Inclusiveness.
                </h2>
              </div>
            </div>
            <p className="text-white/65 text-sm md:text-base mb-6 max-w-3xl">
              Nominations and voting are structured across African regions, including diaspora and
              global participation — ensuring fair representation, local engagement, and continental
              inclusiveness.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {regions.map((region) => (
                <span
                  key={region}
                  className="px-4 py-2 rounded-full bg-gold/10 border border-gold/25 text-white/90 text-sm font-medium hover:bg-gold/20 transition-colors"
                >
                  {region}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[11px] tracking-widest uppercase text-gold/70 font-semibold mb-3">
              From Recognition to Impact
            </p>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-white mb-8">
              A <span className="text-gold">Full-Cycle</span> System
            </h2>

            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
              {fullCycle.map((step, i) => (
                <div key={step} className="flex items-center gap-2 md:gap-3">
                  <div className="px-4 md:px-5 py-2.5 rounded-full bg-charcoal-light/60 border border-gold/30 text-white font-semibold text-sm md:text-base">
                    {step}
                  </div>
                  {i < fullCycle.length - 1 && <ArrowRight className="h-4 w-4 text-gold/60" />}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto text-center rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/5 via-charcoal-light/40 to-blue-900/10 p-10 md:p-14"
          >
            <p className="font-display text-2xl md:text-3xl text-white italic leading-relaxed mb-6">
              "Recognizing excellence. Driving impact.{" "}
              <span className="text-gold">Advancing education across Africa.</span>"
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/nominate">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full gap-2"
                >
                  Nominate Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold/50 text-gold hover:bg-gold/10 rounded-full"
                >
                  Learn the Full Story
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
