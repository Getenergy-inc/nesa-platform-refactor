// Homepage flagship — Africa Education Icon Award (Lifetime Achievement).
//
// Copy comes from ICON_AWARD_SECTION / ICON_PATHWAYS in brandHierarchy.ts.
// Nominee photo strips read the same Icon nominee data layer the
// /nominees/africa-education-icon-award/[pathway] pages use (`bySubcategory`),
// scoped per pathway. Motion is the shared living-gallery strip pattern.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { ICON_AWARD_SECTION, ICON_PATHWAYS } from "@/config/brandHierarchy";
import { bySubcategory, type IconSubcategorySlug, type IconNominee } from "@/data/iconAward";
import { useStripAutoScroll } from "./useStripAutoScroll";

/** Below this many real records we show the card without a strip. */
const MIN_STRIP_RECORDS = 4;
const STRIP_LIMIT = 12;

const VIDEO_ID = "Hdu_qlFLfrQ";

function NomineeStrip({ pathway, nominees }: { pathway: string; nominees: IconNominee[] }) {
  const { ref, pauseHandlers } = useStripAutoScroll<HTMLDivElement>(true, 5200);

  return (
    <div
      ref={ref}
      {...pauseHandlers}
      role="group"
      tabIndex={0}
      aria-label={`${pathway} nominees — scroll or swipe to browse`}
      className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      {nominees.map((n) => (
        <Link
          key={n.id}
          to={`/nominees/africa-education-icon-award/${n.award_subcategory_slug}/${n.classification_slug}/${n.slug}`}
          className="group block w-[132px] shrink-0 snap-start overflow-hidden rounded-xl border border-gold/15 bg-white/[0.03] transition-colors hover:border-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <div className="aspect-[4/5] w-full overflow-hidden bg-charcoal">
            <img
              src={n.image_url}
              alt={n.name}
              width={132}
              height={165}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          <div className="p-2">
            <div className="line-clamp-2 text-[11px] font-semibold leading-tight text-white group-hover:text-gold">
              {n.name}
            </div>
            {n.country && (
              <div className="mt-0.5 line-clamp-1 text-[10px] text-white/55">{n.country}</div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export function IconLifetimeSection() {
  const [videoOpen, setVideoOpen] = useState<string | null>(null);

  const pathways = useMemo(
    () =>
      ICON_PATHWAYS.map((p) => ({
        ...p,
        nominees: bySubcategory(p.slug as IconSubcategorySlug)
          .filter((n) => !!n.image_url)
          .slice(0, STRIP_LIMIT),
      })),
    [],
  );

  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-icon-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">{ICON_AWARD_SECTION.eyebrow}</div>
          <h2 id="ed-icon-heading" className="ed-section-title">
            {ICON_AWARD_SECTION.title}
          </h2>
          <p className="ed-section-sub">{ICON_AWARD_SECTION.intro}</p>
        </div>

        <div className="ed-grid-3">
          {pathways.map((c) => (
            <article key={c.slug} className="ed-card">
              <div className="ed-card-badge">{ICON_AWARD_SECTION.cardBadge}</div>
              <h3>
                <Link to={c.awardHref} className="hover:underline">
                  {c.name}
                </Link>
              </h3>
              <p>{c.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  to={c.nominateHref}
                  className="inline-flex h-9 items-center rounded-full bg-gold px-4 text-xs font-semibold text-charcoal transition-colors hover:bg-gold/90"
                >
                  Nominate
                </Link>
                <Link
                  to={c.nomineesHref}
                  className="inline-flex h-9 items-center rounded-full border border-gold/40 px-4 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
                >
                  Explore Existing Nominees
                </Link>
                <button
                  type="button"
                  onClick={() => setVideoOpen(c.name)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-4 text-xs font-semibold text-white/80 transition-colors hover:border-gold/40 hover:text-gold"
                  aria-label={`Watch video about ${c.name}`}
                >
                  <Play className="h-3.5 w-3.5" />
                  About This Award Category
                </button>
              </div>

              {c.nominees.length >= MIN_STRIP_RECORDS ? (
                <NomineeStrip pathway={c.name} nominees={c.nominees} />
              ) : (
                <p className="mt-4 text-xs text-white/50">
                  Nominees will appear here as they&apos;re added.
                </p>
              )}
            </article>
          ))}
        </div>
      </div>

      <Dialog open={!!videoOpen} onOpenChange={(o) => !o && setVideoOpen(null)}>
        <DialogContent className="max-w-3xl overflow-hidden border-white/10 bg-charcoal p-0">
          <div className="aspect-video w-full bg-black">
            {videoOpen && (
              <iframe
                src={`${getYouTubeEmbedUrl(VIDEO_ID)}?autoplay=1&rel=0`}
                title={`About the ${videoOpen}`}
                className="h-full w-full"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
          <div className="p-5">
            <DialogHeader>
              <DialogTitle className="text-lg text-white">
                {videoOpen ? `About the ${videoOpen}` : ""}
              </DialogTitle>
            </DialogHeader>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default IconLifetimeSection;
