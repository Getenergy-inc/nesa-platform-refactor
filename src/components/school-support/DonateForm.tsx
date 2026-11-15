import { useMemo, useState } from "react";
import {
  REGION_TARGET_USD, SNS_CATEGORIES, SNS_DONATION_PRESETS, SNS_DONOR_TYPES, SNS_PAYMENT_NOTICE, SNS_REGIONS,
  makeSupportRef, regionByKey, type SnsCurrency,
} from "@/config/schoolSupport";
import { submitPledge } from "@/services/supportFund";
import { useSupportPage } from "./SupportPageContext";
import { BankTransferPanel } from "./BankTransferPanel";
import { chip, fmtMoney, input, pillOutline, pillPrimary } from "./ui";

const FREQ = ["One-time", "Monthly", "Annual"] as const;
const CURS: SnsCurrency[] = ["USD", "NGN", "GBP", "EUR"];

export function DonateForm() {
  const { donateRegion, setDonateRegion } = useSupportPage();
  const [freq, setFreq] = useState<(typeof FREQ)[number]>("One-time");
  const [cur, setCur] = useState<SnsCurrency>("USD");
  const [preset, setPreset] = useState<number | "other">(100);
  const [other, setOther] = useState("");
  const [category, setCategory] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<{ ref: string; amount: number; currency: SnsCurrency } | null>(null);
  const amount = preset === "other" ? Number(other) || 0 : preset;
  const region = regionByKey(donateRegion);
  const pct = useMemo(() => (cur === "USD" && region && amount > 0 ? ((amount / REGION_TARGET_USD) * 100).toFixed(amount / REGION_TARGET_USD < 0.001 ? 3 : 2) : null), [cur, region, amount]);

  if (done) return (
    <div className="space-y-5" aria-live="polite">
      <div className="rounded-2xl bg-ea-green/10 p-5">
        <h3 className="text-2xl">Thank you — your pledge is recorded</h3>
        <p className="mt-1 text-sm">Your reference: <strong>{done.ref}</strong></p>
        <p className="mt-2 text-sm text-ea-muted">{SNS_PAYMENT_NOTICE}</p>
      </div>
      <BankTransferPanel refCode={done.ref} currency={done.currency} amount={done.amount} />
      <div className="rounded-2xl border border-ea-line p-5 text-sm text-ea-muted">
        <h4 className="font-semibold text-ea-ink">What happens next</h4>
        <p className="mt-1">The EduAid-Africa finance team checks the bank statement, reconciles your transfer against your reference and issues an official receipt. Support Fund money is ring-fenced for approved school interventions.</p>
      </div>
      <button type="button" className={pillOutline} onClick={() => setDone(null)}>Make another donation</button>
    </div>
  );

  return (
    <form noValidate className="space-y-6" onSubmit={async (e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      const name = String(f.get("donor_name") || "").trim(); const email = String(f.get("email") || "").trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) return setErr("Please enter your name and a valid email.");
      if (!(amount > 0)) return setErr("Please choose or enter an amount.");
      if (f.get("ack") !== "on") return setErr("Please confirm the acknowledgement before submitting.");
      setErr(""); setSaving(true);
      const ref = makeSupportRef("DN");
      try {
        await submitPledge({
          ref, kind: "donation", acknowledged: true, amount, currency: cur, frequency: freq,
          region: donateRegion === "any" ? "where-most-needed" : donateRegion, category: category || null,
          donor_name: name.slice(0, 120), donor_type: String(f.get("donor_type") || "") || null, email: email.slice(0, 255),
          phone: String(f.get("phone") || "").slice(0, 40) || null, country: String(f.get("country") || "").slice(0, 80) || null,
          preferred_contact: String(f.get("preferred_contact") || "") || null, anonymous: f.get("anonymous") === "on",
        });
        setDone({ ref, amount, currency: cur });
      } catch (x) { setErr((x as Error).message); } finally { setSaving(false); }
    }}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-ea-green">Africa Special Needs Education Support Fund · A Rebuild My School Africa service · 2027</p>
      <fieldset><legend className="text-sm font-semibold">Frequency</legend>
        <div className="mt-2 flex flex-wrap gap-2">{FREQ.map((x) => <button key={x} type="button" aria-pressed={freq === x} className={chip(freq === x)} onClick={() => setFreq(x)}>{x}</button>)}</div></fieldset>
      <fieldset><legend className="text-sm font-semibold">Currency</legend>
        <div className="mt-2 flex flex-wrap gap-2">{CURS.map((x) => <button key={x} type="button" aria-pressed={cur === x} className={chip(cur === x)} onClick={() => { setCur(x); setPreset(SNS_DONATION_PRESETS[x][2]); }}>{x}</button>)}</div></fieldset>
      <fieldset><legend className="text-sm font-semibold">Amount</legend>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {SNS_DONATION_PRESETS[cur].map((v) => <button key={v} type="button" aria-pressed={preset === v} className={chip(preset === v)} onClick={() => setPreset(v)}>{fmtMoney(v, cur)}</button>)}
          <button type="button" aria-pressed={preset === "other"} className={chip(preset === "other")} onClick={() => setPreset("other")}>Other amount</button>
        </div>
        {preset === "other" && <label className="mt-2 block text-sm">Other amount ({cur})<input type="number" min="1" step="any" value={other} onChange={(e) => setOther(e.target.value)} className={input} /></label>}
      </fieldset>
      <fieldset><legend className="text-sm font-semibold">Region</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" aria-pressed={donateRegion === "any"} className={chip(donateRegion === "any")} onClick={() => setDonateRegion("any")}>Where most needed</button>
          {SNS_REGIONS.map((r) => <button key={r.key} type="button" aria-pressed={donateRegion === r.key} className={chip(donateRegion === r.key)} onClick={() => setDonateRegion(r.key)}>{r.name}</button>)}
        </div></fieldset>
      <label className="block text-sm font-semibold">Category (optional)
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={input + " mt-1 font-normal"}>
          <option value="">Any category</option>{SNS_CATEGORIES.map((c) => <option key={c.title}>{c.title}</option>)}
        </select></label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Full name*<input name="donor_name" required maxLength={120} autoComplete="name" className={input} /></label>
        <label className="text-sm">Donating as<select name="donor_type" className={input}>{SNS_DONOR_TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="text-sm">Email*<input name="email" type="email" required maxLength={255} autoComplete="email" className={input} /></label>
        <label className="text-sm">Phone / WhatsApp<input name="phone" type="tel" maxLength={40} autoComplete="tel" className={input} /></label>
        <label className="text-sm">Country<input name="country" maxLength={80} autoComplete="country-name" className={input} /></label>
        <label className="text-sm">Preferred contact<select name="preferred_contact" className={input}><option>Email</option><option>Phone</option><option>WhatsApp</option></select></label>
      </div>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="anonymous" className="mt-1 h-4 w-4" /> Keep my name off public lists</label>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="ack" required className="mt-1 h-4 w-4" /> <span>I understand that {SNS_PAYMENT_NOTICE.charAt(0).toLowerCase() + SNS_PAYMENT_NOTICE.slice(1)} Support Fund money is ring-fenced for approved interventions.*</span></label>
      <div className="rounded-2xl bg-ea-sand p-4 text-sm" aria-live="polite">
        <strong>Summary:</strong> {freq} · {amount > 0 ? fmtMoney(amount, cur) : "—"} · {region ? region.name : "Where most needed"}{category ? ` · ${category}` : ""}
        {pct && region && <p className="mt-1 text-ea-green">That's {pct}% of the {region.name} US$150,000 target</p>}
      </div>
      <p className="text-xs text-ea-muted">{SNS_PAYMENT_NOTICE}</p>
      {err && <p role="alert" className="text-sm font-semibold text-ea-brown">{err}</p>}
      <button type="submit" disabled={saving} className={pillPrimary + " w-full sm:w-auto"}>{saving ? "Saving…" : "Continue to bank transfer"}</button>
    </form>
  );
}
