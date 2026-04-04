
import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

export default function Nominees() {
  const [searchParams] = useSearchParams();
  const { data: nominees, isLoading } = useNominees();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPathway, setSelectedPathway] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");

  // Derive unique categories and countries
  const { categories, countries, grouped } = useMemo(() => {
    if (!nominees) return { categories: [], countries: [], grouped: new Map() };

    const catMap = new Map<string, string>();
    const countrySet = new Set<string>();
    const groupedMap = new Map<string, EnrichedDatabaseNominee[]>();

    nominees.forEach(n => {
      if (n.status !== "approved" && n.status !== "platinum" && n.status !== "pending") return;
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
  }, [nominees]);

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

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const handleViewAllCategory = (catSlug: string) => {
    setSelectedCategory(catSlug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
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
    <section id="nominees" className="bg-secondary py-14 md:py-20 relative overflow-hidden">
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
            Existing Nominees
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mb-3">
            Existing Nominees
          </h2>
          <p className="text-ivory/70 max-w-2xl mx-auto">
            Browse nominees by category and subcategory. Nominate new leaders, re-nominate impactful changemakers, and vote in eligible Blue Garnet categories.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          className="mb-8 md:mb-10 space-y-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
              <Input
                placeholder="Search nominees by name, category, or country..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-charcoal-light border-gold/30 text-ivory placeholder:text-ivory/50 focus:border-gold"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-56 bg-charcoal-light border-gold/20 text-ivory">
                <Filter className="h-4 w-4 mr-2 text-gold/80" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPathway} onValueChange={setSelectedPathway}>
              <SelectTrigger className="w-full md:w-52 bg-charcoal-light border-gold/20 text-ivory">
                <Globe className="h-4 w-4 mr-2 text-gold/80" />
                <SelectValue placeholder="All Pathways" />
              </SelectTrigger>
              <SelectContent>
                {PATHWAY_OPTIONS.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full md:w-48 bg-charcoal-light border-gold/20 text-ivory">
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
            <p className="text-sm text-ivory/70">
              <Users className="w-4 h-4 inline mr-1 text-gold" />
              {totalFiltered.toLocaleString()} nominees found
            </p>
            {(search || selectedCategory !== "all" || selectedPathway !== "all" || selectedCountry !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary text-xs hover:text-primary/80"
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
            <Users className="w-12 h-12 mx-auto text-gold/30 mb-4" />
            <p className="text-ivory/70">No nominees match your filters.</p>
            <Button
              variant="ghost"
              className="text-gold mt-2 hover:text-gold/80"
              onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedPathway("all"); setSelectedCountry("all"); }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-28 sm:space-y-28 md:space-y-32">
            {Array.from(filteredGrouped.entries()).map(([catSlug, catNominees]) => {
              const catName = catNominees[0]?.categoryName || catSlug;
              const isBG = isBlueGarnetCategory(catName);

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
                  onViewAll={() => handleViewAllCategory(catSlug)}
                  isViewingAll={selectedCategory === catSlug}
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
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            Ready to Make an Impact?
          </h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Nominate an education leader, re-nominate an existing changemaker, or sign up to participate.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
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
              <Button size="lg" variant="outline" className="border-white/20 text-foreground hover:bg-white/5 rounded-full px-8 gap-2">
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
  catSlug, catName, isBlueGarnet, subcatMap, subcatKeys, totalCount, onViewAll, isViewingAll,
}: {
  catSlug: string;
  catName: string;
  isBlueGarnet: boolean;
  subcatMap: Map<string, EnrichedDatabaseNominee[]>;
  subcatKeys: string[];
  totalCount: number;
  onViewAll: () => void;
  isViewingAll: boolean;
}) {
  const [activeSubcat, setActiveSubcat] = useState(subcatKeys[0] || "all");
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const displayNominees = activeSubcat === "all"
    ? Array.from(subcatMap.values()).flat()
    : subcatMap.get(activeSubcat) || [];

  // Show max 8 per category on landing, with "View All" link
  const MAX_DISPLAY = 8;
  const shown = isViewingAll ? displayNominees : displayNominees.slice(0, MAX_DISPLAY);
  const hasMore = !isViewingAll && displayNominees.length > MAX_DISPLAY;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Category Header */}
      <div className={`flex flex-col gap-4 rounded-2xl border border-gold/10 px-4 py-4 md:px-5 md:py-5 mb-5 ${isBlueGarnet ? "bg-blue-900/20" : "bg-gold/5"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center items-center text-center gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center items-center gap-2 sm:gap-3">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${isBlueGarnet ? "bg-blue-600/80" : "bg-gold/20"}`}>
              <Trophy className={`h-5 w-5 ${isBlueGarnet ? "text-white" : "text-gold"}`} />
            </div>
            <div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-ivory">{catName}</h3>
              <p className="text-ivory/60 text-sm">{totalCount} nominees</p>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />
      </div>

      {/* Subcategory Tabs */}
      {subcatKeys.length > 1 && (
        <div className="mb-5 relative">
          <div
            ref={tabsRef}
            className="overflow-x-auto scrollbar-hide"
          >
            <Tabs value={activeSubcat} onValueChange={setActiveSubcat}>
              <TabsList className="bg-charcoal-light/60 border border-gold/10 h-auto flex-nowrap gap-2 rounded-full px-2 py-1 pr-12">
              <TabsTrigger value={subcatKeys[0]} className="rounded-full px-4 py-1.5 text-xs font-medium text-ivory/70 data-[state=active]:bg-gold data-[state=active]:text-charcoal">
                All
              </TabsTrigger>
              {subcatKeys.map(sk => {
                const label = subcatMap.get(sk)?.[0]?.subcategoryName || sk;
                return (
                  <TabsTrigger key={sk} value={sk} className="rounded-full px-4 py-1.5 text-xs font-medium text-ivory/70 data-[state=active]:bg-gold data-[state=active]:text-charcoal">
                    {label.length > 30 ? label.slice(0, 30) + "…" : label}
                  </TabsTrigger>
                );
              })}
              </TabsList>
            </Tabs>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!tabsRef.current) return;
              tabsRef.current.scrollBy({ left: 220, behavior: "smooth" });
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gold text-charcoal shadow-[0_6px_20px_rgba(201,168,76,0.35)] hover:bg-gold/90 transition"
            aria-label="Scroll subcategories"
          >
            <ChevronRight className="h-4 w-4 mx-auto" />
          </button>
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
            className="rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_4px_24px_rgba(201,168,76,0.12)]"
          >
            <LandingNomineeCard nominee={nominee} isBlueGarnet={isBlueGarnet} />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAll}
            className="border-gold/30 text-gold hover:bg-gold/10 rounded-full gap-1"
          >
            View All {displayNominees.length} Nominees <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
