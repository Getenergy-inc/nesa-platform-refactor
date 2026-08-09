import { useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

const ICON_CATEGORIES = [
  {
    title: "Africa Education Philanthropy Icon",
    body:
      "Enablers of Education for All Across Africa who turned wealth into hope — building schools, funding thousands of scholarships, and changing entire systems.",
    href: "/awards/africa-education-icon",
    nominateHref: "/nominate/africa-education-icon",
    nomineesHref: "/nominees?tier=icon&category=philanthropy",
    videoId: "Hdu_qlFLfrQ",
    videoTitle: "About the Africa Education Philanthropy Icon",
  },
  {
    title: "Literary & New Curriculum Advocate Icon",
    body:
      "Enablers of Education for All Across Africa who reshaped learning and identity — decolonising curricula and championing African stories and indigenous knowledge.",
    href: "/awards/africa-education-icon",
    nominateHref: "/nominate/africa-education-icon",
    nomineesHref: "/nominees?tier=icon&category=literary",
    videoId: "Hdu_qlFLfrQ",
    videoTitle: "About the Literary & New Curriculum Advocate Icon",
  },
  {
    title: "Africa Technical Educator Icon",
    body:
      "Enablers of Education for All Across Africa who taught the continent to build, code, innovate and lead through technical and digital skills.",
    href: "/awards/africa-education-icon",
    nominateHref: "/nominate/africa-education-icon",
    nomineesHref: "/nominees?tier=icon&category=technical",
    videoId: "Hdu_qlFLfrQ",
    videoTitle: "About the Africa Technical Educator Icon",
  },
];

export function IconLifetimeSection() {
  const [active, setActive] = useState<(typeof ICON_CATEGORIES)[number] | null>(null);

  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-icon-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">The Africa Education Icon Award</div>
          <h2 id="ed-icon-heading" className="ed-section-title">
            Lifetime Achievement, 2006–2026
          </h2>
          <p className="ed-section-sub">
            For 20 years, quiet heroes have transformed education across our continent. This highest
            honour celebrates lifetime impact and legacy as Enablers of Education for All Across
            Africa.
          </p>
        </div>

        <div className="ed-grid-3">
          {ICON_CATEGORIES.map((c) => (
            <article key={c.title} className="ed-card">
              <div className="ed-card-badge">LIFETIME ACHIEVEMENT · 2006–2026</div>
              <h3>
                <Link to={c.href} className="hover:underline">
                  {c.title}
                </Link>
              </h3>
              <p>{c.body}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  to={c.nominateHref}
                  className="inline-flex h-9 items-center rounded-full bg-gold px-4 text-xs font-semibold text-charcoal hover:bg-gold/90 transition-colors"
                >
                  Nominate
                </Link>
                <Link
                  to={c.nomineesHref}
                  className="inline-flex h-9 items-center rounded-full border border-gold/40 px-4 text-xs font-semibold text-gold hover:bg-gold/10 transition-colors"
                >
                  Explore Existing Nominees
                </Link>
                <button
                  type="button"
                  onClick={() => setActive(c)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-4 text-xs font-semibold text-white/80 hover:border-gold/40 hover:text-gold transition-colors"
                  aria-label={`Watch video about ${c.title}`}
                >
                  <Play className="h-3.5 w-3.5" />
                  About This Award Category
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl bg-charcoal border-white/10 p-0 overflow-hidden">
          <div className="aspect-video w-full bg-black">
            {active && (
              <iframe
                key={active.videoId}
                src={`${getYouTubeEmbedUrl(active.videoId)}?autoplay=1&rel=0`}
                title={active.videoTitle}
                className="w-full h-full"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
          <div className="p-5">
            <DialogHeader>
              <DialogTitle className="text-white text-lg">{active?.videoTitle}</DialogTitle>
            </DialogHeader>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default IconLifetimeSection;
