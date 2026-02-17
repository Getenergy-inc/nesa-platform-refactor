import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Users, Filter, ChevronLeft, ChevronRight, LayoutGrid, List, Loader2, MapPin, Globe2, Building2, Heart, Database, FileText, SortAsc, Crown, Trophy, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NomineeCard, NomineeCardSkeleton, type NomineeCardData } from "@/components/nesa/NomineeCard";
import { 
  useNominees, 
  getNomineesByGeography as getDbNomineesByGeography,
  getGeographicStats,
  getCategoryOptions,
  type EnrichedDatabaseNominee 
} from "@/hooks/useNominees";
import { 
  getAllNominees as getCsvNominees, 
  getNomineesByGeography as getCsvNomineesByGeography,
  getGeographicGroups as getCsvGeographicGroups,
  getAfricaRegions as getCsvAfricaRegions,
  getDiasporaSubgroups as getCsvDiasporaSubgroups,
  getFriendsOfAfricaSubgroups as getCsvFriendsSubgroups,
  getAwardOptions as getCsvAwardOptions, 
  getStats as getCsvStats,
  type GeographicCategory,
  type EnrichedNominee
} from "@/lib/nesaData";
import {
  NESA_CATEGORIES,
  getCategoriesByTier,
  TIER_INFO,
  getScopeBadge,
  type AwardTier,
  type CategoryScope,
} from "@/config/nesaCategories";

const ITEMS_PER_PAGE = 12;

type SortOption = "name-asc" | "name-desc" | "newest" | "votes";

// Tier filter options
type TierFilter = "all" | AwardTier;
const TIER_FILTER_OPTIONS: { value: TierFilter; label: string; icon: string }[] = [
  { value: "all", label: "All Tiers", icon: "🌍" },
  { value: "blue-garnet", label: "Blue Garnet", icon: "🏆" },
  { value: "platinum", label: "Platinum", icon: "💎" },
  { value: "gold-special", label: "Gold Special (2025)", icon: "🥇" },
  { value: "icon", label: "Lifetime", icon: "🏛" },
];

// Scope filter options
const SCOPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Scopes" },
  { value: "AFRICA_REGIONAL", label: "Africa Regional" },
  { value: "NIGERIA", label: "Nigeria" },
  { value: "INTERNATIONAL", label: "International" },
];

// Icons for geographic categories
const categoryIcons: Record<string, React.ReactNode> = {
  "all": <Users className="w-4 h-4" />,
  "africa-regions": <Globe2 className="w-4 h-4" />,
  "diaspora": <Building2 className="w-4 h-4" />,
  "friends-of-africa": <Heart className="w-4 h-4" />,
  "icon": <Crown className="w-4 h-4" />,
};

const categorySubtitles: Record<string, string> = {
  "all": "All education champions across every track",
  "africa-regions": "Africans Living in Africa",
  "diaspora": "Diaspora Africans",
  "friends-of-africa": "Friends of Africa",
  "icon": "3 Residents · 3 Diaspora · 3 Friends — Lifetime Achievement",
};

// Unified nominee type for display
interface DisplayNominee {
  id: string;
  name: string;
  slug: string;
  achievement: string;
  photoUrl: string;
  country?: string;
  region?: string;
  categoryName: string;
  categorySlug: string;
  subcategoryName?: string;
  geographicCategory: GeographicCategory;
  isPlatinum: boolean;
  publicVotes: number;
}

// Convert database nominee to display format
function dbToDisplay(nominee: EnrichedDatabaseNominee): DisplayNominee {
  return {
    id: nominee.id,
    name: nominee.name,
    slug: nominee.slug,
    achievement: nominee.achievement,
    photoUrl: nominee.photoUrl,
    country: nominee.country || undefined,
    region: nominee.region || undefined,
    categoryName: nominee.categoryName,
    categorySlug: nominee.categorySlug,
    geographicCategory: nominee.geographicCategory,
    isPlatinum: nominee.isPlatinum,
    publicVotes: nominee.publicVotes,
  };
}

