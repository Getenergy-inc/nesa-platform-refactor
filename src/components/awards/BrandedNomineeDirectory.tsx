import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Award, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";

import type { BrandedCategoryTheme } from "./BrandedCategoryHero";

type ThemeTokens = {
  accent: string;
  border: string;
  glow: string;
  ring: string;
  ctaBg: string;
  ctaText: string;
  chipBorder: string;
  chipText: string;
};

const THEMES: Record<BrandedCategoryTheme, ThemeTokens> = {
  legacy: {
    accent: "text-gold",
    border: "border-gold/30",
    glow: "bg-gold/15",
    ring: "ring-gold/20",
    ctaBg: "bg-gold hover:bg-gold/90",
    ctaText: "text-charcoal",
    chipBorder: "border-gold/30",
    chipText: "text-gold",
  },
  corporate: {
    accent: "text-emerald-300",
    border: "border-emerald-500/30",
    glow: "bg-emerald-500/15",
    ring: "ring-emerald-400/20",
    ctaBg: "bg-emerald-500 hover:bg-emerald-500/90",
    ctaText: "text-charcoal",
    chipBorder: "border-emerald-500/30",
    chipText: "text-emerald-300",
  },
  influencer: {
    accent: "text-purple-300",
    border: "border-purple-500/30",
    glow: "bg-purple-500/15",
    ring: "ring-purple-400/20",
    ctaBg: "bg-purple-500 hover:bg-purple-500/90",
    ctaText: "text-white",
    chipBorder: "border-purple-500/30",
    chipText: "text-purple-300",
  },
  global: {
    accent: "text-sky-300",
    border: "border-sky-500/30",
    glow: "bg-sky-500/15",
    ring: "ring-sky-400/20",
    ctaBg: "bg-sky-500 hover:bg-sky-500/90",
    ctaText: "text-white",
    chipBorder: "border-sky-500/30",
    chipText: "text-sky-300",
  },
  stem: {
    accent: "text-cyan-300", border: "border-cyan-500/30", glow: "bg-cyan-500/15", ring: "ring-cyan-400/20",
    ctaBg: "bg-cyan-500 hover:bg-cyan-500/90", ctaText: "text-charcoal",
    chipBorder: "border-cyan-500/30", chipText: "text-cyan-300",
  },
  ngo: {
    accent: "text-orange-300", border: "border-orange-500/30", glow: "bg-orange-500/15", ring: "ring-orange-400/20",
    ctaBg: "bg-orange-500 hover:bg-orange-500/90", ctaText: "text-charcoal",
    chipBorder: "border-orange-500/30", chipText: "text-orange-300",
  },
  media: {
    accent: "text-rose-300", border: "border-rose-500/30", glow: "bg-rose-500/15", ring: "ring-rose-400/20",
    ctaBg: "bg-rose-500 hover:bg-rose-500/90", ctaText: "text-white",
    chipBorder: "border-rose-500/30", chipText: "text-rose-300",
  },
  regional: {
    accent: "text-teal-300", border: "border-teal-500/30", glow: "bg-teal-500/15", ring: "ring-teal-400/20",
    ctaBg: "bg-teal-500 hover:bg-teal-500/90", ctaText: "text-charcoal",
    chipBorder: "border-teal-500/30", chipText: "text-teal-300",
  },
  platinum: {
    accent: "text-zinc-200", border: "border-zinc-300/30", glow: "bg-zinc-300/15", ring: "ring-zinc-200/20",
    ctaBg: "bg-zinc-200 hover:bg-zinc-100", ctaText: "text-charcoal",
    chipBorder: "border-zinc-300/30", chipText: "text-zinc-200",
  },
  bluegarnet: {
    accent: "text-indigo-300", border: "border-indigo-500/30", glow: "bg-indigo-500/15", ring: "ring-indigo-400/20",
    ctaBg: "bg-indigo-500 hover:bg-indigo-500/90", ctaText: "text-white",
    chipBorder: "border-indigo-500/30", chipText: "text-indigo-300",
  },
  diaspora: {
    accent: "text-violet-300", border: "border-violet-500/30", glow: "bg-violet-500/15", ring: "ring-violet-400/20",
    ctaBg: "bg-violet-500 hover:bg-violet-500/90", ctaText: "text-white",
    chipBorder: "border-violet-500/30", chipText: "text-violet-300",
  },
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  subcategories: { id: string; name: string; slug: string }[];
};

/**
 * Resolve the backend Category row by exact name OR slug.
 * Returns the category + its subcategories list.
 */
function useBackendCategory(categoryNameOrSlug: string) {
  return useQuery<CategoryRow | null>({
    queryKey: ["backend-category", categoryNameOrSlug],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      // Try exact name first
      const { data: byName } = await supabase
        .from("categories")
        .select("id, name, slug, description, subcategories ( id, name, slug )")
        .eq("name", categoryNameOrSlug)
        .maybeSingle();
      if (byName) return byName as CategoryRow;

      // Fallback to slug
      const { data: bySlug } = await supabase
        .from("categories")
        .select("id, name, slug, description, subcategories ( id, name, slug )")
        .eq("slug", categoryNameOrSlug)
        .maybeSingle();
      return (bySlug as CategoryRow) ?? null;
    },
  });
}

