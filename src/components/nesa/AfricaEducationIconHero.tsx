import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, ArrowRight, ChevronLeft, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NomineeImage } from "@/components/shared/NomineeImage";
import { supabase } from "@/integrations/supabase/client";

interface IconNominee {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  photo_url: string | null;
  logo_url: string | null;
  region: string | null;
  country: string | null;
  is_platinum: boolean;
  subcategory_id: string | null;
}

type Layer = "Africa-Based" | "Diaspora" | "Friends of Africa";

interface SlideNominee extends IconNominee {
  layer: Layer;
}

// Fallback nominees — used when DB has no Icon-tagged nominees yet
const fallbackNominees: SlideNominee[] = [
  {
    id: "fallback-1",
    name: "Her Highness Sheikha Moza bint Nasser",
    slug: "moza-bint-nasser",
    title: "Chairperson, Education Above All Foundation",
    organization: "Education Above All",
    photo_url:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80",
    logo_url: null,
    region: "Global Partner",
    country: "Qatar",
    is_platinum: true,
    subcategory_id: null,
    layer: "Friends of Africa",
  },
  {
    id: "fallback-2",
    name: "Africa-Based Education Icon",
    slug: "africa-based-icon",
    title: "Transformational leader advancing education across Africa",
    organization: null,
    photo_url:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80",
    logo_url: null,
    region: "West Africa",
    country: "Nigeria",
    is_platinum: false,
    subcategory_id: null,
    layer: "Africa-Based",
  },
  {
    id: "fallback-3",
    name: "Diaspora African Education Icon",
    slug: "diaspora-icon",
    title: "African changemaker expanding learning impact globally",
    organization: null,
    photo_url:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80",
    logo_url: null,
    region: "African Diaspora",
    country: "United Kingdom",
    is_platinum: false,
    subcategory_id: null,
    layer: "Diaspora",
  },
];

const layers: { key: Layer | "All"; label: string }[] = [
  { key: "All", label: "All Icons" },
  { key: "Africa-Based", label: "Africa-Based" },
  { key: "Diaspora", label: "Diaspora" },
  { key: "Friends of Africa", label: "Friends of Africa" },
];

function classifyLayer(n: IconNominee): Layer {
  const r = (n.region || "").toLowerCase();
  const c = (n.country || "").toLowerCase();
  if (r.includes("diaspora")) return "Diaspora";
  if (r.includes("global") || r.includes("partner") || r.includes("friend")) return "Friends of Africa";
  if (r.includes("africa") || c) return "Africa-Based";
  return "Africa-Based";
}

