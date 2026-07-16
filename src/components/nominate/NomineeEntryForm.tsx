import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ConsentDeclarationCheckbox } from "./ConsentDeclarationCheckbox";
import { IntegrityNotice } from "./IntegrityNotice";
import { ArrowLeft, Save, X, ShieldCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useDraftPersistence } from "@/features/nominate/useDraftPersistence";
import { trackEvent } from "@/lib/analytics";
import type { NominationPathway, NomineeEntry } from "./types";

const PATHWAY_LABEL: Record<NominationPathway, string> = {
  icon: "Africa Education Icon",
  "gold-bluegarnet": "Gold-Blue Garnet",
  platinum: "Platinum Recognition",
  influencer: "Influencer Education Impact",
  "special-needs-school": "Special Needs School Intervention",
};

const PATHWAY_FAMILY: Record<NominationPathway, string> = {
  icon: "icon",
  "gold-bluegarnet": "gold-bluegarnet",
  platinum: "platinum",
  influencer: "influencer",
  "special-needs-school": "special-needs-school",
};

import {
  ICON_CATEGORY_NAMES,
  ICON_NOMINEE_TYPES,
} from "@/config/nomination/iconTaxonomy";

const ICON_CATEGORIES = ICON_CATEGORY_NAMES;

interface Props {
  pathway: NominationPathway;
  initial?: NomineeEntry | null;
  preselect?: {
    category?: string;
    subcategory?: string;
    region?: string;
    zone?: string;
    state?: string;
    awardFamily?: string;
    recognitionClass?: string;
  };
  onCancel: () => void;
  onSave: (entry: Omit<NomineeEntry, "id"> & { id?: string }) => void;
  totalEntries: number;
}


function uid() {
  return `nm_${Math.random().toString(36).slice(2, 10)}`;
}

