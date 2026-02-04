import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Building2 } from "lucide-react";

interface CVOActionsProps {
  onClose: () => void;
}

export function CVOActions({ onClose }: CVOActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 pt-5 border-t border-gold/10"
    >
      <Button
        asChild
        variant="outline"
        className="group border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/60 gap-2 transition-all"
      >
        <Link to="/about/scef" onClick={onClose}>
          <Building2 className="h-4 w-4" />
          About SCEF
          <ArrowRight className="h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
        </Link>
      </Button>
      <Button
        asChild
        className="group bg-gradient-to-r from-gold via-gold-light to-gold text-charcoal hover:shadow-lg hover:shadow-gold/20 gap-2 transition-all"
      >
        <Link to="/about/vision-2035" onClick={onClose}>
          <Rocket className="h-4 w-4" />
          Vision 2035
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.span>
        </Link>
      </Button>
    </motion.div>
  );
}
