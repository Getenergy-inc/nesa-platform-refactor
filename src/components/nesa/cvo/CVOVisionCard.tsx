import { motion } from "framer-motion";
import { Target, Sparkles, Globe } from "lucide-react";

const visionPillars = [
  { icon: Target, label: "Vision 2035", value: "Pan-African" },
  { icon: Globe, label: "5 Regions", value: "+ Diaspora" },
  { icon: Sparkles, label: "Legacy", value: "Excellence" },
];

export function CVOVisionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="grid grid-cols-3 gap-2 mt-6"
    >
      {visionPillars.map((pillar, index) => (
        <motion.div
          key={pillar.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55 + index * 0.08 }}
          className="relative"
        >
          <div className="p-2 md:p-3 rounded-lg border border-gold/20 bg-charcoal/50 text-center">
            <pillar.icon className="h-4 w-4 mx-auto mb-1 text-gold" />
            <p className="text-[9px] md:text-[10px] text-gold/80 font-medium">{pillar.label}</p>
            <p className="text-[8px] md:text-[9px] text-white/60">{pillar.value}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
