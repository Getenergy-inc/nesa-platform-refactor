// PathwayVideoCard — cinematic two-half storytelling card for NESA Africa.
//
// TOP HALF: motion-graphic storytelling — animated gradients, floating action
// words, rotating phrases, glowing typography. No real video.
// BOTTOM HALF: cinematic "documentary coming soon" video placeholder — ready
// to swap in real YouTube embeds later via `videoId`.
//
// Honors prefers-reduced-motion. GPU-friendly transforms only.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, X, Clapperboard, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";


// Feature flag: enable real YouTube embeds. Disabled by default so cards keep
// their cinematic placeholder. Set VITE_ENABLE_YT_EMBEDS=true to opt in.
// A card only embeds when the flag is on AND it has a videoId.
const ytEmbedsEnabled =
  String(import.meta.env.VITE_ENABLE_YT_EMBEDS ?? "").toLowerCase() === "true";

export type PathwayCardCTA = { label: string; href: string };

export type PathwayVideoCardData = {
  id: string;
  icon: LucideIcon;
  accentLabel: string;
  category: string;
  headline: string;
  story: string;
  /** Reserved for future YouTube embed. Empty = placeholder only. */
  videoId?: string;
  videoTitle: string;
  posterAlt: string;
  /** Optional poster artwork for the top half (overrides pure-gradient look). */
  posterImage?: string;
  visualGradient: string;
  /** Floating motion-graphic keywords (6–12 recommended). */
  actionWords?: string[];
  /** Rotating cinematic phrases shown one at a time. */
  animatedPhrases?: string[];
  /** Short teaser line shown in the bottom video placeholder. */
  previewSummary?: string;
  primaryCta: PathwayCardCTA;
  secondaryCta: PathwayCardCTA;
  /** Optional tertiary CTA (e.g. "Explore Nominees"). */
  tertiaryCta?: PathwayCardCTA;
  /** Watch story preview (opens lightbox). */
  engagementCtaLabel: string;
};

interface Props {
  card: PathwayVideoCardData;
  index: number;
}

// Deterministic pseudo-random layout for floating words (stable per card)
function seededPositions(seed: string, count: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return (h & 0xffff) / 0xffff;
  };
  return Array.from({ length: count }, () => ({
    top: 8 + rand() * 78, // %
    left: 4 + rand() * 88, // %
    delay: rand() * 4,
    duration: 6 + rand() * 6,
    size: 0.72 + rand() * 0.55, // rem-ish scalar
    drift: -10 + rand() * 20,
  }));
}

