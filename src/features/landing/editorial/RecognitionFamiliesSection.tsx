// Homepage — "Meet Africa's Education Enablers".
//
// One Continental Mission. Six Recognition Pathways.
//
// This is the Education Impact Certificate counterpart to the Africa Education
// Icon Award flagship section (IconLifetimeSection). It deliberately reuses the
// same editorial card template (`ed-card` / `ed-grid-3`), the same CTA pattern
// (Nominate · Explore Existing Nominees · Explore pathway →) and the same
// nominee data layer — the published `public_nominees` view, read through
// `useFamilyFeaturedProfiles`, strictly scoped per recognition family.
//
// Nothing is invented: a pathway with no eligible published record shows an
// honest empty state rather than a substituted profile from another family.

import { useState } from "react";
import { Link } from "react-router-dom";
import { RECOGNITION_FAMILIES, BRAND } from "@/config/brandHierarchy";
import {
  useFamilyFeaturedProfiles,
  type FamilyGalleryEntry,
} from "@/hooks/useFamilyGallery";
import { FamilyLivingGalleryStrip } from "./FamilyLivingGalleryStrip";

/** Featured thumbnail box — width/height attributes match the CSS box. */
const THUMB_W = 96;
const THUMB_H = 120; // 4:5

function FeaturedSkeleton() {
  return (
    <div className="mt-4 flex animate-pulse items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="h-[120px] w-[96px] shrink-0 rounded-lg bg-white/[0.06]" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-white/[0.08]" />
        <div className="h-2.5 w-1/2 rounded bg-white/[0.06]" />
        <div className="h-2.5 w-4/5 rounded bg-white/[0.05]" />
      </div>
    </div>
  );
}

function FeaturedEmpty() {
  return (
    <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/55">
      No verified profile published yet.
    </p>
  );
}

function FeaturedProfile({ entry, familyName }: { entry: FamilyGalleryEntry; familyName: string }) {
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
      className="group mt-4 flex items-center gap-3 rounded-xl border border-gold/15 bg-white/[0.03] p-3 transition-colors hover:border-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <div className="h-[120px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-charcoal/60">
        {!broken ? (
          <img
            src={entry.imageUrl}
            alt={`${entry.name}${place ? `, ${place}` : ""} — ${familyName} nominee`}
            width={THUMB_W}
            height={THUMB_H}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            onLoad={(e) => {
              const img = e.currentTarget;
              const wide = img.naturalWidth > img.naturalHeight * 1.05;
              if (wide) setContain(true);
            }}
            className={`h-full w-full transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
              contain ? "bg-white/[0.06] object-contain p-2" : "object-cover"
            }`}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/20 to-charcoal"
            aria-hidden="true"
          >
            <span className="font-serif text-2xl text-gold/70">{initials}</span>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold/80">
          Featured Enabler
        </div>
        <div className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-white group-hover:text-gold">
          {entry.name}
        </div>
        {entry.title && (
          <div className="mt-0.5 line-clamp-2 text-[11px] text-white/60">{entry.title}</div>
        )}
        {place && <div className="mt-0.5 line-clamp-1 text-[11px] text-white/45">{place}</div>}
        <div className="mt-1 line-clamp-1 text-[11px] text-white/50">{entry.categoryLabel}</div>
      </div>
    </Link>
  );
}

export function RecognitionFamiliesSection() {
  const { featured, loading, error } = useFamilyFeaturedProfiles();

  if (error) {
    // Visitors never see the technical error; developers do.
    console.error("[RecognitionFamiliesSection] featured profiles failed:", error);
  }

  return (
    <section className="ed-section" aria-labelledby="ed-families-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Education Impact Certificates</div>
          <h2 id="ed-families-heading" className="ed-section-title">
            Meet Africa&apos;s Education Enablers
          </h2>
          <p className="ed-section-sub">
            <strong className="text-white">
              One Continental Mission. Six Recognition Pathways.
            </strong>
          </p>
          <p className="ed-section-sub">
            The {BRAND.flagship} is NESA-Africa&apos;s flagship lifetime recognition, supported by
            six Certificates of Recognition celebrating different forms of education-enabling
            impact.
          </p>
        </div>

        <div className="mb-3 text-center">
          <Link to="/recognition/certificates" className="ed-btn-ghost">
            Education Impact Certificates — one entry point
          </Link>
        </div>
        <p className="mb-10 text-center text-xs text-white/50">
          Enabler profiles are published as nominations are reviewed.
        </p>

        <FamilyLivingGalleryStrip />

        <div className="ed-grid-3">
          {RECOGNITION_FAMILIES.map((f) => {
            const entry = error ? null : featured[f.slug];
            return (
              <article key={f.slug} className="ed-card">
                <div className="ed-card-badge">Recognition Pathway</div>
                <h3>
                  <Link to={`/recognition/${f.slug}`} className="hover:underline">
                    {f.name}
                  </Link>
                </h3>
                <p>{f.lede}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    to={`/nominate?family=${f.slug}`}
                    className="inline-flex h-9 items-center rounded-full bg-gold px-4 text-xs font-semibold text-charcoal transition-colors hover:bg-gold/90"
                  >
                    Nominate
                  </Link>
                  <Link
                    to={`/nominees?family=${f.slug}`}
                    className="inline-flex h-9 items-center rounded-full border border-gold/40 px-4 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
                  >
                    Explore Existing Nominees
                  </Link>
                  <Link
                    to={`/recognition/${f.slug}`}
                    className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-xs font-semibold text-white/80 transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    Explore {f.name} →
                  </Link>
                </div>

                {loading ? (
                  <FeaturedSkeleton />
                ) : entry ? (
                  <FeaturedProfile entry={entry} familyName={f.name} />
                ) : (
                  <FeaturedEmpty />
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RecognitionFamiliesSection;
