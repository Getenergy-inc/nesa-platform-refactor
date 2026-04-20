import { useMemo } from "react";
import { Clock } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { useSeason } from "@/contexts/SeasonContext";

interface Milestone {
  date: string;
  label: string;
}

function buildMilestones(year: number): Milestone[] {
  return [
    { date: `${year}-06-11T18:00:00`, label: "Platinum Recognition Show" },
    { date: `${year}-06-25T18:00:00`, label: "Africa Education Icon Show" },
    { date: `${year}-07-13T00:00:00`, label: "Gold Voting Opens" },
    { date: `${year}-09-25T23:59:59`, label: "Gold Voting Closes" },
    { date: `${year}-10-01T18:00:00`, label: "Gold Winners Show" },
    { date: `${year}-10-02T00:00:00`, label: "Blue Garnet Voting Opens" },
    { date: `${year}-10-22T18:00:00`, label: "Blue Garnet Awards Gala" },
  ];
}

/**
 * Compact live countdown to the NEXT upcoming NESA-Africa milestone.
 * Designed to sit inside the hero badge / under the headline.
 */
export function HeroNextMilestone() {
  const { currentEdition } = useSeason();
  const year = currentEdition.displayYear;

  const next = useMemo(() => {
    const now = Date.now();
    const list = buildMilestones(year);
    return list.find((m) => new Date(m.date).getTime() > now) ?? list[list.length - 1];
  }, [year]);

  const { days, hours, minutes, seconds, isExpired } = useCountdown(next.date);

  if (isExpired) return null;

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-base sm:text-lg font-bold text-gold tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-white/50 mt-0.5">
        {label}
      </span>
    </div>
  );

  return (
    <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2.5 rounded-2xl bg-charcoal/70 backdrop-blur-md border border-gold/30 shadow-lg shadow-gold/5">
      <div className="flex items-center gap-2 pr-3 sm:pr-4 border-r border-gold/20">
        <Clock className="h-3.5 w-3.5 text-gold" />
        <div className="text-left">
          <div className="text-[9px] uppercase tracking-widest text-gold/80 font-semibold leading-none">
            Next Milestone
          </div>
          <div className="text-xs sm:text-sm font-medium text-white mt-0.5 leading-tight">
            {next.label}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Unit value={days} label="Days" />
        <span className="text-gold/40 font-bold mt-[-10px]">:</span>
        <Unit value={hours} label="Hrs" />
        <span className="text-gold/40 font-bold mt-[-10px]">:</span>
        <Unit value={minutes} label="Min" />
        <span className="text-gold/40 font-bold mt-[-10px]">:</span>
        <Unit value={seconds} label="Sec" />
      </div>
    </div>
  );
}
