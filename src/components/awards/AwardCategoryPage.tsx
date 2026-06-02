import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  Gavel,
  ShieldCheck,
  Users,
  Vote,
  FileText,
  Sparkles,
  ChevronRight,
  Target,
  Layers,
  Handshake,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CategoryFaqSection } from "./CategoryFaqSection";
import {
  GROUP_META,
  INTEGRITY_DISCLAIMER,
  SPONSOR_DISCLAIMER,
  getCategoryBySlug,
  type AwardCategoryConfig,
  type CategoryGroup,
} from "@/config/awardCategories";

/** EDX matrix indicators inferred from the category's group. */
const EDX_BY_GROUP: Record<CategoryGroup, string[]> = {
  blue_garnet: ["Education Impact", "Community Impact", "Innovation", "Reach"],
  platinum: ["Education Impact", "Leadership", "Sustainability", "Reach"],
  icon: ["Education Impact", "Leadership", "Sustainability", "Inclusion", "Reach"],
  influencers: ["Education Impact", "Community Impact", "Reach"],
  special_recognition: ["Education Impact", "Reach"],
};

/** Standard 5-step nomination flow surfaced on every category page. */
const NOMINATION_FLOW: Array<{ title: string; description: string }> = [
  {
    title: "Submit nomination",
    description: "Complete the guided form with the nominee's profile, impact summary and evidence.",
  },
  {
    title: "NRC eligibility check",
    description: "The Nominations Review Committee verifies eligibility, evidence and duplicates.",
  },
  {
    title: "Jury shortlist",
    description: "Independent judges review qualified nominees against the EDX Matrix rubric.",
  },
  {
    title: "Public vote (where applicable)",
    description: "Blue Garnet and influencer tracks open for verified public voting.",
  },
  {
    title: "Finalists & recognition",
    description: "Final jury score determines winners; recognition is awarded at the gala.",
  },
];

const SITE = "https://nesaafrica.lovable.app";

interface Props {
  config: AwardCategoryConfig;
  /** Optional rich legacy hero rendered above the structured metadata panel */
  legacyHero?: React.ReactNode;
}

export function AwardCategoryPage({ config, legacyHero }: Props) {
  const group = GROUP_META[config.group];
  const canonical = `${SITE}${config.url}`;
  const nominateHref = config.ctaNominateHref ?? `/nominate?category=${encodeURIComponent(config.slug)}`;

  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: config.finalName,
    description: config.shortDescription,
    url: canonical,
    eventStatus: "https://schema.org/EventScheduled",
    organizer: {
      "@type": "Organization",
      name: "New Education Standard Award Africa (NESA-Africa)",
      url: SITE,
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-charcoal text-foreground">
      <Helmet>
        <title>{config.seoTitle}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={config.seoTitle} />
        <meta property="og:description" content={config.metaDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(eventLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards/categories" },
          { name: group.label, path: group.indexUrl },
          { name: config.finalName, path: config.url },
        ]}
      />

      {legacyHero}

      {/* Structured metadata panel */}
      <section className="border-y border-gold/20 bg-charcoal-light/40 py-10 md:py-16 pb-24 md:pb-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-6 md:mb-10 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-gold/40 text-gold text-xs">
              {group.label}
            </Badge>
            <Badge variant="outline" className="border-foreground/20 text-foreground/70 text-xs">
              {group.tone}
            </Badge>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-gold mb-3 leading-tight">
            {config.finalName}
          </h2>
          <p className="text-foreground/80 text-base sm:text-lg max-w-3xl mb-8 md:mb-10 leading-relaxed">{config.shortDescription}</p>

          <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
            <MetaCard icon={CheckCircle2} title="Eligibility">
              {config.eligibilitySummary}
            </MetaCard>
            <MetaCard icon={Users} title="Who can be nominated">
              {config.whoCanBeNominated}
            </MetaCard>
            <MetaCard icon={Users} title="Who can nominate">
              {config.whoCanNominate}
            </MetaCard>
            <MetaCard icon={Gavel} title="Review & selection">
              {config.reviewMethod}
            </MetaCard>
            <MetaCard icon={Vote} title="Voting role">
              {config.votingRole}
            </MetaCard>
            <MetaCard icon={Award} title="Judging role">
              {config.judgingRole}
            </MetaCard>
          </div>

          <div className="mt-6">
            <Card className="border-gold/20 bg-charcoal-light/60">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 text-gold mb-3">
                  <FileText className="h-5 w-5" />
                  <h3 className="font-semibold">Required evidence</h3>
                </div>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {config.requiredEvidence.map((ev) => (
                    <li key={ev} className="flex items-start gap-2 text-sm text-foreground/80">
                      <ChevronRight className="mt-0.5 h-4 w-4 flex-none text-gold" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Desktop CTAs (mobile uses sticky bar below) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 hidden md:flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to={nominateHref}>
                <Sparkles className="mr-2 h-4 w-4" />
                Nominate in this Category
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to={group.indexUrl}>Back to {group.label}</Link>
            </Button>
          </motion.div>

          {/* Related categories */}
          {config.relatedCategories.length > 0 && (
            <div className="mt-10 md:mt-12">
              <h3 className="text-gold font-playfair text-lg sm:text-xl mb-3 sm:mb-4">Related categories</h3>
              <div className="flex flex-wrap gap-2">
                {config.relatedCategories.map((slug) => {
                  const rel = getCategoryBySlug(slug);
                  if (!rel) return null;
                  return (
                    <Link
                      key={slug}
                      to={rel.url}
                      className="inline-flex items-center rounded-full border border-gold/30 px-3 py-1.5 text-sm text-foreground/80 hover:border-gold hover:text-gold transition"
                    >
                      {rel.finalName}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQs */}
      <CategoryFaqSection faqs={config.faqs} />

      {/* Integrity + Sponsor disclaimers */}
      <section className="py-8 md:py-12 bg-charcoal pb-24 md:pb-12">
        <div className="container mx-auto max-w-4xl px-4 space-y-4 md:space-y-6">
          <Card className="border-gold/30 bg-charcoal-light/60">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 text-gold mb-2">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-semibold">Integrity Statement</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{INTEGRITY_DISCLAIMER}</p>
            </CardContent>
          </Card>
          <Card className="border-foreground/15 bg-charcoal-light/40">
            <CardContent className="p-4 md:p-6">
              <h3 className="font-semibold text-foreground mb-2">Sponsor Disclaimer</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{SPONSOR_DISCLAIMER}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mobile sticky nominate CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gold/20 bg-charcoal/95 backdrop-blur px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Button asChild size="lg" className="w-full h-12 bg-gold text-charcoal hover:bg-gold/90 font-semibold">
          <Link to={nominateHref}>
            <Sparkles className="mr-2 h-4 w-4" />
            Nominate in this Category
          </Link>
        </Button>
      </div>
    </div>
  );
}

function MetaCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-gold/20 bg-charcoal-light/60">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-2 text-gold mb-2">
          <Icon className="h-5 w-5" />
          <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">{children}</p>
      </CardContent>
    </Card>
  );
}
