import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, BookOpen, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TIER_INFO, type AwardTier } from "@/config/nesaCategories";
import { categoryIconMap } from "@/config/categoryIconMap";
import { getCategoryImage } from "@/config/categoryImages";
import {
  useCategoriesByTier,
  type CategoryWithMetadata,
} from "@/hooks/useCategories";

interface AwardCategoriesGridProps {
  /** Filter categories by tier applicability */
  tier: AwardTier;
  /** Accent color for styling */
  accentColor?: "slate" | "amber" | "blue" | "purple" | "yellow";
  /** Title override */
  title?: string;
  /** Description override */
  description?: string;
}

const accentStyles: Record<
  string,
  {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    hoverBorder: string;
    iconColor: string;
  }
> = {
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
  yellow: {
    badgeBg: "bg-yellow-500/10",
    badgeText: "text-yellow-400",
    badgeBorder: "border-yellow-500/30",
    hoverBorder: "hover:border-yellow-400/50",
    iconColor: "text-yellow-400",
  },
};

// Scope badge styles
const scopeStyles: Record<string, { label: string; className: string }> = {
  AFRICA_REGIONAL: {
    label: "Africa",
    className: "border-emerald-500/30 text-emerald-400",
  },
  NIGERIA: {
    label: "Nigeria",
    className: "border-orange-500/30 text-orange-400",
  },
  INTERNATIONAL: {
    label: "International",
    className: "border-blue-500/30 text-blue-400",
  },
  ICON: {
    label: "Lifetime",
    className: "border-purple-500/30 text-purple-400",
  },
};

export function AwardCategoriesGrid({
  tier,
  accentColor = "amber",
  title,
  description,
}: AwardCategoriesGridProps) {
  const styles = accentStyles[accentColor];
  const tierInfo = TIER_INFO[tier];

  // Use the hook to fetch categories from backend
  const { data: categories, isLoading, error } = useCategoriesByTier(tier);

  // Generate dynamic title and description if not provided
  const displayTitle = title || `${tierInfo.shortName} Award Categories`;
  const displayDescription =
    description ||
    `Explore all ${categories?.length || 0} official NESA-Africa categories eligible for the ${tierInfo.shortName} award tier.`;

  if (isLoading) {
    return (
      <section className="bg-charcoal py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-white/60" />
          <p className="text-white/60 mt-4">Loading categories...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-charcoal py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-400">
            Error loading categories. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="bg-charcoal py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <GraduationCap className="h-12 w-12 mx-auto text-white/20 mb-4" />
          <p className="text-white/60">No categories found for this tier.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-charcoal py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            className={`${styles.badgeBg} ${styles.badgeText} ${styles.badgeBorder} mb-4`}
          >
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
            {categories.length}{" "}
            {categories.length === 1 ? "Category" : "Categories"}
          </Badge>
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            {displayTitle}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            {displayDescription}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              styles={styles}
              parentTier={tier}
            />
          ))}
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

// Extracted card component for cleaner code
function CategoryCard({
  category,
  index,
  styles,
  parentTier,
}: {
  category: CategoryWithMetadata;
  index: number;
  styles: typeof accentStyles.amber;
  parentTier: AwardTier;
}) {
  // Map icon based on category title or use default
  const Icon = categoryIconMap[category.title] || GraduationCap;

  // Determine scope style
  const scopeStyle =
    scopeStyles[category.scope as keyof typeof scopeStyles] ||
    scopeStyles.AFRICA_REGIONAL;

  // Use the image from backend or fallback to config
  const categoryImage = category.image || getCategoryImage(category.id);

  // Use the subcategoryCount from metadata
  const subcategoryCount = category.subcategoryCount;

  // Create a slug from title for URL (or use ID)
  const categorySlug = category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        to={`/category/${category.id}`} // Using ID for reliability
        className={`group flex flex-col h-full rounded-xl border border-white/10 bg-white/5 ${styles.hoverBorder} hover:bg-white/10 transition-all duration-300 overflow-hidden`}
      >
        {/* Image Header */}
        <div className="relative h-32 w-full overflow-hidden">
          {categoryImage ? (
            <img
              src={categoryImage}
              alt={category.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div
              className={`w-full h-full ${styles.badgeBg} flex items-center justify-center`}
            >
              <Icon className={`h-12 w-12 ${styles.iconColor} opacity-40`} />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />

          {/* Scope badge on image */}
          <div className="absolute top-2 right-2">
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 backdrop-blur-sm bg-black/40 ${scopeStyle.className}`}
            >
              {scopeStyle.label}
            </Badge>
          </div>

          {/* Tier badge on image */}
          <div className="absolute top-2 left-2">
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 backdrop-blur-sm ${styles.badgeBg} ${styles.badgeText} ${styles.badgeBorder}`}
            >
              {TIER_INFO[parentTier].shortName}
            </Badge>
          </div>

          {/* Icon overlay */}
          <div className="absolute bottom-2 left-3">
            <div
              className={`h-8 w-8 rounded-lg ${styles.badgeBg} backdrop-blur-sm flex items-center justify-center`}
            >
              <Icon className={`h-4 w-4 ${styles.iconColor}`} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-gold transition-colors line-clamp-2 mb-1.5">
            {category.title}
          </h3>

          <p className="text-white/50 text-xs line-clamp-2 flex-1 mb-3">
            {category.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-white/40 text-xs">
              {subcategoryCount > 0 ? `${subcategoryCount} subcategories` : ""}
            </span>
            <div className="flex items-center gap-1 text-xs text-white/40 group-hover:text-gold transition-colors">
              <span>
                {subcategoryCount > 0 ? "View Subcategories" : "Explore"}
              </span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default AwardCategoriesGrid;
