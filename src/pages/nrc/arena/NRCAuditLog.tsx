import { NRCArenaPage } from "@/components/nrc/arena/NRCArenaPage";

export default function NRCAuditLog() {
  return (
    <NRCArenaPage
      title="NRC Activity & Integrity Log"
      description="Every case, review, evidence item, decision, reassignment and handover carries a permanent reference, user, timestamp and version."
      status="restricted"
    >
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04] text-left text-[11px] uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-3 py-3">Timestamp</th>
              <th className="px-3 py-3">Actor</th>
              <th className="px-3 py-3">Action</th>
              <th className="px-3 py-3">Entity</th>
              <th className="px-3 py-3">Version</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-3 py-8 text-center text-white/50">
                No audit entries yet for your session.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </NRCArenaPage>
  );
}
