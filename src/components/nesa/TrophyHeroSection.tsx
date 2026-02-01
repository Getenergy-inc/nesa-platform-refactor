import { Trophy, Award, ArrowRight, Coins, Vote, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { motion } from "framer-motion";
import stageBackdrop from "@/assets/nesa-stage-backdrop.jpg";
import blueGarnetTrophy from "@/assets/blue-garnet-trophy.jpg";

export function TrophyHeroSection() {
  const { t } = useTranslation("pages");
  const { getBannerText } = useSeason();
  const bannerText = getBannerText();

  return (
    <section className="relative min-h-[90vh] flex items-center bg-charcoal overflow-hidden">
      {/* Stage Backdrop with Ken Burns Effect */}
      <div className="absolute inset-0">
        <img
          src={stageBackdrop}
          alt="NESA-Africa Award Stage"
          className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
        />
        
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

            {/* Description */}
            <p className="text-white/80 text-base lg:text-lg mb-6 leading-relaxed max-w-xl">
              The New Education Standard Award Africa celebrates visionary leaders, institutions, 
              and innovators building the future of education—while funding measurable legacy 
              impact through Rebuild My School Africa.
            </p>

            {/* AGC Voting Strip */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gold/10 border border-gold/30 mb-8 max-w-lg">
              <Coins className="h-5 w-5 text-gold flex-shrink-0" />
              <p className="text-sm text-white/90">
                Earn voting points through participation. <span className="text-gold font-semibold">Vote with AGC</span> for Gold and Blue Garnet winners.
              </p>
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

          {/* Right: Trophy Image - Strategically Positioned */}
          <motion.div 
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Glow effect behind trophy */}
              <div className="absolute -inset-4 bg-gradient-to-t from-blue-600/40 via-gold/30 to-transparent blur-3xl rounded-full" />
              
              {/* Trophy Image with Premium Frame */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-gold/50 via-blue-500/30 to-gold/50 rounded-2xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity" />
                <img
                  src={blueGarnetTrophy}
                  alt="Blue Garnet Award Trophy"
                  className="relative w-56 sm:w-72 lg:w-80 h-auto rounded-2xl shadow-2xl shadow-blue-900/60 border border-white/10"
                />
                
                {/* Floating badge */}
                <motion.div 
                  className="absolute -bottom-3 -right-3 sm:-right-6 px-4 py-2 rounded-xl bg-charcoal/95 backdrop-blur-md border border-gold/50 shadow-xl"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-center">
                    <p className="text-gold font-display font-bold text-base sm:text-lg">Blue Garnet</p>
                    <p className="text-white/70 text-xs">Africa's Highest Honor</p>
                  </div>
                </motion.div>
              </div>
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
            { label: "Nominees", value: "2,500+" },
            { label: "Countries", value: "54" },
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