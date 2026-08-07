// AwardSubpageTemplate — reusable 10-block layout for every award & directory subpage.
// Order (locked by spec §9):
//   1. Hero (compact, one H1, one primary + one secondary CTA)
//   2. What this recognises
//   3. Who this is for (nominee types + who can nominate)
//   4. Examples of impact (bullet cards)
//   5. Geographic scope (regions/countries)
//   6. Featured nominees (max 6)
//   7. How it works (4–6 steps)
//   8. Integrity firewall (NESA-Africa 2026 statement)
//   9. FAQs (≤5)
//  10. Final CTA
//
// Every subpage is a thin call: <AwardSubpageTemplate content={config} />.

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";

import { HeroCompact } from "@/components/common/HeroCompact";
import { TierNoticeBanner, type TierNoticeKind } from "@/components/common/TierNoticeBanner";
import { TrustIndicators } from "@/components/common/TrustIndicators";
import { CTAStack, type CTAAction } from "@/components/common/CTAStack";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  AwardBenefitsBlock,
  AwardCountdownBlock,
  AwardGalleryBlock,
  AwardPartnersBlock,
  AwardTermsBlock,
  AwardTestimonialsBlock,
  AwardTimelineBlock,
  AwardVideosBlock,
  type SubpageBenefit,
  type SubpageCountdown,
  type SubpageGalleryItem,
  type SubpageOrg,
  type SubpageTerms,
  type SubpageTestimonial,
  type SubpageTimelineEntry,
  type SubpageVideo,
} from "@/components/awards/subpage/AwardSubpageBlocks";
import { getAwardTheme, awardThemeVars } from "@/config/awards/awardThemes";

export type {
  SubpageBenefit,
  SubpageCountdown,
  SubpageGalleryItem,
  SubpageOrg,
  SubpageTerms,
  SubpageTestimonial,
  SubpageTimelineEntry,
  SubpageVideo,
};

// ── Content contract ────────────────────────────────────────────────────────

export type SubpageBreadcrumb = { name: string; path: string };

export type SubpageFeaturedNominee = {
  id: string | number;
  name: string;
  href: string;
  country?: string;
  region?: string;
  subcategory?: string;
  summary?: string;
  image?: string;
  verified?: boolean;
};

export type SubpageStep = {
  title: string;
  description: string;
};

export type SubpageFaq = { q: string; a: string };

export interface AwardSubpageContent {
  slug: string;
  tier: "africa-education-icon" | "influencer-education-impact" | "platinum" | "gold-blue-garnet";
  parentTierHref: string;
  parentTierLabel: string;

  seoTitle: string;
  metaDescription: string;
  canonicalPath: string;

  breadcrumbs: SubpageBreadcrumb[];

  hero: {
    eyebrow?: string;
    title: string;
    lede: string;
    primary: CTAAction;
    secondary?: CTAAction;
    imageSrc?: string;
    imageAlt?: string;
  };

  notice?: {
    kind: TierNoticeKind;
    heading?: string;
    body: string;
  };

  recognises: {
    heading?: string;
    body: string;
    highlights?: string[];
  };

  whoItsFor: {
    heading?: string;
    canBeNominated: string[];
    whoCanNominate: string[];
  };

  examples: {
    heading?: string;
    items: { title: string; body: string }[];
  };

  geography: {
    heading?: string;
    body?: string;
    regions: string[];
  };

  featured: {
    heading?: string;
    exploreAllHref: string;
    exploreAllLabel?: string;
    nominees: SubpageFeaturedNominee[]; // enforced max 6 at render
  };

  howItWorks: {
    heading?: string;
    steps: SubpageStep[]; // 4–6
  };

  integrity?: {
    heading?: string;
    body: string;
  };

  faqs: SubpageFaq[]; // ≤5

  finalCta: {
    heading: string;
    body?: string;
    primary: CTAAction;
    secondary?: CTAAction;
  };

  // ── Optional, additive blocks (Award Pages Module — Phase 1) ──────────────
  // Each renders only when supplied; existing subpages are unaffected.

  /** Per-award accent override. Defaults resolve from slug → tier → gold. */
  theme?: { accent?: string; accentSoft?: string; iconKey?: string; bannerSrc?: string };

  /** "What recognition unlocks" cards. */
  benefits?: { heading?: string; items: SubpageBenefit[] };

  /** Award-specific image gallery. */
  gallery?: { heading?: string; items: SubpageGalleryItem[] };

  /** YouTube links only — no video files are stored. */
  videos?: { heading?: string; items: SubpageVideo[] };

  /** Award-specific milestone countdown. */
  countdown?: SubpageCountdown;

  /** Award-specific phase timeline. */
  timeline?: { heading?: string; entries: SubpageTimelineEntry[] };

  /** Award-scoped sponsors and partners (firewall note included by default). */
  partners?: { heading?: string; note?: string; items: SubpageOrg[] };

  /** Award-scoped testimonials. */
  testimonials?: { heading?: string; items: SubpageTestimonial[] };

