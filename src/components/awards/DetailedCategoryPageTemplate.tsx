/**
 * DetailedCategoryPageTemplate — single reusable layout for all 9 Blue Garnet
 * and 7 Platinum detailed category/pathway pages. Content is provided from
 * src/content/contentBible2026/pathwayPages.ts. Mobile-first.
 */
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Award, ShieldCheck, Users, Sparkles, ChevronRight,
  CheckCircle2, FileText, HelpCircle, Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import {
  BENEFITS, EDI_MATRIX, EVIDENCE_CHECKLIST, GALA_NOTE, POLICY_2026_NOTE,
  RECOGNITION_PACKAGE, THRESHOLDS, TIMELINE_STAGES, TRUST_LINKS,
  type DetailedAwardCategoryPage,
} from "@/content/contentBible2026/pathwayPages";
import type { BrandedCategoryTheme } from "./BrandedCategoryHero";

type Props = { page: DetailedAwardCategoryPage; theme?: BrandedCategoryTheme };

const tierAccent = (tier: DetailedAwardCategoryPage["awardTier"]) =>
  tier === "platinum"
    ? { badge: "bg-slate-200 text-slate-900", tag: "text-slate-200", ring: "border-slate-500/40" }
    : { badge: "bg-gold text-charcoal", tag: "text-gold", ring: "border-gold/40" };

