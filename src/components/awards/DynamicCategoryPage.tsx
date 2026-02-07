import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, ChevronLeft, ChevronRight, Users, ArrowRight, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  categories,
  getCategoryByTitle,
  getSubCategories,
  getSubCategoryImage,
  hasRegions,
  FALLBACK_IMAGE,
  type Category,
  type SubCategory,
} from "@/data/awardData";

interface DynamicCategoryPageProps {
  categoryTitle: string;
  nominationType?: string;
}

export function DynamicCategoryPage({ categoryTitle, nominationType }: DynamicCategoryPageProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Find category by exact title
  const category = useMemo(() => getCategoryByTitle(categoryTitle), [categoryTitle]);

  // Get regions if available
  const regions = useMemo(() => {
    if (!category || !hasRegions(category)) return [];
    return category.regions!.map((r) => r.name);
  }, [category]);

  // Set default region
  useEffect(() => {
    if (regions.length > 0 && !selectedRegion) {
      setSelectedRegion(regions[0]);
    }
  }, [regions, selectedRegion]);

  // Get subcategories based on category structure and selected region
  const subCategories = useMemo(() => {
    if (!category) return [];
    return getSubCategories(category, selectedRegion);
  }, [category, selectedRegion]);

  // Auto-rotate carousel
  useEffect(() => {
    if (subCategories.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % subCategories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [subCategories.length]);

  // Handle slide navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % subCategories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + subCategories.length) % subCategories.length);
  };

  // Build nomination URL
  const buildNominateUrl = (sub: SubCategory) => {
    const type = encodeURIComponent(nominationType || categoryTitle);
    const title = encodeURIComponent(sub.title);
    const description = encodeURIComponent(sub.description);
    const image = encodeURIComponent(getSubCategoryImage(sub));
    const region = selectedRegion ? `&region=${encodeURIComponent(selectedRegion)}` : "";
    return `/nominateform?type=${type}&title=${title}&description=${description}&image=${image}${region}`;
  };

  // Build nominees URL
  const buildNomineesUrl = (sub: SubCategory) => {
    const cat = encodeURIComponent(categoryTitle);
    const subcat = encodeURIComponent(sub.title);
    return `/nominees?category=${cat}&subcategory=${subcat}`;
  };

  // Not found state
  if (!category) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center text-white">
          <Award className="mx-auto mb-4 h-16 w-16 text-gold" />
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-white/60 mb-6">
            The category "{categoryTitle}" doesn't exist.
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
                    <div className="flex flex-wrap gap-2">
                      {regions.map((region) => (
                        <Button
                          key={region}
                          variant={selectedRegion === region ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedRegion(region);
                            setCurrentSlide(0);
                          }}
                          className={cn(
                            "rounded-full transition-all",
                            selectedRegion === region
                              ? "bg-gold text-charcoal hover:bg-gold-dark"
                              : "border-white/20 text-white hover:bg-white/10"
                          )}
                        >
                          {region}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2">
                    <Link to="/nominate">
                      <Award className="h-4 w-4" />
                      Nominate Now
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full gap-2">
                    <Link to="/nominees">
                      <Users className="h-4 w-4" />
                      View Nominees
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right: Carousel */}
              <div className="relative">
                {subCategories.length > 0 && (
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
                          src={getSubCategoryImage(subCategories[currentSlide])}
                          alt={subCategories[currentSlide].title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="font-display text-xl font-bold text-white mb-2">
                            {subCategories[currentSlide].title}
                          </h3>
                          <p className="text-white/70 text-sm line-clamp-2">
                            {subCategories[currentSlide].description}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    {subCategories.length > 1 && (
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
                          {subCategories.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                idx === currentSlide 
                                  ? "bg-gold w-6" 
                                  : "bg-white/30 hover:bg-white/50"
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
                    <span className="text-gold"> — {selectedRegion}</span>
                  )}
                </h2>
                <p className="text-white/60">
                  {subCategories.length} subcategories available for nomination
                </p>
              </div>
            </div>

            {subCategories.length === 0 ? (
              <div className="text-center py-12">
                <Award className="mx-auto mb-4 h-12 w-12 text-white/30" />
                <p className="text-white/60">No subcategories available.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {subCategories.map((sub, index) => (
                  <motion.div
                    key={sub.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden bg-charcoal/50 border-white/10 hover:border-gold/30 transition-all group h-full">
                      {/* Card Image */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={getSubCategoryImage(sub)}
                          alt={sub.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                        
                        {/* Nominee count badge */}
                        {sub.nominees.length > 0 && (
                          <Badge className="absolute top-3 right-3 bg-gold/90 text-charcoal">
                            {sub.nominees.length} Nominee{sub.nominees.length !== 1 ? "s" : ""}
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

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            asChild 
                            variant="outline" 
                            size="sm"
                            className="flex-1 border-white/20 text-white hover:bg-white/10"
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
              Nominate outstanding individuals and organizations contributing to education in Africa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2">
                <Link to="/nominate">
                  <Award className="h-4 w-4" />
                  Submit Nomination
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full gap-2">
                <Link to="/categories">
                  View All Categories
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default DynamicCategoryPage;
