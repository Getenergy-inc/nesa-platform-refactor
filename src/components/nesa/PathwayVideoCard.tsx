// PathwayVideoCard — cinematic, video-driven storytelling card
// for the NESA Africa landing page award pathways.
//
// UX:
// - Desktop: hover swaps the poster for a muted, captioned YouTube preview.
// - Mobile: tap-to-play opens a fullscreen lightbox with the same video.
// - Engagement CTA (Watch Stories) always opens the lightbox.
// - Primary + Secondary CTAs are real routed links for conversion.

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, X, Volume2, VolumeX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { getYouTubeEmbedUrl, getThumbnailUrl } from "@/lib/youtube";

export type PathwayCardCTA = {
  label: string;
  href: string;
};

export type PathwayVideoCardData = {
  id: string;
  icon: LucideIcon;
  accentLabel: string;
  category: string;
  headline: string;
  story: string;
  videoId: string;
  videoTitle: string;
  posterAlt: string;
  visualGradient: string;
  primaryCta: PathwayCardCTA;
  secondaryCta: PathwayCardCTA;
  engagementCtaLabel: string;
};

interface Props {
  card: PathwayVideoCardData;
  index: number;
}

export function PathwayVideoCard({ card, index }: Props) {
  const Icon = card.icon;
  const isMobile = useIsMobile();
  const [hoverPlay, setHoverPlay] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const desktopHover = !isMobile;

  // Esc closes lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightboxOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  const openLightbox = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setMuted(false);
    setLightboxOpen(true);
  }, []);

  const previewSrc = `${getYouTubeEmbedUrl(card.videoId)}?autoplay=1&mute=1&controls=0&loop=1&playsinline=1&modestbranding=1&rel=0&cc_load_policy=1&playlist=${card.videoId}`;
  const fullSrc = `${getYouTubeEmbedUrl(card.videoId)}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&rel=0&cc_load_policy=1&modestbranding=1`;

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        className="h-full"
      >
        <article
          onMouseEnter={() => desktopHover && setHoverPlay(true)}
          onMouseLeave={() => desktopHover && setHoverPlay(false)}
          className="group relative h-full overflow-hidden rounded-3xl ring-1 ring-gold/25 hover:ring-gold/70 shadow-[0_10px_50px_-15px_hsl(var(--gold)/0.25)] hover:shadow-[0_20px_60px_-15px_hsl(var(--gold)/0.55)] transition-all duration-500 hover:-translate-y-2 bg-charcoal flex flex-col"
        >
          {/* ───── Cinematic video / poster area ───── */}
          <div className="relative aspect-video overflow-hidden bg-black">
            {/* Poster — always rendered as instant paint + a11y target */}
            <img
              src={getThumbnailUrl(card.videoId, "maxres")}
              alt={card.posterAlt}
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getThumbnailUrl(card.videoId, "high");
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                hoverPlay ? "opacity-0 scale-105" : "opacity-100 group-hover:scale-105"
              }`}
            />

            {/* Desktop hover preview iframe — only mounted while hovering */}
            {desktopHover && hoverPlay && (
              <iframe
                key={`preview-${card.id}`}
                src={previewSrc}
                title={`${card.videoTitle} — silent preview`}
                allow="autoplay; encrypted-media; picture-in-picture"
                className="absolute inset-0 h-full w-full pointer-events-none"
                loading="lazy"
              />
            )}

            {/* Brand tint overlays */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.visualGradient} mix-blend-multiply opacity-60 transition-opacity duration-500 ${hoverPlay ? "opacity-30" : ""}`} />
            <div className={`absolute inset-0 bg-charcoal/20 transition-opacity ${hoverPlay ? "opacity-0" : "opacity-100"}`} />

            {/* Accent label */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-2.5 py-1 rounded-full bg-charcoal/75 backdrop-blur-md border border-gold/30 text-[10px] font-semibold text-gold uppercase tracking-wider">
                {card.accentLabel}
              </span>
            </div>

            {/* Play button — opens lightbox on click (mobile + desktop) */}
            <button
              type="button"
              onClick={openLightbox}
              aria-label={`Play ${card.videoTitle}`}
              className="absolute inset-0 z-10 flex items-center justify-center focus:outline-none"
            >
              <span
                className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gold/95 group-hover:bg-gold flex items-center justify-center shadow-[0_0_40px_-5px_hsl(var(--gold)/0.7)] transition-all ${
                  hoverPlay ? "opacity-0 scale-75" : "opacity-100 group-hover:scale-110"
                }`}
              >
                <Play className="h-7 w-7 sm:h-8 sm:w-8 text-charcoal ml-1" fill="currentColor" />
              </span>
            </button>

            {/* Bottom fade into content */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-charcoal to-transparent pointer-events-none" />
          </div>

          {/* ───── Editorial content ───── */}
          <div className="relative p-6 sm:p-7 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-gold to-gold-dark shadow-lg shrink-0">
                <Icon className="h-5 w-5 text-charcoal" strokeWidth={2} />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-[10px] font-bold uppercase tracking-widest">
                {card.category}
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">
              {card.headline}
            </h3>

            <p className="text-white/75 text-sm sm:text-[15px] leading-relaxed mb-6 flex-1">
              {card.story}
            </p>

            {/* CTA stack — primary, secondary, engagement */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 mt-auto">
              <Button
                asChild
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2 px-5 shadow-[0_0_24px_-8px_hsl(var(--gold)/0.6)]"
              >
                <Link to={card.primaryCta.href}>
                  {card.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-5 bg-transparent"
              >
                <Link to={card.secondaryCta.href}>{card.secondaryCta.label}</Link>
              </Button>
              <button
                type="button"
                onClick={openLightbox}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white/80 hover:text-gold hover:bg-white/5 text-sm font-medium transition-colors"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                {card.engagementCtaLabel}
              </button>
            </div>
          </div>
        </article>
      </motion.div>

      {/* ───── Lightbox ───── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={card.videoTitle}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-gold/30 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-12 right-0 flex gap-2 z-10">
              <button
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute" : "Mute"}
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setLightboxOpen(false)}
                aria-label="Close video"
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                key={`full-${card.id}-${muted ? "m" : "u"}`}
                src={fullSrc}
                title={card.videoTitle}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PathwayVideoCard;
