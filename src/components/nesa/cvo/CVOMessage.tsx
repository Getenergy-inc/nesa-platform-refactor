import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function CVOMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
      className="flex-1 text-center"
    >
      <div className="relative">
        {/* Quote icon */}
        <Quote className="h-5 w-5 mx-auto mb-2 text-gold/40" />
        
        <blockquote className="text-sm md:text-base text-white/90 leading-relaxed px-2">
          <span>
            Welcome to{" "}
            <span className="text-gold font-semibold">NESA-Africa 2025</span>
            —a pan-African celebration of educational transformation, social impact, and legacy.
          </span>
          <span className="block mt-2">
            Together, we honor those who{" "}
            <span className="italic text-gold/90">dare to reimagine education</span>{" "}
            and inspire generations toward our{" "}
            <span className="font-semibold text-gold">Vision 2035</span>.
          </span>
        </blockquote>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-4 pt-3 border-t border-gold/20"
      >
        <p className="text-gold font-display text-base md:text-lg font-semibold">
          Babashola-Santos V. Aderibigbe
        </p>
        <p className="text-white/50 text-xs mt-0.5">
          Founder & CVO, Santos Creations Educational Foundation
        </p>
        <p className="text-gold/50 text-[10px] mt-1 italic">
          "Building Africa's Education Legacy Since 2005"
        </p>
      </motion.div>
    </motion.div>
  );
}
