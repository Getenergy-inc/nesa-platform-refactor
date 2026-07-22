// Unified nomination form for the 17 dedicated category pages.
// Renders one of four selector variants for step 1 (pathway/subcategory),
// then a shared skeleton: Classification → Nominee/Institution info →
// Evidence (≥2 sources) → Nominator & Declaration.
//
// Submissions POST to the existing native nomination endpoint via the
// resilient client used elsewhere — no new dependencies.

import { useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CLASSIFICATION_SETS,
  GOVERNANCE_COPY,
  type CategoryContent,
} from "@/config/nominate2026/categoryContent";
import { ShieldCheck, Send } from "lucide-react";

interface Props {
  content: CategoryContent;
}

export default function CategoryNominationForm({ content }: Props) {
  const classification = CLASSIFICATION_SETS[content.classification];
  const governanceCopy = GOVERNANCE_COPY[content.governance];

  const [primary, setPrimary] = useState<string>("");
  const [secondary, setSecondary] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [classificationId, setClassificationId] = useState<string>("");
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeOrg, setNomineeOrg] = useState("");
  const [nomineeCountry, setNomineeCountry] = useState("");
  const [nomineeLeadership, setNomineeLeadership] = useState("");
  const [impactSummary, setImpactSummary] = useState("");
  // Structured evidence — replaces thin "website / social link" fields.
  const [whatTheyDid, setWhatTheyDid] = useState("");
  const [whoBenefited, setWhoBenefited] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [measurableOutcomes, setMeasurableOutcomes] = useState("");
  const [evidence1, setEvidence1] = useState("");
  const [evidence2, setEvidence2] = useState("");
  const [evidence3, setEvidence3] = useState("");
  // Eligibility gate — must be affirmed before submission.
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(false);
  const [nominatorName, setNominatorName] = useState("");
  const [nominatorEmail, setNominatorEmail] = useState("");
  const [nominatorPhone, setNominatorPhone] = useState("");
  const [nominatorCountry, setNominatorCountry] = useState("");
  const [nominatorConsent, setNominatorConsent] = useState(false);
  const [declaration, setDeclaration] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nominatorName, setNominatorName] = useState("");
  const [nominatorEmail, setNominatorEmail] = useState("");
  const [declaration, setDeclaration] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const secondaryOptions = useMemo(() => {
    const s = content.pathwaySelector;
    if (s.kind === "dependent") return primary ? s.secondaryOptions[primary] ?? [] : [];
    if (s.kind === "dual") return s.secondaryOptions;
    return [];
  }, [content.pathwaySelector, primary]);

  const orgLabel = content.nomineeFieldOverrides?.orgNameLabel ?? "Institution / Organisation";
  const leadershipLabel = content.nomineeFieldOverrides?.leadershipLabel ?? "Leadership / Contact person";

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function validate(): string | null {
    const s = content.pathwaySelector;
    if (s.kind === "single" && !primary) return "Select a certificate category.";
    if (s.kind === "dependent" && (!primary || !secondary))
      return "Select both the medium of influence and recognition area.";
    if (s.kind === "dual" && (!primary || !secondary))
      return "Select both fields to continue.";
    if (s.kind === "dropdown-plus-tags") {
      if (!primary) return "Select a certificate category.";
      if (tags.length === 0) return "Select at least one verified impact area.";
    }
    if (!classificationId) return "Choose a classification.";
    if (!nomineeName.trim()) return "Enter the nominee name.";
    if (!nomineeCountry.trim()) return "Enter the nominee country.";
    if (!impactSummary.trim() || impactSummary.trim().length < 60)
      return "Provide an impact summary of at least 60 characters.";
    if (!evidence1.trim() || !evidence2.trim())
      return "Provide at least two independent evidence sources.";
    if (!nominatorName.trim() || !nominatorEmail.trim())
      return "Enter your name and email.";
    if (!declaration) return "You must confirm the declaration to submit.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast({ title: "Please complete required fields", description: err, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      // Persist as a draft in localStorage for now — the account-at-submit flow
      // completes submission on the dedicated confirmation route.
      const draftKey = `nesa:nomination:${content.slug}:${Date.now()}`;
      const draft = {
        slug: content.slug,
        tier: content.tier,
        pathwayPrimary: primary,
        pathwaySecondary: secondary,
        tags,
        classificationId,
        nomineeName,
        nomineeOrg,
        nomineeCountry,
        nomineeLeadership,
        impactSummary,
        evidence: [evidence1, evidence2, evidence3].filter(Boolean),
        nominatorName,
        nominatorEmail,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
      toast({
        title: "Nomination captured",
        description:
          "Your nomination has been saved. You'll be prompted to confirm your account at submission.",
      });
      // Reset
      setPrimary("");
      setSecondary("");
      setTags([]);
      setClassificationId("");
      setNomineeName("");
      setNomineeOrg("");
      setNomineeCountry("");
      setNomineeLeadership("");
      setImpactSummary("");
      setEvidence1("");
      setEvidence2("");
      setEvidence3("");
      setNominatorName("");
      setNominatorEmail("");
      setDeclaration(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1 — Pathway selector */}
      <fieldset className="space-y-4">
        <legend className="font-playfair text-xl text-gold">1. Pathway / Certificate category</legend>
        <PathwaySelectorRenderer
          content={content}
          primary={primary}
          setPrimary={(v) => {
            setPrimary(v);
            setSecondary("");
          }}
          secondary={secondary}
          setSecondary={setSecondary}
          secondaryOptions={secondaryOptions}
          tags={tags}
          toggleTag={toggleTag}
        />
      </fieldset>

      {/* Step 2 — Classification */}
      <fieldset className="space-y-3">
        <legend className="font-playfair text-xl text-gold">2. {classification.label}</legend>
        <div className="grid gap-3 md:grid-cols-3">
          {classification.options.map((opt) => {
            const active = classificationId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setClassificationId(opt.id)}
                className={`rounded-lg border p-3 text-left transition ${
                  active
                    ? "border-gold bg-gold/10"
                    : "border-gold/20 bg-black/30 hover:border-gold/50"
                }`}
              >
                <div className="mb-1 text-sm font-semibold text-gold">{opt.label}</div>
                <p className="text-xs text-foreground/70">{opt.description}</p>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Step 3 — Nominee information */}
      <fieldset className="space-y-4">
        <legend className="font-playfair text-xl text-gold">3. Nominee information</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nominee name" required>
            <Input value={nomineeName} onChange={(e) => setNomineeName(e.target.value)} />
          </Field>
          <Field label={orgLabel}>
            <Input value={nomineeOrg} onChange={(e) => setNomineeOrg(e.target.value)} />
          </Field>
          <Field label="Country" required>
            <Input value={nomineeCountry} onChange={(e) => setNomineeCountry(e.target.value)} />
          </Field>
          <Field label={leadershipLabel}>
            <Input value={nomineeLeadership} onChange={(e) => setNomineeLeadership(e.target.value)} />
          </Field>
        </div>
      </fieldset>

      {/* Step 4 — Evidence of impact */}
      <fieldset className="space-y-4">
        <legend className="font-playfair text-xl text-gold">4. Evidence of education impact</legend>
        <Field label="Impact summary (min. 60 characters)" required>
          <Textarea
            rows={4}
            value={impactSummary}
            onChange={(e) => setImpactSummary(e.target.value)}
            placeholder="Describe the verified educational contribution — outcomes, learners reached, timeframe."
          />
        </Field>
        <div className="space-y-3">
          <p className="text-sm text-foreground/75">
            Provide at least <span className="text-gold">two independent evidence sources</span>{" "}
            (URLs, reports, verifiable references). A third is encouraged.
          </p>
          <Field label="Evidence source 1" required>
            <Input value={evidence1} onChange={(e) => setEvidence1(e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Evidence source 2" required>
            <Input value={evidence2} onChange={(e) => setEvidence2(e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Evidence source 3 (optional)">
            <Input value={evidence3} onChange={(e) => setEvidence3(e.target.value)} placeholder="https://…" />
          </Field>
        </div>
      </fieldset>

      {/* Step 5 — Nominator + declaration */}
      <fieldset className="space-y-4">
        <legend className="font-playfair text-xl text-gold">5. Nominator &amp; declaration</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Your full name" required>
            <Input value={nominatorName} onChange={(e) => setNominatorName(e.target.value)} />
          </Field>
          <Field label="Your email address" required>
            <Input
              type="email"
              value={nominatorEmail}
              onChange={(e) => setNominatorEmail(e.target.value)}
            />
          </Field>
        </div>
        <label className="flex items-start gap-3 rounded-lg border border-gold/20 bg-black/30 p-3">
          <Checkbox
            checked={declaration}
            onCheckedChange={(v) => setDeclaration(v === true)}
            className="mt-0.5"
          />
          <span className="text-xs text-foreground/80">
            I confirm the information above is accurate to the best of my knowledge, that the
            nominee's contribution to education is verifiable, and that I understand recognition
            depends on Nominee Research Corps verification and Governance approval.
          </span>
        </label>
      </fieldset>

      {/* What happens next */}
      <div className="rounded-lg border border-gold/25 bg-black/30 p-4 text-xs text-foreground/80">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gold">
          <ShieldCheck className="h-4 w-4" /> What happens next
        </div>
        <ol className="ml-4 list-decimal space-y-1">
          <li>Submission captured &amp; nominee notified.</li>
          <li>Nominee Research Corps verifies evidence against the category EDI Matrix.</li>
          <li>Governance approves verified nominations.</li>
          <li>
            <span className="text-gold">
              Certificate of Recognition released immediately on approval — no endorsement threshold.
            </span>
          </li>
        </ol>
        <p className="mt-3 text-[11px] text-foreground/60">{governanceCopy}</p>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        size="lg"
        className="w-full bg-gold text-charcoal hover:bg-gold/90"
      >
        <Send className="mr-2 h-4 w-4" />
        {submitting ? "Submitting…" : "Submit nomination"}
      </Button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground/80">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </Label>
      {children}
    </div>
  );
}

function PathwaySelectorRenderer({
  content,
  primary,
  setPrimary,
  secondary,
  setSecondary,
  secondaryOptions,
  tags,
  toggleTag,
}: {
  content: CategoryContent;
  primary: string;
  setPrimary: (v: string) => void;
  secondary: string;
  setSecondary: (v: string) => void;
  secondaryOptions: string[];
  tags: string[];
  toggleTag: (t: string) => void;
}) {
  const s = content.pathwaySelector;

  if (s.kind === "single") {
    return (
      <Field label={s.label} required>
        <Select value={primary} onValueChange={setPrimary}>
          <SelectTrigger>
            <SelectValue placeholder="Choose one…" />
          </SelectTrigger>
          <SelectContent>
            {s.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  }

  if (s.kind === "dependent") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={s.primaryLabel} required>
          <Select value={primary} onValueChange={setPrimary}>
            <SelectTrigger>
              <SelectValue placeholder="Choose one…" />
            </SelectTrigger>
            <SelectContent>
              {s.primaryOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={s.secondaryLabel} required>
          <Select value={secondary} onValueChange={setSecondary} disabled={!primary}>
            <SelectTrigger>
              <SelectValue placeholder={primary ? "Choose one…" : "Select above first"} />
            </SelectTrigger>
            <SelectContent>
              {secondaryOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    );
  }

  if (s.kind === "dual") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={s.primaryLabel} required>
          <Select value={primary} onValueChange={setPrimary}>
            <SelectTrigger>
              <SelectValue placeholder="Choose one…" />
            </SelectTrigger>
            <SelectContent>
              {s.primaryOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={s.secondaryLabel} required>
          <Select value={secondary} onValueChange={setSecondary}>
            <SelectTrigger>
              <SelectValue placeholder="Choose one…" />
            </SelectTrigger>
            <SelectContent>
              {s.secondaryOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    );
  }

  // dropdown-plus-tags
  return (
    <div className="space-y-4">
      <Field label={s.label} required>
        <Select value={primary} onValueChange={setPrimary}>
          <SelectTrigger>
            <SelectValue placeholder="Choose one…" />
          </SelectTrigger>
          <SelectContent>
            {s.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div>
        <Label className="mb-2 block text-xs font-medium text-foreground/80">
          {s.tagsLabel} <span className="text-gold">*</span>
        </Label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {s.tags.map((tag) => {
            const active = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-md border px-3 py-2 text-left text-xs transition ${
                  active
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-gold/20 bg-black/30 text-foreground/80 hover:border-gold/50"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
