import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { NESALogo3D } from "@/components/nesa/NESALogo3D";
import blueGarnetTrophyIcon from "@/assets/blue-garnet-trophy-icon.png";
import blueGarnetTrophyWinners from "@/assets/blue-garnet-trophy-winners.png";

/**
 * Award plaque + logo motion graphic.
 * Restored from the original TrophyHeroSection carousel (plaque → recipients → 3D logo)
 * and re-packaged as a standalone homepage band so it no longer competes with the
 * editorial hero.
 */

const ITEMS = ["plaque", "recipients", "logo"] as const;
type Item = (typeof ITEMS)[number];

const CAPTIONS: Record<Item, string> = {
  plaque: "The Blue-Garnet Award Plaque",
  recipients: "Recognition Recipients",
  logo: "The NESA-Africa Seal",
};

export function AwardPlaqueMotionSection() {
  const [current, setCurrent] = useState<Item>("plaque");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setCurrent((prev) => ITEMS[(ITEMS.indexOf(prev) + 1) % ITEMS.length]);
    }, 3500);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <section
      className="bg-charcoal py-16 sm:py-20 px-4 sm:px-6 border-t border-gold/10"
      aria-labelledby="award-plaque-heading"
    >
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Motion stage */}
        <div className="order-1 flex justify-center">
          <div className="relative h-56 sm:h-72 lg:h-80 w-52 sm:w-64 lg:w-72 flex items-center justify-center">
            <div className="absolute -inset-6 bg-gradient-to-t from-blue-600/20 via-gold/15 to-transparent blur-3xl rounded-full" />
            <AnimatePresence mode="wait">
              {current === "plaque" && (
                <motion.div
                  key="plaque"
                  initial={{ opacity: 0, scale: 0.92, rotateY: -50 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.92, rotateY: 50 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <img
                    src={blueGarnetTrophyIcon}
                    alt="NESA-Africa Blue-Garnet award plaque"
                    className="w-44 sm:w-56 lg:w-64 h-auto rounded-2xl shadow-2xl shadow-blue-900/40"
                    loading="lazy"
                  />
                </motion.div>
              )}
              {current === "recipients" && (
                <motion.div
                  key="recipients"
                  initial={{ opacity: 0, scale: 0.92, rotateY: -50 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.92, rotateY: 50 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <img
                    src={blueGarnetTrophyWinners}
                    alt="NESA-Africa recognition recipients holding their award plaques"
                    className="w-44 sm:w-56 lg:w-64 h-auto rounded-2xl shadow-2xl shadow-blue-900/40"
                    loading="lazy"
                  />
                </motion.div>
              )}
              {current === "logo" && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.92, rotateY: 50 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.92, rotateY: -50 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center"
                >
                  <NESALogo3D size="xl" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-charcoal/85 backdrop-blur-sm border border-gold/30 whitespace-nowrap">
              <span className="text-xs text-gold font-medium">{CAPTIONS[current]}</span>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="order-2 text-center lg:text-left">
          <p className="text-gold/80 uppercase tracking-[0.2em] text-xs sm:text-sm mb-3 font-semibold">
            The Symbol of Recognition
          </p>
          <h2
            id="award-plaque-heading"
            className="font-playfair text-3xl sm:text-4xl text-white mb-4"
          >
            The Blue-Garnet Plaque and the NESA-Africa Seal
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-6 max-w-xl mx-auto lg:mx-0">
            Every recipient receives a plaque and a verified seal of recognition — the physical
            record of an education contribution independently reviewed and approved.
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link
              to="/awards"
              className="inline-flex items-center rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal hover:bg-gold-dark transition-colors"
            >
              Explore Recognition Tiers
            </Link>
            <Link
              to="/nominees"
              className="inline-flex items-center rounded-md border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10 transition-colors"
            >
              Explore Existing Nominees
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AwardPlaqueMotionSection;
