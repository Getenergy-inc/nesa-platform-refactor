import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function StatsStrip() {
  const { t } = useTranslation("pages");
  
  const stats = [
    { value: "54", label: "African Countries", color: "text-gold" },
    { value: "5", label: "Regions + Diaspora", color: "text-gold" },
    { value: "17", label: t("landing.stats.categories"), color: "text-gold" },
    { value: "141+", label: t("landing.stats.subcategories"), color: "text-gold" },
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
              <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
