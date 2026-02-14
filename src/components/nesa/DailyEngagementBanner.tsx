import { ArrowRight, Sparkles, LogIn, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

/**
 * DailyEngagementBanner — Warm retention hook
 * 
 * Encourages return visits without financial framing.
 * Uses gold gradient accent for premium warmth.
 */
export function DailyEngagementBanner() {
  const { user } = useAuth();

  return (
    <section
      className="relative overflow-hidden py-10 md:py-12"
      data-event="daily-engagement-banner-view"
    >
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold/8 via-charcoal to-gold/8" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal-light/20 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto"
        >
          {/* Left: Message */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2.5 justify-center md:justify-start mb-2">
              <div className="h-8 w-8 rounded-lg bg-gold/15 flex items-center justify-center">
                <Coins className="h-4 w-4 text-gold" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                Stay Engaged. <span className="text-gold">Shape the Outcome.</span>
              </h3>
            </div>
            <p className="text-white/55 text-sm md:text-base max-w-xl ml-0 md:ml-[2.75rem]">
              Verified participation unlocks structured voting access during Gold and Blue Garnet stages.
            </p>
          </div>

          {/* Right: CTA */}
          {user ? (
            <Link to="/dashboard">
              <Button
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 whitespace-nowrap px-6 shadow-lg shadow-gold/15 hover:shadow-gold/30 transition-all"
                data-event="daily-engagement-dashboard-cta"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 whitespace-nowrap px-6 shadow-lg shadow-gold/15 hover:shadow-gold/30 transition-all"
                data-event="daily-engagement-signin-cta"
              >
                <LogIn className="h-4 w-4" />
                Sign In to Participate
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