export function PathwayVideoCard({ card, index }: Props) {
  const Icon = card.icon;
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);

  const phrases = card.animatedPhrases ?? [];
  const words = card.actionWords ?? [];
  const positions = useMemo(() => seededPositions(card.id, words.length), [card.id, words.length]);

  // Rotate cinematic phrases
  useEffect(() => {
    if (reduce || phrases.length < 2) return;
    const t = setInterval(() => setPhraseIdx((i) => (i + 1) % phrases.length), 3600);
    return () => clearInterval(t);
  }, [phrases.length, reduce]);

  // Lightbox: Esc + body scroll lock
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
    setLightboxOpen(true);
  }, []);

  const motionIntensity = reduce || isMobile ? 0.5 : 1;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        className="h-full"
      >
        <article className="group relative h-full overflow-hidden rounded-3xl ring-1 ring-gold/25 hover:ring-gold/70 shadow-[0_10px_50px_-15px_hsl(var(--gold)/0.25)] hover:shadow-[0_20px_60px_-15px_hsl(var(--gold)/0.55)] transition-all duration-500 hover:-translate-y-2 bg-charcoal flex flex-col">

          {/* ═══════════ TOP HALF — Cinematic motion-graphic storytelling ═══════════ */}
          <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
            {/* Poster artwork (if provided) */}
            {card.posterImage && (
              <img
                src={card.posterImage}
                alt={card.posterAlt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {/* Layered animated gradient — softened when a poster image is present */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.visualGradient} ${card.posterImage ? "opacity-40 mix-blend-multiply" : ""}`}
            />
            <motion.div
              aria-hidden
              className="absolute inset-0 opacity-70 mix-blend-screen"
              style={{
                background:
                  "radial-gradient(60% 60% at 20% 30%, hsl(var(--gold)/0.35), transparent 60%), radial-gradient(50% 50% at 80% 70%, hsl(var(--gold)/0.18), transparent 60%)",
              }}
              animate={reduce ? undefined : { scale: [1, 1.08, 1], rotate: [0, 4, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Animated grain / sheen sweep */}
            {!reduce && (
              <motion.div
                aria-hidden
                className="absolute -inset-x-1/3 inset-y-0 opacity-25"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 30%, hsl(var(--gold)/0.35) 50%, transparent 70%)",
                }}
                animate={{ x: ["-30%", "30%"] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Floating particles */}
            {!reduce && (
              <div className="absolute inset-0 pointer-events-none" aria-hidden>
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-gold/70 shadow-[0_0_8px_hsl(var(--gold)/0.8)]"
                    style={{
                      top: `${(i * 53) % 100}%`,
                      left: `${(i * 37) % 100}%`,
                    }}
                    animate={{
                      y: [0, -20 * motionIntensity, 0],
                      opacity: [0.2, 0.9, 0.2],
                    }}
                    transition={{
                      duration: 5 + (i % 5),
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Floating action words */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              {words.map((w, i) => {
                const p = positions[i];
                if (!p) return null;
                return (
                  <motion.span
                    key={`${card.id}-w-${i}`}
                    className="absolute font-display font-semibold text-white/30 whitespace-nowrap select-none"
                    style={{
                      top: `${p.top}%`,
                      left: `${p.left}%`,
                      fontSize: `${p.size}rem`,
                      textShadow: "0 0 18px hsl(var(--gold)/0.35)",
                    }}
                    animate={
                      reduce
                        ? undefined
                        : {
                            y: [0, p.drift * motionIntensity, 0],
                            opacity: [0.15, 0.55, 0.15],
                          }
                    }
                    transition={{
                      duration: p.duration,
                      delay: p.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {w}
                  </motion.span>
                );
              })}
            </div>

            {/* Vignette + bottom fade */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--charcoal)/0.85)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent" />

            {/* Accent label */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-charcoal/75 backdrop-blur-md border border-gold/40 text-[10px] font-semibold text-gold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                {card.accentLabel}
              </span>
            </div>

            {/* Category chip */}
            <div className="absolute top-4 right-4 z-10">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark shadow-lg">
                <Icon className="h-5 w-5 text-charcoal" strokeWidth={2.2} />
              </div>
            </div>

            {/* Rotating cinematic phrase */}
            {phrases.length > 0 && (
              <div className="absolute inset-x-0 bottom-6 z-10 px-6 text-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={phraseIdx}
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                    transition={{ duration: 0.7 }}
                    className="font-display text-base sm:text-lg md:text-xl text-white drop-shadow-[0_2px_20px_hsl(var(--gold)/0.55)]"
                  >
                    <span className="bg-gradient-to-r from-gold via-white to-gold bg-clip-text text-transparent">
                      “{phrases[phraseIdx]}”
                    </span>
                  </motion.p>
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ═══════════ EDITORIAL BODY ═══════════ */}
          <div className="relative px-6 sm:px-7 pt-5 sm:pt-6">
            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-3">
              {card.category}
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">
              {card.headline}
            </h3>
            <p className="text-white/75 text-sm sm:text-[15px] leading-relaxed mb-5">
              {card.story}
            </p>
          </div>

          {/* ═══════════ BOTTOM HALF — Cinematic video placeholder ═══════════ */}
          <div className="px-6 sm:px-7 pb-6 sm:pb-7">
            <button
              type="button"
              onClick={openLightbox}
              aria-label={`Preview ${card.videoTitle}`}
              className="group/video relative block w-full aspect-video rounded-2xl overflow-hidden border border-gold/25 hover:border-gold/60 transition-all bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {/* Cinematic placeholder background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.visualGradient} opacity-80`} />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 80% at 50% 60%, transparent, hsl(var(--charcoal)/0.85))",
                }}
              />
              {/* Scanning sheen */}
              {!reduce && (
                <motion.div
                  aria-hidden
                  className="absolute -inset-x-1/4 inset-y-0 opacity-20"
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 40%, hsl(var(--gold)/0.6) 50%, transparent 60%)",
                  }}
                  animate={{ x: ["-25%", "25%"] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {/* Top-left badge */}
              <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-charcoal/80 backdrop-blur-md border border-gold/30 text-[10px] font-bold uppercase tracking-wider text-gold">
                <Clapperboard className="h-3 w-3" />
                Documentary
              </div>

              {/* Center play button */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                <motion.span
                  className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gold flex items-center justify-center shadow-[0_0_40px_-4px_hsl(var(--gold)/0.85)]"
                  animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="absolute inset-0 rounded-full bg-gold/40 animate-ping" />
                  <Play className="relative h-6 w-6 text-charcoal ml-0.5" fill="currentColor" />
                </motion.span>
                <p className="mt-3 font-display text-sm sm:text-base text-white font-semibold">
                  {card.videoTitle}
                </p>
                {card.previewSummary && (
                  <p className="mt-1 text-[11px] sm:text-xs text-white/70 max-w-xs line-clamp-2">
                    {card.previewSummary}
                  </p>
                )}
              </div>

              {/* Bottom progress shimmer */}
              {!reduce && (
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent"
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}
            </button>
          </div>

          {/* ═══════════ CTA STACK ═══════════ */}
          <div className="px-6 sm:px-7 pb-7 mt-auto flex flex-col sm:flex-row sm:flex-wrap gap-2.5">
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
            {card.tertiaryCta && (
              <Button
                asChild
                variant="outline"
                className="border-white/25 text-white hover:bg-white/10 hover:text-gold rounded-full px-5 bg-transparent gap-2"
              >
                <Link to={card.tertiaryCta.href}>
                  {card.tertiaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <button
              type="button"
              onClick={openLightbox}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white/80 hover:text-gold hover:bg-white/5 text-sm font-medium transition-colors"
            >
              <Play className="h-4 w-4" fill="currentColor" />
              {card.engagementCtaLabel}
            </button>
          </div>
        </article>
      </motion.div>

      {/* ═══════════ Lightbox — coming-soon documentary teaser ═══════════ */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={card.videoTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-gold/30 shadow-2xl bg-charcoal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative aspect-video">
                {ytEmbedsEnabled && card.videoId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${card.videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={card.videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <>
                <div className={`absolute inset-0 bg-gradient-to-br ${card.visualGradient}`} />
                {!reduce && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 opacity-60 mix-blend-screen"
                    style={{
                      background:
                        "radial-gradient(60% 60% at 30% 40%, hsl(var(--gold)/0.4), transparent 60%), radial-gradient(50% 50% at 70% 70%, hsl(var(--gold)/0.25), transparent 60%)",
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--charcoal)/0.9))]" />

                {/* Floating words inside lightbox */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden>
                  {words.slice(0, 10).map((w, i) => (
                    <motion.span
                      key={i}
                      className="absolute font-display font-semibold text-white/25 whitespace-nowrap"
                      style={{ top: `${(i * 47) % 90 + 5}%`, left: `${(i * 31) % 88 + 4}%`, fontSize: "1rem" }}
                      animate={reduce ? undefined : { y: [0, -14, 0], opacity: [0.1, 0.5, 0.1] }}
                      transition={{ duration: 7 + (i % 4), repeat: Infinity, delay: i * 0.25 }}
                    >
                      {w}
                    </motion.span>
                  ))}
                </div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal/70 border border-gold/40 mb-5">
                    <Clapperboard className="h-3.5 w-3.5 text-gold" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gold">
                      Documentary Story
                    </span>
                  </div>
                  <h4 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                    {card.videoTitle}
                  </h4>
                  {card.previewSummary && (
                    <p className="text-white/80 text-sm sm:text-base max-w-xl mb-6">
                      {card.previewSummary}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <Button asChild className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6">
                      <Link to={card.primaryCta.href}>{card.primaryCta.label}</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 rounded-full px-6 bg-transparent">
                      <Link to={card.secondaryCta.href}>{card.secondaryCta.label}</Link>
                    </Button>
                  </div>
                </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PathwayVideoCard;
