import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  FileText,
  Vote,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { StageGate } from "@/components/StageGate";
import { getCategoryFormBySlug } from "@/config/nomination/awardCategoryForms";
import type {
  AwardCategoryForm,
  NominationSubcategory,
} from "@/config/nomination/types";
import { trackEvent } from "@/lib/analytics";

interface Props {
  /** Award category form slug (matches AwardCategoryForm.slug). */
  formSlug: string;
  /** Optional explicit category title for the header. */
  categoryTitle?: string;
}

/**
 * Reusable per-category panel that lists every subcategory in an accordion.
 * Each subcategory exposes:
 *  - A dedicated "Nominate" button deep-linking to the guided nomination flow
 *  - For Gold-Blue Garnet families: an inline voting CTA gated by StageGate
 *    (public_voting). When closed, the panel surfaces the "Opens on…" state.
 *
 * For Africa-Regional categories with `regions[]`, the panel renders a region
 * tab strip so each region's subcategories and forms are isolated.
 */
export function CategorySubcategoriesPanel({ formSlug, categoryTitle }: Props) {
  const form = getCategoryFormBySlug(formSlug);

  if (!form) {
    return null;
  }

  const isGBG = form.family === "gold-blue-garnet";
  const hasRegions = form.isRegionalCategory && form.regions?.length;

  return (
    <section
      id="subcategories"
      className="py-12 md:py-16 bg-charcoal border-y border-gold/20"
    >
      <div className="container mx-auto max-w-5xl px-4">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs text-gold mb-3">
            <Layers className="h-3.5 w-3.5" />
            Subcategories
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-gold mb-2 leading-tight">
            {categoryTitle ?? form.name} — Subcategories
          </h2>
          <p className="text-foreground/75 text-sm sm:text-base max-w-3xl">
            Expand any subcategory below to nominate directly{isGBG ? " or cast your vote when public voting is live." : "."}
            {" "}All submissions are reviewed by the NRC before reaching the jury.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="border-gold/40 text-gold">
              {hasRegions
                ? `${form.regions!.length} regions`
                : `${form.subcategories.length} subcategories`}
            </Badge>
            {isGBG && (
              <Badge variant="outline" className="border-gold/40 text-gold">
                <Vote className="mr-1 h-3 w-3" /> Public voting enabled
              </Badge>
            )}
          </div>
        </header>

        {hasRegions ? (
          <RegionTabs form={form} isGBG={isGBG} />
        ) : (
          <SubcategoryAccordion
            categorySlug={form.slug}
            subcategories={form.subcategories}
            isGBG={isGBG}
          />
        )}
      </div>
    </section>
  );
}

function RegionTabs({
  form,
  isGBG,
}: {
  form: AwardCategoryForm;
  isGBG: boolean;
}) {
  const regions = form.regions!;
  const [active, setActive] = useState(regions[0].slug);

  return (
    <Tabs value={active} onValueChange={setActive}>
      <TabsList className="mb-6 flex flex-wrap h-auto bg-charcoal-light/40 border border-gold/20">
        {regions.map((r) => (
          <TabsTrigger
            key={r.slug}
            value={r.slug}
            className="data-[state=active]:bg-gold data-[state=active]:text-charcoal"
          >
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            {r.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {regions.map((r) => (
        <TabsContent key={r.slug} value={r.slug} className="mt-0">
          <SubcategoryAccordion
            categorySlug={r.slug}
            subcategories={r.subcategories}
            isGBG={isGBG}
            regionLabel={r.name}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function SubcategoryAccordion({
  categorySlug,
  subcategories,
  isGBG,
  regionLabel,
}: {
  categorySlug: string;
  subcategories: NominationSubcategory[];
  isGBG: boolean;
  regionLabel?: string;
}) {
  const items = useMemo(
    () => subcategories.filter((s) => s && s.slug),
    [subcategories],
  );

  if (items.length === 0) {
    return (
      <p className="text-sm text-foreground/60 italic">
        Subcategories will be published soon.
      </p>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-3">
      {items.map((sub) => {
        const nominateHref = `/nominate?category=${encodeURIComponent(categorySlug)}&subcategory=${encodeURIComponent(sub.slug)}`;
        const voteHref = `/vote/blue-garnet?category=${encodeURIComponent(categorySlug)}&subcategory=${encodeURIComponent(sub.slug)}`;

        return (
          <AccordionItem
            key={sub.slug}
            value={sub.slug}
            className="rounded-xl border border-gold/25 bg-charcoal-light/30 px-4 data-[state=open]:border-gold/60"
          >
            <AccordionTrigger
              className="text-left hover:no-underline"
              onClick={() =>
                trackEvent("category_subcategory_open", {
                  category: categorySlug,
                  subcategory: sub.slug,
                  region: regionLabel,
                })
              }
            >
              <div className="flex items-start gap-3 pr-3">
                <CheckCircle2 className="h-4 w-4 text-gold mt-1 shrink-0" />
                <div>
                  <div className="text-sm sm:text-base font-semibold text-foreground/95">
                    {sub.name}
                  </div>
                  {regionLabel && (
                    <div className="text-[11px] text-foreground/55 mt-0.5">
                      {regionLabel}
                    </div>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4 pt-2 pb-3">
                <p className="text-sm text-foreground/75 leading-relaxed">
                  Nominate an Education Enabler that exemplifies excellence in{" "}
                  <span className="text-gold">{sub.name}</span>. NRC reviewers
                  verify every submission before it reaches the independent jury.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-gold/20 bg-charcoal/40 p-4">
                    <div className="flex items-center gap-2 text-gold mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        Nominate
                      </span>
                    </div>
                    <p className="text-xs text-foreground/65 mb-3">
                      Open the official nomination form pre-filled with this
                      subcategory.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-gold text-charcoal hover:bg-gold/90"
                      onClick={() =>
                        trackEvent("category_subcategory_nominate_click", {
                          category: categorySlug,
                          subcategory: sub.slug,
                        })
                      }
                    >
                      <Link to={nominateHref}>
                        Submit Nomination
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {isGBG && (
                    <div className="rounded-lg border border-gold/20 bg-charcoal/40 p-4">
                      <div className="flex items-center gap-2 text-gold mb-2">
                        <Vote className="h-4 w-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          Public voting
                        </span>
                      </div>
                      <StageGate
                        action="public_voting"
                        fallback={
                          <div className="flex flex-col gap-2">
                            <p className="text-xs text-foreground/65">
                              Voting opens after the jury shortlist is
                              published. Check the timeline for live dates.
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="w-full border-gold/30 text-foreground/50"
                            >
                              <Lock className="mr-1 h-3.5 w-3.5" />
                              Voting Closed
                            </Button>
                          </div>
                        }
                      >
                        <p className="text-xs text-foreground/65 mb-3">
                          Cast your weighted public vote — counts towards the
                          Blue Garnet final score.
                        </p>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="w-full border-gold/50 text-gold hover:bg-gold/10"
                          onClick={() =>
                            trackEvent("category_subcategory_vote_click", {
                              category: categorySlug,
                              subcategory: sub.slug,
                            })
                          }
                        >
                          <Link to={voteHref}>
                            Vote in this Subcategory
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </StageGate>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-gold hover:bg-gold/10"
                  >
                    <Link
                      to={`/nominees?subcategory=${encodeURIComponent(sub.slug)}`}
                    >
                      View nominees in this subcategory
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default CategorySubcategoriesPanel;
