import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSeason } from "@/contexts/SeasonContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Award, ChevronDown, ChevronRight, Search, ArrowLeft,
  Building2, Building, Laptop, Radio, Heart, Users, FlaskConical,
  Palette, MapPin, BookOpen, Microscope, Church, Moon, Landmark,
  Globe, Plane, Crown, Trophy
} from "lucide-react";
import {
  NESA_CATEGORIES,
  TIER_INFO,
  type CategoryScope,
  type AwardTier,
} from "@/config/nesaCategories";
import { getCategoryImage } from "@/config/categoryImages";

// Icon mapping for category icons
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
  Award,
  Trophy,
};

// Scope badge config
const scopeBadgeConfig: Record<CategoryScope, { label: string; className: string }> = {
  AFRICA_REGIONAL: { label: "Africa Regional", className: "bg-green-100 text-green-800 border-green-300" },
  NIGERIA: { label: "Nigeria", className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  INTERNATIONAL: { label: "International", className: "bg-blue-100 text-blue-800 border-blue-300" },
  ICON: { label: "Lifetime Achievement", className: "bg-purple-100 text-purple-800 border-purple-300" },
};

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  display_order: number | null;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  display_order: number | null;
}

// Get tier info based on category slug
function getCategoryTierInfo(categorySlug: string): { tier: AwardTier; info: typeof TIER_INFO["platinum"] } | null {
  const configCategory = NESA_CATEGORIES.find((c) => c.slug === categorySlug);
  if (!configCategory) return null;
  
  // Determine primary tier based on tier applicability
  if (configCategory.tierApplicability.icon) {
    return { tier: "icon", info: TIER_INFO["icon"] };
  }
  if (configCategory.tierApplicability.blueGarnet) {
    return { tier: "blue-garnet", info: TIER_INFO["blue-garnet"] };
  }
  if (configCategory.tierApplicability.gold) {
    return { tier: "gold", info: TIER_INFO["gold"] };
  }
  if (configCategory.tierApplicability.platinum) {
    return { tier: "platinum", info: TIER_INFO["platinum"] };
  }
  return { tier: "gold", info: TIER_INFO["gold"] };
}

// Get scope from category slug
function getCategoryScope(categorySlug: string): CategoryScope {
  const configCategory = NESA_CATEGORIES.find((c) => c.slug === categorySlug);
  return configCategory?.scope || "NIGERIA";
}

