import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GOVERNANCE_STATS, REGIONAL_BRAND_MESSAGING } from "@/lib/regions";
import { useLiveStats } from "@/hooks/useLiveStats";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export function StatsStrip() {
  const { t } = useTranslation("pages");
  const { data: live } = useLiveStats();

  // Live values with safe fallbacks to governance constants while loading
  const categories = live?.categoryCount || GOVERNANCE_STATS.categories;
  const subcategories = live?.subcategoryCount || GOVERNANCE_STATS.subcategories;
  const judges = live?.judgeCount || GOVERNANCE_STATS.judges;

  const stats: Array<{
    value: string | number;
    label: string;
    color: string;
    subLabel?: string;
    suffix?: string;
    isCounter?: boolean;
  }> = [
    {
      value: "5+2",
      label: REGIONAL_BRAND_MESSAGING.shortTagline,
      color: "text-gold",
      subLabel: "Continental + Global",
    },
    {
      value: judges,
      label: "Expert Judges",
      color: "text-gold",
      isCounter: true,
    },
    {
      value: categories,
      label: t("landing.stats.categories"),
      color: "text-gold",
      isCounter: true,
    },
    {
      value: subcategories,
      label: t("landing.stats.subcategories"),
      color: "text-gold",
      isCounter: true,
      suffix: "+",
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
              className="group text-center p-4 md:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
            >
              <p className={`text-3xl md:text-5xl font-bold ${stat.color} mb-2`}>
                {stat.isCounter ? (
                  <AnimatedCounter value={Number(stat.value)} suffix={stat.suffix} />
                ) : (
                  stat.value
                )}
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
