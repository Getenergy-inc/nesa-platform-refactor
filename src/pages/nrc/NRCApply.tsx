// /nrc/apply — public application to join the Nominee Research Corps.
// Writes a real row to public.nrc_applications. No fabricated confirmation:
// the success state only appears after the insert succeeds.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, Search, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

const EXPERTISE = [
  "Basic & Secondary Education",
  "Higher Education",
  "TVET & Skills",
  "EduTech",
  "STEM",
  "Education Policy",
  "NGO & Development",
  "CSR & Philanthropy",
  "Media & Communications",
  "Research & Data",
  "Diaspora Engagement",
  "Faith-Based Education",
];

export default function NRCApply() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    organization: "",
    professional_title: "",
    linkedin_url: "",
    cv_url: "",
    weekly_hours: "",
    motivation: "",
  });
  const [expertise, setExpertise] = useState<string[]>([]);

  useEffect(() => {
    if (user?.email) setForm((f) => (f.email ? f : { ...f, email: user.email! }));
  }, [user?.email]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleExpertise = (area: string) =>
    setExpertise((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (expertise.length === 0) {
      setError("Select at least one area of expertise.");
      return;
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.from("nrc_applications").insert({
      user_id: user?.id ?? null,
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      country: form.country.trim() || null,
      organization: form.organization.trim() || null,
      professional_title: form.professional_title.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      cv_url: form.cv_url.trim() || null,
      weekly_hours: form.weekly_hours ? Number(form.weekly_hours) : null,
      motivation: form.motivation.trim(),
      expertise_areas: expertise,
    });
    setSubmitting(false);

    if (insertError) {
      const duplicate = insertError.code === "23505";
      const message = duplicate
        ? "An application from this email address is already under review."
        : insertError.message;
      setError(message);
      toast.error(message);
      return;
    }

    setSubmitted(true);
    toast.success("Application received");
  };

  return (
    <div className="min-h-screen bg-charcoal text-white px-4 py-12">
      <Helmet>
        <title>Apply to the NRC — NESA-Africa 2026</title>
        <meta
          name="description"
          content="Apply to join the NESA-Africa Nominee Research Corps: verify nominee evidence and uphold recognition integrity."
        />
      </Helmet>

      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 text-center">
          <Search className="mx-auto mb-3 h-9 w-9 text-gold" aria-hidden />
          <h1 className="font-display text-3xl font-bold">Join the Nominee Research Corps</h1>
          <p className="mt-2 text-sm text-white/65">
            The NRC independently verifies nominee evidence before judging. Applications are reviewed
            by NRC leadership; approved applicants receive an emailed invitation to create their
            account.
          </p>
        </header>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-emerald-400" aria-hidden />
            <h2 className="font-display text-xl font-bold">Application received</h2>
            <p className="mt-2 text-sm text-white/70">
              Your application is now in the NRC leadership review queue. If it is approved you will
              receive an invitation email at <strong>{form.email}</strong> with a secure link to
              create your NRC account. We do not publish a decision timeline — you will only hear
              from us by email.
            </p>
            <Button asChild variant="outline" className="mt-6 border-white/20 text-white">
              <Link to="/nrc">Back to the NRC Arena</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Application not submitted</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" required value={form.full_name} onChange={set("full_name")} className="mt-1 bg-black/30 border-white/15" />
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" required value={form.email} onChange={set("email")} className="mt-1 bg-black/30 border-white/15" />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" value={form.phone} onChange={set("phone")} className="mt-1 bg-black/30 border-white/15" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" required value={form.country} onChange={set("country")} className="mt-1 bg-black/30 border-white/15" />
              </div>
              <div>
                <Label htmlFor="organization">Organisation (optional)</Label>
                <Input id="organization" value={form.organization} onChange={set("organization")} className="mt-1 bg-black/30 border-white/15" />
              </div>
              <div>
                <Label htmlFor="professional_title">Role / title (optional)</Label>
                <Input id="professional_title" value={form.professional_title} onChange={set("professional_title")} className="mt-1 bg-black/30 border-white/15" />
              </div>
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL (optional)</Label>
                <Input id="linkedin_url" type="url" value={form.linkedin_url} onChange={set("linkedin_url")} className="mt-1 bg-black/30 border-white/15" />
              </div>
              <div>
                <Label htmlFor="cv_url">CV link (optional)</Label>
                <Input id="cv_url" type="url" value={form.cv_url} onChange={set("cv_url")} className="mt-1 bg-black/30 border-white/15" />
              </div>
              <div>
                <Label htmlFor="weekly_hours">Hours available weekly</Label>
                <Input
                  id="weekly_hours" type="number" min={1} max={40} required
                  value={form.weekly_hours} onChange={set("weekly_hours")}
                  className="mt-1 bg-black/30 border-white/15"
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-sm font-medium">Areas of expertise</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {EXPERTISE.map((area) => (
                  <label key={area} className="flex items-center gap-2 text-sm text-white/80">
                    <Checkbox
                      checked={expertise.includes(area)}
                      onCheckedChange={() => toggleExpertise(area)}
                      aria-label={area}
                    />
                    {area}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <Label htmlFor="motivation">Why do you want to serve on the NRC?</Label>
              <Textarea
                id="motivation" required minLength={80} rows={5}
                value={form.motivation} onChange={set("motivation")}
                placeholder="Describe your research or verification experience and why evidence integrity matters to you (minimum 80 characters)."
                className="mt-1 bg-black/30 border-white/15"
              />
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-gold/25 bg-gold/5 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <p className="text-xs text-white/70">
                NRC service is unpaid and governed by a confidentiality agreement, a code of conduct
                and a conflict-of-interest declaration completed during onboarding.
              </p>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-gold text-charcoal hover:bg-gold/90">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit application"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
