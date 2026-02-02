import { useState, useEffect } from "react";
import { X, Users, TrendingUp, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SOCIAL_PROOF_MESSAGES = [
  { icon: Users, text: "243 nominations submitted this week", delay: 15000 },
  { icon: TrendingUp, text: "Vote counts doubled in the last 24 hours", delay: 35000 },
  { icon: Award, text: "17 categories open for nominations", delay: 55000 },
];

const STORAGE_KEY = "nesa_engagement_toast_shown";

/**
 * EngagementToast - Shows social proof notifications
 * Reduces bounce by demonstrating activity and urgency
 */
export function EngagementToast() {
  const [currentToast, setCurrentToast] = useState<typeof SOCIAL_PROOF_MESSAGES[0] | null>(null);
  const [toastIndex, setToastIndex] = useState(0);

  useEffect(() => {
    // Check if we've shown toasts recently
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const lastShown = parseInt(stored, 10);
        const hoursAgo = (Date.now() - lastShown) / (1000 * 60 * 60);
        if (hoursAgo < 1) return; // Don't show within 1 hour
      }
    } catch {
      // Ignore storage errors
    }

    // Show toasts at intervals
    const timeouts: NodeJS.Timeout[] = [];

    SOCIAL_PROOF_MESSAGES.forEach((message, index) => {
      const timeout = setTimeout(() => {
        setCurrentToast(message);
        setToastIndex(index);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setCurrentToast(null);
        }, 5000);
      }, message.delay);
      
      timeouts.push(timeout);
    });

    // Mark as shown after all toasts
    const markShownTimeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      } catch {
        // Ignore
      }
    }, 60000);
    timeouts.push(markShownTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const handleDismiss = () => {
    setCurrentToast(null);
  };

  return (
    <AnimatePresence>
      {currentToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 50, x: "-50%" }}
          className="fixed bottom-4 left-1/2 z-[150] md:left-auto md:right-4 md:translate-x-0"
        >
          <div className="flex items-center gap-3 bg-charcoal/95 backdrop-blur-md border border-gold/30 rounded-xl px-4 py-3 shadow-lg shadow-black/20 min-w-[280px] max-w-sm">
            <div className="h-8 w-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
              <currentToast.icon className="h-4 w-4 text-gold" />
            </div>
            <p className="text-sm text-white/90 flex-1">{currentToast.text}</p>
            <button
              onClick={handleDismiss}
              className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EngagementToast;
