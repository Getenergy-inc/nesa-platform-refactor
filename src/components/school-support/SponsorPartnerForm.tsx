import { useState } from "react";
import {
  SNS_PARTNER_CONTRIBUTIONS, SNS_PAYMENT_NOTICE, SNS_REGIONS, SNS_SPONSOR_PRESETS, SNS_SPONSOR_PROJECTS, SNS_SPONSOR_SCOPES,
  makeSupportRef, type RegionKey, type SnsCurrency,
} from "@/config/schoolSupport";
import { submitPledge } from "@/services/supportFund";
import { useSupportPage } from "./SupportPageContext";
import { BankTransferPanel } from "./BankTransferPanel";
import { chip, fmtMoney, input, pillOutline, pillPrimary } from "./ui";

const CURS: SnsCurrency[] = ["USD", "NGN", "GBP", "EUR"];
const ORG_TYPES = ["Company", "Foundation", "Development organisation", "Professional association", "Educational institution", "Media organisation", "Diaspora organisation", "Faith-based or community organisation", "Individual", "Other"];

export function SponsorPartnerForm() {
  const { sponsorMode: mode, setSponsorMode: setMode, sponsorRegion, setSponsorRegion } = useSupportPage();
  const [scope, setScope] = useState<string>("region");
  const [projects, setProjects] = useState<string[]>([]);
  const [contribs, setContribs] = useState<string[]>([]);
  const [partnerRegions, setPartnerRegions] = useState<RegionKey[]>([]);
  const [cur, setCur] = useState<SnsCurrency>("USD");
  const [value, setValue] = useState<number | null>(150000);
  const [noRecog, setNoRecog] = useState(false);
  const [err, setErr] = useState(""); const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<{ ref: string; monetary: boolean; amount: number | null; currency: SnsCurrency } | null>(null);
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const submitLabel = mode === "sponsor" ? "Sponsor a Regional School" : "Become a Programme Partner";

  if (done) return (
    <div className="space-y-5" aria-live="polite">
      <div className="rounded-2xl bg-ea-green/10 p-5">
        <h3 className="text-2xl">Thank you — we have your {mode === "sponsor" ? "sponsorship" : "partnership"} enquiry</h3>
        <p className="mt-1 text-sm">Your reference: <strong>{done.ref}</strong></p>
        <p className="mt-2 text-sm text-ea-muted">The programme team will contact you to agree scope in writing. {SNS_PAYMENT_NOTICE}</p>
      </div>
      {done.monetary && <BankTransferPanel refCode={done.ref} currency={done.currency} amount={done.amount} heading="When your agreement is confirmed, pay by bank transfer" />}
      <button type="button" className={pillOutline} onClick={() => setDone(null)}>Send another enquiry</button>
    </div>
  );

  return (
    <form noValidate className="space-y-6" onSubmit={async (e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      const org = String(f.get("organisation") || "").trim(); const person = String(f.get("contact_person") || "").trim(); const email = String(f.get("email") || "").trim();
      if (!org || !person || !/^\S+@\S+\.\S+$/.test(email)) return setErr("Please complete organisation, contact person and a valid email.");
      if (f.get("ack") !== "on") return setErr("Please confirm the acknowledgement before submitting.");
      setErr(""); setSaving(true);
      const ref = makeSupportRef(mode === "sponsor" ? "SP" : "PT");
      const monetary = mode === "sponsor" ? scope !== "in-kind" : contribs.includes("Funding");
      try {
        await submitPledge({
          ref, kind: mode, acknowledged: true,
          scope: mode === "sponsor" ? scope : null, projects: mode === "sponsor" ? projects : [], contributions: mode === "partner" ? contribs : [],
          region: mode === "sponsor" ? sponsorRegion : partnerRegions.join(",") || null,
          amount: mode === "sponsor" && scope !== "in-kind" ? value : null, currency: cur,
          in_kind_description: String(f.get("in_kind") || "").slice(0, 1000) || null,
          recognition_name: noRecog ? null : String(f.get("recognition_name") || "").slice(0, 120) || null, anonymous: noRecog,
          organisation: org.slice(0, 160), organisation_type: String(f.get("org_type") || "") || null, contact_person: person.slice(0, 120),
          contact_role: String(f.get("role") || "").slice(0, 120) || null, email: email.slice(0, 255), phone: String(f.get("phone") || "").slice(0, 40) || null,
          country: String(f.get("country") || "").slice(0, 80) || null, website: String(f.get("website") || "").slice(0, 255) || null,
          message: String(f.get("message") || "").slice(0, 2000) || null,
        });
        setDone({ ref, monetary, amount: mode === "sponsor" && scope !== "in-kind" ? value : null, currency: cur });
      } catch (x) { setErr((x as Error).message); } finally { setSaving(false); }
    }}>
      <div role="radiogroup" aria-label="Form mode" className="inline-flex flex-wrap gap-1 rounded-full border border-ea-line bg-ea-sand p-1">
        {(["sponsor", "partner"] as const).map((m) => (
          <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)}
            className={"min-h-10 rounded-full px-4 text-sm font-semibold " + (mode === m ? "bg-ea-green text-ea-cream" : "text-ea-ink")}>
            {m === "sponsor" ? "Sponsor a Regional School" : "Become a Programme Partner"}
          </button>
        ))}
      </div>

      {mode === "sponsor" ? (
        <>
          <fieldset><legend className="text-sm font-semibold">Scope</legend>
            <div className="mt-2 flex flex-wrap gap-2">{SNS_SPONSOR_SCOPES.map((s) => <button key={s.id} type="button" aria-pressed={scope === s.id} className={chip(scope === s.id)} onClick={() => setScope(s.id)}>{s.label}</button>)}</div></fieldset>
          <fieldset><legend className="text-sm font-semibold">Projects (optional)</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">{SNS_SPONSOR_PROJECTS.map((p) => <label key={p} className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 h-4 w-4" checked={projects.includes(p)} onChange={() => setProjects(toggle(projects, p))} />{p}</label>)}</div></fieldset>
          <fieldset><legend className="text-sm font-semibold">Region</legend>
            <div className="mt-2 flex flex-wrap gap-2">{SNS_REGIONS.map((r) => <button key={r.key} type="button" aria-pressed={sponsorRegion === r.key} className={chip(sponsorRegion === r.key)} onClick={() => setSponsorRegion(r.key)}>{r.name}</button>)}</div></fieldset>
          {scope !== "in-kind" ? (
            <fieldset><legend className="text-sm font-semibold">Value</legend>
              <div className="mt-2 flex flex-wrap gap-2">{CURS.map((x) => <button key={x} type="button" aria-pressed={cur === x} className={chip(cur === x)} onClick={() => setCur(x)}>{x}</button>)}</div>
              {cur === "USD" && <div className="mt-2 flex flex-wrap gap-2">{SNS_SPONSOR_PRESETS.map((v) => <button key={v} type="button" aria-pressed={value === v} className={chip(value === v)} onClick={() => setValue(v)}>{fmtMoney(v, "USD")}{v === 150000 ? " full region" : ""}</button>)}</div>}
              <label className="mt-2 block text-sm">Amount ({cur})<input type="number" min="1" step="any" value={value ?? ""} onChange={(e) => setValue(Number(e.target.value) || null)} className={input} /></label>
            </fieldset>
          ) : (
            <label className="block text-sm">In-kind description<textarea name="in_kind" maxLength={1000} rows={3} className={input} /></label>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">Recognition name<input name="recognition_name" maxLength={120} disabled={noRecog} className={input} /></label>
            <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" className="h-4 w-4" checked={noRecog} onChange={(e) => setNoRecog(e.target.checked)} /> Prefer not to be recognised</label>
          </div>
        </>
      ) : (
        <>
          <fieldset><legend className="text-sm font-semibold">Contribution</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">{SNS_PARTNER_CONTRIBUTIONS.map((p) => <label key={p} className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 h-4 w-4" checked={contribs.includes(p)} onChange={() => setContribs(toggle(contribs, p))} />{p}</label>)}</div></fieldset>
          <fieldset><legend className="text-sm font-semibold">Regions of interest</legend>
            <div className="mt-2 flex flex-wrap gap-2">{SNS_REGIONS.map((r) => <button key={r.key} type="button" aria-pressed={partnerRegions.includes(r.key)} className={chip(partnerRegions.includes(r.key))} onClick={() => setPartnerRegions(toggle(partnerRegions, r.key))}>{r.name}</button>)}</div></fieldset>
        </>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Organisation*<input name="organisation" required maxLength={160} autoComplete="organization" className={input} /></label>
        <label className="text-sm">Organisation type<select name="org_type" className={input}>{ORG_TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="text-sm">Contact person*<input name="contact_person" required maxLength={120} autoComplete="name" className={input} /></label>
        <label className="text-sm">Role<input name="role" maxLength={120} className={input} /></label>
        <label className="text-sm">Email*<input name="email" type="email" required maxLength={255} autoComplete="email" className={input} /></label>
        <label className="text-sm">Phone<input name="phone" type="tel" maxLength={40} className={input} /></label>
        <label className="text-sm">Country<input name="country" maxLength={80} className={input} /></label>
        <label className="text-sm">Website<input name="website" type="url" maxLength={255} className={input} /></label>
      </div>
      <label className="block text-sm">Message<textarea name="message" maxLength={2000} rows={4} className={input} /></label>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="ack" required className="mt-1 h-4 w-4" /><span>I understand that sponsorship and partnership carry no weight in NESA-Africa judging or recognition, that any support is subject to due diligence, available funds and written approval, and that {SNS_PAYMENT_NOTICE.charAt(0).toLowerCase() + SNS_PAYMENT_NOTICE.slice(1)}*</span></label>
      <p className="text-xs text-ea-muted">{SNS_PAYMENT_NOTICE}</p>
      {err && <p role="alert" className="text-sm font-semibold text-ea-brown">{err}</p>}
      <button type="submit" disabled={saving} className={pillPrimary + " w-full sm:w-auto"}>{saving ? "Sending…" : submitLabel}</button>
    </form>
  );
}
