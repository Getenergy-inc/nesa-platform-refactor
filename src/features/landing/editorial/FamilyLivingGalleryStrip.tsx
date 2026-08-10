// Recognition-families living gallery strip.
//
// Same living-gallery pattern as the Icon Award gallery, scoped to the six
// recognition families. Data comes from the shared `public_nominees` view via
// `useFamilyGalleryNominees` — real, published records only. Motion reuses the
// shared `useStripAutoScroll` hook (auto-advance, reduced-motion aware,
// pause on hover / focus / touch).

import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import {
  useFamilyGalleryNominees,
  LIVING_GALLERY_MIN_RECORDS,
  type FamilyGalleryEntry,
} from "@/hooks/useFamilyGallery";
import { useStripAutoScroll } from "./useStripAutoScroll";

/** Rendered card box — width/height attributes match the CSS box exactly. */
const CARD_W = 280;
const CARD_H = 350; // 4:5

function FamilyCard({ entry }: { entry: FamilyGalleryEntry }) {
  const [broken, setBroken] = useState(false);
  // Many enabler records store a wide logo in the photo field. Detect the
  // natural aspect on load and letterbox wide/small artwork instead of
  // cropping or upscaling it.
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
        {!broken ? (
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
              const wide = img.naturalWidth > img.naturalHeight * 1.05;
              const small = img.naturalWidth < CARD_W || img.naturalHeight < CARD_H;
              if (wide || small) setContain(true);
            }}
            className={`h-full w-full transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
              contain ? "object-contain bg-white/[0.06] p-6" : "object-cover"
            }`}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/20 to-charcoal"
            aria-hidden="true"
          >
            <span className="font-serif text-4xl text-gold/70">{initials}</span>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold line-clamp-2">
          {entry.categoryLabel}
        </p>
        <h3 className="font-serif text-base leading-snug text-white line-clamp-2">{entry.name}</h3>
        {place && (
          <p className="inline-flex items-center gap-1 text-xs text-white/60">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {place}
          </p>
        )}
        {entry.impact && (
          <p className="text-xs leading-relaxed text-white/70 line-clamp-3">{entry.impact}</p>
        )}
        <Link
          to={entry.href}
          className="mt-auto inline-flex w-fit items-center pt-2 text-xs font-semibold text-gold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          View Profile →
        </Link>
      </div>
    </article>
  );
}

export function FamilyLivingGalleryStrip() {
  const { nominees, loading, hasEnough } = useFamilyGalleryNominees();
  const { ref: trackRef, pauseHandlers } = useStripAutoScroll<HTMLDivElement>(hasEnough);

  if (loading) {
    return (
      <div className="mb-12 flex gap-4 overflow-hidden pb-4" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[420px] w-[78vw] max-w-[320px] shrink-0 animate-pulse rounded-2xl border border-gold/10 bg-white/[0.03] sm:w-[46vw] lg:w-[280px]"
          />
        ))}
      </div>
    );
  }

  if (!hasEnough) {
    return (
      <p className="mb-12 text-center text-sm text-white/60">
        Enabler profiles are published as nominations are reviewed
        {nominees.length > 0
          ? ` (${nominees.length} of ${LIVING_GALLERY_MIN_RECORDS} needed to open the gallery)`
          : ""}
        .
      </p>
    );
  }

  return (
    <div className="mb-12">
      <div
        ref={trackRef}
        role="group"
        aria-label="Recognised education enablers across the six recognition pathways — scroll or swipe to browse"
        tabIndex={0}
        {...pauseHandlers}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        {nominees.map((entry) => (
          <FamilyCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export default FamilyLivingGalleryStrip;
