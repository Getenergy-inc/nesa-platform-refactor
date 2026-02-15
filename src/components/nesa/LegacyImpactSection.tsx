import { ArrowRight, Trophy, Vote, Heart, Users, School } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import legacyRebuildImg from "@/assets/rebuild/rebuild-school-backdrop.jpg";
import africaMapImg from "@/assets/africa-map-silhouette.png";

const steps = [
  { label: "Nominate", icon: Trophy, desc: "Communities propose schools" },
  { label: "Vote", icon: Vote, desc: "Public selects winners via AGC" },
  { label: "Intervene", icon: Heart, desc: "EduAid-Africa delivers upgrades" },
];

const regionPlaceholders = [
  "West Africa", "East Africa", "Southern Africa", "Central Africa", "North Africa",
];

export function LegacyImpactSection() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      {/* Full-bleed backdrop image */}
      <div className="absolute inset-0 z-0">
        <img
          src={legacyRebuildImg}
          alt="Inclusive classroom in Africa"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Africa Map watermark */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <img src={africaMapImg} alt="" className="w-[500px] h-auto opacity-[0.04]" aria-hidden="true" />
      </div>

      {/* Gold divider top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />

      <div className="container relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Label */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold mb-8 tracking-widest uppercase">
            Post-Award Legacy
          </span>

          {/* Headline */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Rebuild My School <span className="text-primary">Africa</span>
          </h2>

          {/* Trust statement */}
          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            One special needs school per region — nominated, voted, and transformed through EduAid-Africa.
          </p>

          {/* 3-step strip */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto mb-8">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <step.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-white text-sm font-semibold">{step.label}</span>
                <span className="text-white/50 text-[11px] leading-tight hidden sm:block">{step.desc}</span>
              </div>
            ))}
          </div>

          {/* 5-region placeholder grid */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {regionPlaceholders.map((r) => (
              <span
                key={r}
                className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/60"
              >
                {r}
              </span>
            ))}
          </div>

          {/* AGC Points info strip */}
          <p className="text-white/50 text-xs mb-8 max-w-xl mx-auto leading-relaxed">
            Every item you purchase helps fund EduAid-Africa + SCEF services, including Rebuild My School (2026–2027).{" "}
            <span className="text-primary/80">Earn AGC points for voting and supporting your region!</span>
          </p>

          {/* Primary CTA + Nominate + Ambassador */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button asChild className="rounded-full gap-2.5 font-semibold bg-primary hover:bg-primary/90 text-secondary px-8 py-3 text-base shadow-lg shadow-primary/20">
              <Link to="/rebuild">
                Explore Rebuild My School Africa
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-3">
            <Button asChild variant="outline" className="rounded-full gap-2 text-sm border-white/20 text-white/80 hover:bg-white/5">
              <Link to="/rebuild#nominate">
                <School className="h-4 w-4" />
                Nominate a School in Your Country
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full gap-2 text-sm border-primary/30 text-primary hover:bg-primary/10">
              <Link to="/ambassadors">
                <Users className="h-4 w-4" />
                Become an Ambassador
              </Link>
            </Button>
          </div>

          {/* Subtle attribution */}
          <p className="text-white/25 text-xs mt-16 tracking-wide">
            A post-award legacy initiative of Santos Creations Educational Foundation
          </p>
        </motion.div>
      </div>

      {/* Gold divider bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />
    </section>
  );
}
