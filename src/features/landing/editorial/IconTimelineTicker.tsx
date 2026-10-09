// Compact Icon nomination timeline — rendered as a single-line horizontal
// ticker attached directly beneath the Public Nominations Notice banner.
//
// Replaces the former tall <IconTimelineSection /> numbered list. Copy is NOT
// rewritten here: every "Label · Date" pair is read straight from
// ICON_NOMINATION_TIMELINE in brandHierarchy.ts.
//
// Motion reuses the shared homepage strip pattern (usePrefersReducedMotion +
// pause-on-interaction handlers) via useMarqueeAutoScroll.

import { CalendarDays } from "lucide-react";
import { ICON_NOMINATION_TIMELINE } from "@/config/brandHierarchy";
import { useMarqueeAutoScroll } from "./useStripAutoScroll";

export function IconTimelineTicker() {
  const { ref, pauseHandlers, reducedMotion } = useMarqueeAutoScroll<HTMLDivElement>();

  const steps = ICON_NOMINATION_TIMELINE.steps;
  // Duplicated once so the continuous scroll can wrap seamlessly. The clone is
  // hidden from assistive tech; the first pass carries the real semantics.
  const passes = reducedMotion ? [steps] : [steps, steps];

  return (
    <section
      aria-label={ICON_NOMINATION_TIMELINE.title}
      className="border-b border-amber-400/30 bg-amber-500/[0.06]"
    >
      <div className="container mx-auto flex items-center gap-3 px-4 py-2">
        <span className="hidden shrink-0 items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300 sm:inline-flex">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          Icon key dates
        </span>

        <div
          ref={ref}
          {...pauseHandlers}
          tabIndex={0}
          role="group"
          aria-label={ICON_NOMINATION_TIMELINE.title}
          className="ed-ticker-track min-w-0 flex-1 overflow-x-auto whitespace-nowrap outline-none focus-visible:ring-1 focus-visible:ring-amber-300/60"
        >
          <div className="inline-flex items-center gap-0">
            {passes.map((pass, p) =>
              pass.map((s) => (
                <span
                  key={`${p}-${s.key}`}
                  className="inline-flex items-center"
                  aria-hidden={p > 0 ? true : undefined}
                >
                  <span className="text-xs text-white/85 sm:text-[13px]">
                    <span className="font-medium text-white">{s.label}</span>
                    <span className="text-amber-300/90"> · {s.when}</span>
                  </span>
                  <span className="mx-4 text-amber-400/40" aria-hidden="true">
                    —
                  </span>
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default IconTimelineTicker;
