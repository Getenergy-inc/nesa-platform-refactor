import { motion } from "framer-motion";
import {
  Crown,
  Building2,
  Megaphone,
  Globe2,
  School,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RecognitionFlashCard } from "@/components/nesa/RecognitionFlashCard";
import { AfricaEducationIconHero } from "@/components/nesa/AfricaEducationIconHero";

const recognitionPathway = [
  "Contribution to education access",
  "Support for learning systems",
  "Advocacy for inclusion & special needs education",
  "Measurable or visible impact",
];

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
    exploreHref: "/programs/rebuild-my-school-africa",
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

const fullCycle = [
  "Recognition",
  "Visibility",
  "Engagement",
  "Partnerships",
  "Funding",
  "Impact",
];

export function BrandNarrativeSection() {
  return (
    <section className="relative py-20 md:py-28 bg-charcoal overflow-hidden">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container relative z-10">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold tracking-widest uppercase mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            What NESA Africa Represents
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            More Than an Award —{" "}
            <span className="text-gold">A Continental Ecosystem</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed">
            NESA Africa recognizes and celebrates individuals and institutions actively
            contributing to <span className="text-gold font-semibold">achieving Education for All</span>{" "}
            across Africa — Africans living in Africa, Africans in the diaspora, and friends
            of Africa globally.
          </p>
        </motion.div>

        {/* Pathway to Recognition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-gold/20 bg-charcoal-light/40 backdrop-blur-sm p-8 md:p-10 mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[11px] tracking-widest uppercase text-gold/70 font-semibold mb-3">
                The Pathway to Recognition
              </p>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                Recognition Beyond Formal Education
              </h3>
              <p className="text-white/65 text-sm md:text-base leading-relaxed mb-4">
                To win a NESA Africa Award, individuals and organizations must demonstrate
                real contribution to learning across the continent.
              </p>
              <p className="text-gold/90 text-sm font-medium">
                Recognition includes influence, advocacy, innovation, and support — not only
                formal education systems.
              </p>
            </div>
            <ul className="space-y-3">
              {recognitionPathway.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 p-4 rounded-xl bg-charcoal/60 border border-gold/10"
                >
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-white/85 text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Core Brand Pillar — Africa Education Icon (split hero with dynamic nominee showcase) */}
        <AfricaEducationIconHero />

        {/* Extended Recognition Framework */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-[11px] tracking-widest uppercase text-gold/70 font-semibold mb-3">
              Extended Recognition Framework
            </p>
            <h3 className="font-display text-2xl md:text-4xl font-bold text-white">
              Recognition Across <span className="text-gold">Multiple Impact Layers</span>
            </h3>
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

        {/* Regional System */}
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
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                Fair Representation. Continental Inclusiveness.
              </h3>
            </div>
          </div>
          <p className="text-white/65 text-sm md:text-base mb-6 max-w-3xl">
            Nominations and voting are structured across African regions, including diaspora
            and global participation — ensuring fair representation, local engagement, and
            continental inclusiveness.
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

        {/* From Recognition to Impact — full cycle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[11px] tracking-widest uppercase text-gold/70 font-semibold mb-3">
            From Recognition to Impact
          </p>
          <h3 className="font-display text-2xl md:text-4xl font-bold text-white mb-8">
            A <span className="text-gold">Full-Cycle</span> System
          </h3>

          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
            {fullCycle.map((step, i) => (
              <div key={step} className="flex items-center gap-2 md:gap-3">
                <div className="px-4 md:px-5 py-2.5 rounded-full bg-charcoal-light/60 border border-gold/30 text-white font-semibold text-sm md:text-base">
                  {step}
                </div>
                {i < fullCycle.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gold/60" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Closing positioning */}
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
  );
}

export default BrandNarrativeSection;
