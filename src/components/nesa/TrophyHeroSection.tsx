import { Trophy, ArrowRight, Sparkles, Users, Globe, Calendar, Coins, LayoutGrid, Search } from "lucide-react";
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
import { HeroCTAStack } from "@/components/nesa/HeroCTAStack";

const CAROUSEL_ITEMS = ["trophy-icon", "trophy-winners", "logo"] as const;
type CarouselItem = typeof CAROUSEL_ITEMS[number];

export function TrophyHeroSection() {
  const { t } = useTranslation("pages");
  const { getBannerText } = useSeason();
  const [currentItem, setCurrentItem] = useState<CarouselItem>("trophy-icon");
  const { data: countsData } = useRegionNomineeCounts();
  const nomineeLabel = useMemo(() => {
    const count = countsData?.totalCount ?? 1760;
    return t("landing.trophyHero.trustNominees", { count: count.toLocaleString() } as any);
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
    <section className="relative min-h-[60vh] sm:min-h-[78vh] lg:min-h-[95vh] flex items-center bg-charcoal overflow-hidden">
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

      <div className="container relative z-10 py-6 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Welcome Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase mb-4"
            >
              <Sparkles className="h-3 w-3" />
              {t("landing.trophyHero.slogan")}
            </motion.p>

            {/* Official brand block — compact on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mb-3 sm:mb-5"
            >
              <p className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                NESA-Africa <span className="text-gold">2026</span>
              </p>
              <p className="text-xs sm:text-sm md:text-base italic text-gold/90 mt-1">
                "The African Blue-Garnet Awards for Education"
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-[22px] leading-[1.18] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Don't Just Clap for Education Changemakers.{" "}
              <span className="text-gold bg-gradient-to-r from-gold to-amber-400 bg-clip-text text-transparent">
                Nominate Them for NESA-Africa 2026.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="hidden sm:block text-white/80 text-sm sm:text-[15px] mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t("landing.trophyHero.valueProposition")}
            </motion.p>


            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="mb-4"
            >
              <HeroCTAStack />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-gold/80 text-xs sm:text-sm font-semibold tracking-wide mb-10"
            >
              Nominate. Earn AGC. Celebrate Education Impact.
            </motion.p>
          </div>

          {/* Right: Trophy Carousel */}
          <motion.div 
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative h-40 sm:h-56 md:h-72 lg:h-80 xl:h-[22rem] w-36 sm:w-52 md:w-64 lg:w-72 xl:w-80 flex items-center justify-center">
              <div className="absolute -inset-6 bg-gradient-to-t from-blue-600/25 via-gold/15 to-transparent blur-3xl rounded-full" />
              <div className="absolute -inset-3 bg-gradient-to-b from-gold/10 via-transparent to-blue-500/10 blur-2xl rounded-full" />
              
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

