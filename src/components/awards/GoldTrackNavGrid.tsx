import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ThumbsUp } from "lucide-react";
import { GOLD_CATEGORIES } from "@/data/goldSpecialRecognition";

export function GoldTrackNavGrid() {
  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-charcoal to-charcoal-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
            Three cultural tracks
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mt-2">
            Influencers Education Impact 2026
          </h2>
          <p className="text-ivory/60 max-w-2xl mx-auto mt-2 text-sm md:text-base">
            Sport, music and digital voices using their platforms to advance
            African education.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {GOLD_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            const totalVotes = cat.nominees.reduce(
              (s, n) => s + (n.votes || 0),
              0
            );
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/nominees/gold-special-recognition/${cat.slug}`}
                  className="block h-full rounded-2xl border border-gold/20 hover:border-gold/60 bg-charcoal p-6 transition-all group hover:shadow-[0_20px_50px_-20px_hsl(42_85%_52%/0.4)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    {Icon && (
                      <div className="w-11 h-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-charcoal transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                    <span className="text-[10px] uppercase tracking-wider text-gold/80">
                      {cat.shortName}
                    </span>
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-ivory mb-2 group-hover:text-gold transition-colors leading-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-ivory/65 line-clamp-3 mb-4">
                    {cat.pageTitle}
                  </p>

                  <div className="grid grid-cols-2 gap-2 border-t border-gold/10 pt-3 mb-4">
                    <div>
                      <div className="text-lg font-bold text-gold">
                        {cat.nominees.length}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-ivory/50">
                        Nominees
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gold flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {totalVotes.toLocaleString()}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-ivory/50">
                        Votes cast
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold group-hover:gap-2 transition-all">
                    Open track <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default GoldTrackNavGrid;
