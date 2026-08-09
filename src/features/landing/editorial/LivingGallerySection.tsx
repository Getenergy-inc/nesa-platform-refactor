// Homepage — "Meet Africa's Education Enablers" living gallery.
//
// Every card is a real record from the same `public_nominees` source the
// /nominees directory reads. Nothing here is invented. When fewer than
// LIVING_GALLERY_MIN_RECORDS renderable records exist, we render the
// Africa Education Icon + Six Recognition Pathways cards instead of an
// awkward sparse carousel.

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import {
  useLivingGalleryNominees,
  LIVING_GALLERY_MIN_RECORDS,
  type GalleryNominee,
} from "@/hooks/useLivingGallery";
import { RECOGNITION_FAMILIES, BRAND } from "@/config/brandHierarchy";

function usePrefersReducedMotion() {
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

function GalleryCard({ n }: { n: GalleryNominee }) {
  const place = [n.country, n.region].filter(Boolean).join(" · ");
  const [broken, setBroken] = useState(false);
  const initials = n.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <article
      className="group relative flex w-[78vw] max-w-[320px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.03] transition-colors hover:border-gold/50 focus-within:border-gold sm:w-[46vw] lg:w-[280px]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal/60">
        {n.imageUrl && !broken ? (
          <img
            src={n.imageUrl}
            alt={`${n.name}${place ? `, ${place}` : ""}`}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 280px"
            className={`h-full w-full transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
              n.imageKind === "logo" ? "object-contain p-6" : "object-cover"
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
        {n.categoryLabel && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
            {n.categoryLabel}
          </p>
        )}
        <h3 className="font-serif text-base leading-snug text-white line-clamp-2">{n.name}</h3>
        {place && (
          <p className="inline-flex items-center gap-1 text-xs text-white/60">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {place}
          </p>
        )}
        {n.impact && <p className="text-xs leading-relaxed text-white/70 line-clamp-3">{n.impact}</p>}
        <Link
          to={n.href}
          className="mt-auto inline-flex w-fit items-center pt-2 text-xs font-semibold text-gold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          View Profile →
        </Link>
      </div>
    </article>
  );
}

function PathwayFallback() {
  return (
    <div className="ed-grid-3">
      <article className="ed-card">
        <div className="ed-card-badge">FLAGSHIP · LIFETIME</div>
        <h3>{BRAND.flagship}</h3>
        <p>
          Africa&apos;s flagship lifetime honour for individuals whose lifelong contribution has
          helped advance Education for All across Africa.
        </p>
        <Link to="/awards/africa-education-icon" className="ed-btn-ghost mt-4 inline-flex">
          Explore the Africa Education Icon Award →
        </Link>
      </article>
      {RECOGNITION_FAMILIES.map((f) => (
        <article key={f.slug} className="ed-card">
          <h3>{f.name}</h3>
          <p>{f.lede}</p>
          <Link to={`/recognition/${f.slug}`} className="ed-btn-ghost mt-4 inline-flex">
            Explore {f.name} →
          </Link>
        </article>
      ))}
    </div>
  );
}

export function LivingGallerySection() {
  const { nominees, loading, hasEnough } = useLivingGalleryNominees();
  const reducedMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  // Auto-advance: gentle page-by-page scroll. Fully disabled under
  // prefers-reduced-motion, and paused on hover / focus / pointer interaction.
  useEffect(() => {
    if (reducedMotion || paused || !hasEnough) return;
    const el = trackRef.current;
    if (!el) return;
    const id = window.setInterval(() => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 4) return;
      const step = Math.max(el.clientWidth * 0.8, 260);
      const next = el.scrollLeft + step >= max - 4 ? 0 : el.scrollLeft + step;
      el.scrollTo({ left: next, behavior: "smooth" });
    }, 4500);
    return () => window.clearInterval(id);
  }, [reducedMotion, paused, hasEnough]);

  return (
    <section className="ed-section" aria-labelledby="ed-living-gallery-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Africa&apos;s Education Impact Directory</div>
          <h2 id="ed-living-gallery-heading" className="ed-section-title">
            Meet Africa&apos;s Education Enablers
          </h2>
          <p className="ed-section-sub">
            Discover the people and organisations already making an impact across Africa and
            beyond.
          </p>
        </div>

        {loading ? (
          <div
            className="flex gap-4 overflow-hidden"
            aria-busy="true"
            aria-label="Loading Education Enablers"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] w-[78vw] max-w-[320px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] sm:w-[46vw] lg:w-[280px]"
              />
            ))}
          </div>
        ) : hasEnough ? (
          <>
            <div
              ref={trackRef}
              role="group"
              aria-label="Education Enablers gallery — scroll or swipe to browse"
              tabIndex={0}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
              }}
              onPointerDown={() => setPaused(true)}
              onTouchStart={() => setPaused(true)}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              {nominees.map((n) => (
                <GalleryCard key={n.id} n={n} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link to="/nominees" className="ed-btn-ghost">
                Explore Existing Nominees →
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mb-8 text-center text-sm text-white/60">
              Verified Education Enabler profiles are published as nominations are reviewed
              {nominees.length > 0
                ? ` (${nominees.length} of ${LIVING_GALLERY_MIN_RECORDS} needed to open the gallery)`
                : ""}
              . In the meantime, explore how recognition works.
            </p>
            <PathwayFallback />
          </>
        )}
      </div>
    </section>
  );
}

export default LivingGallerySection;
