import { useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

const TIERS = [
  {
    title: "Influencer Education Impact",
    body:
      "Verified impact, not follower count. Recognising public figures whose platforms have genuinely advanced education.",
    href: "/awards/influencers-education-impact",
    nominateHref: "/nominate/influencers-education-impact",
    nomineesHref: "/nominees?tier=influencer",
    videoId: "Hdu_qlFLfrQ",
    videoTitle: "About the Influencer Education Impact Award",
  },
  {
    title: "Platinum Recognition",
    body:
      "Institutions, research bodies, and leadership advancing education systems across the continent.",
    href: "/awards/platinum-recognition",
    nominateHref: "/nominate/platinum-recognition",
    nomineesHref: "/nominees?tier=platinum",
    videoId: "nQCXDX_X3rs",
    videoTitle: "About the Platinum Recognition Award",
  },
  {
    title: "Gold-Blue Garnet Regional Recognition",
    body:
      "Corporations, NGOs, and states enabling education across Africa's eight regions.",
    href: "/awards/gold-blue-garnet",
    nominateHref: "/nominate/gold-blue-garnet",
    nomineesHref: "/nominees?tier=blue-garnet",
    videoId: "DDREAU_bmRk",
    videoTitle: "About the Gold-Blue Garnet Regional Recognition Award",
  },
];

export function TierGridSection() {
  const [active, setActive] = useState<(typeof TIERS)[number] | null>(null);

  return (
    <section className="ed-section ed-section-ink" aria-label="Certificate of Recognition tiers">
      <div className="ed-wrap">
        <div className="ed-grid-3">
          {TIERS.map((t) => (
            <article key={t.title} className="ed-card">
              <div className="ed-card-badge">ENABLERS OF EDUCATION FOR ALL ACROSS AFRICA</div>
              <h3>
                <Link to={t.href} className="hover:underline">
                  {t.title}
                </Link>
              </h3>
              <p>{t.body}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  to={t.nominateHref}
                  className="inline-flex h-9 items-center rounded-full bg-gold px-4 text-xs font-semibold text-charcoal hover:bg-gold/90 transition-colors"
                >
                  Nominate
                </Link>
                <Link
                  to={t.nomineesHref}
                  className="inline-flex h-9 items-center rounded-full border border-gold/40 px-4 text-xs font-semibold text-gold hover:bg-gold/10 transition-colors"
                >
                  Explore Existing Nominees
                </Link>
                <button
                  type="button"
                  onClick={() => setActive(t)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-4 text-xs font-semibold text-white/80 hover:border-gold/40 hover:text-gold transition-colors"
                  aria-label={`Watch video about ${t.title}`}
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

export default TierGridSection;
