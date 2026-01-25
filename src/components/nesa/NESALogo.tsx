import { cn } from "@/lib/utils";

interface NESALogoProps {
  className?: string;
  variant?: "full" | "icon" | "stamp";
  size?: "sm" | "md" | "lg";
}

/**
 * NESA-Africa Logo Component
 * Based on the official NESA branding with the star burst design
 */
export function NESALogo({ className, variant = "full", size = "md" }: NESALogoProps) {
  const sizeClasses = {
    sm: variant === "full" ? "h-8" : "h-6 w-6",
    md: variant === "full" ? "h-10" : "h-8 w-8",
    lg: variant === "full" ? "h-14" : "h-12 w-12",
  };

  if (variant === "icon" || variant === "stamp") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center",
          sizeClasses[size],
          className
        )}
      >
        {/* Star burst icon representing education excellence */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Outer glow/ring */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gold/40"
          />
          
          {/* Central star with rays */}
          <g className="text-gold">
            {/* Main 8-point star */}
            <path
              d="M20 4L22.5 15.5L34 12L24.5 20L34 28L22.5 24.5L20 36L17.5 24.5L6 28L15.5 20L6 12L17.5 15.5L20 4Z"
              fill="currentColor"
              fillOpacity="0.9"
            />
            {/* Inner highlight */}
            <circle cx="20" cy="20" r="5" fill="currentColor" />
          </g>
          
          {/* Accent dots at cardinal points */}
          <circle cx="20" cy="2" r="1.5" className="fill-gold" />
          <circle cx="38" cy="20" r="1.5" className="fill-gold" />
          <circle cx="20" cy="38" r="1.5" className="fill-gold" />
          <circle cx="2" cy="20" r="1.5" className="fill-gold" />
        </svg>
      </div>
    );
  }

  // Full logo with text
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        sizeClasses[size],
        className
      )}
    >
      {/* Logo Icon */}
      <div className="relative flex items-center justify-center h-full aspect-square">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Central star with rays */}
          <g className="text-gold">
            {/* Main 8-point star */}
            <path
              d="M20 4L22.5 15.5L34 12L24.5 20L34 28L22.5 24.5L20 36L17.5 24.5L6 28L15.5 20L6 12L17.5 15.5L20 4Z"
              fill="currentColor"
              fillOpacity="0.9"
            />
            {/* Inner highlight */}
            <circle cx="20" cy="20" r="4" fill="currentColor" />
          </g>
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span className="text-[8px] text-gold/70 font-medium tracking-[0.2em] uppercase">
          New Education
        </span>
        <span className="text-[8px] text-gold/70 font-medium tracking-[0.2em] uppercase">
          Standard Awards
        </span>
        <span className="text-sm font-display font-bold text-gold tracking-wide mt-0.5">
          AFRICA
        </span>
      </div>
    </div>
  );
}

/**
 * NESA Stamp/Badge for nominee cards and CTAs
 */
export function NESAStamp({ className, size = "sm" }: { className?: string; size?: "xs" | "sm" | "md" }) {
  const sizeConfig = {
    xs: { container: "px-1 py-0.5", icon: "h-3 w-3", text: "text-[8px]" },
    sm: { container: "px-1.5 py-0.5", icon: "h-4 w-4", text: "text-[10px]" },
    md: { container: "px-2 py-1", icon: "h-5 w-5", text: "text-xs" },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 bg-charcoal/90 backdrop-blur-sm border border-gold/30 rounded",
        config.container,
        className
      )}
    >
      {/* Mini star icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-gold", config.icon)}
      >
        <path
          d="M12 2L13.5 9.5L21 8L15 12L21 16L13.5 14.5L12 22L10.5 14.5L3 16L9 12L3 8L10.5 9.5L12 2Z"
          fill="currentColor"
        />
      </svg>
      <span className={cn("text-gold font-display font-bold tracking-wide", config.text)}>
        NESA
      </span>
    </div>
  );
}

export default NESALogo;
