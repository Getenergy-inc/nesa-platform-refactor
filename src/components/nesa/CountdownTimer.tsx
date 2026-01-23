import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: Date;
  label: string;
}

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const blocks = [
    { value: days, label: "Days" },
    { value: hours, label: "Hrs" },
    { value: minutes, label: "Min" },
    { value: seconds, label: "Sec" },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {blocks.map((block) => (
          <div
            key={block.label}
            className="flex flex-col items-center bg-charcoal-light border border-gold/30 rounded-lg px-3 py-2 min-w-[50px]"
          >
            <span className="text-xl sm:text-2xl font-bold text-gold tabular-nums">
              {String(block.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-white/60 uppercase tracking-wide">
              {block.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/70 text-center">{label}</p>
    </div>
  );
}

function TimeBlock({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center bg-charcoal/60 rounded-lg px-3 py-2 min-w-[52px] border border-primary/20">
      <span className="text-xl font-bold text-white tabular-nums">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs text-secondary-foreground/60 uppercase tracking-wide">{unit}</span>
    </div>
  );
}
