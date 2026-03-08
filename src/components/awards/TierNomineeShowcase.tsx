/**
 * Tier-specific Nominee Showcase
 * Displays nominees filtered by award tier with search, filters, and action buttons.
 * Reusable across Blue Garnet, Platinum, Gold, and Gold Special award pages.
 */

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Users, Trophy, RotateCcw, ChevronRight, Filter, Globe, ArrowRight,
} from "lucide-react";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import { getCategoriesByTier, type AwardTier } from "@/config/nesaCategories";

const BLUE_GARNET_KEYWORDS = ["blue garnet", "blue-garnet"];

function isBlueGarnetCategory(catName: string): boolean {
  return BLUE_GARNET_KEYWORDS.some(kw => catName.toLowerCase().includes(kw));
}

const PATHWAY_OPTIONS = [
  { value: "all", label: "All Pathways" },
  { value: "africa", label: "Africans in Africa" },
  { value: "diaspora", label: "Africans in Diaspora" },
  { value: "friends", label: "Friends of Africa" },
];

interface TierNomineeShowcaseProps {
  /** Which award tier to filter nominees by */
  tier: AwardTier;
  /** Accent color for styling */
  accentColor?: "slate" | "amber" | "blue" | "purple" | "yellow";
  /** Section title override */
  title?: string;
  /** Section description override */
  description?: string;
}

