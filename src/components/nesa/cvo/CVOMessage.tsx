import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function CVOMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
      className="flex-1 text-center md:text-left"
    >
      <div className="relative">
        {/* Decorative quote marks */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Quote className="absolute -top-2 -left-2 h-8 w-8 text-gold/20" />
        </motion.div>
        
        <blockquote className="text-base md:text-lg text-white/90 leading-relaxed pl-6 md:pl-8 font-light">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Welcome to{" "}
            <span className="text-gold font-semibold">NESA-Africa 2025</span>
            —a pan-African celebration of educational transformation, social impact, and legacy.
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="block mt-3"
          >
            Together, we honor those who{" "}
            <span className="italic text-gold/90">dare to reimagine education</span>{" "}
            and inspire generations toward our{" "}
            <span className="font-semibold text-gold">Vision 2035</span>.
          </motion.span>
        </blockquote>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-5 pt-4 border-t border-gold/20"
      >
        <p className="text-gold font-display text-xl font-semibold tracking-wide">
          Babashola-Santos V. Aderibigbe
        </p>
        <p className="text-white/50 text-sm mt-0.5">
          Founder & CVO, Santos Creations Educational Foundation
        </p>
        <motion.p
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="text-gold/60 text-xs mt-1 italic"
        >
          "Building Africa's Education Legacy Since 2005"
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
