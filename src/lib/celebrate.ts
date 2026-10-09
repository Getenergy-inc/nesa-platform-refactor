/**
 * celebrate.ts — shared delight helpers.
 * Gold/charcoal-themed confetti bursts for high-emotion moments
 * (certificate download, vote cast, nomination submitted, judge score saved).
 *
 * Honours `prefers-reduced-motion` and short-circuits during SSR.
 */
import confetti from "canvas-confetti";

const GOLD = ["#E5B645", "#F4D27A", "#C9962E", "#FFFFFF"];

function reducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Cinematic two-side burst — for certificate downloads & big wins. */
export function celebrateBurst() {
  if (reducedMotion()) return;
  const end = Date.now() + 900;
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.85 },
      colors: GOLD,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.85 },
      colors: GOLD,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/** Single gentle pop — for vote cast / form save. */
export function celebratePop() {
  if (reducedMotion()) return;
  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 35,
    origin: { y: 0.7 },
    colors: GOLD,
    disableForReducedMotion: true,
  });
}

/** Rising stars — for nomination submitted. */
export function celebrateStars() {
  if (reducedMotion()) return;
  confetti({
    particleCount: 90,
    spread: 100,
    startVelocity: 45,
    ticks: 200,
    gravity: 0.8,
    origin: { y: 0.6 },
    colors: GOLD,
    shapes: ["star", "circle"],
    scalar: 1.1,
    disableForReducedMotion: true,
  });
}
