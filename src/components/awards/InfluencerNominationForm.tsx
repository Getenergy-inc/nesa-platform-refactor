import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Send, ShieldCheck, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

interface InfluencerNominationFormProps {
  directoryRoute?: string;
  onSubmitted?: (nominationId: string) => void;
}

// ---------------------------------------------------------------------------
// Simplified single-page Influencer Education Impact Award 2026 intake form.
// Mirrors the low-friction Africa Education Icon nomination surface: ~15 fields,
// under 3 minutes to complete. NRC enrichment (evidence, impact areas, scale,
// verification, media, judging, certificates) happens post-submission.
// ---------------------------------------------------------------------------

const MEDIUM_OPTIONS = [
  {
    value: "social-media",
    label: "Social Media Education Champion",
    categorySlug: "africa-social-media-influencer-education",
    subcategorySlug: "africa-social-media-educational-content",
  },
  {
    value: "sports-icons",
    label: "Sports Icon Supporting Education",
    categorySlug: "africa-sports-influencer-education",
    subcategorySlug: "africa-sportsman-education-advocate",
  },
  {
    value: "music-icons",
    label: "Music Icon Supporting Education",
    categorySlug: "africa-music-influencer-education",
    subcategorySlug: "africa-music-artist-education-advocate",
  },
] as const;

const AFRICAN_REGIONS = [
  "North Africa",
  "West Africa",
  "Central Africa",
  "East Africa",
  "Horn of Africa",
  "Southern Africa",
  "Sahel Region",
  "Indian Ocean Islands",
];

const RECOGNITION_REGIONS = [...AFRICAN_REGIONS, "African Diaspora"];

const AFRICAN_COUNTRIES = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde",
  "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo (Brazzaville)",
  "Congo (Kinshasa)", "Côte d'Ivoire", "Djibouti", "Egypt", "Equatorial Guinea",
  "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea",
  "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi",
  "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger",
  "Nigeria", "Rwanda", "São Tomé and Príncipe", "Senegal", "Seychelles",
  "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania",
  "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe",
];

const DIASPORA_REGIONS = [
  "North America",
  "South America",
  "Europe",
  "Caribbean",
  "Middle East",
  "Asia",
  "Oceania",
];

interface FormState {
  // Nominee
  nominee_name: string;
  medium: string;
  african_country: string;
  recognition_region: string;
  country_of_residence: string;
  diaspora_region: string;
  organisation: string;
  social_profile: string;
  why_deserve: string;
  evidence_link: string;
  // Nominator
  nm_full_name: string;
  nm_email: string;
  nm_phone: string;
  nm_country: string;
  nm_consent: boolean;
}

const INITIAL: FormState = {
  nominee_name: "",
  medium: "",
  african_country: "",
  recognition_region: "",
  country_of_residence: "",
  diaspora_region: "",
  organisation: "",
  social_profile: "",
  why_deserve: "",
  evidence_link: "",
  nm_full_name: "",
  nm_email: "",
  nm_phone: "",
  nm_country: "",
  nm_consent: false,
};

