// Lean homepage sections (homepage only). Reuse the `.nesa-ed` editorial skin.
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import tierIcon from "@/assets/story/tier-africa-education-icon.jpg";
import tierInfluencer from "@/assets/story/tier-influencer-education-impact.jpg";
import tierPlatinum from "@/assets/story/tier-platinum.jpg";
import tierGarnet from "@/assets/story/tier-gold-blue-garnet.jpg";
import { SNS_CATEGORIES } from "@/config/schoolSupport";
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

/** After the awards — Support a Special-Needs School Across Africa. */
export function SchoolImpactSection() {
  const { t } = useTranslation("pages");
  const steps = [
    t("landingLean.impact.s1", "SCEF"),
    t("landingLean.impact.s2", "NESA-Africa (recognise)"),
    t("landingLean.impact.s3", "EduAid-Africa (support)"),
  ];
  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-school-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">{t("landingLean.impact.eyebrow", "After the awards: Education Social Impact")}</div>
          <h2 id="ed-school-heading" className="ed-section-title">
            {t("landingLean.impact.title", "From recognition to impact: Support a Special-Needs School Across Africa")}
          </h2>
          <p className="ed-section-sub">
            {t("landingLean.impact.line", "Recognition is the start. Through EduAid-Africa, SCEF and NESA-Africa turn recognition into support for specialist and inclusive schools — one verified school in each of eight African regions in 2027.")}
          </p>
        </div>
        <ol className="mb-6 flex list-none flex-wrap items-center justify-center gap-2 text-sm text-white/85" aria-label={t("landingLean.impact.stepsLabel", "How support flows")}>
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="ed-stat-pill">{s}</span>
              {i < steps.length - 1 && <span aria-hidden="true" className="text-gold">→</span>}
            </li>
          ))}
        </ol>
        <ul className="flex list-none snap-x gap-3 overflow-x-auto pb-3" aria-label={t("landingLean.impact.catsLabel", "Support categories")}>
          {SNS_CATEGORIES.filter((c) => c.image).map((c) => (
            <li key={c.title} className="w-36 shrink-0 snap-start">
              <img src={c.image!.src} alt={c.image!.alt} loading="lazy" decoding="async" className="aspect-square w-full rounded-lg object-cover" />
              <p className="mt-1 text-xs leading-snug text-white/75">{c.title}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={`${SCHOOL}#take-part`} className="ed-btn-primary">{t("landingLean.impact.nominate", "Nominate a School")}</Link>
          <button type="button" disabled aria-disabled="true" className="ed-btn-ghost cursor-not-allowed opacity-60">
            {t("landingLean.impact.vote", "Vote (opens Sept 2027)")}
          </button>
          <Link to={`${SCHOOL}#donate`} className="ed-btn-ghost">{t("landingLean.impact.donate", "Donate / Fund a Scholarship")}</Link>
          <Link to={`${SCHOOL}#sponsor-form`} className="ed-btn-ghost">{t("landingLean.impact.sponsor", "Sponsor or Partner")}</Link>
        </div>
        <p className="ed-disclaimer mt-6">
          {t("landingLean.impact.integrity", "Donations and sponsorship never influence awards, judging or school selection.")}
        </p>
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
