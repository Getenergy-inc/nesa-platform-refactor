import { Trophy, ArrowRight, Sparkles, Users, Globe, Calendar, ChevronDown, Play } from "lucide-react";
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

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  };

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

      <div className="container relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Welcome Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Season Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 backdrop-blur-sm border border-gold/30 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs sm:text-sm font-medium text-white/90">{bannerText}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl font-bold text-white mb-5 leading-[1.08]"
            >
              {t("landing.trophyHero.headline")}{" "}
              <span className="text-gold bg-gradient-to-r from-gold to-amber-400 bg-clip-text text-transparent">
                {t("landing.trophyHero.headlineAccent")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white/60 text-xs sm:text-sm font-medium mb-2 tracking-widest uppercase italic"
            >
              {t("landing.trophyHero.slogan")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-gold/80 text-sm sm:text-base font-semibold mb-3 tracking-wide uppercase"
            >
              {t("landing.trophyHero.tagline")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="text-white/75 text-base sm:text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t("landing.trophyHero.valueProposition")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-4"
            >
              <Link to="/nominate">
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-10 gap-2.5 shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all h-13 text-base group"
                  >
                    <Trophy className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    {t("landing.trophyHero.nominateNow")}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <a href="#nominees">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gold/50 text-gold hover:bg-gold/10 hover:border-gold rounded-full px-8 gap-2 h-13 text-base transition-all"
                >
                  <Users className="h-5 w-5" />
                  Explore Nominees
                </Button>
              </a>
            </motion.div>

            {/* Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.72 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6"
            >
              <Link to="/nominees">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gold/70 hover:text-gold hover:bg-gold/10 rounded-full px-5 gap-1.5 text-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  Re-Nominate
                </Button>
              </Link>
              <Link to="/vote-with-agc">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gold/70 hover:text-gold hover:bg-gold/10 rounded-full px-5 gap-1.5 text-sm"
                >
                  {t("landing.trophyHero.voteWithAGC")}
                </Button>
              </Link>
            </motion.div>

            {/* Secondary links — less prominent */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
            >
              <Link to="/media" className="group inline-flex items-center gap-1.5 text-gold/60 hover:text-gold text-sm transition-colors">
                <Play className="h-3.5 w-3.5" />
                <span className="underline-offset-4 hover:underline">{t("landing.trophyHero.watchLive")}</span>
              </Link>
              <Link to="/about" className="group inline-flex items-center gap-1.5 text-white/50 hover:text-gold text-sm transition-colors">
                <span className="underline-offset-4 hover:underline">Learn More</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap gap-5 sm:gap-6 justify-center lg:justify-start"
            >
              {[
                { icon: Globe, label: String(t("landing.trophyHero.trustRegions")) },
                { icon: Users, label: nomineeLabel as string },
                { icon: Calendar, label: String(t("landing.trophyHero.trustVision")) },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 text-white/60 text-sm">
                  <stat.icon className="h-4 w-4 text-gold/70" />
                  <span>{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Trophy Carousel */}
          <motion.div 
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 xl:h-[22rem] w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 flex items-center justify-center">
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

      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 hover:text-gold transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] uppercase tracking-widest">{t("landing.trophyHero.scrollHint")}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}