export default function DetailedCategoryPageTemplate({ page, theme = "corporate" }: Props) {
  const accent = tierAccent(page.awardTier);
  const bands = THRESHOLDS[page.awardTier];
  const pack = RECOGNITION_PACKAGE[page.awardTier];

  return (
    <>
      <Helmet>
        <title>{page.seo.title}</title>
        <meta name="description" content={page.seo.description} />
        <link rel="canonical" href={page.seo.canonical} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards" },
          { name: page.title, path: page.route },
        ]}
      />

      {/* S1 — Hero */}
      <section className="relative overflow-hidden bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className={accent.badge}>{page.badge}</Badge>
            <Badge variant="outline" className={`border-white/20 ${accent.tag}`}>
              NESA-Africa 2026
            </Badge>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl md:text-5xl leading-tight"
          >
            {page.title}
          </motion.h1>
          <p className="mt-4 max-w-3xl text-base md:text-lg text-white/80">{page.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to={page.primaryCta.href}>
                {page.primaryCta.label} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to={page.secondaryCta.href}>{page.secondaryCta.label}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10">
              <Link to="/awards/18-categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* S2 — Overview */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {page.overview.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-muted-foreground">{p}</p>
            ))}
          </div>
          {page.sdgPills.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {page.sdgPills.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* S3 — Enabler story */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16 text-center">
          <Sparkles className="mx-auto mb-4 h-6 w-6 text-gold" />
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground">
            {page.enablerStory}
          </p>
        </div>
      </section>

      {/* S4 — Who qualifies + EDI + thresholds */}
      <section id="who-qualifies" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">Who Qualifies</h2>
              <ul className="space-y-2">
                {page.eligibleNomineeTypes.map((t) => (
                  <li key={t} className="flex gap-2 text-sm md:text-base">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              {page.scoringEmphasis && (
                <div className="mt-6 rounded-lg border p-4">
                  <div className="text-sm font-medium mb-2">Category-specific emphasis</div>
                  <div className="flex flex-wrap gap-2">
                    {page.scoringEmphasis.map((e) => (
                      <Badge key={e} variant="outline">{e}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">Assessment Framework (EDI)</h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3">EDI Area</th>
                      <th className="text-right p-3">Score</th>
                      <th className="text-left p-3 hidden md:table-cell">What is measured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EDI_MATRIX.map((c) => (
                      <tr key={c.area} className="border-t">
                        <td className="p-3 font-medium">{c.area}</td>
                        <td className="p-3 text-right">{c.score}</td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell">{c.measures}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {bands.map((b) => (
                  <div key={b.range} className="rounded-md border p-3 text-sm">
                    <div className="font-semibold">{b.range}</div>
                    <div className="text-muted-foreground">{b.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Recognition is evidence-based and does not imply commercial endorsement, popularity ranking, or public voting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* S5 — Subcategories */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <h2 className="font-serif text-2xl md:text-3xl">Subcategories</h2>
            <span className="text-sm text-muted-foreground">{page.subcategories.length} recognition pathways</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.subcategories.map((s) => (
              <Card key={s.id} className={`hover:shadow-md transition ${accent.ring}`}>
                <CardHeader>
                  <CardTitle className="text-base">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                  <div className="flex flex-wrap gap-1 text-xs">
                    <Badge variant="outline">{s.nomineeType}</Badge>
                    <Badge variant="outline">{s.scope}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button asChild size="sm" variant="ghost" className="h-8 px-2 text-xs">
                      <Link to={s.exploreHref}>Explore Nominees</Link>
                    </Button>
                    <Button asChild size="sm" className="h-8 px-3 text-xs bg-gold text-charcoal hover:bg-gold/90">
                      <Link to={s.nominateHref}>Nominate Here</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* S6 — Benefits */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Benefits of Participation</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Nominees", items: BENEFITS.nominees, icon: Award },
              { title: "Nominators", items: BENEFITS.nominators, icon: Users },
              { title: "Country or Region", items: BENEFITS.region, icon: Globe2 },
              { title: "Africa", items: BENEFITS.africa, icon: Sparkles },
            ].map((b) => (
              <Card key={b.title}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <b.icon className="h-4 w-4 text-gold" />
                    <CardTitle className="text-base">{b.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {b.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* S7 — Nomination CTA */}
      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16 text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">{page.nominationCta.heading}</h2>
          <p className="text-white/80 mb-6">{page.nominationCta.body}</p>
          <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
            <Link to={page.nominationCta.href}>Nominate Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <p className="mt-4 text-xs text-white/60">
            No account is required to begin. First-time nominators create or confirm an account only at submission.
          </p>
        </div>
      </section>

      {/* S8 — Recognition Timeline */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Recognition Timeline</h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {TIMELINE_STAGES.map((s, i) => (
              <li key={s} className="rounded-md border p-3 text-sm">
                <div className="text-xs text-muted-foreground">Stage {i + 1}</div>
                <div className="font-medium">{s}</div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">{GALA_NOTE}</p>
        </div>
      </section>

      {/* S9 — Existing Nominees */}
      <section id="existing-nominees" className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">Existing Nominees</h2>
          <p className="text-muted-foreground max-w-3xl mb-6">
            Explore organisations, institutions, programmes, and leaders already identified under this
            category. Entries are updated as NRC verification progresses. Grouping:{" "}
            <span className="font-medium">{page.nomineeCatalogue.grouping.replace("_", " ")}</span>.
          </p>
          <BrandedNomineeDirectory
            theme={theme}
            categoryName={page.nomineeCatalogue.categoryTitle}
            title="Live Nominees"
          />
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link to={page.secondaryCta.href}>View All Nominees</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* S10 — Evidence / media submission */}
      <section className="bg-background">
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">
            Help strengthen a nominee's public impact record
          </h2>
          <p className="text-muted-foreground mb-6">
            Nominees and authorised representatives may submit programme photographs, videos, reports,
            agreements, beneficiary information, and independent media references.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Button asChild>
              <a href="mailto:info@nesa.africa?subject=Supporting Evidence Submission">Submit Supporting Evidence</a>
            </Button>
            <Button asChild variant="outline">
              <a href="mailto:info@nesa.africa?subject=Photo or Video Submission">Submit Photo or Video</a>
            </Button>
          </div>
          <details className="rounded-md border p-4 text-sm">
            <summary className="cursor-pointer font-medium">Evidence checklist</summary>
            <ul className="mt-3 space-y-1.5 text-muted-foreground">
              {EVIDENCE_CHECKLIST.map((e) => (
                <li key={e} className="flex gap-2"><FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />{e}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      {/* S11 — Recognition Package */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Recognition Package</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pack.map((p) => (
              <Card key={p}>
                <CardContent className="p-4 flex gap-3">
                  <Award className="h-5 w-5 shrink-0 text-gold" />
                  <span className="text-sm">{p}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Recognition is never purchased.</p>
        </div>
      </section>

      {/* S12 — Trust & Accountability */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl md:text-3xl">Trust and Accountability</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-3xl mb-4">{POLICY_2026_NOTE}</p>
          <div className="flex flex-wrap gap-2">
            {TRUST_LINKS.map((l) => (
              <Button asChild key={l.href} variant="outline" size="sm">
                <Link to={l.href}>{l.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* S13 — Category FAQs */}
      <section className="bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-2xl md:text-3xl">Category FAQs</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {page.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-6 text-sm text-muted-foreground">
            For questions about the overall NESA-Africa recognition structure, nominations, certificates,
            endorsements, and Gala participation, visit the full FAQ.
          </p>
          <Button asChild className="mt-3" variant="outline">
            <Link to="/faqs">View Full FAQ</Link>
          </Button>
        </div>
      </section>

      {/* S14 — Final CTA */}
      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Help Africa recognise those making education possible
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to={page.primaryCta.href}>Nominate in This Category</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to={page.secondaryCta.href}>Explore Existing Nominees</Link>
            </Button>
          </div>
          <Link
            to="/awards/18-categories"
            className="mt-6 inline-block text-sm text-gold underline underline-offset-4"
          >
            View All Award Categories
          </Link>
        </div>
      </section>
    </>
  );
}
