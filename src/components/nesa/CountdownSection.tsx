import { motion } from "framer-motion";
import { Clock, Trophy, Vote } from "lucide-react";
import { useSeason, useStageGate } from "@/contexts/SeasonContext";
import { useCountdown } from "@/hooks/useCountdown";

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-charcoal-light border border-gold/30 sm:h-18 sm:w-18">
        <span className="text-2xl font-bold text-gold tabular-nums sm:text-3xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-1.5 text-[10px] font-medium uppercase tracking-widest text-white/50">
        {label}
      </span>
    </div>
  );
}

export function CountdownSection() {
  const { currentEdition, getOpenStage } = useSeason();
  const openStage = getOpenStage();

  // Determine the next key date to count down to
  const now = new Date();
  const dates = [
    { date: currentEdition.nominationsClose, label: "Nominations Close", icon: Trophy, stage: "nominations" },
    { date: currentEdition.votingOpen, label: "Voting Opens", icon: Vote, stage: "public_voting" },
    { date: currentEdition.votingClose, label: "Voting Closes", icon: Vote, stage: "public_voting" },
    { date: currentEdition.ceremonyDate, label: "Grand Gala", icon: Trophy, stage: "ceremony" },
  ];

  // Pick first future date
  const target = dates.find((d) => new Date(d.date) > now) ?? dates[dates.length - 1];
  const { days, hours, minutes, seconds, isExpired } = useCountdown(target.date);
  const Icon = target.icon;

  if (isExpired) return null;

  return (
    <section className="relative py-10 sm:py-14 bg-charcoal overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-3xl mx-auto px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-1.5 mb-5">
          <Clock className="h-3.5 w-3.5 text-gold" />
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            {currentEdition.name}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-white mb-6">
          {target.label}
        </h2>

        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <CountdownBlock value={days} label="Days" />
          <span className="text-xl font-bold text-gold/40 mt-[-18px]">:</span>
          <CountdownBlock value={hours} label="Hours" />
          <span className="text-xl font-bold text-gold/40 mt-[-18px]">:</span>
          <CountdownBlock value={minutes} label="Min" />
          <span className="text-xl font-bold text-gold/40 mt-[-18px]">:</span>
          <CountdownBlock value={seconds} label="Sec" />
        </div>
      </motion.div>
    </section>
  );
}
