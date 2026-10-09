/**
 * Light-theme initials monogram used where a category nominee has no verified
 * photograph. Muted surface, gold monogram — never a generic stock placeholder.
 */
import { useState } from "react";
import { getInitials } from "@/components/influencer-impact/InitialsAvatar";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function LightInitialsAvatar({ name, label, size = "md", className }: Props) {
  return (
    <div
      role="img"
      aria-label={`${name} — portrait pending verification`}
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-muted",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center rounded-full border border-gold/40 bg-gold/10",
          size === "sm" ? "h-14 w-14" : "h-20 w-20",
        )}
      >
        <span
          className={cn(
            "font-display font-bold tracking-wide text-gold",
            size === "sm" ? "text-lg" : "text-2xl",
          )}
        >
          {getInitials(name)}
        </span>
      </div>
      {label && (
        <span className="mt-2 px-2 text-center text-[9px] uppercase tracking-[0.18em] text-muted-foreground line-clamp-1">
          {label}
        </span>
      )}
    </div>
  );
}

export default LightInitialsAvatar;

/** Image with graceful fallback to the initials monogram on load failure. */
export function NomineeImageOrInitials({
  src,
  name,
  label,
  size = "md",
  className,
}: {
  src: string | null;
  name: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <LightInitialsAvatar name={name} label={label} size={size} />;
  }
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
