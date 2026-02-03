import { useState } from "react";
import { User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type NomineeImageType = "photo" | "logo";

interface NomineeImageProps {
  src?: string | null;
  alt: string;
  name: string;
  /** Whether this is a person photo or organization logo */
  type?: NomineeImageType;
  /** Size variant */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Whether to show border */
  showBorder?: boolean;
}

const sizeClasses = {
  xs: "w-8 h-8",
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
};

const textSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const iconSizeClasses = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
};

/**
 * Generate initials from a name
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * NomineeImage - Consistent image component for nominees
 * 
 * Handles:
 * - People photos with object-fit cover
 * - Organization logos with object-fit contain
 * - Graceful fallback to initials or icon
 * - Loading states
 */
export function NomineeImage({
  src,
  alt,
  name,
  type = "photo",
  size = "md",
  className,
  showBorder = true,
}: NomineeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(!!src);

  const isLogo = type === "logo";
  const showImage = src && !hasError;

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex items-center justify-center",
        sizeClasses[size],
        showBorder && "border-2 border-gold/20",
        isLogo ? "bg-white/90 p-1" : "bg-gold/10",
        className
      )}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gold/10 animate-pulse rounded-full" />
      )}

      {/* Image */}
      {showImage && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn(
            isLogo ? "object-contain max-h-full max-w-full" : "object-cover w-full h-full"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}

      {/* Fallback: initials for people, icon for orgs */}
      {(!src || hasError) && (
        <div className="flex items-center justify-center w-full h-full">
          {isLogo ? (
            <Building2 className={cn(iconSizeClasses[size], "text-gold/60")} />
          ) : name ? (
            <span className={cn(textSizeClasses[size], "font-semibold text-gold")}>
              {getInitials(name)}
            </span>
          ) : (
            <User className={cn(iconSizeClasses[size], "text-gold/60")} />
          )}
        </div>
      )}
    </div>
  );
}

export default NomineeImage;
