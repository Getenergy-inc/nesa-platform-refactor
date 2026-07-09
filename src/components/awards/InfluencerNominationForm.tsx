import { useMemo, useState } from "react";
import { Loader2, Send, ShieldCheck, Sparkles, Users, Music, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ---------------------------------------------------------------------------
// Recognition pathway options — Primary Medium of Influence
// ---------------------------------------------------------------------------
type PathwayValue = "social-media" | "sports-icons" | "music-icons";

const PATHWAYS: Array<{
  value: PathwayValue;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string;
}> = [
  {
    value: "social-media",
    label: "Social Media Education Champions",
    icon: Sparkles,
    description:
      "Recognising digital creators and online personalities using social media to promote Education for All.",
    examples:
      "Social Media Creator · Educational Content Creator · YouTuber · Podcaster · Blogger · Digital Learning Creator · Online Community Builder · Educational Newsletter Publisher",
  },
  {
    value: "sports-icons",
    label: "Sports Icons Supporting Education",
    icon: Trophy,
    description:
      "Recognising sports personalities investing in education through scholarships, mentorship, school support and youth empowerment.",
    examples:
      "Football · Athletics · Basketball · Rugby · Cricket · Tennis · Motorsport · Paralympic Sports · Other Sports",
  },
  {
    value: "music-icons",
    label: "Music Icons Supporting Education",
    icon: Music,
    description:
      "Recognising musicians and music professionals using their influence to promote education through advocacy, fundraising, scholarships and learning initiatives.",
    examples:
      "Music Artist · Music Producer · Gospel Artist · Choir · Orchestra · Music Foundation",
  },
];

const IMPACT_AREAS: string[] = [
  "Scholarships",
  "School Construction",
  "Classroom Renovation",
  "Teacher Development",
  "STEM Promotion",
  "TVET Support",
  "Books & Libraries",
  "Reading Culture",
  "Digital Literacy",
  "Coding Education",
  "Educational Technology",
  "Mentorship",
  "Youth Development",
  "Career Guidance",
  "Educational Media",
  "Girls' Education",
  "Disability Inclusion",
  "Community Learning",
  "Education Campaigns",
  "Policy Advocacy",
  "Research Support",
  "Higher Education",
  "Early Childhood Education",
  "Adult Education",
  "Refugee Education",
  "Financial Support",
  "Other",
];

const IMPACT_SCALE: string[] = [
  "Community",
  "City",
  "State / Province",
  "National",
  "Multi-country",
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

const RECOGNITION_REGIONS = [...AFRICAN_REGIONS, "Global", "African Diaspora"];

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

const AUDIENCE_REACH = [
  "Under 5,000",
  "5,000–20,000",
  "20,000–100,000",
  "100,000–500,000",
  "500,000–1 Million",
  "Over 1 Million",
];

interface FormState {
  pathway: PathwayValue | "";
  impact_areas: string[];
  impact_scale: string;
  recognition_region: string;
  country: string;
  country_of_residence: string;
  diaspora_continent: string;
  audience_reach: string;
  nominee_name: string;
  official_website: string;
  social_profiles: string;
  news_articles: string;
  videos: string;
  interviews: string;
  scholarship_programmes: string;
  school_projects: string;
  foundation_website: string;
  media_coverage: string;
  annual_reports: string;
  additional_documents: string;
  impact_summary: string;
  nm_full_name: string;
  nm_email: string;
  nm_phone: string;
  nm_country_residence: string;
  nm_consent: boolean;
}

const INITIAL: FormState = {
  pathway: "",
  impact_areas: [],
  impact_scale: "",
  recognition_region: "",
  country: "",
  country_of_residence: "",
  diaspora_continent: "",
  audience_reach: "",
  nominee_name: "",
  official_website: "",
  social_profiles: "",
  news_articles: "",
  videos: "",
  interviews: "",
  scholarship_programmes: "",
  school_projects: "",
  foundation_website: "",
  media_coverage: "",
  annual_reports: "",
  additional_documents: "",
  impact_summary: "",
  nm_full_name: "",
  nm_email: "",
  nm_phone: "",
  nm_country_residence: "",
  nm_consent: false,
};

const splitLinks = (v: string) =>
  v ? v.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean) : [];

export function InfluencerNominationForm() {
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nominationId, setNominationId] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setState((p) => ({ ...p, [k]: v }));

  const toggleArea = (area: string) => {
    setState((p) => ({
      ...p,
      impact_areas: p.impact_areas.includes(area)
        ? p.impact_areas.filter((a) => a !== area)
        : [...p.impact_areas, area],
    }));
  };

  const isDiaspora = state.recognition_region === "African Diaspora";
  const isGlobal = state.recognition_region === "Global";
  const activePathway = useMemo(
    () => PATHWAYS.find((p) => p.value === state.pathway),
    [state.pathway],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!state.pathway) return toast.error("Please select a Primary Medium of Influence.");
    if (state.nominee_name.trim().length < 2) return toast.error("Nominee name is required.");
    if (state.impact_areas.length === 0)
      return toast.error("Select at least one Education Impact Area.");
    if (!state.impact_scale) return toast.error("Please select the Impact Scale.");
    if (!state.recognition_region) return toast.error("Please select a Recognition Region.");
    if (isDiaspora && !state.diaspora_continent)
      return toast.error("Diaspora Continental Region is required.");
    if (state.impact_summary.trim().length < 30)
      return toast.error("Impact summary needs at least 30 characters.");
    if (!state.nm_consent) return toast.error("Please confirm consent to continue.");
    if (!state.nm_email.includes("@")) return toast.error("Valid nominator email required.");

    setSubmitting(true);
    try {
      const localId = `INF-${Date.now().toString(36).toUpperCase()}`;

      const { error } = await supabase.functions.invoke("nominations-submit", {
        body: {
          nominator: {
            full_name: state.nm_full_name,
            email: state.nm_email,
            phone: state.nm_phone,
            country_residence: state.nm_country_residence,
            consent: state.nm_consent,
          },
          nomination: {
            award_family: "influencer",
            award_category_slug: `influencer-${state.pathway}`,
            award_subcategory_slug: state.pathway,
            recognition_class: activePathway?.label ?? null,
            region_slug: state.recognition_region,
            nominee_name: state.nominee_name,
            nominee_type: "individual",
            nominee_country: isDiaspora ? state.country_of_residence : state.country,
            organization: "",
            website: state.official_website,
            social_links: splitLinks(state.social_profiles),
            impact_summary: state.impact_summary,
            reason: state.impact_summary,
            source: "influencer-native-form",
            source_form_slug: "influencer-education-impact-2026",
            metadata: {
              local_id: localId,
              recognition_pathway: state.pathway,
              medium_of_influence: activePathway?.label,
              education_impact_areas: state.impact_areas,
              impact_scale: state.impact_scale,
              recognition_region: state.recognition_region,
              country: state.country,
              country_of_residence: state.country_of_residence,
              diaspora_continent: state.diaspora_continent,
              audience_reach: state.audience_reach,
              evidence: {
                official_website: state.official_website,
                social_profiles: splitLinks(state.social_profiles),
                news_articles: splitLinks(state.news_articles),
                videos: splitLinks(state.videos),
                interviews: splitLinks(state.interviews),
                scholarship_programmes: state.scholarship_programmes,
                school_projects: state.school_projects,
                foundation_website: state.foundation_website,
                media_coverage: splitLinks(state.media_coverage),
                annual_reports: splitLinks(state.annual_reports),
                additional_documents: splitLinks(state.additional_documents),
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

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-5 md:p-6 space-y-8"
    >
      {/* Trust notice */}
      <div className="flex items-start gap-2 text-xs text-foreground/75 rounded-lg border border-gold/20 bg-charcoal/40 p-3">
        <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <span>
          This is the official native nomination form for the NESA-Africa{" "}
          <span className="text-gold">Influencer Education Impact Award 2026</span>. Every
          submission is independently reviewed by the Nominee Research Corps (NRC) before
          publication, verification, certificate approval and recognition. Follower count or
          celebrity status does not influence judging.
        </span>
      </div>

      {/* SECTION 1 · Recognition Pathway */}
      <Section number="1" title="Recognition Pathway">
        <div className="space-y-1.5">
          <Label htmlFor="pathway">Primary Medium of Influence *</Label>
          <Select value={state.pathway} onValueChange={(v) => set("pathway", v as PathwayValue)}>
            <SelectTrigger id="pathway">
              <SelectValue placeholder="Select a pathway" />
            </SelectTrigger>
            <SelectContent>
              {PATHWAYS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {activePathway && (
          <div className="mt-3 rounded-lg border border-gold/15 bg-charcoal/50 p-3">
            <div className="flex items-start gap-2">
              <activePathway.icon className="h-4 w-4 text-gold mt-0.5 shrink-0" />
              <div className="space-y-1.5">
                <p className="text-sm text-foreground/85">{activePathway.description}</p>
                <p className="text-[11px] text-foreground/55 leading-relaxed">
                  Examples · {activePathway.examples}
                </p>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* SECTION 2 · Education Impact Area */}
      <Section number="2" title="Education Impact Area">
        <p className="text-xs text-foreground/65 mb-3">
          Select all measurable education impact areas supported by the nominee.
        </p>
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
                <Checkbox id={id} checked={checked} onCheckedChange={() => toggleArea(a)} />
                <span>{a}</span>
              </label>
            );
          })}
        </div>
      </Section>

      {/* SECTION 3 · Impact Scale */}
      <Section number="3" title="Impact Scale">
        <p className="text-xs text-foreground/65 mb-3">
          What is the primary geographical reach of the nominee's education impact?
        </p>
        <RadioGroup
          value={state.impact_scale}
          onValueChange={(v) => set("impact_scale", v)}
          className="grid grid-cols-2 md:grid-cols-4 gap-2"
        >
          {IMPACT_SCALE.map((s) => (
            <label
              key={s}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs cursor-pointer ${
                state.impact_scale === s
                  ? "border-gold/60 bg-gold/10 text-white"
                  : "border-white/10 bg-charcoal/40 text-foreground/75 hover:border-gold/30"
              }`}
            >
              <RadioGroupItem value={s} id={`scale-${s}`} />
              <span>{s}</span>
            </label>
          ))}
        </RadioGroup>
      </Section>

      {/* SECTION 4 · Recognition Region */}
      <Section number="4" title="Recognition Region">
        <div className="space-y-1.5">
          <Label htmlFor="region">Primary recognition region *</Label>
          <Select
            value={state.recognition_region}
            onValueChange={(v) => {
              set("recognition_region", v);
              set("country", "");
              set("country_of_residence", "");
              set("diaspora_continent", "");
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
        </div>
      </Section>

      {/* SECTION 5 · Country Information (conditional) */}
      {state.recognition_region && (
        <Section number="5" title="Country Information">
          {isDiaspora ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="country_of_residence">Country of Residence *</Label>
                <Input
                  id="country_of_residence"
                  placeholder="e.g. Canada, United States, United Kingdom"
                  value={state.country_of_residence}
                  onChange={(e) => set("country_of_residence", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="diaspora_continent">Diaspora Continental Region *</Label>
                <Select
                  value={state.diaspora_continent}
                  onValueChange={(v) => set("diaspora_continent", v)}
                >
                  <SelectTrigger id="diaspora_continent">
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
              </div>
            </div>
          ) : isGlobal ? (
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Nominee country"
                value={state.country}
                onChange={(e) => set("country", e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="country">Country *</Label>
              <Select value={state.country} onValueChange={(v) => set("country", v)}>
                <SelectTrigger id="country">
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
            </div>
          )}
        </Section>
      )}

      {/* SECTION 6 · Audience Reach (optional) */}
      <Section number="6" title="Audience Reach (Optional)">
        <p className="text-xs text-foreground/65 mb-3">
          Audience size is collected for reporting purposes only. It has no influence on
          judging or recognition outcomes.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="audience_reach">Audience reach</Label>
          <Select
            value={state.audience_reach}
            onValueChange={(v) => set("audience_reach", v)}
          >
            <SelectTrigger id="audience_reach">
              <SelectValue placeholder="Select an audience reach band" />
            </SelectTrigger>
            <SelectContent>
              {AUDIENCE_REACH.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Section>

      {/* SECTION 7 · Evidence of Education Impact */}
      <Section number="7" title="Evidence of Education Impact">
        <p className="text-xs text-foreground/65 mb-3">
          Provide evidence supporting the nominee's measurable contribution to Education for All.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="nominee_name">Nominee full name *</Label>
            <Input
              id="nominee_name"
              value={state.nominee_name}
              onChange={(e) => set("nominee_name", e.target.value)}
              required
            />
          </div>
          <EvidenceField
            id="official_website"
            label="Official Website"
            value={state.official_website}
            onChange={(v) => set("official_website", v)}
            placeholder="https://"
          />
          <EvidenceField
            id="social_profiles"
            label="Social Media Profiles"
            value={state.social_profiles}
            onChange={(v) => set("social_profiles", v)}
            placeholder="Comma- or space-separated URLs"
          />
          <EvidenceField
            id="news_articles"
            label="News Articles"
            value={state.news_articles}
            onChange={(v) => set("news_articles", v)}
            placeholder="Article URLs"
          />
          <EvidenceField
            id="videos"
            label="Videos"
            value={state.videos}
            onChange={(v) => set("videos", v)}
            placeholder="Video URLs"
          />
          <EvidenceField
            id="interviews"
            label="Interviews"
            value={state.interviews}
            onChange={(v) => set("interviews", v)}
            placeholder="Interview URLs"
          />
          <EvidenceField
            id="scholarship_programmes"
            label="Scholarship Programmes"
            value={state.scholarship_programmes}
            onChange={(v) => set("scholarship_programmes", v)}
            placeholder="Programme names / links"
          />
          <EvidenceField
            id="school_projects"
            label="School Projects"
            value={state.school_projects}
            onChange={(v) => set("school_projects", v)}
            placeholder="Project names / links"
          />
          <EvidenceField
            id="foundation_website"
            label="Foundation Website"
            value={state.foundation_website}
            onChange={(v) => set("foundation_website", v)}
            placeholder="https://"
          />
          <EvidenceField
            id="media_coverage"
            label="Media Coverage"
            value={state.media_coverage}
            onChange={(v) => set("media_coverage", v)}
            placeholder="Coverage URLs"
          />
          <EvidenceField
            id="annual_reports"
            label="Annual Reports"
            value={state.annual_reports}
            onChange={(v) => set("annual_reports", v)}
            placeholder="Report URLs"
          />
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="additional_documents">Additional Supporting Documents</Label>
            <Input
              id="additional_documents"
              placeholder="Any additional evidence URLs"
              value={state.additional_documents}
              onChange={(e) => set("additional_documents", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <Label htmlFor="impact_summary">
            Impact Summary — Why does this nominee deserve recognition? *
          </Label>
          <Textarea
            id="impact_summary"
            rows={5}
            placeholder="Describe the nominee's measurable, evidence-based contribution to Education for All."
            value={state.impact_summary}
            onChange={(e) => set("impact_summary", e.target.value)}
            required
          />
        </div>
      </Section>

      {/* SECTION 8 · Verification (read-only governance) */}
      <Section number="8" title="Verification">
        <div className="rounded-lg border border-gold/20 bg-charcoal/50 p-4 space-y-3">
          <p className="text-sm font-semibold text-gold">Independent Verification Process</p>
          <p className="text-xs text-foreground/75 leading-relaxed">
            Every nomination is independently reviewed by the Nominee Research Corps (NRC).
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-foreground/70">
            {[
              "NRC Verification",
              "Organisation Verification",
              "Media Verification",
              "Website Verification",
              "Partner Verification",
            ].map((v) => (
              <li key={v} className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                {v}
              </li>
            ))}
          </ul>
          <p className="text-xs text-foreground/60">
            Only verified nominees proceed to recognition, certificate approval and
            publication.
          </p>
        </div>
      </Section>

      {/* Nominator details */}
      <div className="rounded-xl border border-gold/20 bg-charcoal/40 p-4 space-y-4">
        <p className="text-xs uppercase tracking-[0.18em] text-gold/80 font-semibold">
          Your details (nominator)
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nm_full_name">Full name *</Label>
            <Input
              id="nm_full_name"
              value={state.nm_full_name}
              onChange={(e) => set("nm_full_name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nm_email">Email address *</Label>
            <Input
              id="nm_email"
              type="email"
              value={state.nm_email}
              onChange={(e) => set("nm_email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nm_phone">Phone number</Label>
            <Input
              id="nm_phone"
              type="tel"
              value={state.nm_phone}
              onChange={(e) => set("nm_phone", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nm_country_residence">Country of residence</Label>
            <Input
              id="nm_country_residence"
              value={state.nm_country_residence}
              onChange={(e) => set("nm_country_residence", e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-start gap-2 pt-1">
          <Checkbox
            id="nm_consent"
            checked={state.nm_consent}
            onCheckedChange={(v) => set("nm_consent", Boolean(v))}
          />
          <label
            htmlFor="nm_consent"
            className="text-xs text-foreground/75 leading-relaxed cursor-pointer"
          >
            I confirm that the information provided is accurate, evidence-based and submitted
            in good faith. I consent to NESA-Africa processing this nomination for independent
            verification, recognition consideration and publication where approved.
          </label>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full bg-gold text-charcoal hover:bg-gold/90 font-semibold"
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
    </form>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 border border-gold/40 text-xs font-bold text-gold">
          {number}
        </span>
        <h3 className="font-playfair text-lg md:text-xl text-gold">{title}</h3>
      </div>
      <div>{children}</div>
    </section>
  );
}

function EvidenceField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default InfluencerNominationForm;
