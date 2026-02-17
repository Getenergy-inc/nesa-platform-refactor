import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ChevronRight, Globe, MapPin, GraduationCap, Crown, Star, Trophy
} from "lucide-react";
import {
  getCategoriesGrouped,
  TIER_INFO,
  type CategoryDefinition,
} from "@/config/nesaCategories";
import { categoryIconMap } from "@/config/categoryIconMap";
import { getCategoryImage } from "@/config/categoryImages";

const groups = getCategoriesGrouped();

// Scope badge styles
const scopeStyles: Record<string, { label: string; className: string }> = {
  AFRICA_REGIONAL: { label: "Africa", className: "border-emerald-500/30 text-emerald-400" },
  NIGERIA: { label: "Nigeria", className: "border-orange-500/30 text-orange-400" },
  INTERNATIONAL: { label: "International", className: "border-blue-500/30 text-blue-400" },
  ICON: { label: "Lifetime", className: "border-purple-500/30 text-purple-400" },
};

function CategoryCard({ cat, accent }: { cat: CategoryDefinition; accent: string }) {
  const Icon = categoryIconMap[cat.iconName] || GraduationCap;
  const scope = scopeStyles[cat.scope] || scopeStyles.AFRICA_REGIONAL;
  const catImage = getCategoryImage(cat.slug);

  return (
    <Link
      to={`/categories/${cat.slug}`}
      className="group block bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-gold/40 transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-32 w-full overflow-hidden">
        {catImage ? (
          <img src={catImage} alt={cat.shortName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className={`w-full h-full ${accent} flex items-center justify-center`}>
            <Icon className="h-12 w-12 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 backdrop-blur-sm bg-black/40 ${scope.className}`}>
            {scope.label}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-3">
          <div className="h-8 w-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <Icon className="h-4 w-4 text-gold" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-gold transition-colors line-clamp-2 mb-1">
          {cat.shortName}
        </h3>
        <p className="text-white/50 text-xs line-clamp-2 mb-3">{cat.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-xs">{cat.subcategories.length} subcategories</span>
          <div className="flex items-center gap-1 text-xs text-white/40 group-hover:text-gold transition-colors">
            <span>View</span>
            <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function TierGroupHeader({ icon: IconComp, title, subtitle, count, color }: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; subtitle: string; count: number; color: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center`}>
          <IconComp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-white">{title}</h3>
          <p className="text-white/50 text-sm">{subtitle} · {count} {count === 1 ? "category" : "categories"}</p>
        </div>
      </div>
    </div>
  );
}

export function CategoriesSection() {
  const { t } = useTranslation("pages");

  return (
    <section className="bg-charcoal py-16 md:py-24 relative overflow-hidden">
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
            {t("landing.categories.badge")}
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.categories.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t("landing.categories.description")}
          </p>
        </motion.div>

        {/* Tier Quick Links */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.entries(TIER_INFO).map(([key, tier], index) => (
            <motion.div key={key} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.08 }} viewport={{ once: true }}>
              <Link
                to={`/awards/${key}`}
                className={`group flex items-center gap-2 rounded-full border px-4 py-2 ${tier.bgColor} ${tier.borderColor} hover:scale-105 active:scale-95 transition-all duration-200`}
              >
                <span className={`text-xs font-semibold ${tier.color}`}>{tier.shortName}</span>
                <ChevronRight className={`h-3 w-3 ${tier.color} opacity-0 group-hover:opacity-100 transition-all`} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ═══ GROUP 1: BLUE GARNET — Competitive Excellence ═══ */}
        <motion.div className="mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <TierGroupHeader icon={Trophy} title="Blue Garnet — Competitive Excellence" subtitle="Public voting → Jury evaluation" count={groups.blueGarnet.length} color="bg-blue-600" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.blueGarnet.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <CategoryCard cat={cat} accent="bg-blue-500/10" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ GROUP 2: PLATINUM — Institutional Leadership ═══ */}
        <motion.div className="mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <TierGroupHeader icon={GraduationCap} title="Platinum — Institutional Leadership" subtitle="NRC verification · Elevated institutional recognition" count={groups.platinum.length} color="bg-slate-500" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.platinum.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <CategoryCard cat={cat} accent="bg-slate-500/10" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ GROUP 3: LIFETIME — Icon Award ═══ */}
        <motion.div className="mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <TierGroupHeader icon={Crown} title="Africa Education Icon — Lifetime Achievement" subtitle="Jury selection only · 2005–2025" count={groups.lifetime.length} color="bg-purple-600" />
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-5 max-w-3xl">
            {groups.lifetime.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <CategoryCard cat={cat} accent="bg-purple-500/10" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ GROUP 4: GOLD SPECIAL RECOGNITION — 2025 Edition ═══ */}
        {groups.goldSpecial.length > 0 && (
          <motion.div className="mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <TierGroupHeader icon={Star} title="Gold Special Recognition — 2025 Edition" subtitle="Cultural impact recognition" count={groups.goldSpecial.length} color="bg-yellow-600" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {groups.goldSpecial.map((cat, i) => (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                  <CategoryCard cat={cat} accent="bg-yellow-500/10" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div className="flex flex-col sm:flex-row justify-center gap-4 mt-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Link to="/categories?view=africa">
            <Button variant="outline" size="lg" className="border-2 border-gold text-gold hover:bg-gold/10 rounded-full w-full sm:w-auto">
              <Globe className="mr-2 h-4 w-4" />
              {t("landing.categories.africaFirst")}
            </Button>
          </Link>
          <Link to="/categories?view=nigeria">
            <Button variant="outline" size="lg" className="border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 rounded-full w-full sm:w-auto">
              <MapPin className="mr-2 h-4 w-4" />
              {t("landing.categories.nigeriaCategories")}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
