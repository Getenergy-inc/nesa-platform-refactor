import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown, Download, FileText, Loader2, Send, ShieldCheck, Sparkles } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDraftPersistence } from "@/features/nominate/useDraftPersistence";
import { AccountAtSubmitPanel } from "@/features/nominate/AccountAtSubmitPanel";
import { trackEvent } from "@/lib/analytics";

// ─────────────────────────── Taxonomy ───────────────────────────
const PATHWAYS = [
  {
    slug: "education-philanthropy-icon",
    label: "Africa Education Philanthropy Icon",
    blurb: "Funding, endowments, scholarships, and long-term investment in education.",
  },
  {
    slug: "literary-new-curriculum-advocate",
    label: "Literary & New Curriculum Advocate Icon",
    blurb: "Authorship, literacy campaigns, and curriculum reform.",
  },
  {
    slug: "technical-educator-icon",
    label: "Africa Technical Education Icon",
    blurb: "TVET, STEM, engineering, and digital-skills education.",
  },
] as const;

const CLASSIFICATIONS = [
  { slug: "african-in-africa", label: "African in Africa" },
  { slug: "diaspora-african", label: "Diaspora African" },
  { slug: "friend-of-africa", label: "Friend of Africa" },
] as const;

const EDI_DIMENSIONS = [
  { key: "edi_lifetime_impact", label: "Lifetime education impact" },
  { key: "edi_scale_reach", label: "Scale and reach" },
  { key: "edi_inclusion_equity", label: "Inclusion and equity" },
  { key: "edi_innovation", label: "Innovation and knowledge contribution" },
  { key: "edi_sustainability", label: "Sustainability and legacy" },
  { key: "edi_leadership", label: "Leadership and integrity" },
  { key: "edi_evidence_quality", label: "Evidence quality" },
  { key: "edi_continental_relevance", label: "Continental relevance" },
] as const;

const EVIDENCE_CHIPS = [
  "Website links",
  "Reports",
  "Publications",
  "Media coverage",
  "Institutional records",
  "Photographs",
  "Videos",
  "Testimonials",
  "Supporting documents",
];

const RELATIONSHIPS = [
  "Colleague",
  "Beneficiary",
  "Institutional partner",
  "Family",
  "Self-nomination",
  "Other",
] as const;

const DECLARATIONS = [
  "The information provided is accurate to the best of my knowledge.",
  "This nomination is made voluntarily, without payment or incentive.",
  "I have not submitted false or misleading evidence.",
  "I understand this submission may be reviewed by the Nominee Research Corps (NRC).",
  "I understand recognition is based on verified impact, not popularity.",
] as const;

const STEP_TITLES = [
  "Recognition Pathway",
  "Classification",
  "Nominee Information",
  "Nomination Details",
  "EDI Matrix Alignment",
  "Evidence",
  "Nominator Information",
  "Declaration",
  "Review & Submit",
];

// ─────────────────────────── State ───────────────────────────
interface WizardState {
  pathway: string;
  classification: string;
  // nominee
  full_name: string;
  professional_title: string;
  organisation: string;
  country_nationality: string;
  country_residence: string;
  country_impact: string;
  email: string;
  telephone: string;
  website: string;
  linkedin: string;
  photo_url: string;
  // details
  q_why: string;
  q_lifetime: string;
  q_programmes: string;
  q_beneficiaries: string;
  q_regions: string;
  q_sustainability: string;
  // EDI (index-signature so we can address by dimension key)
  [key: string]: string | boolean | number;
  // evidence
  evidence_links: string;
  // nominator
  nm_full_name: string;
  nm_email: string;
  nm_telephone: string;
  nm_country: string;
  nm_organisation: string;
  nm_relationship: string;
  // declarations (0..4)
  decl_0: boolean;
  decl_1: boolean;
  decl_2: boolean;
  decl_3: boolean;
  decl_4: boolean;
}

