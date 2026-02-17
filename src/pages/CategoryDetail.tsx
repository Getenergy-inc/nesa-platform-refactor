import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSeason } from "@/contexts/SeasonContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Award, ArrowLeft, ChevronRight, Users, GraduationCap,
  Trophy, Shield, Star, Crown,
} from "lucide-react";
import {
  NESA_CATEGORIES,
  TIER_INFO,
  getCategoryTrack,
  type CategoryDefinition,
} from "@/config/nesaCategories";
import { categoryIconMap } from "@/config/categoryIconMap";
import { getCategoryImage } from "@/config/categoryImages";
import { StageGate } from "@/components/governance/StageGate";

// Scope badge styles
const scopeStyles: Record<string, { label: string; className: string }> = {
  AFRICA_REGIONAL: { label: "Africa Regional", className: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" },
  NIGERIA: { label: "Nigeria", className: "border-orange-500/30 text-orange-400 bg-orange-500/10" },
  INTERNATIONAL: { label: "International", className: "border-blue-500/30 text-blue-400 bg-blue-500/10" },
  ICON: { label: "Lifetime", className: "border-purple-500/30 text-purple-400 bg-purple-500/10" },
};

const tierBadgeStyles: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  "blue-garnet": { label: "Blue Garnet", className: "border-blue-500/30 text-blue-400 bg-blue-500/10", icon: <Trophy className="h-3 w-3" /> },
  platinum: { label: "Platinum", className: "border-slate-400/30 text-slate-300 bg-slate-500/10", icon: <Shield className="h-3 w-3" /> },
  "gold-special": { label: "Gold Special 2025", className: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10", icon: <Star className="h-3 w-3" /> },
  icon: { label: "Lifetime", className: "border-purple-500/30 text-purple-400 bg-purple-500/10", icon: <Crown className="h-3 w-3" /> },
};

// Governance hints per track
const governanceHints: Record<string, string> = {
  competitive: "Top 3 finalists emerge from public voting. Finalists compete for the Blue Garnet Award.",
  institutional: "Institutional recognition evaluated under governance and leadership criteria.",
  "special-recognition": "Cultural & influence impact recognition (2025 edition).",
  lifetime: "Continental lifetime honour.",
};

function getPrimaryTier(cat: CategoryDefinition): string {
  if (cat.tierApplicability.icon) return "icon";
  if (cat.tierApplicability.goldSpecial) return "gold-special";
  if (cat.tierApplicability.blueGarnet) return "blue-garnet";
  return "platinum";
}

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

  const configCategory = useMemo(() => NESA_CATEGORIES.find((c) => c.slug === slug), [slug]);

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

  // Fetch subcategories
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal">
        <div className="container px-6 py-16">
          <Skeleton className="h-8 w-48 mb-4 bg-white/10" />
          <Skeleton className="h-12 w-3/4 mb-4 bg-white/10" />
          <Skeleton className="h-6 w-1/2 mb-8 bg-white/10" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Use config category for display even if DB category is missing
  const displayCat = configCategory;

  if (!displayCat) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <Award className="mx-auto mb-4 h-16 w-16 text-white/20" />
          <h1 className="text-2xl font-bold mb-2 text-white">Category Not Found</h1>
          <p className="text-white/60 mb-6">The category you're looking for doesn't exist.</p>
          <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal rounded-full">
            <Link to="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = categoryIconMap[displayCat.iconName] || GraduationCap;
  const scope = scopeStyles[displayCat.scope];
  const primaryTier = getPrimaryTier(displayCat);
  const tier = tierBadgeStyles[primaryTier];
  const track = getCategoryTrack(displayCat);
  const hint = governanceHints[track];
  const catImage = getCategoryImage(displayCat.slug);

  // Use DB subcategories if available, else config subcategories
  const displaySubcategories = subcategories && subcategories.length > 0
    ? subcategories.map((s) => ({ id: s.id, name: s.name, description: s.description }))
    : displayCat.subcategories.map((s) => ({ id: s.id, name: s.name, description: s.description || null }));

  return (
    <>
      <Helmet>
        <title>{`${displayCat?.name || 'Category'} | ${currentEdition?.name || 'NESA-Africa 2025'}`}</title>
        <meta name="description" content={displayCat.description} />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {catImage && (
            <>
              <img src={catImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-charcoal/85" />
            </>
          )}
          <div className="container relative z-10 px-6 py-12 md:py-20">
            <Breadcrumbs
              items={[
                { label: "Categories", href: "/categories" },
                { label: displayCat.name },
              ]}
              className="mb-6 text-white/50"
            />

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className={`${tier.className} gap-1`}>
                {tier.icon}
                {tier.label}
              </Badge>
              <Badge variant="outline" className={scope.className}>
                {scope.label}
              </Badge>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              {displayCat.name}
            </h1>
            <p className="text-white/70 max-w-3xl text-lg mb-6">
              {displayCat.description}
            </p>

            {/* Governance hint */}
            <p className="text-white/50 text-sm italic mb-8 max-w-2xl">
              {hint}
            </p>

            <div className="flex flex-wrap gap-3">
              <StageGate action="nominations" fallback={
                <Button disabled variant="outline" className="border-white/20 text-white/50 rounded-full">
                  Nominations Closed
                </Button>
              }>
                <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full">
                  <Link to={`/nominate?category=${category?.id || displayCat.id}`}>
                    <Award className="mr-2 h-4 w-4" />
                    Nominate
                  </Link>
                </Button>
              </StageGate>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full" asChild>
                <Link to={`/nominees?category=${encodeURIComponent(displayCat.name)}`}>
                  <Users className="mr-2 h-4 w-4" />
                  Explore Nominees
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Subcategories */}
        <section className="container px-6 py-12">
          <h2 className="font-display text-xl font-bold text-white mb-6">
            Subcategories ({displaySubcategories.length})
          </h2>

          {displaySubcategories.length === 0 ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
              <Award className="mx-auto mb-4 h-12 w-12 text-white/20" />
              <p className="text-white/50">No subcategories available for this category yet.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {displaySubcategories.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/nominate?subcategory=${sub.id}`}
                  className="group flex items-center justify-between rounded-xl bg-white/5 border border-white/10 hover:border-gold/40 p-4 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white group-hover:text-gold transition-colors">
                      {sub.name}
                    </p>
                    {sub.description && (
                      <p className="text-xs text-white/40 mt-1 line-clamp-1">{sub.description}</p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-gold flex-shrink-0 ml-2 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="container px-6 pb-16">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
            <h3 className="mb-2 font-display text-2xl font-bold text-white">
              Nominate in This Category
            </h3>
            <p className="mb-6 text-white/60">
              Know someone making a difference? Submit a nomination today.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <StageGate action="nominations" fallback={
                <Button size="lg" disabled variant="outline" className="border-white/20 text-white/50 rounded-full">
                  Nominations Currently Closed
                </Button>
              }>
                <Button size="lg" asChild className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full">
                  <Link to={`/nominate?category=${category?.id || displayCat.id}`}>
                    <Award className="mr-2 h-4 w-4" />
                    Submit Nomination
                  </Link>
                </Button>
              </StageGate>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full" asChild>
                <Link to="/categories">View All Categories</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
