// Unified nomination form for the 18 canonical nomination pages
// (Africa Education Icon, Influencer Education Impact, 7 Platinum,
// 9 Gold-Blue Garnet). Renders one of four selector variants for step 1
// (pathway/subcategory), then a shared skeleton: Classification →
// Nominee/Institution info → Evidence (≥2 sources) → Nominator & Declaration.
//
// Flow: nominate first → create or confirm account at submission →
// confirmation with reference → track progress. No account is required to
// open, fill in, or submit the form; account creation is triggered only by
// the Submit click and email verification never blocks the submission.

import { useEffect, useMemo, useRef, useState } from "react";
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
import { ShieldCheck, Send, Loader2, CloudUpload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useServerDraft } from "@/features/nominate/useServerDraft";
import { submitPublicNomination, linkNominationToAccount } from "@/features/nominate/submitPublicNomination";
import NominationAccountAtSubmit, {
  NOMINATION_COPY,
} from "@/components/nominate/NominationAccountAtSubmit";
import { trackEvent } from "@/lib/analytics";

interface Props {
  content: CategoryContent;
}

export default function CategoryNominationForm({ content }: Props) {
  const classification = CLASSIFICATION_SETS[content.classification];
  const governanceCopy = GOVERNANCE_COPY[content.governance];
  const { user } = useAuth();


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
  const [reference, setReference] = useState<string | null>(null);
  const hydratedOnce = useRef(false);
  const startedRef = useRef(false);

  // ── Draft persistence (server-side, no account required) ────────────────
  const draftValues = useMemo(
    () => ({
      primary,
      secondary,
      tags,
      classificationId,
      nomineeName,
      nomineeOrg,
      nomineeCountry,
      nomineeLeadership,
      impactSummary,
      whatTheyDid,
      whoBenefited,
      timeframe,
      measurableOutcomes,
      evidence1,
      evidence2,
      evidence3,
      eligibilityConfirmed,
      nominatorName,
      nominatorEmail,
      nominatorPhone,
      nominatorCountry,
      nominatorConsent,
      declaration,
    }),
    [
      primary,
      secondary,
      tags,
      classificationId,
      nomineeName,
      nomineeOrg,
      nomineeCountry,
      nomineeLeadership,
      impactSummary,
      whatTheyDid,
      whoBenefited,
      timeframe,
      measurableOutcomes,
      evidence1,
      evidence2,
      evidence3,
      eligibilityConfirmed,
      nominatorName,
      nominatorEmail,
      nominatorPhone,
      nominatorCountry,
      nominatorConsent,
      declaration,
    ],
  );

  const { draftToken, hydratedValues, saving, savedAt, clearDraft, flush } = useServerDraft(
    `cat.${content.slug}`,
    draftValues,
    {
      formType: `nominate-2026:${content.slug}`,
      awardTier: content.tier,
      categorySlug: content.slug,
      subcategorySlug: secondary || primary || null,
      nominatorEmail: nominatorEmail || null,
    },
    { enabled: !reference },
  );

  // Restore an in-progress draft exactly once (survives refresh / sign-in).
  useEffect(() => {
    if (hydratedOnce.current || !hydratedValues) return;
    hydratedOnce.current = true;
    const v = hydratedValues as typeof draftValues;
    setPrimary(v.primary ?? "");
    setSecondary(v.secondary ?? "");
    setTags(Array.isArray(v.tags) ? v.tags : []);
    setClassificationId(v.classificationId ?? "");
    setNomineeName(v.nomineeName ?? "");
    setNomineeOrg(v.nomineeOrg ?? "");
    setNomineeCountry(v.nomineeCountry ?? "");
    setNomineeLeadership(v.nomineeLeadership ?? "");
    setImpactSummary(v.impactSummary ?? "");
    setWhatTheyDid(v.whatTheyDid ?? "");
    setWhoBenefited(v.whoBenefited ?? "");
    setTimeframe(v.timeframe ?? "");
    setMeasurableOutcomes(v.measurableOutcomes ?? "");
    setEvidence1(v.evidence1 ?? "");
    setEvidence2(v.evidence2 ?? "");
    setEvidence3(v.evidence3 ?? "");
    setEligibilityConfirmed(Boolean(v.eligibilityConfirmed));
    setNominatorName(v.nominatorName ?? "");
    setNominatorEmail(v.nominatorEmail ?? "");
    setNominatorPhone(v.nominatorPhone ?? "");
    setNominatorCountry(v.nominatorCountry ?? "");
    setNominatorConsent(Boolean(v.nominatorConsent));
    setDeclaration(Boolean(v.declaration));
    toast({
      title: "Draft restored",
      description: "We recovered the nomination details you had already entered.",
    });
  }, [hydratedValues]);

  const secondaryOptions = useMemo(() => {
    const s = content.pathwaySelector;
    if (s.kind === "dependent") return primary ? s.secondaryOptions[primary] ?? [] : [];
    if (s.kind === "dual") return s.secondaryOptions;
    return [];
  }, [content.pathwaySelector, primary]);

  const orgLabel = content.nomineeFieldOverrides?.orgNameLabel ?? "Institution / Organisation";
  const leadershipLabel = content.nomineeFieldOverrides?.leadershipLabel ?? "Leadership / Contact person";

  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("nomination_form_started", {
      form: content.slug,
      tier: content.tier,
      authenticated: Boolean(user),
    });
  }

  function toggleTag(tag: string) {
    markStarted();
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
    if (!whatTheyDid.trim() || whatTheyDid.trim().length < 40)
      return "Describe what the nominee did (min. 40 characters).";
    if (!whoBenefited.trim()) return "Describe who benefited from their work.";
    if (!timeframe.trim()) return "Specify the timeframe of the contribution.";
    if (!measurableOutcomes.trim() || measurableOutcomes.trim().length < 40)
      return "Provide measurable outcomes (min. 40 characters).";
    if (!evidence1.trim() || !evidence2.trim())
      return "Provide at least two independent evidence sources.";
    if (!eligibilityConfirmed)
      return "You must confirm the eligibility criteria before submitting.";
    if (!nominatorName.trim() || !nominatorEmail.trim())
      return "Enter your name and email.";
    if (!nominatorCountry.trim())
      return "Enter your country of residence.";
    if (!nominatorConsent)
      return "You must consent to being contacted about this nomination.";
    if (!declaration) return "You must confirm the non-influence declaration to submit.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Single-submission guard — the reference is issued exactly once.
    if (submitting || reference) return;
    const err = validate();
    if (err) {
      toast({ title: "Please complete required fields", description: err, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      trackEvent("nomination_form_completed", { form: content.slug, tier: content.tier });
      // Make sure the server draft holds the final values before submitting.
      await flush();

      const result = await submitPublicNomination({
        formType: `nominate-2026:${content.slug}`,
        awardTier: content.tier,
        categorySlug: content.slug,
        subcategory: secondary || primary || null,
        nomineeName,
        nomineeCountry,
        impactSummary,
        nominatorEmail,
        draftToken,
        payload: {
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
          whatTheyDid,
          whoBenefited,
          timeframe,
          measurableOutcomes,
          evidence: [evidence1, evidence2, evidence3].filter(Boolean),
          eligibilityConfirmed,
          nominatorName,
          nominatorEmail,
          nominatorPhone,
          nominatorCountry,
          nominatorConsent,
          declaration,
          submittedAt: new Date().toISOString(),
        },
      });

      setReference(result.reference);
      clearDraft();
      if (user) {
        // Signed-in nominators are linked immediately — no interruption.
        await linkNominationToAccount(result.reference);
      }
      toast({
        title: "Nomination received",
        description: `Your reference is ${result.reference}.`,
      });
      window.setTimeout(
        () => document.getElementById("nomination-submitted")?.scrollIntoView({ behavior: "smooth", block: "start" }),
        50,
      );
    } catch (submitError) {
      toast({
        title: "Submission failed",
        description:
          submitError instanceof Error
            ? submitError.message
            : "Please try again — your entries have been saved.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Post-submission: account creation / confirmation, then the confirmation
  // message with the reference. The nomination is already recorded.
  if (reference) {
    return (
      <div id="nomination-submitted" className="space-y-4">
        <NominationAccountAtSubmit
          reference={reference}
          defaultEmail={nominatorEmail}
          defaultFullName={nominatorName}
          formSlug={content.slug}
          alreadySignedIn={Boolean(user)}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onChange={markStarted} className="space-y-8">

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

      {/* Step 4 — Structured evidence of impact */}
      <fieldset className="space-y-4">
        <legend className="font-playfair text-xl text-gold">4. Evidence of education impact</legend>
        <Field label="Impact summary (min. 60 characters)" required>
          <Textarea
            rows={3}
            value={impactSummary}
            onChange={(e) => setImpactSummary(e.target.value)}
            placeholder="One-paragraph overview of the verified contribution."
          />
        </Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="What did they do?" required>
            <Textarea
              rows={3}
              value={whatTheyDid}
              onChange={(e) => setWhatTheyDid(e.target.value)}
              placeholder="Concrete actions, programmes, or interventions delivered."
            />
          </Field>
          <Field label="Who benefited?" required>
            <Textarea
              rows={3}
              value={whoBenefited}
              onChange={(e) => setWhoBenefited(e.target.value)}
              placeholder="Learner groups, communities, institutions reached."
            />
          </Field>
          <Field label="Timeframe" required>
            <Input
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="e.g. 2018 – present, or Jan 2022 – Dec 2024"
            />
          </Field>
          <Field label="Measurable outcomes" required>
            <Textarea
              rows={3}
              value={measurableOutcomes}
              onChange={(e) => setMeasurableOutcomes(e.target.value)}
              placeholder="Numbers, verified results, third-party reports."
            />
          </Field>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-foreground/75">
            Provide at least <span className="text-gold">two independent evidence sources</span>{" "}
            (URLs, reports, testimonials). A third is encouraged. File uploads coming shortly —
            for now, link to hosted documents.
          </p>
          <Field label="Evidence source 1 (URL)" required>
            <Input value={evidence1} onChange={(e) => setEvidence1(e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Evidence source 2 (URL)" required>
            <Input value={evidence2} onChange={(e) => setEvidence2(e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Evidence source 3 (optional)">
            <Input value={evidence3} onChange={(e) => setEvidence3(e.target.value)} placeholder="https://…" />
          </Field>
        </div>
      </fieldset>

      {/* Step 5 — Eligibility self-check */}
      <fieldset className="space-y-3">
        <legend className="font-playfair text-xl text-gold">5. Eligibility self-check</legend>
        <label className="flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-3">
          <Checkbox
            checked={eligibilityConfirmed}
            onCheckedChange={(v) => setEligibilityConfirmed(v === true)}
            className="mt-0.5"
          />
          <span className="text-xs text-foreground/85">
            I confirm the nominee meets the published eligibility criteria for{" "}
            <span className="text-gold">{content.hero.h1}</span> — including documented
            contribution period, verifiable impact, and alignment with the category's Education
            Development Index indicators shown above.
          </span>
        </label>
      </fieldset>

      {/* Step 6 — Nominator identity + consent */}
      <fieldset className="space-y-4">
        <legend className="font-playfair text-xl text-gold">6. Nominator identity</legend>
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
          <Field label="Phone (optional)">
            <Input value={nominatorPhone} onChange={(e) => setNominatorPhone(e.target.value)} />
          </Field>
          <Field label="Country of residence" required>
            <Input value={nominatorCountry} onChange={(e) => setNominatorCountry(e.target.value)} />
          </Field>
        </div>
        <label className="flex items-start gap-3 rounded-lg border border-gold/20 bg-black/30 p-3">
          <Checkbox
            checked={nominatorConsent}
            onCheckedChange={(v) => setNominatorConsent(v === true)}
            className="mt-0.5"
          />
          <span className="text-xs text-foreground/80">
            I consent to being contacted by the Nominee Research Corps for evidence verification
            and clarification questions relating to this nomination.
          </span>
        </label>
      </fieldset>

      {/* Persistent NON-INFLUENCE DISCLAIMER — always visible pre-submit */}
      <div className="rounded-lg border-2 border-gold/40 bg-gold/10 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gold">
          <ShieldCheck className="h-4 w-4" />
          Non-influence disclaimer — read before submitting
        </div>
        <p className="text-xs leading-relaxed text-foreground/85">
          Your submission does <span className="text-gold">not</span> automatically make the
          nominee a finalist, winner, or honouree. All submissions are subject to eligibility
          review, evidence review, duplicate checks, verification by the Nominee Research
          Corps, and governance/judging review. Sponsorship, donation, ticket purchase, or
          gala attendance does <span className="text-gold">not</span> influence outcomes.
        </p>
        <label className="mt-3 flex items-start gap-3">
          <Checkbox
            checked={declaration}
            onCheckedChange={(v) => setDeclaration(v === true)}
            className="mt-0.5"
          />
          <span className="text-xs text-foreground/85">
            I have read and understood the non-influence disclaimer above, and confirm the
            information I have submitted is accurate to the best of my knowledge.
          </span>
        </label>
      </div>

      {/* What happens next */}
      <div className="rounded-lg border border-gold/25 bg-black/30 p-4 text-xs text-foreground/80">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gold">
          <ShieldCheck className="h-4 w-4" /> What happens next
        </div>
        <ol className="ml-4 list-decimal space-y-1">
          <li>Submission captured &amp; nominee notified.</li>
          <li>NRC Phase One (automated screening + duplicate detection).</li>
          <li>NRC Phase Two (human evidence verification against the category EDI Matrix).</li>
          <li>Nominee acceptance &amp; correction window.</li>
          <li>Governance approval.</li>
          <li>
            <span className="text-gold">
              Certificate of Recognition released after nominee acceptance and Governance approval.
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
