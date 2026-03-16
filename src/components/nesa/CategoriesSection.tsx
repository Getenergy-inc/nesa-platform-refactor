import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ChevronRight, GraduationCap, Crown, Star, Trophy, Shield,
} from "lucide-react";
import {
  getCategoriesGrouped,
  type CategoryDefinition,
} from "@/config/nesaCategories";
import { categoryIconMap } from "@/config/categoryIconMap";
import { getCategoryImage } from "@/config/categoryImages";

const groups = getCategoriesGrouped();

// Scope badge styles
const scopeStyles: Record<string, { label: string; className: string }> = {
  AFRICA_REGIONAL: { label: "Africa Regional", className: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" },
  NIGERIA: { label: "Nigeria", className: "border-orange-500/30 text-orange-400 bg-orange-500/10" },
  INTERNATIONAL: { label: "International", className: "border-blue-500/30 text-blue-400 bg-blue-500/10" },
  ICON: { label: "Lifetime", className: "border-purple-500/30 text-purple-400 bg-purple-500/10" },
};

const tierBadgeStyles: Record<string, { label: string; className: string }> = {
  "blue-garnet": { label: "Blue Garnet", className: "border-blue-500/30 text-blue-400 bg-blue-500/10" },
  platinum: { label: "Platinum", className: "border-slate-400/30 text-slate-300 bg-slate-500/10" },
  "gold-special": { label: "Gold Special 2025", className: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" },
  icon: { label: "Lifetime", className: "border-purple-500/30 text-purple-400 bg-purple-500/10" },
};

function getPrimaryTier(cat: CategoryDefinition): string {
  if (cat.tierApplicability.icon) return "icon";
  if (cat.tierApplicability.goldSpecial) return "gold-special";
  if (cat.tierApplicability.blueGarnet) return "blue-garnet";
  return "platinum";
}

function CategoryCard({ cat }: { cat: CategoryDefinition }) {
  const Icon = categoryIconMap[cat.iconName] || GraduationCap;
  const scope = scopeStyles[cat.scope] || scopeStyles.AFRICA_REGIONAL;
  const tier = tierBadgeStyles[getPrimaryTier(cat)];
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
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <Icon className="h-12 w-12 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 backdrop-blur-sm ${scope.className}`}>
            {scope.label}
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 backdrop-blur-sm ${tier.className}`}>
            {tier.label}
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
          {cat.name}
        </h3>
        <p className="text-white/50 text-xs line-clamp-2 mb-3">{cat.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-white/40 text-xs">
            {cat.subcategories.length > 0 ? `${cat.subcategories.length} subcategories` : ""}
          </span>
          <div className="flex items-center gap-1 text-xs text-white/40 group-hover:text-gold transition-colors">
            <span>{cat.subcategories.length > 0 ? "View Subcategories" : "Explore"}</span>
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

        {/* ═══ GROUP 1: LIFETIME — Icon Award ═══ */}
        <motion.div className="mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <TierGroupHeader icon={Crown} title="Africa Education Icon — Lifetime Achievement" subtitle="Jury selection only · 2005–2025" count={groups.lifetime.length} color="bg-purple-600" />
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-5 max-w-3xl">
            {groups.lifetime.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}>
                <CategoryCard cat={cat} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ GROUP 2: BLUE GARNET — Competitive Excellence ═══ */}
        <motion.div className="mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <TierGroupHeader icon={Trophy} title="Blue Garnet — Competitive Excellence" subtitle="Public voting → Jury evaluation" count={groups.blueGarnet.length} color="bg-blue-600" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.blueGarnet.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}>
                <CategoryCard cat={cat} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ GROUP 3: PLATINUM — Institutional Leadership ═══ */}
        <motion.div className="mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <TierGroupHeader icon={Shield} title="Platinum — Institutional Leadership" subtitle="NRC verification · Governance criteria" count={groups.platinum.length} color="bg-slate-500" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.platinum.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}>
                <CategoryCard cat={cat} />
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
                <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}>
                  <CategoryCard cat={cat} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div className="flex flex-col sm:flex-row justify-center gap-4 mt-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Link to="/categories">
            <Button variant="outline" size="lg" className="border-2 border-gold text-gold hover:bg-gold/10 rounded-full w-full sm:w-auto">
              View All Categories
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
