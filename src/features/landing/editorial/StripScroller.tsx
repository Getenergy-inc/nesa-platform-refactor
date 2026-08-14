// Shared horizontal scroller for nominee headshot strips.
//
// Fixes the "row gets clipped at the viewport edge" bug (grid/flex children
// default to min-width:auto, so the strip stretched its card instead of
// scrolling) and gives desktop users real affordances:
//   • overflow-x auto with a slim always-visible scrollbar
//   • click-and-drag scrolling with a grab cursor
//   • prev / next arrows that appear on hover when the strip overflows
//   • mobile: native touch scroll + scroll-snap so cards settle cleanly
//
// Motion (auto-advance) is still the shared useStripAutoScroll behaviour and
// remains disabled under prefers-reduced-motion.

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStripAutoScroll } from "./useStripAutoScroll";

interface Props {
  /** Accessible label, e.g. "Africa Education Philanthropy Icon nominees". */
  label: string;
  /** Enable gentle auto-advance (respects reduced motion). */
  autoScroll?: boolean;
  intervalMs?: number;
  className?: string;
  children: React.ReactNode;
}

export function StripScroller({
  label,
  autoScroll = true,
  intervalMs = 5200,
  className = "",
  children,
}: Props) {
  const { ref, pauseHandlers } = useStripAutoScroll<HTMLDivElement>(autoScroll, intervalMs);
  const [overflowing, setOverflowing] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const drag = useRef<{ active: boolean; startX: number; startLeft: number; moved: boolean }>({
    active: false,
    startX: 0,
    startLeft: 0,
    moved: false,
  });

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflowing(max > 4);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, [ref]);

  useEffect(() => {
    sync();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync, ref]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 240), behavior: "smooth" });
  };

  // Click-and-drag scrolling (pointer events cover mouse + pen; touch keeps
  // native momentum scrolling because touch pointers are not captured).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div className="relative min-w-0">
      <div
        ref={ref}
        {...pauseHandlers}
        onScroll={sync}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        role="group"
        tabIndex={0}
        aria-label={`${label} — scroll, drag or swipe to browse`}
        className={`ed-strip-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${className}`}
      >
        {children}
      </div>

      {overflowing && (
        <>
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={atStart}
            aria-label={`Scroll ${label} left`}
            className="absolute left-0 top-[38%] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-charcoal/90 text-gold opacity-0 shadow-lg transition-opacity hover:bg-charcoal disabled:pointer-events-none disabled:opacity-0 md:flex md:group-hover/strip:opacity-100 [.relative:hover>&]:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={atEnd}
            aria-label={`Scroll ${label} right`}
            className="absolute right-0 top-[38%] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-charcoal/90 text-gold opacity-0 shadow-lg transition-opacity hover:bg-charcoal disabled:pointer-events-none disabled:opacity-0 md:flex [.relative:hover>&]:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

export default StripScroller;
