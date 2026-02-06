import { Trophy, ArrowRight, Sparkles, Users, Globe, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { NESALogo3D } from "@/components/nesa/NESALogo3D";
import stageBackdropVideo from "@/assets/nesa-stage-backdrop-motion.mp4";
import stageBackdropFallback from "@/assets/nesa-stage-backdrop.jpg";
import blueGarnetTrophyIcon from "@/assets/blue-garnet-trophy-icon.png";
import blueGarnetTrophyWinners from "@/assets/blue-garnet-trophy-winners.png";

// Carousel items for visual variety
const CAROUSEL_ITEMS = ["trophy-icon", "trophy-winners", "logo"] as const;
type CarouselItem = typeof CAROUSEL_ITEMS[number];

/**
 * TrophyHeroSection - Optimized for clarity & reduced bounce
 * 
 * Above-the-fold formula:
 * - 1 sentence value proposition
 * - 1 primary CTA (Nominate)
 * - 1 secondary CTA (Explore Awards)
 * - 3 trust bullets
 */
export function TrophyHeroSection() {
  const { getBannerText } = useSeason();
  const [currentItem, setCurrentItem] = useState<CarouselItem>("trophy-icon");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItem((prev) => {
        const currentIndex = CAROUSEL_ITEMS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % CAROUSEL_ITEMS.length;
        return CAROUSEL_ITEMS[nextIndex];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const bannerText = getBannerText();

  return (
    <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center bg-charcoal overflow-hidden">
      {/* Stage Backdrop */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={stageBackdropFallback}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={stageBackdropVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-charcoal/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal/90" />
      </div>
      
      {/* Spotlight Effects - Desktop only */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden lg:block">
        <div className="absolute -left-20 top-0 h-[70vh] w-32 rotate-[20deg] bg-gradient-to-b from-gold/12 to-transparent blur-3xl animate-spotlight-left" />
        <div className="absolute -right-20 top-0 h-[70vh] w-32 rotate-[-20deg] bg-gradient-to-b from-gold/12 to-transparent blur-3xl animate-spotlight-right" />
      </div>

      <div className="container relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content - Focused messaging */}
          <motion.div 
            className="order-2 lg:order-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-gold/40 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs sm:text-sm font-medium text-white">{bannerText}</span>
            </div>

            {/* H1: Clear headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.1]">
              Honoring Africa's{" "}
              <span className="text-gold">Education Changemakers</span>
            </h1>

            {/* Value Proposition: ONE sentence */}
            <p className="text-white/85 text-lg sm:text-xl mb-6 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Nominate outstanding educators and institutions for Africa's premier education award.
            </p>

            {/* CTAs: 1 Primary + 1 Secondary */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link to="/nominate">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-8 gap-2 shadow-lg hover:shadow-gold/25 transition-all h-12 text-base"
                >
                  <Trophy className="h-5 w-5" />
                  Nominate Now
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 rounded-full px-6 gap-2 h-12 text-base"
                >
                  Explore Awards
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* 3 Trust Bullets */}
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start text-sm">
              <div className="flex items-center gap-2 text-white/70">
                <Globe className="h-4 w-4 text-gold" />
                <span>54 African Countries</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Users className="h-4 w-4 text-gold" />
                <span>5,000+ Nominees</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Calendar className="h-4 w-4 text-gold" />
                <span>15 Years of Excellence</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Trophy Carousel */}
          <motion.div 
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="relative h-52 sm:h-64 md:h-72 lg:h-80 w-44 sm:w-52 md:w-64 lg:w-72 flex items-center justify-center">
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-t from-blue-600/30 via-gold/20 to-transparent blur-2xl rounded-full" />
              
              <AnimatePresence mode="wait">
                {currentItem === "trophy-icon" && (
                  <motion.div
                    key="trophy-icon"
                    initial={{ opacity: 0, scale: 0.9, rotateY: -60 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateY: 60 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <img
                      src={blueGarnetTrophyIcon}
                      alt="NESA Blue Garnet Award Trophy"
                      className="w-40 sm:w-52 md:w-60 lg:w-64 h-auto rounded-xl shadow-2xl shadow-blue-900/50"
                    />
                  </motion.div>
                )}
                {currentItem === "trophy-winners" && (
                  <motion.div
                    key="trophy-winners"
                    initial={{ opacity: 0, scale: 0.9, rotateY: -60 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateY: 60 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <img
                      src={blueGarnetTrophyWinners}
                      alt="NESA Award Winners with Trophies"
                      className="w-40 sm:w-52 md:w-60 lg:w-64 h-auto rounded-xl shadow-2xl shadow-blue-900/50"
                    />
                  </motion.div>
                )}
                {currentItem === "logo" && (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, scale: 0.9, rotateY: 60 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateY: -60 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <NESALogo3D size="xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
