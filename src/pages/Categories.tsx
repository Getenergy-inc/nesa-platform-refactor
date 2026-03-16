import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Search,
  ChevronRight,
  GraduationCap,
  Trophy,
  Crown,
  Star,
  Shield,
  Loader2,
} from "lucide-react";
import { TIER_INFO } from "@/config/nesaCategories";
import { categoryIconMap } from "@/config/categoryIconMap";
import { getCategoryImage } from "@/config/categoryImages";
import {
  useCategoriesGrouped,
  type CategoryWithMetadata,
} from "@/hooks/useCategories";

// Scope badge styles
const scopeStyles: Record<string, { label: string; className: string }> = {
  AFRICA_REGIONAL: {
    label: "Africa Regional",
    className: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
  NIGERIA: {
    label: "Nigeria",
    className: "border-orange-500/30 text-orange-400 bg-orange-500/10",
  },
  INTERNATIONAL: {
    label: "International",
    className: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  },
  ICON: {
    label: "Lifetime",
    className: "border-purple-500/30 text-purple-400 bg-purple-500/10",
  },
};

// Tier badge styles for cards
const tierBadgeStyles: Record<string, { label: string; className: string }> = {
  "blue-garnet": {
    label: "Blue Garnet",
    className: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  },
  platinum: {
    label: "Platinum",
    className: "border-slate-400/30 text-slate-300 bg-slate-500/10",
  },
  "gold-special": {
    label: "Gold Special 2025",
    className: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  },
  lifetime: {
    label: "Lifetime",
    className: "border-purple-500/30 text-purple-400 bg-purple-500/10",
  },
};

// Map backend awardType to tier key
function getTierKeyFromAwardType(awardType: string): string {
  switch (awardType) {
    case "BLUE_GARNET_AND_GOLD_CERTIFICATE":
    case "GOLD_CERTIFICATE":
      return "blue-garnet";
    case "PLATINUM_CERTIFICATE":
      return "platinum";
    case "AFRICA_ICON_BLUE_GARNET":
      return "lifetime";
    case "GOLD_SPECIAL":
      return "gold-special";
    default:
      return "platinum";
  }
}

function CategoryCardSkeleton() {
  return (
    <div className="block bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden h-full">
      <div className="relative h-36 w-full overflow-hidden bg-white/5">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 bg-white/10" />
        <Skeleton className="h-3 w-full bg-white/10" />
        <Skeleton className="h-3 w-2/3 bg-white/10" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-20 bg-white/10" />
          <Skeleton className="h-3 w-24 bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  index,
}: {
  category: CategoryWithMetadata;
  index: number;
}) {
  const Icon = categoryIconMap[category.title] || GraduationCap;
  const scope = scopeStyles[category.scope] || scopeStyles.AFRICA_REGIONAL;
  const tierKey = getTierKeyFromAwardType(category.awardType);
  const tier = tierBadgeStyles[tierKey] || tierBadgeStyles.platinum;
  const categoryImage = category.image || getCategoryImage(category.id);
  const subcategoryCount = category.subCategories?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        to={`/category/${category.id}`}
        className="group block bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-gold/40 transition-all duration-300 overflow-hidden h-full"
      >
        {/* Image */}
        <div className="relative h-36 w-full overflow-hidden">
          {categoryImage ? (
            <img
              src={categoryImage}
              alt={category.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <Icon className="h-12 w-12 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-2 right-2 flex gap-1.5">
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 backdrop-blur-sm ${scope.className}`}
            >
              {scope.label}
            </Badge>
          </div>
          <div className="absolute top-2 left-2">
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 backdrop-blur-sm ${tier.className}`}
            >
              {tier.label}
            </Badge>
          </div>
          <div className="absolute bottom-2 left-3">
            <div className="h-8 w-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Icon className="h-4 w-4 text-gold" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-gold transition-colors line-clamp-2 mb-1">
            {category.title}
          </h3>
          <p className="text-white/50 text-xs line-clamp-2 mb-3">
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs">
              {subcategoryCount > 0
                ? `${subcategoryCount} subcategor${subcategoryCount === 1 ? "y" : "ies"}`
                : ""}
            </span>
            <div className="flex items-center gap-1 text-xs text-white/40 group-hover:text-gold transition-colors">
              <span>
                {subcategoryCount > 0 ? "View Subcategories" : "Explore"}
              </span>
              <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Categories() {
  const { currentEdition } = useSeason();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const defaultTab = searchParams.get("view") || "blue-garnet";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const { grouped, isLoading, error } = useCategoriesGrouped();

  const tabData = useMemo(() => {
    if (!grouped) return [];

    return [
      {
        key: "blue-garnet",
        label: "Blue Garnet",
        icon: <Trophy className="h-4 w-4" />,
        categories: grouped.blueGarnet,
        subtitle: "Competitive Excellence — Public voting → Jury evaluation",
      },
      {
        key: "platinum",
        label: "Platinum",
        icon: <Shield className="h-4 w-4" />,
        categories: grouped.platinum,
        subtitle:
          "Institutional Leadership — NRC verification & governance criteria",
      },
      {
        key: "gold-special",
        label: "Gold Special 2025",
        icon: <Star className="h-4 w-4" />,
        categories: grouped.goldSpecial,
        subtitle:
          "Gold Special Recognition — 2025 Edition — Cultural impact recognition",
      },
      {
        key: "lifetime",
        label: "Lifetime",
        icon: <Crown className="h-4 w-4" />,
        categories: grouped.lifetime,
        subtitle: "Africa Education Icon — Continental honour (2005–2025)",
      },
    ];
  }, [grouped]);

  const currentTab = tabData.find((t) => t.key === activeTab) || tabData[0];

  const filteredCategories = useMemo(() => {
    if (!currentTab) return [];
    if (!searchQuery.trim()) return currentTab.categories;

    const q = searchQuery.toLowerCase();
    return currentTab.categories.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }, [currentTab, searchQuery]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal">
        <main className="container px-6 py-8">
          <div className="mb-10 text-center">
            <Skeleton className="h-6 w-32 mx-auto mb-4 bg-white/10" />
            <Skeleton className="h-10 w-64 mx-auto mb-3 bg-white/10" />
            <Skeleton className="h-5 w-96 mx-auto bg-white/10" />
          </div>

          <div className="max-w-2xl mx-auto mb-8">
            <Skeleton className="h-10 w-full bg-white/10 rounded-lg" />
          </div>

          <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !grouped) {
    return (
      <div className="min-h-screen bg-charcoal">
        <main className="container px-6 py-8">
          <div className="py-16 text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-white/20" />
            <p className="text-white/50 mb-4">Failed to load categories</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Award Categories | ${currentEdition?.name || "NESA-Africa 2025"}`}</title>
        <meta
          name="description"
          content="Explore all NESA-Africa award categories across 4 tiers: Blue Garnet, Platinum, Gold Special Recognition, and Lifetime Achievement."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <main className="container px-6 py-8">
          {/* Hero */}
          <div className="mb-10 text-center">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
              {currentEdition?.name || "NESA-Africa 2025"}
            </Badge>
            <h1 className="mb-3 font-display text-3xl font-bold md:text-4xl text-white">
              Award Categories
            </h1>
            <p className="mx-auto max-w-2xl text-white/60">
              Celebrating excellence across education, leadership, and social
              impact in Africa.
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v);
              setSearchQuery("");
            }}
          >
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-2 bg-white/5">
              {tabData.map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-gold/20 data-[state=active]:text-gold"
                  disabled={tab.categories.length === 0}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.categories.length > 0 && (
                    <span className="ml-1 text-[10px] text-white/40">
                      ({tab.categories.length})
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Subtitle */}
            {currentTab && (
              <p className="text-center text-white/50 text-sm mb-6">
                {currentTab.subtitle}
              </p>
            )}

            {/* Search */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            {/* Grid */}
            {tabData.map((tab) => (
              <TabsContent key={tab.key} value={tab.key}>
                {filteredCategories.length === 0 ? (
                  <div className="py-16 text-center">
                    <Award className="mx-auto mb-4 h-12 w-12 text-white/20" />
                    <p className="text-white/50">
                      No categories match your search.
                    </p>
                  </div>
                ) : (
                  <div
                    className={`grid gap-5 ${tab.key === "lifetime" ? "sm:grid-cols-1 lg:grid-cols-2 max-w-3xl mx-auto" : "sm:grid-cols-2 lg:grid-cols-3"}`}
                  >
                    {filteredCategories.map((cat, i) => (
                      <CategoryCard key={cat.id} category={cat} index={i} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
            <h3 className="mb-2 font-display text-2xl font-bold text-white">
              Ready to Nominate?
            </h3>
            <p className="mb-6 text-white/60">
              Recognise excellence in African education by submitting a
              nomination today.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full"
              >
                <Link to="/nominate">
                  <Award className="mr-2 h-4 w-4" />
                  Submit Nomination
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 rounded-full"
                asChild
              >
                <Link to="/nominees">View Nominees</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
