// HeroCompact — the shared landing hero for refactored pages.
// Enforces: single H1, one primary CTA + one secondary CTA, optional eyebrow,
// optional supporting image. Keeps mobile heroes small so the primary CTA
// stays above the fold on 360px devices.

import { CTAStack, type CTAAction } from "./CTAStack";
import { cn } from "@/lib/utils";

export interface HeroCompactProps {
  eyebrow?: string;
  title: string;
  lede: string;
  primary: CTAAction;
  secondary?: CTAAction;
  tertiary?: CTAAction;
  /** Optional side visual (URL). Renders after the copy on mobile. */
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export function HeroCompact({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
  tertiary,
  imageSrc,
  imageAlt,
  className,
}: HeroCompactProps) {
  return (
    <section
      className={cn(
        "relative border-b border-gold/10 bg-charcoal text-white",
        className,
      )}
    >
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-12 md:py-16 lg:py-20">
        <div className="flex flex-col justify-center">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-playfair text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{lede}</p>
          <div className="mt-6">
            <CTAStack primary={primary} secondary={secondary} tertiary={tertiary} />
          </div>
        </div>
        {imageSrc ? (
          <div className="relative overflow-hidden rounded-xl border border-gold/20 bg-charcoal/40">
            <img
              src={imageSrc}
              alt={imageAlt ?? ""}
              loading="eager"
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default HeroCompact;
