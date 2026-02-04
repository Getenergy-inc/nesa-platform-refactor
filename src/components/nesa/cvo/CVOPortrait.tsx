import { motion } from "framer-motion";
import cvoImage from "@/assets/cvo-santos.png";

export function CVOPortrait() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      className="relative flex-shrink-0"
    >
      {/* Futuristic orbital rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-4 rounded-full border border-gold/20"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-6 rounded-full border border-gold/10"
      />
      
      {/* Pulsing energy field */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 30px rgba(212, 175, 55, 0.2)",
            "0 0 60px rgba(212, 175, 55, 0.4)",
            "0 0 30px rgba(212, 175, 55, 0.2)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute -inset-2 rounded-full bg-gradient-to-br from-gold/30 via-transparent to-gold/20 blur-md"
      />
      
      {/* Portrait container */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gold/60 shadow-2xl">
        <img
          src={cvoImage}
          alt="Babashola-Santos V. Aderibigbe"
          className="w-full h-full object-cover object-top"
        />
        {/* Holographic overlay */}
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-gradient-to-t from-gold/20 via-transparent to-transparent"
        />
      </div>
      
      {/* Title badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-gold via-gold-light to-gold text-charcoal text-[10px] font-bold rounded-full whitespace-nowrap shadow-lg tracking-wider uppercase"
      >
        Chief Visionary Officer
      </motion.div>
    </motion.div>
  );
}
