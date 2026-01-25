import { useState, useEffect } from "react";
import { X, Quote, MessageSquare, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import cvoImage from "@/assets/cvo-santos.png";

interface CVOFlashMessageProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CVO Flash Message Component
 * A strategically designed animated notification for the Chief Visionary Officer's message
 * Can be triggered from navigation dropdown or other strategic points
 */
export function CVOFlashMessage({ isOpen, onClose }: CVOFlashMessageProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm transition-opacity duration-300",
          isAnimating && isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Flash Message Modal */}
      <div
        className={cn(
          "fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[90vw] max-w-2xl",
          "transition-all duration-300 ease-out",
          isAnimating && isOpen
            ? "opacity-100 scale-100 translate-y-[-50%]"
            : "opacity-0 scale-95 translate-y-[-45%]"
        )}
      >
        <div className="relative bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal border border-gold/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-charcoal/50 border border-gold/20 text-white/60 hover:text-gold hover:border-gold/40 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative p-6 md:p-8">
            {/* Header Badge */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20">
                <MessageSquare className="h-4 w-4 text-gold animate-pulse" />
                <span className="text-sm font-medium text-gold">Message from the CVO</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* CVO Portrait */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {/* Animated ring */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-gold/40 via-gold/20 to-transparent blur-sm animate-pulse" />
                  <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-3 border-gold/50 shadow-gold">
                    <img
                      src={cvoImage}
                      alt="Santos Akhilele Okungbowa"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  {/* Badge */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold text-charcoal text-[10px] font-bold rounded-full whitespace-nowrap shadow-lg">
                    Chief Visionary Officer
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 h-6 w-6 text-gold/30" />
                  <blockquote className="text-base md:text-lg text-white/90 leading-relaxed pl-4 md:pl-6 italic">
                    Welcome to NESA-Africa 2025—a pan-African celebration of educational transformation, 
                    social impact, and legacy. Together, we honor those who dare to reimagine education 
                    and inspire generations.
                  </blockquote>
                </div>

                <div className="mt-4 pt-4 border-t border-gold/20">
                  <p className="text-gold font-display text-lg font-semibold">
                    Santos Akhilele Okungbowa
                  </p>
                  <p className="text-white/50 text-sm">
                    Founder & CVO, Santos Creations Educational Foundation
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 pt-4 border-t border-gold/10">
              <Button
                asChild
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 gap-2"
              >
                <Link to="/about/scef" onClick={handleClose}>
                  Learn About SCEF
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gold text-charcoal hover:bg-gold-light gap-2"
              >
                <Link to="/about/vision-2035" onClick={handleClose}>
                  Explore Vision 2035
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Decorative bottom border */}
          <div className="h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </div>
      </div>
    </>
  );
}

/**
 * CVO Message Trigger Button
 * Can be used in navigation dropdowns or as a floating button
 */
export function CVOMessageTrigger({
  onClick,
  variant = "dropdown",
  className,
}: {
  onClick: () => void;
  variant?: "dropdown" | "button" | "compact";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 transition-colors",
          className
        )}
      >
        <div className="w-6 h-6 rounded-full overflow-hidden border border-gold/40">
          <img src={cvoImage} alt="CVO" className="w-full h-full object-cover object-top" />
        </div>
        <MessageSquare className="h-3 w-3" />
      </button>
    );
  }

  if (variant === "button") {
    return (
      <Button
        onClick={onClick}
        variant="outline"
        className={cn("border-gold/40 text-gold hover:bg-gold/10 gap-2", className)}
      >
        <div className="w-5 h-5 rounded-full overflow-hidden border border-gold/40">
          <img src={cvoImage} alt="CVO" className="w-full h-full object-cover object-top" />
        </div>
        Message from CVO
      </Button>
    );
  }

  // Dropdown variant (default)
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-left transition-colors",
        "hover:bg-gold/10 text-white hover:text-gold group",
        className
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gold/40 group-hover:border-gold transition-colors">
          <img src={cvoImage} alt="CVO" className="w-full h-full object-cover object-top" />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gold rounded-full flex items-center justify-center">
          <MessageSquare className="h-1.5 w-1.5 text-charcoal" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-sm font-medium">Message from CVO</span>
        <span className="block text-xs text-white/50 group-hover:text-gold/60 truncate">
          Santos Akhilele Okungbowa
        </span>
      </div>
      <MessageSquare className="h-4 w-4 text-gold/50 group-hover:text-gold" />
    </button>
  );
}
