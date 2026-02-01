import { motion } from "framer-motion";

// NESA-Africa's 5 Strategic Objectives for Vision 2035
const objectives = [
  {
    id: 1,
    title: "Recognition",
    description: "Celebrate and recognize education excellence across all African regions",
    color: "hsl(var(--gold))",
    bridgeColor: "#D4AF37",
    regions: ["North", "West"],
  },
  {
    id: 2,
    title: "Accountability",
    description: "Establish transparent standards and governance for education quality",
    color: "hsl(45 93% 47%)",
    bridgeColor: "#E6B800",
    regions: ["West", "Central"],
  },
  {
    id: 3,
    title: "Continental Unity",
    description: "Bridge regional divides through collaborative education initiatives",
    color: "hsl(200 80% 50%)",
    bridgeColor: "#1E90FF",
    regions: ["Central", "East"],
  },
  {
    id: 4,
    title: "Inclusion",
    description: "Ensure no child is left behind regardless of location or circumstance",
    color: "hsl(150 60% 45%)",
    bridgeColor: "#2ECC71",
    regions: ["East", "South"],
  },
  {
    id: 5,
    title: "Legacy Impact",
    description: "Create lasting educational transformation for future generations",
    color: "hsl(280 60% 55%)",
    bridgeColor: "#9B59B6",
    regions: ["South", "North"],
  },
];

// SVG paths for simplified Africa regions
const regionPaths = {
  North: "M 150 40 L 250 30 L 320 50 L 340 100 L 300 130 L 240 120 L 180 130 L 130 100 L 120 60 Z",
  West: "M 80 130 L 130 100 L 180 130 L 200 180 L 180 230 L 130 250 L 90 220 L 70 170 Z",
  Central: "M 180 130 L 240 120 L 280 150 L 290 220 L 260 280 L 200 280 L 180 230 L 200 180 Z",
  East: "M 280 150 L 340 100 L 380 130 L 390 200 L 360 270 L 310 290 L 260 280 L 290 220 Z",
  South: "M 180 280 L 260 280 L 310 290 L 330 350 L 290 420 L 230 440 L 180 400 L 160 340 Z",
};

// Region center points for bridge connections
const regionCenters = {
  North: { x: 230, y: 80 },
  West: { x: 130, y: 175 },
  Central: { x: 235, y: 200 },
  East: { x: 330, y: 200 },
  South: { x: 245, y: 360 },
};

// Bridge paths connecting regions
const bridgePaths = [
  { from: "North", to: "West", curve: "M 200 95 Q 150 120 145 155" },
  { from: "West", to: "Central", curve: "M 165 185 Q 195 175 210 185" },
  { from: "Central", to: "East", curve: "M 265 195 Q 285 180 305 195" },
  { from: "East", to: "South", curve: "M 320 235 Q 310 290 285 320" },
  { from: "South", to: "North", curve: "M 245 320 Q 350 200 280 95" },
];

export function AfricaRegionsMap() {
  return (
    <section className="py-16 lg:py-24 bg-charcoal/95">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            5 Regions, 5 Bridges, One Vision
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Connecting Africa's five regions through strategic objectives to achieve{" "}
            <span className="text-gold font-semibold">Education for All by 2035</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* SVG Map */}
          <div className="relative flex justify-center">
            <svg
              viewBox="0 0 460 480"
              className="w-full max-w-md h-auto"
              aria-label="Map of Africa showing 5 regions connected by bridges"
            >
              {/* Background glow */}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Region shapes */}
              {Object.entries(regionPaths).map(([region, path], index) => (
                <motion.path
                  key={region}
                  d={path}
                  fill="url(#mapGradient)"
                  stroke="hsl(var(--gold))"
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="hover:fill-gold/30 transition-colors cursor-pointer"
                />
              ))}

              {/* Region labels */}
              {Object.entries(regionCenters).map(([region, pos]) => (
                <text
                  key={`label-${region}`}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  className="fill-white text-xs font-semibold"
                  style={{ fontSize: "11px" }}
                >
                  {region}
                </text>
              ))}

              {/* Bridges with animation */}
              {bridgePaths.map((bridge, index) => (
                <motion.g key={`bridge-${index}`}>
                  {/* Bridge shadow */}
                  <motion.path
                    d={bridge.curve}
                    fill="none"
                    stroke={objectives[index].bridgeColor}
                    strokeWidth="8"
                    strokeOpacity="0.3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                  />
                  {/* Main bridge */}
                  <motion.path
                    d={bridge.curve}
                    fill="none"
                    stroke={objectives[index].bridgeColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                  />
                  {/* Bridge number indicator */}
                  <motion.circle
                    cx={
                      (regionCenters[bridge.from as keyof typeof regionCenters].x +
                        regionCenters[bridge.to as keyof typeof regionCenters].x) /
                      2
                    }
                    cy={
                      (regionCenters[bridge.from as keyof typeof regionCenters].y +
                        regionCenters[bridge.to as keyof typeof regionCenters].y) /
                      2
                    }
                    r="12"
                    fill={objectives[index].bridgeColor}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + index * 0.2, duration: 0.3 }}
                  />
                  <motion.text
                    x={
                      (regionCenters[bridge.from as keyof typeof regionCenters].x +
                        regionCenters[bridge.to as keyof typeof regionCenters].x) /
                      2
                    }
                    y={
                      (regionCenters[bridge.from as keyof typeof regionCenters].y +
                        regionCenters[bridge.to as keyof typeof regionCenters].y) /
                        2 +
                      4
                    }
                    textAnchor="middle"
                    className="fill-charcoal font-bold"
                    style={{ fontSize: "10px" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.2 }}
                  >
                    {index + 1}
                  </motion.text>
                </motion.g>
              ))}
            </svg>
          </div>

          {/* Objectives List */}
          <div className="space-y-4">
            {objectives.map((objective, index) => (
              <motion.div
                key={objective.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                {/* Number badge */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-charcoal"
                  style={{ backgroundColor: objective.bridgeColor }}
                >
                  {objective.id}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1">
                    {objective.title}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {objective.description}
                  </p>
                  <p className="text-xs mt-2" style={{ color: objective.bridgeColor }}>
                    {objective.regions[0]} → {objective.regions[1]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-gold/10 border border-gold/30">
            <span className="text-gold font-display text-xl md:text-2xl font-semibold">
              "Achieving Education for All in Africa"
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AfricaRegionsMap;
