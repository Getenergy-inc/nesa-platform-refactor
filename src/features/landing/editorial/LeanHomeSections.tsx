// Lean homepage sections (homepage only). Reuse the `.nesa-ed` editorial skin.
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import tierIcon from "@/assets/story/tier-africa-education-icon.jpg";
import tierInfluencer from "@/assets/story/tier-influencer-education-impact.jpg";
import tierPlatinum from "@/assets/story/tier-platinum.jpg";
import tierGarnet from "@/assets/story/tier-gold-blue-garnet.jpg";
import { SCHOOL_SUPPORT_PROGRAMME } from "@/config/schoolSupport";
import { ICON_PATHWAYS } from "@/config/brandHierarchy";
import { bySubcategory, type IconSubcategorySlug, type IconNominee } from "@/data/iconAward";
import { getInitials } from "@/components/influencer-impact/InitialsAvatar";
import { StripScroller } from "./StripScroller";
import { useIconAwardStats } from "./useIconAwardStats";
import { ENDORSERS } from "./PartnersBandSection";

const SCHOOL = "/impact/special-needs-schools";

/** One-line Icon governance summary under the nominee strip. */
export function IconGovernanceLine() {
  const { t } = useTranslation("pages");
  return (
    <p className="ed-wrap -mt-6 pb-10 text-center text-sm text-white/70">
      {t("landingLean.iconGov", "No public voting · Independent judges · Evidence-led review")} —{" "}
      <Link to="/awards/africa-education-icon#governance" className="font-semibold text-gold hover:underline">
        {t("landingLean.iconGovLink", "read the governance note →")}
      </Link>
    </p>
  );
}

