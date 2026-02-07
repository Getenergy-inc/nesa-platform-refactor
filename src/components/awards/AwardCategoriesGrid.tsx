import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Globe, Sparkles, GraduationCap, BookOpen, Landmark, FlaskConical, Palette, MapPin, Library, Microscope, Church, Moon, Users, Award, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/awardData";

// Map category titles to icons and slugs
const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; slug: string; scope: "africa" | "nigeria" }> = {
  "Best CSR in Education (Africa Regional)": { icon: Building2, slug: "csr-education-africa", scope: "africa" },
  "Best CSR in Education (Nigeria)": { icon: Building2, slug: "csr-education-nigeria", scope: "nigeria" },
  "Best EduTech Organisation (Africa Regional)": { icon: Sparkles, slug: "edutech-africa", scope: "africa" },
  "Best Media Organisation in Educational Advocacy (Nigeria)": { icon: Globe, slug: "media-advocacy-nigeria", scope: "nigeria" },
  "Best NGO Contribution to Education (Nigeria)": { icon: Heart, slug: "ngo-education-nigeria", scope: "nigeria" },
  "Best NGO Contribution to Education for All (Africa Regional)": { icon: Heart, slug: "ngo-education-africa", scope: "africa" },
  "Best STEM Education Programme (Africa Regional)": { icon: FlaskConical, slug: "stem-education-africa", scope: "africa" },
  "Creative Arts Industry Contribution to Education (Nigeria)": { icon: Palette, slug: "creative-arts-nigeria", scope: "nigeria" },
  "Best Education-Friendly State (Nigeria)": { icon: MapPin, slug: "education-friendly-state-nigeria", scope: "nigeria" },
  "Best Library in Nigerian Tertiary Institutions": { icon: Library, slug: "library-nigeria", scope: "nigeria" },
  "Best Research & Development Contribution to Education (Nigeria)": { icon: Microscope, slug: "research-development-nigeria", scope: "nigeria" },
  "Christian Education Impact (Africa Regional)": { icon: Church, slug: "christian-education-africa", scope: "africa" },
  "Islamic Education Impact (Africa Regional)": { icon: Moon, slug: "islamic-education-africa", scope: "africa" },
  "Outstanding Political Leader Contribution to Education (Nigeria)": { icon: Landmark, slug: "political-leaders-nigeria", scope: "nigeria" },
  "International Education Contribution to Africa": { icon: Globe, slug: "international-education", scope: "africa" },
  "African Diaspora Education Contribution": { icon: Users, slug: "diaspora-education", scope: "africa" },
  "Africa Education Icon": { icon: Award, slug: "africa-education-icon", scope: "africa" },
};

// Tier applicability for each category (simplified for display)
const TIER_APPLICABILITY: Record<string, { platinum: boolean; gold: boolean; blueGarnet: boolean; icon: boolean }> = {
  "Best CSR in Education (Africa Regional)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Best CSR in Education (Nigeria)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Best EduTech Organisation (Africa Regional)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Best Media Organisation in Educational Advocacy (Nigeria)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Best NGO Contribution to Education (Nigeria)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Best NGO Contribution to Education for All (Africa Regional)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Best STEM Education Programme (Africa Regional)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Creative Arts Industry Contribution to Education (Nigeria)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Best Education-Friendly State (Nigeria)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Best Library in Nigerian Tertiary Institutions": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Best Research & Development Contribution to Education (Nigeria)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Christian Education Impact (Africa Regional)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Islamic Education Impact (Africa Regional)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Outstanding Political Leader Contribution to Education (Nigeria)": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "International Education Contribution to Africa": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "African Diaspora Education Contribution": { platinum: true, gold: true, blueGarnet: true, icon: false },
  "Africa Education Icon": { platinum: false, gold: false, blueGarnet: true, icon: true },
};

interface AwardCategoriesGridProps {
  /** Filter categories by tier applicability */
  tier?: "platinum" | "gold" | "blue-garnet" | "icon";
  /** Accent color for styling */
  accentColor?: "slate" | "amber" | "blue" | "purple";
  /** Title override */
  title?: string;
  /** Description override */
  description?: string;
}

const accentStyles = {
  slate: {
    badgeBg: "bg-slate-500/10",
    badgeText: "text-slate-400",
    badgeBorder: "border-slate-500/30",
    hoverBorder: "hover:border-slate-400/50",
    iconColor: "text-slate-400",
  },
  amber: {
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    badgeBorder: "border-amber-500/30",
    hoverBorder: "hover:border-amber-400/50",
    iconColor: "text-amber-400",
  },
  blue: {
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-400",
    badgeBorder: "border-blue-500/30",
    hoverBorder: "hover:border-blue-400/50",
    iconColor: "text-blue-400",
  },
  purple: {
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-400",
    badgeBorder: "border-purple-500/30",
    hoverBorder: "hover:border-purple-400/50",
    iconColor: "text-purple-400",
  },
};

export function AwardCategoriesGrid({
  tier,
  accentColor = "amber",
  title = "Award Categories",
  description = "Explore all 17 official NESA-Africa categories eligible for this award tier.",
}: AwardCategoriesGridProps) {
  const styles = accentStyles[accentColor];

  // Filter categories based on tier applicability
  const filteredCategories = categories.filter((cat) => {
    const tierConfig = TIER_APPLICABILITY[cat.title];
    if (!tierConfig) return true; // Show all if no config
    
    switch (tier) {
      case "platinum":
        return tierConfig.platinum;
      case "gold":
        return tierConfig.gold;
      case "blue-garnet":
        return tierConfig.blueGarnet;
      case "icon":
        return tierConfig.icon;
      default:
        return true;
    }
  });

  // Get subcategory count for a category
  const getSubcategoryCount = (category: typeof categories[0]): number => {
    if (category.subCategories) {
      return category.subCategories.length;
    }
    if (category.regions) {
      return category.regions.reduce((acc, region) => acc + region.subCategories.length, 0);
    }
    return 0;
  };

  return (
    <section className="bg-charcoal py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className={`${styles.badgeBg} ${styles.badgeText} ${styles.badgeBorder} mb-4`}>
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
            {filteredCategories.length} Categories
          </Badge>
          <h2 className="font-display text-3xl font-bold text-white mb-4">{title}</h2>
          <p className="text-white/60 max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((category, index) => {
            const config = CATEGORY_CONFIG[category.title];
            if (!config) return null;
            
            const Icon = config.icon;
            const subcategoryCount = getSubcategoryCount(category);

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  to={`/category/${config.slug}`}
                  className={`group flex flex-col h-full p-5 rounded-xl border border-white/10 bg-white/5 ${styles.hoverBorder} hover:bg-white/10 transition-all duration-300`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-lg ${styles.badgeBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-5 w-5 ${styles.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-gold transition-colors line-clamp-2">
                        {category.title.replace(" (Africa Regional)", "").replace(" (Nigeria)", "")}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] px-1.5 py-0 ${config.scope === "africa" ? "border-emerald-500/30 text-emerald-400" : "border-orange-500/30 text-orange-400"}`}
                        >
                          {config.scope === "africa" ? "Africa" : "Nigeria"}
                        </Badge>
                        <span className="text-white/40 text-xs">{subcategoryCount} subcategories</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white/50 text-xs line-clamp-2 flex-1 mb-3">
                    {category.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-white/40 group-hover:text-gold transition-colors mt-auto">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/categories"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border ${styles.badgeBorder} ${styles.badgeText} hover:bg-white/5 transition-colors`}
          >
            <BookOpen className="h-4 w-4" />
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AwardCategoriesGrid;
