/**
 * ExploreNomineesCTA — reusable banner CTA pointing to the
 * "Explore Existing Nominees" directory. Drop on category, regional,
 * sponsor, judge, and dashboard surfaces for platform-wide visibility.
 */

import { Link } from "react-router-dom";
import { Compass, ArrowRight, Users } from "lucide-react";

interface ExploreNomineesCTAProps {
  /** Optional filter applied to the directory link (e.g. `?region=west-africa`). */
  filterQuery?: string;
  /** Override the headline. */
  title?: string;
  /** Override the supporting copy. */
  description?: string;
  /** Smaller inline variant for sidebars. */
  variant?: "banner" | "inline";
  className?: string;
}

export function ExploreNomineesCTA({
  filterQuery,
  title = "Explore Existing Nominees",
  description = "Discover approved educators, innovators, institutions, advocates, and organisations transforming education across Africa and the diaspora.",
  variant = "banner",
  className = "",
}: ExploreNomineesCTAProps) {
  const href = `/nominees${filterQuery ? (filterQuery.startsWith("?") ? filterQuery : `?${filterQuery}`) : ""}`;

  if (variant === "inline") {
    return (
      <Link
        to={href}
        className={`group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal/60 px-4 py-2 text-sm text-white hover:border-gold hover:bg-gold/10 hover:text-gold transition-all ${className}`}
      >
        <Compass className="h-4 w-4 text-gold" />
        <span>{title}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    );
  }

  return (
    <section className={`relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-charcoal via-charcoal-light/60 to-charcoal p-6 md:p-8 ${className}`}>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" aria-hidden />
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm md:text-[15px] text-white/65 max-w-2xl">{description}</p>
          </div>
        </div>
        <Link
          to={href}
          className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-charcoal shadow-[0_6px_18px_-8px_hsl(var(--gold)/0.75)] hover:bg-gold-dark hover:-translate-y-0.5 transition-all"
        >
          <Compass className="h-4 w-4" />
          See All Nominees
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

export default ExploreNomineesCTA;
