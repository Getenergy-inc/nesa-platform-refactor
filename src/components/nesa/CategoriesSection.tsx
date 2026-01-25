import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Scope badge config
const scopeBadgeConfig: Record<CategoryScope, { label: string; className: string }> = {
  AFRICA_REGIONAL: { label: "Africa Regional", className: "bg-green-100 text-green-800" },
  NIGERIA: { label: "Nigeria", className: "bg-emerald-100 text-emerald-800" },
  INTERNATIONAL: { label: "International", className: "bg-blue-100 text-blue-800" },
  ICON: { label: "Lifetime", className: "bg-purple-100 text-purple-800" },
};

// Get first 6 categories for display
const displayCategories = NESA_CATEGORIES.slice(0, 6);

export function CategoriesSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
            17 Official Categories
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Award Categories
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Recognizing excellence across education, corporate responsibility, technology, 
            and social impact throughout the African continent.
          </p>
        </div>

        {/* Tier Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.entries(TIER_INFO).map(([key, tier]) => (
            <div 
              key={key} 
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${tier.bgColor} ${tier.borderColor}`}
            >
              <span className={`text-xs font-medium ${tier.color}`}>{tier.shortName}</span>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((cat) => {
            const Icon = iconMap[cat.iconName] || Building2;
            const scopeBadge = scopeBadgeConfig[cat.scope];
            
            // Determine primary tier
            let tierKey: keyof typeof TIER_INFO = "gold";
            if (cat.tierApplicability.icon) tierKey = "icon";
            else if (cat.tierApplicability.blueGarnet) tierKey = "blue-garnet";
            else if (cat.tierApplicability.platinum && !cat.tierApplicability.gold) tierKey = "platinum";
            
            const tier = TIER_INFO[tierKey];

            return (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="group bg-charcoal-light rounded-xl p-6 border border-gold/20 hover:border-gold/40 transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <Badge variant="outline" className={`text-xs ${scopeBadge.className} border-0`}>
                      {scopeBadge.label}
                    </Badge>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-gold transition-colors" />
                </div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-gold transition-colors">
                  {cat.shortName}
                </h3>
                <p className="text-white/70 text-sm line-clamp-2 mb-3">
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
                    {cat.subcategories.length} subcategories
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Link to="/categories?view=africa">
            <Button
              variant="outline"
              size="lg"
              className="border-gold text-gold hover:bg-gold/10 rounded-full w-full sm:w-auto"
            >
              <Globe className="mr-2 h-4 w-4" />
              Africa First Categories
            </Button>
          </Link>
          <Link to="/categories?view=nigeria">
            <Button
              variant="outline"
              size="lg"
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 rounded-full w-full sm:w-auto"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Nigeria Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