// Convert CSV nominee to display format
function csvToDisplay(nominee: EnrichedNominee): DisplayNominee {
  return {
    id: nominee.id,
    name: nominee.name,
    slug: nominee.slug,
    achievement: nominee.achievement || "",
    photoUrl: nominee.imageUrl,
    country: nominee.country,
    region: nominee.regionName,
    categoryName: nominee.awardTitle,
    categorySlug: nominee.awardSlug,
    subcategoryName: nominee.subcategoryTitle,
    geographicCategory: nominee.geographicCategory,
    isPlatinum: false,
    publicVotes: 0,
  };
}

export default function Nominees() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params for persistence
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedTier, setSelectedTier] = useState<TierFilter>(
    (searchParams.get("tier") as TierFilter) || "all"
  );
  const [selectedScope, setSelectedScope] = useState<string>(
    searchParams.get("scope") || "all"
  );
  const [selectedCategory, setSelectedCategory] = useState<GeographicCategory>(
    (searchParams.get("category") as GeographicCategory) || "all"
  );
  const [selectedAward, setSelectedAward] = useState<string>(searchParams.get("award") || "all");
  const [selectedRegion, setSelectedRegion] = useState<GeographicCategory | "all">(
    (searchParams.get("region") as GeographicCategory) || "all"
  );
  const [selectedDiasporaSubgroup, setSelectedDiasporaSubgroup] = useState<string>(
    searchParams.get("diaspora_group") || "all"
  );
  const [selectedFriendsSubgroup, setSelectedFriendsSubgroup] = useState<string>(
    searchParams.get("friends_group") || "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "name-asc"
  );
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Sync state changes to URL for shareable links
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedTier !== "all") params.set("tier", selectedTier);
    if (selectedScope !== "all") params.set("scope", selectedScope);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedAward !== "all") params.set("award", selectedAward);
    if (selectedRegion !== "all") params.set("region", selectedRegion);
    if (selectedDiasporaSubgroup !== "all") params.set("diaspora_group", selectedDiasporaSubgroup);
    if (selectedFriendsSubgroup !== "all") params.set("friends_group", selectedFriendsSubgroup);
    if (sortBy !== "name-asc") params.set("sort", sortBy);
    if (currentPage > 1 && !useInfiniteScroll) params.set("page", currentPage.toString());
    
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedTier, selectedScope, selectedCategory, selectedAward, selectedRegion, selectedDiasporaSubgroup, selectedFriendsSubgroup, sortBy, currentPage, useInfiniteScroll, setSearchParams]);

  // Fetch from database
  const { data: dbNominees, isLoading: dbLoading, error: dbError } = useNominees();

  // Determine data source: prefer database if it has data, fallback to CSV
  const useDatabase = dbNominees && dbNominees.length > 0;
  const dataSource = useDatabase ? "database" : "csv";

  // Get all nominees based on data source
  const allNominees = useMemo((): DisplayNominee[] => {
    if (useDatabase && dbNominees) {
      return dbNominees.map(dbToDisplay);
    }
    // Fallback to CSV
    return getCsvNominees().map(csvToDisplay);
  }, [useDatabase, dbNominees]);

  // Geographic groups and stats
  const geographicGroups = useMemo(() => {
    if (useDatabase && dbNominees) {
      const stats = getGeographicStats(dbNominees);
      // Count icon nominees (those with categorySlug containing "icon" or award tier)
      const iconCount = dbNominees.filter(n => 
        n.categorySlug?.includes('icon') || n.categoryName?.toLowerCase().includes('icon')
      ).length;
      return [
        { id: "all" as GeographicCategory, name: "All Nominees", description: "View all nominees", nomineeCount: stats.total },
        { id: "africa-regions" as GeographicCategory, name: "Africa Regions", description: "Africans Living in Africa", nomineeCount: stats.africaRegions },
        { id: "diaspora" as GeographicCategory, name: "Diaspora", description: "Diaspora Africans", nomineeCount: stats.diaspora },
        { id: "friends-of-africa" as GeographicCategory, name: "Friends of Africa", description: "Friends of Africa", nomineeCount: stats.friendsOfAfrica },
        { id: "icon" as GeographicCategory, name: "Africa Education Icon", description: "Lifetime Achievement", nomineeCount: iconCount },
      ];
    }
    return getCsvGeographicGroups();
  }, [useDatabase, dbNominees]);

  const africaRegions = useMemo(() => {
    if (useDatabase && dbNominees) {
      const stats = getGeographicStats(dbNominees);
      return [
        { id: "north-africa" as GeographicCategory, name: "North Africa", nomineeCount: stats.byRegion["north-africa"] || 0 },
        { id: "east-africa" as GeographicCategory, name: "East Africa", nomineeCount: stats.byRegion["east-africa"] || 0 },
        { id: "west-africa" as GeographicCategory, name: "West Africa", nomineeCount: stats.byRegion["west-africa"] || 0 },
        { id: "south-africa" as GeographicCategory, name: "South Africa", nomineeCount: stats.byRegion["south-africa"] || 0 },
        { id: "central-africa" as GeographicCategory, name: "Central Africa", nomineeCount: stats.byRegion["central-africa"] || 0 },
      ];
    }
    return getCsvAfricaRegions();
  }, [useDatabase, dbNominees]);

  // Diaspora subgroups
  const diasporaSubgroups = useMemo(() => {
    if (useDatabase && dbNominees) {
      // Group diaspora nominees by subcategory from DB
      const diasporaNominees = dbNominees.filter(n => n.geographicCategory === "diaspora");
      const subgroupMap: Record<string, number> = {};
      diasporaNominees.forEach(n => {
        const key = n.categoryName || "Other";
        subgroupMap[key] = (subgroupMap[key] || 0) + 1;
      });
      return Object.entries(subgroupMap)
        .map(([name, count]) => ({
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          name,
          nomineeCount: count,
        }))
        .sort((a, b) => b.nomineeCount - a.nomineeCount);
    }
    return getCsvDiasporaSubgroups();
  }, [useDatabase, dbNominees]);

  // Friends of Africa subgroups
  const friendsSubgroups = useMemo(() => {
    if (useDatabase && dbNominees) {
      const friendsNominees = dbNominees.filter(n => n.geographicCategory === "friends-of-africa");
      const subgroupMap: Record<string, number> = {};
      friendsNominees.forEach(n => {
        const key = n.categoryName || "Other";
        subgroupMap[key] = (subgroupMap[key] || 0) + 1;
      });
      return Object.entries(subgroupMap)
        .map(([name, count]) => ({
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          name,
          nomineeCount: count,
        }))
        .sort((a, b) => b.nomineeCount - a.nomineeCount);
    }
    return getCsvFriendsSubgroups();
  }, [useDatabase, dbNominees]);

  const awardOptions = useMemo(() => {
    if (useDatabase && dbNominees) {
      return getCategoryOptions(dbNominees);
    }
    return getCsvAwardOptions();
  }, [useDatabase, dbNominees]);

  const stats = useMemo(() => {
    if (useDatabase && dbNominees) {
      const s = getGeographicStats(dbNominees);
      return {
        totalNominees: s.total,
        africaRegionsCount: s.africaRegions,
        diasporaCount: s.diaspora,
        friendsOfAfricaCount: s.friendsOfAfrica,
      };
    }
    return getCsvStats();
  }, [useDatabase, dbNominees]);

  // Filter nominees by geographic category
  const baseNominees = useMemo(() => {
    let filtered = allNominees;
    
    if (selectedCategory !== "all") {
      if (selectedCategory === "africa-regions") {
        if (selectedRegion !== "all") {
          filtered = filtered.filter(n => n.geographicCategory === selectedRegion);
        } else {
          filtered = filtered.filter(n => 
            ["north-africa", "east-africa", "west-africa", "south-africa", "central-africa"].includes(n.geographicCategory)
          );
        }
      } else if (selectedCategory === "diaspora") {
        filtered = filtered.filter(n => n.geographicCategory === "diaspora");
        if (selectedDiasporaSubgroup !== "all") {
          const matchGroup = diasporaSubgroups.find(g => g.id === selectedDiasporaSubgroup);
          if (matchGroup) {
            filtered = filtered.filter(n => n.subcategoryName === matchGroup.name || n.categoryName === matchGroup.name);
          }
        }
      } else if (selectedCategory === "friends-of-africa") {
        filtered = filtered.filter(n => n.geographicCategory === "friends-of-africa");
        if (selectedFriendsSubgroup !== "all") {
          const matchGroup = friendsSubgroups.find(g => g.id === selectedFriendsSubgroup);
          if (matchGroup) {
            filtered = filtered.filter(n => n.subcategoryName === matchGroup.name || n.categoryName === matchGroup.name);
          }
        }
      } else if ((selectedCategory as string) === "icon") {
        filtered = filtered.filter(n => 
          n.categorySlug?.includes('icon') || n.categoryName?.toLowerCase().includes('icon')
        );
      } else {
        filtered = filtered.filter(n => n.geographicCategory === selectedCategory);
      }
    }
    
    return filtered;
  }, [allNominees, selectedCategory, selectedRegion, selectedDiasporaSubgroup, diasporaSubgroups, selectedFriendsSubgroup, friendsSubgroups]);

  // Apply search and award filters, then sort
  const filteredNominees = useMemo(() => {
    let result = baseNominees.filter((nominee) => {
      const matchesSearch =
        searchQuery === "" ||
        nominee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.achievement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.region?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAward =
        selectedAward === "all" || nominee.categorySlug === selectedAward;

      return matchesSearch && matchesAward;
    });

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "votes":
        result.sort((a, b) => b.publicVotes - a.publicVotes);
        break;
      case "newest":
        // For now, just reverse the default order as a proxy for "newest"
        result.reverse();
        break;
    }

    return result;
  }, [baseNominees, searchQuery, selectedAward, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredNominees.length / ITEMS_PER_PAGE);
  const paginatedNominees = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNominees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNominees, currentPage]);

  // Infinite scroll nominees
  const infiniteScrollNominees = useMemo(() => {
    return filteredNominees.slice(0, visibleCount);
  }, [filteredNominees, visibleCount]);

  const hasMore = visibleCount < filteredNominees.length;

  // Reset when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleCategoryChange = (value: GeographicCategory) => {
    setSelectedCategory(value);
    setSelectedRegion("all");
    setSelectedDiasporaSubgroup("all");
    setSelectedFriendsSubgroup("all");
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleDiasporaSubgroupChange = (value: string) => {
    setSelectedDiasporaSubgroup(value);
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleFriendsSubgroupChange = (value: string) => {
    setSelectedFriendsSubgroup(value);
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value as GeographicCategory | "all");
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleAwardChange = (value: string) => {
    setSelectedAward(value);
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Infinite scroll intersection observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && useInfiniteScroll) {
        setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredNominees.length));
      }
    },
    [hasMore, useInfiniteScroll, filteredNominees.length]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !useInfiniteScroll) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver, useInfiniteScroll]);

  // Reset visible count when switching modes
  useEffect(() => {
    if (useInfiniteScroll) {
      setVisibleCount(ITEMS_PER_PAGE);
    }
  }, [useInfiniteScroll]);

  const displayedNominees = useInfiniteScroll ? infiniteScrollNominees : paginatedNominees;
  const isLoading = dbLoading;

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
              <Users className="w-3 h-3 mr-1" />
              Education Champions Directory
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory mb-4">
              Meet Our <span className="text-gold">Nominees</span>
            </h1>
            <p className="text-lg text-ivory/70 mb-6">
              Discover the remarkable educators, innovators, and institutions transforming education across Africa.
            </p>
            {/* Live indicator - subtle */}
            {dataSource === "database" && (
              <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tier Filter Tabs */}
      <section className="border-b border-gold/10 bg-charcoal-light/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {TIER_FILTER_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={selectedTier === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedTier(opt.value);
                  setSelectedAward("all");
                  setCurrentPage(1);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={selectedTier === opt.value
                  ? "bg-gold text-charcoal hover:bg-gold-dark"
                  : "border-gold/30 text-gold hover:bg-gold/10"
                }
              >
                <span className="mr-1">{opt.icon}</span>
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Geographic Category Tabs */}
      <section className="border-b border-gold/10 bg-charcoal-light/30 sticky top-16 z-20">
        <div className="container mx-auto px-4 py-4">
          <Tabs
            value={selectedCategory} 
            onValueChange={(v) => handleCategoryChange(v as GeographicCategory)}
            className="w-full"
          >
            <TabsList className="inline-flex h-auto p-1 bg-charcoal/50 rounded-full gap-1 flex-wrap justify-center w-full">
              {geographicGroups.map((group) => (
                <TabsTrigger
                  key={group.id}
                  value={group.id}
                  className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-gold data-[state=active]:text-charcoal flex items-center gap-2"
                >
                  {categoryIcons[group.id] || <Globe2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{group.name}</span>
                  <span className="sm:hidden">{group.name.split(" ")[0]}</span>
                  <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 h-4 border-current/30">
                    {group.nomineeCount}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Category subtitle */}
          {categorySubtitles[selectedCategory] && (
            <p className="text-center text-sm text-ivory/50 mt-3">
              {categorySubtitles[selectedCategory]}
            </p>
          )}

          {/* Africa Region Sub-tabs */}
          {selectedCategory === "africa-regions" && (
            <div className="mt-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 justify-center min-w-max pb-2">
                <Button
                  variant={selectedRegion === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRegionChange("all")}
                  className={selectedRegion === "all" 
                    ? "bg-gold text-charcoal hover:bg-gold-dark" 
                    : "border-gold/30 text-gold hover:bg-gold/10"
                  }
                >
                  All Regions
                </Button>
                {africaRegions.map((region) => (
                  <Button
                    key={region.id}
                    variant={selectedRegion === region.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRegionChange(region.id)}
                    className={selectedRegion === region.id 
                      ? "bg-gold text-charcoal hover:bg-gold-dark" 
                      : "border-gold/30 text-gold hover:bg-gold/10"
                    }
                  >
                    {region.name}
                    <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 h-4 border-current/30">
                      {region.nomineeCount}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Diaspora Sub-tabs */}
          {selectedCategory === "diaspora" && diasporaSubgroups.length > 0 && (
            <div className="mt-4 overflow-x-auto scrollbar-hide">
              <p className="text-xs text-ivory/40 mb-2 text-center">Filter by Diaspora Region</p>
              <div className="flex gap-2 justify-center min-w-max pb-2">
                <Button
                  variant={selectedDiasporaSubgroup === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDiasporaSubgroupChange("all")}
                  className={selectedDiasporaSubgroup === "all" 
                    ? "bg-gold text-charcoal hover:bg-gold-dark" 
                    : "border-gold/30 text-gold hover:bg-gold/10"
                  }
                >
                  <Globe2 className="w-3.5 h-3.5 mr-1" />
                  All Diaspora
                </Button>
                {diasporaSubgroups.map((subgroup) => (
                  <Button
                    key={subgroup.id}
                    variant={selectedDiasporaSubgroup === subgroup.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDiasporaSubgroupChange(subgroup.id)}
                    className={selectedDiasporaSubgroup === subgroup.id 
                      ? "bg-gold text-charcoal hover:bg-gold-dark" 
                      : "border-gold/30 text-gold hover:bg-gold/10"
                    }
                  >
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {subgroup.name
                      .replace(/^the best diaspora-led educational\s*/i, '')
                      .replace(/-based associations?/i, '')
                      .replace(/associations?/i, '')
                      .replace(/\s+/g, ' ')
                      .trim() || subgroup.name}
                    <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 h-4 border-current/30">
                      {subgroup.nomineeCount}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Friends of Africa Sub-tabs */}
          {selectedCategory === "friends-of-africa" && friendsSubgroups.length > 0 && (
            <div className="mt-4 overflow-x-auto scrollbar-hide">
              <p className="text-xs text-ivory/40 mb-2 text-center">Filter by Contribution Area</p>
              <div className="flex gap-2 justify-center min-w-max pb-2">
                <Button
                  variant={selectedFriendsSubgroup === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFriendsSubgroupChange("all")}
                  className={selectedFriendsSubgroup === "all" 
                    ? "bg-gold text-charcoal hover:bg-gold-dark" 
                    : "border-gold/30 text-gold hover:bg-gold/10"
                  }
                >
                  <Heart className="w-3.5 h-3.5 mr-1" />
                  All Friends
                </Button>
                {friendsSubgroups.map((subgroup) => (
                  <Button
                    key={subgroup.id}
                    variant={selectedFriendsSubgroup === subgroup.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFriendsSubgroupChange(subgroup.id)}
                    className={selectedFriendsSubgroup === subgroup.id 
                      ? "bg-gold text-charcoal hover:bg-gold-dark" 
                      : "border-gold/30 text-gold hover:bg-gold/10"
                    }
                  >
                    <Globe2 className="w-3.5 h-3.5 mr-1" />
                    {subgroup.name
                      .replace(/^the best\s*/i, '')
                      .replace(/\s+/g, ' ')
                      .trim() || subgroup.name}
                    <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 h-4 border-current/30">
                      {subgroup.nomineeCount}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search, Filters, and Sort */}
      <section className="py-6 bg-charcoal">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory/40" />
              <Input
                placeholder="Search nominees by name, achievement, country..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-charcoal-light border-gold/20 text-ivory placeholder:text-ivory/40 focus:border-gold"
              />
            </div>
            <Select value={selectedAward} onValueChange={handleAwardChange}>
              <SelectTrigger className="w-full md:w-[220px] bg-charcoal-light border-gold/20 text-ivory">
                <Filter className="w-4 h-4 mr-2 text-gold" />
                <SelectValue placeholder="All Awards" />
              </SelectTrigger>
              <SelectContent className="bg-charcoal-light border-gold/20 max-h-[300px]">
                <SelectItem value="all" className="text-ivory hover:bg-gold/10">
                  All Awards
                </SelectItem>
                {awardOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-ivory hover:bg-gold/10"
                  >
                    {opt.label.length > 50 ? opt.label.substring(0, 50) + "..." : opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full md:w-[160px] bg-charcoal-light border-gold/20 text-ivory">
                <SortAsc className="w-4 h-4 mr-2 text-gold" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-charcoal-light border-gold/20">
                <SelectItem value="name-asc" className="text-ivory hover:bg-gold/10">
                  Name (A–Z)
                </SelectItem>
                <SelectItem value="name-desc" className="text-ivory hover:bg-gold/10">
                  Name (Z–A)
                </SelectItem>
                <SelectItem value="votes" className="text-ivory hover:bg-gold/10">
                  Most Votes
                </SelectItem>
                <SelectItem value="newest" className="text-ivory hover:bg-gold/10">
                  Newest First
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-gold/10 bg-charcoal-light/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              { value: stats.totalNominees.toLocaleString(), label: "Total" },
              { value: stats.africaRegionsCount.toLocaleString(), label: "Africa" },
              { value: stats.diasporaCount.toLocaleString(), label: "Diaspora" },
              { value: stats.friendsOfAfricaCount.toLocaleString(), label: "Friends" },
              { value: filteredNominees.length.toLocaleString(), label: "Showing" },
            ].map((stat) => (
              <div key={stat.label} className="text-center min-w-[60px]">
                <div className="text-2xl font-bold text-gold font-display">{stat.value}</div>
                <div className="text-xs text-ivory/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nominees Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* View Mode Toggle */}
          {!isLoading && filteredNominees.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-ivory/60">
                {useInfiniteScroll 
                  ? `Showing ${infiniteScrollNominees.length} of ${filteredNominees.length}`
                  : `Page ${currentPage} of ${totalPages}`
                }
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ivory/60">View:</span>
                <Toggle
                  pressed={!useInfiniteScroll}
                  onPressedChange={() => setUseInfiniteScroll(false)}
                  className="data-[state=on]:bg-gold data-[state=on]:text-charcoal"
                  aria-label="Pagination view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={useInfiniteScroll}
                  onPressedChange={() => setUseInfiniteScroll(true)}
                  className="data-[state=on]:bg-gold data-[state=on]:text-charcoal"
                  aria-label="Infinite scroll view"
                >
                  <List className="h-4 w-4" />
                </Toggle>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <NomineeCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredNominees.length === 0 ? (
            <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                <Search className="w-8 h-8 text-gold/30" />
              </div>
              <h3 className="text-xl font-display text-ivory mb-2">
                {searchQuery || selectedAward !== "all" || selectedCategory !== "all"
                  ? "No matching nominees"
                  : "Nominees coming soon"}
              </h3>
              <p className="text-ivory/50 text-sm mb-6 max-w-sm mx-auto">
                {searchQuery || selectedAward !== "all" || selectedCategory !== "all"
                  ? "Try broadening your search or exploring a different category."
                  : "Our review committee is currently evaluating submissions. Check back soon."}
              </p>
              {(searchQuery || selectedAward !== "all" || selectedCategory !== "all") && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedAward("all");
                      setSelectedCategory("all");
                      setSelectedRegion("all");
                      setCurrentPage(1);
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className="border-gold/30 text-gold hover:bg-gold/10"
                  >
                    Clear All Filters
                  </Button>
                  <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal">
                    <Link to="/nominate">Nominate Someone</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedNominees.map((nominee) => {
                  const isDiaspora = nominee.geographicCategory === "diaspora";
                  const isFriends = nominee.geographicCategory === "friends-of-africa";
                  const cardData: NomineeCardData = {
                    id: nominee.id,
                    name: nominee.name,
                    slug: nominee.slug,
                    title: nominee.achievement || undefined,
                    organization: undefined,
                    photoUrl: nominee.photoUrl,
                    isPlatinum: nominee.isPlatinum,
                    publicVotes: nominee.publicVotes,
                    categoryName: nominee.categoryName,
                    subcategoryName: (isDiaspora || isFriends) ? nominee.subcategoryName : undefined,
                    region: nominee.region,
                    country: nominee.country,
                    geographicCategory: nominee.geographicCategory,
                  };
                  return (
                    <NomineeCard 
                      key={nominee.id} 
                      nominee={cardData}
                      showVotes={dataSource === "database"}
                    />
                  );
                })}
              </div>

              {/* Infinite Scroll Loader */}
              {useInfiniteScroll && (
                <div ref={loadMoreRef} className="mt-8 flex justify-center">
                  {hasMore ? (
                    <div className="flex items-center gap-2 text-ivory/60">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading more...</span>
                    </div>
                  ) : (
                    <p className="text-ivory/40 text-sm">
                      You've reached the end — {filteredNominees.length} nominees shown
                    </p>
                  )}
                </div>
              )}

              {/* Pagination Controls */}
              {!useInfiniteScroll && totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-gold/30 text-gold hover:bg-gold/10 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, arr) => {
                        const prevPage = arr[index - 1];
                        const showEllipsisBefore = prevPage && page - prevPage > 1;

                        return (
                          <div key={page} className="flex items-center gap-1">
                            {showEllipsisBefore && (
                              <span className="px-2 text-ivory/40">...</span>
                            )}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={
                                currentPage === page
                                  ? "bg-gold text-charcoal hover:bg-gold-dark"
                                  : "border-gold/30 text-gold hover:bg-gold/10"
                              }
                            >
                              {page}
                            </Button>
                          </div>
                        );
                      })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-gold/30 text-gold hover:bg-gold/10 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <span className="ml-4 text-sm text-ivory/60">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
