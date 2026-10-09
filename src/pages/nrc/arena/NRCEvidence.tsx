import { NRCArenaPage } from "@/components/nrc/arena/NRCArenaPage";
import { Badge } from "@/components/ui/badge";

const STATUSES = ["Submitted", "Under Review", "Verified", "Partially Verified", "Independent Confirmation Required", "Insufficient", "Disputed", "Rejected", "Superseded"];

export default function NRCEvidence() {
  return (
    <NRCArenaPage
      title="Evidence Verification Centre"
      description="Every evidence item is recorded with type, source, claim, reviewer, strength and verification status."
      status="live"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Badge key={s} variant="outline" className="border-white/15 text-white/60">{s}</Badge>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-8 text-center text-white/60">
        Evidence library is empty. Items appear here once cases enter the verification workflow (Phase 3).
      </div>
    </NRCArenaPage>
  );
}
