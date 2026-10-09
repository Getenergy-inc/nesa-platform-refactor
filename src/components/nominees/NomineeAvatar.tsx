/**
 * NomineeAvatar — premium visual identity for every nominee.
 *
 * - Renders a real image (photo/logo) when `src` is provided and not a placeholder.
 * - Falls back to a deterministic gradient + initials (people) or icon (organizations).
 * - Never leaves an empty container; provides consistent alt text and lazy loading.
 *
 * Use across nominee cards, profile heroes, search results, and voting cards.
 */

import { Building2, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type NomineeKind = "individual" | "organization";

interface NomineeAvatarProps {
  name: string;
  src?: string | null;
  kind?: NomineeKind;
  className?: string;
  /** Show a soft gold ring/glow on hover (use on cards). */
  interactive?: boolean;
  /** Shape preset. Default "rounded" works for both photos and logos. */
  shape?: "rounded" | "square" | "circle";
  /** Optional secondary line (e.g. country) used only for alt text. */
  context?: string;
  /** Force aspect (default uses container). */
  fillContainer?: boolean;
}

const PLACEHOLDER_HINTS = ["/images/placeholder", "placeholder.svg", "no-image", "default-avatar"];

function isMeaningfulSrc(src?: string | null): boolean {
  if (!src) return false;
  const s = src.trim();
  if (!s) return false;
  return !PLACEHOLDER_HINTS.some((p) => s.includes(p));
}

function getInitials(name: string): string {
  return (
    name
      .split(/[\s\-_/]+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

/** Deterministic gradient pair derived from the name. Stays within brand palette. */
function gradientFor(name: string): string {
  const palettes = [
    "from-gold/30 via-amber-700/20 to-charcoal",
    "from-amber-500/25 via-gold/15 to-charcoal-light",
    "from-yellow-600/25 via-gold/20 to-black",
    "from-gold/25 via-orange-700/15 to-charcoal",
    "from-amber-400/20 via-gold/25 to-charcoal-light",
    "from-rose-700/15 via-gold/20 to-charcoal",
    "from-emerald-700/15 via-gold/20 to-charcoal",
    "from-sky-800/15 via-gold/20 to-charcoal",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

export function NomineeAvatar({
  name,
  src,
  kind = "individual",
  className,
  interactive = false,
  shape = "rounded",
  context,
  fillContainer = true,
}: NomineeAvatarProps) {
  const hasImage = isMeaningfulSrc(src);
  const isOrg = kind === "organization";
  const shapeCls =
    shape === "circle" ? "rounded-full" : shape === "square" ? "rounded-none" : "rounded-xl";

  const altBase = isOrg ? `${name} organisation logo` : `${name} nominee profile photo`;
  const alt = context ? `${altBase} — ${context}` : altBase;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-charcoal-light/60",
        shapeCls,
        fillContainer && "w-full h-full",
        interactive &&
          "transition-all duration-500 ring-1 ring-gold/10 group-hover:ring-gold/50 group-hover:shadow-[0_0_24px_-6px_hsl(42_85%_52%/0.45)]",
        className,
      )}
    >
      {hasImage ? (
        <>
          <img
            src={src as string}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={cn(
              "w-full h-full transition-transform duration-700",
              isOrg ? "object-contain p-3 bg-white/5" : "object-cover",
              interactive && "group-hover:scale-[1.04]",
            )}
            onError={(e) => {
              // Hide broken image; CSS fallback below will show through.
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Subtle cinematic overlay for photos only */}
          {!isOrg && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          )}
        </>
      ) : (
        <FallbackVisual name={name} isOrg={isOrg} />
      )}
    </div>
  );
}

function FallbackVisual({ name, isOrg }: { name: string; isOrg: boolean }) {
  const gradient = gradientFor(name);
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-gradient-to-br",
        gradient,
      )}
      aria-hidden="true"
    >
      {/* Soft pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, hsl(42 85% 52% / 0.6) 0, transparent 40%), radial-gradient(circle at 80% 80%, hsl(42 85% 52% / 0.4) 0, transparent 45%)",
        }}
      />
      {isOrg ? (
        <div className="relative flex flex-col items-center gap-2 text-gold/85">
          <div className="rounded-2xl bg-charcoal/60 ring-1 ring-gold/30 p-3 backdrop-blur-sm">
            <Building2 className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <span className="font-display text-[11px] uppercase tracking-[0.18em] text-gold/70">
            {initials}
          </span>
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-1 text-gold">
          <span className="font-display text-3xl md:text-4xl font-bold drop-shadow-sm">
            {initials}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-gold/70">
            <GraduationCap className="h-3 w-3" /> Nominee
          </span>
        </div>
      )}
      {/* Gold edge highlight */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/15" />
    </div>
  );
}

export default NomineeAvatar;
