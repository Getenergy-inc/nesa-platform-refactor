import { useState, useEffect } from "react";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface EventCountdownProps {
  targetDate: Date;
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
  variant?: "default" | "compact" | "hero";
  showLabels?: boolean;
}

export function EventCountdown({
  targetDate,
  title,
  subtitle,
  onComplete,
  variant = "default",
  showLabels = true,
}: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsComplete(true);
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-primary">Event Started!</p>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days", shortLabel: "D" },
    { value: timeLeft.hours, label: "Hours", shortLabel: "H" },
    { value: timeLeft.minutes, label: "Minutes", shortLabel: "M" },
    { value: timeLeft.seconds, label: "Seconds", shortLabel: "S" },
  ];

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1 text-sm font-mono">
        {timeUnits.map((unit, index) => (
          <span key={unit.label} className="flex items-center">
            <span className="font-bold">{String(unit.value).padStart(2, "0")}</span>
            <span className="text-muted-foreground">{unit.shortLabel}</span>
            {index < timeUnits.length - 1 && <span className="mx-1 text-muted-foreground">:</span>}
          </span>
        ))}
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className="text-center">
        {title && <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">{title}</h3>}
        <div className="flex items-center justify-center gap-3 md:gap-6">
          {timeUnits.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary/80 backdrop-blur-sm md:h-20 md:w-20">
                <span className="font-display text-2xl font-bold text-primary md:text-4xl">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              {showLabels && (
                <span className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {unit.label}
                </span>
              )}
            </div>
          ))}
        </div>
        {subtitle && <p className="mt-4 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    );
  }

  // Default variant
  return (
    <div className="text-center">
      {title && <h3 className="mb-4 font-display text-lg font-semibold">{title}</h3>}
      <div className="flex items-center justify-center gap-2 md:gap-4">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted md:h-14 md:w-14">
                <span className="font-mono text-xl font-bold md:text-2xl">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              {showLabels && (
                <span className="mt-1 text-xs text-muted-foreground">{unit.label}</span>
              )}
            </div>
            {index < timeUnits.length - 1 && (
              <span className="mx-1 text-xl font-bold text-muted-foreground md:mx-2">:</span>
            )}
          </div>
        ))}
      </div>
      {subtitle && <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsComplete(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return { timeLeft, isComplete };
}
