import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
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

export function InteractiveAfricaMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const hoveredHub = hoveredRegion ? REGION_HUBS.find(r => r.slug === hoveredRegion) : null;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal" />

      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold mb-4 tracking-widest uppercase">
            Explore Africa's Regions
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            One Continent, <span className="text-primary">Ten Regions</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Discover the education champions, cultural heritage, and edu-tourism opportunities across Africa's diverse regions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* SVG Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <svg viewBox="40 0 380 420" className="w-full max-w-md mx-auto" aria-label="Interactive map of Africa's regions">
              {/* Background glow */}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {Object.entries(REGION_PATHS).map(([slug, { path, labelX, labelY }]) => {
                const hub = REGION_HUBS.find(r => r.slug === slug);
                if (!hub) return null;
                const isHovered = hoveredRegion === slug;

                return (
                  <Link key={slug} to={`/region/${slug}`}>
                    <g
                      onMouseEnter={() => setHoveredRegion(slug)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      className="cursor-pointer"
                    >
                      <path
                        d={path}
                        fill={isHovered ? hub.mapColor : "hsl(var(--primary) / 0.15)"}
                        stroke={isHovered ? hub.mapColor : "hsl(var(--primary) / 0.4)"}
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        filter={isHovered ? "url(#glow)" : undefined}
                        className="transition-all duration-300"
                      />
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        fill={isHovered ? "white" : "hsl(var(--primary) / 0.7)"}
                        fontSize={isHovered ? "10" : "8"}
                        fontWeight={isHovered ? "bold" : "normal"}
                        className="transition-all duration-300 pointer-events-none select-none"
                      >
                        {hub.shortName}
                      </text>
                    </g>
                  </Link>
                );
              })}
            </svg>
          </motion.div>

          {/* Region Info Panel / Grid */}
          <div className="space-y-3">
            {hoveredHub ? (
              <motion.div
                key={hoveredHub.slug}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{hoveredHub.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{hoveredHub.tagline}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{hoveredHub.description.slice(0, 150)}...</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hoveredHub.countries.slice(0, 5).map(c => (
                    <span key={c} className="px-2 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs">{c}</span>
                  ))}
                  {hoveredHub.countries.length > 5 && (
                    <span className="px-2 py-1 text-white/40 text-xs">+{hoveredHub.countries.length - 5} more</span>
                  )}
                </div>
                <Link
                  to={`/region/${hoveredHub.slug}`}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
                >
                  Explore {hoveredHub.shortName} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {REGION_HUBS.map(hub => (
                  <Link
                    key={hub.slug}
                    to={`/region/${hub.slug}`}
                    onMouseEnter={() => setHoveredRegion(hub.slug)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    className="group flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 hover:bg-primary/10 hover:border-primary/30 transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
                    <span className="text-white/70 group-hover:text-white text-sm font-medium transition-colors truncate">
                      {hub.shortName === "Islands" ? "Indian Ocean" : hub.shortName === "Friends" ? "Friends of Africa" : hub.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveAfricaMap;
