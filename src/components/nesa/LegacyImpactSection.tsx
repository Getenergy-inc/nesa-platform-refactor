import { ArrowRight, School } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import legacyRebuildImg from "@/assets/rebuild/rebuild-school-backdrop.jpg";
import africaMapImg from "@/assets/africa-map-silhouette.png";

export function LegacyImpactSection() {
  const { t } = useTranslation("pages");

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={legacyRebuildImg} alt="Inclusive classroom in Africa" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
        <img src={africaMapImg} alt="" className="w-[500px] h-auto opacity-[0.04]" aria-hidden="true" />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />

      <div className="container relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold mb-8 tracking-widest uppercase">
            {t("landing.legacyImpact.badge")}
          </span>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {t("landing.legacyImpact.title")} <span className="text-primary">{t("landing.legacyImpact.titleAccent")}</span>
          </h2>

          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            {t("landing.legacyImpact.description")}
          </p>

          <Button asChild className="rounded-full gap-2.5 font-semibold bg-primary hover:bg-primary/90 text-secondary px-8 py-3 text-base shadow-lg shadow-primary/20">
            <Link to="/rebuild">
              {t("landing.legacyImpact.cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <p className="text-white/25 text-xs mt-16 tracking-wide">
            {t("landing.legacyImpact.attribution")}
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />
    </section>
  );
}