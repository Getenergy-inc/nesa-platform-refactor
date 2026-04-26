import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Globe2, Users, Sparkles } from "lucide-react";
import { REGION_HUBS } from "@/config/regionHubs";

// Simplified Africa map regions as SVG paths (approximate positions)
const REGION_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  "north-africa": {
    path: "M 140,20 L 280,15 L 310,40 L 320,80 L 300,110 L 250,120 L 200,130 L 160,120 L 130,100 L 120,60 Z",
    labelX: 220, labelY: 70,
  },
  "west-africa": {
    path: "M 80,130 L 160,120 L 200,130 L 190,160 L 170,190 L 140,200 L 110,195 L 80,180 L 65,160 Z",
    labelX: 135, labelY: 165,
  },
  "sahel": {
    path: "M 160,110 L 250,115 L 260,130 L 250,145 L 200,150 L 165,140 L 155,125 Z",
    labelX: 205, labelY: 130,
  },
  "central-africa": {
    path: "M 170,190 L 200,150 L 250,145 L 270,160 L 275,200 L 260,230 L 220,240 L 190,225 L 175,205 Z",
    labelX: 225, labelY: 195,
  },
  "horn-of-africa": {
    path: "M 300,110 L 330,100 L 360,120 L 350,155 L 320,170 L 290,150 L 280,130 Z",
    labelX: 320, labelY: 135,
  },
  "east-africa": {
    path: "M 270,160 L 320,170 L 335,200 L 330,250 L 310,280 L 280,270 L 260,240 L 260,200 Z",
    labelX: 295, labelY: 220,
  },
  "southern-africa": {
    path: "M 200,280 L 260,270 L 310,280 L 310,320 L 290,360 L 260,380 L 230,375 L 200,350 L 190,310 Z",
    labelX: 255, labelY: 330,
  },
  "indian-ocean-islands": {
    path: "M 350,260 L 370,255 L 380,275 L 375,295 L 355,300 L 345,280 Z",
    labelX: 362, labelY: 278,
  },
};

const MAP_SLUGS = Object.keys(REGION_PATHS);

export function InteractiveAfricaMap() {
  const [activeSlug, setActiveSlug] = useState<string>("west-africa");
  const [isHovering, setIsHovering] = useState(false);

  const mapHubs = useMemo(
    () => REGION_HUBS.filter((h) => MAP_SLUGS.includes(h.slug)),
    []
  );

  // Auto-rotate through regions every 4s when not hovering
  useEffect(() => {
    if (isHovering) return;
    const id = setInterval(() => {
      setActiveSlug((prev) => {
        const idx = MAP_SLUGS.indexOf(prev);
        return MAP_SLUGS[(idx + 1) % MAP_SLUGS.length];
      });
    }, 4000);
    return () => clearInterval(id);
  }, [isHovering]);

  const activeHub = REGION_HUBS.find((r) => r.slug === activeSlug);
  const diasporaHub = REGION_HUBS.find((r) => r.slug === "diaspora");
  const friendsHub = REGION_HUBS.find((r) => r.slug === "friends-of-africa");

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/98 to-charcoal" />
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))_0%,transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--primary))_0%,transparent_50%)]" />

      <div className="container relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold mb-5 tracking-widest uppercase">
            <Globe2 className="w-3.5 h-3.5" /> Explore Africa's Regions
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            One Continent, <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent">Ten Regions</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg">
            Discover education champions, cultural heritage, and edu-tourism opportunities across Africa's diverse regions.
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* SVG Map — left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-6 relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <svg viewBox="40 0 380 420" className="w-full max-w-lg mx-auto" aria-label="Interactive map of Africa's regions">
                <defs>
                  <filter id="map-glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="active-fill" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                  </radialGradient>
                </defs>

                {Object.entries(REGION_PATHS).map(([slug, { path, labelX, labelY }]) => {
                  const hub = REGION_HUBS.find((r) => r.slug === slug);
                  if (!hub) return null;
                  const isActive = activeSlug === slug;

                  return (
                    <g
                      key={slug}
                      onMouseEnter={() => setActiveSlug(slug)}
                      onClick={() => setActiveSlug(slug)}
                      className="cursor-pointer"
                    >
                      <path
                        d={path}
                        fill={isActive ? "url(#active-fill)" : "hsl(var(--primary) / 0.12)"}
                        stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.35)"}
                        strokeWidth={isActive ? 2.5 : 1.25}
                        filter={isActive ? "url(#map-glow)" : undefined}
                        className="transition-all duration-500"
                      />
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        fill={isActive ? "white" : "hsl(var(--primary) / 0.7)"}
                        fontSize={isActive ? "11" : "8.5"}
                        fontWeight={isActive ? "700" : "500"}
                        className="transition-all duration-300 pointer-events-none select-none"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                      >
                        {hub.shortName}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Auto-rotate indicator */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-white/40">
                <Sparkles className="w-3 h-3 text-primary/60" />
                <span>{isHovering ? "Hover to explore" : "Auto-rotating regions"}</span>
              </div>
            </div>
          </motion.div>

          {/* Info panel — right */}
          <div className="lg:col-span-6 space-y-4">
            <AnimatePresence mode="wait">
              {activeHub && (
                <motion.div
                  key={activeHub.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-primary/20 rounded-2xl p-6 md:p-8 overflow-hidden"
                >
                  {/* Accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, ${activeHub.mapColor}, hsl(var(--primary)))` }}
                  />

                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-1">{activeHub.name}</h3>
                      <p className="text-primary text-sm font-medium">{activeHub.tagline}</p>
                    </div>
                    <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <p className="text-white/70 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">
                    {activeHub.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {activeHub.countries.slice(0, 5).map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-medium"
                      >
                        {c}
                      </span>
                    ))}
                    {activeHub.countries.length > 5 && (
                      <span className="px-2.5 py-1 text-white/40 text-xs">+{activeHub.countries.length - 5} more</span>
                    )}
                  </div>

                  <Link
                    to={`/region/${activeHub.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-charcoal hover:bg-primary/90 font-semibold text-sm rounded-lg transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105"
                  >
                    Explore {activeHub.shortName} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Beyond-the-map: Diaspora + Friends */}
            <div className="grid sm:grid-cols-2 gap-3">
              {[diasporaHub, friendsHub].filter(Boolean).map((hub) => (
                <Link
                  key={hub!.slug}
                  to={`/region/${hub!.slug}`}
                  className="group relative bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-primary/5 hover:border-primary/30 transition-all overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      {hub!.slug === "diaspora" ? (
                        <Globe2 className="w-4 h-4 text-primary" />
                      ) : (
                        <Users className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <h4 className="text-white font-semibold text-sm group-hover:text-primary transition-colors">
                      {hub!.name}
                    </h4>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{hub!.tagline}</p>
                  <ArrowRight className="absolute top-4 right-4 w-3.5 h-3.5 text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            {/* Stats footer */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center bg-white/[0.02] border border-white/5 rounded-lg py-3">
                <div className="text-primary font-display text-xl font-bold">10</div>
                <div className="text-white/50 text-[10px] uppercase tracking-wider">Regions</div>
              </div>
              <div className="text-center bg-white/[0.02] border border-white/5 rounded-lg py-3">
                <div className="text-primary font-display text-xl font-bold">54</div>
                <div className="text-white/50 text-[10px] uppercase tracking-wider">Countries</div>
              </div>
              <div className="text-center bg-white/[0.02] border border-white/5 rounded-lg py-3">
                <div className="text-primary font-display text-xl font-bold">1B+</div>
                <div className="text-white/50 text-[10px] uppercase tracking-wider">Reached</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveAfricaMap;
