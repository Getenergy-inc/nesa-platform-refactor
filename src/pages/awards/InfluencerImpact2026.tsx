import { TierFamiliesSection, SchoolSupportBanner } from "@/features/tiers/TierPageExtras";
import { TierNomineeDirectory } from "@/features/tiers/TierNomineeDirectory";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Megaphone,
  Music2,
  School,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OfficialNominationForm } from "@/components/nominate/OfficialNominationForm";
import { InfluencerPathwayNomineeSlider } from "@/components/awards/InfluencerPathwayNomineeSlider";
import { AWARD_TIERS_2026 } from "@/config/awardTiers2026";
import { INFLUENCER_SUBCATEGORIES, type InfluencerSubcategorySlug } from "@/config/influencer/subcategoryContent";
import { useInfluencerPathwayNominees } from "@/hooks/useInfluencerPathwayNominees";
import { OFFICIAL_NOMINATION_FORM_URL } from "@/config/nomination/officialGoogleForm";
import { NOMINATION_WINDOW_LABEL } from "@/config/nominationWindows2026";
import { PROGRAMME_END_LONG_LABEL } from "@/config/programme";
import { trackEvent } from "@/lib/analytics";
import tierImage from "@/assets/story/tier-influencer-education-impact.jpg";
import tierBadge from "@/assets/certificates/gold-certificate.jpeg";
import { TierArtworkBand } from "@/features/tiers/TierPageExtras";
import { TierDecisionPath, TierRecognitionBullets } from "@/features/tiers/TierContent2026";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { SiteClosingBand } from "@/components/nesa/SiteWideContent2026";

const DIRECTORY_ROUTE = "/awards/influencer-education-impact/nominees";
const TIER = AWARD_TIERS_2026.find((tier) => tier.id === "influencers")!;

const CATEGORY_DETAILS: Array<{
  slug: InfluencerSubcategorySlug;
  href: string;
  icon: typeof Megaphone;
}> = [
  {
    slug: "african-social-media-influencers",
    href: "/recognition/influencer-education-impact/african-social-media-influencers",
    icon: Megaphone,
  },
  {
    slug: "african-sports-icons-supporting-education",
    href: "/recognition/influencer-education-impact/african-sports-icons-supporting-education",
    icon: Trophy,
  },
  {
    slug: "african-music-icons-supporting-education",
    href: "/recognition/influencer-education-impact/african-music-icons-supporting-education",
    icon: Music2,
  },
];

