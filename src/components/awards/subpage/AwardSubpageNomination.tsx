// AwardSubpageNomination — the tailored, easily navigated nomination form
// embedded directly on each of the 22 award category pages.
//
// Resolution: category slug → AwardCategoryForm. Active Google Form embeds
// render inline; everything else uses the native intake form (which already
// handles drafts, deferred account creation and NRC routing).

import { Link } from "react-router-dom";
import { CheckCircle2, FileCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleFormDisplay } from "@/components/nominate/GoogleFormDisplay";
import { NativeCategoryNominationForm } from "@/components/awards/NativeCategoryNominationForm";
import { resolveAwardForm } from "@/config/nomination/resolveAwardForm";

export interface AwardNominationConfig {
  /** Category (or pathway) slug used to resolve the tailored form. */
  formSlug: string;
  /** Display name of the category / pathway. */
  name: string;
  /** Award family id for family-scoped form resolution. */
  family?: string;
  /** Preselected subcategory slug when the page is a single pathway. */
  defaultSubcategorySlug?: string;
  /** Fallback link when no tailored form can be resolved. */
  fallbackHref: string;
  /** Where verified nominees for this category are listed. */
  directoryHref: string;
}

const STEPS = [
  "Choose the subcategory or classification",
  "Describe the nominee and their reach",
  "Attach verifiable evidence and citations",
  "Add your details and submit — account created at submission",
];

export function AwardSubpageNomination({ config }: { config: AwardNominationConfig }) {
  const form = resolveAwardForm(config.formSlug, config.name, config.family);

  const googleReady =
    !!form &&
    form.status === "Active" &&
    Boolean(form.formEmbedUrl) &&
    Boolean(form.formPublicUrl);

  return (
    <section id="nominate" className="border-b border-gold/20 bg-black/40 py-12 sm:py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">
          <FileCheck className="h-3.5 w-3.5" />
          Tailored nomination form
        </div>
        <h2 className="mt-3 font-playfair text-2xl text-white sm:text-3xl lg:text-4xl">
          Nominate for {config.name}
        </h2>
        <p className="mt-3 max-w-3xl text-white/75">
          One form, built for this category only. Nomination is free, takes about eight minutes,
          and your progress is saved as you type.
        </p>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className="rounded-xl border border-gold/15 bg-charcoal/70 p-4 text-sm text-white/80"
            >
              <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-gold/10 text-xs font-semibold text-gold">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>

        <div className="mt-8">
          {googleReady && form ? (
            <GoogleFormDisplay
              title={form.name}
              status={form.status}
              formPublicUrl={form.formPublicUrl}
              formEmbedUrl={form.formEmbedUrl}
              gmail={form.gmail}
            />
          ) : form ? (
            <NativeCategoryNominationForm
              form={form}
              defaultSubcategorySlug={config.defaultSubcategorySlug}
              successRedirectHref={config.directoryHref}
              successRedirectLabel="See verified Enablers"
            />
          ) : (
            <div className="rounded-2xl border border-gold/30 bg-charcoal/60 p-6">
              <p className="text-sm text-white/80">
                The dedicated form for this category opens on the main nomination page.
              </p>
              <Button asChild size="lg" className="mt-4 bg-gold text-charcoal hover:bg-gold/90">
                <Link to={config.fallbackHref}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start nomination
                </Link>
              </Button>
            </div>
          )}
        </div>

        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {[
            "Free to submit — no fee at any stage",
            "No account needed to start; created at submission",
            "Every claim verified by the Nominee Research Corps (NRC)",
            "No public voting, sponsorship or popularity influence",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 text-sm text-white/70">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-gold" />
              {t}
            </li>
          ))}
        </ul>

        <p className="mt-6 flex items-start gap-2 text-xs text-white/55">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none text-gold" aria-hidden />
          Enablers of Education for All Across Africa — recognition is evidence-led and ratified by
          the Governance Board.
        </p>
      </div>
    </section>
  );
}
