import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Building2, Building, Laptop, Radio, Heart, Users, FlaskConical,
  Palette, MapPin, BookOpen, Microscope, Church, Moon, Landmark,
  Globe, Plane, Crown, ChevronRight
} from "lucide-react";
import {
  NESA_CATEGORIES,
  TIER_INFO,
  type CategoryScope,
} from "@/config/nesaCategories";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Building,
  Laptop,
  Radio,
  Heart,
  Users,
  FlaskConical,
  Palette,
  MapPin,
  BookOpen,
  Microscope,
  Church,
  Moon,
  Landmark,
  Globe,
  Plane,
  Crown,
};

// Get first 6 categories for display
const displayCategories = NESA_CATEGORIES.slice(0, 6);

export function CategoriesSection() {
  const { t } = useTranslation("pages");

  // Scope badge config with translations
  const scopeBadgeConfig: Record<CategoryScope, { labelKey: string; className: string }> = {
    AFRICA_REGIONAL: { labelKey: "landing.categories.scopes.africaRegional", className: "bg-green-500/20 text-green-400 border-green-500/30" },
    NIGERIA: { labelKey: "landing.categories.scopes.nigeria", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    INTERNATIONAL: { labelKey: "landing.categories.scopes.international", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    ICON: { labelKey: "landing.categories.scopes.lifetime", className: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  };

  return (
    <section className="bg-charcoal py-16 md:py-20 relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
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

        {/* Tier Legend - Clickable CTAs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.entries(TIER_INFO).map(([key, tier], index) => (
            <motion.div 
              key={key} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/awards/${key}`}
                className={`group flex items-center gap-2 rounded-full border px-4 py-2 ${tier.bgColor} ${tier.borderColor} hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer`}
              >
                <span className={`text-xs font-semibold ${tier.color} group-hover:brightness-125 transition-all`}>
                  {tier.shortName}
                </span>
                <ChevronRight className={`h-3 w-3 ${tier.color} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`} />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((cat, index) => {
            const Icon = iconMap[cat.iconName] || Building2;
            const scopeBadge = scopeBadgeConfig[cat.scope];
            
            // Determine primary tier
            let tierKey: keyof typeof TIER_INFO = "gold";
            if (cat.tierApplicability.icon) tierKey = "icon";
            else if (cat.tierApplicability.blueGarnet) tierKey = "blue-garnet";
            else if (cat.tierApplicability.platinum && !cat.tierApplicability.gold) tierKey = "platinum";
            
            const tier = TIER_INFO[tierKey];

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/categories/${cat.slug}`}
                  className="group block bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-gold/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <Icon className="h-6 w-6 text-gold" />
                      </div>
                      <Badge variant="outline" className={`text-xs ${scopeBadge.className}`}>
                        {t(scopeBadge.labelKey)}
                      </Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2 group-hover:text-gold transition-colors">
                    {cat.shortName}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-2 mb-4">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${tier.bgColor} ${tier.color} border-0`}
                    >
                      {tier.shortName}
                    </Badge>
                    <span className="text-xs text-white/50">
                      {t("landing.categories.subcategoriesCount", { count: cat.subcategories.length })}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link to="/categories?view=africa">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gold text-gold hover:bg-gold/10 rounded-full w-full sm:w-auto transition-all group"
            >
              <Globe className="mr-2 h-4 w-4" />
              {t("landing.categories.africaFirst")}
            </Button>
          </Link>
          <Link to="/categories?view=nigeria">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 rounded-full w-full sm:w-auto transition-all group"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {t("landing.categories.nigeriaCategories")}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
