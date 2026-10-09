import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, type LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NomineeImage } from "@/components/shared/NomineeImage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FlashNominee {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  photo_url: string | null;
  logo_url: string | null;
  region: string | null;
  is_platinum: boolean;
}

interface RecognitionFlashCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Category slug patterns to match (ILIKE) — e.g. ['%csr%'] */
  categorySlugPatterns: string[];
  /** Where to send users to explore more nominees in this layer */
  exploreHref: string;
  /** Fallback gradient seed (0-3) */
  toneIndex?: number;
}

const tones = [
  "from-gold/30 via-gold/10 to-charcoal",
  "from-gold/25 via-charcoal to-charcoal",
  "from-gold/20 via-gold/5 to-charcoal",
  "from-gold/15 via-charcoal to-charcoal",
];

export function RecognitionFlashCard({
  icon: Icon,
  title,
  description,
  categorySlugPatterns,
  exploreHref,
  toneIndex = 0,
}: RecognitionFlashCardProps) {
  const [nominees, setNominees] = useState<FlashNominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Fetch real nominees matching this layer
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        // Find subcategory ids that belong to matching categories
        const orFilter = categorySlugPatterns.map((p) => `slug.ilike.${p}`).join(",");
        const { data: cats } = await supabase
          .from("categories")
          .select("id")
          .or(orFilter);

        const catIds = (cats ?? []).map((c) => c.id);
        if (catIds.length === 0) {
          if (!cancelled) {
            setNominees([]);
            setLoading(false);
          }
          return;
        }

        const { data: subs } = await supabase
          .from("subcategories")
          .select("id")
          .in("category_id", catIds);

        const subIds = (subs ?? []).map((s) => s.id);
        if (subIds.length === 0) {
          if (!cancelled) {
            setNominees([]);
            setLoading(false);
          }
          return;
        }

        const { data: noms } = await supabase
          .from("nominees")
          .select(
            "id, name, slug, title, organization, photo_url, logo_url, region, is_platinum"
          )
          .in("subcategory_id", subIds)
          .in("status", ["approved", "platinum"])
          .order("name", { ascending: true })
          .limit(8);

        if (!cancelled) {
          setNominees((noms ?? []) as FlashNominee[]);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setNominees([]);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [categorySlugPatterns.join(",")]);

  // Auto-rotate flash images
  useEffect(() => {
    if (paused || nominees.length < 2) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % nominees.length);
    }, 4000);
    return () => clearInterval(t);
  }, [paused, nominees.length]);

  const next = () => setActiveIndex((i) => (i + 1) % Math.max(nominees.length, 1));
  const prev = () =>
    setActiveIndex((i) => (i - 1 + Math.max(nominees.length, 1)) % Math.max(nominees.length, 1));

  const current = nominees[activeIndex];
  const tone = tones[toneIndex % tones.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-charcoal-light/40 backdrop-blur-sm hover:border-gold/40 transition-colors"
    >
      {/* Background gradient layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${tone} opacity-60 pointer-events-none`} />
      <div className="absolute inset-0 bg-charcoal/30 pointer-events-none" />

      {/* Decorative icon */}
      <div className="pointer-events-none absolute -right-6 -top-6 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity">
        <Icon className="h-44 w-44 text-gold" strokeWidth={1} />
      </div>

      <div className="relative p-6 flex flex-col h-full min-h-[340px]">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <Icon className="h-6 w-6 text-gold" />
          </div>
          <div className="flex-1">
            <h4 className="font-display text-lg md:text-xl font-bold text-white mb-1.5">{title}</h4>
            <p className="text-white/65 text-xs md:text-sm leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Flash image stage */}
        <div className="relative flex-1 rounded-xl bg-charcoal/60 border border-gold/20 overflow-hidden min-h-[150px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center gap-4 p-4">
              <Skeleton className="h-20 w-20 rounded-full bg-white/5" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-white/5" />
                <Skeleton className="h-3 w-1/2 bg-white/5" />
                <Skeleton className="h-3 w-2/3 bg-white/5" />
              </div>
            </div>
          ) : nominees.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <Sparkles className="h-7 w-7 text-gold/40 mb-2" />
              <p className="text-white/50 text-xs">Nominations opening soon for this layer.</p>
              <Link
                to={exploreHref}
                className="mt-2 text-gold text-xs font-semibold hover:underline inline-flex items-center gap-1"
              >
                Be the first to nominate <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0 flex items-center gap-4 p-4"
                >
                  <NomineeImage
                    src={current?.photo_url || current?.logo_url}
                    alt={current?.name || ""}
                    name={current?.name || ""}
                    type={current?.organization && !current?.photo_url ? "logo" : "photo"}
                    size="xl"
                    showBorder
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/nominees/${encodeURIComponent(current?.slug || "")}`}
                      className="block"
                    >
                      <h5 className="font-display text-base md:text-lg font-bold text-white truncate group-hover:text-gold transition-colors hover:text-gold">
                        {current?.name}
                      </h5>
                    </Link>
                    {current?.organization && (
                      <p className="text-white/70 text-xs md:text-sm truncate">
                        {current.organization}
                      </p>
                    )}
                    {current?.title && !current?.organization && (
                      <p className="text-white/70 text-xs md:text-sm truncate">{current.title}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {current?.region && (
                        <span className="text-[10px] uppercase tracking-wider text-gold/80 bg-gold/10 border border-gold/30 px-2 py-0.5 rounded-full">
                          {current.region}
                        </span>
                      )}
                      {current?.is_platinum && (
                        <span className="text-[10px] uppercase tracking-wider text-charcoal bg-gold px-2 py-0.5 rounded-full font-bold">
                          Platinum
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              {nominees.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous nominee"
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-charcoal/70 border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-colors flex items-center justify-center"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next nominee"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-charcoal/70 border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-colors flex items-center justify-center"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Indicator dots */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                    {nominees.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Go to nominee ${i + 1}`}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === activeIndex ? "w-5 bg-gold" : "w-1.5 bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] text-white/50">
            {nominees.length > 0 ? `${nominees.length}+ nominees featured` : "Open for nominations"}
          </span>
          <Link to={exploreHref}>
            <Button
              size="sm"
              variant="ghost"
              className="text-gold hover:bg-gold/10 hover:text-gold gap-1 text-xs"
            >
              Explore <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default RecognitionFlashCard;
