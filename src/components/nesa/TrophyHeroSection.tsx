import { Trophy, ArrowRight, ChevronDown, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { FloatingParticles } from "@/components/ui/floating-particles";
import stageBackdropVideo from "@/assets/nesa-stage-backdrop-motion.mp4";
import stageBackdropFallback from "@/assets/nesa-stage-backdrop.jpg";
import blueGarnetTrophyIcon from "@/assets/blue-garnet-trophy-icon.png";

/**
 * TrophyHeroSection — Oscar/Grammy-tier cinematic hero
 * 
 * Design principles from Oscars.org & Grammy.com:
 * 1. Trophy IS the visual — dominant, center-stage, full presence
 * 2. Minimal text — headline + one tagline, nothing more above fold
 * 3. Single primary CTA with one ghost secondary
 * 4. Cinematic depth — layered overlays, spotlight effects
 * 5. Scroll-triggered reveal for content below
 */
export function TrophyHeroSection() {
  const { getBannerText } = useSeason();
  const bannerText = getBannerText();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContent = useCallback(() => {
    window.scrollTo({ top: window.innerHeight * 0.88, behavior: "smooth" });
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center bg-charcoal overflow-hidden">
      {/* === LAYER 1: Video Background === */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={stageBackdropFallback}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={stageBackdropVideo} type="video/mp4" />
        </video>
        {/* Cinematic overlays — darker, more dramatic than before */}
        <div className="absolute inset-0 bg-charcoal/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40" />
      </div>

      {/* === LAYER 2: Ambient Spotlights (Oscar-style warm gold) === */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-[10%] -top-20 h-[120vh] w-[300px] rotate-[15deg] bg-gradient-to-b from-gold/8 via-gold/4 to-transparent blur-[80px]"
          animate={{ opacity: [0.3, 0.6, 0.3], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[10%] -top-20 h-[120vh] w-[300px] rotate-[-15deg] bg-gradient-to-b from-gold/8 via-gold/4 to-transparent blur-[80px]"
          animate={{ opacity: [0.3, 0.6, 0.3], x: [10, -10, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        {/* Center spotlight hitting the trophy */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-[80vh] w-[500px] bg-gradient-to-b from-gold/6 to-transparent blur-[100px]" />
      </div>

      {/* === LAYER 3: Floating Particles === */}
      <FloatingParticles count={15} color="gold" className="opacity-30" />

      {/* === MAIN CONTENT — Centered, vertical, trophy-dominant === */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Season Badge — Small, elegant, non-intrusive */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 sm:mb-10"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 backdrop-blur-md border border-gold/25 text-xs sm:text-sm font-medium text-white/80 tracking-wider uppercase">
            {bannerText}
          </span>
        </motion.div>

        {/* Trophy — THE visual centerpiece (Oscar-style dominance) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={loaded ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8 sm:mb-10"
        >
          {/* Trophy glow rings */}
          <div className="absolute -inset-8 bg-gradient-to-t from-blue-600/20 via-gold/10 to-transparent blur-[60px] rounded-full" />
          <div className="absolute -inset-4 bg-gradient-to-b from-gold/8 to-blue-500/8 blur-[40px] rounded-full" />
          
          <motion.img
            src={blueGarnetTrophyIcon}
            alt="NESA Blue Garnet Award — Africa's Highest Education Honour"
            className="relative w-48 sm:w-56 md:w-64 lg:w-72 h-auto drop-shadow-[0_20px_60px_rgba(196,160,82,0.3)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Caption badge under trophy */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-charcoal/80 backdrop-blur-sm border border-gold/30 whitespace-nowrap"
          >
            <span className="text-xs text-gold font-medium tracking-wide">Africa's Highest Education Honour</span>
          </motion.div>
        </motion.div>

        {/* Headline — BIG, dramatic, Oscar-typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-5 leading-[1.05] tracking-tight"
        >
          Honoring Africa's{" "}
          <span className="text-gradient-gold">
            Education Changemakers
          </span>
        </motion.h1>

        {/* Tagline — One line, clean */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="text-gold/80 text-sm sm:text-base md:text-lg font-semibold tracking-[0.15em] uppercase mb-10 sm:mb-12"
        >
          Advocating &amp; Achieving Education for All
        </motion.p>

        {/* CTAs — Clean duo: Primary gold + Ghost secondary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/nominate">
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full px-10 sm:px-14 gap-3 shadow-[0_8px_32px_-4px_hsl(42_85%_52%/0.4)] hover:shadow-[0_8px_40px_-4px_hsl(42_85%_52%/0.5)] transition-all h-14 text-base sm:text-lg group"
              >
                <Trophy className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Nominate Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </Link>
          <Link to="/media">
            <Button
              size="lg"
              variant="ghost"
              className="text-white/70 hover:text-gold hover:bg-white/5 rounded-full px-8 gap-2 h-14 text-base transition-all"
            >
              <Play className="h-5 w-5" />
              Watch Live
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* === SCROLL HINT — Bottom center === */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/30 hover:text-gold/80 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Discover</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
