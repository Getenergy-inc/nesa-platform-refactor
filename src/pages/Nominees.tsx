import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, Filter, ChevronLeft, ChevronRight, LayoutGrid, List, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NomineeCard, NomineeCardSkeleton, type NomineeCardData } from "@/components/nesa/NomineeCard";

const ITEMS_PER_PAGE = 12;

interface Nominee {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photo_url: string | null;
  status: string;
  is_platinum: boolean;
  public_votes: number;
  subcategories: {
    name: string;
    slug: string;
    categories: {
      id: string;
      name: string;
      slug: string;
    };
  };
  chapters?: {
    name: string;
    region: string | null;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Nominees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch approved nominees
  const { data: nominees = [], isLoading } = useQuery({
    queryKey: ["nominees-directory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nominees")
        .select(`
          id,
          name,
          slug,
          title,
          organization,
          bio,
          photo_url,
          status,
          is_platinum,
          public_votes,
          subcategories!inner(
            name,
            slug,
            categories!inner(id, name, slug),
            chapters(name, region)
          ),
          seasons!inner(is_active)
        `)
        .eq("seasons.is_active", true)
        .in("status", ["approved", "platinum"])
        .order("name");

      if (error) throw error;
      return (data || []).map((n: any) => ({
        ...n,
        subcategories: n.subcategories,
        chapters: n.subcategories?.chapters || null,
      })) as Nominee[];
    },
  });

  // Filter nominees
  const filteredNominees = useMemo(() => {
    return nominees.filter((nominee) => {
      const matchesSearch =
        searchQuery === "" ||
        nominee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nominee.title?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        nominee.subcategories?.categories?.id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [nominees, searchQuery, selectedCategory]);

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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
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

  // Note: getInitials is now handled by the NomineeCard component

  const displayedNominees = useInfiniteScroll ? infiniteScrollNominees : paginatedNominees;

  return (
    <div className="min-h-screen bg-charcoal">
      <NESAHeader />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal">
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
            <p className="text-lg text-ivory/70 mb-8">
              Discover the remarkable educators, innovators, and institutions transforming education across Africa.
            </p>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory/40" />
                <Input
                  placeholder="Search nominees by name, organization..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 bg-charcoal-light border-gold/20 text-ivory placeholder:text-ivory/40 focus:border-gold"
                />
              </div>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-[200px] bg-charcoal-light border-gold/20 text-ivory">
                  <Filter className="w-4 h-4 mr-2 text-gold" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal-light border-gold/20">
                  <SelectItem value="all" className="text-ivory hover:bg-gold/10">
                    All Categories
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id}
                      className="text-ivory hover:bg-gold/10"
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-gold/10 bg-charcoal-light/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{nominees.length}</div>
              <div className="text-sm text-ivory/60">Total Nominees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">
                {nominees.filter((n) => n.is_platinum).length}
              </div>
              <div className="text-sm text-ivory/60">Platinum Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{categories.length}</div>
              <div className="text-sm text-ivory/60">Award Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">
                {filteredNominees.length}
              </div>
              <div className="text-sm text-ivory/60">Showing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Nominees Grid */}
      <section className="py-16">
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
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Check back soon as nominations are being reviewed."}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
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
                    title: nominee.title,
                    organization: nominee.organization,
                    photoUrl: nominee.photo_url,
                    isPlatinum: nominee.is_platinum,
                    publicVotes: nominee.public_votes,
                    categoryName: nominee.subcategories?.categories?.name,
                    region: nominee.chapters?.region || undefined,
                  };
                  return <NomineeCard key={nominee.id} nominee={cardData} />;
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

      <NESAFooter />
    </div>
  );
}