const INITIAL: WizardState = {
  pathway: "",
  classification: "",
  full_name: "",
  professional_title: "",
  organisation: "",
  country_nationality: "",
  country_residence: "",
  country_impact: "",
  email: "",
  telephone: "",
  website: "",
  linkedin: "",
  photo_url: "",
  q_why: "",
  q_lifetime: "",
  q_programmes: "",
  q_beneficiaries: "",
  q_regions: "",
  q_sustainability: "",
  edi_lifetime_impact: "",
  edi_scale_reach: "",
  edi_inclusion_equity: "",
  edi_innovation: "",
  edi_sustainability: "",
  edi_leadership: "",
  edi_evidence_quality: "",
  edi_continental_relevance: "",
  evidence_links: "",
  nm_full_name: "",
  nm_email: "",
  nm_telephone: "",
  nm_country: "",
  nm_organisation: "",
  nm_relationship: "",
  decl_0: false,
  decl_1: false,
  decl_2: false,
  decl_3: false,
  decl_4: false,
};

// ─────────────────────────── Validation per step ───────────────────────────
export function validateStep(step: number, s: WizardState): string | null {
  switch (step) {
    case 0:
      return s.pathway ? null : "Choose a recognition pathway.";
    case 1:
      return s.classification ? null : "Choose a classification.";
    case 2: {
      if (!s.full_name.trim()) return "Full name is required.";
      if (!s.professional_title.trim()) return "Professional title is required.";
      if (!s.country_nationality.trim()) return "Country of nationality is required.";
      if (!s.country_residence.trim()) return "Country of residence is required.";
      if (!s.country_impact.trim()) return "Primary country of education impact is required.";
      // Optional fields — validate format only when provided.
      if (s.email.trim() && !z.string().email().safeParse(s.email.trim()).success) {
        return "Nominee email is not a valid address.";
      }
      const urlOk = (v: string) => /^https?:\/\/.+/i.test(v.trim());
      if (s.website.trim() && !urlOk(s.website)) return "Nominee website must start with http(s)://";
      if (s.linkedin.trim() && !urlOk(s.linkedin)) return "LinkedIn/profile link must start with http(s)://";
      if (s.photo_url.trim() && !urlOk(s.photo_url)) return "Photograph link must start with http(s)://";
      return null;
    }
    case 3:
      for (const k of ["q_why", "q_lifetime", "q_programmes", "q_beneficiaries", "q_regions", "q_sustainability"] as const) {
        if (!String(s[k]).trim()) return "All nomination detail questions are required.";
      }
      return null;
    case 4:
      for (const d of EDI_DIMENSIONS) {
        if (!String(s[d.key]).trim()) return `EDI dimension "${d.label}" is required.`;
      }
      return null;
    case 5: {
      const entries = s.evidence_links
        .split(/\r?\n|,/) // one per line, or comma-separated
        .map((l) => l.trim())
        .filter(Boolean);
      if (entries.length < 2) {
        return "Provide at least two independent evidence sources (one per line).";
      }
      return null;
    }
    case 6:
      if (!s.nm_full_name.trim()) return "Your full name is required.";
      if (!z.string().email().safeParse(s.nm_email).success) return "Valid nominator email is required.";
      if (!s.nm_telephone.trim()) return "Nominator telephone is required.";
      if (!s.nm_country.trim()) return "Nominator country is required.";
      if (!s.nm_relationship) return "Relationship to nominee is required.";
      return null;
    case 7:
      return [0, 1, 2, 3, 4].every((i) => s[`decl_${i}` as keyof WizardState]) ? null : "All declarations must be accepted.";
    default:
      return null;
  }
}

// ─────────────────────────── Component ───────────────────────────
interface Props {
  ediDownloadHref?: string;
  ediViewHref?: string;
}

