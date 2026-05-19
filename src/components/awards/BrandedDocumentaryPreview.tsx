import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import iconImg from "@/assets/pathway-cards/icon.jpg";
import csrImg from "@/assets/pathway-cards/csr.jpg";
import influencerImg from "@/assets/pathway-cards/influencer.jpg";
import grantsImg from "@/assets/pathway-cards/grants.jpg";

import type { BrandedCategoryTheme } from "./BrandedCategoryHero";

type ThemeTokens = {
  title: string;
  subtitle: string;
  border: string;
  glow: string;
  ring: string;
  ctaBg: string;
  ctaText: string;
  playRing: string;
  playFill: string;
  image: string;
};

const THEMES: Record<BrandedCategoryTheme, ThemeTokens> = {
  legacy: {
    title: "text-gold",
    subtitle: "text-gold/70",
    border: "border-gold/30",
    glow: "bg-gold/15",
    ring: "ring-gold/30",
    ctaBg: "bg-gold hover:bg-gold/90",
    ctaText: "text-charcoal",
    playRing: "ring-gold/60",
    playFill: "text-gold",
    image: iconImg,
  },
  corporate: {
    title: "text-emerald-300",
    subtitle: "text-emerald-200/70",
    border: "border-emerald-500/30",
    glow: "bg-emerald-500/15",
    ring: "ring-emerald-400/30",
    ctaBg: "bg-emerald-500 hover:bg-emerald-500/90",
    ctaText: "text-charcoal",
    playRing: "ring-emerald-400/60",
    playFill: "text-emerald-300",
    image: csrImg,
  },
  influencer: {
    title: "text-purple-300",
    subtitle: "text-purple-200/70",
    border: "border-purple-500/30",
    glow: "bg-purple-500/15",
    ring: "ring-purple-400/30",
    ctaBg: "bg-purple-500 hover:bg-purple-500/90",
    ctaText: "text-white",
    playRing: "ring-purple-400/60",
    playFill: "text-purple-300",
    image: influencerImg,
  },
  global: {
    title: "text-sky-300",
    subtitle: "text-sky-200/70",
    border: "border-sky-500/30",
    glow: "bg-sky-500/15",
    ring: "ring-sky-400/30",
    ctaBg: "bg-sky-500 hover:bg-sky-500/90",
    ctaText: "text-white",
    playRing: "ring-sky-400/60",
    playFill: "text-sky-300",
    image: grantsImg,
  },
};

export interface BrandedDocumentaryPreviewProps {
  theme: BrandedCategoryTheme;
  title: string;            // e.g. "Legacy Stories"
  status?: string;          // e.g. "Documentary In Production"
  description: string;
  watchCtaLabel?: string;
  watchCtaHref?: string;
  imageAlt: string;
  duration?: string;        // e.g. "1:30"
  videoId?: string;         // future YouTube id
}

const ytEmbedsEnabled =
  String(import.meta.env.VITE_ENABLE_YT_EMBEDS ?? "").toLowerCase() === "true";

export function BrandedDocumentaryPreview({
  theme,
  title,
  status = "Documentary In Production",
  description,
  watchCtaLabel = "Watch Preview",
  watchCtaHref = "/media",
  imageAlt,
  duration = "1:30",
  videoId,
}: BrandedDocumentaryPreviewProps) {
  const t = THEMES[theme];

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-charcoal via-black to-charcoal py-10 lg:py-14">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className={cn("absolute -top-32 right-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30", t.glow)} />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className={cn(
            "relative rounded-3xl overflow-hidden border ring-1 bg-charcoal/60 backdrop-blur",
            t.border,
            t.ring,
          )}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: copy */}
            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
              <Badge
                variant="outline"
                className={cn(
                  "self-start mb-4 px-3 py-1 tracking-[0.18em] text-[10px] uppercase",
                  t.border,
                  t.title,
                  "bg-white/[0.03]",
                )}
              >
                <Sparkles className="mr-1.5 h-3 w-3" />
                Premiering Soon
              </Badge>
              <h3 className={cn("font-display text-2xl md:text-3xl font-bold mb-1", t.title)}>
                {title}
              </h3>
              <p className={cn("text-sm font-medium mb-4", t.subtitle)}>{status}</p>
              <p className="text-white/75 text-sm md:text-base max-w-md mb-6">
                {description}
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className={cn("rounded-full px-6 font-semibold gap-2", t.ctaBg, t.ctaText)}
                >
                  <Link to={watchCtaHref}>
                    <Play className="h-4 w-4 fill-current" />
                    {watchCtaLabel}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: cinematic poster / video placeholder */}
            <div className={cn("relative min-h-[260px] md:min-h-[340px] border-l", t.border)}>
              {ytEmbedsEnabled && videoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title={imageAlt}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={t.image}
                    alt={imageAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/20 to-charcoal/60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />

                  {/* Play button */}
                  <button
                    type="button"
                    aria-label={`Play preview: ${title}`}
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = watchCtaHref;
                      a.click();
                    }}
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <span
                      className={cn(
                        "relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/40 backdrop-blur ring-2 transition-transform duration-300 group-hover:scale-110",
                        t.playRing,
                      )}
                    >
                      <span className={cn("absolute inset-0 rounded-full animate-ping opacity-30", t.glow)} />
                      <Play className={cn("h-9 w-9 md:h-10 md:w-10 fill-current relative z-10", t.playFill)} />
                    </span>
                  </button>

                  {/* Fake player chrome bottom bar */}
                  <div className="absolute left-0 right-0 bottom-0 px-4 py-3 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className={cn("h-1 flex-1 rounded-full bg-white/15 overflow-hidden")}>
                      <div className={cn("h-full w-1/4", t.ctaBg.split(" ")[0])} />
                    </div>
                    <span className="text-[11px] text-white/70 tabular-nums">0:00 / {duration}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
