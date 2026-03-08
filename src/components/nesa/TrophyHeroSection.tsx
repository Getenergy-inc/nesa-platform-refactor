import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { NESALogo3D } from "@/components/nesa/NESALogo3D";
import { FloatingParticles } from "@/components/ui/floating-particles";

export function TrophyHeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center bg-secondary overflow-hidden">
      {/* Deep black base with subtle gold radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary to-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(42,85%,52%,0.06)_0%,_transparent_70%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <FloatingParticles count={12} color="gold" className="opacity-20" />

      <div className="container relative z-10 py-16 sm:py-20 px-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <NESALogo3D size="xl" />
          </motion.div>

          {/* Season badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary/90">2025 Edition — Nominations Open</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-secondary-foreground mb-4 leading-[1.05] tracking-tight"
          >
            Where Standards Rise.{" "}
            <span className="text-primary">And Africa Leads.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-secondary-foreground/60 text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            A continental platform for education recognition, nominations, governance, and impact.
          </motion.p>

          {/* Primary CTA — Explore */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6"
          >
            <Link to="/categories" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-10 h-14 text-base gap-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group"
              >
                Explore
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Secondary CTAs — Sign Up / Sign In */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex items-center gap-4"
          >
            <Link to="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 rounded-full px-8 h-12 font-medium transition-all"
              >
                Sign Up
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="ghost"
                size="lg"
                className="text-secondary-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full px-8 h-12 font-medium transition-all"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
