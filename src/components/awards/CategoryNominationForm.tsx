import { Link } from "react-router-dom";
import { Sparkles, FileCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleFormDisplay } from "@/components/nominate/GoogleFormDisplay";
import { NativeCategoryNominationForm } from "@/components/awards/NativeCategoryNominationForm";
import {
  AWARD_CATEGORY_FORMS,
  getCategoryFormBySlug,
} from "@/config/nomination/awardCategoryForms";
import type { AwardCategoryConfig } from "@/config/awardCategories";
import type { AwardCategoryForm } from "@/config/nomination/types";

/**
 * Best-effort resolution of a Google Form for a given award category.
 * Tries (in order):
 *   1. Exact slug match
 *   2. Token overlap against form.slug / form.name
 */
function resolveForm(
  config: AwardCategoryConfig,
): AwardCategoryForm | undefined {
  const direct = getCategoryFormBySlug(config.slug);
  if (direct) return direct;

  const target = `${config.slug} ${config.finalName}`.toLowerCase();
  const targetTokens = new Set(
    target
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 3 && !STOP_WORDS.has(t)),
  );
  if (targetTokens.size === 0) return undefined;

  let best: { form: AwardCategoryForm; score: number } | undefined;
  for (const form of AWARD_CATEGORY_FORMS) {
    const hay = `${form.slug} ${form.name}`.toLowerCase();
    const hayTokens = hay.split(/[^a-z0-9]+/).filter(Boolean);
    let score = 0;
    for (const t of hayTokens) if (targetTokens.has(t)) score += 1;
    if (!best || score > best.score) best = { form, score };
  }
  if (best && best.score >= 2) return best.form;
  return undefined;
}

const STOP_WORDS = new Set([
  "best",
  "award",
  "awards",
  "africa",
  "african",
  "education",
  "for",
  "the",
  "and",
  "nesa",
  "category",
]);

interface Props {
  config: AwardCategoryConfig;
}

export function CategoryNominationForm({ config }: Props) {
  const form = resolveForm(config);
  const nominateHref =
    config.ctaNominateHref ?? `/nominate?category=${encodeURIComponent(config.slug)}`;

  return (
    <section
      id="nominate"
      className="py-12 md:py-16 bg-charcoal border-y border-gold/20"
    >
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold mb-3">
            <FileCheck className="h-3.5 w-3.5" />
            Nomination Form
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-gold mb-2 leading-tight">
            Nominate for {config.finalName}
          </h2>
          <p className="text-foreground/75 text-sm sm:text-base max-w-3xl">
            Complete the official Google Form below. Submissions are reviewed by
            the NRC before reaching the jury. You can also open the form on the
            full nomination page.
          </p>
        </div>

        {form ? (
          <GoogleFormDisplay
            title={form.name}
            status={form.status}
            formPublicUrl={form.formPublicUrl}
            formEmbedUrl={form.formEmbedUrl}
            gmail={form.gmail}
          />
        ) : (
          <div className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-6 text-foreground/85">
            <p className="text-sm mb-4">
              The dedicated nomination form for this category opens on the main
              nomination page. Click below to continue.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gold text-charcoal hover:bg-gold/90"
            >
              <Link to={nominateHref}>
                <Sparkles className="mr-2 h-4 w-4" />
                Start Nomination
              </Link>
            </Button>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            asChild
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold/10"
          >
            <Link to={nominateHref}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open full nomination page
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
