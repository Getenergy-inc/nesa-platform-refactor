import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy, Vote, Heart, Music, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export function QuickActionBar() {
  const { t } = useTranslation("pages");
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 300);
  });

  const scrollToMusic = () => {
    const musicSection = document.getElementById('music');
    if (musicSection) {
      musicSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-md border-b border-gold/20 md:hidden"
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="px-3 py-2.5 flex gap-1.5">
        <Link to="/nominate" className="flex-1">
          <motion.div
            animate={isVisible ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Button
              size="sm"
              className="w-full bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-lg gap-1 h-10 px-2 text-xs shadow-sm shadow-gold/20"
            >
              <Trophy className="h-3.5 w-3.5" />
              {t("landing.quickActions.nominate")}
            </Button>
          </motion.div>
        </Link>
        
        <Link to="/vote" className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-gold/40 text-gold hover:bg-gold/10 hover:border-gold font-semibold rounded-lg gap-1 h-10 px-2 text-xs transition-all"
          >
            <Vote className="h-3.5 w-3.5" />
            {t("landing.quickActions.vote")}
          </Button>
        </Link>

        <button onClick={scrollToMusic} className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-purple-500/40 text-purple-400 hover:bg-purple-500/15 hover:border-purple-400 font-semibold rounded-lg gap-1 h-10 px-2 text-xs transition-all"
          >
            <Music className="h-3.5 w-3.5" />
            {t("landing.quickActions.music")}
          </Button>
        </button>

        <Link to="/donate" className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-primary/40 text-primary hover:bg-primary/15 hover:border-primary font-semibold rounded-lg gap-1 h-10 px-2 text-xs transition-all"
          >
            <Heart className="h-3.5 w-3.5" />
            {t("landing.quickActions.donate")}
          </Button>
        </Link>

        <Link to="/regions" className="flex-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-400 font-semibold rounded-lg gap-1 h-10 px-2 text-xs transition-all"
          >
            <Globe className="h-3.5 w-3.5" />
            Explore
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}