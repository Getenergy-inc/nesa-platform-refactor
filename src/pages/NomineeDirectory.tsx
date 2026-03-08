import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Filter, Users, Globe2, MapPin, Building2, ChevronDown, LayoutGrid, List, Trophy, Award, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NomineeStoryCard } from "@/components/nominees/NomineeStoryCard";
import {
  filterMasterNominees,
  getMasterCategories,
  getMasterRegions,
  getMasterStats,
} from "@/lib/nomineeMasterData";

const ITEMS_PER_PAGE = 24;

export default function NomineeDirectory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const region = searchParams.get("region") || "all";
  const pathway = searchParams.get("pathway") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const categories = useMemo(() => getMasterCategories(), []);
  const regions = useMemo(() => getMasterRegions(), []);
  const stats = useMemo(() => getMasterStats(), []);

  const filtered = useMemo(() => {
    return filterMasterNominees({ search, category, region, pathway });
  }, [search, category, region, pathway]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all" || !value) params.delete(key);
    else params.set(key, value);
    params.set("page", "1");
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});
  const hasActiveFilters = category !== "all" || region !== "all" || pathway !== "all" || search;

  return (
    <>
      <Helmet>
        <title>2025 Nominee Directory | NESA Africa Awards</title>
        <meta name="description" content="Explore NESA Africa 2025 Award nominees across 14 categories, 5 regions, and 3 pathways. Vote and support education champions across Africa." />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <div className="relative py-16 md:py-20 border-b border-gold/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
          <div className="absolute top-10 right-10 w-64 h-64 bg-gold/3 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20">
                  <Trophy className="w-6 h-6 text-gold" />
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-gold/10 text-gold border-gold/20 text-xs font-medium">
                    2025 Season
                  </Badge>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {stats.totalNominees.toLocaleString()} Nominees
                  </Badge>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-display text-ivory font-bold mb-4 tracking-tight">
                NESA Africa Nominee Directory
              </h1>
              <p className="text-ivory/50 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                Recognizing education champions transforming learning outcomes across the African continent. 
                Browse nominees by category, region, or pathway to discover the leaders shaping Africa's educational future.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {[
                { label: "Categories", value: stats.totalCategories, icon: Award },
                { label: "Regions", value: stats.totalRegions, icon: Globe2 },
                { label: "Africans in Africa", value: stats.byPathway["Africans in Africa"], icon: MapPin },
                { label: "Nigeria Focus", value: stats.byPathway.Nigeria, icon: Building2 },
                { label: "Diaspora", value: stats.byPathway["Africans in Diaspora"], icon: Users },
              ].map(s => (
                <div key={s.label} className="text-center group">
                  <div className="flex items-center justify-center gap-1.5 text-gold mb-1.5 group-hover:scale-105 transition-transform">
                    <s.icon className="w-4 h-4 opacity-60" />
                    <span className="text-xl font-display font-bold">{s.value}</span>
                  </div>
                  <span className="text-ivory/40 text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/30" />
              <Input
                placeholder="Search nominees, categories, countries..."
                value={search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-9 bg-charcoal-light border-gold/10 text-ivory placeholder:text-ivory/30 h-10"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select value={pathway} onValueChange={(v) => updateFilter("pathway", v)}>
                <SelectTrigger className="w-[170px] h-10 bg-charcoal-light border-gold/10 text-ivory text-sm">
                  <SelectValue placeholder="Pathway" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-gold/10">
                  <SelectItem value="all" className="text-ivory">All Pathways</SelectItem>
                  <SelectItem value="Africans in Africa" className="text-ivory">Africans in Africa</SelectItem>
                  <SelectItem value="Nigeria" className="text-ivory">Nigeria</SelectItem>
                  <SelectItem value="Africans in Diaspora" className="text-ivory">Africans in Diaspora</SelectItem>
                  <SelectItem value="Friends of Africa" className="text-ivory">Friends of Africa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={region} onValueChange={(v) => updateFilter("region", v)}>
                <SelectTrigger className="w-[150px] h-10 bg-charcoal-light border-gold/10 text-ivory text-sm">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-gold/10">
                  <SelectItem value="all" className="text-ivory">All Regions</SelectItem>
                  {regions.map(r => (
                    <SelectItem key={r} value={r} className="text-ivory">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 border-gold/10 text-ivory/60 hover:text-gold">
                    <Filter className="w-4 h-4 mr-1.5" />
                    Category
                    <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 text-gold/60 hover:text-gold text-xs">
                  Clear All
                </Button>
              )}

              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${viewMode === "grid" ? "text-gold" : "text-ivory/30"}`} onClick={() => setViewMode("grid")}>
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className={`h-8 w-8 ${viewMode === "list" ? "text-gold" : "text-ivory/30"}`} onClick={() => setViewMode("list")}>
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Filter Dropdown */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent>
              <div className="mt-3 p-4 bg-charcoal-light/50 rounded-lg border border-gold/10">
                <h4 className="text-ivory/60 text-xs font-medium mb-3 uppercase tracking-wider">Award Categories</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost" size="sm"
                    className={`h-7 text-xs ${category === "all" ? "bg-gold/20 text-gold" : "text-ivory/40 hover:text-ivory"}`}
                    onClick={() => updateFilter("category", "all")}
                  >
                    All ({stats.loadedNominees})
                  </Button>
                  {categories.map(c => (
                    <Button
                      key={c.slug} variant="ghost" size="sm"
                      className={`h-7 text-xs ${category === c.slug ? "bg-gold/20 text-gold" : "text-ivory/40 hover:text-ivory"}`}
                      onClick={() => updateFilter("category", c.slug)}
                    >
                      {c.name.length > 50 ? c.name.slice(0, 50) + "…" : c.name} ({c.count})
                    </Button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-ivory/40 text-sm">
              Showing <span className="text-gold font-medium">{paginated.length}</span> of{" "}
              <span className="text-ivory/60">{filtered.length.toLocaleString()}</span> nominees
              <span className="text-ivory/30 ml-2">• 2025 Season</span>
            </p>
          </div>

          {/* Nominees Grid/List */}
          <div className={`mt-6 ${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }`}>
            {paginated.map(nominee => (
              <NomineeStoryCard key={nominee.id} nominee={nominee} showWorkflow />
            ))}
          </div>

          {/* Empty State */}
          {paginated.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-ivory/20 mx-auto mb-4" />
              <h3 className="text-ivory/60 text-lg font-display mb-2">No nominees found</h3>
              <p className="text-ivory/40 text-sm mb-4">Try adjusting your filters or search term.</p>
              <Button onClick={clearFilters} className="bg-gold hover:bg-gold-dark text-charcoal">
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => updateFilter("page", "1")} className="border-gold/10 text-ivory/40 hover:text-gold disabled:opacity-30">First</Button>
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => updateFilter("page", String(page - 1))} className="border-gold/10 text-ivory/40 hover:text-gold disabled:opacity-30">Previous</Button>
              <span className="text-ivory/50 text-sm px-3">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => updateFilter("page", String(page + 1))} className="border-gold/10 text-ivory/40 hover:text-gold disabled:opacity-30">Next</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => updateFilter("page", String(totalPages))} className="border-gold/10 text-ivory/40 hover:text-gold disabled:opacity-30">Last</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
