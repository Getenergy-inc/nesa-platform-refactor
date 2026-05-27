import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award, Search, ChevronRight, GraduationCap, Trophy, Crown, Star, Shield, Globe,
} from "lucide-react";
import { VolunteerCTABanner } from "@/components/volunteers/VolunteerCTABanner";
import {
  NESA_CATEGORIES,
  getCategoriesGrouped,
  TIER_INFO,
  type CategoryDefinition,
} from "@/config/nesaCategories";
import { categoryIconMap } from "@/config/categoryIconMap";
import { getCategoryImage } from "@/config/categoryImages";

// Scope badge styles
const scopeStyles: Record<string, { label: string; className: string }> = {
  AFRICA_REGIONAL: { label: "Africa Regional", className: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" },
  NIGERIA: { label: "Nigeria", className: "border-orange-500/30 text-orange-400 bg-orange-500/10" },
  INTERNATIONAL: { label: "International", className: "border-blue-500/30 text-blue-400 bg-blue-500/10" },
  ICON: { label: "Lifetime", className: "border-purple-500/30 text-purple-400 bg-purple-500/10" },
};

// Tier badge styles for cards
const tierBadgeStyles: Record<string, { label: string; className: string }> = {
  "blue-garnet": { label: "Blue Garnet", className: "border-blue-500/30 text-blue-400 bg-blue-500/10" },
  platinum: { label: "Platinum", className: "border-slate-400/30 text-slate-300 bg-slate-500/10" },
  "gold-special": { label: "Influencers Education Impact Award 2026", className: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" },
  icon: { label: "Lifetime", className: "border-purple-500/30 text-purple-400 bg-purple-500/10" },
};

function getPrimaryTier(cat: CategoryDefinition): string {
  if (cat.tierApplicability.icon) return "icon";
  if (cat.tierApplicability.goldSpecial) return "gold-special";
  if (cat.tierApplicability.blueGarnet) return "blue-garnet";
  return "platinum";
}

function CategoryCard({ cat, index }: { cat: CategoryDefinition; index: number }) {
  const Icon = categoryIconMap[cat.iconName] || GraduationCap;
  const scope = scopeStyles[cat.scope] || scopeStyles.AFRICA_REGIONAL;
  const tier = tierBadgeStyles[getPrimaryTier(cat)];
  const catImage = getCategoryImage(cat.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        to={`/categories/${cat.slug}`}
        className="group block bg-charcoal-light/60 backdrop-blur-sm rounded-2xl border border-gold/10 hover:border-gold/40 transition-all duration-300 overflow-hidden h-full"
      >
        {/* Image */}
        <div className="relative h-36 w-full overflow-hidden">
          {catImage ? (
            <img src={catImage} alt={cat.shortName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-charcoal/50 flex items-center justify-center">
              <Icon className="h-12 w-12 text-gold/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
          {/* Badges on image */}
          <div className="absolute top-2 right-2 flex gap-1.5">
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
        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-ivory text-sm leading-tight group-hover:text-gold transition-colors line-clamp-2 mb-1">
            {cat.name}
          </h3>
          <p className="text-ivory/70 text-xs line-clamp-2 mb-3">{cat.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-ivory/60 text-xs">
              {cat.subcategories.length > 0 ? `${cat.subcategories.length} subcategories` : ""}
            </span>
            <div className="flex items-center gap-1 text-xs text-ivory/60 group-hover:text-gold transition-colors">
              <span>{cat.subcategories.length > 0 ? "View Subcategories" : "Explore"}</span>
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

  const groups = useMemo(() => getCategoriesGrouped(), []);
  const nigeriaCategories = useMemo(
    () => NESA_CATEGORIES.filter((cat) => cat.scope === "NIGERIA"),
    []
  );
  const africaRegionalCategories = useMemo(
    () => NESA_CATEGORIES.filter((cat) => cat.scope === "AFRICA_REGIONAL"),
    []
  );

  const tabData: { key: string; label: string; icon: React.ReactNode; categories: CategoryDefinition[]; subtitle: string }[] = [
    {
      key: "blue-garnet",
      label: "Blue Garnet",
      icon: <Trophy className="h-4 w-4" />,
      categories: groups.blueGarnet,
      subtitle: "Competitive Excellence — Public voting → Jury evaluation",
    },
    {
      key: "platinum",
      label: "Platinum",
      icon: <Shield className="h-4 w-4" />,
      categories: groups.platinum,
      subtitle: "Institutional Leadership — NRC verification & governance criteria",
    },
    {
      key: "gold-special",
      label: "Influencers Award",
      icon: <Star className="h-4 w-4" />,
      categories: groups.goldSpecial,
      subtitle: "Influencers Education Impact Award — 2026 Edition · Cultural impact recognition across Sports, Music, and Social Media",
    },
    {
      key: "lifetime",
      label: "Lifetime",
      icon: <Crown className="h-4 w-4" />,
      categories: groups.lifetime,
      subtitle: "Africa Education Icon — Continental honour (2006–2026)",
    },
    {
      key: "nigeria",
      label: "Nigeria",
      icon: <Award className="h-4 w-4" />,
      categories: nigeriaCategories,
      subtitle: "Nigeria-focused award categories",
    },
    {
      key: "africa",
      label: "Africa Regional",
      icon: <Globe className="h-4 w-4" />,
      categories: africaRegionalCategories,
      subtitle: "Africa regional award categories",
    },
  ];

  const currentTab = tabData.find((t) => t.key === activeTab) || tabData[0];

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return currentTab.categories;
    const q = searchQuery.toLowerCase();
    return currentTab.categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [currentTab, searchQuery]);

  return (
    <>
      <Helmet>
        <title>{`Award Categories | ${currentEdition?.name || 'NESA-Africa 2026'}`}</title>
        <meta name="description" content="Explore all NESA-Africa award categories across Blue Garnet, Platinum, Influencers Education Impact Award, Lifetime Achievement, and Nigeria-focused categories." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <main className="container px-6 py-8 text-ivory">
          {/* Hero */}
          <div className="mb-10 text-center">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">{currentEdition.name}</Badge>
            <h1 className="mb-3 font-display text-3xl font-bold md:text-4xl text-ivory">
              Award Categories
            </h1>
            <p className="mx-auto max-w-2xl text-ivory/70">
              Celebrating excellence across education, leadership, and social impact in Africa.
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchQuery(""); }}>
            <TabsList className="flex flex-wrap w-full max-w-3xl mx-auto mb-2 bg-charcoal-light/60 border border-gold/10 h-auto gap-1 p-1">
              {tabData.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key} className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 text-xs sm:text-sm text-ivory/70 data-[state=active]:bg-gold data-[state=active]:text-charcoal whitespace-nowrap">
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Subtitle */}
            <p className="text-center text-ivory/70 text-sm mb-6">{currentTab.subtitle}</p>

            {/* Search */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/80" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-charcoal-light border-gold/20 text-ivory placeholder:text-ivory/50 focus:border-gold"
              />
            </div>

            {/* Grid */}
            {tabData.map((tab) => (
              <TabsContent key={tab.key} value={tab.key}>
                {filteredCategories.length === 0 ? (
                  <div className="py-16 text-center">
                    <Award className="mx-auto mb-4 h-12 w-12 text-gold/30" />
                    <p className="text-ivory/70">No categories match your search.</p>
                  </div>
                ) : (
                  <div className={`grid gap-5 ${tab.key === "lifetime" ? "sm:grid-cols-1 lg:grid-cols-2 max-w-3xl mx-auto" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                    {filteredCategories.map((cat, i) => (
                      <CategoryCard key={cat.id} cat={cat} index={i} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-charcoal-light/60 border border-gold/15 p-8 text-center">
            <h3 className="mb-2 font-display text-2xl font-bold text-ivory">
              Ready to Nominate?
            </h3>
            <p className="mb-6 text-ivory/70">
              Recognise excellence in African education by submitting a nomination today.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full">
                <Link to="/nominate">
                  <Award className="mr-2 h-4 w-4" />
                  Submit Nomination
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 rounded-full" asChild>
                <Link to="/nominees">View Nominees</Link>
              </Button>
            </div>
          </div>
          <VolunteerCTABanner />
        </main>
      </div>
      <MobileStickyNominateCTA source="categories_index" />
    </>
  );
}
