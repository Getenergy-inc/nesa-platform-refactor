import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, Send, ShieldCheck, Sparkles } from "lucide-react";
import { z } from "zod";
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
import { trackEvent } from "@/lib/analytics";
import { useDraftPersistence } from "@/features/nominate/useDraftPersistence";
import { AccountAtSubmitPanel } from "@/features/nominate/AccountAtSubmitPanel";
import { useAuth } from "@/contexts/AuthContext";


// Mirrors the server-side zod schema in supabase/functions/nominations-submit.
const submitSchema = z.object({
  subcategory_slug: z.string().trim().max(120).optional(),
  nominee_name: z.string().trim().min(2, "Nominee name is required").max(200),
  nominee_country: z.string().trim().max(120).optional(),
  organization: z.string().trim().max(200).optional(),
  website: z
    .string()
    .trim()
    .max(500)
    .refine((v) => !v || /^https?:\/\//i.test(v), "Website must start with http(s)://")
    .optional(),
  social_links: z.string().trim().max(2000).optional(),
  impact_summary: z
    .string()
    .trim()
    .min(20, "Impact summary needs at least 20 characters")
    .max(4000),
  reason: z
    .string()
    .trim()
    .min(20, "Reason needs at least 20 characters")
    .max(4000),
  nm_full_name: z.string().trim().min(2, "Your full name is required").max(160),
  nm_email: z.string().trim().email("Enter a valid email").max(255),
  nm_phone: z.string().trim().max(40).optional(),
  nm_country_residence: z.string().trim().max(120).optional(),
  nm_consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to submit" }),
  }),
});

