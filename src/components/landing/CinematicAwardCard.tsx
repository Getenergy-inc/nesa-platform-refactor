import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface CinematicAwardCardProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
  icon?: LucideIcon;
  stats?: { label: string; value: string | number }[];
  accent?: "gold" | "ivory";
}

export function CinematicAwardCard({
  eyebrow,
  title,
  description,
  href,
  ctaLabel = "Explore",
  icon: Icon,
  stats = [],
  accent = "gold",
}: CinematicAwardCardProps) {
  const ring =
    accent === "gold"
      ? "border-gold/25 hover:border-gold/60"
      : "border-ivory/15 hover:border-ivory/40";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        to={href}
        className={`relative block h-full overflow-hidden rounded-2xl border ${ring} bg-gradient-to-br from-charcoal-light to-charcoal p-6 transition-all duration-300 hover:shadow-[0_20px_60px_-20px_hsl(42_85%_52%/0.35)] group`}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,hsl(42_85%_52%/0.12),transparent_60%)] transition-opacity" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            {Icon && <Icon className="w-4 h-4 text-gold" />}
            <span className="text-[11px] uppercase tracking-[0.18em] text-gold/80 font-semibold">
              {eyebrow}
            </span>
          </div>
          <h3 className="font-display text-xl md:text-2xl font-bold text-ivory leading-tight mb-2 group-hover:text-gold transition-colors">
            {title}
          </h3>
          <p className="text-sm text-ivory/70 line-clamp-3 mb-4">{description}</p>

          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-5 border-t border-gold/10 pt-4">
              {stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <div className="text-lg font-bold text-gold">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-ivory/50">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold group-hover:gap-2.5 transition-all">
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
