// Photo-collage hero for /meet-the-team.
// Renders live public portraits as auto-scrolling strips behind the headline,
// with a charcoal/gold gradient overlay so the copy stays readable.

import { motion, useReducedMotion } from "framer-motion";
import { Users } from "lucide-react";
import { useTeamPhotos, type TeamPhoto } from "@/hooks/useTeamPhotos";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function PhotoTile({ p }: { p: TeamPhoto }) {
  return (
    <div
      className="shrink-0 h-24 w-24 md:h-32 md:w-32 rounded-2xl overflow-hidden border border-gold/25 bg-white/5"
      title={`${p.name}${p.country ? " • " + p.country : ""}`}
    >
      <img
        src={p.photoUrl}
        alt={p.name}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function Strip({
  photos,
  reverse,
  duration,
  paused,
}: {
  photos: TeamPhoto[];
  reverse?: boolean;
  duration: number;
  paused: boolean;
}) {
  if (!photos.length) return null;
  const loop = [...photos, ...photos];
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-3 md:gap-4 w-max"
        animate={paused ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {loop.map((p, i) => (
          <PhotoTile key={`${p.id}-${i}`} p={p} />
        ))}
      </motion.div>
    </div>
  );
}

export function TeamCollageHero({ className }: { className?: string }) {
  const { photos } = useTeamPhotos(36);
  const reduced = useReducedMotion();

  // Split whatever we have into up to three rows — no fixed photo count.
  const rows: TeamPhoto[][] = [];
  if (photos.length) {
    const rowCount = photos.length >= 12 ? 3 : photos.length >= 6 ? 2 : 1;
    for (let i = 0; i < rowCount; i++) rows.push([]);
    photos.forEach((p, i) => rows[i % rowCount].push(p));
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-charcoal via-charcoal to-black",
        className
      )}
    >
      {/* Collage layer */}
      {rows.length > 0 && (
        <div className="absolute inset-0 flex flex-col justify-center gap-3 md:gap-4 opacity-40">
          {rows.map((row, i) => (
            <Strip
              key={i}
              photos={row}
              reverse={i % 2 === 1}
              duration={45 + i * 12}
              paused={!!reduced}
            />
          ))}
        </div>
      )}

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-charcoal/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal/70 to-black" />
      <div className="absolute -top-1/3 left-1/4 h-96 w-96 rounded-full bg-gold blur-3xl opacity-10 pointer-events-none" />

      {/* Headline */}
      <div className="container mx-auto max-w-4xl relative px-4 py-24 md:py-32 text-center">
        <motion.div {...fadeUp}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-widest mb-5 backdrop-blur">
            <Users className="h-3 w-3" /> The People Behind the Movement
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl text-gold mb-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Meet Our Global Team
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
            NESA-Africa isn't run from a single office — it's built by a growing,
            continent-spanning team of volunteers, judges, and researchers who believe
            Africa's education enablers deserve to be seen.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default TeamCollageHero;