export function InfluencerNominationForm() {
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nominationId, setNominationId] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setState((p) => ({ ...p, [k]: v }));

  const isDiaspora = state.recognition_region === "African Diaspora";
  const mediumConfig = useMemo(
    () => MEDIUM_OPTIONS.find((m) => m.value === state.medium) ?? null,
    [state.medium],
  );

  const validate = (): string | null => {
    if (state.nominee_name.trim().length < 2) return "Nominee full name is required.";
    if (!state.medium) return "Please select the Primary Medium of Influence.";
    if (!state.recognition_region) return "Please select the Recognition Region.";
    if (isDiaspora) {
      if (!state.country_of_residence) return "Country of Residence is required.";
      if (!state.diaspora_region) return "Please select the Diaspora Region.";
    } else if (!state.african_country) {
      return "Please select the nominee's African country.";
    }
    if (state.why_deserve.trim().length < 30)
      return "Please write at least 30 characters explaining the education impact.";
    if (state.nm_full_name.trim().length < 2) return "Your full name is required.";
    if (!state.nm_email.includes("@")) return "A valid email address is required.";
    if (!state.nm_country.trim()) return "Please enter your country.";
    if (!state.nm_consent) return "Please confirm the declaration to submit.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const err = validate();
    if (err) return toast.error(err);
    if (!mediumConfig) return toast.error("Please select the Primary Medium of Influence.");

    setSubmitting(true);
    try {
      const nomineeCountry = isDiaspora
        ? state.country_of_residence
        : state.african_country;

      const { data, error } = await supabase.functions.invoke("nominations-submit", {
        body: {
          nominator: {
            full_name: state.nm_full_name,
            email: state.nm_email,
            phone: state.nm_phone,
            country_residence: state.nm_country,
            consent: state.nm_consent,
          },
          nomination: {
            award_family: "influencer-education-impact-2026",
            award_category_slug: mediumConfig.categorySlug,
            award_subcategory_slug: mediumConfig.subcategorySlug,
            recognition_class: mediumConfig.label,
            region_slug: state.recognition_region,
            nominee_name: state.nominee_name,
            nominee_type: "individual",
            nominee_country: nomineeCountry,
            organization: state.organisation,
            website: state.social_profile,
            social_links: state.social_profile ? [state.social_profile] : [],
            evidence_links: state.evidence_link ? [state.evidence_link] : [],
            impact_summary: state.why_deserve,
            reason: state.why_deserve,
          },
        },
      });
      if (error) throw error;

      const payload = data as { ok?: boolean; nomination_id?: string; error?: string } | null;
      if (!payload?.ok || !payload.nomination_id) {
        throw new Error(payload?.error || "Submission was not accepted.");
      }

      // Format server UUID into a readable, prefixed Nomination ID.
      const shortId = payload.nomination_id.replace(/-/g, "").slice(0, 8).toUpperCase();
      setNominationId(`INF-2026-${shortId}`);
      toast.success("Nomination submitted — thank you!");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Influencer nomination submit failed", err);
      const message = err instanceof Error ? err.message : "Could not submit nomination. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-charcoal-light/50 p-8 text-center text-foreground/90">
        <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-gold" />
        <h3 className="font-playfair text-2xl md:text-3xl text-gold mb-2">
          Nomination received
        </h3>
        {nominationId && (
          <p className="text-xs uppercase tracking-[0.18em] text-gold/70 mb-3">
            Nomination ID · {nominationId}
          </p>
        )}
        <p className="text-sm text-foreground/75 max-w-md mx-auto">
          Your submission for the{" "}
          <span className="text-gold">Influencer Education Impact Award 2026</span> has been
          queued for independent NRC verification. A confirmation email will follow shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-5 md:p-6 space-y-8"
    >
      {/* Trust notice */}
      <div className="flex items-start gap-2 text-xs text-foreground/80 rounded-lg border border-gold/20 bg-charcoal/40 p-3">
        <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <span>
          Recognition is based on{" "}
          <span className="text-gold">verified education impact</span> — not popularity,
          celebrity status or follower count. Every nomination is independently reviewed by
          the Nominee Research Corps (NRC).
        </span>
      </div>

      {/* SECTION 1 — Nominee Information */}
      <section className="space-y-4">
        <div>
          <h3 className="font-playfair text-xl text-gold">1. Nominee Information</h3>
          <p className="text-xs text-foreground/60 mt-1">
            Share only what you know — the NRC will research and enrich the profile.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full Name" required>
            <Input
              value={state.nominee_name}
              onChange={(e) => set("nominee_name", e.target.value)}
              placeholder="Nominee's full name"
              required
            />
          </Field>

          <Field label="Primary Medium of Influence" required>
            <Select
              value={state.medium}
              onValueChange={(v) => set("medium", v)}
            >
              <SelectTrigger><SelectValue placeholder="Select medium" /></SelectTrigger>
              <SelectContent>
                {MEDIUM_OPTIONS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Recognition Region" required>
            <Select
              value={state.recognition_region}
              onValueChange={(v) => {
                set("recognition_region", v);
                if (v === "African Diaspora") set("african_country", "");
                else {
                  set("country_of_residence", "");
                  set("diaspora_region", "");
                }
              }}
            >
              <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
              <SelectContent>
                {RECOGNITION_REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {!isDiaspora ? (
            <Field label="African Country" required>
              <Select
                value={state.african_country}
                onValueChange={(v) => set("african_country", v)}
              >
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {AFRICAN_COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          ) : (
            <>
              <Field label="Country of Residence" required>
                <Input
                  value={state.country_of_residence}
                  onChange={(e) => set("country_of_residence", e.target.value)}
                  placeholder="e.g. United Kingdom"
                  required
                />
              </Field>
              <Field label="Diaspora Region" required>
                <Select
                  value={state.diaspora_region}
                  onValueChange={(v) => set("diaspora_region", v)}
                >
                  <SelectTrigger><SelectValue placeholder="Select diaspora region" /></SelectTrigger>
                  <SelectContent>
                    {DIASPORA_REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </>
          )}

          <Field label="Organisation / Team" hint="Optional">
            <Input
              value={state.organisation}
              onChange={(e) => set("organisation", e.target.value)}
              placeholder="Foundation, club, label or affiliation"
            />
          </Field>

          <Field label="Social Media Profile" hint="Optional">
            <Input
              value={state.social_profile}
              onChange={(e) => set("social_profile", e.target.value)}
              placeholder="Instagram, TikTok, YouTube, X, LinkedIn or website"
            />
          </Field>
        </div>

        <Field label="Why are you nominating this person?" required>
          <Textarea
            value={state.why_deserve}
            onChange={(e) => set("why_deserve", e.target.value)}
            placeholder="Describe how this individual is helping to advance Education for All — e.g. scholarships, school support, mentorship, learning content, youth empowerment, educational advocacy."
            rows={6}
            maxLength={3500}
            required
          />
          <p className="text-[11px] text-foreground/50 mt-1">
            Up to ~500 words. Focus on measurable educational impact.
          </p>
        </Field>

        <Field label="Evidence Link" hint="Optional">
          <Input
            value={state.evidence_link}
            onChange={(e) => set("evidence_link", e.target.value)}
            placeholder="Website, news article, interview or social media post"
          />
        </Field>
      </section>

      {/* SECTION 2 — Your Details */}
      <section className="space-y-4 border-t border-gold/15 pt-6">
        <div>
          <h3 className="font-playfair text-xl text-gold">2. Your Details</h3>
          <p className="text-xs text-foreground/60 mt-1">
            We use your contact details only to acknowledge and verify your nomination.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full Name" required>
            <Input
              value={state.nm_full_name}
              onChange={(e) => set("nm_full_name", e.target.value)}
              required
            />
          </Field>
          <Field label="Email" required>
            <Input
              type="email"
              value={state.nm_email}
              onChange={(e) => set("nm_email", e.target.value)}
              required
            />
          </Field>
          <Field label="Phone Number" hint="Optional">
            <Input
              value={state.nm_phone}
              onChange={(e) => set("nm_phone", e.target.value)}
              placeholder="+234…"
            />
          </Field>
          <Field label="Country" required>
            <Input
              value={state.nm_country}
              onChange={(e) => set("nm_country", e.target.value)}
              required
            />
          </Field>
        </div>

        <label className="flex items-start gap-3 text-sm text-foreground/80 cursor-pointer">
          <Checkbox
            checked={state.nm_consent}
            onCheckedChange={(v) => set("nm_consent", Boolean(v))}
            className="mt-0.5"
          />
          <span>
            I confirm that the information provided is accurate and submitted in good faith,
            and I understand that recognition is subject to independent NRC verification.
          </span>
        </label>
      </section>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={submitting}
          className="w-full md:w-auto bg-gold text-charcoal hover:bg-gold/90 font-semibold"
        >
          {submitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</>
          ) : (
            <><Send className="mr-2 h-4 w-4" /> Submit Nomination</>
          )}
        </Button>
      </div>

      {/* What happens next */}
      <div className="rounded-xl border border-gold/20 bg-charcoal/40 p-4 text-sm text-foreground/80">
        <p className="font-semibold text-gold mb-2">What happens next</p>
        <ol className="space-y-1.5 text-xs leading-relaxed">
          <li>✅ Nomination received</li>
          <li>✅ NRC verifies education impact</li>
          <li>✅ Duplicate check</li>
          <li>✅ Nominee contacted (where possible)</li>
          <li>✅ Profile created</li>
          <li>✅ Recognition review</li>
        </ol>
      </div>
    </form>
  );
}

// ---------------- Field wrapper ----------------
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-[0.14em] text-foreground/70 flex items-center gap-2">
        <span>
          {label} {required && <span className="text-gold">*</span>}
        </span>
        {hint && <span className="text-[10px] text-foreground/40 normal-case tracking-normal">({hint})</span>}
      </Label>
      {children}
    </div>
  );
}

export default InfluencerNominationForm;
