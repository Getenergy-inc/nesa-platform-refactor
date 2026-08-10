// Shared horizontal-strip motion for homepage galleries.
//
// One implementation for both the main living gallery and the Icon pathway
// photo strips: gentle page-by-page auto-advance, fully disabled under
// prefers-reduced-motion, paused on hover / focus / pointer interaction.

import { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export function useStripAutoScroll<T extends HTMLElement>(enabled: boolean, intervalMs = 4500) {
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reducedMotion || paused || !enabled) return;
    const el = ref.current;
    if (!el) return;
    const id = window.setInterval(() => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 4) return;
      const step = Math.max(el.clientWidth * 0.8, 260);
      const next = el.scrollLeft + step >= max - 4 ? 0 : el.scrollLeft + step;
      el.scrollTo({ left: next, behavior: "smooth" });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, enabled, intervalMs]);

  /** Spread onto the scroll container to wire pause-on-interaction. */
  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
    },
    onPointerDown: () => setPaused(true),
    onTouchStart: () => setPaused(true),
  };

  return { ref, pauseHandlers, reducedMotion };
}

/**
 * Continuous, slow horizontal marquee for compact tickers.
 *
 * Same behavioural contract as useStripAutoScroll — disabled entirely under
 * prefers-reduced-motion, paused on hover / focus / pointer interaction — but
 * advances by sub-pixel steps each frame instead of page-by-page, which reads
 * better for a single-line "Label · Date" ticker.
 */
export function useMarqueeAutoScroll<T extends HTMLElement>(pxPerSecond = 32) {
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reducedMotion || paused) return;
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const max = el.scrollWidth - el.clientWidth;
      if (max > 4) {
        // The track renders the sequence twice, so wrapping at the halfway
        // point makes the loop seamless.
        const loopAt = el.scrollWidth / 2;
        const next = el.scrollLeft + pxPerSecond * dt;
        el.scrollLeft = next >= loopAt ? next - loopAt : next;
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [reducedMotion, paused, pxPerSecond]);

  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
    },
    onPointerDown: () => setPaused(true),
    onTouchStart: () => setPaused(true),
  };

  return { ref, pauseHandlers, reducedMotion };
}
