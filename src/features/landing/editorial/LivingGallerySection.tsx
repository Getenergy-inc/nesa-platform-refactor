// Homepage — "Meet Africa's Education Enablers" living gallery.
//
// Source of truth: the Africa Education Icon Award nominee dataset
// (`bySubcategory` from @/data/iconAward), merged across ALL THREE Icon
// pathways — Education Philanthropy, Literary & New Curriculum Advocate and
// Technical Educator. Same data layer, same local high-resolution portraits
// and the same image-loading discipline as the Icon pathway strips, so the
// cards render at identical sharpness.
//
// Nothing here is invented: the nominee total shown is the real count of
// records in the dataset. When fewer than LIVING_GALLERY_MIN_RECORDS
// renderable records exist we render the pathway cards instead.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { LIVING_GALLERY_MIN_RECORDS } from "@/hooks/useLivingGallery";
import { RECOGNITION_FAMILIES, BRAND, ICON_AWARD_SECTION, ICON_PATHWAYS } from "@/config/brandHierarchy";
import { PROGRAMME_END_LABEL } from "@/config/programme";
import { bySubcategory, type IconSubcategorySlug, type IconNominee } from "@/data/iconAward";
import { useStripAutoScroll } from "./useStripAutoScroll";

/** Cap on cards rendered in the strip (the pool itself is much larger). */
const GALLERY_CARD_LIMIT = 36;

/** Rendered card box — width/height attributes match the CSS box exactly. */
const CARD_W = 280;
const CARD_H = 350; // 4:5

interface GalleryEntry {
  nominee: IconNominee;
  pathwayName: string;
  href: string;
}

function GalleryCard({ entry }: { entry: GalleryEntry }) {
  const n = entry.nominee;
  const place = [n.country, n.region].filter(Boolean).join(" · ");
  const [broken, setBroken] = useState(false);
  const initials = n.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="group relative flex w-[78vw] max-w-[320px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.03] transition-colors hover:border-gold/50 focus-within:border-gold sm:w-[46vw] lg:w-[280px]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal/60">
        {n.image_url && !broken ? (
          <img
            src={n.image_url}
            alt={`${n.name}${place ? `, ${place}` : ""}`}
            width={CARD_W}
            height={CARD_H}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
          {entry.pathwayName}
        </p>
        <h3 className="font-serif text-base leading-snug text-white line-clamp-2">{n.name}</h3>
        {place && (
          <p className="inline-flex items-center gap-1 text-xs text-white/60">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {place}
          </p>
        )}
        {n.impact_summary && (
          <p className="text-xs leading-relaxed text-white/70 line-clamp-3">{n.impact_summary}</p>
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

/** Merge all three Icon pathways, interleaved so the strip mixes pathways. */
function useIconGalleryPool() {
  return useMemo(() => {
    const perPathway = ICON_PATHWAYS.map((p) => {
      const all = bySubcategory(p.slug as IconSubcategorySlug);
      return {
        name: p.name,
        all,
        // Only records with a real portrait can be rendered as cards.
        list: all.filter((n) => !!n.image_url && !/placeholder/i.test(n.image_url)),
      };
    });

    // Real nominee total across all three pathways (not just those with photos).
    const total = perPathway.reduce((sum, p) => sum + p.all.length, 0);

    const entries: GalleryEntry[] = [];
    const longest = Math.max(0, ...perPathway.map((p) => p.list.length));
    for (let i = 0; i < longest && entries.length < GALLERY_CARD_LIMIT; i++) {
      for (const p of perPathway) {
        const n = p.list[i];
        if (!n) continue;
        entries.push({
          nominee: n,
          pathwayName: p.name,
          href: `/nominees/africa-education-icon-award/${n.award_subcategory_slug}/${n.classification_slug}/${n.slug}`,
        });
        if (entries.length >= GALLERY_CARD_LIMIT) break;
      }
    }

    return { entries, total };
  }, []);
}

export function LivingGallerySection() {
  const { entries, total } = useIconGalleryPool();
  const hasEnough = entries.length >= LIVING_GALLERY_MIN_RECORDS;
  // Shared strip motion (auto-advance, reduced-motion + pause-on-interaction).
  const { ref: trackRef, pauseHandlers } = useStripAutoScroll<HTMLDivElement>(hasEnough);

  const { gallery, tagline } = ICON_AWARD_SECTION;
  const lede = gallery.lede.replace("{count}", String(total));
  const invite = gallery.invite.replace("{date}", PROGRAMME_END_LABEL);

  return (
    <section className="ed-section" aria-labelledby="ed-living-gallery-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">{gallery.eyebrow}</div>
          <h2 id="ed-living-gallery-heading" className="ed-section-title">
            {gallery.title}
          </h2>
          <p className="ed-section-sub">{lede}</p>
          <p className="ed-section-sub">{invite}</p>
        </div>

        {hasEnough ? (
          <>
            <div
              ref={trackRef}
              role="group"
              aria-label="Africa Education Icon nominees — scroll or swipe to browse"
              tabIndex={0}
              {...pauseHandlers}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              {entries.map((e) => (
                <GalleryCard key={e.nominee.id} entry={e} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/nominees/africa-education-icon-award" className="ed-btn-ghost">
                Explore Existing Nominees →
              </Link>
              <Link to={ICON_AWARD_SECTION.awardHref} className="ed-btn-ghost">
                {tagline} →
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mb-8 text-center text-sm text-white/60">
              Verified Education Enabler profiles are published as nominations are reviewed
              {entries.length > 0
                ? ` (${entries.length} of ${LIVING_GALLERY_MIN_RECORDS} needed to open the gallery)`
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
