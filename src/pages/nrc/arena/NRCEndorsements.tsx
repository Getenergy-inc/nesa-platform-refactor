import { NRCArenaPage } from "@/components/nrc/arena/NRCArenaPage";
import { Badge } from "@/components/ui/badge";

const STATUSES = ["Received", "Duplicate", "Under NRC Review", "Evidence Requested", "Accepted as Supporting Information", "Rejected", "Escalated", "Published", "Archived"];

export default function NRCEndorsements() {
  return (
    <NRCArenaPage
      title="Public Re-Nomination & Endorsement Review"
      description="Public endorsements are supporting evidence only. They cannot rank nominees, alter scores or determine recognition."
      status="live"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Badge key={s} variant="outline" className="border-white/15 text-white/60">{s}</Badge>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-8 text-center text-white/60">
        No endorsements pending review.
      </div>
    </NRCArenaPage>
  );
}
