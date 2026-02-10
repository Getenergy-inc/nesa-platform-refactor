import { ArrowRight, Sparkles, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export function DailyEngagementBanner() {
  const { user } = useAuth();

  return (
    <section
      className="bg-gradient-to-r from-gold/10 via-charcoal to-gold/10 border-y border-gold/20 py-8 md:py-10"
      data-event="daily-engagement-banner-view"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto"
        >
          {/* Left: Message */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <Sparkles className="h-5 w-5 text-gold" />
              <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                Return Daily. Stay Engaged. <span className="text-gold">Earn Voting Points.</span>
              </h3>
            </div>
            <p className="text-white/60 text-sm md:text-base max-w-xl">
              Verified engagement on NESA-Africa unlocks voting access during Gold Certificate 
              and Blue Garnet Award stages.
            </p>
          </div>

          {/* Right: CTA */}
          {user ? (
            <Link to="/dashboard">
              <Button
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 whitespace-nowrap"
                data-event="daily-engagement-dashboard-cta"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 whitespace-nowrap"
                data-event="daily-engagement-signin-cta"
              >
                <LogIn className="h-4 w-4" />
                Sign In to Stay Engaged
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
