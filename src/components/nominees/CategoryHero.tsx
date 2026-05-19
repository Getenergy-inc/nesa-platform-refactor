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
  voteHref = "/vote",
  nominateHref = "/nominate",
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-charcoal-light via-charcoal to-charcoal mb-8 md:mb-10"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative p-6 md:p-10">
        <Badge className="mb-4 bg-gold/15 text-gold border-gold/30">
          <Sparkles className="w-3 h-3 mr-1" /> {eyebrow}
        </Badge>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-ivory mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-ivory/70 max-w-2xl text-base md:text-lg mb-6">
          {description}
        </p>

        <div className="flex flex-wrap gap-5 mb-7 text-sm">
          <div className="flex items-center gap-2 text-ivory/80">
            <Users className="w-4 h-4 text-gold" />
            <span className="font-semibold text-ivory">{nomineeCount.toLocaleString()}</span> nominees
          </div>
          {subcategoryCount !== undefined && subcategoryCount > 0 && (
            <div className="flex items-center gap-2 text-ivory/80">
              <Trophy className="w-4 h-4 text-gold" />
              <span className="font-semibold text-ivory">{subcategoryCount}</span> subcategories
            </div>
          )}
          {countryCount !== undefined && countryCount > 0 && (
            <div className="flex items-center gap-2 text-ivory/80">
              <span className="font-semibold text-ivory">{countryCount}</span> countries
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={voteHref}>
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-7 gap-2">
              <Trophy className="w-4 h-4" /> Vote Now
            </Button>
          </Link>
          <Link to={nominateHref}>
            <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-7 gap-2">
              Nominate <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
