import { Trophy, ArrowRight, Sparkles, Users, PlayCircle, LayoutGrid, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { NESALogo3D } from "@/components/nesa/NESALogo3D";
import { useRegionNomineeCounts } from "@/hooks/useRegionNomineeCounts";
import { FloatingParticles } from "@/components/ui/floating-particles";
import stageBackdropVideo from "@/assets/nesa-stage-backdrop-motion.mp4";
import stageBackdropFallback from "@/assets/nesa-stage-backdrop.jpg";
import blueGarnetTrophyIcon from "@/assets/blue-garnet-trophy-icon.png";
import blueGarnetTrophyWinners from "@/assets/blue-garnet-trophy-winners.png";

const CAROUSEL_ITEMS = ["trophy-icon", "trophy-winners", "logo"] as const;
type CarouselItem = typeof CAROUSEL_ITEMS[number];

export function TrophyHeroSection() {
  const { t } = useTranslation("pages");
  const { getBannerText } = useSeason();
  const [currentItem, setCurrentItem] = useState<CarouselItem>("trophy-icon");
  const { data: countsData } = useRegionNomineeCounts();
  const nomineeLabel = useMemo(() => {
    const count = countsData?.totalCount ?? 1760;
    return String(t("landing.trophyHero.trustNominees", { count: count.toLocaleString() } as any));
  }, [countsData, t]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItem((prev) => {
        const idx = CAROUSEL_ITEMS.indexOf(prev);
        return CAROUSEL_ITEMS[(idx + 1) % CAROUSEL_ITEMS.length];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const bannerText = getBannerText();

  return (
    <section className="relative min-h-[92vh] sm:min-h-[95vh] flex items-center bg-charcoal overflow-hidden">
      {/* Stage Backdrop — Cinematic video with warm overlay */}
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
        <div className="absolute inset-0 bg-charcoal/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 via-transparent to-charcoal/50" />
      </div>
      
      <FloatingParticles count={20} color="gold" className="opacity-40" />
      
      {/* Spotlight Effects — Desktop only */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden lg:block">
        <motion.div 
          className="absolute -left-20 top-0 h-[80vh] w-48 rotate-[18deg] bg-gradient-to-b from-gold/12 to-transparent blur-3xl"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -right-20 top-0 h-[80vh] w-48 rotate-[-18deg] bg-gradient-to-b from-gold/12 to-transparent blur-3xl"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
      </div>

      <div className="container relative z-10 py-10 sm:py-14 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          {/* Left: Welcome Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Eyebrow / Season Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 backdrop-blur-sm border border-gold/40 mb-5 sm:mb-6 overflow-hidden"
            >
              <span className="pointer-events-none absolute inset-0 animate-shimmer rounded-full" />
              <Sparkles className="relative h-3.5 w-3.5 text-gold" />
              <span className="relative text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-white/95">
                NESA Africa 2026 — {bannerText || "Coming Soon"}
              </span>
            </motion.div>

            {/* Main Headline — premium scannable hierarchy */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="font-display text-[2rem] leading-[1.08] sm:text-5xl md:text-[3.25rem] lg:text-5xl xl:text-6xl font-bold text-white mb-4 tracking-tight"
            >
              The New Education Standard{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer-text">
                  Award Africa
                </span>
              </span>{" "}
              <span className="text-gold">2026</span>
            </motion.h1>

            {/* Subheadline — value prop in one line */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gold/95 text-base sm:text-lg font-medium mb-4 max-w-xl mx-auto lg:mx-0"
            >
              Recognizing excellence. Driving impact. Advancing education across Africa.
            </motion.p>

            {/* Supporting copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-white/75 text-sm sm:text-[15px] mb-7 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              A continental platform connecting recognition, public participation, CSR, funding, and real education impact through{" "}
              <span className="text-white/90 font-medium">NESA-Africa</span>,{" "}
              <span className="text-white/90 font-medium">EduAid Africa</span>, and{" "}
              <span className="text-white/90 font-medium">Rebuild My School Africa</span>.
            </motion.p>

            {/* CTA Stack — 1 primary + 3 secondaries */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center lg:justify-start"
            >
              {/* Primary — Get Started */}
              <Link to="/auth/register" className="w-full sm:w-auto">
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-7 gap-2 shadow-[0_0_28px_hsl(42_85%_52%/0.45)] hover:shadow-[0_0_36px_hsl(42_85%_52%/0.65)] transition-all min-h-[48px] text-sm sm:text-base group"
                  >
                    <Rocket className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
                    Get Started
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>

              {/* Secondary — Nominate Now */}
              <Link to="/nominate" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gold/60 bg-white/5 backdrop-blur-sm text-white hover:text-gold hover:bg-gold/10 hover:border-gold rounded-full px-6 gap-2 min-h-[48px] text-sm sm:text-base transition-all hover:shadow-[0_0_20px_hsl(42_85%_52%/0.35)] group"
                >
                  <Trophy className="h-5 w-5 text-gold group-hover:rotate-12 transition-transform" />
                  Nominate Now
                </Button>
              </Link>

              {/* Secondary — View Categories */}
              <Link to="/categories" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/25 bg-white/5 backdrop-blur-sm text-white hover:text-gold hover:bg-gold/10 hover:border-gold/60 rounded-full px-6 gap-2 min-h-[48px] text-sm sm:text-base transition-all group"
                >
                  <LayoutGrid className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  View Categories
                </Button>
              </Link>

              {/* Secondary — Watch NESA TV */}
              <Link to="/media/tv" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/25 bg-white/5 backdrop-blur-sm text-white hover:text-gold hover:bg-gold/10 hover:border-gold/60 rounded-full px-6 gap-2 min-h-[48px] text-sm sm:text-base transition-all group"
                >
                  <PlayCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch NESA TV
                </Button>
              </Link>
            </motion.div>

            {/* Inline trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="mt-6 text-xs text-white/55 flex items-center gap-2 justify-center lg:justify-start"
            >
              <Users className="h-3.5 w-3.5 text-gold/70" />
              <span>{nomineeLabel}</span>
            </motion.p>
            <div className="mb-6 lg:mb-8" />
          </div>

          {/* Right: Trophy Carousel */}
          <motion.div 
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 xl:h-[22rem] w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 flex items-center justify-center">
              <motion.div
                className="absolute -inset-10 bg-gradient-to-t from-blue-600/30 via-gold/25 to-transparent blur-3xl rounded-full"
                animate={{ opacity: [0.55, 0.95, 0.55], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute -inset-3 bg-gradient-to-b from-gold/15 via-transparent to-blue-500/15 blur-2xl rounded-full" />
              
              <AnimatePresence mode="wait">
                {currentItem === "trophy-icon" && (
                  <motion.div
                    key="trophy-icon"
                    initial={{ opacity: 0, scale: 0.92, rotateY: -50 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.92, rotateY: 50 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <img
                      src={blueGarnetTrophyIcon}
                      alt="NESA Blue Garnet Award — Africa's Highest Education Honour"
                      className="w-44 sm:w-56 md:w-64 lg:w-72 h-auto rounded-2xl shadow-2xl shadow-blue-900/40"
                    />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-charcoal/80 backdrop-blur-sm border border-gold/30 whitespace-nowrap">
                      <span className="text-xs text-gold font-medium">{t("landing.trophyHero.trophyCaption")}</span>
                    </div>
                  </motion.div>
                )}
                {currentItem === "trophy-winners" && (
                  <motion.div
                    key="trophy-winners"
                    initial={{ opacity: 0, scale: 0.92, rotateY: -50 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.92, rotateY: 50 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <img
                      src={blueGarnetTrophyWinners}
                      alt="NESA Award Winners with Trophies"
                      className="w-44 sm:w-56 md:w-64 lg:w-72 h-auto rounded-2xl shadow-2xl shadow-blue-900/40"
                    />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-charcoal/80 backdrop-blur-sm border border-gold/30 whitespace-nowrap">
                      <span className="text-xs text-gold font-medium">{t("landing.trophyHero.winnersCaption")}</span>
                    </div>
                  </motion.div>
                )}
                {currentItem === "logo" && (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, scale: 0.92, rotateY: 50 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.92, rotateY: -50 }}
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