export function AfricaEducationIconHero() {
  const [nominees, setNominees] = useState<SlideNominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [activeLayer, setActiveLayer] = useState<Layer | "All">("All");

  // Load Icon-Lifetime nominees from DB
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data: cats } = await supabase
          .from("categories")
          .select("id")
          .or("slug.ilike.%icon%,slug.ilike.%lifetime%,name.ilike.%icon%,name.ilike.%lifetime%");

        const catIds = (cats ?? []).map((c) => c.id);
        let nomData: IconNominee[] = [];

        if (catIds.length > 0) {
          const { data: subs } = await supabase
            .from("subcategories")
            .select("id")
            .in("category_id", catIds);
          const subIds = (subs ?? []).map((s) => s.id);

          if (subIds.length > 0) {
            const { data: noms } = await supabase
              .from("nominees")
              .select(
                "id, name, slug, title, organization, photo_url, logo_url, region, country, is_platinum, subcategory_id"
              )
              .in("subcategory_id", subIds)
              .in("status", ["approved", "platinum"])
              .order("is_platinum", { ascending: false })
              .order("name", { ascending: true })
              .limit(12);
            nomData = (noms ?? []) as IconNominee[];
          }
        }

        const enriched: SlideNominee[] = nomData.map((n) => ({
          ...n,
          layer: classifyLayer(n),
        }));

        if (!cancelled) {
          setNominees(enriched.length > 0 ? enriched : fallbackNominees);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setNominees(fallbackNominees);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (activeLayer === "All" ? nominees : nominees.filter((n) => n.layer === activeLayer)),
    [nominees, activeLayer]
  );

  // Reset index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeLayer]);

  // Auto-rotate
  useEffect(() => {
    if (paused || filtered.length < 2) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % filtered.length);
    }, 4500);
    return () => clearInterval(t);
  }, [paused, filtered.length]);

  const current = filtered[activeIndex];
  const next = () => setActiveIndex((i) => (i + 1) % Math.max(filtered.length, 1));
  const prev = () =>
    setActiveIndex((i) => (i - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-3xl overflow-hidden mb-16 border border-gold/40"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-charcoal to-charcoal" />
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative grid lg:grid-cols-2 gap-0">
        {/* ═══ LEFT: Static institutional voice ═══ */}
        <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center text-center lg:text-left">
          <div className="mx-auto lg:mx-0 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15 border border-gold/40 mb-6">
            <Crown className="h-8 w-8 text-gold" />
          </div>

          <p className="text-[11px] tracking-[0.2em] uppercase text-gold/80 font-semibold mb-3">
            Core Brand Pillar
          </p>

          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            Africa Education{" "}
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Icon
            </span>
          </h3>

          <p className="text-gold text-base md:text-lg font-medium mb-5">
            Lifetime Achievement (2006–2026)
          </p>

          <p className="text-white/75 text-sm md:text-base leading-relaxed mb-7 max-w-xl mx-auto lg:mx-0">
            The highest honour and central brand identity of NESA Africa — recognizing
            transformational leaders who have shaped education across the continent over the
            past two decades. This category anchors the entire award system.
          </p>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link to="/awards/icon">
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-bold rounded-full gap-2">
                Explore the Icon Award
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/nominees?category=icon">
              <Button
                variant="outline"
                className="rounded-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold gap-2"
              >
                View All Nominees
              </Button>
            </Link>
          </div>
        </div>

        {/* ═══ RIGHT: Dynamic nominee showcase ═══ */}
        <div
          className="relative p-6 md:p-8 lg:p-10 flex flex-col"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Layer tabs */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center lg:justify-start">
            {layers.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => setActiveLayer(l.key)}
                className={`text-[11px] md:text-xs px-3 py-1.5 rounded-full border transition-all font-semibold tracking-wide uppercase ${
                  activeLayer === l.key
                    ? "bg-gold text-charcoal border-gold"
                    : "bg-charcoal/50 text-white/70 border-gold/20 hover:border-gold/50 hover:text-gold"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Stage */}
          <div className="relative flex-1 min-h-[420px] rounded-2xl overflow-hidden border border-gold/25 bg-charcoal/70">
            {loading ? (
              <div className="absolute inset-0 p-6 space-y-4">
                <Skeleton className="h-64 w-full rounded-xl bg-white/5" />
                <Skeleton className="h-5 w-2/3 bg-white/5" />
                <Skeleton className="h-4 w-1/2 bg-white/5" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <Sparkles className="h-10 w-10 text-gold/50 mb-3" />
                <p className="text-white/70 text-sm">
                  No {activeLayer !== "All" ? activeLayer + " " : ""}Icon nominees yet.
                </p>
                <Link
                  to="/nominate"
                  className="mt-3 text-gold text-sm font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Be the first to nominate <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current?.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    {/* Portrait */}
                    <div className="relative h-[62%] w-full overflow-hidden">
                      {current?.photo_url || current?.logo_url ? (
                        <img
                          src={(current.photo_url || current.logo_url) as string}
                          alt={current.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-charcoal-light">
                          <NomineeImage
                            src={null}
                            alt={current?.name || ""}
                            name={current?.name || ""}
                            type={current?.organization ? "logo" : "photo"}
                            size="xl"
                            showBorder
                          />
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

                      {/* Top badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-charcoal bg-gold px-2.5 py-1 rounded-full">
                          {current?.layer}
                        </span>
                        {current?.is_platinum && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-gold bg-charcoal/80 border border-gold/50 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <Crown className="h-3 w-3" /> Platinum
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <Link to={`/nominees/${encodeURIComponent(current?.slug || "")}`}>
                        <h4 className="font-display text-xl md:text-2xl font-bold text-white leading-tight hover:text-gold transition-colors">
                          {current?.name}
                        </h4>
                      </Link>
                      {(current?.title || current?.organization) && (
                        <p className="text-white/75 text-sm mt-1 line-clamp-2">
                          {current?.title}
                          {current?.title && current?.organization ? " · " : ""}
                          {current?.organization}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {current?.country && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-gold/90 bg-gold/10 border border-gold/30 px-2 py-0.5 rounded-full">
                            <MapPin className="h-3 w-3" />
                            {current.country}
                          </span>
                        )}
                        {current?.region && current.region !== current.country && (
                          <span className="text-[10px] uppercase tracking-wider text-white/70 bg-white/5 border border-white/15 px-2 py-0.5 rounded-full">
                            {current.region}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Controls */}
                {filtered.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous nominee"
                      className="absolute left-2 top-1/3 -translate-y-1/2 h-9 w-9 rounded-full bg-charcoal/80 border border-gold/40 text-gold hover:bg-gold hover:text-charcoal transition-colors flex items-center justify-center backdrop-blur-sm"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next nominee"
                      className="absolute right-2 top-1/3 -translate-y-1/2 h-9 w-9 rounded-full bg-charcoal/80 border border-gold/40 text-gold hover:bg-gold hover:text-charcoal transition-colors flex items-center justify-center backdrop-blur-sm"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Dot indicators */}
          {filtered.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {filtered.map((n, i) => (
                <button
                  key={n.id}
                  type="button"
                  aria-label={`Show ${n.name}`}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeIndex ? "w-8 bg-gold" : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}

          <p className="text-[10px] text-white/40 text-center mt-3">
            {loading
              ? "Loading nominees…"
              : `${filtered.length} ${activeLayer === "All" ? "Icon" : activeLayer} nominee${filtered.length === 1 ? "" : "s"} • auto-rotating`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default AfricaEducationIconHero;
