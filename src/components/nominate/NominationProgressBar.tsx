import { Check } from "lucide-react";
import type { FlowStep } from "./types";

const STEPS: { key: FlowStep; label: string }[] = [
  { key: "flash", label: "How it works" },
  { key: "pathway", label: "Pathway" },
  { key: "entry", label: "Nominee details" },
  { key: "review", label: "Review" },
  { key: "identity", label: "Your details" },
  { key: "confirmation", label: "Done" },
];

export function NominationProgressBar({ current }: { current: FlowStep }) {
  const currentIdx = Math.max(
    0,
    STEPS.findIndex((s) => s.key === current || (current === "auth" && s.key === "identity")),
  );

  return (
    <nav aria-label="Nomination progress" className="w-full">
      <ol className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
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
                <span className="whitespace-nowrap">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <span className="h-px w-4 bg-white/15" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
