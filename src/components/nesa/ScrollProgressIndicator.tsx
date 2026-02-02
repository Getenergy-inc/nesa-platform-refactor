import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgressIndicator - Shows reading progress
 * Reduces bounce by giving users a sense of progression
 */
export function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-gold z-[100] origin-left"
      style={{ scaleX }}
    />
  );
}

export default ScrollProgressIndicator;
