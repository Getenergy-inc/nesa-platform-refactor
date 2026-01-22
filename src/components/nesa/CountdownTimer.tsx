import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: Date | string;
  label: string;
  className?: string;
}

export function CountdownTimer({ targetDate, label, className = "" }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-primary font-medium">{label}</p>
        <p className="text-secondary-foreground/60 text-sm mt-1">Event has passed</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <p className="text-primary font-medium mb-3">{label}</p>
      <div className="flex gap-2">
        <TimeBlock value={days} unit="Days" />
        <TimeBlock value={hours} unit="Hrs" />
        <TimeBlock value={minutes} unit="Min" />
        <TimeBlock value={seconds} unit="Sec" />
      </div>
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
