import { NRCArenaPage } from "@/components/nrc/arena/NRCArenaPage";

export default function NRCDuplicates() {
  return (
    <NRCArenaPage
      title="Duplicate & Identity Resolution"
      description="Automated candidate matches (name, organisation, contact, socials) surface here for NRC confirmation. Automation never merges records — only NRC members do."
      status="live"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs uppercase tracking-wider text-white/50">High-confidence matches</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">0</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs uppercase tracking-wider text-white/50">Requires manual review</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">0</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-white/60">Live matching arrives with the Phase 4 automation engine.</p>
    </NRCArenaPage>
  );
}
