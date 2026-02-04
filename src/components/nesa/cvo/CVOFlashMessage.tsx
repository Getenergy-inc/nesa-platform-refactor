import { X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CVOPortrait } from "./CVOPortrait";
import { CVOMessage } from "./CVOMessage";
import { CVOVisionCard } from "./CVOVisionCard";
import { CVOActions } from "./CVOActions";

interface CVOFlashMessageProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CVO Flash Message Component
 * A futuristic, strategically designed modal for the Chief Visionary Officer's message
 * Emphasizes Vision 2035 and pan-African education transformation
 */
export function CVOFlashMessage({ isOpen, onClose }: CVOFlashMessageProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Scrollable Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={onClose}
          >
            <div className="min-h-full flex items-center justify-center p-4 py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 25,
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl"
              >
                <div className="relative bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal border border-gold/30 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Corner accents - hidden on mobile */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="hidden md:block absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-gold/40 rounded-tl-2xl"
                  />
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    className="hidden md:block absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-gold/40 rounded-br-2xl"
                  />
                  
                  {/* Ambient glow - simplified on mobile */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10 pointer-events-none" />

                  {/* Close button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-charcoal/80 border border-gold/30 text-white/70 hover:text-gold hover:border-gold/50 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>

                  <div className="relative p-5 md:p-8">
                    {/* Header Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-center mb-6"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30">
                        <Zap className="h-4 w-4 text-gold" />
                        <span className="text-xs md:text-sm font-semibold text-gold tracking-wide uppercase">
                          Vision Message
                        </span>
                      </div>
                    </motion.div>

                    {/* Content - stacked on mobile, side-by-side on desktop */}
                    <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
                      <CVOPortrait />
                      <CVOMessage />
                    </div>

                    <CVOVisionCard />
                    <CVOActions onClose={onClose} />
                  </div>

                  {/* Bottom border */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent origin-center"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