interface Props {
  /** Resolved category form whose subcategories become the "nominee category" dropdown. */
  form: AwardCategoryForm;
  /** Optional preselected subcategory slug (deep-link). */
  defaultSubcategorySlug?: string;
  /** Where to redirect the user after a successful submission. */
  successRedirectHref?: string;
  /** Label for the redirect target (e.g. "Gold Nominees"). */
  successRedirectLabel?: string;
  /** Auto-redirect delay in ms. Defaults to 2500. Set to 0 to disable auto-redirect. */
  successRedirectDelayMs?: number;
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
export function NativeCategoryNominationForm({
  form,
  defaultSubcategorySlug,
  successRedirectHref,
  successRedirectLabel,
  successRedirectDelayMs = 2500,
}: Props) {
  const navigate = useNavigate();
  const subOptions = useMemo(
    () => form.subcategories.filter((s) => s.slug && s.name),
    [form.subcategories],
  );

  const isIconFamily = form.family === "africa-education-icon";

  const { user } = useAuth();

  const [state, setState] = useState<FormState>({
    ...INITIAL,
    nominee_type: isIconFamily ? "Africans in Africa" : INITIAL.nominee_type,
    subcategory_slug: defaultSubcategorySlug ?? subOptions[0]?.slug ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nominationRef, setNominationRef] = useState<string | null>(null);

  // Draft persistence (localStorage; anon-safe).
  const { draftToken, hydratedValues, clearDraft } = useDraftPersistence<FormState>(
    `native-${form.family}-${form.slug}`,
    state,
  );

  useEffect(() => {
    if (hydratedValues) {
      setState((prev) => ({ ...prev, ...hydratedValues }));
      trackEvent("nomination_draft_restored", { form: form.slug, token: draftToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydratedValues]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setState((p) => ({ ...p, [k]: v }));


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg(null);

    const parsed = submitSchema.safeParse(state);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      const msg = first?.message ?? "Please review the highlighted fields.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("nominations-submit", {
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

      if (error) {
        // Supabase FunctionsHttpError exposes .context.response for body access.
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
      const reference =
        data && typeof data === "object" && "reference" in data
          ? String((data as { reference?: string }).reference ?? "") || null
          : null;
      setNominationRef(reference ?? (nominationId ? `NESA-${String(nominationId).slice(-6).toUpperCase()}` : null));
      trackEvent("nomination_submit_success", {
        category: form.slug,
        family: form.family,
        subcategory: state.subcategory_slug || null,
        nomination_id: nominationId,
        reference,
        draft_token: draftToken,
        signed_in: Boolean(user),
        redirect_href: successRedirectHref ?? null,
        redirect_delay_ms: successRedirectHref ? successRedirectDelayMs : 0,
        auto_redirect: Boolean(successRedirectHref && successRedirectDelayMs > 0),
      });
      clearDraft();
      toast.success("Nomination submitted — thank you!");
      setSubmitted(true);

    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not submit nomination. Please try again.";
      console.error("Native nomination submit failed", err);
      trackEvent("nomination_submit_error", {
        category: form.slug,
        family: form.family,
        message,
      });
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!submitted || !successRedirectHref || successRedirectDelayMs <= 0) return;
    const t = window.setTimeout(() => {
      trackEvent("nomination_redirect_auto", {
        category: form.slug,
        family: form.family,
        subcategory: state.subcategory_slug || null,
        destination: successRedirectHref,
        delay_ms: successRedirectDelayMs,
      });
      navigate(successRedirectHref);
    }, successRedirectDelayMs);
    return () => window.clearTimeout(t);
  }, [
    submitted,
    successRedirectHref,
    successRedirectDelayMs,
    navigate,
    form.slug,
    form.family,
    state.subcategory_slug,
  ]);

  if (submitted) {
    const seconds = Math.max(1, Math.round(successRedirectDelayMs / 1000));
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-gold/40 bg-charcoal-light/50 p-6 text-center text-foreground/90">
          <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-gold" />
          <h3 className="font-playfair text-2xl text-gold mb-2">Nomination received</h3>
          <p className="text-sm text-foreground/75 max-w-md mx-auto">
            Your submission for <span className="text-gold">{form.name}</span> is queued for NRC
            review.
          </p>
          {nominationRef && (
            <p className="mt-2 text-xs text-foreground/70">
              Reference: <span className="text-gold font-mono">{nominationRef}</span>
            </p>
          )}
          {successRedirectHref && (
            <div className="mt-5 space-y-2">
              {successRedirectDelayMs > 0 && (
                <p className="text-xs text-foreground/60">
                  Redirecting to {successRedirectLabel ?? "the nominees page"} in {seconds}s…
                </p>
              )}
              <Link
                to={successRedirectHref}
                onClick={() =>
                  trackEvent("nomination_redirect_manual", {
                    category: form.slug,
                    family: form.family,
                    subcategory: state.subcategory_slug || null,
                    destination: successRedirectHref,
                  })
                }
                className="inline-flex items-center justify-center rounded-lg border border-gold/60 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-charcoal"
              >
                Go to {successRedirectLabel ?? "Nominees"} now
              </Link>
            </div>
          )}
        </div>

        {!user && (
          <AccountAtSubmitPanel
            reference={nominationRef}
            defaultEmail={state.nm_email}
            defaultFullName={state.nm_full_name}
            formSlug={form.slug}
          />
        )}
      </div>
    );
  }


  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-5 md:p-6 space-y-5"
    >
      <div className="flex items-start gap-2 rounded-lg border border-gold/30 bg-charcoal/40 p-3 text-xs text-foreground/80">
        <Sparkles className="h-4 w-4 text-gold mt-0.5 shrink-0" aria-hidden />
        <span>
          <span className="text-gold font-semibold">No account required to begin.</span>{" "}
          Complete the form below — you&apos;ll be offered a free account at submission to
          track this nomination. Your draft auto-saves on this device.
        </span>
      </div>


      <div className="flex items-start gap-2 text-xs text-foreground/70">
        <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" />
        <span>
          This is the official native intake form for{" "}
          <span className="text-gold">{form.name}</span>. Submissions are
          evidence-checked by the NRC before review.
        </span>
      </div>

      {errorMsg && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Nomination could not be submitted</p>
            <p className="text-destructive/90">{errorMsg}</p>
          </div>
        </div>
      )}

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
              {isIconFamily ? (
                ICON_NOMINEE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="program">Program / Project</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          {isIconFamily && (
            <p className="text-[11px] text-foreground/60 leading-relaxed">
              {ICON_NOMINEE_TYPES.find((t) => t.value === state.nominee_type)?.description}
            </p>
          )}
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
