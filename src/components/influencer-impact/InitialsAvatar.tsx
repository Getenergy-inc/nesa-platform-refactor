// Branded initials avatar used wherever an Influencer Education Impact
// (Blue Garnet) nominee has no verified photograph on file.
// Navy/charcoal field, gold monogram — never a generic stock placeholder.

interface InitialsAvatarProps {
  name: string;
  /** Optional small label rendered under the monogram (e.g. "Social Media"). */
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export function getInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((w) => w.replace(/[^\p{L}\p{N}]/gu, "")[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "NE"
  );
}

export function InitialsAvatar({
  name,
  label,
  className = "",
  size = "md",
}: InitialsAvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      role="img"
      aria-label={`${name} — portrait pending verification`}
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d1b33] via-charcoal to-black ${className}`}
    >
      {/* subtle gold radial wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, hsl(42 85% 52% / 0.18), transparent 62%)",
        }}
      />
      <div
        aria-hidden="true"
        className={`relative flex items-center justify-center rounded-full border border-gold/40 bg-gold/10 ${
          size === "sm" ? "h-14 w-14" : "h-20 w-20"
        }`}
      >
        <span
          className={`font-display font-bold tracking-wide text-gold ${
            size === "sm" ? "text-lg" : "text-2xl"
          }`}
        >
          {initials}
        </span>
      </div>
      {label && (
        <span className="relative mt-2 text-[9px] uppercase tracking-[0.18em] text-white/45">
          {label}
        </span>
      )}
    </div>
  );
}
