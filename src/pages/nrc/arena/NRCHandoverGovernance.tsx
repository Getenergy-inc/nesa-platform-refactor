import { NRCArenaPage } from "@/components/nrc/arena/NRCArenaPage";
import { ArrowRight } from "lucide-react";

export default function NRCHandoverGovernance() {
  return (
    <NRCArenaPage
      title="Handover · Non-Icon → Governance"
      description="Gold-Blue Garnet, Platinum and Influencer recognitions move to Governance for approval, public profile publication and certificate authorisation."
      status="restricted"
    >
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
          NRC verification
          <ArrowRight className="h-4 w-4 text-white/40" /> NRC recommendation
          <ArrowRight className="h-4 w-4 text-white/40" /> Governance approval
          <ArrowRight className="h-4 w-4 text-white/40" /> Verified public profile
          <ArrowRight className="h-4 w-4 text-white/40" /> Certificate
        </div>
      </div>
    </NRCArenaPage>
  );
}
