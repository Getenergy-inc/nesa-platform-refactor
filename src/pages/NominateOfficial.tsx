import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { ExistingNomineesInline } from "@/components/nominees/ExistingNomineesInline";

type FormState = {
  // nominator
  nm_full_name: string;
  nm_email: string;
  nm_phone: string;
  nm_country_residence: string;
  nm_country_origin: string;
  nm_consent: boolean;
  // nomination
  nominee_name: string;
  nominee_type: string;
  nominee_country: string;
  nominee_region: string;
  nominee_city: string;
  organization: string;
  website: string;
  social_links: string;
  impact_summary: string;
  reason: string;
  evidence_links: string;
  // honeypot
  company_website: string;
};

const init: FormState = {
  nm_full_name: "",
  nm_email: "",
  nm_phone: "",
  nm_country_residence: "",
  nm_country_origin: "",
  nm_consent: false,
  nominee_name: "",
  nominee_type: "individual",
  nominee_country: "",
  nominee_region: "",
  nominee_city: "",
  organization: "",
  website: "",
  social_links: "",
  impact_summary: "",
  reason: "",
  evidence_links: "",
  company_website: "",
};

const FAMILY_LABELS: Record<string, string> = {
  icon: "Africa Education Icon",
  "gold-bluegarnet": "Gold & Blue Garnet",
  platinum: "Platinum Certificate of Recognition",
  influencer: "Education Influencer Impact",
  rmsa: "Rebuild My School Africa",
};

