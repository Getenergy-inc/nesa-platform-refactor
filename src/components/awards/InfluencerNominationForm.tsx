import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Music,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ---------------------------------------------------------------------------
// Area of Influence — 3 award categories (Step 1)
// ---------------------------------------------------------------------------
type AreaValue = "social-media" | "sports-icons" | "music-icons";

const AREAS: Array<{
  value: AreaValue;
  label: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    value: "social-media",
    label: "Social Media Education Champion",
    emoji: "📱",
    icon: Sparkles,
    description:
      "Recognises digital creators using social media to advance Education for All through educational content, advocacy, scholarships, mentorship and awareness campaigns.",
  },
  {
    value: "sports-icons",
    label: "Sports Icon Supporting Education",
    emoji: "⚽",
    icon: Trophy,
    description:
      "Recognises sports personalities using their influence, foundations or resources to support Education for All through scholarships, school projects, mentoring and youth development.",
  },
  {
    value: "music-icons",
    label: "Music Icon Supporting Education",
    emoji: "🎵",
    icon: Music,
    description:
      "Recognises musicians and music industry personalities using their influence to promote Education for All through advocacy, fundraising, scholarships and educational programmes.",
  },
];

// Step 2 — Type of Influence (dynamic per area)
const TYPE_OPTIONS: Record<AreaValue, { label: string; options: string[] }> = {
  "social-media": {
    label: "Type of Social Media Influence",
    options: [
      "Educational Content Creator",
      "Social Media Creator",
      "YouTuber",
      "Blogger",
      "Podcaster",
      "Digital Learning Creator",
      "Educational Newsletter Publisher",
      "Online Community Builder",
      "Other",
    ],
  },
  "sports-icons": {
    label: "Sport",
    options: [
      "Football",
      "Basketball",
      "Athletics",
      "Rugby",
      "Cricket",
      "Tennis",
      "Motorsport",
      "Paralympic Sport",
      "Other",
    ],
  },
  "music-icons": {
    label: "Music Category",
    options: [
      "Music Artist",
      "Gospel Artist",
      "Music Producer",
      "Choir",
      "Orchestra",
      "Music Foundation",
      "Other",
    ],
  },
};

const IMPACT_AREAS: string[] = [
  "Scholarships",
  "School Construction",
  "Classroom Renovation",
  "Teacher Development",
  "Books & Libraries",
  "STEM",
  "TVET",
  "Reading Culture",
  "Digital Literacy",
  "Coding",
  "Educational Technology",
  "Mentorship",
  "Youth Development",
  "Girls' Education",
  "Disability Inclusion",
  "Educational Campaigns",
  "Community Learning",
  "Policy Advocacy",
  "Research",
  "Higher Education",
  "Early Childhood Education",
  "Adult Education",
  "Other",
];

const IMPACT_SCALE: string[] = [
  "Community",
  "City",
  "State",
  "National",
  "Regional",
  "Continental",
  "Global",
];

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

const RECOGNITION_REGIONS = ["Africa", ...AFRICAN_REGIONS, "Global", "African Diaspora"];

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

const DIASPORA_CONTINENTAL_REGIONS = [
  "North America",
  "South America",
  "Europe",
  "Caribbean",
  "Middle East",
  "Asia",
  "Oceania",
];

interface FormState {
  // Step 1
  area: AreaValue | "";
  // Step 2
  influence_type: string;
  // Step 3 — Nominee info
  nominee_name: string;
  nominee_country: string;
  organisation: string;
  website: string;
  social_profile: string;
  // Step 4 — Recognition region
  recognition_region: string;
  african_country: string;
  country_of_residence: string;
  diaspora_region: string;
  // Step 5
  impact_areas: string[];
  // Step 6
  impact_scale: string;
  // Step 7 — Evidence
  ev_official_website: string;
  ev_foundation_website: string;
  ev_social_pages: string;
  ev_news_articles: string;
  ev_interviews: string;
  ev_videos: string;
  ev_scholarship_projects: string;
  ev_school_projects: string;
  ev_media_reports: string;
  ev_other_documents: string;
  // Step 8
  why_deserve: string;
  // Step 9 — Nominator
  nm_full_name: string;
  nm_email: string;
  nm_phone: string;
  nm_country: string;
  nm_consent: boolean;
}

