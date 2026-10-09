import { NRCArenaPage } from "@/components/nrc/arena/NRCArenaPage";
import { Card } from "@/components/ui/card";

const METRICS = [
  { label: "Nominations Received", value: 0 },
  { label: "Successfully Screened", value: 0 },
  { label: "Missing Information", value: 0 },
  { label: "Possible Duplicates", value: 0 },
  { label: "Category Mismatch", value: 0 },
  { label: "Evidence Links Found", value: 0 },
  { label: "Risk Flags Generated", value: 0 },
  { label: "Automatically Routed", value: 0 },
  { label: "Assignment Failures", value: 0 },
  { label: "Ready for Human NRC Review", value: 0 },
];

const NAV = [
  "Automated Intake", "Screening Queue", "Possible Duplicates",
  "Category Matching", "Classification Review", "Evidence Discovery",
  "Risk Flags", "Routing and Assignment", "Failed Processing",
  "Human Review Ready", "Automation Reports",
];

export default function NRCAutomation() {
  return (
    <NRCArenaPage
      title="NRC Automated Intake & Pre-Verification Engine"
      eyebrow="Phase One · Automation"
      description="Phase One receives, screens, deduplicates, classifies, discovers evidence, flags risk, and routes every nomination to the correct NRC team before human review begins."
      status="live"
    >
      <div className="mb-6 flex flex-wrap gap-1.5 text-xs">
        {NAV.map((n, i) => (
          <button
            key={n}
            className={`rounded-md px-3 py-1.5 border ${i === 0 ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 text-white/60 hover:border-gold/30 hover:text-gold"}`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {METRICS.map((m) => (
          <Card key={m.label} className="bg-white/[0.04] border-white/10 p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/50">{m.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">{m.value}</p>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-sm text-white/60">
        The automation engine never approves, rejects permanently, merges, publishes or handovers a
        nominee. Final decisions remain human-led and auditable.
      </p>
    </NRCArenaPage>
  );
}
