import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Loader2,
  MapPin,
  Globe2,
  Building2,
  Heart,
  SortAsc,
  Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NomineeCard,
  NomineeCardSkeleton,
} from "@/components/nesa/NomineeCard";
import { useNomineesByTier } from "@/hooks/useBackendNominees";
import { useAllCategories } from "@/hooks/useCategories";
import type { DisplayNominee } from "@/hooks/useBackendNominees";

const ITEMS_PER_PAGE = 12;

type SortOption = "name-asc" | "name-desc" | "newest" | "votes";

// Geographic categories for filtering
type GeographicCategory =
  | "all"
  | "africa-regions"
  | "north-africa"
  | "west-africa"
  | "central-africa"
  | "east-africa"
  | "south-africa"
  | "diaspora"
  | "friends-of-africa"
  | "icon";

// Tier filter options
type TierFilter = "all" | "platinum" | "blue-garnet" | "gold-special" | "icon";

// Map backend award types to tier filter values
const awardTypeToTierMap: Record<string, TierFilter> = {
  PLATINUM_CERTIFICATE: "platinum",
  BLUE_GARNET_AND_GOLD_CERTIFICATE: "blue-garnet",
  GOLD_CERTIFICATE: "blue-garnet",
  GOLD_SPECIAL: "gold-special",
  AFRICA_ICON_BLUE_GARNET: "icon",
};

const TIER_FILTER_OPTIONS: {
  value: TierFilter;
  label: string;
  icon: string;
}[] = [
  { value: "all", label: "All Tiers", icon: "🌍" },
  { value: "blue-garnet", label: "Blue Garnet", icon: "🏆" },
  { value: "platinum", label: "Platinum", icon: "💎" },
  { value: "gold-special", label: "Gold Special (2025)", icon: "🥇" },
  { value: "icon", label: "Lifetime", icon: "🏛" },
];

// Icons for geographic categories
const categoryIcons: Record<string, React.ReactNode> = {
  all: <Users className="w-4 h-4" />,
  "africa-regions": <Globe2 className="w-4 h-4" />,
  "north-africa": <Globe2 className="w-4 h-4" />,
  "west-africa": <Globe2 className="w-4 h-4" />,
  "central-africa": <Globe2 className="w-4 h-4" />,
  "east-africa": <Globe2 className="w-4 h-4" />,
  "south-africa": <Globe2 className="w-4 h-4" />,
  diaspora: <Building2 className="w-4 h-4" />,
  "friends-of-africa": <Heart className="w-4 h-4" />,
  icon: <Award className="w-4 h-4" />,
};

const categorySubtitles: Record<string, string> = {
  all: "All education champions across every track",
  "africa-regions": "Africans Living in Africa",
  "north-africa": "North Africa Region",
  "west-africa": "West Africa Region",
  "central-africa": "Central Africa Region",
  "east-africa": "East Africa Region",
  "south-africa": "Southern Africa Region",
  diaspora: "Diaspora Africans",
  "friends-of-africa": "Friends of Africa",
  icon: "Lifetime Achievement",
};

// Define region groups
const africaRegions: { id: GeographicCategory; name: string }[] = [
  { id: "north-africa", name: "North Africa" },
  { id: "west-africa", name: "West Africa" },
  { id: "central-africa", name: "Central Africa" },
  { id: "east-africa", name: "East Africa" },
  { id: "south-africa", name: "Southern Africa" },
];

