import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import nesaStamp from "@/assets/nesa-stamp.jpeg";

interface NESALogoProps {
  className?: string;
  variant?: "full" | "icon" | "stamp";
  size?: "sm" | "md" | "lg";
}

/**
 * NESA-Africa Logo Component
 * Uses the official NESA stamp image
 */
export const NESALogo = forwardRef<HTMLDivElement, NESALogoProps>(
  ({ className, variant = "full", size = "md" }, ref) => {
    const sizeClasses = {
      sm: variant === "full" ? "h-8" : "h-6 w-6",
      md: variant === "full" ? "h-10" : "h-8 w-8",
      lg: variant === "full" ? "h-14" : "h-12 w-12",
    };

    if (variant === "icon" || variant === "stamp") {
      return (
        <div
          ref={ref}
          className={cn(
            "relative flex items-center justify-center",
            sizeClasses[size],
            className
          )}
        >
          <img 
            src={nesaStamp} 
            alt="NESA Africa" 
            className="h-full w-full object-contain rounded-full"
          />
        </div>
      );
    }

    // Full logo with image and text
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2",
          sizeClasses[size],
          className
        )}
      >
        {/* Logo Image */}
        <div className="relative flex items-center justify-center h-full aspect-square">
          <img 
            src={nesaStamp} 
            alt="NESA Africa" 
            className="h-full w-full object-contain rounded-full"
          />
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
          <span className="text-[6px] text-white/50 font-medium tracking-wider italic mt-0.5">
            The African Blue-Garnet Awards for Education
          </span>
        </div>
      </div>
    );
  }
);

NESALogo.displayName = "NESALogo";

/**
 * NESA Stamp/Badge for nominee cards and CTAs
 */
export const NESAStamp = forwardRef<HTMLDivElement, { className?: string; size?: "xs" | "sm" | "md" }>(
  ({ className, size = "sm" }, ref) => {
    const sizeConfig = {
      xs: "h-5 w-5",
      sm: "h-6 w-6",
      md: "h-8 w-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center",
          sizeConfig[size],
          className
        )}
      >
        <img 
          src={nesaStamp} 
          alt="NESA" 
          className="h-full w-full object-contain rounded-full shadow-lg"
        />
      </div>
    );
  }
);

NESAStamp.displayName = "NESAStamp";

export default NESALogo;
