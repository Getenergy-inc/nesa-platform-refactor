import { Link } from "react-router-dom";
import { Music, Smartphone, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  NOMINATE_URL,
  type CategoryId,
} from "@/config/awards/influencerImpact2026";

const ICONS: Record<CategoryId, typeof Music> = {
  "social-media": Smartphone,
  sports: Trophy,
  music: Music,
};

interface Props {
  onSelectCategory: (id: CategoryId) => void;
  selected: CategoryId | "all";
}

export function CategoryCards({ onSelectCategory, selected }: Props) {
  return (
    <section className="py-14 border-t border-white/5">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Three <span className="text-primary">Recognition Categories</span>
          </h2>
          <p className="text-white/65 max-w-2xl mx-auto text-sm md:text-base">
            Every nominee is classified by category-specific taxonomies — never
            by a single default genre, sport, or platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.id];
            const isSelected = selected === cat.id;
            return (
              <article
                key={cat.id}
                className={`group rounded-2xl border bg-gradient-to-br ${cat.accent} p-6 transition-all hover:border-gold/50 ${
                  isSelected ? "border-gold ring-2 ring-gold/40" : "border-white/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-xl bg-charcoal/60 border border-gold/30 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-gold font-bold">
                    Category {CATEGORIES.indexOf(cat) + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2 leading-snug">
                  {cat.title}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed mb-4">
                  {cat.description}
                </p>

                <div className="space-y-3 mb-5">
                  <ClassificationPreview
                    label={cat.primaryFieldLabel}
                    options={cat.primaryFieldOptions.slice(0, 4)}
                    total={cat.primaryFieldOptions.length}
                  />
                  <ClassificationPreview
                    label={cat.impactFieldLabel}
                    options={cat.impactFieldOptions.slice(0, 3)}
                    total={cat.impactFieldOptions.length}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold/80 transition"
                  >
                    {cat.ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <Link
                    to={NOMINATE_URL(cat.id)}
                    className="ml-auto"
                    aria-label={`Nominate in ${cat.shortName}`}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/70 hover:text-gold hover:bg-white/5 text-xs h-7 px-2"
                    >
                      Nominate →
                    </Button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ClassificationPreview({
  label,
  options,
  total,
}: {
  label: string;
  options: readonly string[];
  total: number;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/45 mb-1.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <span
            key={o}
            className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70"
          >
            {o}
          </span>
        ))}
        {total > options.length && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-gold/10 border border-gold/20 text-gold">
            +{total - options.length} more
          </span>
        )}
      </div>
    </div>
  );
}
