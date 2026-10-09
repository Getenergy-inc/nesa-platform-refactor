import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { REGIONAL_BRAND_MESSAGING } from "@/lib/regions";
import { useSiteStats } from "@/config/siteStats";

export function StatsStrip() {
  const { t } = useTranslation("pages");
  const s = useSiteStats();

  // Public stat framing — dual count per governance decision:
  // 18 nomination forms map to 22 conceptual categories (Icon + Influencer
  // each collapse 3 pathways into 1 form). Both surfaced so visitors and
  // developers see the same source of truth.
  const stats = [
    {
      value: String(s.forms),
      label: "Nomination Forms",
      color: "text-gold",
      subLabel: `${s.categories} conceptual categories`,
    },
    {
      value: `${s.subcategories}+`,
      label: t("landing.stats.subcategories"),
      color: "text-gold",
      subLabel: "curated public subset",
    },
    {
      value: String(s.africanRegions),
      label: "Africa Regions",
      color: "text-gold",
      subLabel: `+${s.globalCommunities} global`,
    },
    {
      value: String(s.tiers),
      label: "Recognition Tiers",
      color: "text-gold",
      subLabel: REGIONAL_BRAND_MESSAGING.shortTagline,
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
