import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { NomineeReviewCard } from "./NomineeReviewCard";
import { IntegrityNotice } from "./IntegrityNotice";
import { SaveSessionWarning } from "./SaveSessionWarning";
import type { NomineeEntry } from "./types";

export function ReviewAllNomineesStep({
  entries,
  onAddAnother,
  onEdit,
  onRemove,
  onContinue,
}: {
  entries: NomineeEntry[];
  onAddAnother: () => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onContinue: () => void;
}) {
  const count = entries.length;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">Step 4</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
          Review Your Nomination Entries
        </h2>
        <p className="text-sm text-white/65">
          You are about to submit <span className="text-gold font-semibold">{count}</span>{" "}
          nomination {count === 1 ? "entry" : "entries"}. Add more or proceed to final submission.
        </p>
      </div>

      <SaveSessionWarning />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((e, i) => (
          <NomineeReviewCard
            key={e.id}
            entry={e}
            index={i}
            onEdit={() => onEdit(e.id)}
            onRemove={() => onRemove(e.id)}
          />
        ))}
      </div>

      <IntegrityNotice />

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onAddAnother}
          className="rounded-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold gap-2"
        >
          <Plus className="h-4 w-4" /> Add Another Nominee
        </Button>
        <Button
          onClick={onContinue}
          disabled={count === 0}
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 gap-2 shadow-gold disabled:opacity-50"
        >
          Proceed to Final Submission
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
