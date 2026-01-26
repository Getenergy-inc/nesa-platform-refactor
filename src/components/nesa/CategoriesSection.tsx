import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Building2, Building, Laptop, Radio, Heart, Users, FlaskConical,
  Palette, MapPin, BookOpen, Microscope, Church, Moon, Landmark,
  Globe, Plane, Crown, ChevronRight, Sparkles
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

// Scope badge config with fun emojis
const scopeBadgeConfig: Record<CategoryScope, { label: string; className: string; emoji: string }> = {
  AFRICA_REGIONAL: { label: "Africa Regional", className: "bg-green-500/20 text-green-400 border-green-500/30", emoji: "🌍" },
  NIGERIA: { label: "Nigeria", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", emoji: "🇳🇬" },
  INTERNATIONAL: { label: "International", className: "bg-blue-500/20 text-blue-400 border-blue-500/30", emoji: "🌐" },
  ICON: { label: "Lifetime", className: "bg-purple-500/20 text-purple-400 border-purple-500/30", emoji: "👑" },
};

// Get first 6 categories for display
const displayCategories = NESA_CATEGORIES.slice(0, 6);

export function CategoriesSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20 relative overflow-hidden">
      {/* Fun background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float-emoji">🏆</div>
        <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-float-emoji" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute top-1/2 left-1/4 text-4xl opacity-10 animate-float-emoji" style={{ animationDelay: '2s' }}>✨</div>
      </div>

      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-gold/20 to-purple-500/20 text-gold border-gold/30 animate-rainbow-border">
            <Sparkles className="w-3 h-3 mr-1" />
            17 Official Categories 🎯
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Award Categories <span className="animate-wiggle inline-block">🏅</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Recognizing excellence across education, corporate responsibility, technology, 
            and social impact throughout the African continent ✨
          </p>
        </motion.div>

        {/* Tier Legend with fun styling */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.entries(TIER_INFO).map(([key, tier], index) => (
            <motion.div 
              key={key} 
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 ${tier.bgColor} ${tier.borderColor} cursor-default hover:shadow-lg transition-all`}
            >
              <span className={`text-xs font-bold ${tier.color}`}>{tier.shortName}</span>
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
                  className="group block glass-dark rounded-2xl p-6 border-2 border-transparent hover:border-gold/50 transition-all hover:shadow-[0_0_30px_rgba(201,162,39,0.2)] hover-pop"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gold/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6 text-gold group-hover:animate-wiggle" />
                      </div>
                      <Badge variant="outline" className={`text-xs ${scopeBadge.className}`}>
                        {scopeBadge.emoji} {scopeBadge.label}
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
                      {cat.subcategories.length} subcategories ✨
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
              className="border-2 border-gold text-gold hover:bg-gold/20 rounded-full w-full sm:w-auto hover-pop transition-all group"
            >
              <Globe className="mr-2 h-4 w-4 group-hover:animate-wiggle" />
              Africa First Categories 🌍
            </Button>
          </Link>
          <Link to="/categories?view=nigeria">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 rounded-full w-full sm:w-auto hover-pop transition-all group"
            >
              <MapPin className="mr-2 h-4 w-4 group-hover:animate-wiggle" />
              Nigeria Categories 🇳🇬
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