export function IconNominationWizard({
  ediDownloadHref = "/downloads/nesa-africa-2026-edi-matrix.pdf",
  ediViewHref = "#edi-matrix",
}: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(INITIAL);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const { draftToken, hydratedValues, clearDraft } = useDraftPersistence<WizardState>(
    "icon-award-wizard-2026",
    state,
  );

  useEffect(() => {
    if (hydratedValues) {
      setState((prev) => ({ ...prev, ...hydratedValues }));
      trackEvent("nomination_draft_restored", { form: "icon-award", token: draftToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydratedValues]);

  const set = <K extends keyof WizardState>(k: K, v: WizardState[K]) =>
    setState((p) => ({ ...p, [k]: v }));

  const goNext = () => {
    const err = validateStep(step, state);
    if (err) {
      setErrorMsg(err);
      toast.error(err);
      return;
    }
    setErrorMsg(null);
    setStep((s) => Math.min(STEP_TITLES.length - 1, s + 1));
  };
  const goBack = () => {
    setErrorMsg(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const saveDraft = () => {
    toast.success("Draft saved on this device.");
    trackEvent("nomination_draft_saved_manual", { form: "icon-award", token: draftToken });
  };

  const submit = async () => {
    for (let i = 0; i <= 7; i++) {
      const err = validateStep(i, state);
      if (err) {
        setErrorMsg(err);
        toast.error(err);
        setStep(i);
        return;
      }
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const pathway = PATHWAYS.find((p) => p.slug === state.pathway);
      const classification = CLASSIFICATIONS.find((c) => c.slug === state.classification);
      const impactSummary = [
        state.q_why,
        state.q_lifetime,
        state.q_programmes,
        state.q_beneficiaries,
        state.q_regions,
        state.q_sustainability,
      ].join("\n\n");

      const ediBlock = EDI_DIMENSIONS.map((d) => `${d.label}: ${state[d.key]}`).join("\n\n");

      const { data, error } = await supabase.functions.invoke("nominations-submit", {
        body: {
          nominator: {
            full_name: state.nm_full_name,
            email: state.nm_email,
            phone: state.nm_telephone,
            country_residence: state.nm_country,
            organisation: state.nm_organisation,
            relationship: state.nm_relationship,
            consent: true,
          },
          nomination: {
            award_family: "africa-education-icon",
            award_category_slug: "africa-education-icon",
            award_subcategory_slug: pathway?.slug ?? null,
            recognition_class: classification?.slug ?? null,
            nominee_name: state.full_name,
            nominee_type: classification?.label ?? null,
            nominee_country: state.country_residence,
            organization: state.organisation,
            website: state.website,
            social_links: state.linkedin ? [state.linkedin] : [],
            impact_summary: impactSummary,
            reason: `${state.q_why}\n\nEDI ASSESSMENT:\n${ediBlock}\n\nEVIDENCE:\n${state.evidence_links}`,
            source: "icon-award-wizard",
            source_form_slug: "icon-award-wizard-2026",
          },
        },
      });

      if (error) {
        const ctx = (error as { context?: { error?: string; message?: string } }).context;
        throw new Error(ctx?.error || ctx?.message || error.message || "Submission failed");
      }
      if (data && typeof data === "object" && "error" in data && (data as { error?: string }).error) {
        throw new Error((data as { error: string }).error);
      }

      const nominationId =
        data && typeof data === "object" && "id" in data
          ? (data as { id?: string | number }).id ?? null
          : null;
      const ref =
        (data && typeof data === "object" && "reference" in data
          ? String((data as { reference?: string }).reference ?? "")
          : "") ||
        (nominationId ? `NOM-2026-${String(nominationId).slice(-6).toUpperCase()}` : `NOM-2026-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
      setReference(ref);
      trackEvent("nomination_submit_success", {
        category: "africa-education-icon",
        family: "africa-education-icon",
        pathway: state.pathway,
        classification: state.classification,
        reference: ref,
        signed_in: Boolean(user),
      });
      clearDraft();
      toast.success("Nomination submitted — thank you!");
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Submission failed. Try again.";
      trackEvent("nomination_submit_error", { category: "africa-education-icon", message });
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────── Success state ───────────────────────────
  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gold/40 bg-charcoal-light/60 p-6 text-center">
          <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-gold" />
          <h3 className="font-display text-2xl text-gold mb-2">Nomination received</h3>
          <p className="text-sm text-foreground/80 max-w-md mx-auto">
            Your Africa Education Icon nomination is queued for Nominee Research Corps (NRC) verification.
            A confirmation email has been sent to <span className="text-gold">{state.nm_email}</span>.
          </p>
          {reference && (
            <p className="mt-3 text-xs text-foreground/70">
              Reference: <span className="text-gold font-mono">{reference}</span>
            </p>
          )}
        </div>
        {!user && (
          <AccountAtSubmitPanel
            reference={reference}
            defaultEmail={state.nm_email}
            defaultFullName={state.nm_full_name}
            formSlug="africa-education-icon"
          />
        )}
      </div>
    );
  }

  // ─────────────────────────── UI ───────────────────────────
  return (
    <div className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-5 md:p-6 space-y-6">
      {/* Progress indicator (9 segments) */}
      <div>
        <div className="flex items-center justify-between text-xs text-foreground/70 mb-2">
          <span>
            Step <span className="text-gold font-semibold">{step + 1}</span> of {STEP_TITLES.length}
          </span>
          <span className="truncate max-w-[60%] text-right text-foreground/80">
            {STEP_TITLES[step]}
          </span>
        </div>
        <div className="grid grid-cols-9 gap-1.5">
          {STEP_TITLES.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1}: ${t}`}
              className={`h-1.5 rounded-full transition-colors ${
                i < step
                  ? "bg-gold"
                  : i === step
                    ? "bg-gold/80"
                    : "bg-gold/15 hover:bg-gold/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step body */}
      <div className="min-h-[280px]">
        {step === 0 && (
          <RadioGroup
            value={state.pathway}
            onValueChange={(v) => set("pathway", v)}
            className="grid gap-3"
          >
            {PATHWAYS.map((p) => (
              <label
                key={p.slug}
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                  state.pathway === p.slug
                    ? "border-gold bg-gold/10"
                    : "border-gold/20 bg-charcoal/40 hover:border-gold/50"
                }`}
              >
                <RadioGroupItem value={p.slug} className="mt-1" />
                <div>
                  <div className="font-semibold text-white">{p.label}</div>
                  <p className="text-sm text-foreground/70 mt-1">{p.blurb}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        )}

        {step === 1 && (
          <>
            <p className="text-xs text-foreground/70 mb-3">
              Determines which of the 9 laureate slots per pathway the nominee competes within
              (3 African in Africa + 3 Diaspora African + 3 Friend of Africa).
            </p>
            <RadioGroup
              value={state.classification}
              onValueChange={(v) => set("classification", v)}
              className="grid gap-3 sm:grid-cols-3"
            >
              {CLASSIFICATIONS.map((c) => (
                <label
                  key={c.slug}
                  className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                    state.classification === c.slug
                      ? "border-gold bg-gold/10"
                      : "border-gold/20 bg-charcoal/40 hover:border-gold/50"
                  }`}
                >
                  <RadioGroupItem value={c.slug} />
                  <span className="text-white font-medium">{c.label}</span>
                </label>
              ))}
            </RadioGroup>
          </>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldText label="Full name" required value={state.full_name} onChange={(v) => set("full_name", v)} />
            <FieldText label="Professional title" required value={state.professional_title} onChange={(v) => set("professional_title", v)} />
            <FieldText label="Organisation or institution" value={state.organisation} onChange={(v) => set("organisation", v)} />
            <FieldText label="Country of nationality" required value={state.country_nationality} onChange={(v) => set("country_nationality", v)} />
            <FieldText label="Country of residence" required value={state.country_residence} onChange={(v) => set("country_residence", v)} />
            <FieldText label="Primary country of education impact" required value={state.country_impact} onChange={(v) => set("country_impact", v)} />
            <FieldText label="Email address (where available)" type="email" value={state.email} onChange={(v) => set("email", v)} />
            <FieldText label="Telephone number (where available)" value={state.telephone} onChange={(v) => set("telephone", v)} />
            <FieldText label="Website" value={state.website} onChange={(v) => set("website", v)} placeholder="https://…" />
            <FieldText label="LinkedIn or professional profile" value={state.linkedin} onChange={(v) => set("linkedin", v)} />
            <FieldText label="Photograph link (optional)" value={state.photo_url} onChange={(v) => set("photo_url", v)} placeholder="https://…" />
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4">
            <FieldTextarea required label="Why are you nominating this person?" value={state.q_why} onChange={(v) => set("q_why", v)} />
            <FieldTextarea required label="Describe their lifetime contribution to education between 2006 and 2026." value={state.q_lifetime} onChange={(v) => set("q_lifetime", v)} />
            <FieldTextarea required label="What programmes, institutions, reforms or initiatives have they led?" value={state.q_programmes} onChange={(v) => set("q_programmes", v)} />
            <FieldTextarea required label="Which learners, schools, teachers or communities have benefited?" value={state.q_beneficiaries} onChange={(v) => set("q_beneficiaries", v)} />
            <FieldTextarea
              required
              label="What countries or African regions have been reached?"
              helper="Must show impact in at least two African regions, or one region plus Diaspora."
              value={state.q_regions}
              onChange={(v) => set("q_regions", v)}
            />
            <FieldTextarea required label="What makes their contribution sustainable or historically significant?" value={state.q_sustainability} onChange={(v) => set("q_sustainability", v)} />
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
            <div className="grid gap-4">
              {EDI_DIMENSIONS.map((d) => (
                <FieldTextarea
                  key={d.key}
                  required
                  label={d.label}
                  value={String(state[d.key] ?? "")}
                  onChange={(v) => set(d.key, v)}
                />
              ))}
            </div>
            <aside className="lg:sticky lg:top-6 h-max rounded-xl border border-gold/25 bg-charcoal/50 p-4 space-y-3">
              <div className="text-xs uppercase tracking-wider text-gold font-semibold">
                EDI Matrix (reference)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {EDI_DIMENSIONS.map((d) => (
                  <Badge key={d.key} variant="outline" className="border-gold/30 text-gold/90 text-[10px]">
                    {d.label}
                  </Badge>
                ))}
              </div>
              <div className="grid gap-2 pt-2">
                <Button asChild size="sm" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                  <a href={ediViewHref}>
                    <FileText className="h-3.5 w-3.5 mr-1" /> View Full EDI Matrix
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                  <a href={ediDownloadHref} target="_blank" rel="noreferrer">
                    <Download className="h-3.5 w-3.5 mr-1" /> Download EDI Matrix PDF
                  </a>
                </Button>
              </div>
            </aside>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-foreground/70 mb-2">
                All nine evidence types are accepted together — attach or link what supports the nomination best.
              </div>
              <div className="flex flex-wrap gap-1.5">
                {EVIDENCE_CHIPS.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-xs text-foreground/85"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <FieldTextarea
              required
              label="Evidence links or file references"
              helper="Minimum 2 independent sources required. Paste URLs (one per line) or list attached files."
              value={state.evidence_links}
              onChange={(v) => set("evidence_links", v)}
              rows={8}
            />
          </div>
        )}

        {step === 6 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldText required label="Full name" value={state.nm_full_name} onChange={(v) => set("nm_full_name", v)} />
            <FieldText required type="email" label="Email" value={state.nm_email} onChange={(v) => set("nm_email", v)} />
            <FieldText required label="Telephone number" value={state.nm_telephone} onChange={(v) => set("nm_telephone", v)} />
            <FieldText required label="Country" value={state.nm_country} onChange={(v) => set("nm_country", v)} />
            <FieldText label="Organisation (optional)" value={state.nm_organisation} onChange={(v) => set("nm_organisation", v)} />
            <div>
              <Label className="text-sm text-foreground/90">
                Relationship to nominee <span className="text-gold">*</span>
              </Label>
              <Select value={state.nm_relationship} onValueChange={(v) => set("nm_relationship", v)}>
                <SelectTrigger className="mt-1.5 bg-charcoal/40 border-gold/25">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-3">
            {DECLARATIONS.map((text, i) => {
              const key = `decl_${i}` as keyof WizardState;
              return (
                <label
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-gold/20 bg-charcoal/40 p-3 cursor-pointer hover:border-gold/40"
                >
                  <Checkbox
                    checked={Boolean(state[key])}
                    onCheckedChange={(v) => set(key, Boolean(v) as WizardState[typeof key])}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-foreground/85">{text}</span>
                </label>
              );
            })}
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-gold/30 bg-charcoal/50 p-5 space-y-2 text-sm">
              <SummaryRow label="Pathway" value={PATHWAYS.find((p) => p.slug === state.pathway)?.label ?? "—"} />
              <SummaryRow label="Classification" value={CLASSIFICATIONS.find((c) => c.slug === state.classification)?.label ?? "—"} />
              <SummaryRow label="Nominee name" value={state.full_name || "—"} />
              <SummaryRow
                label="Evidence sources"
                value={
                  state.evidence_links.trim()
                    ? `${state.evidence_links.split(/\n+/).filter((l) => l.trim()).length} entries`
                    : "0"
                }
              />
              <SummaryRow
                label="Declarations"
                value={[0, 1, 2, 3, 4].every((i) => state[`decl_${i}` as keyof WizardState]) ? "All accepted" : "Incomplete"}
              />
            </div>
            <p className="text-xs text-foreground/60">
              On submit you'll be asked to create or confirm your account, then receive a
              confirmation email and a nomination reference number.
            </p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {errorMsg}
        </div>
      )}

      {/* Nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gold/15">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10"
            onClick={goBack}
            disabled={step === 0 || submitting}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10"
            onClick={saveDraft}
            disabled={submitting}
          >
            Save Draft
          </Button>
        </div>
        <div className="flex gap-2">
          {step < STEP_TITLES.length - 1 ? (
            <Button
              type="button"
              className="bg-gold text-charcoal hover:bg-gold/90"
              onClick={goNext}
              disabled={submitting}
            >
              Continue <ChevronDown className="ml-1 h-4 w-4 -rotate-90" />
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10"
                onClick={() => setStep(0)}
                disabled={submitting}
              >
                Review Nomination
              </Button>
              <Button
                type="button"
                className="bg-gold text-charcoal hover:bg-gold/90"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Submit Nomination
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Pipeline note */}
      <div className="rounded-xl border border-gold/15 bg-charcoal/40 p-4">
        <div className="text-xs uppercase tracking-wider text-gold font-semibold mb-2">
          What happens after you submit
        </div>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs text-foreground/75">
          {[
            "Nomination logged",
            "NRC identity & duplicate verification (5–10 business days)",
            "Nominee acceptance",
            "NRC dossier preparation & EDI Matrix assessment",
            "Judges Arena (27 Independent Judges, 9 Specialist Panels)",
            "Grand Jury voting",
            "Governance ratification",
            "Certificate & Digital Badge released immediately on ratification",
            "No endorsement threshold — recognition is based on verified impact",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold text-[10px] font-bold">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ─────────────────────────── Field helpers ───────────────────────────
function FieldText({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm text-foreground/90">
        {label} {required && <span className="text-gold">*</span>}
      </Label>
      <Input
        className="mt-1.5 bg-charcoal/40 border-gold/25"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  required,
  helper,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  helper?: string;
  rows?: number;
}) {
  return (
    <div>
      <Label className="text-sm text-foreground/90">
        {label} {required && <span className="text-gold">*</span>}
      </Label>
      {helper && <p className="text-[11px] text-foreground/60 mt-0.5">{helper}</p>}
      <Textarea
        rows={rows}
        className="mt-1.5 bg-charcoal/40 border-gold/25"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gold/10 pb-2 last:border-b-0 last:pb-0">
      <span className="text-foreground/60">{label}</span>
      <span className="text-white font-medium text-right">{value}</span>
    </div>
  );
}

export default IconNominationWizard;
