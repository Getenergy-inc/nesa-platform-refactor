import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FlowStep } from "./types";

const STEP_KEYS: { key: FlowStep; i18n: string }[] = [
  { key: "flash", i18n: "flow.steps.flash" },
  { key: "pathway", i18n: "flow.steps.pathway" },
  { key: "entry", i18n: "flow.steps.entry" },
  { key: "review", i18n: "flow.steps.review" },
  { key: "identity", i18n: "flow.steps.identity" },
  { key: "confirmation", i18n: "flow.steps.confirmation" },
];

export function NominationProgressBar({ current }: { current: FlowStep }) {
  const { t } = useTranslation("nomination");
  const currentIdx = Math.max(
    0,
    STEP_KEYS.findIndex((s) => s.key === current || (current === "auth" && s.key === "identity")),
  );

  return (
    <nav aria-label="Nomination progress" className="w-full">
      <ol className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEP_KEYS.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <li key={s.key} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  active
                    ? "bg-gold text-charcoal border-gold"
                    : done
                      ? "bg-gold/10 text-gold border-gold/40"
                      : "bg-white/5 text-white/60 border-white/10"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : <span className="font-semibold">{i + 1}</span>}
                <span className="whitespace-nowrap">{t(s.i18n)}</span>
              </div>
              {i < STEP_KEYS.length - 1 && <span className="h-px w-4 bg-white/15" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
