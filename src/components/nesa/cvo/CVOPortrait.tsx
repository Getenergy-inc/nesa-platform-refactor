import { motion } from "framer-motion";
import cvoImage from "@/assets/cvo-santos.png";

export function CVOPortrait() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
      className="relative flex-shrink-0 flex flex-col items-center"
    >
      {/* Pulsing glow */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 20px rgba(212, 175, 55, 0.2)",
            "0 0 40px rgba(212, 175, 55, 0.3)",
            "0 0 20px rgba(212, 175, 55, 0.2)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 blur-md"
      />
      
      {/* Portrait container */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gold/50 shadow-xl">
        <img
          src={cvoImage}
          alt="Babashola-Santos V. Aderibigbe"
          className="w-full h-full object-cover object-top"
        />
      </div>
      
      {/* Title badge */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-3 px-3 py-1 bg-gradient-to-r from-gold to-gold-light text-charcoal text-[10px] font-bold rounded-full whitespace-nowrap shadow-lg tracking-wide uppercase"
      >
        Chief Visionary Officer
      </motion.div>
    </motion.div>
  );
}