  /** Award-specific terms & conditions. */
  terms?: SubpageTerms;

  // ── Category-page storytelling (2026 refactor) ────────────────────────────

  /** Bold branding band under the hero. */
  brand?: { name: string; code?: string; tagline?: string };

  /** Narrative: why this category exists, under its tier. */
  story?: AwardStory;

  /** Subcategories (or Icon/Influencer classifications) with imagery. */
  pathways?: { heading: string; label: string; intro?: string; items: PathwayCard[] };

  /** Tailored nomination form embedded on the page. */
  nomination?: AwardNominationConfig;
}


// ── Small building blocks ────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-playfair text-2xl text-white sm:text-3xl lg:text-4xl">{children}</h2>
  );
}

function SectionShell({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("border-b border-gold/10 bg-charcoal py-12 sm:py-16", className)}>
      <div className="container mx-auto max-w-6xl px-4">{children}</div>
    </section>
  );
}

// ── The template ─────────────────────────────────────────────────────────────

export function AwardSubpageTemplate({ content }: { content: AwardSubpageContent }) {
  const featured = content.featured.nominees.slice(0, 6);
  const steps = content.howItWorks.steps.slice(0, 6);
  const faqs = content.faqs.slice(0, 5);
  const theme = { ...getAwardTheme(content.slug, content.tier), ...(content.theme ?? {}) };
  const integrityDefault =
    "NESA-Africa 2026 does not use public voting for award recognition. Sponsorship, donations, Gala tickets, merchandise, endorsements, GFAwzip Wallet transactions, AGC Participation Credits, follower numbers and public popularity do not influence verification or recognition.";

  return (
    <>
      <Helmet>
        <title>{content.seoTitle}</title>
        <meta name="description" content={content.metaDescription} />
        <link rel="canonical" href={`https://nesa.africa${content.canonicalPath}`} />
        <meta property="og:title" content={content.seoTitle} />
        <meta property="og:description" content={content.metaDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={content.breadcrumbs} />

      <div className="min-h-screen bg-charcoal text-white" style={awardThemeVars(theme)}>
        {/* 1. Hero */}
        <HeroCompact
          eyebrow={content.hero.eyebrow ?? content.parentTierLabel}
          title={content.hero.title}
          lede={content.hero.lede}
          primary={content.hero.primary}
          secondary={content.hero.secondary}
          imageSrc={content.hero.imageSrc}
          imageAlt={content.hero.imageAlt}
        />

        <TrustIndicators />

        {content.notice ? (
          <div className="container mx-auto max-w-6xl px-4 pt-6">
            <TierNoticeBanner kind={content.notice.kind} />
          </div>
        ) : null}

        {/* 1b. Award-specific countdown (optional) */}
        {content.countdown ? <AwardCountdownBlock countdown={content.countdown} /> : null}



        {/* 2. Recognises */}
        <SectionShell id="recognises">
          <SectionHeading>{content.recognises.heading ?? "What this recognises"}</SectionHeading>
          <p className="mt-4 max-w-3xl text-base text-white/80 sm:text-lg">{content.recognises.body}</p>
          {content.recognises.highlights?.length ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {content.recognises.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-white/85">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-gold" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </SectionShell>

        {/* 3. Who it's for */}
        <SectionShell id="who">
          <SectionHeading>{content.whoItsFor.heading ?? "Who this is for"}</SectionHeading>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gold/20 bg-charcoal/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Can be nominated</p>
              <ul className="mt-3 space-y-2 text-white/85">
                {content.whoItsFor.canBeNominated.map((x) => (
                  <li key={x} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-gold" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gold/20 bg-charcoal/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Who can nominate</p>
              <ul className="mt-3 space-y-2 text-white/85">
                {content.whoItsFor.whoCanNominate.map((x) => (
                  <li key={x} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-gold" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionShell>

        {/* 4. Examples of impact */}
        <SectionShell id="examples">
          <SectionHeading>{content.examples.heading ?? "Examples of impact"}</SectionHeading>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.examples.items.map((it) => (
              <div
                key={it.title}
                className="rounded-xl border border-gold/15 bg-charcoal/60 p-5"
              >
                <h3 className="font-playfair text-lg text-white">{it.title}</h3>
                <p className="mt-2 text-sm text-white/75">{it.body}</p>
              </div>
            ))}
          </div>
        </SectionShell>

        {/* 5. Geography */}
        <SectionShell id="geography">
          <SectionHeading>{content.geography.heading ?? "Geographic scope"}</SectionHeading>
          {content.geography.body ? (
            <p className="mt-4 max-w-3xl text-white/80">{content.geography.body}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {content.geography.regions.map((r) => (
              <Badge
                key={r}
                variant="outline"
                className="border-gold/40 bg-charcoal/60 text-white/90"
              >
                <MapPin className="mr-1 h-3.5 w-3.5 text-gold" />
                {r}
              </Badge>
            ))}
          </div>
        </SectionShell>

        {/* 6. Featured nominees */}
        <SectionShell id="featured">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHeading>{content.featured.heading ?? "Featured Education Enablers"}</SectionHeading>
            <Link
              to={content.featured.exploreAllHref}
              onClick={() =>
                trackEvent("subpage_featured_explore_all", {
                  slug: content.slug,
                  tier: content.tier,
                })
              }
              className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold/80"
            >
              {content.featured.exploreAllLabel ?? "Explore Africa's Education Impact Directory"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {featured.length === 0 ? (
            <p className="mt-6 text-white/70">
              Nominees will appear here once verified for this subcategory.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  className="group overflow-hidden rounded-xl border border-gold/15 bg-charcoal/70"
                >
                  <Link to={n.href} className="block">
                    {n.image ? (
                      <div className="aspect-[4/3] w-full overflow-hidden bg-black/30">
                        <img
                          src={n.image}
                          alt={n.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-playfair text-lg text-white">{n.name}</h3>
                        {n.verified ? (
                          <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-gold" aria-label="Verified" />
                        ) : null}
                      </div>
                      {(n.country || n.region) && (
                        <p className="mt-1 text-xs text-white/60">
                          {[n.country, n.region].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {n.subcategory ? (
                        <p className="mt-1 text-xs uppercase tracking-wider text-gold/80">
                          {n.subcategory}
                        </p>
                      ) : null}
                      {n.summary ? (
                        <p className="mt-2 line-clamp-3 text-sm text-white/75">{n.summary}</p>
                      ) : null}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </SectionShell>

        {/* 7. How it works */}
        <SectionShell id="how-it-works">
          <SectionHeading>{content.howItWorks.heading ?? "How nomination works"}</SectionHeading>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="rounded-xl border border-gold/15 bg-charcoal/60 p-5"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 font-semibold text-gold">
                    {i + 1}
                  </span>
                  <h3 className="font-playfair text-lg text-white">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm text-white/75">{s.description}</p>
              </li>
            ))}
          </ol>
        </SectionShell>

        {/* 7b–7h. Optional award-specific blocks */}
        {content.benefits ? (
          <AwardBenefitsBlock heading={content.benefits.heading} items={content.benefits.items} />
        ) : null}
        {content.countdown ? <AwardCountdownBlock countdown={content.countdown} /> : null}
        {content.timeline ? (
          <AwardTimelineBlock heading={content.timeline.heading} entries={content.timeline.entries} />
        ) : null}
        {content.gallery ? (
          <AwardGalleryBlock heading={content.gallery.heading} items={content.gallery.items} />
        ) : null}
        {content.videos ? (
          <AwardVideosBlock heading={content.videos.heading} items={content.videos.items} />
        ) : null}
        {content.testimonials ? (
          <AwardTestimonialsBlock
            heading={content.testimonials.heading}
            items={content.testimonials.items}
          />
        ) : null}
        {content.partners ? (
          <AwardPartnersBlock
            heading={content.partners.heading}
            note={content.partners.note}
            items={content.partners.items}
          />
        ) : null}

        {/* 8. Integrity firewall */}
        <SectionShell id="integrity">
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-charcoal to-black/80 p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 flex-none text-gold" aria-hidden />
              <div>
                <h2 className="font-playfair text-xl text-white sm:text-2xl">
                  {content.integrity?.heading ?? "Integrity firewall — Enablers of Education for All Across Africa"}
                </h2>
                <p className="mt-3 text-white/80">
                  {content.integrity?.body ?? integrityDefault}
                </p>
              </div>
            </div>
          </div>
        </SectionShell>

        {/* 9. FAQs */}
        {faqs.length ? (
          <SectionShell id="faqs">
            <SectionHeading>Frequently asked questions</SectionHeading>
            <Accordion type="single" collapsible className="mt-4">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-gold/15">
                  <AccordionTrigger className="text-left text-white hover:text-gold">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SectionShell>
        ) : null}

        {/* 9b. Terms & conditions (optional) */}
        {content.terms ? <AwardTermsBlock terms={content.terms} /> : null}

        {/* 10. Final CTA */}
        <SectionShell id="final-cta" className="border-b-0">
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/10 via-charcoal to-charcoal p-8 sm:p-10">
            <h2 className="font-playfair text-2xl text-white sm:text-3xl">
              {content.finalCta.heading}
            </h2>
            {content.finalCta.body ? (
              <p className="mt-3 max-w-2xl text-white/80">{content.finalCta.body}</p>
            ) : null}
            <div className="mt-6">
              <CTAStack primary={content.finalCta.primary} secondary={content.finalCta.secondary} />
            </div>
            <p className="mt-4 text-xs text-white/60">
              Parent tier:{" "}
              <Link to={content.parentTierHref} className="text-gold hover:underline">
                {content.parentTierLabel}
              </Link>
            </p>
          </div>
        </SectionShell>
      </div>
    </>
  );
}

export default AwardSubpageTemplate;
