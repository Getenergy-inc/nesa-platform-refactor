import { NRCArenaPage } from "@/components/nrc/arena/NRCArenaPage";

const REPORTS = [
  "Cases by tier", "Cases by category", "Cases by subcategory",
  "Cases by country", "Cases by African region", "Diaspora-contribution cases",
  "Friends-of-Africa cases", "Reviewer workload", "Average review time",
  "Overdue cases", "Duplicate cases", "Evidence gaps",
  "Risk and escalation cases", "Cases ready for Judges", "Cases ready for Governance",
  "Public endorsements received", "Public evidence accepted", "Handover failures",
];

export default function NRCReportsPage() {
  return (
    <NRCArenaPage
      title="NRC Operational Reports"
      description="Backlog, turnaround, duplicate, evidence-gap, regional-distribution and reviewer-workload reports."
      status="live"
    >
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {REPORTS.map((r) => (
          <button key={r} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left text-sm text-white/80 hover:border-gold/30 hover:text-gold">
            {r}
          </button>
        ))}
      </div>
    </NRCArenaPage>
  );
}
