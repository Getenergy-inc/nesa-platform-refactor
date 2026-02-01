import { Trophy, Award, ArrowRight, Coins, Vote, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { NESALogo3D } from "@/components/nesa/NESALogo3D";
import stageBackdropVideo from "@/assets/nesa-stage-backdrop-motion.mp4";
import stageBackdropFallback from "@/assets/nesa-stage-backdrop.jpg";
import blueGarnetTrophy from "@/assets/blue-garnet-trophy.jpg";

export function TrophyHeroSection() {
  const { t } = useTranslation("pages");
  const { getBannerText } = useSeason();
  const [showTrophy, setShowTrophy] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTrophy((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const bannerText = getBannerText();

  return (
    <section className="relative min-h-[90vh] flex items-center bg-charcoal overflow-hidden">
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
      
      {/* Elegant Gold Spotlight Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute -left-20 top-0 h-[80vh] w-40 rotate-[20deg] bg-gradient-to-b from-gold/15 to-transparent blur-3xl animate-spotlight-left" />
        <div className="absolute -right-20 top-0 h-[80vh] w-40 rotate-[-20deg] bg-gradient-to-b from-gold/15 to-transparent blur-3xl animate-spotlight-right" />
      </div>

      <div className="container relative z-10 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-gold/40 mb-6">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-white">{bannerText}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
              Honoring Africa's{" "}
              <span className="text-gold">Education Changemakers</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gold/90 font-medium mb-4">
              Advocating & Achieving Education For All In Africa
            </p>

            {/* AGC Value Proposition - Primary Marketing Message */}
            <div className="relative mb-8 max-w-xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 via-blue-500/20 to-gold/30 rounded-2xl blur-lg opacity-60" />
              <div className="relative p-5 rounded-2xl bg-charcoal/80 backdrop-blur-sm border border-gold/40">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-gold/20 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Earn. Vote. Impact.</h3>
                    <p className="text-gold text-sm font-medium">Your Participation Powers Change</p>
                  </div>
                </div>
                <p className="text-white/90 text-base leading-relaxed mb-4">
                  <span className="text-gold font-semibold">Earn voting points</span> through participation. 
                  <span className="text-gold font-semibold"> Vote with AGC</span> for <span className="text-gold">Gold</span> and <span className="text-blue-400">Blue Garnet</span> winners.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-medium border border-gold/30">
                    <Sparkles className="h-3 w-3" /> Nominate = +5 AGC
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-medium border border-gold/30">
                    Daily Sign-in = +1 AGC
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/30">
                    1 Vote = 1 AGC
                  </span>
                </div>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link to="/nominate">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 gap-2 shadow-lg hover:shadow-gold/30 transition-all"
                >
                  <Trophy className="h-4 w-4" />
                  Nominate Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/vote?tier=gold">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gold/50 text-gold hover:bg-gold/10 rounded-full px-6 gap-2"
                >
                  <Vote className="h-4 w-4" />
                  Vote — Gold
                </Button>
              </Link>
              <Link to="/vote?tier=bluegarnet">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded-full px-6 gap-2"
                >
                  <Award className="h-4 w-4" />
                  Vote — Blue Garnet
                </Button>
              </Link>
            </div>

            {/* Secondary Link */}
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-gold/80 hover:text-gold transition-colors text-sm"
            >
              <span className="underline-offset-4 hover:underline">Discover More</span>
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
            <div className="relative h-72 sm:h-80 lg:h-96 w-56 sm:w-72 lg:w-80 flex items-center justify-center">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-t from-blue-600/40 via-gold/30 to-transparent blur-3xl rounded-full" />
              
              <AnimatePresence mode="wait">
                {showTrophy ? (
                  <motion.div
                    key="trophy"
                    initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-gold/50 via-blue-500/30 to-gold/50 rounded-2xl blur-sm opacity-60" />
                    <img
                      src={blueGarnetTrophy}
                      alt="Blue Garnet Award Trophy"
                      className="relative w-56 sm:w-64 lg:w-72 h-auto rounded-2xl shadow-2xl shadow-blue-900/60 border border-white/10"
                    />
                    
                    {/* Floating badge */}
                    <div className="absolute -bottom-3 -right-3 sm:-right-6 px-4 py-2 rounded-xl bg-charcoal/95 backdrop-blur-md border border-gold/50 shadow-xl">
                      <div className="text-center">
                        <p className="text-gold font-display font-bold text-base sm:text-lg">Blue Garnet</p>
                        <p className="text-white/70 text-xs">Africa's Highest Honor</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-4"
                  >
                    <NESALogo3D size="xl" />
                    <div className="px-4 py-2 rounded-xl bg-charcoal/95 backdrop-blur-md border border-gold/50 shadow-xl">
                      <p className="text-gold font-display font-bold text-base sm:text-lg text-center">NESA-Africa</p>
                      <p className="text-white/70 text-xs text-center">New Education Standard Award</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Stats Strip - De-emphasized */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-12 pt-8 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { label: "African Countries", value: "54" },
            { label: "Regions + Diaspora", value: "5" },
            { label: "Categories", value: "17" },
            { label: "Years of Vision", value: "15+" },
          ].map((stat) => (
            <div 
              key={stat.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
            >
              <span className="text-gold font-semibold">{stat.value}</span>
              <span className="text-white/50 text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}