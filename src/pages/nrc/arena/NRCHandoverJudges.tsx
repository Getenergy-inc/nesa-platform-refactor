import { NRCArenaPage } from "@/components/nrc/arena/NRCArenaPage";
import { ArrowRight, Lock } from "lucide-react";

export default function NRCHandoverJudges() {
  return (
    <NRCArenaPage
      title="Handover · Africa Education Icon → Judges Arena"
      description="Verified Icon dossiers only. On handover the dossier is locked, the correct pathway group is assigned, and three pathway judges are notified."
      status="restricted"
    >
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs uppercase tracking-wider text-white/50">Dossiers Ready</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">0</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs uppercase tracking-wider text-white/50">Handed Over</p>
          <p className="mt-1 font-display text-3xl font-bold text-emerald-300">0</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs uppercase tracking-wider text-white/50">Judge Clarifications</p>
          <p className="mt-1 font-display text-3xl font-bold text-amber-300">0</p>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-center gap-3 text-sm text-white/80">
          <Lock className="h-4 w-4 text-gold" /> Locked dossier
          <ArrowRight className="h-4 w-4 text-white/40" /> Icon pathway group
          <ArrowRight className="h-4 w-4 text-white/40" /> 3 pathway judges
          <ArrowRight className="h-4 w-4 text-white/40" /> Judges Arena
        </div>
      </div>
    </NRCArenaPage>
  );
}
