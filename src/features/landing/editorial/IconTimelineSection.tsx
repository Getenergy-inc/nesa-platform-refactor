// Homepage — Africa Education Icon Award 2026 nomination timeline.
// All dates come from ICON_NOMINATION_TIMELINE in brandHierarchy.ts, which
// mirrors the canonical programme configuration. No dates are invented here.

import { CalendarDays } from "lucide-react";
import { ICON_NOMINATION_TIMELINE, ICON_GOVERNANCE_STATEMENT } from "@/config/brandHierarchy";

export function IconTimelineSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-icon-timeline-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">
            <CalendarDays className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
            Key dates
          </div>
          <h2 id="ed-icon-timeline-heading" className="ed-section-title">
            {ICON_NOMINATION_TIMELINE.title}
          </h2>
        </div>

        <ol className="mx-auto max-w-3xl space-y-3">
          {ICON_NOMINATION_TIMELINE.steps.map((s, i) => (
            <li
              key={s.key}
              className="flex gap-4 rounded-2xl border border-gold/20 bg-white/[0.03] px-5 py-4"
            >
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 font-serif text-xs text-gold"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif text-base text-white">{s.label}</h3>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                  {s.when}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-8 max-w-3xl space-y-2 text-center">
          {ICON_GOVERNANCE_STATEMENT.map((line) => (
            <p key={line} className="text-xs leading-relaxed text-white/50">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default IconTimelineSection;
