// Influencer Education Impact — live nominee sliders (one per pathway).
//
// Reuses the shared StripScroller carousel already powering the Icon Award
// nominee rows: desktop drag + hover arrows, mobile touch scroll-snap,
// reduced-motion aware auto-advance. Data is live from the database.

import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Sparkles, ArrowRight, Users } from "lucide-react";
import { StripScroller } from "@/features/landing/editorial/StripScroller";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInfluencerPathwayNominees,
  type InfluencerNomineeEntry,
  type InfluencerPathwayBucket,
} from "@/hooks/useInfluencerPathwayNominees";

const CARD_W = 280;
const CARD_H = 350;

function NomineeCardItem({ entry }: { entry: InfluencerNomineeEntry }) {
  const [broken, setBroken] = useState(false);
  const [contain, setContain] = useState(entry.imageKind === "logo");
  const place = [entry.country, entry.region].filter(Boolean).join(" · ");
  const initials = entry.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="group relative flex w-[78vw] max-w-[320px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.03] transition-colors hover:border-gold/50 focus-within:border-gold sm:w-[46vw] lg:w-[280px]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal/60">
        {entry.imageUrl && !broken ? (
          <img
            src={entry.imageUrl}
            alt={`${entry.name}${place ? `, ${place}` : ""}`}
            width={CARD_W}
            height={CARD_H}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth > img.naturalHeight * 1.05 || img.naturalWidth < CARD_W)
                setContain(true);
            }}
            className={`h-full w-full transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
              contain ? "bg-white/[0.06] object-contain p-6" : "object-cover"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gold/10 font-display text-3xl font-bold text-gold">
            {initials}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base font-semibold leading-tight text-white">
          <Link
            to={entry.href}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {entry.name}
          </Link>
        </h3>
        <p className="text-[11px] uppercase tracking-wider text-gold">
          {entry.subcategoryName || entry.categoryName}
        </p>
        {place && (
          <p className="mt-auto inline-flex items-center gap-1 text-xs text-white/55">
            <MapPin className="h-3 w-3" /> {place}
          </p>
        )}
      </div>
    </article>
  );
}

function PathwayRow({ pathway }: { pathway: InfluencerPathwayBucket }) {
  return (
    <div className="group/strip">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-white md:text-xl">
            {pathway.categoryName}
          </h3>
          <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-white/55">
            <Users className="h-3 w-3 text-gold" />
            {pathway.nominees.length === 0
              ? "No eligible nominees published yet"
              : `${pathway.nominees.length} published nominee${pathway.nominees.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="border-gold/40 text-gold hover:bg-gold/10"
        >
          <Link to={pathway.nominateHref}>
            Nominate <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {pathway.nominees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gold/25 bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-white/65">
            No verified nominee has been published in this pathway yet. Verified profiles
            appear here as NRC verification completes.
          </p>
          <Button asChild size="sm" className="mt-3 bg-gold font-semibold text-charcoal hover:bg-gold/90">
            <Link to={pathway.nominateHref}>Nominate an Education Enabler</Link>
          </Button>
        </div>
      ) : (
        <StripScroller label={`${pathway.categoryName} nominees`}>
          {pathway.nominees.map((n) => (
            <NomineeCardItem key={n.id} entry={n} />
          ))}
        </StripScroller>
      )}
    </div>
  );
}

export interface InfluencerPathwayNomineeSliderProps {
  /** Small uppercase label above the heading. */
  eyebrow?: string;
  /** Heading text before the highlighted words. */
  headingLead?: string;
  /** Highlighted (gold) portion of the heading. */
  headingHighlight?: string;
  /** Optional footer link rendered under the three rows (homepage use). */
  footerLink?: { to: string; label: string };
}

export function InfluencerPathwayNomineeSlider({
  eyebrow = "Existing Nominees",
  headingLead = "Nominees Across the Three",
  headingHighlight = "Influencer Pathways",
  footerLink,
}: InfluencerPathwayNomineeSliderProps = {}) {
  const { pathways, total, loading, error } = useInfluencerPathwayNominees();

  return (
    <section
      id="influencer-pathway-nominees"
      aria-label="Influencer pathway nominees"
      className="scroll-mt-20 border-b border-gold/10 bg-black/40 py-12 md:py-16"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <header className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="h-3 w-3" /> {eyebrow}
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
            {headingLead} <span className="text-gold">{headingHighlight}</span>
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/60">
            Live from the verified recognition database — Music, Social Media and Sports
            Education Enablers.
            {!loading && !error && total > 0 ? ` ${total} published nominees.` : ""}
          </p>
        </header>

        {loading ? (
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px] w-[280px] shrink-0 rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-sm text-white/60">
            Nominee profiles could not be loaded right now. Please try again shortly.
          </p>
        ) : (
          <div className="space-y-10">
            {pathways.map((p) => (
              <PathwayRow key={p.categorySlug} pathway={p} />
            ))}
          </div>
        )}

        {footerLink && (
          <div className="mt-10 text-center">
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to={footerLink.to}>
                {footerLink.label} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default InfluencerPathwayNomineeSlider;
