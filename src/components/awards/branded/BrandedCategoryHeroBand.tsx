/**
 * BrandedCategoryHeroBand — the shared NESA-Africa award-category hero.
 *
 * Extracted from the Africa Education Icon page so the Icon page and the three
 * Influencer subpages provably render the SAME component (dark charcoal
 * gradient band, gold radial overlay, badge pill, font-display heading with an
 * optional gold-highlighted fragment, subhead, a data-driven 4-up stat tile
 * grid, primary + secondary CTAs, and a shield trust line).
 *
 * Nothing here is icon-specific: every number comes in through `stats`.
 */
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BrandedHeroStat {
  /** Value to display — already formatted (number or short string). */
  value: React.ReactNode;
  /** Small caption under the value. */
  label: string;
}

export interface BrandedHeroCta {
  label: string;
  href: string;
}

interface Props {
  /** Small pill above the headline, e.g. "Lifetime Achievement · 2006–2026". */
  badgeLabel?: string;
  /** Icon rendered inside the badge pill (Crown, Sparkles, …). */
  badgeIcon?: LucideIcon;
  /** Main headline (white). */
  title: string;
  /** Optional trailing fragment of the headline rendered in gold. */
  titleHighlight?: string;
  /** Supporting paragraph under the headline. */
  subtitle?: string;
  /** Optional italic statement rendered above the subtitle. */
  eyebrowStatement?: string;
  /** 2–4 stat tiles. Pass live values; nothing is hardcoded. */
  stats?: BrandedHeroStat[];
  primaryCta?: BrandedHeroCta;
  secondaryCta?: BrandedHeroCta;
  /** Small line with a shield icon under the CTAs. */
  trustLine?: string;
  /** Optional background photograph (rendered at low opacity). */
  backgroundImage?: string;
  className?: string;
}

function CtaButton({
  cta,
  variant,
}: {
  cta: BrandedHeroCta;
  variant: "primary" | "secondary";
}) {
  const isHash = cta.href.startsWith("#") || cta.href.startsWith("http");
  const inner =
    variant === "primary" ? (
      <>
        {cta.label}
        <ArrowRight className="ml-2 h-4 w-4" />
      </>
    ) : (
      cta.label
    );

  return (
    <Button
      asChild
      size="lg"
      variant={variant === "primary" ? "default" : "outline"}
      className={
        variant === "primary"
          ? "bg-gold text-charcoal hover:bg-gold/90"
          : "border-gold/40 text-white hover:bg-gold/10"
      }
    >
      {isHash ? <a href={cta.href}>{inner}</a> : <Link to={cta.href}>{inner}</Link>}
    </Button>
  );
}

export function BrandedCategoryHeroBand({
  badgeLabel,
  badgeIcon: BadgeIcon,
  title,
  titleHighlight,
  subtitle,
  eyebrowStatement,
  stats = [],
  primaryCta,
  secondaryCta,
  trustLine,
  backgroundImage,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-gold/15 bg-gradient-to-b from-black via-charcoal to-charcoal-light",
        className,
      )}
    >
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt=""
            aria-hidden
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/85 to-charcoal"
          />
        </>
      )}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, hsl(42 85% 52%) 0, transparent 45%), radial-gradient(circle at 85% 80%, hsl(42 85% 52%) 0, transparent 45%)",
        }}
      />

      <div className="container relative mx-auto px-4 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          {badgeLabel && (
            <Badge
              variant="outline"
              className="mb-5 inline-flex items-center gap-1.5 border-gold/40 bg-gold/5 px-3 py-1 text-gold"
            >
              {BadgeIcon && <BadgeIcon className="h-3 w-3" />}
              {badgeLabel}
            </Badge>
          )}

          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {title}
            {titleHighlight && (
              <>
                {" "}
                <span className="text-gold">{titleHighlight}</span>
              </>
            )}
          </h1>

          {eyebrowStatement && (
            <p className="mx-auto mt-4 max-w-2xl text-base italic text-white/80 md:text-lg">
              {eyebrowStatement}
            </p>
          )}

          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/75 md:text-lg">
              {subtitle}
            </p>
          )}

          {stats.length > 0 && (
            <div
              className={cn(
                "mx-auto mt-8 grid max-w-2xl gap-3 grid-cols-2",
                stats.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3",
              )}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gold/20 bg-white/[0.03] px-3 py-3"
                >
                  <div className="font-display text-xl md:text-2xl font-bold leading-tight text-gold break-words">
                    {s.value}
                  </div>

                  <div className="mt-0.5 text-[11px] text-white/60">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {primaryCta && <CtaButton cta={primaryCta} variant="primary" />}
              {secondaryCta && <CtaButton cta={secondaryCta} variant="secondary" />}
            </div>
          )}

          {trustLine && (
            <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/50">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              {trustLine}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default BrandedCategoryHeroBand;
