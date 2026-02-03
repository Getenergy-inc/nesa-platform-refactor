import { motion } from "framer-motion";
import { forwardRef } from "react";
import nesaStamp from "@/assets/nesa-stamp.jpeg";
import { cn } from "@/lib/utils";

interface NESALogo3DProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * 3D Motion Graphics NESA Logo
 * Floating, rotating, glowing effect for hero sections
 */
export const NESALogo3D = forwardRef<HTMLDivElement, NESALogo3DProps>(
  ({ className, size = "lg" }, ref) => {
    const sizeClasses = {
      sm: "h-12 w-12",
      md: "h-16 w-16",
      lg: "h-20 w-20 sm:h-24 sm:w-24",
      xl: "h-28 w-28 sm:h-32 sm:w-32",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative perspective-1000",
          sizeClasses[size],
          className
        )}
        style={{ perspective: "1000px" }}
      >
        {/* Outer glow ring - pulsing */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--gold) / 0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary glow ring - offset timing */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--gold) / 0.2) 0%, transparent 60%)",
          }}
          animate={{
            scale: [1.1, 1.5, 1.1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* 3D Container with 360 degree rotation */}
        <motion.div
          className="relative h-full w-full"
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: 360,
            y: [0, -6, 0],
          }}
          transition={{
            rotateY: {
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            },
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {/* Back shadow layer for depth */}
          <motion.div
            className="absolute inset-0 rounded-full bg-charcoal/50 blur-lg"
            style={{
              transform: "translateZ(-30px) scale(1.1)",
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Middle depth layer */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(135deg, hsl(var(--gold) / 0.4) 0%, hsl(var(--gold-dark) / 0.2) 100%)",
              transform: "translateZ(-15px) scale(1.05)",
              filter: "blur(4px)",
            }}
          />

          {/* Main logo with 3D effect */}
          <motion.div
            className="relative h-full w-full rounded-full overflow-hidden"
            style={{
              transformStyle: "preserve-3d",
              boxShadow: `
                0 0 20px hsl(var(--gold) / 0.4),
                0 0 40px hsl(var(--gold) / 0.2),
                0 0 60px hsl(var(--gold) / 0.1),
                inset 0 0 20px hsl(var(--gold) / 0.1)
              `,
            }}
            whileHover={{
              scale: 1.1,
              rotateY: 180,
              transition: { duration: 0.6, ease: "easeInOut" },
            }}
          >
            {/* Gradient overlay for 3D effect */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, transparent 40%, hsl(var(--gold) / 0.3) 100%)",
              }}
            />

            {/* Highlight on top edge */}
            <div
              className="absolute inset-x-0 top-0 h-1/3 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, hsl(var(--gold-light) / 0.3) 0%, transparent 100%)",
              }}
            />

            {/* The actual logo image */}
            <motion.img
              src={nesaStamp}
              alt="NESA Africa Logo"
              className="h-full w-full object-cover"
              animate={{
                filter: [
                  "brightness(1) saturate(1)",
                  "brightness(1.1) saturate(1.1)",
                  "brightness(1) saturate(1)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Sparkle particles around the logo */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gold"
              style={{
                width: "4px",
                height: "4px",
                top: "50%",
                left: "50%",
              }}
              animate={{
                x: [0, Math.cos((i * 60 * Math.PI) / 180) * 60, 0],
                y: [0, Math.sin((i * 60 * Math.PI) / 180) * 60, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Reflection/shine sweep effect */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, hsl(var(--gold-light) / 0.4) 50%, transparent 60%)",
          }}
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }
);

NESALogo3D.displayName = "NESALogo3D";

export default NESALogo3D;
