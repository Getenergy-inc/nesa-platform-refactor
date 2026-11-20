import { useTranslation } from "react-i18next";
import { useCountdown } from "@/hooks/useCountdown";

interface CountdownTimerProps {
  targetDate: Date;
  label: string;
}

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  const { t } = useTranslation("pages");
  const blocks = [
    { value: days, label: t("countdown.days", "Days") },
    { value: hours, label: t("countdown.hours", "Hrs") },
    { value: minutes, label: t("countdown.minutes", "Min") },
    { value: seconds, label: t("countdown.seconds", "Sec") },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {blocks.map((block) => (
          <div key={block.label} className="flex min-w-[50px] flex-col items-center rounded-lg border border-gold/30 bg-charcoal-light px-3 py-2">
            <span className="text-xl font-bold tabular-nums text-gold sm:text-2xl">{String(block.value).padStart(2, "0")}</span>
            <span className="text-[10px] uppercase tracking-wide text-white/60">{block.label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-white/70">{label}</p>
    </div>
  );
}
