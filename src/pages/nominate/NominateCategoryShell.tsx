import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, ShieldCheck, BadgeCheck, Ban, FileCheck, Download, Bird } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getFormByTierAndCategory,
  getTierMeta,
  type TierSlug,
} from "@/config/nominate2026/forms";
import { getEDIMatrix } from "@/config/nominate2026/ediMatrix";
import { getCategoryContent, GOVERNANCE_COPY } from "@/config/nominate2026/categoryContent";
import CategoryNominationForm from "@/components/nominate/category/CategoryNominationForm";

interface Props {
  fixedTier?: TierSlug;
  fixedCategory?: string;
}

/**
 * Shared shell for the 17 dedicated category nomination pages.
 * All 17 share this single dark/gold structure — no per-tier hue variation.
 */
export default function NominateCategoryShell({ fixedTier, fixedCategory }: Props) {
  const params = useParams();
  const tier = (fixedTier ?? (params.tier as TierSlug)) as TierSlug;
  const category = fixedCategory ?? params.category ?? "";

  const form = getFormByTierAndCategory(tier, category);
  const tierMeta = getTierMeta(tier);
  const content = getCategoryContent(category);

  if (!form || !tierMeta || !content) {
    return <Navigate to="/nominate" replace />;
  }

  const matrix = getEDIMatrix(tier, category);
  const governance = GOVERNANCE_COPY[content.governance];

  return (
    <div className="min-h-screen bg-charcoal text-foreground">
      <Helmet>
        <title>{content.hero.h1} — Nominate | NESA-Africa 2026</title>
        <meta name="description" content={content.hero.description} />
      </Helmet>

      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section className="border-b border-gold/15 bg-gradient-to-b from-black/70 to-charcoal">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-gold/40 text-gold">
              <BadgeCheck className="mr-1 h-3 w-3" />
              {content.tierLabel}
            </Badge>
            <Badge variant="secondary">NRC-verified</Badge>
            <Badge variant="outline" className="border-gold/30 text-foreground/70">
              Non-competitive
            </Badge>
          </div>
          <h1 className="font-playfair text-3xl leading-tight text-gold sm:text-4xl md:text-5xl">
            {content.hero.h1}
          </h1>
          <p className="mt-3 max-w-3xl font-playfair text-lg italic text-foreground/85">
            {content.hero.tagline}
          </p>
          <p className="mt-4 max-w-3xl text-base text-foreground/75">
            {content.hero.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <a href="#nominate">
                Start Nomination <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <a href="#nominees">Explore Existing Nominees</a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-foreground/80 hover:text-gold"
            >
              <Link to="/nominate">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Categories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── Nomination form ─────────────────────────────────────────── */}
      <section id="nominate" className="border-b border-gold/10 bg-black/40 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-6">
            <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
              Nomination form
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              No account required to begin. You'll confirm your free account at submission.
            </p>
          </div>
          <Card className="border-gold/25 bg-[#15181f]">
            <CardContent className="p-5 md:p-8">
              <CategoryNominationForm content={content} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── About this category ─────────────────────────────────────── */}
      <section className="border-b border-gold/10 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
                About this category
              </h2>
              <div className="mt-4 space-y-4 text-foreground/80">
                {content.about.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <p className="text-sm text-foreground/70">{governance}</p>
              </div>
            </div>
            <div className="space-y-3">
              <PillarCard
                icon={<BadgeCheck className="h-5 w-5" />}
                title="NRC-Verified"
                body="Every nomination is independently reviewed by the Nominee Research Corps against category-specific EDI indicators."
              />
              <PillarCard
                icon={<Ban className="h-5 w-5" />}
                title="Non-competitive"
                body="No judges, no public voting, no ranking. Multiple nominees may be recognised."
              />
              <PillarCard
                icon={<FileCheck className="h-5 w-5" />}
                title="Certificate on approval"
                body="Certificate of Recognition released immediately on Governance approval — no endorsement threshold."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Certificate Categories / Recognition Pathways ────────────── */}
      <section className="border-b border-gold/10 bg-black/30 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6">
            <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
              {content.tier === "influencer-education-impact"
                ? "Recognition pathways"
                : "Certificate categories"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-foreground/70">
              The category-specific recognition areas available within this nomination.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.subcategoryCards.map((c) => (
              <div
                key={c.title}
                className="rounded-lg border border-[#2b3140] bg-[#15181f] p-4"
              >
                <div className="text-sm font-semibold text-gold">{c.title}</div>
                {c.description && (
                  <p className="mt-1.5 text-xs text-foreground/70">{c.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EDI Matrix ──────────────────────────────────────────────── */}
      <section id="edi-matrix" className="border-b border-gold/10 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6">
            <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
              Education Development Index Matrix
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-foreground/70">
              The category-specific indicators used by the Nominee Research Corps to assess every
              nomination in this category.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="grid gap-3 sm:grid-cols-2">
              {matrix.indicators.map((i, idx) => (
                <div
                  key={i.id}
                  className="rounded-lg border border-[#2b3140] bg-[#15181f] p-4"
                >
                  <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-gold">
                    <span className="font-mono text-xs text-foreground/60">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {i.label}
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/70">
                    {i.description}
                  </p>
                </div>
              ))}
            </div>
            <aside className="space-y-4">
              <div className="rounded-lg border border-gold/25 bg-[#15181f] p-4">
                <div className="mb-1.5 text-xs uppercase tracking-wide text-gold/80">
                  Weighting note
                </div>
                <p className="text-sm text-foreground/80">{content.ediWeightingNote}</p>
              </div>
              <Button
                variant="outline"
                className="w-full border-gold/40 text-gold hover:bg-gold/10"
                onClick={() => window.print()}
              >
                <Download className="mr-2 h-4 w-4" />
                Download the {content.hero.h1} EDI Matrix (PDF)
              </Button>
              <p className="text-[11px] text-foreground/60">
                PDF export uses your browser's print-to-PDF. A signed downloadable
                version will be published alongside the 2026 governance pack.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ─── Existing nominees (empty state) ─────────────────────────── */}
      <section id="nominees" className="border-b border-gold/10 bg-black/30 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-6">
            <h2 className="font-playfair text-2xl text-gold sm:text-3xl">
              Existing nominees
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              Verified nominees in this category, once accepted by the Nominee Research Corps.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/25 bg-[#15181f] p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
              <Bird className="h-6 w-6" />
            </div>
            <h3 className="font-playfair text-xl text-gold">No Verified Nominees Yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-foreground/70">
              This category is newly open for nominations. Once nominees are accepted and verified
              by the Nominee Research Corps, their profiles will appear here.
            </p>
            <div className="mt-5">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                <a href="#nominate">Submit the first nomination</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer integrity ────────────────────────────────────────── */}
      <section className="py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-start gap-3 rounded-lg border border-gold/20 bg-[#15181f] p-4 text-sm text-foreground/80">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span>{content.footerIntegrity}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function PillarCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="border-gold/25 bg-[#15181f]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base text-gold">
          <span className="text-gold">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-foreground/75">{body}</p>
      </CardContent>
    </Card>
  );
}
