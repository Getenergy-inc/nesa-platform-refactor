import { PUBLIC_STATS, REGION_TARGET_USD, SNS_REGIONS } from "@/config/schoolSupport";
import { dash, fmtMoney } from "./ui";

const usd = (v: number | null) => (v === null ? "—" : fmtMoney(v, "USD"));
const allNull = (o: unknown): boolean => o === null || (typeof o === "object" && Object.values(o as object).every(allNull));

export function AccountabilityDashboard() {
  const s = PUBLIC_STATS;
  const empty = allNull(s);
  const kpis: Array<[string, string]> = [
    ["Schools nominated", dash(s.schoolsNominated)], ["Approved for voting", dash(s.approvedForVoting)],
    ["Funds pledged", usd(s.pledgedUsd)], ["Funds reconciled", usd(s.reconciledUsd)],
    ["Interventions completed", dash(s.interventionsCompleted)], ["Last updated", dash(s.lastUpdated)],
  ];
  const cards: Array<{ title: string; rows: Array<[string, string]> }> = [
    { title: "School pipeline", rows: [["Nominated", dash(s.schoolsNominated)], ["Unique after duplicate review", dash(s.uniqueAfterReview)], ["Under verification", dash(s.underVerification)], ["Approved for voting", dash(s.approvedForVoting)]] },
    { title: "Money trail (USD)", rows: [["Pledged", usd(s.pledgedUsd)], ["Transfers reported", usd(s.transfersReportedUsd)], ["Reconciled on bank statement", usd(s.reconciledUsd)], ["Receipts issued", dash(s.receiptsIssued)]] },
    { title: "Interventions", rows: [["Approved", dash(s.interventionsApproved)], ["Started", dash(s.interventionsStarted)], ["Completed", dash(s.interventionsCompleted)]] },
    { title: "Verified regional votes", rows: [["Total verified votes", dash(s.verifiedRegionalVotes)]] },
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-2xl">Public accountability dashboard</h3>
      {empty && <p role="status" className="rounded-2xl border border-dashed border-ea-green bg-ea-green/5 p-4 text-sm font-semibold text-ea-green">Awaiting the first approved figures</p>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map(([k, v]) => <div key={k} className="rounded-2xl border border-ea-line bg-ea-cream p-4"><p className="text-xs text-ea-muted">{k}</p><p className="mt-1 font-serif text-2xl font-semibold">{v}</p></div>)}
      </div>
      <div className="rounded-2xl border border-ea-line bg-ea-cream p-5">
        <h4 className="font-semibold">Regional funding · reconciled vs US$150,000 target</h4>
        <ul className="mt-4 space-y-3">
          {SNS_REGIONS.map((r) => {
            const d = s.regions[r.key]; const rec = d?.reconciledUsd ?? 0; const pl = d?.pledgedUsd ?? 0;
            return (
              <li key={r.key} className="grid grid-cols-[8.5rem_1fr_5rem] items-center gap-3 text-sm sm:grid-cols-[11rem_1fr_7rem]">
                <span>{r.name}</span>
                <span className="relative h-3 overflow-hidden rounded-full bg-ea-sand" role="img" aria-label={`${r.name}: reconciled ${usd(d?.reconciledUsd ?? null)}, pledged ${usd(d?.pledgedUsd ?? null)} of ${fmtMoney(REGION_TARGET_USD, "USD")}`}>
                  <span className="absolute inset-y-0 left-0 opacity-35" style={{ width: `${Math.min(100, (pl / REGION_TARGET_USD) * 100)}%`, background: r.color }} />
                  <span className="absolute inset-y-0 left-0" style={{ width: `${Math.min(100, (rec / REGION_TARGET_USD) * 100)}%`, background: r.color }} />
                </span>
                <span className="text-right text-ea-muted">{usd(d?.reconciledUsd ?? null)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-ea-muted">Solid = reconciled · faded = pledged. Targets, not secured funding.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.title} className="rounded-2xl border border-ea-line bg-ea-cream p-5">
            <h4 className="font-semibold">{c.title}</h4>
            <dl className="mt-3 space-y-2 text-sm">{c.rows.map(([k, v]) => <div key={k} className="flex justify-between gap-2"><dt className="text-ea-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>
          </div>
        ))}
      </div>
    </div>
  );
}
