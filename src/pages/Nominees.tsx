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

type DrillLevel = 0 | 1 | 2 | 3;

type DrillPathItem = {
  label: string;
  level: number;
  id?: string;
  type?: "main" | "sub" | "subsub";
};

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

const MAIN_CATEGORY_CARDS = [
  {
    id: "icon",
    label: "Africa Education Icon — Lifetime Achievement",
    description: "Honoring lifelong champions of African education",
    icon: "🏛",
  },
  {
    id: "blue-garnet",
    label: "Blue Garnet — Competitive Excellence",
    description: "Recognizing outstanding competitive achievement",
    icon: "🏆",
  },
  {
    id: "platinum",
    label: "Platinum — Institutional Leadership",
    description: "Celebrating institutions driving educational excellence",
    icon: "💎",
  },
  {
    id: "gold-special",
    label: "Gold Special Recognition — 2025 Edition",
    description: "Special honorees for the 2025 edition",
    icon: "🥇",
  },
];

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

function slugifyLabel(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getAwardGroupLabel(label: string) {
  const separators = [" — ", " - ", " – ", ": ", " | "];
  for (const separator of separators) {
    if (label.includes(separator)) {
      return label.split(separator)[0].trim();
    }
  }
  return label.split(" ").slice(0, 4).join(" ");
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

  const [drillLevel, setDrillLevel] = useState<DrillLevel>(0);
  const [drillPath, setDrillPath] = useState<DrillPathItem[]>([]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    if (drillLevel > 0) params.set("dl", String(drillLevel));
    if (drillPath.length > 0) params.set("dp", drillPath.map((item) => item.label).join("|"));
    
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedTier, selectedScope, selectedCategory, selectedAward, selectedRegion, selectedDiasporaSubgroup, selectedFriendsSubgroup, sortBy, currentPage, useInfiniteScroll, drillLevel, drillPath, setSearchParams]);

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

  const tierCategorySlugs = useMemo(() => {
    if (selectedTier === "all") return [];
    return getCategoriesByTier(selectedTier).map((category) => category.slug);
  }, [selectedTier]);

  const tierNominees = useMemo(() => {
    if (tierCategorySlugs.length === 0) return allNominees;
    const filtered = allNominees.filter((nominee) => tierCategorySlugs.includes(nominee.categorySlug));
    return filtered.length > 0 ? filtered : allNominees;
  }, [allNominees, tierCategorySlugs]);

  const awardCounts = useMemo(() => {
    const counts = new Map<string, number>();
    tierNominees.forEach((nominee) => {
      const current = counts.get(nominee.categorySlug) || 0;
      counts.set(nominee.categorySlug, current + 1);
    });
    return counts;
  }, [tierNominees]);

  const tierAwardOptions = useMemo(() => {
    if (selectedTier === "all") return awardOptions;
    const filtered = awardOptions.filter((opt) => tierCategorySlugs.includes(opt.value));
    return filtered.length > 0 ? filtered : awardOptions;
  }, [awardOptions, selectedTier, tierCategorySlugs]);

  const groupedAwardOptions = useMemo(() => {
    const groups = new Map<string, { id: string; label: string; count: number; options: typeof awardOptions; description: string }>();
    tierAwardOptions.forEach((option) => {
      const groupLabel = getAwardGroupLabel(option.label);
      const groupId = slugifyLabel(groupLabel);
      if (!groups.has(groupId)) {
        groups.set(groupId, {
          id: groupId,
          label: groupLabel,
          count: 0,
          options: [],
          description: `Awards grouped under ${groupLabel}`,
        });
      }
      const group = groups.get(groupId);
      if (!group) return;
      const optionCount = awardCounts.get(option.value) || 0;
      group.options.push(option);
      group.count += optionCount;
    });
    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  }, [tierAwardOptions, awardCounts]);

  const iconCategorySlug = useMemo(() => {
    const iconCategory = getCategoriesByTier("icon")[0];
    return iconCategory?.slug;
  }, []);

  const selectedMain = drillPath[0]?.id;
  const selectedSub = drillPath[1]?.id;
  const selectedSubSub = drillPath[2]?.id;

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

  function resetFiltersToMain(mainId: string) {
    setSearchQuery("");
    setSelectedAward("all");
    setSelectedCategory("all");
    setSelectedRegion("all");
    setSelectedDiasporaSubgroup("all");
    setSelectedFriendsSubgroup("all");
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
    if (mainId === "icon") {
      setSelectedTier("icon");
      if (iconCategorySlug) {
        setSelectedAward(iconCategorySlug);
      } else {
        setSelectedCategory("icon");
      }
    } else {
      setSelectedTier(mainId as TierFilter);
    }
  }

  function handleMainSelect(mainId: string, label: string) {
    resetFiltersToMain(mainId);
    setDrillPath([{ label, level: 0, id: mainId, type: "main" }]);
    setDrillLevel(1);
    scrollToTop();
  }

  function handleSubcategorySelect(item: { id: string; label: string; hasSubsub: boolean }) {
    setSearchQuery("");
    setSelectedAward("all");
    setSelectedRegion("all");
    setSelectedDiasporaSubgroup("all");
    setSelectedFriendsSubgroup("all");

    if (selectedMain === "icon") {
      setSelectedCategory(item.id as GeographicCategory);
      if (!item.hasSubsub) {
        setDrillPath((prev) => [...prev, { label: item.label, level: 1, id: item.id, type: "sub" }]);
        setDrillLevel(3);
        return;
      }
      setDrillPath((prev) => [...prev, { label: item.label, level: 1, id: item.id, type: "sub" }]);
      setDrillLevel(2);
      scrollToTop();
      return;
    }

    setDrillPath((prev) => [...prev, { label: item.label, level: 1, id: item.id, type: "sub" }]);
    if (!item.hasSubsub) {
      setDrillLevel(3);
    } else {
      setDrillLevel(2);
    }
    scrollToTop();
  }

  function handleSubSubcategorySelect(item: { id: string; label: string; awardValue?: string }) {
    setSearchQuery("");
    if (selectedMain === "icon") {
      if (selectedSub === "africa-regions") {
        handleRegionChange(item.id);
      } else if (selectedSub === "diaspora") {
        handleDiasporaSubgroupChange(item.id);
      } else if (selectedSub === "friends-of-africa") {
        handleFriendsSubgroupChange(item.id);
      }
      setDrillPath((prev) => [...prev, { label: item.label, level: 2, id: item.id, type: "subsub" }]);
      setDrillLevel(3);
      scrollToTop();
      return;
    }

    if (item.awardValue) {
      handleAwardChange(item.awardValue);
    }
    setDrillPath((prev) => [...prev, { label: item.label, level: 2, id: item.id, type: "subsub" }]);
    setDrillLevel(3);
    scrollToTop();
  }

  function handleBreadcrumbClick(index: number) {
    if (index < 0) {
      setDrillPath([]);
      setDrillLevel(0);
      setSelectedTier("all");
      setSelectedAward("all");
      setSelectedCategory("all");
      setSelectedRegion("all");
      setSelectedDiasporaSubgroup("all");
      setSelectedFriendsSubgroup("all");
      scrollToTop();
      return;
    }

    const newPath = drillPath.slice(0, index + 1);
    setDrillPath(newPath);
    setDrillLevel((index + 1) as DrillLevel);

    const mainId = newPath[0]?.id;
    if (mainId) {
      resetFiltersToMain(mainId);
    }

    const subId = newPath[1]?.id;
    if (subId && mainId === "icon") {
      setSelectedCategory(subId as GeographicCategory);
    }

    if (index < 2) {
      setSelectedRegion("all");
      setSelectedDiasporaSubgroup("all");
      setSelectedFriendsSubgroup("all");
      setSelectedAward(mainId === "icon" && iconCategorySlug ? iconCategorySlug : "all");
    }
    scrollToTop();
  }

  function handleBack() {
    if (drillLevel === 0) return;
    handleBreadcrumbClick(drillLevel - 2);
  }

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

  const levelOneCards = useMemo(() => {
    if (selectedMain === "icon") {
      return [
        {
          id: "africa-regions",
          label: "Africa Regions",
          description: "Browse icon nominees by African region",
          count: stats.africaRegionsCount,
          hasSubsub: africaRegions.length > 0,
        },
        {
          id: "diaspora",
          label: "Diaspora",
          description: "Diaspora icons and global education leaders",
          count: stats.diasporaCount,
          hasSubsub: diasporaSubgroups.length > 0,
        },
        {
          id: "friends-of-africa",
          label: "Friends of Africa",
          description: "International supporters of African education",
          count: stats.friendsOfAfricaCount,
          hasSubsub: friendsSubgroups.length > 0,
        },
      ];
    }

    return groupedAwardOptions.map((group) => ({
      id: group.id,
      label: group.label,
      description: group.description,
      count: group.count,
      hasSubsub: group.options.length > 1,
    }));
  }, [selectedMain, stats, africaRegions.length, diasporaSubgroups.length, friendsSubgroups.length, groupedAwardOptions]);

  const levelTwoCards = useMemo(() => {
    if (selectedMain === "icon") {
      if (selectedSub === "africa-regions") {
        return africaRegions.map((region) => ({
          id: region.id,
          label: region.name,
          description: "Regional icons and lifetime achievers",
          count: region.nomineeCount,
          awardValue: undefined,
        }));
      }
      if (selectedSub === "diaspora") {
        return diasporaSubgroups.map((group) => ({
          id: group.id,
          label: group.name,
          description: "Diaspora excellence and global influence",
          count: group.nomineeCount,
          awardValue: undefined,
        }));
      }
      if (selectedSub === "friends-of-africa") {
        return friendsSubgroups.map((group) => ({
          id: group.id,
          label: group.name,
          description: "Global partners and international champions",
          count: group.nomineeCount,
          awardValue: undefined,
        }));
      }
      return [];
    }

    const group = groupedAwardOptions.find((item) => item.id === selectedSub);
    if (!group) return [];
    return group.options.map((option) => ({
      id: option.value,
      label: option.label,
      description: "Award category",
      count: awardCounts.get(option.value) || 0,
      awardValue: option.value,
    }));
  }, [selectedMain, selectedSub, africaRegions, diasporaSubgroups, friendsSubgroups, groupedAwardOptions, awardCounts]);

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

      {drillLevel > 0 && (
        <section className="sticky top-16 z-20 border-b border-gold/10 bg-charcoal/90 backdrop-blur">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gold/20 bg-charcoal-light/70 px-3 py-2 shadow-[0_8px_30px_rgba(201,168,76,0.12)] sm:rounded-full">
                <button
                  type="button"
                  onClick={() => handleBreadcrumbClick(-1)}
                  className="rounded-full px-2 py-1 text-sm font-semibold text-gold underline-offset-4 hover:underline hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                >
                  Home
                </button>
                {drillPath.map((item, index) => {
                  const isCurrent = index === drillPath.length - 1 && drillLevel === 3;
                  return (
                    <div key={`${item.label}-${index}`} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold/60" />
                      <button
                        type="button"
                        onClick={() => handleBreadcrumbClick(index)}
                        className={`rounded-lg px-3 py-1 text-sm font-semibold underline-offset-4 transition hover:underline hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 sm:rounded-full ${isCurrent ? "bg-gold/15 text-ivory ring-1 ring-gold/30" : "text-gold"}`}
                      >
                        {item.label}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-gold/70">
                <span className="uppercase tracking-[0.2em]">Path</span>
                <span className="h-px w-10 bg-gradient-to-r from-gold/40 to-transparent" />
                <span>Click any segment to jump back</span>
              </div>
            </div>
            <div className="mt-3 sm:hidden">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="w-full justify-start gap-2 text-gold hover:bg-gold/10"
              >
                ← Back
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="py-8">
        <div className="container mx-auto px-4">
          {drillLevel === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MAIN_CATEGORY_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleMainSelect(card.id, card.label)}
                  className="group rounded-2xl bg-charcoal-light/60 border border-gold/10 p-6 text-left transition-all duration-200 hover:border-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:scale-[1.02]"
                >
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <h3 className="font-display text-xl text-ivory mb-2">{card.label}</h3>
                  <p className="text-sm text-ivory/60 mb-4">{card.description}</p>
                  <Badge variant="outline" className="border-gold/30 text-gold">
                    Enter Track
                  </Badge>
                </button>
              ))}
            </div>
          )}

          {drillLevel === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {levelOneCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSubcategorySelect(card)}
                  className="group rounded-2xl bg-charcoal-light/60 border border-gold/10 p-5 text-left transition-all duration-200 hover:border-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-lg text-ivory">{card.label}</h3>
                    <Badge variant="outline" className="border-gold/30 text-gold text-xs">
                      {card.count}
                    </Badge>
                  </div>
                  <p className="text-sm text-ivory/60">{card.description}</p>
                </button>
              ))}
            </div>
          )}

          {drillLevel === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {levelTwoCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSubSubcategorySelect(card)}
                  className="group rounded-2xl bg-charcoal-light/60 border border-gold/10 p-5 text-left transition-all duration-200 hover:border-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-base text-ivory">{card.label}</h3>
                    <Badge variant="outline" className="border-gold/30 text-gold text-xs">
                      {card.count}
                    </Badge>
                  </div>
                  <p className="text-sm text-ivory/60">{card.description}</p>
                </button>
              ))}
            </div>
          )}

          {drillLevel === 3 && (
            <>
              {/* Search, Filters, and Sort */}
              <section className="py-6 bg-charcoal">
                <div className="container mx-auto px-0">
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
                <div className="container mx-auto px-0">
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
            </>
          )}
        </div>
      </section>
    </div>
  );
}
