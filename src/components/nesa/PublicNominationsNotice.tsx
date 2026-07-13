import { Link } from "react-router-dom";
import { ArrowRight, Megaphone } from "lucide-react";
import { MASTER_TIMELINE_PUBLIC_NOTICE } from "@/data/masterTimeline2026";

/**
 * Continental "Public Nominations for All 4 Tiers Open 1 August 2026" notice.
 * Rendered on the landing page and the Timeline page per the 2026 Master Timeline directive.
 */
export function PublicNominationsNotice() {
  return (
    <section aria-label="Public Notice — Nominations Open" className="border-y border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-yellow-500/[0.07] to-amber-500/10">
      <div className="container mx-auto flex flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
          <div className="text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
              Important Public Notice
            </p>
            <p className="mt-0.5 font-serif text-base text-white sm:text-lg">
              {MASTER_TIMELINE_PUBLIC_NOTICE.title}
            </p>
            <p className="mt-0.5 text-xs text-white/70 sm:text-sm">
              {MASTER_TIMELINE_PUBLIC_NOTICE.body}
            </p>
          </div>
        </div>
        <Link
          to={MASTER_TIMELINE_PUBLIC_NOTICE.ctaHref}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-charcoal transition hover:bg-amber-400"
        >
          {MASTER_TIMELINE_PUBLIC_NOTICE.ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
