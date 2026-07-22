import { useParams } from "react-router-dom";
import { NRCArenaPage } from "@/components/nrc/arena/NRCArenaPage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, FileWarning, PauseCircle, RefreshCw, XCircle, AlertTriangle } from "lucide-react";

const TABS = [
  "Overview", "Identity", "Eligibility", "Nominations", "Duplicate Review",
  "Evidence Room", "Education Impact", "Geographic Contribution",
  "Nominee Acceptance", "Risk & Integrity", "Public Endorsements",
  "NRC Reviews", "Quality Approval", "Handover", "Activity History",
];

export default function NRCCaseDetail() {
  const { caseId } = useParams();
  return (
    <NRCArenaPage
      title={`Case ${caseId ?? "—"}`}
      eyebrow="Verification Workspace"
      status="live"
      breadcrumb={[{ label: "Cases", href: "/nrc/cases" }, { label: caseId ?? "Case" }]}
      description="Full nominee verification workspace with evidence room, quality checks and traced handover."
      actions={
        <>
          <Button size="sm" className="bg-emerald-500 text-white hover:bg-emerald-500/90"><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve</Button>
          <Button size="sm" variant="outline" className="border-white/20"><FileWarning className="mr-1.5 h-3.5 w-3.5" /> Request Info</Button>
          <Button size="sm" variant="outline" className="border-white/20"><PauseCircle className="mr-1.5 h-3.5 w-3.5" /> Hold</Button>
          <Button size="sm" variant="outline" className="border-white/20"><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Reassign</Button>
          <Button size="sm" variant="outline" className="border-white/20"><AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> Escalate</Button>
          <Button size="sm" variant="outline" className="border-red-400/40 text-red-300"><XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject</Button>
        </>
      }
    >
      <nav className="mb-6 flex flex-wrap gap-1.5 text-xs">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`rounded-md px-3 py-1.5 border ${i === 0 ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 text-white/60 hover:border-gold/30 hover:text-gold"}`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 bg-white/[0.04] border-white/10 lg:col-span-2">
          <h3 className="font-display font-semibold text-white mb-2">Automated Preparation</h3>
          <dl className="grid grid-cols-2 gap-y-2 text-sm text-white/70">
            <dt>Completeness</dt><dd className="text-white">87%</dd>
            <dt>Suggested Category</dt><dd className="text-white">Gold-Blue CSR Africa</dd>
            <dt>Region</dt><dd className="text-white">West Africa</dd>
            <dt>Possible Duplicates</dt><dd className="text-white">1</dd>
            <dt>Evidence Sources</dt><dd className="text-white">8 located</dd>
            <dt>Automated Flags</dt><dd className="text-amber-300">1 — beneficiary figure requires confirmation</dd>
          </dl>
        </Card>
        <Card className="p-4 bg-white/[0.04] border-white/10">
          <h3 className="font-display font-semibold text-white mb-2">Human NRC Review</h3>
          <ul className="space-y-1.5 text-sm text-white/70">
            <li>Identity: <span className="text-emerald-300">Confirmed</span></li>
            <li>Eligibility: <span className="text-amber-300">In progress</span></li>
            <li>Category: <span className="text-emerald-300">Confirmed</span></li>
            <li>Evidence: <span className="text-white">5 of 8 verified</span></li>
            <li>Impact assessment: <span className="text-white/50">Pending</span></li>
            <li>Quality review: <span className="text-white/50">Pending</span></li>
            <li>Handover: <span className="text-white/50">Not ready</span></li>
          </ul>
        </Card>
      </div>
    </NRCArenaPage>
  );
}
