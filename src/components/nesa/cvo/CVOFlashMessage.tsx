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
          {/* Backdrop with grid pattern */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-charcoal/90 backdrop-blur-md"
            onClick={onClose}
          >
            {/* Futuristic grid overlay */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}
            />
          </motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 25,
            }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-3xl"
          >
            <div className="relative bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal border border-gold/30 rounded-2xl shadow-2xl overflow-hidden">
              {/* Animated corner accents */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-gold/40 rounded-tl-2xl"
              />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-gold/40 rounded-br-2xl"
              />
              
              {/* Ambient glow effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10 pointer-events-none" />
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute top-0 left-1/4 w-60 h-60 bg-gold/10 rounded-full blur-3xl pointer-events-none"
              />
              <motion.div
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.15, 1]
                }}
                transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
                className="absolute bottom-0 right-1/4 w-60 h-60 bg-gold/10 rounded-full blur-3xl pointer-events-none"
              />

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-charcoal/80 border border-gold/30 text-white/60 hover:text-gold hover:border-gold/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>

              <div className="relative p-6 md:p-8">
                {/* Header Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="flex items-center justify-center mb-8"
                >
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 border border-gold/30">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { repeat: Infinity, duration: 8, ease: "linear" },
                        scale: { repeat: Infinity, duration: 2 }
                      }}
                    >
                      <Zap className="h-4 w-4 text-gold" />
                    </motion.div>
                    <span className="text-sm font-semibold text-gold tracking-wide uppercase">
                      Strategic Vision Message
                    </span>
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-2 h-2 rounded-full bg-gold"
                    />
                  </div>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <CVOPortrait />
                  <CVOMessage />
                </div>

                <CVOVisionCard />
                <CVOActions onClose={onClose} />
              </div>

              {/* Decorative bottom border with animation */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent origin-center"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
