import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GOVERNANCE_STATS, REGIONAL_BRAND_MESSAGING } from "@/lib/regions";

export function StatsStrip() {
  const { t } = useTranslation("pages");
  
  // Stats reconciled (Phase 1): regions split clearly into 8 intervention + 10 engagement.
  // Reference: REGIONAL_BRAND_MESSAGING retained for tooling/back-compat (not rendered).
  void REGIONAL_BRAND_MESSAGING;
  const stats = [
    {
      value: "10",
      label: "Engagement Regions",
      color: "text-gold",
      subLabel: "8 Intervention + Diaspora + Friends of Africa",
    },
    {
      value: String(GOVERNANCE_STATS.judges),
      label: "Expert Judges",
      color: "text-gold",
    },
    {
      value: "22",
      label: t("landing.stats.categories"),
      color: "text-gold",
      subLabel: `${GOVERNANCE_STATS.subcategories}+ sub-categories`,
    },
    {
      value: "1,760+",
      label: "Existing Nominees",
      color: "text-gold",
    },
  ];

  return (
    <section className="bg-charcoal border-y border-gold/20 py-12 overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group text-center p-4 md:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all duration-300"
            >
              <p className={`text-3xl md:text-5xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </p>
              <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                {stat.label}
              </p>
              {stat.subLabel && (
                <p className="text-xs text-white/40 mt-1">{stat.subLabel}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
