import { forwardRef } from "react";
import { MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import cvoImage from "@/assets/cvo-santos.png";

interface CVOMessageTriggerProps {
  onClick: () => void;
  variant?: "dropdown" | "button" | "compact";
  className?: string;
}

/**
 * CVO Message Trigger Button
 * Futuristic trigger variants for navigation dropdowns or floating buttons
 * Uses forwardRef for Radix UI asChild compatibility
 */
export const CVOMessageTrigger = forwardRef<HTMLButtonElement, CVOMessageTriggerProps>(
  function CVOMessageTrigger({ onClick, variant = "dropdown", className }, ref) {
    if (variant === "compact") {
      return (
        <motion.button
          ref={ref}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className={cn(
            "relative flex items-center gap-2 p-2 rounded-lg bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/50 transition-all",
            className
          )}
        >
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gold/50">
            <img src={cvoImage} alt="CVO" className="w-full h-full object-cover object-top" />
          </div>
          <Zap className="h-3 w-3" />
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full"
          />
        </motion.button>
      );
    }

    if (variant === "button") {
      return (
        <Button
          ref={ref}
          onClick={onClick}
          variant="outline"
          className={cn(
            "group relative border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/60 gap-2 overflow-hidden",
            className
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <div className="relative w-5 h-5 rounded-full overflow-hidden border border-gold/50">
            <img src={cvoImage} alt="CVO" className="w-full h-full object-cover object-top" />
          </div>
          <span className="relative">Vision Message</span>
          <Zap className="h-3 w-3 relative" />
        </Button>
      );
    }

    // Dropdown variant (default)
    return (
      <motion.button
        ref={ref}
        whileHover={{ x: 2 }}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left transition-all",
          "bg-gradient-to-r from-transparent to-transparent hover:from-gold/5 hover:to-gold/10",
          "text-white hover:text-gold group border border-transparent hover:border-gold/20",
          className
        )}
      >
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 rounded-full border border-gold/20"
          />
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-gold/50 group-hover:border-gold transition-colors">
            <img src={cvoImage} alt="CVO" className="w-full h-full object-cover object-top" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center shadow-lg"
          >
            <Zap className="h-2 w-2 text-charcoal" />
          </motion.div>
        </div>
        <div className="flex-1 min-w-0">
          <span className="block text-sm font-semibold">Vision Message</span>
          <span className="block text-xs text-white/50 group-hover:text-gold/60 truncate">
            CVO Strategic Address
          </span>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-2 h-2 bg-gold rounded-full"
        />
      </motion.button>
    );
  }
);