export default function NominateOfficial() {
  const params = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const family = (params.family ?? "gold-bluegarnet").toLowerCase();
  const category = params.category ?? search.get("category") ?? "";
  const region = search.get("region") ?? "";
  const zone = search.get("zone") ?? "";
  const state = search.get("state") ?? "";
  const subcategory = search.get("subcategory") ?? "";
  const recognitionClass = search.get("class") ?? "";

  const [form, setForm] = useState<FormState>(init);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    // Prefill nominator name/email if signed in
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      setForm((f) => ({
        ...f,
        nm_email: f.nm_email || u.email || "",
        nm_full_name: f.nm_full_name || (u.user_metadata?.full_name as string) || "",
      }));
    });
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const familyLabel = FAMILY_LABELS[family] ?? family;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Quick client-side validation
    if (!form.nm_consent) return toast.error("Please confirm consent to continue.");
    if (form.nominee_name.trim().length < 2) return toast.error("Nominee name is required.");
    if (form.impact_summary.trim().length < 20) return toast.error("Impact summary is too short.");
    if (form.reason.trim().length < 20) return toast.error("Reason is too short.");

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("nominations-submit", {
        body: {
          nominator: {
            full_name: form.nm_full_name,
            email: form.nm_email,
            phone: form.nm_phone,
            country_residence: form.nm_country_residence,
            country_origin: form.nm_country_origin,
            consent: form.nm_consent,
          },
          nomination: {
            award_family: family,
            award_category_slug: category || family,
            award_subcategory_slug: subcategory || null,
            recognition_class: recognitionClass || null,
            region_slug: region || null,
            zone_slug: zone || null,
            state_slug: state || null,
            nominee_name: form.nominee_name,
            nominee_type: form.nominee_type,
            nominee_country: form.nominee_country,
            nominee_region: form.nominee_region,
            nominee_city: form.nominee_city,
            organization: form.organization,
            website: form.website,
            social_links: form.social_links,
            impact_summary: form.impact_summary,
            reason: form.reason,
            evidence_links: form.evidence_links,
            company_website: form.company_website,
          },
        },
      });
      if (error) throw error;
      const id = (data as { nomination_id?: string })?.nomination_id ?? null;
      setSubmittedId(id);
      toast.success("Official nomination submitted. Our review team will contact you.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="bg-charcoal min-h-screen">
        <div className="container max-w-2xl py-16">
          <Card className="p-8 text-center space-y-4 border-gold-500/30">
            <CheckCircle2 className="w-14 h-14 text-gold-500 mx-auto" />
            <h1 className="text-2xl font-playfair">Nomination received</h1>
            <p className="text-muted-foreground">
              Reference: <code className="text-gold-500">{submittedId}</code>
            </p>
            <p className="text-sm text-muted-foreground">
              We've logged your official nomination and queued it for evidence review. You'll receive an
              email update when status changes.
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate("/nominees")}>
                Browse Existing Nominees
              </Button>
              <Button onClick={() => { setSubmittedId(null); setForm(init); }}>
                Submit another
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Official Nomination — ${familyLabel} | NESA-Africa`}</title>
        <meta
          name="description"
          content={`Submit an official NESA-Africa nomination for ${familyLabel}.`}
        />
      </Helmet>
      <div className="bg-charcoal min-h-screen">
        <div className="container max-w-3xl py-10 md:py-14">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-playfair text-gold-500">
              Official Nomination
            </h1>
            <p className="text-muted-foreground mt-2">
              {familyLabel}
              {category && ` · ${category}`}
              {region && ` · ${region}`}
              {zone && ` · ${zone}`}
              {state && ` · ${state}`}
            </p>
          </motion.div>

          <form onSubmit={onSubmit} className="mt-8 space-y-8">
            {/* honeypot */}
            <div className="hidden" aria-hidden="true">
              <Label>Company website</Label>
              <Input
                tabIndex={-1}
                autoComplete="off"
                value={form.company_website}
                onChange={(e) => set("company_website", e.target.value)}
              />
            </div>

            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gold-500">Nominee</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nominee full name *" value={form.nominee_name} onChange={(v) => set("nominee_name", v)} required />
                <Field label="Type (individual / organization / school)" value={form.nominee_type} onChange={(v) => set("nominee_type", v)} />
                <Field label="Organization (if applicable)" value={form.organization} onChange={(v) => set("organization", v)} />
                <Field label="Website" value={form.website} onChange={(v) => set("website", v)} placeholder="https://" />
                <Field label="Country" value={form.nominee_country} onChange={(v) => set("nominee_country", v)} />
                <Field label="Region / State" value={form.nominee_region} onChange={(v) => set("nominee_region", v)} />
                <Field label="City" value={form.nominee_city} onChange={(v) => set("nominee_city", v)} />
                <Field label="Social links (comma separated)" value={form.social_links} onChange={(v) => set("social_links", v)} />
              </div>
              <div>
                <Label>Impact summary *</Label>
                <Textarea rows={4} value={form.impact_summary} onChange={(e) => set("impact_summary", e.target.value)} required />
              </div>
              <div>
                <Label>Reason for nomination *</Label>
                <Textarea rows={4} value={form.reason} onChange={(e) => set("reason", e.target.value)} required />
              </div>
              <div>
                <Label>Evidence links (URLs, comma or newline separated)</Label>
                <Textarea rows={3} value={form.evidence_links} onChange={(e) => set("evidence_links", e.target.value)} placeholder="https://drive.google.com/..." />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gold-500">Nominator (you)</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full name *" value={form.nm_full_name} onChange={(v) => set("nm_full_name", v)} required />
                <Field label="Email *" type="email" value={form.nm_email} onChange={(v) => set("nm_email", v)} required />
                <Field label="Phone" value={form.nm_phone} onChange={(v) => set("nm_phone", v)} />
                <Field label="Country of residence" value={form.nm_country_residence} onChange={(v) => set("nm_country_residence", v)} />
                <Field label="Country of origin" value={form.nm_country_origin} onChange={(v) => set("nm_country_origin", v)} />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={form.nm_consent} onCheckedChange={(v) => set("nm_consent", !!v)} />
                <span className="text-sm text-muted-foreground">
                  I confirm the information provided is accurate and I consent to NESA-Africa
                  contacting me about this nomination.
                </span>
              </label>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-gold-500 text-charcoal hover:bg-gold-400">
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Official Nomination
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function Field({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
