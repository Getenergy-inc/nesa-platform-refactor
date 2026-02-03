import { Trophy, Award, ArrowRight, Vote, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { NESALogo3D } from "@/components/nesa/NESALogo3D";
import stageBackdropVideo from "@/assets/nesa-stage-backdrop-motion.mp4";
import stageBackdropFallback from "@/assets/nesa-stage-backdrop.jpg";
import blueGarnetTrophyIcon from "@/assets/blue-garnet-trophy-icon.png";
import blueGarnetTrophyWinners from "@/assets/blue-garnet-trophy-winners.png";

// Carousel items: Blue Garnet Icon, Blue Garnet Winners, NESA Logo
const CAROUSEL_ITEMS = ["trophy-icon", "trophy-winners", "logo"] as const;
type CarouselItem = typeof CAROUSEL_ITEMS[number];

/**
 * TrophyHeroSection - Streamlined for reduced bounce
 * 
 * Changes from original:
 * - Removed embedded AGC cards (moved to VoteWithAGCSection)
 * - Simplified mobile layout
 * - Single clear value proposition
 * - Primary CTAs: Nominate + Vote
 */
export function TrophyHeroSection() {
  const { t } = useTranslation("pages");
  const { getBannerText } = useSeason();
  const [currentItem, setCurrentItem] = useState<CarouselItem>("trophy-icon");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItem((prev) => {
        const currentIndex = CAROUSEL_ITEMS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % CAROUSEL_ITEMS.length;
        return CAROUSEL_ITEMS[nextIndex];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const bannerText = getBannerText();

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center bg-charcoal overflow-hidden">
      {/* Stage Backdrop Motion Graphics */}
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
        
        {/* Layered overlays for depth and text readability */}
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/40 to-charcoal/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-transparent to-charcoal/50" />
      </div>
      
      {/* Elegant Gold Spotlight Effects - Hidden on mobile for performance */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute -left-20 top-0 h-[80vh] w-40 rotate-[20deg] bg-gradient-to-b from-gold/15 to-transparent blur-3xl animate-spotlight-left" />
        <div className="absolute -right-20 top-0 h-[80vh] w-40 rotate-[-20deg] bg-gradient-to-b from-gold/15 to-transparent blur-3xl animate-spotlight-right" />
      </div>

      <div className="container relative z-10 py-8 sm:py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Left: Content */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-gold/40 mb-4 sm:mb-6">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-gold" />
              <span className="text-xs sm:text-sm font-medium text-white">{bannerText}</span>
            </div>

            {/* Headline - Clear value proposition */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight">
              Honoring Africa's{" "}
              <span className="text-gold">Education Changemakers</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-gold/90 font-medium mb-4 sm:mb-6">
              Advocating & Achieving Education For All In Africa
            </p>

            {/* Simple value message */}
            <p className="text-white/80 text-base sm:text-lg mb-6 max-w-xl leading-relaxed">
              Nominate education champions for recognition. Your participation earns voting credits 
              to support <span className="text-gold font-semibold">Gold</span> and{" "}
              <span className="text-blue-400 font-semibold">Blue Garnet</span> award winners.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 mb-4 sm:mb-6">
              <Link to="/nominate" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 sm:px-8 gap-2 shadow-lg hover:shadow-gold/30 transition-all h-11 sm:h-12"
                >
                  <Trophy className="h-4 w-4" />
                  Nominate Now
                  <ArrowRight className="h-4 w-4 hidden sm:block" />
                </Button>
              </Link>
              <div className="flex gap-2">
                <Link to="/vote?tier=gold" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-gold/50 text-gold hover:bg-gold/10 rounded-full px-4 sm:px-6 gap-1.5 sm:gap-2 h-11 sm:h-12 text-sm sm:text-base"
                  >
                    <Vote className="h-4 w-4" />
                    Vote Gold
                  </Button>
                </Link>
                <Link to="/vote?tier=bluegarnet" className="flex-1 sm:flex-none">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded-full px-4 sm:px-6 gap-1.5 sm:gap-2 h-11 sm:h-12 text-sm sm:text-base"
                  >
                    <Award className="h-4 w-4" />
                    Vote Blue Garnet
                  </Button>
                </Link>
              </div>
            </div>

            {/* Secondary Link */}
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-gold/80 hover:text-gold transition-colors text-sm"
            >
              <span className="underline-offset-4 hover:underline">Discover More About NESA</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          {/* Right: Trophy/Logo Carousel */}
          <motion.div 
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-48 sm:h-72 md:h-80 lg:h-96 w-40 sm:w-56 md:w-72 lg:w-80 flex items-center justify-center">
              {/* Glow effect */}
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-t from-blue-600/40 via-gold/30 to-transparent blur-2xl sm:blur-3xl rounded-full" />
              
              <AnimatePresence mode="wait">
                {currentItem === "trophy-icon" && (
                  <motion.div
                    key="trophy-icon"
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-gold/50 via-blue-500/30 to-gold/50 rounded-xl sm:rounded-2xl blur-sm opacity-60" />
                    <img
                      src={blueGarnetTrophyIcon}
                      alt="Blue Garnet Award Trophy"
                      className="relative w-36 sm:w-56 md:w-64 lg:w-72 h-auto rounded-xl sm:rounded-2xl shadow-2xl shadow-blue-900/60 border border-white/10"
                    />
                    
                    {/* Floating badge */}
                    <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-6 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-charcoal/95 backdrop-blur-md border border-gold/50 shadow-xl">
                      <div className="text-center">
                        <p className="text-gold font-display font-bold text-xs sm:text-base md:text-lg">Blue Garnet</p>
                        <p className="text-white/70 text-[10px] sm:text-xs">Africa's Highest Honor</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {currentItem === "trophy-winners" && (
                  <motion.div
                    key="trophy-winners"
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/50 via-gold/30 to-blue-500/50 rounded-xl sm:rounded-2xl blur-sm opacity-60" />
                    <img
                      src={blueGarnetTrophyWinners}
                      alt="Blue Garnet Winners Trophy"
                      className="relative w-36 sm:w-56 md:w-64 lg:w-72 h-auto rounded-xl sm:rounded-2xl shadow-2xl shadow-blue-900/60 border border-white/10"
                    />
                    
                    {/* Floating badge */}
                    <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-6 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-charcoal/95 backdrop-blur-md border border-blue-500/50 shadow-xl">
                      <div className="text-center">
                        <p className="text-blue-400 font-display font-bold text-xs sm:text-base md:text-lg">Winners</p>
                        <p className="text-white/70 text-[10px] sm:text-xs">Gold & Blue Garnet</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {currentItem === "logo" && (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 sm:gap-4"
                  >
                    <NESALogo3D size="xl" />
                    <div className="px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-charcoal/95 backdrop-blur-md border border-gold/50 shadow-xl">
                      <p className="text-gold font-display font-bold text-xs sm:text-base md:text-lg text-center">NESA-Africa</p>
                      <p className="text-white/70 text-[10px] sm:text-xs text-center">New Education Standard Award</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Stats Strip */}
        <motion.div 
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex gap-3 sm:gap-8 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide justify-start sm:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { label: "Countries", value: "54" },
              { label: "Regions", value: "5" },
              { label: "Categories", value: "17" },
              { label: "Years", value: "15+" },
            ].map((stat) => (
              <div 
                key={stat.label}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 flex-shrink-0"
              >
                <span className="text-gold font-semibold text-sm sm:text-base">{stat.value}</span>
                <span className="text-white/50 text-xs sm:text-sm whitespace-nowrap">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
