import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, ShieldCheck, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getInfluencerSubcategory,
  INFLUENCER_SUBCATEGORY_ORDER,
  INFLUENCER_SUBCATEGORIES,
  type InfluencerSubcategoryContent,
} from "@/config/influencer/subcategoryContent";
import { InfluencerNominationForm } from "@/components/awards/InfluencerNominationForm";
import { getStoryHeroImage } from "@/config/awards/subpageHeroImages";

const CANONICAL_ORIGIN = "https://nesaafrica.lovable.app";
const PARENT_TIER_HREF = "/awards/influencer-education-impact";

function subcategoryPath(slug: string) {
  return `/nominees/influencer-education-impact/${slug}`;
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="scroll-mt-28 py-8 border-b border-gold/10 last:border-b-0"
    >
      <h2
        id={`${id}-h`}
        className="font-display text-xl md:text-2xl font-bold text-gold mb-4"
      >
        {title}
      </h2>
      <div className="text-white/80 text-sm md:text-base leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

const JUMP_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "who", label: "Who" },
  { id: "geography", label: "Geography" },
  { id: "eligibility", label: "Eligibility" },
  { id: "evidence", label: "Evidence" },
  { id: "impact-questions", label: "Impact" },
  { id: "directory", label: "Directory" },
  { id: "nomination-form", label: "Nominate" },
  { id: "review", label: "Review" },
  { id: "integrity", label: "Integrity" },
  { id: "faqs", label: "FAQs" },
];

interface Props {
  slugOverride?: string;
}

