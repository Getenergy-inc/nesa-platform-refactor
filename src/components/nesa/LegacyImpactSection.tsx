import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import legacyRebuildImg from "@/assets/rebuild/rebuild-school-backdrop.jpg";
import africaMapImg from "@/assets/africa-map-silhouette.png";

export function LegacyImpactSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-secondary">
      {/* Documentary image — subtle right-side accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 z-0 hidden lg:block">
        <img
          src={legacyRebuildImg}
          alt="Inclusive classroom in Africa"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/40" />
      </div>

      {/* Africa Map watermark */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <img src={africaMapImg} alt="" className="w-[500px] h-auto opacity-[0.03]" aria-hidden="true" />
      </div>

      {/* Gold divider top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Label */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-ivory/5 border border-ivory/10 text-ivory/50 text-xs font-medium mb-8 tracking-widest uppercase">
            Post-Award Legacy • SCEF Social Impact
          </span>

          {/* Headline */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ivory mb-6 leading-tight">
            Rebuild My School Africa
          </h2>

          {/* Single paragraph */}
          <p className="text-ivory/55 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-4">
            One special needs school per African region — nominated by communities,
            selected through public voting, and transformed through EduAid-Africa.
          </p>

          <p className="text-ivory/40 text-base italic mb-12">
            Recognition becomes real impact.
          </p>

          {/* Single gold CTA */}
          <Button asChild className="rounded-full gap-2.5 font-semibold bg-primary hover:bg-primary/90 text-secondary px-8 py-3 text-base">
            <Link to="/rebuild">
              Explore Rebuild My School Africa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {/* Subtle attribution */}
          <p className="text-ivory/20 text-xs mt-16 tracking-wide">
            A post-award legacy initiative of Santos Creations Educational Foundation
          </p>
        </motion.div>
      </div>

      {/* Gold divider bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </section>
  );
}