export default function Nominees() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch all nominees from different tiers
  const { data: platinumNominees, isLoading: platinumLoading } =
    useNomineesByTier("platinum");
  const { data: blueGarnetNominees, isLoading: blueGarnetLoading } =
    useNomineesByTier("blue-garnet");
  const { data: goldSpecialNominees, isLoading: goldSpecialLoading } =
    useNomineesByTier("gold-special");
  const { data: iconNominees, isLoading: iconLoading } =
    useNomineesByTier("icon");

  // Fetch categories for award options
  const { data: categories } = useAllCategories();

  const isLoading =
    platinumLoading || blueGarnetLoading || goldSpecialLoading || iconLoading;

  // Combine all nominees
  const allNominees = useMemo(() => {
    const combined: DisplayNominee[] = [
      ...(platinumNominees || []),
      ...(blueGarnetNominees || []),
      ...(goldSpecialNominees || []),
      ...(iconNominees || []),
    ];
    return combined;
  }, [platinumNominees, blueGarnetNominees, goldSpecialNominees, iconNominees]);

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedTier, setSelectedTier] = useState<TierFilter>(
    (searchParams.get("tier") as TierFilter) || "all",
  );
  const [selectedCategory, setSelectedCategory] = useState<GeographicCategory>(
    (searchParams.get("category") as GeographicCategory) || "all",
  );
  const [selectedRegion, setSelectedRegion] = useState<
    GeographicCategory | "all"
  >((searchParams.get("region") as GeographicCategory) || "all");
  const [selectedAward, setSelectedAward] = useState<string>(
    searchParams.get("award") || "all",
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "name-asc",
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10),
  );
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedTier !== "all") params.set("tier", selectedTier);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedRegion !== "all") params.set("region", selectedRegion);
    if (selectedAward !== "all") params.set("award", selectedAward);
    if (sortBy !== "name-asc") params.set("sort", sortBy);
    if (currentPage > 1 && !useInfiniteScroll)
      params.set("page", currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [
    searchQuery,
    selectedTier,
    selectedCategory,
    selectedRegion,
    selectedAward,
    sortBy,
    currentPage,
    useInfiniteScroll,
    setSearchParams,
  ]);

  // Geographic groups and stats
  const geographicGroups = useMemo(() => {
    if (!allNominees.length) return [];

    const stats = {
      total: allNominees.length,
      africaRegions: allNominees.filter((n) =>
        [
          "north-africa",
          "west-africa",
          "central-africa",
          "east-africa",
          "south-africa",
        ].includes(n.geographicCategory),
      ).length,
      northAfrica: allNominees.filter(
        (n) => n.geographicCategory === "north-africa",
      ).length,
      westAfrica: allNominees.filter(
        (n) => n.geographicCategory === "west-africa",
      ).length,
      centralAfrica: allNominees.filter(
        (n) => n.geographicCategory === "central-africa",
      ).length,
      eastAfrica: allNominees.filter(
        (n) => n.geographicCategory === "east-africa",
      ).length,
      southAfrica: allNominees.filter(
        (n) => n.geographicCategory === "south-africa",
      ).length,
      diaspora: allNominees.filter((n) => n.geographicCategory === "diaspora")
        .length,
      friendsOfAfrica: allNominees.filter(
        (n) => n.geographicCategory === "friends-of-africa",
      ).length,
      icon: allNominees.filter((n) =>
        n.categoryName?.toLowerCase().includes("icon"),
      ).length,
    };

    return [
      {
        id: "all" as GeographicCategory,
        name: "All Nominees",
        nomineeCount: stats.total,
      },
      {
        id: "africa-regions" as GeographicCategory,
        name: "Africa Regions",
        nomineeCount: stats.africaRegions,
      },
      {
        id: "north-africa" as GeographicCategory,
        name: "North Africa",
        nomineeCount: stats.northAfrica,
      },
      {
        id: "west-africa" as GeographicCategory,
        name: "West Africa",
        nomineeCount: stats.westAfrica,
      },
      {
        id: "central-africa" as GeographicCategory,
        name: "Central Africa",
        nomineeCount: stats.centralAfrica,
      },
      {
        id: "east-africa" as GeographicCategory,
        name: "East Africa",
        nomineeCount: stats.eastAfrica,
      },
      {
        id: "south-africa" as GeographicCategory,
        name: "Southern Africa",
        nomineeCount: stats.southAfrica,
      },
      {
        id: "diaspora" as GeographicCategory,
        name: "Diaspora",
        nomineeCount: stats.diaspora,
      },
      {
        id: "friends-of-africa" as GeographicCategory,
        name: "Friends of Africa",
        nomineeCount: stats.friendsOfAfrica,
      },
      {
        id: "icon" as GeographicCategory,
        name: "Africa Education Icon",
        nomineeCount: stats.icon,
      },
    ];
  }, [allNominees]);

  // Award options from categories
  const awardOptions = useMemo(() => {
    if (!categories) return [];
    return categories.map((cat) => ({
      value: cat.id,
      label: cat.title,
    }));
  }, [categories]);

  // Stats
  const stats = useMemo(() => {
    const africaRegionsCount = allNominees.filter((n) =>
      [
        "north-africa",
        "west-africa",
        "central-africa",
        "east-africa",
        "south-africa",
      ].includes(n.geographicCategory),
    ).length;

    return {
      totalNominees: allNominees.length,
      africaRegionsCount,
      diasporaCount: allNominees.filter(
        (n) => n.geographicCategory === "diaspora",
      ).length,
      friendsOfAfricaCount: allNominees.filter(
        (n) => n.geographicCategory === "friends-of-africa",
      ).length,
    };
  }, [allNominees]);

  // Filter nominees by geographic category and tier
  const baseNominees = useMemo(() => {
    let filtered = allNominees;

    // Apply tier filter using the category award type
    if (selectedTier !== "all") {
      filtered = filtered.filter((nominee: DisplayNominee) => {
        // Use the category award type to determine tier
        // You need to add categoryAwardType to your DisplayNominee type
        const nomineeWithTier = nominee as DisplayNominee & {
          categoryAwardType?: string;
        };

        if (nomineeWithTier.categoryAwardType) {
          const mappedTier =
            awardTypeToTierMap[nomineeWithTier.categoryAwardType];
          return mappedTier === selectedTier;
        }

        // Fallback if categoryAwardType is not available
        return false;
      });
    }

    // Apply geographic category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "africa-regions") {
        if (selectedRegion !== "all") {
          filtered = filtered.filter(
            (n) => n.geographicCategory === selectedRegion,
          );
        } else {
          filtered = filtered.filter((n) =>
            [
              "north-africa",
              "west-africa",
              "central-africa",
              "east-africa",
              "south-africa",
            ].includes(n.geographicCategory),
          );
        }
      } else {
        filtered = filtered.filter(
          (n) => n.geographicCategory === selectedCategory,
        );
      }
    }

    return filtered;
  }, [allNominees, selectedTier, selectedCategory, selectedRegion]);

  // Apply search and award filters, then sort
  const filteredNominees = useMemo(() => {
    const result = baseNominees.filter((nominee) => {
      const matchesSearch =
        searchQuery === "" ||
        nominee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.achievement
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        nominee.country?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAward =
        selectedAward === "all" || nominee.categoryId === selectedAward;

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
        // Since nominationCount is the closest to votes
        result.sort(
          (a, b) => (b.nominationCount || 0) - (a.nominationCount || 0),
        );
        break;
      case "newest":
        // For now, just reverse as a proxy for "newest"
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

  // Infinite scroll
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
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value as GeographicCategory | "all");
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleTierChange = (value: TierFilter) => {
    setSelectedTier(value);
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleAwardChange = (value: string) => {
    setSelectedAward(value);
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && useInfiniteScroll) {
        setVisibleCount((prev) =>
          Math.min(prev + ITEMS_PER_PAGE, filteredNominees.length),
        );
      }
    },
    [hasMore, useInfiniteScroll, filteredNominees.length],
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

  const displayedNominees = useInfiniteScroll
    ? infiniteScrollNominees
    : paginatedNominees;

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
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              Meet Our <span className="text-gold">Nominees</span>
            </h1>
            <p className="text-lg text-white/70 mb-6">
              Discover the remarkable educators, innovators, and institutions
              transforming education across Africa.
            </p>
            {allNominees.length > 0 && (
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
                onClick={() => handleTierChange(opt.value)}
                className={
                  selectedTier === opt.value
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
                  <Badge
                    variant="outline"
                    className="ml-1 text-[10px] px-1.5 py-0 h-4 border-current/30"
                  >
                    {group.nomineeCount}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Category subtitle */}
          {categorySubtitles[selectedCategory] && (
            <p className="text-center text-sm text-white/50 mt-3">
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
                  className={
                    selectedRegion === "all"
                      ? "bg-gold text-charcoal hover:bg-gold-dark"
                      : "border-gold/30 text-gold hover:bg-gold/10"
                  }
                >
                  All Regions
                </Button>
                {africaRegions.map((region) => {
                  const count = allNominees.filter(
                    (n) => n.geographicCategory === region.id,
                  ).length;
                  return (
                    <Button
                      key={region.id}
                      variant={
                        selectedRegion === region.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleRegionChange(region.id)}
                      className={
                        selectedRegion === region.id
                          ? "bg-gold text-charcoal hover:bg-gold-dark"
                          : "border-gold/30 text-gold hover:bg-gold/10"
                      }
                    >
                      {region.name}
                      <Badge
                        variant="outline"
                        className="ml-1 text-[10px] px-1.5 py-0 h-4 border-current/30"
                      >
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="Search nominees by name, achievement, country..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-charcoal-light border-gold/20 text-white placeholder:text-white/40 focus:border-gold"
              />
            </div>
            <Select value={selectedAward} onValueChange={handleAwardChange}>
              <SelectTrigger className="w-full md:w-[220px] bg-charcoal-light border-gold/20 text-white">
                <Filter className="w-4 h-4 mr-2 text-gold" />
                <SelectValue placeholder="All Awards" />
              </SelectTrigger>
              <SelectContent className="bg-charcoal-light border-gold/20 max-h-[300px]">
                <SelectItem value="all" className="text-white hover:bg-gold/10">
                  All Awards
                </SelectItem>
                {awardOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-white hover:bg-gold/10"
                  >
                    {opt.label.length > 50
                      ? opt.label.substring(0, 50) + "..."
                      : opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Sort Dropdown */}
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as SortOption)}
            >
              <SelectTrigger className="w-full md:w-[160px] bg-charcoal-light border-gold/20 text-white">
                <SortAsc className="w-4 h-4 mr-2 text-gold" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-charcoal-light border-gold/20">
                <SelectItem
                  value="name-asc"
                  className="text-white hover:bg-gold/10"
                >
                  Name (A–Z)
                </SelectItem>
                <SelectItem
                  value="name-desc"
                  className="text-white hover:bg-gold/10"
                >
                  Name (Z–A)
                </SelectItem>
                <SelectItem
                  value="votes"
                  className="text-white hover:bg-gold/10"
                >
                  Most Nominations
                </SelectItem>
                <SelectItem
                  value="newest"
                  className="text-white hover:bg-gold/10"
                >
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
              {
                value: stats.africaRegionsCount.toLocaleString(),
                label: "Africa",
              },
              {
                value: stats.diasporaCount.toLocaleString(),
                label: "Diaspora",
              },
              {
                value: stats.friendsOfAfricaCount.toLocaleString(),
                label: "Friends",
              },
              {
                value: filteredNominees.length.toLocaleString(),
                label: "Showing",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center min-w-[60px]">
                <div className="text-2xl font-bold text-gold font-display">
                  {stat.value}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider">
                  {stat.label}
                </div>
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
              <p className="text-sm text-white/60">
                {useInfiniteScroll
                  ? `Showing ${infiniteScrollNominees.length} of ${filteredNominees.length}`
                  : `Page ${currentPage} of ${totalPages}`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">View:</span>
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
              <h3 className="text-xl font-display text-white mb-2">
                {searchQuery ||
                selectedAward !== "all" ||
                selectedCategory !== "all"
                  ? "No matching nominees"
                  : "Nominees coming soon"}
              </h3>
              <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
                {searchQuery ||
                selectedAward !== "all" ||
                selectedCategory !== "all"
                  ? "Try broadening your search or exploring a different category."
                  : "Our review committee is currently evaluating submissions. Check back soon."}
              </p>
              {(searchQuery ||
                selectedAward !== "all" ||
                selectedCategory !== "all") && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedAward("all");
                      setSelectedCategory("all");
                      setSelectedRegion("all");
                      setSelectedTier("all");
                      setCurrentPage(1);
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className="border-gold/30 text-gold hover:bg-gold/10"
                  >
                    Clear All Filters
                  </Button>
                  <Button
                    asChild
                    className="bg-gold hover:bg-gold-dark text-charcoal"
                  >
                    <Link to="/nominate">Nominate Someone</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedNominees.map((nominee) => (
                  <NomineeCard
                    key={nominee.id}
                    nominee={{
                      id: nominee.id,
                      name: nominee.name,
                      slug: nominee.id,
                      title:
                        nominee.achievement?.substring(0, 100) || undefined,
                      organization:
                        nominee.accountType === "ORGANIZATION"
                          ? nominee.name
                          : undefined,
                      photoUrl: nominee.profileImage || "/placeholder.svg",
                      isPlatinum: false, // You might want to determine this based on nominationCount
                      publicVotes: nominee.voteCount || 0,
                      categoryName: nominee.categoryName,
                      subcategoryName: nominee.subCategoryName,
                      region: nominee.stateRegion,
                      country: nominee.country,
                      geographicCategory: nominee.geographicCategory,
                    }}
                    showVotes={true}
                  />
                ))}
              </div>

              {/* Infinite Scroll Loader */}
              {useInfiniteScroll && (
                <div ref={loadMoreRef} className="mt-8 flex justify-center">
                  {hasMore ? (
                    <div className="flex items-center gap-2 text-white/60">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading more...</span>
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm">
                      You've reached the end — {filteredNominees.length}{" "}
                      nominees shown
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
                        const showEllipsisBefore =
                          prevPage && page - prevPage > 1;

                        return (
                          <div key={page} className="flex items-center gap-1">
                            {showEllipsisBefore && (
                              <span className="px-2 text-white/40">...</span>
                            )}
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
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
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="border-gold/30 text-gold hover:bg-gold/10 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <span className="ml-4 text-sm text-white/60">
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