export default function InfluencerSubcategoryPage({ slugOverride }: Props) {
  const params = useParams<{ sub: string }>();
  const slug = slugOverride ?? params.sub;
  const content: InfluencerSubcategoryContent | undefined =
    getInfluencerSubcategory(slug);

  if (!content) {
    return <Navigate to={PARENT_TIER_HREF} replace />;
  }

  const canonicalUrl = `${CANONICAL_ORIGIN}${subcategoryPath(content.slug)}`;
  const siblings = INFLUENCER_SUBCATEGORY_ORDER.filter((s) => s !== content.slug).map(
    (s) => INFLUENCER_SUBCATEGORIES[s],
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: CANONICAL_ORIGIN + "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Recognition 2026",
        item: CANONICAL_ORIGIN + "/recognition",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Influencer Education Impact",
        item: CANONICAL_ORIGIN + PARENT_TIER_HREF,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: content.breadcrumbLeaf,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <Helmet>
        <title>{content.seoTitle}</title>
        <meta name="description" content={content.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={content.seoTitle} />
        <meta property="og:description" content={content.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Helmet>

      {/* Tier context ribbon */}
      <div className="border-b border-gold/15 bg-gradient-to-r from-charcoal via-black/60 to-charcoal">
        <div className="container mx-auto px-4 py-3 max-w-6xl flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <Link
            to={PARENT_TIER_HREF}
            className="inline-flex items-center gap-1 text-gold hover:text-gold-light font-semibold"
          >
            <ChevronRight className="h-3 w-3 rotate-180" />
            Back to Influencer Education Impact
          </Link>
          <span className="text-white/40">·</span>
          <span className="text-white/60">
            Tier 2 · Verified Education Influence
          </span>
          <span className="text-white/40 hidden sm:inline">·</span>
          <span className="text-white/60 hidden sm:inline">
            2026 Decision: NRC impact verification and governance approval
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-white/60 mb-6 flex flex-wrap items-center gap-1"
        >
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/recognition" className="hover:text-gold">Recognition 2026</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={PARENT_TIER_HREF} className="hover:text-gold">
            Influencer Education Impact
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gold">{content.breadcrumbLeaf}</span>
        </nav>

        {/* Hero */}
        <header className="mb-8 relative overflow-hidden rounded-2xl border border-gold/20">
          {(() => {
            const heroImg = getStoryHeroImage(content.slug);
            return heroImg ? (
              <>
                <img
                  src={heroImg}
                  alt={`${content.title} — Enablers of Education for All Across Africa`}
                  loading="eager"
                  width={1600}
                  height={900}
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/85 to-charcoal"
                />
              </>
            ) : null;
          })()}
          <div className="relative p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80 font-semibold mb-2">
            {content.tierLabel}
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            {content.title}
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-3xl italic mb-4">
            {content.supportingStatement}
          </p>
          <div className="max-w-3xl space-y-3 text-white/75 text-sm md:text-base">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {content.quickInfo.map((q) => (
              <div
                key={q.label}
                className="rounded-lg border border-gold/20 bg-white/5 p-3"
              >
                <dt className="text-white/50 uppercase tracking-wide">{q.label}</dt>
                <dd className="text-gold font-semibold mt-1">{q.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gold text-charcoal hover:bg-gold-dark font-semibold"
            >
              <a href="#nomination-form">{content.nominateCta}</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to="/awards/influencer-education-impact/nominees">
                Explore Existing Nominees
              </Link>
            </Button>
          </div>
          </div>
        </header>

        {/* Sticky jump nav */}
        <nav
          aria-label="On this page"
          className="sticky top-0 z-10 -mx-4 md:mx-0 mb-6 border-y border-gold/15 bg-charcoal/90 backdrop-blur"
        >
          <ul className="flex overflow-x-auto no-scrollbar gap-1 px-4 md:px-2 py-2 text-[11px] md:text-xs">
            {JUMP_LINKS.map((j) => (
              <li key={j.id} className="shrink-0">
                <a
                  href={`#${j.id}`}
                  className="inline-block rounded-md px-2.5 py-1 text-white/70 hover:text-gold hover:bg-white/5"
                >
                  {j.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Section id="overview" title="What This Recognition Celebrates">
          <p>This recognition celebrates work that helps to:</p>
          <BulletList items={content.celebrates} />
        </Section>

        <Section id="who" title="Who May Be Nominated">
          <BulletList items={content.whoMayBeNominated} />
          {content.whoMayBeNominatedNote && (
            <p className="text-white/70 text-sm italic">
              {content.whoMayBeNominatedNote}
            </p>
          )}
        </Section>

        <Section id="geography" title="Geographic Classifications">
          <p>The nomination form collects one of the following:</p>
          <BulletList items={content.geographyClassifications} />
          <p className="pt-2">Additional geographic fields:</p>
          <BulletList items={content.geographyExtras} />
        </Section>

        <Section id="eligibility" title="Minimum Eligibility Requirements">
          <p>The nominee must:</p>
          <BulletList items={content.eligibility} />
          {content.eligibilityFootnote && (
            <p className="text-white/70 text-sm italic">
              {content.eligibilityFootnote}
            </p>
          )}
        </Section>

        <Section id="evidence" title="Evidence of Education Impact">
          <p>Strong nominations should show evidence such as:</p>
          <BulletList items={content.evidence} />
        </Section>

        <Section id="impact-questions" title="Impact Questions the Form Will Ask">
          <ol className="list-decimal pl-5 space-y-1">
            {content.impactQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </Section>

        <Section id="directory" title={content.directoryHeading}>
          <p>{content.directoryIntro}</p>
          <div className="grid gap-4 md:grid-cols-2 pt-2">
            <div className="rounded-lg border border-gold/15 bg-white/5 p-4">
              <div className="text-gold font-semibold text-sm mb-2">
                Directory filters
              </div>
              <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                {content.directoryFilters.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-gold/15 bg-white/5 p-4">
              <div className="text-gold font-semibold text-sm mb-2">
                Each nominee card displays
              </div>
              <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                {content.directoryCardShows.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-white/60 text-xs italic pt-2">
            {content.directoryExcludes}
          </p>
          <div className="pt-4">
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to="/awards/influencer-education-impact/nominees">
                <Users className="h-4 w-4 mr-2" />
                Open Nominees Directory
              </Link>
            </Button>
          </div>
        </Section>

        <Section id="nomination-form" title={content.formTitle}>
          <div className="rounded-lg border border-gold/20 bg-white/5 p-4 mb-6">
            <div className="text-gold font-semibold text-sm mb-2">
              Form sections
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-white/70 text-sm md:grid md:grid-cols-2 md:gap-x-6">
              {content.formSections.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-gold font-semibold text-xs uppercase tracking-wide mb-1">
                  Key nominee fields collected
                </div>
                <p className="text-white/70 text-sm">
                  {content.keyNomineeFields.join(" · ")}
                </p>
              </div>
              <div>
                <div className="text-gold font-semibold text-xs uppercase tracking-wide mb-1">
                  Submission
                </div>
                <p className="text-white/70 text-sm">{content.submitCta}</p>
              </div>
            </div>
          </div>

          <InfluencerNominationForm />
        </Section>

        <Section id="review" title="Review Process">
          <ol className="list-decimal pl-5 space-y-1">
            {content.reviewSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </Section>

        <Section id="integrity" title="Integrity Notice">
          <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 flex gap-3">
            <ShieldCheck className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
            <div className="text-white/80 text-sm space-y-2">
              <p>{content.integrityNotice}</p>
              <div className="grid gap-2 sm:grid-cols-2 pt-1">
                <p>
                  <span className="text-gold font-semibold">Review method:</span>{" "}
                  NRC impact verification and governance approval
                </p>
                <p>
                  <span className="text-gold font-semibold">Public voting:</span>{" "}
                  Not applicable in 2026
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="faqs" title="Frequently Asked Questions">
          <dl className="space-y-3">
            {content.faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-lg border border-gold/15 bg-white/5 p-3"
              >
                <dt className="text-gold font-semibold text-sm">{f.q}</dt>
                <dd className="text-white/70 text-sm mt-1">{f.a}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Shared cross-nav */}
        <Section
          id="sibling-subcategories"
          title="Explore Other Influencer Education Impact Subcategories"
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link
                  to={subcategoryPath(s.slug)}
                  className="group flex items-start justify-between gap-3 rounded-lg border border-gold/15 bg-white/5 hover:bg-white/10 hover:border-gold/40 p-3 transition"
                >
                  <span>
                    <span className="block text-gold font-semibold text-sm group-hover:text-gold-light">
                      {s.title}
                    </span>
                    <span className="block text-white/60 text-xs mt-1 line-clamp-2">
                      {s.supportingStatement}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-gold shrink-0 mt-1 group-hover:translate-x-0.5 transition" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        {/* Final CTA */}
        <Section id="final-cta" title={content.finalCta.heading}>
          <p>{content.finalCta.body}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark">
              <a href="#nomination-form">Nominate Now</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              <Link to="/awards/influencer-education-impact/nominees">
                Explore Existing Nominees
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-white/80 hover:text-gold"
            >
              <Link to={PARENT_TIER_HREF}>
                Return to Influencer Education Impact
              </Link>
            </Button>
          </div>
        </Section>
      </div>
    </div>
  );
}
