import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSeason } from "@/contexts/SeasonContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Award, ChevronDown, ChevronRight, Search, ArrowLeft,
  GraduationCap, BookOpen, Cpu, Heart, Building, Crown,
  Users, Globe, Star, Music, Film, Trophy, Briefcase,
  Palette, Stethoscope, Menu
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  BookOpen,
  Cpu,
  Heart,
  Building,
  Crown,
  Users,
  Globe,
  Star,
  Award,
  Music,
  Film,
  Trophy,
  Briefcase,
  Palette,
  Stethoscope,
};

// Tier configuration matching NESA award structure
const tierConfig: Record<string, { name: string; color: string; votingMethod: string; description: string }> = {
  platinum: {
    name: "Platinum",
    color: "#E5E4E2",
    votingMethod: "NRC Selection",
    description: "Highest honor, NRC-selected nominees",
  },
  gold: {
    name: "Gold",
    color: "#FFD700",
    votingMethod: "100% Public Voting",
    description: "Public voting determines winners",
  },
  "blue-garnet": {
    name: "Blue Garnet",
    color: "#1E3A5F",
    votingMethod: "40% Public + 60% Jury",
    description: "Combined jury and public evaluation",
  },
  icon: {
    name: "Icon",
    color: "#9B59B6",
    votingMethod: "Jury Selection",
    description: "Lifetime achievement recognition",
  },
};

// Category to tier mapping (based on NESA structure)
const categoryTierMap: Record<string, string> = {
  "education": "gold",
  "leadership": "platinum",
  "technology": "blue-garnet",
  "humanitarian": "gold",
  "health": "gold",
  "business": "blue-garnet",
  "arts-culture": "gold",
  "sports": "gold",
  "music": "gold",
  "film-television": "gold",
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

export default function Categories() {
  const { currentEdition } = useSeason();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

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

  // Filter categories and subcategories by search
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!searchQuery.trim()) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.filter((cat) => {
      const categoryMatch = cat.name.toLowerCase().includes(query) || 
                           cat.description?.toLowerCase().includes(query);
      const subs = subcategoriesByCategory[cat.id] || [];
      const subMatch = subs.some((sub) => 
        sub.name.toLowerCase().includes(query) || 
        sub.description?.toLowerCase().includes(query)
      );
      return categoryMatch || subMatch;
    });
  }, [categories, subcategoriesByCategory, searchQuery]);

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

  // Expand all that match search
  const expandAll = () => {
    if (categories) {
      setExpandedCategories(new Set(categories.map((c) => c.id)));
    }
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const getTier = (categorySlug: string) => {
    return tierConfig[categoryTierMap[categorySlug] || "gold"];
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
        <meta name="description" content="Explore all NESA-Africa award categories and subcategories. Nominate excellence across education, leadership, technology, and more." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="font-display text-lg font-bold">Award Categories</h1>
                <p className="text-xs text-muted-foreground">
                  {categories?.length || 0} categories • {totalSubcategories} subcategories
                </p>
              </div>
            </div>
            <Button asChild>
              <Link to="/nominate">
                <Award className="mr-2 h-4 w-4" />
                Nominate
              </Link>
            </Button>
          </div>
        </header>

        <main className="container px-6 py-8">
          {/* Hero */}
          <div className="mb-8 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">{currentEdition.name}</Badge>
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              Award Categories
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Explore our comprehensive categories recognizing excellence across education, 
              leadership, technology, and social impact in Africa.
            </p>
          </div>

          {/* Tier Legend */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            {Object.entries(tierConfig).map(([key, tier]) => (
              <div key={key} className="flex items-center gap-2 rounded-full border px-4 py-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: tier.color }} 
                />
                <span className="text-sm font-medium">{tier.name}</span>
                <span className="text-xs text-muted-foreground">({tier.votingMethod})</span>
              </div>
            ))}
          </div>

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
                const tier = getTier(category.slug);
                const subs = subcategoriesByCategory[category.id] || [];
                const isExpanded = expandedCategories.has(category.id);

                return (
                  <Collapsible
                    key={category.id}
                    open={isExpanded}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                    <Card className="overflow-hidden transition-all hover:shadow-lg">
                      <div 
                        className="h-1" 
                        style={{ backgroundColor: tier.color }} 
                      />
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div 
                            className="flex h-12 w-12 items-center justify-center rounded-full"
                            style={{ backgroundColor: `${tier.color}20` }}
                          >
                            <Icon className="h-6 w-6" style={{ color: tier.color }} />
                          </div>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: tier.color, color: tier.color }}
                          >
                            {tier.name}
                          </Badge>
                        </div>
                        <CardTitle className="font-display">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="mb-3 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {subs.length} subcategories
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {tier.votingMethod}
                          </span>
                        </div>
                        
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between">
                            {isExpanded ? "Hide Subcategories" : "View Subcategories"}
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-3 space-y-2">
                          {subs.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">
                              No subcategories available yet.
                            </p>
                          ) : (
                            subs.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/nominate?subcategory=${sub.id}`}
                                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                              >
                                <div>
                                  <p className="font-medium text-sm">{sub.name}</p>
                                  {sub.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      {sub.description}
                                    </p>
                                  )}
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
