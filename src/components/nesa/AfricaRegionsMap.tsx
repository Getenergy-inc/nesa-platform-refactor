import { motion } from "framer-motion";
import { useState } from "react";

// NESA-Africa's 5 Strategic Objectives for Vision 2035
const objectives = [
  {
    id: 1,
    title: "Recognition",
    description: "Celebrate and recognize education excellence across all African regions",
    bridgeColor: "#D4AF37",
    regions: ["North", "West"],
  },
  {
    id: 2,
    title: "Accountability",
    description: "Establish transparent standards and governance for education quality",
    bridgeColor: "#F59E0B",
    regions: ["West", "Central"],
  },
  {
    id: 3,
    title: "Continental Unity",
    description: "Bridge regional divides through collaborative education initiatives",
    bridgeColor: "#3B82F6",
    regions: ["Central", "East"],
  },
  {
    id: 4,
    title: "Inclusion",
    description: "Ensure no child is left behind regardless of location or circumstance",
    bridgeColor: "#10B981",
    regions: ["East", "Southern"],
  },
  {
    id: 5,
    title: "Legacy Impact",
    description: "Create lasting educational transformation for future generations",
    bridgeColor: "#8B5CF6",
    regions: ["Southern", "North"],
  },
];

// Realistic Africa continent outline and regional paths
const africaOutline = `M 245 45 
  C 280 40, 320 45, 355 55 
  L 375 70 L 390 95 L 395 125 
  C 398 145, 395 165, 390 180 
  L 380 200 L 385 230 L 395 260 
  C 400 290, 395 320, 380 350 
  L 360 380 L 340 410 
  C 320 435, 290 455, 260 465 
  L 230 470 L 200 460 
  C 175 450, 155 430, 145 405 
  L 140 375 L 145 345 L 155 315 
  C 160 290, 155 265, 145 240 
  L 130 210 L 115 180 
  C 105 155, 110 130, 125 110 
  L 145 90 L 170 70 
  C 195 55, 220 48, 245 45 Z`;

// Regional paths (simplified polygons for each region)
const regionPaths = {
  North: {
    path: `M 175 70 L 245 50 L 320 55 L 370 75 L 385 110 L 375 145 L 340 160 L 280 165 L 220 170 L 165 155 L 145 120 L 155 90 Z`,
    center: { x: 265, y: 110 },
    label: "North Africa"
  },
  West: {
    path: `M 115 165 L 165 155 L 220 170 L 225 200 L 210 240 L 175 270 L 140 280 L 110 250 L 105 210 L 110 180 Z`,
    center: { x: 160, y: 215 },
    label: "West Africa"
  },
  Central: {
    path: `M 220 170 L 280 165 L 310 185 L 320 230 L 310 280 L 280 310 L 240 310 L 210 285 L 210 240 L 225 200 Z`,
    center: { x: 265, y: 240 },
    label: "Central Africa"
  },
  East: {
    path: `M 310 185 L 340 160 L 375 145 L 390 175 L 395 220 L 385 265 L 365 305 L 335 335 L 300 340 L 280 310 L 310 280 L 320 230 Z`,
    center: { x: 345, y: 245 },
    label: "East Africa"
  },
  Southern: {
    path: `M 175 310 L 240 310 L 280 310 L 300 340 L 310 380 L 295 420 L 265 450 L 225 460 L 185 445 L 160 410 L 155 370 L 160 335 Z`,
    center: { x: 235, y: 385 },
    label: "Southern Africa"
  },
};

// Bridge connection points
const bridgeConnections = [
  { from: regionPaths.North.center, to: regionPaths.West.center, objective: 0 },
  { from: regionPaths.West.center, to: regionPaths.Central.center, objective: 1 },
  { from: regionPaths.Central.center, to: regionPaths.East.center, objective: 2 },
  { from: regionPaths.East.center, to: regionPaths.Southern.center, objective: 3 },
  { from: regionPaths.Southern.center, to: regionPaths.North.center, objective: 4 },
];

