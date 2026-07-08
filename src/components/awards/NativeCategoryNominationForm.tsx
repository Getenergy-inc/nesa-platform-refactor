import { useMemo, useState } from "react";
import { Loader2, Send, ShieldCheck } from "lucide-react";
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
import type { AwardCategoryForm } from "@/config/nomination/types";
import { ICON_NOMINEE_TYPES } from "@/config/nomination/iconTaxonomy";

interface Props {
  /** Resolved category form whose subcategories become the "nominee category" dropdown. */
  form: AwardCategoryForm;
  /** Optional preselected subcategory slug (deep-link). */
  defaultSubcategorySlug?: string;
}

type NomineeType =
  | "individual"
  | "organization"
  | "school"
  | "program"
  | "Africans in Africa"
  | "Diaspora Africans"
  | "Friends of Africa";

interface FormState {
  subcategory_slug: string;
  nominee_name: string;
  nominee_type: NomineeType;
  nominee_country: string;
  organization: string;
  website: string;
  social_links: string;
  impact_summary: string;
  reason: string;
  nm_full_name: string;
  nm_email: string;
  nm_phone: string;
  nm_country_residence: string;
  nm_consent: boolean;
}

const INITIAL: FormState = {
  subcategory_slug: "",
  nominee_name: "",
  nominee_type: "individual",
  nominee_country: "",
  organization: "",
  website: "",
  social_links: "",
  impact_summary: "",
  reason: "",
  nm_full_name: "",
  nm_email: "",
  nm_phone: "",
  nm_country_residence: "",
  nm_consent: false,
};

/**
 * Native per-category nomination form used as a fallback when a category's
 * Google Form is still "Link Pending". Subcategories are embedded as a
 * nominee-options dropdown so users can submit immediately without waiting
 * for the external Google Form link.
 */
export function NativeCategoryNominationForm({ form, defaultSubcategorySlug }: Props) {
  const subOptions = useMemo(
    () => form.subcategories.filter((s) => s.slug && s.name),
    [form.subcategories],
  );

  const [state, setState] = useState<FormState>({
    ...INITIAL,
    subcategory_slug: defaultSubcategorySlug ?? subOptions[0]?.slug ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setState((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!state.nm_consent) return toast.error("Please confirm consent to continue.");
    if (state.nominee_name.trim().length < 2) return toast.error("Nominee name is required.");
    if (state.impact_summary.trim().length < 20)
      return toast.error("Impact summary needs at least 20 characters.");
    if (state.reason.trim().length < 20)
      return toast.error("Reason needs at least 20 characters.");
    if (!state.nm_email.includes("@")) return toast.error("Valid nominator email required.");

    setSubmitting(true);
    try {
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
            award_family: form.family,
            award_category_slug: form.slug,
            award_subcategory_slug: state.subcategory_slug || null,
            recognition_class: form.recognitionClass ?? null,
            region_slug: form.regionSlug ?? null,
            nominee_name: state.nominee_name,
            nominee_type: state.nominee_type,
            nominee_country: state.nominee_country,
            organization: state.organization,
            website: state.website,
            social_links: state.social_links
              ? state.social_links.split(/[\s,]+/).filter(Boolean)
              : [],
            impact_summary: state.impact_summary,
            reason: state.reason,
            source: "native-category-form",
            source_form_slug: form.slug,
          },
        },
      });

      if (error) throw error;

      toast.success("Nomination submitted — thank you!");
      setSubmitted(true);
    } catch (err) {
      console.error("Native nomination submit failed", err);
      toast.error("Could not submit nomination. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-charcoal-light/50 p-6 text-center text-foreground/90">
        <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-gold" />
        <h3 className="font-playfair text-2xl text-gold mb-2">
          Nomination received
        </h3>
        <p className="text-sm text-foreground/75 max-w-md mx-auto">
          Your submission for <span className="text-gold">{form.name}</span> is
          queued for NRC review. You will receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-5 md:p-6 space-y-5"
    >
      <div className="flex items-start gap-2 text-xs text-foreground/70">
        <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <span>
          This is the official native intake form for{" "}
          <span className="text-gold">{form.name}</span>. Submissions are
          evidence-checked by the NRC before review.
        </span>
      </div>

      {subOptions.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor="subcategory">Nominee category *</Label>
          <Select
            value={state.subcategory_slug}
            onValueChange={(v) => set("subcategory_slug", v)}
          >
            <SelectTrigger id="subcategory">
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subOptions.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nominee_name">Nominee name *</Label>
          <Input
            id="nominee_name"
            value={state.nominee_name}
            onChange={(e) => set("nominee_name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nominee_type">Nominee type</Label>
          <Select
            value={state.nominee_type}
            onValueChange={(v) => set("nominee_type", v as NomineeType)}
          >
            <SelectTrigger id="nominee_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="school">School</SelectItem>
              <SelectItem value="program">Program / Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nominee_country">Nominee country</Label>
          <Input
            id="nominee_country"
            value={state.nominee_country}
            onChange={(e) => set("nominee_country", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="organization">Organization / Affiliation</Label>
          <Input
            id="organization"
            value={state.organization}
            onChange={(e) => set("organization", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://"
            value={state.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="social_links">Social / evidence links</Label>
          <Input
            id="social_links"
            placeholder="Comma- or space-separated URLs"
            value={state.social_links}
            onChange={(e) => set("social_links", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="impact_summary">Impact summary *</Label>
        <Textarea
          id="impact_summary"
          rows={4}
          placeholder="What measurable education impact has the nominee delivered?"
          value={state.impact_summary}
          onChange={(e) => set("impact_summary", e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reason">Why does this nominee deserve recognition? *</Label>
        <Textarea
          id="reason"
          rows={4}
          value={state.reason}
          onChange={(e) => set("reason", e.target.value)}
          required
        />
      </div>

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
            <Label htmlFor="nm_email">Email *</Label>
            <Input
              id="nm_email"
              type="email"
              value={state.nm_email}
              onChange={(e) => set("nm_email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nm_phone">Phone</Label>
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
            I confirm the information above is accurate, evidence-based, and I
            consent to NESA-Africa processing this nomination for review.
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
            <Send className="mr-2 h-4 w-4" /> Submit Nomination
          </>
        )}
      </Button>
    </form>
  );
}

export default NativeCategoryNominationForm;
