import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EnrichedDatabaseNominee } from "@/hooks/useNominees";

interface Props {
  nominees: EnrichedDatabaseNominee[];
  title?: string;
}

export function FeaturedNomineeSpotlight({ nominees, title = "Featured Nominees" }: Props) {
  if (!nominees.length) return null;
  const top = nominees.slice(0, 3);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl md:text-2xl font-bold text-ivory flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          {title}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {top.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/nominees/${encodeURIComponent(n.slug)}`}
              className="block group relative overflow-hidden rounded-2xl border border-gold/20 hover:border-gold/50 transition-all bg-gradient-to-br from-charcoal-light to-charcoal h-full"
            >
              <div className="aspect-[4/3] overflow-hidden bg-charcoal-light flex items-center justify-center">
                <img
                  src={n.photoUrl}
                  alt={n.name}
                  loading="lazy"
                  className={n.imageType === "logo"
                    ? "object-contain max-h-full max-w-full p-6 group-hover:scale-105 transition-transform duration-500"
                    : "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gold/15 text-gold border-gold/30 text-[10px]">
                    #{i + 1} Featured
                  </Badge>
                  {n.isPlatinum && (
                    <Award className="w-4 h-4 text-gold" />
                  )}
                </div>
                <h3 className="font-semibold text-ivory group-hover:text-gold transition-colors line-clamp-1">
                  {n.name}
                </h3>
                <p className="text-xs text-ivory/60 line-clamp-1 mt-1">
                  {n.subcategoryName}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
