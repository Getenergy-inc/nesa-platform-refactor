import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  eyebrow?: string;
  title: string;
  description: string;
  nomineeCount: number;
  countryCount?: number;
  subcategoryCount?: number;
  voteHref?: string;
  nominateHref?: string;
}

export function CategoryHero({
  eyebrow = "Award Category",
  title,
  description,
  nomineeCount,
  countryCount,
  subcategoryCount,
  voteHref = "/awards/gold-blue-garnet",
  nominateHref = "/nominate",
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-charcoal-light via-charcoal to-charcoal mb-6 md:mb-8 shadow-[0_0_60px_-15px_rgba(212,175,55,0.25)]"
    >
      {/* Cinematic glow layers */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gold/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      {/* Hairline gold frame */}
      <div className="absolute inset-3 rounded-2xl border border-gold/10 pointer-events-none" />

      <div className="relative px-6 py-10 md:px-10 md:py-14 text-center flex flex-col items-center">
        {/* Trophy icon medallion */}
        <div className="mb-5 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-gold/25 to-gold/5 border border-gold/40 shadow-[0_0_30px_-5px_rgba(212,175,55,0.5)]">
          <Trophy className="w-8 h-8 md:w-10 md:h-10 text-gold" />
        </div>

        <Badge className="mb-4 bg-gold/15 text-gold border-gold/30 uppercase tracking-[0.2em] text-[10px] px-3 py-1">
          <Sparkles className="w-3 h-3 mr-1.5" /> {eyebrow}
        </Badge>

        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-ivory mb-4 leading-[1.1] max-w-4xl">
          {title}
        </h1>

        <p className="text-ivory/70 max-w-2xl text-base md:text-lg mb-6">
          {description}
        </p>

        {/* Stat row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-7 text-sm">
          <div className="flex items-center gap-2 text-ivory/85">
            <Users className="w-4 h-4 text-gold" />
            <span className="font-display text-xl text-gold font-bold">
              {nomineeCount.toLocaleString()}
            </span>
            <span className="text-ivory/60">nominees</span>
          </div>
          {subcategoryCount !== undefined && subcategoryCount > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-gold/40" />
              <div className="flex items-center gap-2 text-ivory/85">
                <span className="font-display text-xl text-gold font-bold">{subcategoryCount}</span>
                <span className="text-ivory/60">subcategories</span>
              </div>
            </>
          )}
          {countryCount !== undefined && countryCount > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-gold/40" />
              <div className="flex items-center gap-2 text-ivory/85">
                <span className="font-display text-xl text-gold font-bold">{countryCount}</span>
                <span className="text-ivory/60">countries</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to={voteHref}>
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-7 gap-2 shadow-lg shadow-gold/20">
              <Trophy className="w-4 h-4" /> Learn More
            </Button>
          </Link>
          <Link to={nominateHref}>
            <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-7 gap-2 bg-charcoal/40 backdrop-blur">
              Nominate <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
