import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WORLD_COUNTRIES } from "@/config/worldCountries";
import { INTEREST_FORMS, participationMessage, type InterestKind } from "@/config/participationForms2027";
import { submitContactEnquiry } from "@/services/contactEnquiries";

export function ParticipationInterestForm({ kind }: { kind: InterestKind }) {
  const { t } = useTranslation("pages");
  const tr = (key: string, text: string) => t(`participation2027.${key}`, { defaultValue: text });
  const config = INTEREST_FORMS[kind];
  const [saving, setSaving] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const prefix = `interest-${kind}`;
  if (reference) return <div role="status" className="space-y-3 border border-gold/25 p-5">
    <p>{t("participation2027.received", { defaultValue: "Thank you. We've received your {{formName}}. A pledge is not a payment; we will contact you before any money changes hands.", formName: tr(`${kind}.name`, config.name) })}</p>
    <p>{tr("reference", "Your reference")}: <strong>{reference}</strong></p>
    <Button variant="outline" onClick={() => setReference("")}>{tr("another", "Send another enquiry")}</Button>
  </div>;
  return <form aria-label={tr(`${kind}.name`, config.name)} className="space-y-4" onSubmit={async event => {
    event.preventDefault(); if (saving) return;
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(config.fields.map(field => [field.name, data.getAll(field.name).join(", ")]));
    setSaving(true); setError("");
    try {
      const requiredChoice = config.fields.find(field => field.multiple && !field.optional && !values[field.name]);
      if (requiredChoice) throw new Error(tr("requiredChoice", "Please choose at least one interest."));
      const saved = await submitContactEnquiry({ name: String(data.get("name") || ""), email: String(data.get("email") || ""), country: String(data.get("country") || ""), preferred_contact: "Email", enquiry_type: config.topic, subject: config.name, message: participationMessage(kind, values), consent: data.get("consent") === "on", website: String(data.get("website") || "") });
      setReference(saved);
    } catch (err) { setError(err instanceof Error ? err.message : tr("error", "We could not save your enquiry. Please try again.")); }
    finally { setSaving(false); }
  }}>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2"><Label htmlFor={`${prefix}-name`}>{tr("name", "Adult contact name")}</Label><Input id={`${prefix}-name`} name="name" required minLength={2} maxLength={160} autoComplete="name" /></div>
      <div className="space-y-2"><Label htmlFor={`${prefix}-email`}>{tr("email", "Email address")}</Label><Input id={`${prefix}-email`} name="email" type="email" required maxLength={320} autoComplete="email" /></div>
      <div className="space-y-2"><Label htmlFor={`${prefix}-country`}>{tr("country", "Your country")}</Label><select id={`${prefix}-country`} name="country" required className="min-h-10 w-full rounded-md border border-input bg-background px-3 text-foreground"><option value="">{tr("chooseCountry", "Choose a country")}</option>{WORLD_COUNTRIES.map(country => <option key={country}>{tr(`countries.${country}`, country)}</option>)}</select></div>
      {config.fields.map(field => <div key={field.name} className="min-w-0 space-y-2">
        {field.multiple ? <fieldset><legend className="mb-2 text-sm font-medium">{tr(`${kind}.${field.name}`, field.label)}</legend><div className="space-y-2">{field.options?.map(option => <label key={option} className="flex items-start gap-2 text-sm"><input name={field.name} type="checkbox" value={option} className="mt-1 shrink-0" />{tr(`options.${option}`, option)}</label>)}</div></fieldset>
          : <><Label htmlFor={`${prefix}-${field.name}`}>{tr(`${kind}.${field.name}`, field.label)}</Label>{field.options || field.name === "schoolCountry" || field.name === "destination" ? <select id={`${prefix}-${field.name}`} name={field.name} required={!field.optional} className="min-h-10 w-full rounded-md border border-input bg-background px-3 text-foreground"><option value="">{tr("choose", "Choose an option")}</option>{(field.options || WORLD_COUNTRIES).map(option => <option key={option} value={option}>{tr(`options.${option}`, option)}</option>)}</select> : <Input id={`${prefix}-${field.name}`} name={field.name} type={field.type || "text"} min={field.type === "number" ? 1 : undefined} maxLength={200} required={!field.optional} />}</>}
      </div>)}
    </div>
    {kind === "scholarships" && <p className="text-sm">{tr("feesNotice", "Paid to the school or EduAid Africa Ltd only, never to individuals.")}</p>}
    {kind === "reminder" && <p className="text-sm">{tr("reminderNotice", "This records your reminder request; it is not a vote.")}</p>}
    <p className="text-sm">{tr("safeguarding", "Do not include children's names, photographs, diagnoses or medical details, or card or bank log-in details.")}</p>
    <label className="flex items-start gap-2 text-sm"><input name="consent" type="checkbox" required className="mt-1 shrink-0" />{tr("consent", "I consent to recording this enquiry and being contacted by email. I have permission to share any school adult contact details supplied.")}</label>
    <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    {error && <p role="alert" className="text-destructive">{error}</p>}
    <Button type="submit" disabled={saving}>{saving ? tr("saving", "Saving…") : kind === "reminder" ? tr("reminderButton", "Get a reminder") : tr("submit", "Submit enquiry")}</Button>
  </form>;
}