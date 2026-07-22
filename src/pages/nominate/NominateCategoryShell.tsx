import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ShieldCheck, Sparkles, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getFormByTierAndCategory,
  getTierMeta,
  CLASSIFICATIONS,
  type TierSlug,
  type NominationFormMeta,
} from "@/config/nominate2026/forms";
import { getEDIMatrix } from "@/config/nominate2026/ediMatrix";

interface Props {
  /** For Tier 1 & 2 the tier slug is also the category slug. */
  fixedTier?: TierSlug;
  fixedCategory?: string;
}

/**
 * Phase 1 shared shell for all 18 nomination forms.
 * Wizard body is a stub — full 9-step wizard lands in Phase 2.
 */
export default function NominateCategoryShell({ fixedTier, fixedCategory }: Props) {
  const params = useParams();
  const tier = (fixedTier ?? (params.tier as TierSlug)) as TierSlug;
  const category = fixedCategory ?? params.category ?? "";

  const form = getFormByTierAndCategory(tier, category);
  const tierMeta = getTierMeta(tier);

  if (!form || !tierMeta) {
    return <Navigate to="/nominate" replace />;
  }

  return (
    <div className="min-h-screen bg-charcoal text-foreground">
      <Helmet>
        <title>{form.title} — Nominate | NESA-Africa 2026</title>
        <meta name="description" content={form.purpose} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="border-b border-gold/15 bg-black/40">
        <div className="container mx-auto flex items-center gap-2 px-4 py-3 text-xs text-foreground/70">
          <Link to="/nominate" className="inline-flex items-center gap-1 text-gold hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Nomination hub
          </Link>
          <span>/</span>
          <span>Tier {tierMeta.order} — {tierMeta.name}</span>
          <span>/</span>
          <span className="text-foreground/90">{form.title}</span>
        </div>
      </div>

      {/* Category hero */}
      <section className="border-b border-gold/15 bg-gradient-to-b from-black/60 to-charcoal">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-gold/40 text-gold">
              Tier {tierMeta.order}
            </Badge>
            {form.judged ? (
              <Badge className="bg-gold text-charcoal">Judged</Badge>
            ) : (
              <Badge variant="secondary">NRC-verified</Badge>
            )}
            {form.regionScope === "africa" && (
              <Badge variant="outline">Africa Regional</Badge>
            )}
            {form.regionScope === "nigeria" && (
              <Badge variant="outline">Nigeria</Badge>
            )}
          </div>
          <h1 className="font-playfair text-3xl leading-tight text-gold sm:text-4xl">
            {form.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-foreground/80">
            {form.purpose}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <a href="#form">
                Start nomination
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to="/nominees">Explore existing nominees</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Two-column: form (stub) + EDI matrix */}
      <section id="form" className="border-b border-gold/10 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* Form wizard stub */}
            <div>
              <Card className="border-gold/25 bg-charcoal-light/40">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl text-gold">
                    Nomination form
                  </CardTitle>
                  <CardDescription>
                    {form.selectorLabel} • Classifications: African in Africa,
                    Diaspora African, Friend of Africa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Classification pre-view */}
                  <div>
                    <div className="mb-2 text-sm font-semibold text-foreground/85">
                      How is the nominee classified?
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {CLASSIFICATIONS.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-lg border border-gold/20 bg-black/30 p-3 text-xs"
                        >
                          <div className="mb-1 font-semibold text-gold">{c.label}</div>
                          <p className="text-foreground/70">{c.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wizard steps preview */}
                  <div>
                    <div className="mb-2 text-sm font-semibold text-foreground/85">
                      What you'll complete
                    </div>
                    <ol className="space-y-2 text-sm text-foreground/75">
                      <WizardStep n={1} label="Tier & category (preselected)" />
                      <WizardStep n={2} label={`Pathway / subcategory — ${form.selectorLabel}`} />
                      <WizardStep n={3} label="Classification & geography" />
                      <WizardStep n={4} label="Nominee details" />
                      <WizardStep n={5} label="Education impact" />
                      <WizardStep n={6} label="EDI Matrix alignment" />
                      <WizardStep n={7} label="Evidence (2+ independent sources)" />
                      <WizardStep n={8} label="Nominator details" />
                      <WizardStep n={9} label="Declaration & submission" />
                    </ol>
                  </div>

                  {/* Phase 1 stub CTA */}
                  <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gold">
                      <Info className="h-4 w-4" />
                      Form opening shortly
                    </div>
                    <p className="text-xs text-foreground/75">
                      The dedicated wizard for this category is being finalised
                      by the NESA-Africa data team. In the meantime, you can
                      begin your draft on the general nomination workspace —
                      your responses will migrate automatically when this
                      dedicated form opens.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        asChild
                        size="sm"
                        className="bg-gold text-charcoal hover:bg-gold/90"
                      >
                        <Link to={`/nominate/advanced?tier=${form.tier}&category=${form.category}`}>
                          Begin draft
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-gold/40 text-gold hover:bg-gold/10"
                      >
                        <Link to="/nominate">Back to hub</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-lg border border-gold/15 bg-black/30 p-3 text-xs text-foreground/70">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    No account required to begin. You'll create or confirm
                    your free account at submission.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* EDI matrix + verification route */}
            <div className="space-y-6">
              <Card className="border-gold/25 bg-charcoal-light/30">
                <CardHeader>
                  <CardTitle className="text-lg text-gold">
                    Category EDI Matrix
                  </CardTitle>
                  <CardDescription>
                    Ten evidence-driven indicators used to assess this
                    category. Category-specific weighting is applied by the
                    NRC.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {EDI_MATRIX_GENERIC.map((i, idx) => (
                    <div
                      key={i.id}
                      className="rounded-md border border-gold/15 bg-black/30 p-2.5"
                    >
                      <div className="text-xs font-semibold text-gold">
                        <span className="mr-1 font-mono text-foreground/60">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {i.label}
                      </div>
                      <p className="text-[11px] leading-relaxed text-foreground/70">
                        {i.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-gold/25 bg-charcoal-light/30">
                <CardHeader>
                  <CardTitle className="text-lg text-gold">
                    Recognition journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-xs text-foreground/80">
                    {tierMeta.verificationRoute.map((step, i) => (
                      <li key={step} className="flex gap-2">
                        <span className="font-mono text-gold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <div className="flex gap-3 rounded-lg border border-gold/20 bg-black/30 p-3 text-xs text-foreground/75">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  Recognition is based on verified educational impact — not
                  popularity, sponsorship, donations, follower count or
                  public voting.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WizardStep({ n, label }: { n: number; label: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/40 text-[10px] font-mono text-gold">
        {n}
      </span>
      <span>{label}</span>
    </li>
  );
}