export interface BrandedNomineeDirectoryProps {
  theme: BrandedCategoryTheme;
  /** Category name OR slug as stored in Supabase `categories`. */
  categoryName: string;
  /** Optional explicit override for the public /nominees link query. */
  nomineesLinkCategory?: string;
  title?: string;
  description?: string;
  /** Cap how many nominee cards to render in the section. */
  maxNominees?: number;
}

export function BrandedNomineeDirectory({
  theme,
  categoryName,
  nomineesLinkCategory,
  title,
  description,
  maxNominees = 9,
}: BrandedNomineeDirectoryProps) {
  const t = THEMES[theme];

  const categoryQuery = useBackendCategory(categoryName);
  const nomineesQuery = useNominees();

  const category = categoryQuery.data;
  const allNominees = nomineesQuery.data ?? [];

  // Filter live nominees by matched backend category (by name OR slug)
  const nominees = useMemo<EnrichedDatabaseNominee[]>(() => {
    if (!allNominees.length) return [];
    const targetName = (category?.name ?? categoryName).toLowerCase();
    const targetSlug = (category?.slug ?? categoryName).toLowerCase();
    return allNominees.filter(
      (n) =>
        n.categoryName?.toLowerCase() === targetName ||
        n.categorySlug?.toLowerCase() === targetSlug,
    );
  }, [allNominees, category, categoryName]);

  const loading = categoryQuery.isLoading || nomineesQuery.isLoading;
  const subcategories = category?.subcategories ?? [];
  const nomineesLink = `/nominees?category=${encodeURIComponent(nomineesLinkCategory ?? category?.name ?? categoryName)}`;

  return (
    <section
      className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-charcoal via-black to-charcoal py-14 lg:py-20"
      aria-label="Live nominee directory"
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className={cn("absolute -top-32 left-1/3 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-25", t.glow)} />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <Badge
              variant="outline"
              className={cn("mb-3 px-3 py-1 tracking-[0.18em] text-[10px] uppercase bg-white/[0.03]", t.border, t.accent)}
            >
              <Sparkles className="mr-1.5 h-3 w-3" />
              Live Directory · CMS-Driven
            </Badge>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-white">
              {title ?? "Meet the Nominees"}
            </h2>
            <p className="mt-2 text-white/70 max-w-2xl text-sm md:text-base">
              {description ??
                (category?.description ||
                  "Discover live nominees pulled directly from our verified database — updated as nominations and reviews progress.")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className={cn("rounded-full px-6 font-semibold gap-2", t.ctaBg, t.ctaText)}>
              <Link to={nomineesLink}>
                <Users className="h-4 w-4" />
                View All Nominees
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Subcategories chips (from backend) */}
        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {subcategories.map((sc) => (
              <Link
                key={sc.id}
                to={`/nominees?category=${encodeURIComponent(category?.name ?? categoryName)}&subcategory=${encodeURIComponent(sc.name)}`}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs border bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur transition-colors",
                  t.chipBorder,
                  t.chipText,
                )}
              >
                {sc.name}
              </Link>
            ))}
          </div>
        )}

        {/* Nominee grid */}
        {loading ? (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl bg-white/[0.04]" />
            ))}
          </div>
        ) : nominees.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-12 text-center">
            <Award className={cn("mx-auto mb-3 h-10 w-10", t.accent)} />
            <p className="text-white/80 font-medium">No verified nominees in this category yet.</p>
            <p className="text-white/50 text-sm mt-1">
              Be the first to nominate a deserving leader.
            </p>
            <Button asChild className={cn("mt-5 rounded-full", t.ctaBg, t.ctaText)}>
              <Link to={`/nominate?category=${encodeURIComponent(category?.slug ?? categoryName)}`}>
                Submit a Nomination
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {nominees.slice(0, maxNominees).map((n, idx) => (
              <motion.article
                key={n.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.4) }}
                className={cn(
                  "group relative rounded-2xl overflow-hidden border bg-white/[0.03] backdrop-blur ring-1 transition-transform duration-300 hover:-translate-y-0.5",
                  t.border,
                  t.ring,
                )}
              >
                <Link to={`/nominees/${n.slug}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={n.photoUrl}
                      alt={n.name}
                      loading="lazy"
                      className={cn(
                        "w-full h-full transition-transform duration-500 group-hover:scale-105",
                        n.imageType === "logo" ? "object-contain p-4 bg-white/[0.04]" : "object-cover",
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                    {n.isPlatinum && (
                      <Badge className="absolute top-2 right-2 bg-white/90 text-charcoal text-[10px]">Platinum</Badge>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-sm font-semibold text-white line-clamp-1">{n.name}</h3>
                    <p className={cn("mt-0.5 text-[11px] line-clamp-1", t.accent)}>{n.subcategoryName}</p>
                    {(n.country || n.region) && (
                      <p className="mt-0.5 text-[11px] text-white/60 line-clamp-1">
                        {[n.country, n.region].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* Footer link */}
        {!loading && nominees.length > maxNominees && (
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className={cn("rounded-full", t.border, t.accent, "hover:bg-white/5")}>
              <Link to={nomineesLink}>
                See all {nominees.length} nominees
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