export function TierNomineeShowcase({
  tier,
  accentColor = "amber",
  title,
  description,
}: TierNomineeShowcaseProps) {
  const { data: nominees, isLoading } = useNominees();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPathway, setSelectedPathway] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");

  // Get category slugs for this tier
  const tierCategorySlugs = useMemo(() => {
    const cats = getCategoriesByTier(tier);
    return new Set(cats.map(c => c.slug));
  }, [tier]);

  const isBlueGarnet = tier === "blue-garnet";

  // Derive unique categories and countries filtered by tier
  const { categories, countries, grouped } = useMemo(() => {
    if (!nominees) return { categories: [], countries: [], grouped: new Map() };

    const catMap = new Map<string, string>();
    const countrySet = new Set<string>();
    const groupedMap = new Map<string, EnrichedDatabaseNominee[]>();

    nominees.forEach(n => {
      if (n.status !== "approved" && n.status !== "platinum" && n.status !== "pending") return;
      // Filter by tier categories
      if (!tierCategorySlugs.has(n.categorySlug)) return;

      catMap.set(n.categorySlug, n.categoryName);
      if (n.country) countrySet.add(n.country);

      const key = n.categorySlug;
      if (!groupedMap.has(key)) groupedMap.set(key, []);
      groupedMap.get(key)!.push(n);
    });

    return {
      categories: Array.from(catMap.entries()).map(([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name)),
      countries: Array.from(countrySet).sort(),
      grouped: groupedMap,
    };
  }, [nominees, tierCategorySlugs]);

  // Filter nominees
  const filteredGrouped = useMemo(() => {
    const result = new Map<string, EnrichedDatabaseNominee[]>();

    grouped.forEach((noms, catSlug) => {
      if (selectedCategory !== "all" && catSlug !== selectedCategory) return;

      const filtered = noms.filter(n => {
        if (search) {
          const q = search.toLowerCase();
          const match = n.name.toLowerCase().includes(q) ||
            n.categoryName.toLowerCase().includes(q) ||
            n.subcategoryName.toLowerCase().includes(q) ||
            (n.country || "").toLowerCase().includes(q) ||
            (n.achievement || "").toLowerCase().includes(q);
          if (!match) return false;
        }
        if (selectedCountry !== "all" && n.country !== selectedCountry) return false;
        if (selectedPathway !== "all") {
          const geo = n.geographicCategory;
          if (selectedPathway === "africa" && (geo === "diaspora" || geo === "friends-of-africa")) return false;
          if (selectedPathway === "diaspora" && geo !== "diaspora") return false;
          if (selectedPathway === "friends" && geo !== "friends-of-africa") return false;
        }
        return true;
      });

      if (filtered.length > 0) result.set(catSlug, filtered);
    });

    return result;
  }, [grouped, selectedCategory, selectedCountry, selectedPathway, search]);

  const totalFiltered = useMemo(() => {
    let count = 0;
    filteredGrouped.forEach(noms => count += noms.length);
    return count;
  }, [filteredGrouped]);

  const displayTitle = title || `${tier === "blue-garnet" ? "Blue Garnet" : tier === "gold-special" ? "Gold Special" : tier.charAt(0).toUpperCase() + tier.slice(1)} Nominees`;
  const displayDescription = description || `Browse and discover nominees in this award tier. Nominate new leaders, re-nominate impactful changemakers, and engage with the recognition process.`;

  if (isLoading) {
    return (
      <section className="bg-charcoal/95 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tier-nominees" className="bg-charcoal/95 py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
            Existing Nominees
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {displayTitle}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            {displayDescription}
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          className="mb-10 space-y-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search nominees by name, category, or country..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/40"
              />
            </div>

            {categories.length > 1 && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-56 bg-white/[0.04] border-white/[0.08] text-white">
                  <Filter className="h-4 w-4 mr-2 text-white/40" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedPathway} onValueChange={setSelectedPathway}>
              <SelectTrigger className="w-full md:w-52 bg-white/[0.04] border-white/[0.08] text-white">
                <Globe className="h-4 w-4 mr-2 text-white/40" />
                <SelectValue placeholder="All Pathways" />
              </SelectTrigger>
              <SelectContent>
                {PATHWAY_OPTIONS.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full md:w-48 bg-white/[0.04] border-white/[0.08] text-white">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-white/60">
              <Users className="w-4 h-4 inline mr-1" />
              {totalFiltered.toLocaleString()} nominees found
            </p>
            {(search || selectedCategory !== "all" || selectedPathway !== "all" || selectedCountry !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary text-xs"
                onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedPathway("all"); setSelectedCountry("all"); }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Category Grouped Nominees */}
        {filteredGrouped.size === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 mx-auto text-white/20 mb-4" />
            <p className="text-white/60">No nominees match your filters.</p>
            <Button
              variant="ghost"
              className="text-primary mt-2"
              onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedPathway("all"); setSelectedCountry("all"); }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-16">
            {Array.from(filteredGrouped.entries()).map(([catSlug, catNominees]) => {
              const catName = catNominees[0]?.categoryName || catSlug;
              const isBG = isBlueGarnet || isBlueGarnetCategory(catName);

              // Group by subcategory
              const subcatMap = new Map<string, EnrichedDatabaseNominee[]>();
              catNominees.forEach(n => {
                const key = n.subcategorySlug || "general";
                if (!subcatMap.has(key)) subcatMap.set(key, []);
                subcatMap.get(key)!.push(n);
              });

              const subcatKeys = Array.from(subcatMap.keys());

              return (
                <CategoryBlock
                  key={catSlug}
                  catSlug={catSlug}
                  catName={catName}
                  isBlueGarnet={isBG}
                  subcatMap={subcatMap}
                  subcatKeys={subcatKeys}
                  totalCount={catNominees.length}
                />
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 rounded-2xl border border-primary/20 bg-primary/[0.04] p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Make an Impact?
          </h3>
          <p className="text-white/60 max-w-lg mx-auto mb-6">
            Nominate an education leader, re-nominate an existing changemaker, or sign up to participate.
          </p>
          <p className="text-xs text-white/40 mb-6">
            You can begin a nomination now, but final confirmation requires sign-up or sign-in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/nominate">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8 gap-2">
                <Trophy className="w-5 h-5" />
                Nominate
              </Button>
            </Link>
            <Link to="/nominees">
              <Button size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 rounded-full px-8 gap-2">
                <RotateCcw className="w-5 h-5" />
                Re-Nominate
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 gap-2">
                Sign Up / Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Category Block with Subcategory Tabs ─── */

function CategoryBlock({
  catSlug, catName, isBlueGarnet, subcatMap, subcatKeys, totalCount,
}: {
  catSlug: string;
  catName: string;
  isBlueGarnet: boolean;
  subcatMap: Map<string, EnrichedDatabaseNominee[]>;
  subcatKeys: string[];
  totalCount: number;
}) {
  const [activeSubcat, setActiveSubcat] = useState(subcatKeys[0] || "all");
  const displayNominees = activeSubcat === "all"
    ? Array.from(subcatMap.values()).flat()
    : subcatMap.get(activeSubcat) || [];

  const MAX_DISPLAY = 8;
  const shown = displayNominees.slice(0, MAX_DISPLAY);
  const hasMore = displayNominees.length > MAX_DISPLAY;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isBlueGarnet ? "bg-blue-600" : "bg-primary/20"}`}>
            <Trophy className={`h-5 w-5 ${isBlueGarnet ? "text-white" : "text-primary"}`} />
          </div>
          <div>
            <h3 className="font-display text-lg md:text-xl font-bold text-white">{catName}</h3>
            <p className="text-white/50 text-sm">{totalCount} nominees</p>
          </div>
        </div>
        <Link
          to={`/categories/${catSlug}`}
          className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Subcategory Tabs */}
      {subcatKeys.length > 1 && (
        <div className="mb-5 overflow-x-auto scrollbar-hide">
          <Tabs value={activeSubcat} onValueChange={setActiveSubcat}>
            <TabsList className="bg-white/[0.04] border border-white/[0.08] h-auto flex-wrap">
              <TabsTrigger value={subcatKeys[0]} className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                All
              </TabsTrigger>
              {subcatKeys.map(sk => {
                const label = subcatMap.get(sk)?.[0]?.subcategoryName || sk;
                return (
                  <TabsTrigger key={sk} value={sk} className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    {label.length > 30 ? label.slice(0, 30) + "…" : label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Nominee Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {shown.map((nominee, i) => (
          <motion.div
            key={nominee.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            viewport={{ once: true }}
          >
            <LandingNomineeCard nominee={nominee} isBlueGarnet={isBlueGarnet} />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-5">
          <Link to={`/nominees?category=${catSlug}`}>
            <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 rounded-full gap-1">
              View All {displayNominees.length} Nominees <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export default TierNomineeShowcase;
