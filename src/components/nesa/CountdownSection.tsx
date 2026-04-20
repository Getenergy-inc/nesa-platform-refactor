import { motion } from "framer-motion";
import { Clock, Trophy, Vote, Gem, Crown, Medal, Calendar } from "lucide-react";
import { useSeason } from "@/contexts/SeasonContext";
import { useCountdown } from "@/hooks/useCountdown";
import type { LucideIcon } from "lucide-react";

interface MilestoneCountdownProps {
  date: string;
  label: string;
  dateLabel: string;
  icon: LucideIcon;
  accent?: "gold" | "platinum" | "blue";
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-md bg-charcoal border border-gold/20 px-1.5">
        <span className="text-base font-bold text-gold tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-1 text-[8px] font-medium uppercase tracking-wider text-white/40">
        {label}
      </span>
    </div>
  );
}

function MilestoneCountdown({ date, label, dateLabel, icon: Icon, accent = "gold" }: MilestoneCountdownProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(date);

  const accentBorder =
    accent === "blue"
      ? "border-[#1E3A5F]/40 hover:border-[#1E3A5F]/70"
      : accent === "platinum"
      ? "border-white/20 hover:border-white/40"
      : "border-gold/30 hover:border-gold/60";

  const accentIcon =
    accent === "blue" ? "text-[#7BA3D9]" : accent === "platinum" ? "text-white/80" : "text-gold";

  return (
    <div
      className={`group relative flex flex-col rounded-xl bg-charcoal-light border ${accentBorder} p-4 transition-all duration-300 hover:-translate-y-0.5`}
    >
      {isExpired && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-semibold uppercase tracking-wider text-white/60">
          Completed
        </div>
      )}

      <div className="flex items-start gap-2.5 mb-3">
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-charcoal border border-gold/20`}>
          <Icon className={`h-4 w-4 ${accentIcon}`} />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-semibold text-white leading-tight">{label}</h3>
          <p className="text-[10px] text-white/50 mt-0.5">{dateLabel}</p>
        </div>
      </div>

      {!isExpired ? (
        <div className="flex items-center justify-between gap-1 mt-auto">
          <CountdownUnit value={days} label="Days" />
          <span className="text-sm font-bold text-gold/30 mt-[-12px]">:</span>
          <CountdownUnit value={hours} label="Hrs" />
          <span className="text-sm font-bold text-gold/30 mt-[-12px]">:</span>
          <CountdownUnit value={minutes} label="Min" />
          <span className="text-sm font-bold text-gold/30 mt-[-12px]">:</span>
          <CountdownUnit value={seconds} label="Sec" />
        </div>
      ) : (
        <div className="mt-auto py-2 text-center text-[11px] text-white/40 italic">
          Event concluded
        </div>
      )}
    </div>
  );
}

export function CountdownSection() {
  const { currentEdition } = useSeason();
  const y = currentEdition.displayYear;

  const milestones: MilestoneCountdownProps[] = [
    {
      date: `${y}-06-11T18:00:00`,
      label: "Platinum Recognition Show",
      dateLabel: `11 June ${y}`,
      icon: Medal,
      accent: "platinum",
    },
    {
      date: `${y}-06-25T18:00:00`,
      label: "Africa Education Icon Show",
      dateLabel: `25 June ${y}`,
      icon: Crown,
      accent: "gold",
    },
    {
      date: `${y}-07-13T00:00:00`,
      label: "Gold Voting Opens",
      dateLabel: `13 July ${y}`,
      icon: Vote,
      accent: "gold",
    },
    {
      date: `${y}-09-25T23:59:59`,
      label: "Gold Voting Closes",
      dateLabel: `25 September ${y}`,
      icon: Vote,
      accent: "gold",
    },
    {
      date: `${y}-10-01T18:00:00`,
      label: "Gold Winners Show",
      dateLabel: `1 October ${y}`,
      icon: Trophy,
      accent: "gold",
    },
    {
      date: `${y}-10-02T00:00:00`,
      label: "Blue Garnet Voting Opens",
      dateLabel: `2 October ${y}`,
      icon: Vote,
      accent: "blue",
    },
    {
      date: `${y}-10-22T18:00:00`,
      label: "Blue Garnet Awards Gala",
      dateLabel: `22 October ${y}`,
      icon: Gem,
      accent: "blue",
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 bg-charcoal overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-7xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-1.5 mb-4">
            <Clock className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">
              {currentEdition.name} — Key Milestones
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            Countdown to Every Moment
          </h2>
          <p className="text-sm text-white/60 max-w-2xl mx-auto">
            Live countdowns to all seven {y} NESA-Africa milestones — from Platinum Recognition through the Blue Garnet Gala.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {milestones.map((m) => (
            <MilestoneCountdown key={m.label} {...m} />
          ))}
        </div>

        {/* Impact phase note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/50">
          <Calendar className="h-3.5 w-3.5 text-gold/60" />
          <span>
            Impact Phase: <span className="text-white/70 font-medium">October {y} – October {y + 1}</span> · Rebuild My School Africa
          </span>
        </div>
      </motion.div>
    </section>
  );
}