export function AfricaRegionsMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredObjective, setHoveredObjective] = useState<number | null>(null);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-charcoal to-charcoal/95">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6"
          >
            <span className="text-sm font-medium text-gold">Continental Strategy</span>
          </motion.div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            5 Regions, 5 Bridges, One Vision
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Connecting Africa's five regions through strategic objectives to achieve{" "}
            <span className="text-gold font-semibold">Education for All by 2035</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* SVG Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center order-2 lg:order-1"
          >
            <div className="relative">
              {/* Glow effect behind map */}
              <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
              
              <svg
                viewBox="80 30 340 460"
                className="w-full max-w-lg h-auto relative z-10"
                aria-label="Map of Africa showing 5 regions connected by bridges"
              >
                <defs>
                  {/* Gradient for regions */}
                  <linearGradient id="regionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(45 93% 47%)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="hsl(45 93% 47%)" stopOpacity="0.05" />
                  </linearGradient>
                  
                  {/* Glow filter */}
                  <filter id="bridgeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Drop shadow */}
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.3"/>
                  </filter>
                </defs>

                {/* Africa continent outline (shadow) */}
                <motion.path
                  d={africaOutline}
                  fill="none"
                  stroke="hsl(45 93% 47%)"
                  strokeWidth="2"
                  strokeOpacity="0.3"
                  filter="url(#shadow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                />

                {/* Regional shapes */}
                {Object.entries(regionPaths).map(([region, data], index) => (
                  <motion.g key={region}>
                    <motion.path
                      d={data.path}
                      fill={hoveredRegion === region ? "hsl(45 93% 47% / 0.25)" : "url(#regionGradient)"}
                      stroke="hsl(45 93% 47%)"
                      strokeWidth={hoveredRegion === region ? "2.5" : "1.5"}
                      strokeOpacity={hoveredRegion === region ? 1 : 0.6}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredRegion(region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    />
                    {/* Region label */}
                    <motion.text
                      x={data.center.x}
                      y={data.center.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white font-semibold pointer-events-none"
                      style={{ fontSize: "11px", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      {data.label}
                    </motion.text>
                  </motion.g>
                ))}

                {/* Bridges connecting regions */}
                {bridgeConnections.map((bridge, index) => {
                  const isHighlighted = hoveredObjective === index;
                  const midX = (bridge.from.x + bridge.to.x) / 2;
                  const midY = (bridge.from.y + bridge.to.y) / 2;
                  
                  // Create curved path
                  const dx = bridge.to.x - bridge.from.x;
                  const dy = bridge.to.y - bridge.from.y;
                  const curveOffset = index === 4 ? 80 : 25; // Larger curve for the long bridge
                  const perpX = -dy / Math.sqrt(dx*dx + dy*dy) * curveOffset;
                  const perpY = dx / Math.sqrt(dx*dx + dy*dy) * curveOffset;
                  const controlX = midX + perpX;
                  const controlY = midY + perpY;
                  
                  const curvePath = `M ${bridge.from.x} ${bridge.from.y} Q ${controlX} ${controlY} ${bridge.to.x} ${bridge.to.y}`;
                  
                  return (
                    <motion.g 
                      key={`bridge-${index}`}
                      onMouseEnter={() => setHoveredObjective(index)}
                      onMouseLeave={() => setHoveredObjective(null)}
                      className="cursor-pointer"
                    >
                      {/* Bridge glow */}
                      <motion.path
                        d={curvePath}
                        fill="none"
                        stroke={objectives[index].bridgeColor}
                        strokeWidth={isHighlighted ? "12" : "8"}
                        strokeOpacity={isHighlighted ? 0.5 : 0.2}
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
                      />
                      
                      {/* Main bridge */}
                      <motion.path
                        d={curvePath}
                        fill="none"
                        stroke={objectives[index].bridgeColor}
                        strokeWidth={isHighlighted ? "5" : "3"}
                        strokeLinecap="round"
                        filter={isHighlighted ? "url(#bridgeGlow)" : undefined}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
                      />
                      
                      {/* Bridge number badge */}
                      <motion.circle
                        cx={controlX}
                        cy={controlY}
                        r={isHighlighted ? "16" : "14"}
                        fill={objectives[index].bridgeColor}
                        stroke="hsl(var(--charcoal))"
                        strokeWidth="2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.6 + index * 0.15, duration: 0.3, type: "spring" }}
                      />
                      <motion.text
                        x={controlX}
                        y={controlY + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-charcoal font-bold pointer-events-none"
                        style={{ fontSize: "12px" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 + index * 0.15 }}
                      >
                        {index + 1}
                      </motion.text>
                    </motion.g>
                  );
                })}
              </svg>
            </div>
          </motion.div>

          {/* Objectives List */}
          <div className="space-y-3 order-1 lg:order-2">
            <h3 className="text-xl font-semibold text-white mb-4">
              The 5 NESA-Africa Objectives
            </h3>
            {objectives.map((objective, index) => (
              <motion.div
                key={objective.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`flex gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  hoveredObjective === index 
                    ? "bg-white/10 border-gold/50 scale-[1.02]" 
                    : "bg-white/5 border-white/10 hover:bg-white/8"
                }`}
                onMouseEnter={() => setHoveredObjective(index)}
                onMouseLeave={() => setHoveredObjective(null)}
              >
                {/* Number badge */}
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-bold text-charcoal shadow-lg"
                  style={{ backgroundColor: objective.bridgeColor }}
                >
                  {objective.id}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-lg mb-1">
                    {objective.title}
                  </h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {objective.description}
                  </p>
                  <p 
                    className="text-xs mt-2 font-medium"
                    style={{ color: objective.bridgeColor }}
                  >
                    Bridge: {objective.regions[0]} ↔ {objective.regions[1]}
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
          transition={{ delay: 2 }}
          className="mt-16 text-center"
        >
          <div className="inline-block px-8 py-5 rounded-2xl bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 border border-gold/30">
            <span className="text-gold font-display text-xl md:text-2xl font-semibold">
              "The African Blue-Garnet Awards for Education"
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AfricaRegionsMap;
