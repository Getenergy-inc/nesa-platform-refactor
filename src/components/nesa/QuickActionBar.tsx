import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export function QuickActionBar() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 300);
  });

  if (!isVisible) return null;

  return (
    <motion.div
      className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-gold/20 md:hidden"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  );
}
