import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  Ban,
  FileCheck,
  Download,
  Bird,
  Users,
  MapPin,
  Layers,
  Gavel,
  CheckCircle2,
  FileText,
} from "lucide-react";
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
import IconNominationFormPage from "@/pages/nominate/IconNominationFormPage";


interface Props {
  fixedTier?: TierSlug;
  fixedCategory?: string;
}

const NOMINEE_TYPE_LABEL: Record<string, string> = {
  individual: "Individuals",
  organisation: "Organisations",
  institution: "Institutions",
  programme: "Programmes and initiatives",
  government: "Government bodies and agencies",
  "public-figure": "Public figures",
};

const REGION_SCOPE_LABEL: Record<string, string> = {
  africa: "8 African regions + the African Diaspora",
  nigeria: "6 Nigerian geopolitical zones and their states",
};

/**
 * Shared shell for the dedicated category nomination pages.
 * Locked 7-section institutional architecture:
 *   1. Hero
 *   2. Overview — About this recognition
 *   3. Recognition pathways, eligibility & who can nominate
 *   4. Education Development Index (EDI) Matrix
 *   5. Evidence requirements & verification journey
 *   6. Nomination form
 *   7. Existing nominees + integrity close
 */
export default function NominateCategoryShell({ fixedTier, fixedCategory }: Props) {
  const params = useParams();
  const tier = (fixedTier ?? (params.tier as TierSlug)) as TierSlug;
  const category = fixedCategory ?? params.category ?? "";

  const form = getFormByTierAndCategory(tier, category);
  const tierMeta = getTierMeta(tier);
  const content = getCategoryContent(category);

  // The Africa Education Icon form is the dedicated 9-step wizard rather than
  // the shared category skeleton — it follows the same deferred-account flow.
  if (category === "africa-education-icon") {
    return <IconNominationFormPage />;
  }

  if (!form || !tierMeta || !content) {
    return <Navigate to="/nominate" replace />;
  }


  const matrix = getEDIMatrix(tier, category);
  const governance = GOVERNANCE_COPY[content.governance];
  const judged = form.judged || tierMeta.competitive;
  const pathwayLabel =
    content.tier === "influencer-education-impact"
      ? "Recognition pathways"
      : "Certificate categories";

  return (
    <div className="min-h-screen bg-charcoal text-foreground">
      <Helmet>
        <title>{`${content.hero.h1} — Nominate | NESA-Africa 2026`}</title>
        <meta name="description" content={content.hero.description} />
      </Helmet>

      {/* ─── 1. Hero ─────────────────────────────────────────────────── */}
      <section className="border-b border-gold/15 bg-gradient-to-b from-black/70 to-charcoal">
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-gold/40 text-gold">
              <BadgeCheck className="mr-1 h-3 w-3" />
              {tierMeta.name}
            </Badge>
            <Badge variant="secondary">
              {judged ? "Judged tier" : "NRC-verified"}
            </Badge>
            <Badge variant="outline" className="border-gold/30 text-foreground/70">
              {judged ? "Competitive" : "Non-competitive"}
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
              <a href="#edi-matrix">Review the EDI Matrix</a>
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

      {/* ─── 2. Overview ─────────────────────────────────────────────── */}
      <section id="overview" className="border-b border-gold/10 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            index={1}
            title="About this recognition"
            subtitle={tierMeta.tagline}
          />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4 text-foreground/80">
              {content.about.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <p className="text-sm text-foreground/70">{governance}</p>
            </div>
            <div className="space-y-3">
              <PillarCard
                icon={<BadgeCheck className="h-5 w-5" />}
                title="NRC-Verified"
                body="Every nomination is independently reviewed by the Nominee Research Corps against category-specific EDI indicators."
              />
              <PillarCard
                icon={judged ? <Gavel className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
                title={judged ? "Independently judged" : "Non-competitive"}
                body={
                  judged
                    ? "Verified dossiers advance to 27 independent judges and the Grand Jury before Governance ratification."
                    : "No judges, no public voting, no ranking. Multiple nominees may be recognised."
                }
              />
              <PillarCard
                icon={<FileCheck className="h-5 w-5" />}
                title={judged ? "Laureate citation" : "Certificate on approval"}
                body={
                  judged
                    ? "Laureates receive a formal citation following Governance ratification of the jury outcome."
                    : "Certificate of Recognition released immediately on Governance approval — no endorsement threshold."
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Pathways, eligibility & who can nominate ─────────────── */}
      <section id="eligibility" className="border-b border-gold/10 bg-black/30 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            index={2}
            title={`${pathwayLabel} & eligibility`}
            subtitle="The recognition areas available within this nomination, and who may be put forward."
          />

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

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <FactCard
              icon={<Users className="h-4 w-4" />}
              label="Who can be nominated"
              value={NOMINEE_TYPE_LABEL[form.nomineeType] ?? "Verified enablers of education"}
              note={form.purpose}
            />
            <FactCard
              icon={<MapPin className="h-4 w-4" />}
              label="Geographic scope"
              value={
                form.regionScope
                  ? REGION_SCOPE_LABEL[form.regionScope]
                  : "Africa, the Diaspora and Friends of Africa"
              }
              note="Classification is confirmed by the Nominee Research Corps during verification."
            />
            <FactCard
              icon={<Layers className="h-4 w-4" />}
              label="Who can nominate"
              value="Anyone — self-nomination is permitted"
              note="Free to submit. No account is required to begin; you confirm a free account at submission."
            />
          </div>
        </div>
      </section>

      {/* ─── 4. EDI Matrix ───────────────────────────────────────────── */}
      <section id="edi-matrix" className="border-b border-gold/10 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            index={3}
            title="Education Development Index Matrix"
            subtitle="The category-specific indicators used by the Nominee Research Corps to assess every nomination in this category."
          />
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

      {/* ─── 5. Evidence & verification journey ──────────────────────── */}
      <section id="evidence" className="border-b border-gold/10 bg-black/30 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading
            index={4}
            title="Evidence requirements & verification journey"
            subtitle="What to attach, and every stage a nomination passes through before recognition."
          />
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-xl border border-gold/20 bg-[#15181f] p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold">
                <FileText className="h-4 w-4" /> Required evidence
              </div>
              <ul className="space-y-2.5 text-sm text-foreground/80">
                {[
                  "A clear impact statement describing what the nominee changed, for whom, and over what period.",
                  "At least two verifiable public sources — reports, press coverage, official records or programme documentation.",
                  "Beneficiary or reach data where available (learners, schools, communities, years active).",
                  "Institutional confirmation: website, registration number or an official contact for organisations and institutions.",
                  "Any endorsements, partnership letters or third-party citations that corroborate the claim.",
                ].map((e) => (
                  <li key={e} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-md border border-gold/15 bg-black/30 p-3 text-xs text-foreground/70">
                Cure window: where evidence is incomplete, the Nominee Research Corps issues a
                request for clarification before any nomination is closed.
              </p>
            </div>

            <div className="rounded-xl border border-gold/20 bg-[#15181f] p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold">
                <ShieldCheck className="h-4 w-4" /> Verification journey
              </div>
              <ol className="space-y-3">
                {tierMeta.verificationRoute.map((step, idx) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 font-mono text-[11px] text-gold">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-foreground/80">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Nomination form ──────────────────────────────────────── */}
      <section id="nominate" className="border-b border-gold/10 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <SectionHeading
            index={5}
            title="Nomination form"
            subtitle="No account required to begin. You'll confirm your free account at submission."
          />
          <Card className="border-gold/25 bg-[#15181f]">
            <CardContent className="p-5 md:p-8">
              <CategoryNominationForm content={content} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── 7. Existing nominees + integrity close ──────────────────── */}
      <section id="nominees" className="bg-black/30 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <SectionHeading
            index={6}
            title="Existing nominees"
            subtitle="Verified nominees in this category, once accepted by the Nominee Research Corps."
          />
          <div className="rounded-2xl border border-gold/25 bg-[#15181f] p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold">
              <Bird className="h-6 w-6" />
            </div>
            <h3 className="font-playfair text-xl text-gold">No Verified Nominees Yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-foreground/70">
              This category is newly open for nominations. Once nominees are accepted and verified
              by the Nominee Research Corps, their profiles will appear here.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                <a href="#nominate">Submit the first nomination</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10"
              >
                <Link to="/nominees">Browse the full directory</Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-lg border border-gold/20 bg-[#15181f] p-4 text-sm text-foreground/80">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span>{content.footerIntegrity}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  index,
  title,
  subtitle,
}: {
  index: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-gold/60">
        Section {String(index + 1).padStart(2, "0")}
      </div>
      <h2 className="font-playfair text-2xl text-gold sm:text-3xl">{title}</h2>
      {subtitle && (
        <p className="mt-2 max-w-3xl text-sm text-foreground/70">{subtitle}</p>
      )}
    </div>
  );
}

function FactCard({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-gold/20 bg-[#15181f] p-4">
      <div className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-wide text-gold/80">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-foreground/90">{value}</div>
      {note && <p className="mt-1.5 text-xs text-foreground/65">{note}</p>}
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