export default function InfluencerImpact2026() {
  const { t } = useTranslation("pages");
  const { total: nomineeTotal, loading: nomineesLoading, error: nomineesError } = useInfluencerPathwayNominees();

  useEffect(() => {
    trackEvent("page_view", { page: "influencer-education-impact-2026" });
  }, []);

  const impactAreas = [
    {
      icon: GraduationCap,
      title: t("tier2Influencer.impact.scholarships.title", "Fund Scholarships"),
      body: t("tier2Influencer.impact.scholarships.body", "Supporting access to learning through scholarships and grants."),
    },
    {
      icon: School,
      title: t("tier2Influencer.impact.schools.title", "Support Schools"),
      body: t("tier2Influencer.impact.schools.body", "Helping build, renovate, equip or strengthen learning environments."),
    },
    {
      icon: Users,
      title: t("tier2Influencer.impact.mentorship.title", "Mentor Young People"),
      body: t("tier2Influencer.impact.mentorship.body", "Providing guidance, confidence, skills and opportunity."),
    },
    {
      icon: BookOpen,
      title: t("tier2Influencer.impact.content.title", "Create Learning Content"),
      body: t("tier2Influencer.impact.content.body", "Using public platforms to make useful knowledge more accessible."),
    },
  ];

  const reviewSteps = [
    {
      icon: ClipboardCheck,
      title: t("tier2Influencer.review.nominate.title", "Nominate"),
      body: t("tier2Influencer.review.nominate.body", "Submit the official free nomination with basic information and relevant education-impact evidence."),
    },
    {
      icon: UserCheck,
      title: t("tier2Influencer.review.verify.title", "NRRC Verification"),
      body: t("tier2Influencer.review.verify.body", "The Nominee Research and Review Corps checks identity, category fit, duplicates and supporting evidence."),
    },
    {
      icon: FileCheck2,
      title: t("tier2Influencer.review.assess.title", "Impact Assessment"),
      body: t("tier2Influencer.review.assess.body", "Verified contributions are assessed for education impact, development contribution, excellence and reach."),
    },
    {
      icon: ShieldCheck,
      title: t("tier2Influencer.review.recognise.title", "Governance Approval"),
      body: t("tier2Influencer.review.recognise.body", "Recognition proceeds only through the approved verification and governance process."),
    },
  ];

  return (
    <>
      <LocalizedSEO
        pathname="/awards/influencer-education-impact"
        title={t("tier2Influencer.seo.title", "Tier 2 Influencers Education Impact Award 2026 | NESA-Africa")}
        description={t(
          "tier2Influencer.seo.description",
          "Recognising African social media creators, sports icons and music icons whose verified influence advances education across Africa and the African Diaspora.",
        )}
        ogTitle={t("tier2Influencer.seo.ogTitle", "Influence With Purpose — NESA-Africa Tier 2")}
        ogDescription={t(
          "tier2Influencer.seo.ogDescription",
          "Three award categories. Verified education impact. Free nomination and no public voting in 2026.",
        )}
      />

      <NESAHeader />

      <main className="min-h-screen bg-charcoal">
        {/* 1. Tier 2 hero */}
        <section aria-labelledby="tier2-heading" className="relative overflow-hidden border-b border-gold/15 bg-gradient-to-b from-charcoal via-black to-charcoal pt-28 pb-14 md:pt-32 md:pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--gold)/0.12),transparent_70%)]" />
          <div className="container relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="min-w-0 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                {t("tier2Influencer.hero.eyebrow", "Tier 2 · NESA-Africa 2026")}
              </span>
              <h1 id="tier2-heading" className="mt-5 break-words font-display text-[2rem] font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                {t("tier2Influencer.hero.title", "Influencers Education Impact")}
              </h1>
              <p className="mt-3 font-display text-xl text-gold md:text-2xl">
                {t("tier2Influencer.hero.tagline", "Influence With Purpose.")}
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base lg:mx-0">
                {t(
                  "tier2Influencer.hero.body",
                  "Music, social media and sports figures who use their reach to advance education.",
                )}
              </p>
              <p className="mx-auto mt-4 flex max-w-2xl items-start justify-center gap-2 text-xs leading-relaxed text-white/65 md:text-sm lg:justify-start">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {t(
                  "tier2Influencer.hero.integrity",
                  "Recognition is based on verified education impact — not popularity, celebrity status or follower count.",
                )}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Button asChild size="lg" className="h-auto min-h-11 w-full whitespace-normal bg-gold px-4 py-3 text-center text-sm font-semibold text-charcoal hover:bg-gold/90 sm:w-auto sm:text-base">
                  <a
                    href={PUBLIC_ACTIONS_2026.nominate.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("influencer_hero_cta_click", { cta: "nominate" })}
                  >
                    <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t("tier2Influencer.hero.nominate", "Nominate an Influencer")}
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-auto min-h-11 w-full whitespace-normal border-gold/40 px-4 py-3 text-center text-sm text-gold hover:bg-gold/10 sm:w-auto sm:text-base">
                  <a href="#nominees">
                    {t("tierPage.meetNominees", "Meet the nominees ↓")}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-gold/25 bg-white/[0.03] shadow-2xl shadow-black/30">
              <img
                src={tierImage}
                alt={t("tier2Influencer.hero.imageAlt", "Influencers Education Impact — NESA-Africa Tier 2")}
                className="aspect-[16/10] w-full object-cover"
                loading="eager"
              />
              <div className="grid grid-cols-2 gap-px bg-gold/15">
                <div className="bg-charcoal px-4 py-5 text-center">
                  <p className="font-display text-3xl font-bold text-gold">3</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-white/60">
                    {t("tier2Influencer.hero.categoriesStat", "Award categories")}
                  </p>
                </div>
                <div className="bg-charcoal px-4 py-5 text-center">
                  <p className="font-display text-3xl font-bold text-gold">
                    {nomineesLoading || nomineesError ? "—" : nomineeTotal}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-white/60">
                    {t("tier2Influencer.hero.nomineesStat", "Published nominee profiles")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TierArtworkBand image={tierImage} badge={tierBadge} name="Influencers Education Impact" />
        <TierRecognitionBullets tier={2} />

        {/* 2. Integrity notice */}
        <div className="border-b border-gold/15 bg-gold/5 py-4">
          <p className="container mx-auto max-w-5xl px-4 text-center text-xs leading-relaxed text-charcoal/85 md:text-sm">
            <strong>{t("tier2Influencer.notice.title", "Nomination is free. There is no public voting in 2026.")}</strong>{" "}
            {t(
              "tier2Influencer.notice.body",
              "Sponsorship, donations, partnerships and publicity never influence eligibility, assessment or recognition decisions.",
            )}
          </p>
        </div>

        {/* 3. Three approved award categories */}
        <section aria-labelledby="tier2-categories-heading" className="border-b border-gold/10 bg-charcoal py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {t("tier2Influencer.categories.eyebrow", "Three pathways for education enablers")}
              </p>
              <h2 id="tier2-categories-heading" className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
                {t("tier2Influencer.categories.title", "Choose an Influencer Recognition Category")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
                {t(
                  "tier2Influencer.categories.intro",
                  "Each category recognises a different public platform. The same standard applies throughout: credible, verifiable contribution to education.",
                )}
              </p>
            </header>

            <ul className="mt-10 grid list-none gap-5 md:grid-cols-3" aria-label={t("tier2Influencer.categories.listLabel", "Tier 2 award categories")}>
              {TIER.categories.map((category, index) => {
                const detail = CATEGORY_DETAILS[index];
                const content = INFLUENCER_SUBCATEGORIES[detail.slug];
                const Icon = detail.icon;
                return (
                  <li key={category.id}>
                    <Card className="flex h-full flex-col rounded-2xl border-gold/20 bg-white/[0.03] p-6 transition-colors hover:border-gold/45">
                      <div className="flex items-center justify-between gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10">
                          <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                          {t("tier2Influencer.categories.categoryLabel", "Category")} {index + 1}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-xl font-semibold leading-snug text-white">
                        {t(`tier2Influencer.categories.${detail.slug}.title`, category.name)}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">
                        {t(`tier2Influencer.categories.${detail.slug}.body`, content.supportingStatement)}
                      </p>
                      <div className="mt-6 flex flex-col gap-2">
                        <Button asChild variant="outline" className="w-full border-gold/40 text-gold hover:bg-gold/10">
                          <Link to={detail.href}>
                            {t("tier2Influencer.categories.explore", "Explore this category")}
                            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <a href={PUBLIC_ACTIONS_2026.nominate.href} target="_blank" rel="noopener noreferrer" className="py-2 text-center text-xs font-semibold text-gold hover:underline">
                          {t("tier2Influencer.categories.nominate", "Nominate in this category →")}
                        </a>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* 4. Live nominee profiles — one database-driven presentation only */}
        <InfluencerPathwayNomineeSlider
          eyebrow={t("tier2Influencer.nominees.eyebrow", "Existing Nominees")}
          headingLead={t("tier2Influencer.nominees.headingLead", "Meet Nominees Across the Three")}
          headingHighlight={t("tier2Influencer.nominees.headingHighlight", "Influencer Categories")}
          footerLink={{ to: DIRECTORY_ROUTE, label: t("tier2Influencer.nominees.directory", "Explore the full nominee directory →") }}
        />
        <TierFamiliesSection tier={2} title="Influencer Education Impact pathway" />
        <TierDecisionPath tier={2} />
        <TierNomineeDirectory tier={2} title="Influencers Education Impact nominees" />

        {/* 5. Education impact beyond reach */}
        <section aria-labelledby="tier2-impact-heading" className="bg-charcoal py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {t("tier2Influencer.impact.eyebrow", "Beyond popularity")}
              </p>
              <h2 id="tier2-impact-heading" className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
                {t("tier2Influencer.impact.title", "What Education Impact Can Look Like")}
              </h2>
            </header>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {impactAreas.map(({ icon: Icon, title, body }) => (
                <Card key={title} className="rounded-2xl border-white/10 bg-white/[0.03] p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/35 bg-gold/10">
                    <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Review, governance and dates */}
        <section aria-labelledby="tier2-review-heading" className="border-y border-gold/10 bg-black/30 py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {t("tier2Influencer.review.eyebrow", "Evidence before recognition")}
              </p>
              <h2 id="tier2-review-heading" className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
                {t("tier2Influencer.review.title", "How Tier 2 Recognition Works")}
              </h2>
            </header>
            <ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {reviewSteps.map(({ icon: Icon, title, body }, index) => (
                <li key={title} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 pt-7">
                  <span className="absolute -top-3 left-4 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-charcoal">
                    {t("tier2Influencer.review.step", "Step")} {index + 1}
                  </span>
                  <Icon className="h-6 w-6 text-gold" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-2xl border-gold/20 bg-gold/5 p-6">
                <h3 className="font-display text-xl font-semibold text-white">
                  {t("tier2Influencer.governance.title", "Governance and Integrity")}
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/75">
                  {[
                    t("tier2Influencer.governance.p1", "Nomination is free; financial contributions cannot purchase recognition."),
                    t("tier2Influencer.governance.p2", "No public vote, endorsement count or follower total determines the outcome."),
                    t("tier2Influencer.governance.p3", "Published nominee profiles remain subject to evidence, consent and correction rules."),
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-5 border-gold/40 text-gold hover:bg-gold/10">
                  <Link to="/research-and-judging">
                    {t("tier2Influencer.governance.link", "Read research and judging →")}
                  </Link>
                </Button>
              </Card>

              <Card className="rounded-2xl border-gold/20 bg-white/[0.03] p-6">
                <h3 className="font-display text-xl font-semibold text-white">
                  {t("tier2Influencer.dates.title", "2026–2027 Programme")}
                </h3>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-white/55">{t("tier2Influencer.dates.nominations", "Nomination window")}</dt>
                    <dd className="mt-1 font-semibold text-gold">{NOMINATION_WINDOW_LABEL}</dd>
                  </div>
                  <div>
                    <dt className="text-white/55">{t("tier2Influencer.dates.programme", "Online Recognition Programme")}</dt>
                    <dd className="mt-1 font-semibold text-gold">{PROGRAMME_END_LONG_LABEL}</dd>
                  </div>
                  <div>
                    <dt className="text-white/55">{t("tier2Influencer.dates.decision", "Decision method")}</dt>
                    <dd className="mt-1 text-white/80">{TIER.voteMechanicLabel}</dd>
                  </div>
                </dl>
              </Card>
            </div>
          </div>
        </section>

        {/* 7. Official nomination — the single nomination channel */}
        <section className="bg-charcoal py-14 md:py-20">
          <div className="container mx-auto max-w-4xl px-4">
            <OfficialNominationForm
              id="nominate"
              awardName="Influencers Education Impact Award"
              heading={t("tier2Influencer.nomination.title", "Nominate an Education Impact Influencer")}
            />
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gold/15 pt-6">
              <p className="max-w-xl text-sm leading-relaxed text-white/60">
                {t(
                  "tier2Influencer.nomination.note",
                  "Choose the Social Media, Sports or Music category in the official form. Every submission enters the same verification process.",
                )}
              </p>
              <Button asChild variant="ghost" className="text-gold hover:bg-gold/10 hover:text-gold">
                <a href={OFFICIAL_NOMINATION_FORM_URL} target="_blank" rel="noopener noreferrer">
                  {t("tier2Influencer.nomination.external", "Open official form")}
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>
        <SchoolSupportBanner />
      </main>

      <SiteClosingBand />
      <NESAFooter />
    </>
  );
}
