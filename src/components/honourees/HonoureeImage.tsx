import { useMemo } from "react";
import { useResolveNomineeMedia } from "@/hooks/useNomineeMedia";
import { cn } from "@/lib/utils";

/**
 * Detects placeholder / empty sources that should NOT be rendered as <img>.
 * Falls back to a branded charcoal+gold initials tile in those cases.
 */
const PLACEHOLDER_RE = /placeholder\.svg|\/images\/nominees\/[^/]+\/profile\.jpg$|\/images\/placeholder/i;

function isPlaceholder(src?: string | null): boolean {
  if (!src) return true;
  const s = src.trim();
  if (!s) return true;
  return PLACEHOLDER_RE.test(s);
}

function getInitials(name?: string | null): string {
  if (!name) return "★";
  const parts = name
    .replace(/\([^)]*\)/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "★";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase().slice(0, 2);
}

/**
 * Deterministic gold tone per slug so the wall feels intentional, not random.
 */
function tintFor(slug?: string | null): string {
  if (!slug) return "from-gold/25 to-gold/5";
  const sum = Array.from(slug).reduce((a, c) => a + c.charCodeAt(0), 0);
  const tones = [
    "from-gold/30 via-gold/10 to-charcoal",
    "from-gold/25 via-charcoal-light to-charcoal",
    "from-amber-400/25 via-gold/10 to-charcoal",
    "from-gold/35 via-amber-700/15 to-charcoal",
    "from-yellow-500/25 via-gold/10 to-charcoal",
  ];
  return tones[sum % tones.length];
}

interface HonoureeImageProps {
  slug: string;
  name: string;
  fallbackImage?: string | null;
  className?: string;
  imgClassName?: string;
  /** Show a faint country flag in the initials tile */
  flag?: string;
}

/**
 * Cinematic, on-brand image surface for honourees.
 *  - Resolves verified `nominee_media` first
 *  - Falls back to provided `fallbackImage` if it's a real file
 *  - Otherwise renders a branded charcoal/gold initials tile (no broken images)
 */
export function HonoureeImage({
  slug,
  name,
  fallbackImage,
  className,
  imgClassName,
  flag,
}: HonoureeImageProps) {
  const resolve = useResolveNomineeMedia();
  const media = resolve(slug, fallbackImage, name);

  const src = useMemo(() => {
    const candidate = media.image ?? fallbackImage ?? null;
    return isPlaceholder(candidate) ? null : candidate;
  }, [media.image, fallbackImage]);

  const initials = getInitials(name);
  const tint = tintFor(slug);

  if (src) {
    return (
      <img
        src={src}
        alt={media.alt ?? name}
        loading="lazy"
        className={cn("w-full h-full object-cover", imgClassName, className)}
      />
    );
  }

  return (
    <div
      aria-label={name}
      role="img"
      className={cn(
        "relative w-full h-full overflow-hidden bg-gradient-to-br",
        tint,
        className,
      )}
    >
      {/* subtle gold diagonal sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(212,175,55,0.08)_50%,transparent_60%)]" />

      <div className="relative h-full w-full flex flex-col items-center justify-center text-center px-3">
        <div className="font-display text-4xl md:text-5xl font-bold text-gold drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)] tracking-tight">
          {initials}
        </div>
        {flag && (
          <div className="text-2xl mt-1 opacity-80" aria-hidden="true">
            {flag}
          </div>
        )}
        <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-gold/70">
          Honouree
        </div>
      </div>

      {/* corner mark */}
      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold/60 shadow-[0_0_10px_rgba(212,175,55,0.7)]" />
    </div>
  );
}

export default HonoureeImage;
