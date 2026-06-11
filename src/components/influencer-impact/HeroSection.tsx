import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Search, ShieldCheck, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_STATS, NOMINATE_URL } from "@/config/awards/influencerImpact2026";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-rose-500/5 pointer-events-none" />
      <div className="container relative z-10 max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold tracking-wider uppercase mb-5">
            Influencer Education Impact Award 2026
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Who Are Africa's Most{" "}
            <span className="text-primary">Influential Education Changemakers?</span>
          </h1>
          <p className="text-gold/90 text-sm md:text-base font-semibold mb-4">
            Africa's Most Influential Voices Advancing Education
          </p>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            From sports legends and music icons to digital creators and public advocates,
            discover Africans transforming influence into measurable education impact.
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto mb-10">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gold/20 bg-white/5 px-3 py-3 text-center"
              >
                <div className="font-display text-xl md:text-2xl font-bold text-gold leading-none">
                  {s.value}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-white/55 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link to={NOMINATE_URL("social-media")}>
              <Button
                size="lg"
                className="bg-gold hover:bg-gold/90 text-charcoal font-semibold gap-2"
              >
                <Sparkles className="h-4 w-4" /> Nominate an Influencer
              </Button>
            </Link>
            <a href="#nominees">
              <Button
                size="lg"
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10 gap-2"
              >
                <Search className="h-4 w-4" /> Explore Existing Nominees
              </Button>
            </a>
            <Link to="/nrc/apply">
              <Button
                size="lg"
                variant="ghost"
                className="text-white/80 hover:text-gold hover:bg-white/5 gap-2"
              >
                <ShieldCheck className="h-4 w-4" /> Become a Reviewer
              </Button>
            </Link>
            <Link to="/earn-agc">
              <Button
                size="lg"
                variant="ghost"
                className="text-white/80 hover:text-gold hover:bg-white/5 gap-2"
              >
                <Coins className="h-4 w-4" /> Earn AGC Voting Coin
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
