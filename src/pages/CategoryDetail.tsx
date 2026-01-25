import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSeason } from "@/contexts/SeasonContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Award, ArrowLeft, ChevronRight,
  Building2, Building, Laptop, Radio, Heart, Users, FlaskConical,
  Palette, MapPin, BookOpen, Microscope, Church, Moon, Landmark,
  Globe, Plane, Crown, Trophy, Vote, Shield, Star
} from "lucide-react";
import {
  NESA_CATEGORIES,
  TIER_INFO,
  getTierPath,
  isCompetitiveCategory,
  type AwardTier,
} from "@/config/nesaCategories";
import { StageGate } from "@/components/governance/StageGate";

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
  Award,
  Trophy,
};

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  display_order: number | null;
}

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { currentEdition } = useSeason();

  // Get category from config
  const configCategory = useMemo(() => {
    return NESA_CATEGORIES.find((c) => c.slug === slug);
  }, [slug]);

  // Fetch category from DB
  const { data: category, isLoading: loadingCategory } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Fetch subcategories for this category
  const { data: subcategories, isLoading: loadingSubcategories } = useQuery({
    queryKey: ["subcategories", category?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", category!.id)
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data as Subcategory[];
    },
    enabled: !!category?.id,
  });

  const isLoading = loadingCategory || loadingSubcategories;
  const tierPath = configCategory ? getTierPath(configCategory) : [];
  const isCompetitive = configCategory ? isCompetitiveCategory(configCategory) : false;

  const getIcon = (iconName: string | null) => {
    return iconMap[iconName || "Award"] || Award;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center px-6">
            <Skeleton className="h-8 w-48" />
          </div>
        </header>
        <main className="container px-6 py-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!category || !configCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Award className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = getIcon(category.icon_name);

  return (
    <>
      <Helmet>
        <title>{category.name} | {currentEdition.name}</title>
        <meta name="description" content={category.description || `Explore ${category.name} subcategories and nominate excellence in this category.`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/categories">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="font-display text-lg font-bold line-clamp-1">{category.name}</h1>
                <p className="text-xs text-muted-foreground">
                  {subcategories?.length || 0} subcategories
                </p>
              </div>
            </div>
            <StageGate action="nominations" fallback={
              <Button disabled variant="outline">
                Nominations Closed
              </Button>
            }>
              <Button asChild>
                <Link to={`/nominate?category=${category.id}`}>
                  <Award className="mr-2 h-4 w-4" />
                  Nominate
                </Link>
              </Button>
            </StageGate>
          </div>
        </header>

        <main className="container px-6 py-8">
          {/* Hero */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <Badge className="mb-2 bg-primary/10 text-primary">
                  {configCategory.scope === "NIGERIA" ? "Nigeria" : 
                   configCategory.scope === "ICON" ? "Lifetime Achievement" : "Africa Regional"}
                </Badge>
                <h2 className="font-display text-2xl md:text-3xl font-bold">
                  {category.name}
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground max-w-3xl">
              {category.description}
            </p>
          </div>

          {/* Tier Path */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
              Award Tiers for This Category
            </h3>
            <div className="flex flex-wrap gap-3">
              {tierPath.map((tier, index) => {
                const info = TIER_INFO[tier];
                return (
                  <div key={tier} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${info.bgColor} ${info.borderColor} border`}>
                      {tier === "platinum" && <Shield className={`h-4 w-4 ${info.color}`} />}
                      {tier === "gold" && <Trophy className={`h-4 w-4 ${info.color}`} />}
                      {tier === "blue-garnet" && <Star className={`h-4 w-4 ${info.color}`} />}
                      {tier === "icon" && <Crown className={`h-4 w-4 ${info.color}`} />}
                      <span className={`font-medium text-sm ${info.color}`}>{info.shortName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {configCategory.selectionMethod}
            </p>
          </div>

          {/* Competition Status */}
          <Card className="mb-8">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isCompetitive ? (
                  <>
                    <Vote className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Competitive Category</p>
                      <p className="text-sm text-muted-foreground">
                        Public voting and/or jury evaluation applies
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="font-medium">Non-Competitive Category</p>
                      <p className="text-sm text-muted-foreground">
                        Recognition based on NRC verification and merit
                      </p>
                    </div>
                  </>
                )}
              </div>
              {isCompetitive && (
                <StageGate action="public_voting" fallback={
                  <Badge variant="outline">Voting Not Open</Badge>
                }>
                  <Button size="sm" asChild>
                    <Link to="/vote">
                      <Vote className="mr-2 h-4 w-4" />
                      Vote Now
                    </Link>
                  </Button>
                </StageGate>
              )}
            </CardContent>
          </Card>

          {/* Subcategories */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">
              Subcategories ({subcategories?.length || 0})
            </h3>
            
            {!subcategories || subcategories.length === 0 ? (
              <Card className="p-8 text-center">
                <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No subcategories available for this category yet.
                </p>
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/nominate?subcategory=${sub.id}`}
                    className="group"
                  >
                    <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">
                            {sub.name}
                          </p>
                          {sub.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {sub.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-xl bg-secondary p-8 text-center">
            <h3 className="mb-2 font-display text-2xl font-bold text-secondary-foreground">
              Nominate in This Category
            </h3>
            <p className="mb-6 text-secondary-foreground/70">
              Know someone making a difference? Submit a nomination today.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <StageGate action="nominations" fallback={
                <Button size="lg" disabled variant="outline">
                  Nominations Currently Closed
                </Button>
              }>
                <Button size="lg" asChild>
                  <Link to={`/nominate?category=${category.id}`}>
                    <Award className="mr-2 h-4 w-4" />
                    Submit Nomination
                  </Link>
                </Button>
              </StageGate>
              <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground" asChild>
                <Link to="/categories">View All Categories</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