export function NomineeEntryForm({
  pathway,
  initial,
  preselect,
  onCancel,
  onSave,
  totalEntries,
}: Props) {
  const [form, setForm] = useState<NomineeEntry>(() =>
    initial ?? {
      id: uid(),
      pathway,
      nomineeName: "",
      nomineeType:
        pathway === "icon"
          ? "Africans in Africa"
          : pathway === "platinum"
          ? "Organization"
          : "Individual",
      awardFamily: preselect?.awardFamily ?? PATHWAY_FAMILY[pathway],
      category: preselect?.category ?? "",
      subcategory: preselect?.subcategory ?? "",
      country: "",
      region: preselect?.region ?? "",
      city: "",
      organization: "",
      contact: "",
      website: "",
      socialLinks: "",

      biography: "",
      impactSummary: "",
      reason: "",
      evidenceLinks: "",
      consent: false,
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Draft persistence — nominate-first: values survive refresh/close
  // without requiring an account. Keyed per pathway + editing target so
  // multiple in-progress entries don't clobber each other.
  const draftKey = `entry-${pathway}-${initial?.id ?? "new"}`;
  const { hydratedValues, clearDraft, draftToken } = useDraftPersistence<NomineeEntry>(
    draftKey,
    form,
  );
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;
    if (initial) {
      hydratedRef.current = true;
      return;
    }
    if (hydratedValues && hydratedValues.pathway === pathway) {
      hydratedRef.current = true;
      setForm(hydratedValues);
      toast.message("Draft restored — pick up where you left off.", {
        description: "No account required. Your entry is saved on this device.",
      });
      trackEvent("nomination_draft_restored", {
        form: draftKey,
        token: draftToken,
        source: "nominee_entry_form",
      });
    }
  }, [hydratedValues, initial, pathway, draftKey, draftToken]);

  useEffect(() => {
    setForm((f) => {
      const next = { ...f, pathway, awardFamily: PATHWAY_FAMILY[pathway] };
      if (pathway === "icon") {
        if (!ICON_NOMINEE_TYPES.some((t) => t.value === f.nomineeType)) {
          next.nomineeType = "Africans in Africa";
        }
        if (!ICON_CATEGORIES.includes(f.category as typeof ICON_CATEGORIES[number])) {
          next.category = "";
        }
        next.subcategory = "";
      }
      return next;
    });
  }, [pathway]);

  const set = <K extends keyof NomineeEntry>(k: K, v: NomineeEntry[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nomineeName.trim()) e.nomineeName = "Required";
    if (!form.country.trim()) e.country = "Required";
    if (!form.region.trim()) e.region = "Required";
    if (!form.category.trim()) e.category = "Required";
    if (form.impactSummary.trim().length < 20)
      e.impactSummary = "Please provide at least 20 characters";
    if (form.reason.trim().length < 20) e.reason = "Please provide at least 20 characters";
    if (!form.consent) e.consent = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    clearDraft();
    onSave(form);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    hydratedRef.current = true;
    setForm({
      id: uid(),
      pathway,
      nomineeName: "",
      nomineeType:
        pathway === "icon"
          ? "Africans in Africa"
          : pathway === "platinum"
          ? "Organization"
          : "Individual",
      awardFamily: preselect?.awardFamily ?? PATHWAY_FAMILY[pathway],
      category: preselect?.category ?? "",
      subcategory: preselect?.subcategory ?? "",
      country: "",
      region: preselect?.region ?? "",
      city: "",
      organization: "",
      contact: "",
      website: "",
      socialLinks: "",
      biography: "",
      impactSummary: "",
      reason: "",
      evidenceLinks: "",
      consent: false,
    });
    toast.success("Draft cleared.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
            Step 3 · Pathway: {PATHWAY_LABEL[pathway]}
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            {initial ? "Edit Nominee" : `Nominee Details${totalEntries > 0 ? ` (#${totalEntries + 1})` : ""}`}
          </h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nominee name" error={errors.nomineeName} required>
          <Input
            value={form.nomineeName}
            onChange={(e) => set("nomineeName", e.target.value)}
            placeholder="Full name or organization"
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>

        <Field label="Nominee type" required>
          {pathway === "icon" ? (
            <>
              <select
                value={form.nomineeType}
                onChange={(e) => set("nomineeType", e.target.value)}
                className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
              >
                {ICON_NOMINEE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[11px] text-white/55">
                {ICON_NOMINEE_TYPES.find((t) => t.value === form.nomineeType)?.description}
              </p>
            </>
          ) : (
            <select
              value={form.nomineeType}
              onChange={(e) => set("nomineeType", e.target.value)}
              className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
            >
              <option value="Individual">Individual</option>
              <option value="Organization">Organization</option>
              <option value="School">School</option>
              <option value="NGO">NGO</option>
              <option value="Government / Ministry">Government / Ministry</option>
              <option value="Foundation">Foundation</option>
              <option value="Creator / Media">Creator / Media</option>
              <option value="CSR Contributor">CSR Contributor</option>
            </select>
          )}
        </Field>

        <Field label="Category" error={errors.category} required>
          {pathway === "icon" ? (
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
            >
              <option value="">Select an Icon category…</option>
              {ICON_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : (
            <Input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Best STEM Educator"
              className="bg-white/5 border-white/10 text-white"
            />
          )}
        </Field>

        {pathway !== "icon" && (
          <Field label="Sub-category">
            <Input
              value={form.subcategory ?? ""}
              onChange={(e) => set("subcategory", e.target.value)}
              placeholder="Optional"
              className="bg-white/5 border-white/10 text-white"
            />
          </Field>
        )}

        <Field label="Country" error={errors.country} required>
          <Input
            value={form.country}
            onChange={(e) => set("country", e.target.value)}
            placeholder="e.g. Nigeria"
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>

        <Field label="Region" error={errors.region} required>
          <Input
            value={form.region}
            onChange={(e) => set("region", e.target.value)}
            placeholder="e.g. West Africa"
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>

        <Field label="City / community">
          <Input
            value={form.city ?? ""}
            onChange={(e) => set("city", e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>

        <Field label="Organization (if applicable)">
          <Input
            value={form.organization ?? ""}
            onChange={(e) => set("organization", e.target.value)}
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>

        <Field label="Nominee email / public contact">
          <Input
            type="email"
            value={form.contact ?? ""}
            onChange={(e) => set("contact", e.target.value)}
            placeholder="optional"
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>

        <Field label="Website">
          <Input
            value={form.website ?? ""}
            onChange={(e) => set("website", e.target.value)}
            placeholder="https://"
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>

        <Field label="Social links" className="md:col-span-2">
          <Input
            value={form.socialLinks ?? ""}
            onChange={(e) => set("socialLinks", e.target.value)}
            placeholder="LinkedIn, X, Instagram, YouTube — comma separated"
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>

        <Field label="Short biography / profile" className="md:col-span-2">
          <Textarea
            value={form.biography ?? ""}
            onChange={(e) => set("biography", e.target.value)}
            rows={3}
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>

        <Field
          label="Education impact summary"
          error={errors.impactSummary}
          required
          className="md:col-span-2"
        >
          <Textarea
            value={form.impactSummary}
            onChange={(e) => set("impactSummary", e.target.value)}
            rows={4}
            placeholder="Challenge → Intervention → Results → Vision. e.g. 'In rural Borno, fewer than 30% of girls completed primary school. We launched 12 community schools and trained 240 teachers. Today 4,800 girls are enrolled, with 78% completion. Next: scale to 5 more states by 2027.'"
            className="bg-white/5 border-white/10 text-white"
          />
          <details className="mt-2 text-[11px] text-white/55 group">
            <summary className="cursor-pointer text-gold/80 hover:text-gold select-none">
              Need a prompt? Use the NESA story arc ↓
            </summary>
            <ul className="mt-2 space-y-1.5 pl-3 border-l border-gold/20">
              <li><span className="text-amber-300 font-medium">Challenge:</span> What education barrier existed before this nominee acted?</li>
              <li><span className="text-gold font-medium">Intervention:</span> What bold, sustained action did they take?</li>
              <li><span className="text-emerald-300 font-medium">Results:</span> What measurable change happened — numbers + human story?</li>
              <li><span className="text-sky-300 font-medium">Vision:</span> How does this scale or inspire systemic change across Africa?</li>
            </ul>
            <p className="mt-2">
              Full guide: <a href="/guidelines/impact-storytelling" target="_blank" rel="noreferrer" className="underline text-gold/80 hover:text-gold">Impact Storytelling Guide</a>
            </p>
          </details>
        </Field>

        <Field
          label="Why this nominee should be recognized"
          error={errors.reason}
          required
          className="md:col-span-2"
        >
          <Textarea
            value={form.reason}
            onChange={(e) => set("reason", e.target.value)}
            rows={4}
            placeholder="Make the case for recognition. Cover the 6 EDI dimensions where you can: Impact, Leadership, Innovation, Inclusion, Sustainability, Community Reach."
            className="bg-white/5 border-white/10 text-white"
          />
          <p className="mt-1.5 text-[11px] text-white/50">
            Tip: one verifiable sentence per EDI dimension makes nominations score higher.
          </p>
        </Field>

        <Field label="Public evidence links" className="md:col-span-2">
          <Textarea
            value={form.evidenceLinks ?? ""}
            onChange={(e) => set("evidenceLinks", e.target.value)}
            rows={2}
            placeholder="News articles, official sources, reports — one per line"
            className="bg-white/5 border-white/10 text-white"
          />
        </Field>
      </div>

      <ConsentDeclarationCheckbox
        checked={form.consent}
        onChange={(v) => set("consent", v)}
      >
        I confirm this nomination is made in good faith and the information provided is accurate
        to the best of my knowledge. I understand it is subject to eligibility, verification,
        category-fit, governance, and integrity review.
      </ConsentDeclarationCheckbox>
      {errors.consent && (
        <p className="text-xs text-red-300 -mt-3">Please confirm the declaration</p>
      )}

      <IntegrityNotice variant="compact" />

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-full border-white/20 text-white hover:bg-white/10 gap-2"
        >
          <X className="h-4 w-4" /> Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 gap-2 shadow-gold"
        >
          <Save className="h-4 w-4" />
          {initial ? "Update nominee" : "Save nominee"}
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
