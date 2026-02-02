import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Search, Users, Filter, ChevronLeft, ChevronRight, LayoutGrid, List, Loader2, MapPin, Globe2, Building2, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NomineeCard, NomineeCardSkeleton, type NomineeCardData } from "@/components/nesa/NomineeCard";
import { 
  getAllNominees, 
  getNomineesByGeography,
  getGeographicGroups,
  getAfricaRegions,
  getAwardOptions, 
  getGeographicCategoryOptions,
  getStats,
  handleImageError,
  type GeographicCategory,
  type EnrichedNominee
} from "@/lib/nesaData";

const ITEMS_PER_PAGE = 12;

// Icons for geographic categories
const categoryIcons: Record<string, React.ReactNode> = {
  "all": <Users className="w-4 h-4" />,
  "africa-regions": <Globe2 className="w-4 h-4" />,
  "diaspora": <Building2 className="w-4 h-4" />,
  "friends-of-africa": <Heart className="w-4 h-4" />,
};

export default function Nominees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GeographicCategory>("all");
  const [selectedAward, setSelectedAward] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<GeographicCategory | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Load data
  const geographicGroups = useMemo(() => getGeographicGroups(), []);
  const africaRegions = useMemo(() => getAfricaRegions(), []);
  const awardOptions = useMemo(() => getAwardOptions(), []);
  const stats = useMemo(() => getStats(), []);

  // Get nominees based on geographic category
  const baseNominees = useMemo(() => {
    setIsLoading(true);
    let nominees: EnrichedNominee[];
    
    // If a specific Africa region is selected
    if (selectedRegion !== "all" && selectedCategory === "africa-regions") {
      nominees = getNomineesByGeography(selectedRegion);
    } else {
      nominees = getNomineesByGeography(selectedCategory);
    }
    
    setIsLoading(false);
    return nominees;
  }, [selectedCategory, selectedRegion]);

  // Filter nominees
  const filteredNominees = useMemo(() => {
    return baseNominees.filter((nominee) => {
      const matchesSearch =
        searchQuery === "" ||
        nominee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.achievement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.regionName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAward =
        selectedAward === "all" || nominee.awardSlug === selectedAward;

      return matchesSearch && matchesAward;
    });
  }, [baseNominees, searchQuery, selectedAward]);

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
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 bg-charcoal">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
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
              <SelectTrigger className="w-full md:w-[260px] bg-charcoal-light border-gold/20 text-ivory">
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
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-gold/10 bg-charcoal-light/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{stats.totalNominees}</div>
              <div className="text-sm text-ivory/60">Total Nominees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{stats.africaRegionsCount}</div>
              <div className="text-sm text-ivory/60">Africa Regions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{stats.diasporaCount}</div>
              <div className="text-sm text-ivory/60">Diaspora</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{stats.friendsOfAfricaCount}</div>
              <div className="text-sm text-ivory/60">Friends of Africa</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{filteredNominees.length}</div>
              <div className="text-sm text-ivory/60">Showing</div>
            </div>
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
              <Users className="w-16 h-16 text-ivory/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-ivory mb-2">No Nominees Found</h3>
              <p className="text-ivory/60 mb-6">
                {searchQuery || selectedAward !== "all" || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Check back soon as nominations are being reviewed."}
              </p>
              {(searchQuery || selectedAward !== "all" || selectedCategory !== "all") && (
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
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedNominees.map((nominee) => {
                  // Map to NomineeCardData format
                  const cardData: NomineeCardData = {
                    id: nominee.id,
                    name: nominee.name,
                    slug: nominee.slug,
                    title: nominee.achievement || undefined,
                    organization: undefined,
                    photoUrl: nominee.imageUrl,
                    isPlatinum: false,
                    publicVotes: 0,
                    categoryName: nominee.subcategoryTitle,
                    region: nominee.regionName,
                    country: nominee.country,
                  };
                  return (
                    <NomineeCard 
                      key={nominee.id} 
                      nominee={cardData}
                      showVotes={false}
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
