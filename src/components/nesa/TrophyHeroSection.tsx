import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import nesaStamp from "@/assets/nesa-stamp.jpeg";

export function TrophyHeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center bg-secondary overflow-hidden">
      {/* Subtle gold radial glow from top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,_hsla(42,85%,52%,0.08)_0%,_transparent_70%)]" />
      {/* Bottom separator line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      {/* Corner gold accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/5 to-transparent" />

      <div className="container relative z-10 px-5 py-10 sm:py-16">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          
          {/* Logo — compact on mobile */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 sm:mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-primary/8 blur-xl" />
              <img 
                src={nesaStamp} 
                alt="NESA Africa" 
                className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full object-contain shadow-lg shadow-primary/10"
              />
            </div>
          </motion.div>

          {/* Season badge — tight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-4 sm:mb-5"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[11px] sm:text-xs font-medium text-primary/90 tracking-wide">2025 Edition — Nominations Open</span>
          </motion.div>

          {/* Headline — smaller on mobile to stay above fold */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-display text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-3 sm:mb-4 leading-[1.1] tracking-tight"
          >
            Where Standards Rise.{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              And Africa Leads.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-secondary-foreground/50 text-sm sm:text-base md:text-lg max-w-lg mb-6 sm:mb-8 leading-relaxed"
          >
            A continental platform for education recognition, nominations, governance, and impact.
          </motion.p>

          {/* CTAs — all visible without scrolling */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col gap-3 w-full sm:w-auto"
          >
            {/* Primary: Explore */}
            <Link to="/categories" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-10 h-13 sm:h-14 text-base gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all group"
              >
                Explore
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {/* Secondary row: Sign Up + Sign In */}
            <div className="flex gap-3 w-full sm:w-auto">
              <Link to="/auth?tab=register" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 rounded-full px-7 h-11 sm:h-12 font-semibold transition-all"
                >
                  Sign Up
                </Button>
              </Link>
              <Link to="/auth" className="flex-1 sm:flex-none">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-secondary-foreground/60 hover:text-primary hover:bg-primary/5 rounded-full px-7 h-11 sm:h-12 font-semibold transition-all"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
