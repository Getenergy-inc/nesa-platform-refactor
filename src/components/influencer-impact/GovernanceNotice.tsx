import { ShieldAlert } from "lucide-react";
import { GOVERNANCE_RULES } from "@/config/awards/influencerImpact2026";

export function GovernanceNotice() {
  return (
    <section className="py-14 border-t border-white/5">
      <div className="container max-w-3xl mx-auto px-4">
        <aside
          role="note"
          aria-label="Governance and integrity notice"
          className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-5 w-5 text-rose-300" />
            <h2 className="font-display text-lg font-bold text-white">
              Governance &amp; Integrity
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-white/75 leading-relaxed list-disc list-inside">
            {GOVERNANCE_RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="text-xs text-rose-200/80 mt-4 leading-relaxed">
            Only measurable education impact, verified evidence, and EDX
            scoring determine recognition outcomes.
          </p>
        </aside>
      </div>
    </section>
  );
}
