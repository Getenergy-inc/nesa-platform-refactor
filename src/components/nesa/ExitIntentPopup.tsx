import { useState, useEffect, useCallback } from "react";
import { X, Award, Coins, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "nesa_exit_popup_shown";
const COOLDOWN_HOURS = 24;

/**
 * ExitIntentPopup - Captures leaving users with compelling CTA
 * Only shows once per 24 hours
 */
export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const shouldShowPopup = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return true;
      
      const lastShown = parseInt(stored, 10);
      const hoursAgo = (Date.now() - lastShown) / (1000 * 60 * 60);
      return hoursAgo > COOLDOWN_HOURS;
    } catch {
      return true;
    }
  }, []);

  const markShown = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (hasTriggered || !shouldShowPopup()) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of viewport
      if (e.clientY <= 5 && !hasTriggered) {
        setHasTriggered(true);
        setIsOpen(true);
        markShown();
      }
    };

    // Also trigger after 45 seconds if user hasn't engaged
    const timeoutId = setTimeout(() => {
      if (!hasTriggered && shouldShowPopup()) {
        // Check if user has scrolled less than 30% of page
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        if (scrollPercent < 0.3) {
          setHasTriggered(true);
          setIsOpen(true);
          markShown();
        }
      }
    }, 45000);

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [hasTriggered, shouldShowPopup, markShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-[201]"
          >
            <div className="relative bg-charcoal rounded-2xl border border-gold/30 p-6 md:p-8 shadow-2xl shadow-gold/10">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Content */}
              <div className="text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gold/20 mb-6">
                  <Award className="h-8 w-8 text-gold" />
                </div>

                {/* Headline */}
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                  Wait! Don't Miss Out
                </h2>

                <p className="text-white/70 mb-6 max-w-sm mx-auto">
                  Nominate an education changemaker and earn{" "}
                  <span className="text-gold font-semibold">+5 free voting points</span> when they're verified.
                </p>

                {/* Value props */}
                <div className="flex items-center justify-center gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-1.5 text-gold">
                    <Sparkles className="h-4 w-4" />
                    <span>Free to submit</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gold">
                    <Coins className="h-4 w-4" />
                    <span>Earn voting power</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <Link to="/nominate" onClick={handleClose} className="block">
                    <Button
                      size="lg"
                      className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2"
                    >
                      <Award className="h-4 w-4" />
                      Nominate Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <button
                    onClick={handleClose}
                    className="text-sm text-white/50 hover:text-white/70 transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ExitIntentPopup;