const INITIAL: FormState = {
  area: "",
  influence_type: "",
  nominee_name: "",
  nominee_country: "",
  organisation: "",
  website: "",
  social_profile: "",
  recognition_region: "",
  african_country: "",
  country_of_residence: "",
  diaspora_region: "",
  impact_areas: [],
  impact_scale: "",
  ev_official_website: "",
  ev_foundation_website: "",
  ev_social_pages: "",
  ev_news_articles: "",
  ev_interviews: "",
  ev_videos: "",
  ev_scholarship_projects: "",
  ev_school_projects: "",
  ev_media_reports: "",
  ev_other_documents: "",
  why_deserve: "",
  nm_full_name: "",
  nm_email: "",
  nm_phone: "",
  nm_country: "",
  nm_consent: false,
};

const splitLinks = (v: string) =>
  v ? v.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean) : [];

const TOTAL_STEPS = 9;

const STEP_TITLES: Record<number, string> = {
  1: "Area of Influence",
  2: "Type of Influence",
  3: "Nominee Information",
  4: "Recognition Region",
  5: "Education Impact",
  6: "Scale of Impact",
  7: "Evidence",
  8: "Why This Nominee",
  9: "Nominator Details",
};

export function InfluencerNominationForm() {
  const [state, setState] = useState<FormState>(INITIAL);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nominationId, setNominationId] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setState((p) => ({ ...p, [k]: v }));

  const toggleArea = (a: string) => {
    setState((p) => ({
      ...p,
      impact_areas: p.impact_areas.includes(a)
        ? p.impact_areas.filter((x) => x !== a)
        : [...p.impact_areas, a],
    }));
  };

  const activeArea = useMemo(
    () => AREAS.find((a) => a.value === state.area),
    [state.area],
  );
  const isDiaspora = state.recognition_region === "African Diaspora";
  const isAfricanRegion =
    state.recognition_region === "Africa" ||
    AFRICAN_REGIONS.includes(state.recognition_region);

  // ---------------- Step validation ----------------
  const canAdvance = (s: number): string | null => {
    switch (s) {
      case 1:
        return state.area ? null : "Choose an Area of Influence to continue.";
      case 2:
        return state.influence_type ? null : "Select the Type of Influence.";
      case 3:
        if (state.nominee_name.trim().length < 2) return "Nominee full name is required.";
        return null;
      case 4:
        if (!state.recognition_region) return "Select a Recognition Region.";
        if (isDiaspora && (!state.country_of_residence || !state.diaspora_region))
          return "Country of Residence and Diaspora Region are required.";
        if (isAfricanRegion && !state.african_country)
          return "Select the African Country.";
        return null;
      case 5:
        return state.impact_areas.length ? null : "Select at least one Education Impact area.";
      case 6:
        return state.impact_scale ? null : "Select the Scale of Impact.";
      case 7:
        return null; // optional evidence
      case 8:
        return state.why_deserve.trim().length >= 30
          ? null
          : "Please write at least 30 characters explaining the impact.";
      case 9:
        if (state.nm_full_name.trim().length < 2) return "Your full name is required.";
        if (!state.nm_email.includes("@")) return "A valid email is required.";
        if (!state.nm_consent) return "Please certify the nomination to continue.";
        return null;
      default:
        return null;
    }
  };

  const next = () => {
    const err = canAdvance(step);
    if (err) return toast.error(err);
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    for (let s = 1; s <= TOTAL_STEPS; s++) {
      const err = canAdvance(s);
      if (err) {
        setStep(s);
        return toast.error(err);
      }
    }

    setSubmitting(true);
    try {
      const localId = `INF-${Date.now().toString(36).toUpperCase()}`;
      const nomineeCountry = isDiaspora
        ? state.country_of_residence
        : isAfricanRegion
          ? state.african_country
          : state.nominee_country;

      const { error } = await supabase.functions.invoke("nominations-submit", {
        body: {
          nominator: {
            full_name: state.nm_full_name,
            email: state.nm_email,
            phone: state.nm_phone,
            country_residence: state.nm_country,
            consent: state.nm_consent,
          },
          nomination: {
            award_family: "influencer",
            award_category_slug: `influencer-${state.area}`,
            award_subcategory_slug: state.area,
            recognition_class: activeArea?.label ?? null,
            region_slug: state.recognition_region,
            nominee_name: state.nominee_name,
            nominee_type: "individual",
            nominee_country: nomineeCountry,
            organization: state.organisation,
            website: state.website || state.ev_official_website,
            social_links: splitLinks(
              [state.social_profile, state.ev_social_pages].filter(Boolean).join(" "),
            ),
            impact_summary: state.why_deserve,
            reason: state.why_deserve,
            source: "influencer-native-form",
            source_form_slug: "influencer-education-impact-2026",
            metadata: {
              local_id: localId,
              recognition_pathway: state.area,
              medium_of_influence: activeArea?.label,
              influence_type: state.influence_type,
              education_impact_areas: state.impact_areas,
              impact_scale: state.impact_scale,
              recognition_region: state.recognition_region,
              country: state.african_country || state.nominee_country,
              country_of_residence: state.country_of_residence,
              diaspora_continent: state.diaspora_region,
              evidence: {
                official_website: state.ev_official_website,
                foundation_website: state.ev_foundation_website,
                social_pages: splitLinks(state.ev_social_pages),
                news_articles: splitLinks(state.ev_news_articles),
                interviews: splitLinks(state.ev_interviews),
                videos: splitLinks(state.ev_videos),
                scholarship_projects: state.ev_scholarship_projects,
                school_projects: state.ev_school_projects,
                media_reports: splitLinks(state.ev_media_reports),
                other_documents: splitLinks(state.ev_other_documents),
              },
              nomination_status: "PENDING_NRC_REVIEW",
              nrc_review_status: "queued",
              verification_status: "pending",
              website_publish_status: "pending",
              certificate_status: "pending",
              media_status: "pending",
              hall_of_fame_status: "pending",
            },
          },
        },
      });
      if (error) throw error;

      setNominationId(localId);
      toast.success("Nomination submitted — thank you!");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Influencer nomination submit failed", err);
      toast.error("Could not submit nomination. Please try again.");
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

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-5 md:p-6 space-y-6"
    >
      {/* Trust notice */}
      <div className="flex items-start gap-2 text-xs text-foreground/75 rounded-lg border border-gold/20 bg-charcoal/40 p-3">
        <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <span>
          Official native nomination form for the NESA-Africa{" "}
          <span className="text-gold">Influencer Education Impact Award 2026</span>. Every
          submission is independently reviewed by the Nominee Research Corps (NRC). Follower
          count or celebrity status does not influence judging.
        </span>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-foreground/70">
          <span className="uppercase tracking-[0.18em] text-gold/80 font-semibold">
            Step {step} of {TOTAL_STEPS}
          </span>
          <span className="text-gold">{STEP_TITLES[step]}</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* ---------------- STEP 1 ---------------- */}
      {step === 1 && (
        <StepShell
          title="Which area of influence best describes the nominee?"
          hint="Choose one. The rest of the form adapts to your selection."
        >
          <div className="grid gap-3 md:grid-cols-3">
            {AREAS.map((a) => {
              const selected = state.area === a.value;
              const Icon = a.icon;
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => {
                    set("area", a.value);
                    set("influence_type", "");
                  }}
                  className={`text-left rounded-xl border p-4 transition-all ${
                    selected
                      ? "border-gold bg-gold/10 shadow-[0_0_0_1px_rgba(212,175,55,0.4)]"
                      : "border-white/10 bg-charcoal/40 hover:border-gold/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{a.emoji}</span>
                    <Icon className="h-4 w-4 text-gold" />
                  </div>
                  <p className="font-playfair text-base text-white leading-tight mb-1.5">
                    {a.label}
                  </p>
                  <p className="text-xs text-foreground/70 leading-relaxed">
                    {a.description}
                  </p>
                  <span
                    className={`mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] font-semibold ${
                      selected ? "text-gold" : "text-foreground/50"
                    }`}
                  >
                    {selected ? (
                      <>
                        <Check className="h-3 w-3" /> Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </StepShell>
      )}

      {/* ---------------- STEP 2 ---------------- */}
      {step === 2 && activeArea && (
        <StepShell title={TYPE_OPTIONS[activeArea.value].label} hint="Pick the closest match.">
          <div className="space-y-1.5 max-w-md">
            <Label htmlFor="influence_type">
              {TYPE_OPTIONS[activeArea.value].label} *
            </Label>
            <Select
              value={state.influence_type}
              onValueChange={(v) => set("influence_type", v)}
            >
              <SelectTrigger id="influence_type">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS[activeArea.value].options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </StepShell>
      )}

      {/* ---------------- STEP 3 ---------------- */}
      {step === 3 && (
        <StepShell title="Nominee Information">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name *" id="nominee_name">
              <Input
                id="nominee_name"
                value={state.nominee_name}
                onChange={(e) => set("nominee_name", e.target.value)}
                required
              />
            </Field>
            <Field label="Country" id="nominee_country">
              <Input
                id="nominee_country"
                value={state.nominee_country}
                onChange={(e) => set("nominee_country", e.target.value)}
              />
            </Field>
            <Field label="Organisation / Foundation" id="organisation">
              <Input
                id="organisation"
                value={state.organisation}
                onChange={(e) => set("organisation", e.target.value)}
              />
            </Field>
            <Field label="Website" id="website">
              <Input
                id="website"
                placeholder="https://"
                value={state.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </Field>
            <Field label="Social Media Profile" id="social_profile">
              <Input
                id="social_profile"
                placeholder="https://"
                value={state.social_profile}
                onChange={(e) => set("social_profile", e.target.value)}
              />
            </Field>
          </div>
        </StepShell>
      )}

      {/* ---------------- STEP 4 ---------------- */}
      {step === 4 && (
        <StepShell title="Recognition Region">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Recognition region *" id="region">
              <Select
                value={state.recognition_region}
                onValueChange={(v) => {
                  set("recognition_region", v);
                  set("african_country", "");
                  set("country_of_residence", "");
                  set("diaspora_region", "");
                }}
              >
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {RECOGNITION_REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {isAfricanRegion && (
              <Field label="African Country *" id="african_country">
                <Select
                  value={state.african_country}
                  onValueChange={(v) => set("african_country", v)}
                >
                  <SelectTrigger id="african_country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {AFRICAN_COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}

            {isDiaspora && (
              <>
                <Field label="Country of Residence *" id="country_of_residence">
                  <Input
                    id="country_of_residence"
                    placeholder="e.g. Canada, United States, United Kingdom"
                    value={state.country_of_residence}
                    onChange={(e) => set("country_of_residence", e.target.value)}
                  />
                </Field>
                <Field label="Diaspora Region *" id="diaspora_region">
                  <Select
                    value={state.diaspora_region}
                    onValueChange={(v) => set("diaspora_region", v)}
                  >
                    <SelectTrigger id="diaspora_region">
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIASPORA_CONTINENTAL_REGIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </>
            )}
          </div>
        </StepShell>
      )}

      {/* ---------------- STEP 5 ---------------- */}
      {step === 5 && (
        <StepShell
          title="Education Impact"
          hint="Which education areas has the nominee supported? Select all that apply."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {IMPACT_AREAS.map((a) => {
              const id = `area-${a}`;
              const checked = state.impact_areas.includes(a);
              return (
                <label
                  key={a}
                  htmlFor={id}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs cursor-pointer transition-colors ${
                    checked
                      ? "border-gold/60 bg-gold/10 text-white"
                      : "border-white/10 bg-charcoal/40 text-foreground/75 hover:border-gold/30"
                  }`}
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={() => toggleArea(a)}
                  />
                  <span>{a}</span>
                </label>
              );
            })}
          </div>
        </StepShell>
      )}

      {/* ---------------- STEP 6 ---------------- */}
      {step === 6 && (
        <StepShell title="Scale of Impact">
          <div className="space-y-1.5 max-w-sm">
            <Label htmlFor="impact_scale">Scale of impact *</Label>
            <Select
              value={state.impact_scale}
              onValueChange={(v) => set("impact_scale", v)}
            >
              <SelectTrigger id="impact_scale">
                <SelectValue placeholder="Select a scale" />
              </SelectTrigger>
              <SelectContent>
                {IMPACT_SCALE.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </StepShell>
      )}

      {/* ---------------- STEP 7 ---------------- */}
      {step === 7 && (
        <StepShell
          title="Evidence"
          hint="Provide links or references. Every field is optional but stronger evidence supports verification."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Official Website" id="ev_official_website">
              <Input
                id="ev_official_website"
                placeholder="https://"
                value={state.ev_official_website}
                onChange={(e) => set("ev_official_website", e.target.value)}
              />
            </Field>
            <Field label="Foundation Website" id="ev_foundation_website">
              <Input
                id="ev_foundation_website"
                placeholder="https://"
                value={state.ev_foundation_website}
                onChange={(e) => set("ev_foundation_website", e.target.value)}
              />
            </Field>
            <Field label="Social Media Pages" id="ev_social_pages">
              <Input
                id="ev_social_pages"
                placeholder="Comma- or space-separated URLs"
                value={state.ev_social_pages}
                onChange={(e) => set("ev_social_pages", e.target.value)}
              />
            </Field>
            <Field label="News Articles" id="ev_news_articles">
              <Input
                id="ev_news_articles"
                placeholder="Article URLs"
                value={state.ev_news_articles}
                onChange={(e) => set("ev_news_articles", e.target.value)}
              />
            </Field>
            <Field label="Interviews" id="ev_interviews">
              <Input
                id="ev_interviews"
                placeholder="Interview URLs"
                value={state.ev_interviews}
                onChange={(e) => set("ev_interviews", e.target.value)}
              />
            </Field>
            <Field label="Videos" id="ev_videos">
              <Input
                id="ev_videos"
                placeholder="Video URLs"
                value={state.ev_videos}
                onChange={(e) => set("ev_videos", e.target.value)}
              />
            </Field>
            <Field label="Scholarship Projects" id="ev_scholarship_projects">
              <Input
                id="ev_scholarship_projects"
                placeholder="Project names / links"
                value={state.ev_scholarship_projects}
                onChange={(e) => set("ev_scholarship_projects", e.target.value)}
              />
            </Field>
            <Field label="School Projects" id="ev_school_projects">
              <Input
                id="ev_school_projects"
                placeholder="Project names / links"
                value={state.ev_school_projects}
                onChange={(e) => set("ev_school_projects", e.target.value)}
              />
            </Field>
            <Field label="Media Reports" id="ev_media_reports">
              <Input
                id="ev_media_reports"
                placeholder="Report URLs"
                value={state.ev_media_reports}
                onChange={(e) => set("ev_media_reports", e.target.value)}
              />
            </Field>
            <Field label="Other Supporting Documents" id="ev_other_documents">
              <Input
                id="ev_other_documents"
                placeholder="Any additional evidence URLs"
                value={state.ev_other_documents}
                onChange={(e) => set("ev_other_documents", e.target.value)}
              />
            </Field>
          </div>
        </StepShell>
      )}

      {/* ---------------- STEP 8 ---------------- */}
      {step === 8 && (
        <StepShell title="Why should this person receive the Influencer Education Impact Award?">
          <Textarea
            id="why_deserve"
            rows={7}
            placeholder="Describe the nominee's measurable contribution to Education for All. Focus on educational impact rather than popularity or follower count."
            value={state.why_deserve}
            onChange={(e) => set("why_deserve", e.target.value)}
          />
          <p className="text-[11px] text-foreground/55 mt-2">
            Minimum 30 characters · {state.why_deserve.trim().length} typed
          </p>
        </StepShell>
      )}

      {/* ---------------- STEP 9 ---------------- */}
      {step === 9 && (
        <StepShell title="Nominator Details">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full Name *" id="nm_full_name">
              <Input
                id="nm_full_name"
                value={state.nm_full_name}
                onChange={(e) => set("nm_full_name", e.target.value)}
                required
              />
            </Field>
            <Field label="Email *" id="nm_email">
              <Input
                id="nm_email"
                type="email"
                value={state.nm_email}
                onChange={(e) => set("nm_email", e.target.value)}
                required
              />
            </Field>
            <Field label="Phone" id="nm_phone">
              <Input
                id="nm_phone"
                type="tel"
                value={state.nm_phone}
                onChange={(e) => set("nm_phone", e.target.value)}
              />
            </Field>
            <Field label="Country" id="nm_country">
              <Input
                id="nm_country"
                value={state.nm_country}
                onChange={(e) => set("nm_country", e.target.value)}
              />
            </Field>
          </div>
          <div className="flex items-start gap-2 pt-3">
            <Checkbox
              id="nm_consent"
              checked={state.nm_consent}
              onCheckedChange={(v) => set("nm_consent", Boolean(v))}
            />
            <label
              htmlFor="nm_consent"
              className="text-xs text-foreground/75 leading-relaxed cursor-pointer"
            >
              I certify that this nomination is based on verifiable evidence.
            </label>
          </div>
        </StepShell>
      )}

      {/* ---------------- Nav ---------------- */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={back}
          disabled={step === 1 || submitting}
          className="border-gold/40 text-gold hover:bg-gold/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {step < TOTAL_STEPS ? (
          <Button
            type="button"
            onClick={next}
            className="bg-gold text-charcoal hover:bg-gold/90 font-semibold"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="bg-gold text-charcoal hover:bg-gold/90 font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Influencer Nomination
              </>
            )}
          </Button>
        )}
      </div>

      {/* Governance note */}
      <div className="rounded-lg border border-gold/20 bg-charcoal/50 p-4 text-xs text-foreground/70 leading-relaxed">
        <p className="text-gold font-semibold mb-1">
          The Influencer Education Impact Award recognises Education Enablers — not popularity.
        </p>
        Every nomination undergoes independent review by the Nominee Research Corps (NRC)
        before being considered for recognition. Judging is based on verified educational
        contribution, measurable impact, integrity, and alignment with the mission of
        advancing Education for All across Africa.
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function StepShell({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-playfair text-xl md:text-2xl text-gold leading-tight">
          {title}
        </h3>
        {hint && <p className="text-xs text-foreground/65 mt-1">{hint}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export default InfluencerNominationForm;
