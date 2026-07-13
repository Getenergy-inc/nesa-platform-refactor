import { useMemo } from "react";

import { Helmet } from "react-helmet-async";

import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  AwardHeroStandard,
  WhatThisRecognises,
  WhoIsThisFor,
  HallOfFamePreview,
  SubcategoryPathways,
  HowNominationWorks,
  IntegrityFirewallBlock,
  FinalAwardCTA,
  type HallNominee,
} from "@/components/awards/standard/sections";
import { getAwardPageContent } from "@/config/awards/awardPageContent";
import { filterMasterNominees, getMasterRegions } from "@/lib/nomineeMasterData";
import { ICON_NOMINEES } from "@/data/iconAward";
import { resolveIconImage } from "@/data/iconAward/imageManifest";
import { AwardPageTabs, type AwardPageTab } from "@/components/awards/AwardPageTabs";

type Props = { slug: string };

const TABS_BY_SLUG: Record<string, AwardPageTab[]> = {
  "africa-education-icon": [
    { id: "overview", label: "Overview" },
    { id: "categories", label: "Categories" },
    { id: "nominees", label: "Africa Education Impact Directory" },
    { id: "hall-of-fame", label: "Hall of Fame" },
    { id: "eligibility", label: "Eligibility" },
    { id: "process", label: "Selection Process" },
    { id: "nominate", label: "Nominate" },
  ],
  "gold-blue-garnet": [
    { id: "overview", label: "Overview" },
    { id: "categories", label: "Award Categories" },
    { id: "nominees", label: "Africa Education Impact Directory" },
    { id: "hall-of-fame", label: "Hall of Fame" },
    { id: "voting", label: "Voting" },
    { id: "eligibility", label: "Judging & Eligibility" },
    { id: "nominate", label: "Nominate" },
  ],
  "platinum-recognition": [
    { id: "overview", label: "Overview" },
    { id: "categories", label: "Recognition Categories" },
    { id: "nominees", label: "Recognised Education Enablers" },
    { id: "hall-of-fame", label: "Hall of Fame" },
    { id: "eligibility", label: "Eligibility" },
    { id: "process", label: "Recognition Process" },
  ],
  "influencer-education-impact-2026": [
    { id: "overview", label: "Overview" },
    { id: "categories", label: "Social · Sports · Music" },
    { id: "nominees", label: "Existing Nominees" },
    { id: "voting", label: "Voting" },
    { id: "hall-of-fame", label: "Hall of Fame" },
    { id: "nominate", label: "AfriGold Coin Participation" },
  ],
};


/**
 * Unified premium award page. Drives every Tier / Pillar / Category page off the
 * same structure used by /awards/africa-education-icon.
 */
export default function AwardCategoryStandardPage({ slug }: Props) {
  const content = getAwardPageContent(slug);
  if (!content) return null;


  const { hero, eligibility, hallFilter, subcategories, finalCta } = content;

  // Build Hall of Fame nominees -------------------------------------------------
  const { hallNominees, totalCount, regionCount } = useMemo(() => {
    if (hallFilter.sourceIcon) {
      const mapped: HallNominee[] = ICON_NOMINEES.slice(0, 12).map((n) => ({
        id: n.id,
        name: n.name,
        href: `/nominees/africa-education-icon-award/${n.slug}`,
        country: n.country,
        region: n.region,
        classification: n.classification_slug.replace(/-/g, " "),
        subcategory: n.award_subcategory_slug.replace(/-/g, " "),
        summary: n.impact_summary,
        image: resolveIconImage(n.name) || n.image_url,
        verified: n.verification_status === "verified",
      }));
      return {
        hallNominees: mapped,
        totalCount: ICON_NOMINEES.length,
        regionCount: new Set(ICON_NOMINEES.map((n) => n.region)).size,
      };
    }
    const allRegions = getMasterRegions();
    const pool = filterMasterNominees({});
    const includes = hallFilter.categoryIncludes ?? [];
    const matched = includes.length
      ? pool.filter((n) => {
          const hay = `${n.category} ${n.subcategory} ${n.categorySlug} ${n.subcategorySlug}`.toLowerCase();
          return includes.some((k) => hay.includes(k));
        })
      : pool;
    const matchedRegions = new Set(matched.map((n) => n.region).filter(Boolean));
    const mapped: HallNominee[] = matched.slice(0, 12).map((n) => ({
      id: n.id,
      name: n.name,
      href: `/nominees/${n.categorySlug}/${n.slug}`,
      country: n.country,
      region: n.region,
      classification: n.pathway,
      subcategory: n.subcategory,
      summary: n.achievement,
      image: n.imageUrl,
      verified: n.workflowStatus === "nomination_cleared",
    }));
    return {
      hallNominees: mapped,
      totalCount: matched.length,
      regionCount: matchedRegions.size || allRegions.length,
    };
  }, [hallFilter]);

  const stats =
    hero.statsBuilder?.({
      nominees: totalCount,
      regions: regionCount,
      subcategories: subcategories.length,
      finalists: 0,
    }) ?? [];

  return (
    <>
      <Helmet>
        <title>{content.seoTitle}</title>
        <meta name="description" content={content.metaDescription} />
        <link rel="canonical" href={`https://nesa.africa${content.canonicalPath}`} />
        <meta property="og:title" content={content.seoTitle} />
        <meta property="og:description" content={content.metaDescription} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards" },
          { name: hero.title, path: content.canonicalPath },
        ]}
      />

      <div className="min-h-screen bg-charcoal text-white">
        <main>

          <section id="overview">
            <AwardHeroStandard
              pageSlug={content.slug}
              badge={hero.badge}
              title={hero.title}
              titleAccent={hero.titleAccent}
              subhead={hero.subhead}
              lead={hero.lead}
              stats={stats}
              primaryCta={hero.primaryCta}
              secondaryCta={hero.secondaryCta}
              trustLine={hero.trustLine}
            />
          </section>

          {TABS_BY_SLUG[content.slug] ? (
            <AwardPageTabs tabs={TABS_BY_SLUG[content.slug]} />
          ) : null}

          <section id="categories">
            <WhatThisRecognises body={content.recognises} />
            <SubcategoryPathways pageSlug={content.slug} subcategories={subcategories} />
            {content.slug === "gold-blue-garnet" && (
              <TierCategoryCards tier="gold-blue-garnet" />
            )}
            {content.slug === "platinum-recognition" && (
              <TierCategoryCards tier="platinum-recognition" />
            )}
          </section>
          <section id="eligibility">
            <WhoIsThisFor
              canBeNominated={eligibility.canBeNominated}
              shouldNotBeNominated={eligibility.shouldNotBeNominated}
              evidence={eligibility.evidence}
              region={eligibility.region}
              pathway={eligibility.pathway}
            />
          </section>
          {content.slug !== "influencer-education-impact-2026" && (
            <section id="nominees">
              <HallOfFamePreview
                pageSlug={content.slug}
                nominees={hallNominees}
                exploreAllHref={content.exploreAllHref}
                nominateHref={content.nominateHref}
              />
            </section>
          )}
          <section id="hall-of-fame" aria-label="Hall of Fame" />
          <section id="voting" />
          <section id="process">
            <HowNominationWorks />
            <IntegrityFirewallBlock />
          </section>
          <section id="nominate">
            <FinalAwardCTA
              pageSlug={content.slug}
              heading={finalCta.heading}
              body={finalCta.body}
              primaryCta={finalCta.primary}
              secondaryCta={finalCta.secondary}
            />
          </section>
        </main>
      </div>


    </>
  );
}
