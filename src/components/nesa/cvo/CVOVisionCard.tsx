import { motion } from "framer-motion";
import { Target, Sparkles, Globe } from "lucide-react";

const visionPillars = [
  { icon: Target, label: "Vision 2035", value: "Pan-African Standards" },
  { icon: Globe, label: "5 Regions", value: "+ Diaspora" },
  { icon: Sparkles, label: "Legacy", value: "Education Excellence" },
];

export function CVOVisionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="grid grid-cols-3 gap-2 mt-4"
    >
      {visionPillars.map((pillar, index) => (
        <motion.div
          key={pillar.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 + index * 0.1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent rounded-lg blur-sm group-hover:from-gold/20 transition-all" />
          <div className="relative p-2 md:p-3 rounded-lg border border-gold/20 bg-charcoal/50 backdrop-blur-sm text-center">
            <pillar.icon className="h-4 w-4 mx-auto mb-1 text-gold" />
            <p className="text-[10px] text-gold/80 font-medium">{pillar.label}</p>
            <p className="text-[9px] text-white/60 truncate">{pillar.value}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
