import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Users,
  ArrowRight,
  Globe,
  Plane,
  Handshake,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryImage } from "@/config/categoryImages";

// Import these from your awardData or create new ones
import {
  FALLBACK_IMAGE,
  REGION_STYLES,
  isContinentalRegion,
  type AfricanRegion,
} from "@/data/awardData";
import { useCategoryPage } from "@/hooks/useCategories";

// Get icon for region type
function getRegionIcon(region: AfricanRegion) {
  if (region === "Diaspora / Global Africa")
    return <Plane className="h-3 w-3" />;
  if (region === "Friends of Africa") return <Handshake className="h-3 w-3" />;
  return <Globe className="h-3 w-3" />;
}

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data, isLoading, error } = useCategoryPage(categoryId);

  const [selectedRegion, setSelectedRegion] = useState<
    AfricanRegion | undefined
  >();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get regions from category scope or subcategories
  const regions = useMemo(() => {
    if (!data?.category) return [];

    // You can derive regions from the category scope or subcategories
    // This is example logic - adjust based on your data structure
    const regionsSet = new Set<AfricanRegion>();

    // Add regions based on category scope
    if (data.category.scope === "AFRICA_REGIONAL") {
      regionsSet.add("West Africa");
      regionsSet.add("East Africa");
      regionsSet.add("North Africa");
      regionsSet.add("Southern Africa");
      regionsSet.add("Central Africa");
    }

    // Add diaspora and friends if applicable
    if (data.category.scope === "INTERNATIONAL") {
      regionsSet.add("Diaspora / Global Africa");
      regionsSet.add("Friends of Africa");
    }

    return Array.from(regionsSet);
  }, [data?.category]);

  // Set default region
  useEffect(() => {
    if (regions.length > 0 && !selectedRegion) {
      setSelectedRegion(regions[0]);
    }
  }, [regions, selectedRegion]);

  // Filter subcategories based on selected region
  const filteredSubcategories = useMemo(() => {
    if (!data?.subcategories) return [];
    if (!selectedRegion) return data.subcategories;

    // Filter subcategories by region if needed
    // This depends on how your data is structured
    return data.subcategories.filter((sub) => {
      // Example: Check if subcategory title or description contains region
      // Adjust this logic based on your actual data structure
      if (selectedRegion === "Diaspora / Global Africa") {
        return (
          sub.title?.toLowerCase().includes("diaspora") ||
          sub.description?.toLowerCase().includes("diaspora")
        );
      }
      if (selectedRegion === "Friends of Africa") {
        return (
          sub.title?.toLowerCase().includes("international") ||
          sub.description?.toLowerCase().includes("global")
        );
      }
      return true; // For continental regions, show all
    });
  }, [data?.subcategories, selectedRegion]);

  // Auto-rotate carousel
  useEffect(() => {
    if (filteredSubcategories.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredSubcategories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [filteredSubcategories.length]);

  // Handle slide navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredSubcategories.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + filteredSubcategories.length) %
        filteredSubcategories.length,
    );
  };

  // Build nomination URL
  const buildNominateUrl = (sub: any) => {
    const params = new URLSearchParams({
      categoryId: data?.category.id || "",
      subCategoryId: sub.id,
      title: sub.title,
      description: sub.description || "",
      tier: data.category.awardType,
    });
    if (selectedRegion) {
      params.append("region", selectedRegion);
    }
    return `/nominate?${params.toString()}`;
  };

  // Build nominees URL
  const buildNomineesUrl = (sub: any) => {
    return `/nominees?category=${data?.category.id}&subcategory=${sub.id}`;
  };

  // Get current region style
  const currentRegionStyle = selectedRegion
    ? REGION_STYLES[selectedRegion]
    : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal">
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto mb-4" />
              <p className="text-white/60">Loading category...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data?.category) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center text-white">
          <Award className="mx-auto mb-4 h-16 w-16 text-gold" />
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-white/60 mb-6">
            The category you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/categories">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { category, subcategories } = data;

  return (
    <>
      <Helmet>
        <title>{category.title} | NESA-Africa Awards</title>
        <meta name="description" content={category.description} />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section with Carousel */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal" />

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Category Info */}
              <div>
                <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
                  NESA-Africa Awards
                </Badge>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {category.title}
                </h1>
                <p className="text-white/70 text-lg mb-6 max-w-xl">
                  {category.description}
                </p>

                {/* Region Selector */}
                {regions.length > 0 && (
                  <div className="mb-8">
                    <p className="text-white/50 text-sm mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Select Region
                    </p>

                    {/* Continental Regions */}
                    <motion.div
                      className="flex flex-wrap gap-2 mb-3"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.05 },
                        },
                      }}
                    >
                      {regions
                        .filter((r) => isContinentalRegion(r))
                        .map((region) => {
                          const style = REGION_STYLES[region];
                          const isSelected = selectedRegion === region;
                          return (
                            <motion.div
                              key={region}
                              variants={{
                                hidden: { opacity: 0, scale: 0.9 },
                                visible: { opacity: 1, scale: 1 },
                              }}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedRegion(region);
                                  setCurrentSlide(0);
                                }}
                                className={cn(
                                  "rounded-full transition-all duration-300 gap-1.5 hover:scale-105",
                                  isSelected
                                    ? `${style.bg} ${style.text} ${style.border} border-2 shadow-lg`
                                    : "border-white/20 text-white/70 hover:bg-white/10 hover:border-white/40",
                                )}
                              >
                                {getRegionIcon(region)}
                                {region}
                              </Button>
                            </motion.div>
                          );
                        })}
                    </motion.div>

                    {/* Diaspora & Friends of Africa */}
                    <motion.div
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {regions
                        .filter((r) => !isContinentalRegion(r))
                        .map((region) => {
                          const style = REGION_STYLES[region];
                          const isSelected = selectedRegion === region;
                          return (
                            <Button
                              key={region}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRegion(region);
                                setCurrentSlide(0);
                              }}
                              className={cn(
                                "rounded-full transition-all duration-300 gap-1.5 hover:scale-105",
                                isSelected
                                  ? `${style.bg} ${style.text} ${style.border} border-2 shadow-lg`
                                  : `border-dashed ${style.border} ${style.text}/70 hover:bg-white/5`,
                              )}
                            >
                              {getRegionIcon(region)}
                              {region}
                            </Button>
                          );
                        })}
                    </motion.div>
                  </div>
                )}

                {/* Selected Region Badge */}
                {selectedRegion && currentRegionStyle && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6",
                      currentRegionStyle.bg,
                      currentRegionStyle.border,
                      "border",
                    )}
                  >
                    {getRegionIcon(selectedRegion)}
                    <span
                      className={cn("font-medium", currentRegionStyle.text)}
                    >
                      {selectedRegion}
                    </span>
                    {!isContinentalRegion(selectedRegion) && (
                      <span className="text-xs text-white/50">
                        {selectedRegion === "Diaspora / Global Africa"
                          ? "— Africans living abroad"
                          : "— Global allies of Africa"}
                      </span>
                    )}
                  </motion.div>
                )}

                <div className="flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2"
                  >
                    <Link to="/nominate">
                      <Award className="h-4 w-4" />
                      Nominate Now
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold rounded-full gap-2"
                  >
                    <Link to="/nominees">
                      <Users className="h-4 w-4" />
                      View Nominees
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right: Carousel */}
              <div className="relative">
                {filteredSubcategories.length > 0 && (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-charcoal/50 border border-white/10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={
                            filteredSubcategories[currentSlide]?.image ||
                            FALLBACK_IMAGE
                          }
                          alt={filteredSubcategories[currentSlide]?.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="font-display text-xl font-bold text-white mb-2">
                            {filteredSubcategories[currentSlide]?.title}
                          </h3>
                          <p className="text-white/70 text-sm line-clamp-2">
                            {filteredSubcategories[currentSlide]?.description}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    {filteredSubcategories.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-charcoal/80 text-white hover:bg-charcoal transition-colors"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-charcoal/80 text-white hover:bg-charcoal transition-colors"
                          aria-label="Next slide"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {filteredSubcategories.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                idx === currentSlide
                                  ? "bg-gold w-6"
                                  : "bg-white/30 hover:bg-white/50",
                              )}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                  Subcategories
                  {selectedRegion && (
                    <span
                      className={cn(
                        "ml-2",
                        currentRegionStyle?.text || "text-gold",
                      )}
                    >
                      — {selectedRegion}
                    </span>
                  )}
                </h2>
                <p className="text-white/60">
                  {filteredSubcategories.length} subcategories available for
                  nomination
                </p>
              </div>
            </div>

            {filteredSubcategories.length === 0 ? (
              <div className="text-center py-12">
                <Award className="mx-auto mb-4 h-12 w-12 text-white/30" />
                <p className="text-white/60">No subcategories available.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredSubcategories.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden bg-charcoal/50 border-white/10 hover:border-gold/30 transition-all group h-full">
                      {/* Card Image */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={sub.image || FALLBACK_IMAGE}
                          alt={sub.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

                        {/* Nominee count badge */}
                        {(sub as any).nomineeCount > 0 && (
                          <Badge className="absolute top-3 right-3 bg-gold text-charcoal border-gold/30">
                            {(sub as any).nomineeCount} Nominee
                            {(sub as any).nomineeCount !== 1 ? "s" : ""}
                          </Badge>
                        )}

                        {/* Region indicator for global regions */}
                        {selectedRegion &&
                          !isContinentalRegion(selectedRegion) && (
                            <Badge
                              className={cn(
                                "absolute top-3 left-3",
                                currentRegionStyle?.bg,
                                currentRegionStyle?.text,
                                currentRegionStyle?.border,
                              )}
                            >
                              {getRegionIcon(selectedRegion)}
                              <span className="ml-1">{selectedRegion}</span>
                            </Badge>
                          )}
                      </div>

                      <CardContent className="p-5">
                        <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors">
                          {sub.title}
                        </h3>
                        <p className="text-white/60 text-sm mb-4 line-clamp-2">
                          {sub.description}
                        </p>

                        {/* Action Buttons - FIXED: Better contrast */}
                        <div className="flex gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex-1 border-gold/30 text-gold hover:bg-gold/10 hover:text-gold hover:border-gold/50"
                          >
                            <Link to={buildNomineesUrl(sub)}>
                              <Users className="mr-1 h-3 w-3" />
                              See Nominees
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="flex-1 bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                          >
                            <Link to={buildNominateUrl(sub)}>
                              <Award className="mr-1 h-3 w-3" />
                              Nominate
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-charcoal to-gold/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              Know Someone Making a Difference?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Nominate outstanding individuals and organizations contributing to
              education across Africa, the Diaspora, and Friends of Africa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2"
              >
                <Link to="/nominate">
                  <Award className="h-4 w-4" />
                  Submit Nomination
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold rounded-full gap-2"
              >
                <Link to="/categories">View All Categories</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default CategoryPage;
