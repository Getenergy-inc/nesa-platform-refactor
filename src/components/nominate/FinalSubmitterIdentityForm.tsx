import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ConsentDeclarationCheckbox } from "./ConsentDeclarationCheckbox";
import { IntegrityNotice } from "./IntegrityNotice";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { SubmitterIdentity } from "./types";

export function FinalSubmitterIdentityForm({
  initial,
  onBack,
  onContinue,
}: {
  initial?: SubmitterIdentity | null;
  onBack: () => void;
  onContinue: (s: SubmitterIdentity) => void;
}) {
  const { t } = useTranslation("nomination");
  const [form, setForm] = useState<SubmitterIdentity>(
    initial ?? {
      fullName: "",
      email: "",
      phone: "",
      countryOfResidence: "",
      countryOfOrigin: "",
      consent: false,
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof SubmitterIdentity>(k: K, v: SubmitterIdentity[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 2) e.fullName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (form.phone.trim().length < 6) e.phone = "Required";
    if (!form.countryOfResidence.trim()) e.countryOfResidence = "Required";
    if (!form.countryOfOrigin.trim()) e.countryOfOrigin = "Required";
    if (!form.consent) e.consent = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onContinue(form);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
          {t("flow.identity.eyebrow")}
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
          {t("flow.identity.title")}
        </h2>
        <p className="text-sm text-white/65 max-w-2xl leading-relaxed">
          {t("flow.identity.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={t("flow.identity.fullName")} error={errors.fullName} required>
          <Input
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>
        <Field label={t("flow.identity.email")} error={errors.email} required>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>
        <Field label={t("flow.identity.phone")} error={errors.phone} required>
          <Input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+234 …"
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>
        <Field label={t("flow.identity.countryResidence")} error={errors.countryOfResidence} required>
          <Input
            value={form.countryOfResidence}
            onChange={(e) => set("countryOfResidence", e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>
        <Field
          label={t("flow.identity.countryOrigin")}
          error={errors.countryOfOrigin}
          required
          className="md:col-span-2"
        >
          <Input
            value={form.countryOfOrigin}
            onChange={(e) => set("countryOfOrigin", e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>
      </div>

      <ConsentDeclarationCheckbox
        checked={form.consent}
        onChange={(v) => set("consent", v)}
      />
      {errors.consent && (
        <p className="text-xs text-red-300 -mt-3">{t("flow.identity.confirmDeclaration")}</p>
      )}

      <IntegrityNotice />

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-full border-white/20 text-white hover:bg-white/10 gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> {t("flow.identity.back")}
        </Button>
        <Button
          type="submit"
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 gap-2 shadow-gold"
        >
          {t("flow.identity.continue")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  required,
  error,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs font-medium text-white/80">
        {label} {required && <span className="text-gold">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
