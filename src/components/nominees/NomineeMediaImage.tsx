/**
 * NomineeMediaImage — the single visual renderer for every nominee surface.
 *
 * Consumes a ResolvedNomineeMedia from the media resolution layer, lazy-loads
 * the stored asset, keeps logos uncropped, and falls back automatically to the
 * branded initials avatar when there is no verified media or the stored file
 * fails to load. Never fetches anything from a third party at render time.
 */
import { useEffect, useState } from "react";
import { LightInitialsAvatar } from "@/components/awards/branded/LightInitialsAvatar";
import type { ResolvedNomineeMedia } from "@/lib/nomineeMediaResolver";
import { cn } from "@/lib/utils";

interface Props {
  media: ResolvedNomineeMedia;
  name: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
  /** Optional themed fallback (dark surfaces pass their own initials avatar). */
  fallback?: React.ReactNode;
}

export function NomineeMediaImage({ media, name, label, size = "md", className, fallback }: Props) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [media.url]);

  if (!media.url || failed) {
    return <>{fallback ?? <LightInitialsAvatar name={name} label={label} size={size} />}</>;
  }


  return (
    <img
      src={media.url}
      alt={media.alt || name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(
        "h-full w-full",
        media.fit === "contain" ? "bg-white object-contain p-3" : "object-cover",
        className,
      )}
    />
  );
}

export default NomineeMediaImage;
