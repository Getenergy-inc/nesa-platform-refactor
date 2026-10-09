// Per-family "Enablers" strip used inside each of the six recognition-family
// cards on the homepage.
//
// Replaces the previous single "Featured Enabler" pick with a horizontally
// scrolling strip of REAL published records for that specific family, using
// the same shared `StripScroller` / `useStripAutoScroll` behaviour as the Icon
// gallery and the six-family living gallery (auto-advance, reduced-motion
// aware, pause on hover / focus / touch).
//
// Data is strictly scoped: entries come from `useFamilyBuckets()[familySlug]`,
// which queries only the database categories mapped to that family. Nothing is
// substituted from another family, and a family with fewer than
// MIN_STRIP_RECORDS published records renders an honest state instead of a
// sparse strip that repeats the same one or two faces.

import { useState } from "react";
import { Link } from "react-router-dom";
import { useFamilyBuckets, type FamilyGalleryEntry } from "@/hooks/useFamilyGallery";
import { StripScroller } from "./StripScroller";

/** Below this, a strip would just repeat the same faces — show cards instead. */
export const MIN_STRIP_RECORDS = 3;

const TILE_W = 132;
const TILE_H = 165; // 4:5

function Tile({ entry, familyName }: { entry: FamilyGalleryEntry; familyName: string }) {
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
    <Link
      to={entry.href}
      className="group/tile flex w-[132px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-gold/15 bg-white/[0.03] transition-colors hover:border-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <div className="aspect-[4/5] w-full overflow-hidden bg-charcoal/60">
        {!broken ? (
          <img
            src={entry.imageUrl}
            alt={`${entry.name}${place ? `, ${place}` : ""} — ${familyName} nominee`}
            width={TILE_W}
            height={TILE_H}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            onLoad={(e) => {
              const img = e.currentTarget;
              const wide = img.naturalWidth > img.naturalHeight * 1.05;
              const small = img.naturalWidth < TILE_W || img.naturalHeight < TILE_H;
              if (wide || small) setContain(true);
            }}
            className={`h-full w-full transition-transform duration-700 group-hover/tile:scale-105 motion-reduce:transition-none motion-reduce:group-hover/tile:scale-100 ${
              contain ? "bg-white/[0.06] object-contain p-2" : "object-cover"
            }`}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/20 to-charcoal"
            aria-hidden="true"
          >
            <span className="font-serif text-xl text-gold/70">{initials}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-2">
        <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-white group-hover/tile:text-gold">
          {entry.name}
        </p>
        {place && <p className="line-clamp-1 text-[10px] text-white/45">{place}</p>}
        <p className="line-clamp-1 text-[10px] text-white/50">{entry.categoryLabel}</p>
      </div>
    </Link>
  );
}

function StripSkeleton() {
  return (
    <div className="mt-4 flex gap-3" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[220px] w-[132px] shrink-0 animate-pulse rounded-xl border border-white/10 bg-white/[0.04]"
        />
      ))}
    </div>
  );
}

export function FamilyEnablerStrip({
  familySlug,
  familyName,
  exploreHref,
}: {
  familySlug: string;
  familyName: string;
  exploreHref: string;
}) {
  const q = useFamilyBuckets();
  const entries = q.data?.[familySlug] ?? [];

  if (q.isLoading) return <StripSkeleton />;

  if (q.error || entries.length === 0) {
    return (
      <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/55">
        No verified profile published yet.
      </p>
    );
  }

  if (entries.length < MIN_STRIP_RECORDS) {
    return (
      <div className="mt-4">
        <div className="flex gap-3">
          {entries.map((e) => (
            <Tile key={e.id} entry={e} familyName={familyName} />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-white/45">
          {entries.length} verified {familyName} profile{entries.length === 1 ? "" : "s"} published
          so far.{" "}
          <Link to={exploreHref} className="text-gold hover:underline">
            Explore this pathway
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="group/strip mt-4">
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold/80">
        Enablers in this pathway
      </div>
      <StripScroller label={`${familyName} nominees`}>
        {entries.map((e) => (
          <Tile key={e.id} entry={e} familyName={familyName} />
        ))}
      </StripScroller>
    </div>
  );
}

export default FamilyEnablerStrip;
