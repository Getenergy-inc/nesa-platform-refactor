import { useState } from "react";
import { SNS_BANK_HOLDER, SNS_BANK_NAME, SNS_NARRATION_NOTICE, bankAccountFor, type SnsCurrency } from "@/config/schoolSupport";
import { submitTransferReport } from "@/services/supportFund";
import { CopyButton, fmtMoney, input, pillPrimary } from "./ui";

export function BankTransferPanel({ refCode, currency, amount, heading = "Step 1 · Pay by bank transfer" }: { refCode: string; currency: SnsCurrency; amount: number | null; heading?: string }) {
  const acct = bankAccountFor(currency);
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const rows: Array<[string, string]> = [
    ["Account name", SNS_BANK_HOLDER], ["Bank", SNS_BANK_NAME], [`${currency} account number`, acct.number],
    ...(amount ? [["Amount", fmtMoney(amount, currency)] as [string, string]] : []), ["Narration / reference", refCode],
  ];
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-ea-line bg-ea-sand p-5">
        <h4 className="font-semibold">{heading}</h4>
        <p className="mt-1 text-xs text-ea-muted">{acct.purpose}</p>
        <dl className="mt-3 divide-y divide-ea-line text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <dt className="text-ea-muted">{k}</dt>
              <dd className="flex items-center gap-2 font-semibold">{v}{k !== "Account name" && k !== "Bank" && <CopyButton value={k === "Amount" ? String(amount) : v} label={k} />}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs font-semibold text-ea-brown">{SNS_NARRATION_NOTICE}</p>
      </div>
      <form className="rounded-2xl border border-ea-line p-5" onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const amt = Number(f.get("amount_sent")); const name = String(f.get("sender_name") || "").trim(); const date = String(f.get("date_paid") || "");
        if (!date || !name || !(amt > 0)) { setErr("Please complete date paid, amount sent and sender name."); return; }
        setErr(""); setState("saving");
        try { await submitTransferReport({ ref: refCode, date_paid: date, amount_sent: amt, currency, sender_name: name.slice(0, 200), bank_transaction_id: String(f.get("bank_txn") || "").trim().slice(0, 100) || null }); setState("done"); }
        catch (x) { setErr((x as Error).message); setState("error"); }
      }}>
        <h4 className="font-semibold">Step 2 · Confirm your transfer</h4>
        {state === "done" ? (
          <p role="status" className="mt-3 rounded-xl bg-ea-green/10 p-3 text-sm font-semibold text-ea-green">Transfer reported · awaiting reconciliation</p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">Date paid*<input name="date_paid" type="date" required className={input} /></label>
            <label className="text-sm">Amount sent*<input name="amount_sent" type="number" min="1" step="any" required className={input} /></label>
            <label className="text-sm">Name on the sending account*<input name="sender_name" maxLength={200} required className={input} autoComplete="name" /></label>
            <label className="text-sm">Bank transaction ID (optional)<input name="bank_txn" maxLength={100} className={input} /></label>
            {err && <p role="alert" className="text-sm text-ea-brown sm:col-span-2">{err}</p>}
            <button type="submit" disabled={state === "saving"} className={pillPrimary + " sm:col-span-2"}>{state === "saving" ? "Sending…" : "Report my transfer"}</button>
          </div>
        )}
      </form>
    </div>
  );
}
