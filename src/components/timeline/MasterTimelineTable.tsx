import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, AlertTriangle } from "lucide-react";
import {
  MASTER_TIMELINE_2026,
  MASTER_TIMELINE_NOMINATION_WINDOWS,
  MASTER_TIMELINE_OPEN_ITEMS,
  MASTER_TIMELINE_PUBLIC_NOTICE,
  MASTER_TIMELINE_TRACK_ACCENT,
  MASTER_TIMELINE_TRACK_LABELS,
} from "@/data/masterTimeline2026";

interface Props {
  /** Optional filter — hide the public-notice banner when embedded elsewhere. */
  hideNotice?: boolean;
  /** Hide the flagged Master Open Items List (e.g. on marketing surfaces). */
  hideOpenItems?: boolean;
  heading?: string;
  intro?: string;
}

export function MasterTimelineTable({
  hideNotice = false,
  hideOpenItems = false,
  heading = "NESA-Africa & EduAid-Africa 2026 Master Timeline",
  intro = "1 July – 14 December 2026 · Every milestone from public activation through the Recognition Gala.",
}: Props) {

  return (
    <section className="space-y-8">
      {!hideNotice && (
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                  Important Public Notice
                </p>
                <h3 className="mt-1 font-serif text-lg text-white sm:text-xl">
                  {MASTER_TIMELINE_PUBLIC_NOTICE.title}
                </h3>
                <p className="mt-1 text-sm text-white/75">
                  {MASTER_TIMELINE_PUBLIC_NOTICE.body}
                </p>
              </div>
            </div>
            <Link
              to={MASTER_TIMELINE_PUBLIC_NOTICE.ctaHref}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-charcoal transition hover:bg-amber-400"
            >
              {MASTER_TIMELINE_PUBLIC_NOTICE.ctaLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-serif text-3xl text-white sm:text-4xl">{heading}</h2>
        <p className="mt-2 text-white/70">{intro}</p>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.14em] text-white/60">
            <tr>
              <th scope="col" className="w-[18%] px-4 py-3 font-medium">Date / Period</th>
              <th scope="col" className="w-[26%] px-4 py-3 font-medium">Programme or Milestone</th>
              <th scope="col" className="w-[30%] px-4 py-3 font-medium">Main Activity</th>
              <th scope="col" className="w-[26%] px-4 py-3 font-medium">Expected Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {MASTER_TIMELINE_2026.map((row) => (
              <tr
                key={row.id}
                className={row.highlight ? "bg-amber-500/[0.06]" : "hover:bg-white/[0.02]"}
              >
                <td className="align-top px-4 py-4 text-white/70">
                  <div className="whitespace-nowrap font-medium text-white">{row.dateLabel}</div>
                  <div className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${MASTER_TIMELINE_TRACK_ACCENT[row.track]}`}>
                    {MASTER_TIMELINE_TRACK_LABELS[row.track]}
                  </div>
                </td>
                <td className="align-top px-4 py-4">
                  {row.href ? (
                    <Link to={row.href} className="font-serif text-base text-white hover:text-amber-200">
                      {row.milestone}
                    </Link>
                  ) : (
                    <span className="font-serif text-base text-white">{row.milestone}</span>
                  )}
                </td>
                <td className="align-top px-4 py-4 text-white/75">{row.activity}</td>
                <td className="align-top px-4 py-4 text-white/70">{row.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ol className="space-y-3 md:hidden">
        {MASTER_TIMELINE_2026.map((row) => (
          <li
            key={row.id}
            className={`rounded-xl border p-4 ${
              row.highlight
                ? "border-amber-400/40 bg-amber-500/[0.06]"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-white">{row.dateLabel}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${MASTER_TIMELINE_TRACK_ACCENT[row.track]}`}>
                {MASTER_TIMELINE_TRACK_LABELS[row.track]}
              </span>
            </div>
            {row.href ? (
              <Link to={row.href} className="mt-2 block font-serif text-base text-white hover:text-amber-200">
                {row.milestone}
              </Link>
            ) : (
              <p className="mt-2 font-serif text-base text-white">{row.milestone}</p>
            )}
            <p className="mt-1 text-sm text-white/75">{row.activity}</p>
            <p className="mt-2 text-xs text-white/60">
              <span className="uppercase tracking-wider text-white/45">Outcome · </span>
              {row.outcome}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