export default function Categories() {
  const { currentEdition } = useSeason();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>(searchParams.get("view") || "africa");

  // Fetch categories
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch subcategories
  const { data: subcategories, isLoading: loadingSubcategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data as Subcategory[];
    },
  });

  // Group subcategories by category
  const subcategoriesByCategory = useMemo(() => {
    if (!subcategories) return {};
    return subcategories.reduce((acc, sub) => {
      if (!acc[sub.category_id]) acc[sub.category_id] = [];
      acc[sub.category_id].push(sub);
      return acc;
    }, {} as Record<string, Subcategory[]>);
  }, [subcategories]);

  // Filter categories by scope (tab) and search
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    
    // First filter by tab (scope)
    let filtered = categories.filter((cat) => {
      const scope = getCategoryScope(cat.slug);
      if (activeTab === "africa") {
        return scope === "AFRICA_REGIONAL" || scope === "INTERNATIONAL" || scope === "ICON";
      } else if (activeTab === "nigeria") {
        return scope === "NIGERIA";
      }
      return true;
    });

    // Then filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((cat) => {
        const categoryMatch = cat.name.toLowerCase().includes(query) || 
                             cat.description?.toLowerCase().includes(query);
        const subs = subcategoriesByCategory[cat.id] || [];
        const subMatch = subs.some((sub) => 
          sub.name.toLowerCase().includes(query) || 
          sub.description?.toLowerCase().includes(query)
        );
        return categoryMatch || subMatch;
      });
    }

    return filtered;
  }, [categories, subcategoriesByCategory, searchQuery, activeTab]);

  // Count categories by scope
  const categoryCounts = useMemo(() => {
    if (!categories) return { africa: 0, nigeria: 0, total: 0 };
    
    let africa = 0, nigeria = 0;
    categories.forEach((cat) => {
      const scope = getCategoryScope(cat.slug);
      if (scope === "NIGERIA") nigeria++;
      else africa++;
    });
    
    return { africa, nigeria, total: categories.length };
  }, [categories]);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (filteredCategories) {
      setExpandedCategories(new Set(filteredCategories.map((c) => c.id)));
    }
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const getIcon = (iconName: string | null) => {
    return iconMap[iconName || "Award"] || Award;
  };

  const isLoading = loadingCategories || loadingSubcategories;
  const totalSubcategories = subcategories?.length || 0;

  return (
    <>
      <Helmet>
        <title>Award Categories | {currentEdition.name}</title>
        <meta name="description" content="Explore all 17 NESA-Africa award categories and 138+ subcategories. Recognizing excellence across education, CSR, technology, and social impact across Africa." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <main className="container px-6 py-8">
          {/* Hero */}
          <div className="mb-8 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">{currentEdition.name}</Badge>
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              17 Official Award Categories
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Celebrating excellence in education, corporate responsibility, technology, 
              and social impact across the African continent.
            </p>
          </div>

          {/* Tier Legend */}
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {Object.entries(TIER_INFO).map(([key, tier]) => (
              <div 
                key={key} 
                className={`flex items-center gap-2 rounded-full border px-4 py-2 ${tier.bgColor} ${tier.borderColor}`}
              >
                <span className={`text-sm font-medium ${tier.color}`}>{tier.shortName}</span>
                <span className="text-xs text-muted-foreground">({tier.votingMethod})</span>
              </div>
            ))}
          </div>

          {/* Tabs for Africa First vs Nigeria */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="africa" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Africa First ({categoryCounts.africa})
              </TabsTrigger>
              <TabsTrigger value="nigeria" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Nigeria ({categoryCounts.nigeria})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search & Controls */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories or subcategories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-12 text-center">
              <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="font-display text-lg font-semibold">No categories found</h3>
              <p className="text-muted-foreground">Try adjusting your search query.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => {
                const Icon = getIcon(category.icon_name);
                const tierInfo = getCategoryTierInfo(category.slug);
                const scope = getCategoryScope(category.slug);
                const scopeBadge = scopeBadgeConfig[scope];
                const subs = subcategoriesByCategory[category.id] || [];
                const isExpanded = expandedCategories.has(category.id);

                const tier = tierInfo?.info || TIER_INFO["gold"];

                return (
                  <Collapsible
                    key={category.id}
                    open={isExpanded}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                    <Card className="overflow-hidden transition-all hover:shadow-lg group">
                      {/* Category Image */}
                      {getCategoryImage(category.slug) && (
                        <div className="relative h-40 overflow-hidden">
                          <img 
                            src={getCategoryImage(category.slug)!} 
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <div 
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${tier.bgColor} backdrop-blur-sm`}
                            >
                              <Icon className={`h-5 w-5 ${tier.color}`} />
                            </div>
                            <div className="flex gap-1">
                              <Badge variant="outline" className={`text-xs ${scopeBadge.className} backdrop-blur-sm`}>
                                {scopeBadge.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                      {!getCategoryImage(category.slug) && (
                        <div className={`h-1 ${tier.bgColor.replace('bg-', 'bg-')}`} />
                      )}
                      <CardHeader className="pb-2">
                        {!getCategoryImage(category.slug) && (
                          <div className="flex items-start justify-between gap-2">
                            <div 
                              className={`flex h-12 w-12 items-center justify-center rounded-full ${tier.bgColor}`}
                            >
                              <Icon className={`h-6 w-6 ${tier.color}`} />
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge variant="outline" className={`text-xs ${scopeBadge.className}`}>
                                {scopeBadge.label}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${tier.bgColor} ${tier.color} ${tier.borderColor}`}>
                                {tier.shortName}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardTitle className="font-display text-base leading-tight">{category.name}</CardTitle>
                        <CardDescription className="text-xs line-clamp-2">{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-3 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {subs.length} subcategories
                          </span>
                          <Badge variant="outline" className={`text-xs ${tier.bgColor} ${tier.color} ${tier.borderColor}`}>
                            {tier.shortName}
                          </Badge>
                        </div>
                        
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between text-sm">
                            {isExpanded ? "Hide Subcategories" : "View Subcategories"}
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                          {subs.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">
                              No subcategories available yet.
                            </p>
                          ) : (
                            subs.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/nominate?subcategory=${sub.id}`}
                                className="flex items-center justify-between rounded-lg border p-2 transition-colors hover:bg-muted"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{sub.name}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              </Link>
                            ))
                          )}
                        </CollapsibleContent>
                      </CardContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary">17</div>
              <div className="text-sm text-muted-foreground">Official Categories</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary">{totalSubcategories}</div>
              <div className="text-sm text-muted-foreground">Total Subcategories</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">African Regions</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Award Tiers</div>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-xl bg-secondary p-8 text-center">
            <h3 className="mb-2 font-display text-2xl font-bold text-secondary-foreground">
              Ready to Nominate?
            </h3>
            <p className="mb-6 text-secondary-foreground/70">
              Recognize excellence in African education by submitting a nomination today.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/nominate">
                  <Award className="mr-2 h-4 w-4" />
                  Submit Nomination
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground" asChild>
                <Link to="/nominees">View Nominees</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