/** Homepage tier order: 1 Icon · 2 Influencers · 3 Platinum · 4 Gold–Blue Garnet. */
export function TierStripSection() {
  const { t } = useTranslation("pages");
  const icon = useIconAwardStats();
  const tiers = [
    { n: 1, name: t("landingLean.tiers.t1.name", "Africa Education Icon"), body: t("landingLean.tiers.t1.body", "The flagship lifetime honour for transformative contribution to education across Africa, 2006–2026."), href: "/awards/africa-education-icon", img: tierIcon, count: icon.nominees },
    { n: 2, name: t("landingLean.tiers.t2.name", "Influencers Education Impact"), body: t("landingLean.tiers.t2.body", "Music, social media and sports voices using their reach to advance education."), href: "/awards/influencer-education-impact", img: tierInfluencer, count: null },
    { n: 3, name: t("landingLean.tiers.t3.name", "Platinum Recognition"), body: t("landingLean.tiers.t3.body", "Certificates of Recognition for verified institutional and organisational education impact."), href: "/awards/platinum-recognition", img: tierPlatinum, count: null },
    { n: 4, name: t("landingLean.tiers.t4.name", "Gold–Blue Garnet"), body: t("landingLean.tiers.t4.body", "Recognition for verified education enablers across Africa’s regions and the Diaspora."), href: "/awards/gold-blue-garnet", img: tierGarnet, count: null },
  ];
  return (
    <section className="ed-section" aria-labelledby="ed-tiers-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">{t("landingLean.tiers.eyebrow", "Four tiers")}</div>
          <h2 id="ed-tiers-heading" className="ed-section-title">{t("landingLean.tiers.title", "The Four Tiers at a Glance")}</h2>
        </div>
        <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <li key={tier.n} className="flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.03]">
              <img src={tier.img} alt="" loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">{t("landingLean.tiers.tierLabel", "Tier")} {tier.n}</p>
                <h3 className="font-serif text-lg text-white">{tier.name}</h3>
                <p className="text-sm text-white/70">{tier.body}</p>
                {tier.count != null && (
                  <p className="text-xs text-white/60">{tier.count} {t("landingLean.tiers.nominees", "nominees")}</p>
                )}
                <Link to={tier.href} className="mt-auto pt-2 text-sm font-semibold text-gold hover:underline">
                  {t("landingLean.tiers.explore", "Explore tier →")}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Trust points + endorser logos + governance link. */
export function TrustPartnersSection() {
  const { t } = useTranslation("pages");
  const points = [
    { title: t("landingLean.trust.p1t", "Independent NRRC Verification"), body: t("landingLean.trust.p1b", "Every nomination researched and verified before review.") },
    { title: t("landingLean.trust.p2t", "Evidence-Based Evaluation"), body: t("landingLean.trust.p2b", "Category-specific standards applied consistently across every tier.") },
    { title: t("landingLean.trust.p3t", "No Public Voting in 2026"), body: t("landingLean.trust.p3b", "Nine independent Icon judges and nine Icon NRRC members. Nomination is free.") },
  ];
  return (
    <section className="ed-section" aria-labelledby="ed-trust-heading">
      <div className="ed-wrap">
        <h2 id="ed-trust-heading" className="sr-only">{t("landingLean.trust.title", "Built for trust")}</h2>
        <div className="ed-trust-band">
          {points.map((p, i) => (
            <div key={p.title} className="ed-trust-col">
              <span className="ed-trust-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
        <ul className="mt-6 flex list-none flex-wrap items-center justify-center gap-4" aria-label={t("landingLean.trust.endorsers", "Endorsers")}>
          {ENDORSERS.map((e) => (
            <li key={e.id} className="flex items-center gap-3">
              <img src={e.logo} alt={`${e.name} logo`} width={48} height={48} loading="lazy" decoding="async" className="h-12 w-12 rounded-full bg-white object-contain p-1" />
              <span className="text-sm text-white/80">{e.short}</span>
            </li>
          ))}
        </ul>
        <p className="ed-disclaimer mt-6">
          <Link to="/about/governance">{t("landingLean.trust.link", "Read our governance →")}</Link>
        </p>
      </div>
    </section>
  );
}

/** Single closing call to action. */
export function ClosingCTASection() {
  const { t } = useTranslation("pages");
  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-closing-heading">
      <div className="ed-wrap text-center">
        <h2 id="ed-closing-heading" className="ed-section-title">
          {t("landingLean.closing.line", "Africa sees you. Africa appreciates you. Africa says thank you.")}
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/nominate/africa-education-icon" className="ed-btn-primary">{t("landingLean.closing.nominate", "Nominate")}</Link>
          <Link to={SCHOOL} className="ed-btn-ghost">{t("landingLean.closing.support", "Support a School")}</Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Two-pillar section (refactor of the three-column Icon pathway band):
 * left = Tier 1 Africa Education Icon landing; right = Special Needs Education
 * Support Africa, the post-award service. Copy comes from approved config.
 */
function IconCategoryNomineeStrip({ pathwayName, nominees }: { pathwayName: string; nominees: IconNominee[] }) {
  const { t } = useTranslation("pages");

  if (nominees.length === 0) {
    return <p className="mt-4 text-xs text-white/50">{t("landingLean.pillars.noNominees", "Nominee profiles will appear here as they are added.")}</p>;
  }

  return (
    <StripScroller label={`${pathwayName} ${t("landingLean.pillars.nomineesLabel", "nominees")}`} autoScroll={false} className="mt-4">
      {nominees.map((n) => {
        const hasPortrait = !!n.image_url && !/placeholder/i.test(n.image_url);
        return (
          <Link
            key={n.id}
            to={`/nominees/africa-education-icon-award/${n.award_subcategory_slug}/${n.classification_slug}/${n.slug}`}
            aria-label={t("landingLean.pillars.viewNominee", `View ${n.name}'s nominee profile`)}
            className="group block w-[112px] shrink-0 snap-start overflow-hidden rounded-xl border border-gold/15 bg-white/[0.03] transition-colors hover:border-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <div className="aspect-[4/5] w-full overflow-hidden bg-charcoal">
              {hasPortrait ? (
                <img
                  src={n.image_url}
                  alt={n.name}
                  width={112}
                  height={140}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              ) : (
                <span role="img" aria-label={t("landingLean.pillars.photoPending", `${n.name} — portrait pending verification`)} className="flex h-full w-full items-center justify-center bg-gold/5 font-display text-2xl font-bold text-gold">
                  {getInitials(n.name)}
                </span>
              )}
            </div>
            <span className="block p-2">
              <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-white group-hover:text-gold">{n.name}</span>
              {n.country && <span className="mt-1 block truncate text-[10px] text-white/55">{n.country}</span>}
            </span>
          </Link>
        );
      })}
    </StripScroller>
  );
}

export function TwoPillarsSection() {
  const { t } = useTranslation("pages");
  const nomineesByPathway = useMemo(
    () => Object.fromEntries(
      ICON_PATHWAYS.map((p) => [p.slug, bySubcategory(p.slug as IconSubcategorySlug)]),
    ) as Record<string, IconNominee[]>,
    [],
  );
  const p = SCHOOL_SUPPORT_PROGRAMME;
  const btnPrimary = "inline-flex h-9 items-center rounded-full bg-gold px-4 text-xs font-semibold text-charcoal transition-colors hover:bg-gold/90";
  const btnGhost = "inline-flex h-9 items-center rounded-full border border-gold/40 px-4 text-xs font-semibold text-gold transition-colors hover:bg-gold/10";

  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-pillars-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">{t("landingLean.pillars.eyebrow", "Recognition and impact")}</div>
          <h2 id="ed-pillars-heading" className="ed-section-title">
            {t("landingLean.pillars.title", "Honour a Lifetime. Support a School.")}
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tier 1 — Africa Education Icon */}
          <article className="ed-card">
            <div className="ed-card-badge">{t("landingLean.pillars.iconBadge", "Tier 1 · Flagship · 2006–2026")}</div>
            <h3><Link to="/awards/africa-education-icon" className="hover:underline">{t("landingLean.pillars.iconTitle", "Africa Education Icon Award")}</Link></h3>
            <p>{t("landingLean.pillars.iconBody", "Africa’s flagship lifetime education honour, recognising individuals whose verified contributions advanced Education for All across Africa between 2006 and 2026.")}</p>
            <ul className="mt-4 space-y-3" aria-label={t("landingLean.pillars.pathways", "Africa Education Icon categories")}>
              {ICON_PATHWAYS.map((pw, index) => (
                <li key={pw.slug} className="rounded-xl border border-gold/20 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
                    {t("landingLean.pillars.categoryLabel", "Category")} {index + 1}
                  </p>
                  <h4 className="mt-1 font-serif text-base text-white">
                    {t(`landingLean.pillars.categories.${pw.slug}.name`, pw.name)}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-white/65">
                    {t(`landingLean.pillars.categories.${pw.slug}.blurb`, pw.blurb)}
                  </p>
                  <Link to={pw.nomineesHref} className="mt-2 inline-block text-xs font-semibold text-gold hover:underline">
                    {t("landingLean.pillars.viewCategory", "View category nominees →")}
                  </Link>
                  <IconCategoryNomineeStrip pathwayName={pw.name} nominees={nomineesByPathway[pw.slug] ?? []} />
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/nominate/africa-education-icon" className={btnPrimary}>{t("landingLean.pillars.nominate", "Nominate")}</Link>
              <Link to="/nominees/africa-education-icon-award" className={btnGhost}>{t("landingLean.pillars.meet", "Meet Icon nominees")}</Link>
              <Link to="/awards/africa-education-icon" className={btnGhost}>{t("landingLean.pillars.iconPage", "Tier 1 page →")}</Link>
            </div>
          </article>

          {/* Post-award service — Special Needs Education Support Africa */}
          <article className="ed-card">
            <div className="ed-card-badge">{t("landingLean.pillars.snsBadge", "Post-award service · EduAid-Africa")}</div>
            <h3><Link to={SCHOOL} className="hover:underline">{t("landingLean.pillars.snsTitle", p.headline)}</Link></h3>
            <p>{t("landingLean.pillars.snsIntro", "After the awards, recognition turns into support. Through EduAid-Africa, SCEF and NESA-Africa help identify, verify and support specialist schools and inclusive mainstream schools serving learners with disabilities and additional support needs.")}</p>
            <p className="mt-2 text-sm text-white/70">{t("landingLean.pillars.snsRegions", "The 2027 programme aims to identify one priority school in each of eight operational African regions for verified intervention support. Fundraising target: US$150,000 per region, US$1.2 million in total — a target, not secured funding.")}</p>
            <p className="mt-2 text-sm text-white/70">{t("landingLean.pillars.snsSupport", "Subject to due diligence, available funds and written approval, a selected school may receive accessibility assistance, equipment and learning materials, assistive technology, advisory services or volunteer support.")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={SCHOOL} className={btnPrimary}>{t("landingLean.pillars.snsPage", "Visit the programme page")}</Link>
              <Link to={`${SCHOOL}#take-part`} className={btnGhost}>{t("landingLean.impact.nominate", "Nominate a School")}</Link>
              <Link to={`${SCHOOL}#donate`} className={btnGhost}>{t("landingLean.pillars.donate", "Donate")}</Link>
            </div>
            <p className="mt-3 text-xs text-white/55">{t("landingLean.pillars.snsSeparate", "This is not a NESA-Africa award tier. Donations and sponsorship never influence awards, judging or school selection.")}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
