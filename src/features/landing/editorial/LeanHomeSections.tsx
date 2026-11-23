import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
// Lean homepage sections (homepage only). Reuse the `.nesa-ed` editorial skin.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import tierIcon from "@/assets/story/tier-africa-education-icon.jpg";
import tierInfluencer from "@/assets/story/tier-influencer-education-impact.jpg";
import tierPlatinum from "@/assets/story/tier-platinum.jpg";
import tierGarnet from "@/assets/story/tier-gold-blue-garnet.jpg";
import { SNS_CATEGORIES, SNS_HERO_IMAGE } from "@/config/schoolSupport";
import eduAidLogo from "@/assets/school-support/eduaid-africa-logo.webp.asset.json";
import friendsLogo from "@/assets/school-support/friends-of-eduaid-africa-logo.jpg.asset.json";
import scefLogo from "@/assets/school-support/scef-logo.png.asset.json";
import { ICON_PATHWAYS } from "@/config/brandHierarchy";
import { ICON_NOMINEES, bySubcategory, type IconSubcategorySlug, type IconNominee } from "@/data/iconAward";
import { getInitials } from "@/components/influencer-impact/InitialsAvatar";
import { useNominees } from "@/hooks/useNominees";
import { TIER_DB_CATEGORIES } from "@/features/tiers/TierNomineeDirectory";
import { useFamilyBuckets } from "@/hooks/useFamilyGallery";
import { useInfluencerPathwayNominees } from "@/hooks/useInfluencerPathwayNominees";
import { StripScroller } from "./StripScroller";
import { ENDORSERS } from "./PartnersBandSection";

const SCHOOL = "/impact/special-needs-schools";
const SCHOOL_ORGANISATION_LOGOS = [
  { id: "scef", src: scefLogo.url },
  { id: "eduaid", src: eduAidLogo.url },
  { id: "friends", src: friendsLogo.url },
] as const;

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

const STRIP_BATCH = 24;

type StripPerson = { id: string; name: string; photo: string | null; kind: "photo" | "logo"; href: string };

const okUrl = (u?: string | null) => (u && (/^https?:\/\//.test(u) || u.startsWith("/")) && !/placeholder|no-image|default-avatar/i.test(u) ? u : null);

/** Fixed-size nominee card: photo, logo on a white tile, or initials. */
function TierCard({ p }: { p: StripPerson }) {
  const [broken, setBroken] = useState(false);
  const [logo, setLogo] = useState(p.kind === "logo");
  const show = p.photo && !broken;
  return (
    <Link to={p.href} title={p.name} className="group flex w-[112px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-gold/15 bg-white/[0.03] hover:border-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
      <div className={`h-[140px] w-full overflow-hidden ${show && logo ? "bg-white" : "bg-charcoal/60"}`}>
        {show ? (
          <img src={p.photo!} alt={p.name} width={112} height={140} loading="lazy" decoding="async" onError={() => setBroken(true)}
            onLoad={(e) => { const i = e.currentTarget; if (i.naturalWidth > i.naturalHeight * 1.05) setLogo(true); }}
            className={`h-full w-full ${logo ? "object-contain p-2" : "object-cover"}`} />
        ) : (
          <div role="img" aria-label={p.name} className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/20 to-charcoal">
            <span className="font-serif text-xl text-gold/80">{getInitials(p.name)}</span>
          </div>
        )}
      </div>
      <p className="line-clamp-2 p-2 text-[11px] font-semibold leading-tight text-white group-hover:text-gold">{p.name}</p>
    </Link>
  );
}

/** Horizontal strip that renders cards in batches as the user scrolls along it. */
function TierStrip({ people, label }: { people: StripPerson[]; label: string }) {
  const [count, setCount] = useState(STRIP_BATCH);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || count >= people.length) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) setCount((c) => c + STRIP_BATCH); }, { rootMargin: "0px 400px" });
    io.observe(el);
    return () => io.disconnect();
  }, [count, people.length]);
  return (
    <StripScroller label={label}>
      {people.slice(0, count).map((p) => <TierCard key={p.id} p={p} />)}
      {count < people.length && <div ref={sentinel} aria-hidden="true" className="w-px shrink-0" />}
    </StripScroller>
  );
}

function dedupe(list: StripPerson[]): StripPerson[] {
  const seen = new Set<string>();
  return list.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
}

const ICON_PEOPLE: StripPerson[] = ICON_NOMINEES.map((n) => ({
  id: n.id, name: n.name, photo: okUrl(n.image_url), kind: "photo",
  href: `/nominees/africa-education-icon-award/${n.award_subcategory_slug}/${n.classification_slug}/${n.slug}`,
}));

/** Live data for tiers 2–4; mounted only once the row nears the viewport. */
function useLiveTierPeople(tier: 2 | 3 | 4) {
  const nominees = useNominees();
  const families = useFamilyBuckets();
  const influencer = useInfluencerPathwayNominees();
  const loading = nominees.isLoading || families.isLoading || (tier === 2 && influencer.loading);
  const people = useMemo(() => {
    const set = new Set(TIER_DB_CATEGORIES[tier]);
    const out: StripPerson[] = [];
    if (tier === 2) {
      for (const b of influencer.pathways) for (const n of b.nominees) out.push({ id: n.id, name: n.name, photo: okUrl(n.imageUrl), kind: n.imageKind, href: n.href });
    }
    for (const entries of Object.values(families.data ?? {})) {
      for (const e of entries) if (e.categorySlug && set.has(e.categorySlug)) out.push({ id: e.id, name: e.name, photo: okUrl(e.imageUrl), kind: e.imageKind, href: e.href });
    }
    for (const n of nominees.data ?? []) {
      if (!n.categorySlug || !set.has(n.categorySlug)) continue;
      out.push({ id: n.id, name: n.name, photo: okUrl(n.photoUrl), kind: n.imageType === "logo" ? "logo" : "photo", href: `/nominees/${n.slug}` });
    }
    const unique = dedupe(out);
    return [...unique.filter((p) => p.photo), ...unique.filter((p) => !p.photo)];
  }, [tier, nominees.data, families.data, influencer.pathways]);
  return { loading, people };
}

function TierRowBody({ people, loading, name }: { people: StripPerson[]; loading: boolean; name: string }) {
  const { t } = useTranslation("pages");
  if (loading) return <div className="mt-3 h-[190px] animate-pulse rounded-xl bg-white/[0.04]" aria-hidden="true" />;
  if (people.length === 0) return <p className="mt-3 text-sm text-white/60">{t("landingLean.tiers.empty", "Nominees will appear here as reviews are completed")}</p>;
  return <div className="mt-3"><TierStrip people={people} label={`${name} ${t("landingLean.tiers.nominees", "nominees")}`} /></div>;
}

function LiveTierRow({ tier, render }: { tier: 2 | 3 | 4; render: (people: StripPerson[], loading: boolean) => React.ReactNode }) {
  const { people, loading } = useLiveTierPeople(tier);
  return <>{render(people, loading)}</>;
}

/** Mount children only when the element nears the viewport. */
function NearViewport({ children, placeholder }: { children: React.ReactNode; placeholder: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (typeof IntersectionObserver === "undefined") { setNear(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) setNear(true); }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);
  return <div ref={ref}>{near ? children : placeholder}</div>;
}

/** Homepage tier order: 1 Icon · 2 Influencers · 3 Platinum · 4 Gold–Blue Garnet — stacked rows, each with a strip of all its nominees. */
export function TierStripSection() {
  const { t } = useTranslation("pages");
  const tiers = [
    { n: 1 as const, name: t("landingLean.tiers.t1.name", "Africa Education Icon"), body: t("landingLean.tiers.t1.body", "The flagship lifetime honour, judged by nine independent judges."), href: "/awards/africa-education-icon", img: tierIcon },
    { n: 2 as const, name: t("landingLean.tiers.t2.name", "Influencers Education Impact"), body: t("landingLean.tiers.t2.body", "Music, social media and sports figures who use their reach for education."), href: "/awards/influencer-education-impact", img: tierInfluencer },
    { n: 3 as const, name: t("landingLean.tiers.t3.name", "Platinum Recognition"), body: t("landingLean.tiers.t3.body", "Libraries, research, faith-based education, leadership, partnerships and the diaspora."), href: "/awards/platinum-recognition", img: tierPlatinum },
    { n: 4 as const, name: t("landingLean.tiers.t4.name", "Gold–Blue Garnet"), body: t("landingLean.tiers.t4.body", "Organisations advancing education through CSR, EduTech, media, NGOs, STEM, arts and policy."), href: "/awards/gold-blue-garnet", img: tierGarnet },
  ];

  const row = (tier: (typeof tiers)[number], people: StripPerson[], loading: boolean) => (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <img src={tier.img} alt={tier.name} loading="lazy" decoding="async" width={96} height={64} className="h-14 w-20 shrink-0 rounded-lg border border-gold/20 object-cover sm:h-16 sm:w-24" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">{t("landingLean.tiers.tierLabel", "Tier")} {tier.n}</p>
          <h3 className="font-serif text-lg leading-tight text-white">{tier.name}</h3>
          <p className="line-clamp-1 text-xs text-white/65">{tier.body}</p>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          {!loading && people.length > 0 && <p className="text-xs text-white/60">{people.length} {t("landingLean.tiers.nominees", "nominees")}</p>}
          <Link to={tier.href} className="text-sm font-semibold text-gold hover:underline">{t("landingLean.tiers.explore", `Explore Tier ${tier.n} →`)}</Link>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-3 text-xs sm:hidden">
        {!loading && people.length > 0 && <span className="text-white/60">{people.length} {t("landingLean.tiers.nominees", "nominees")}</span>}
        <Link to={tier.href} className="font-semibold text-gold hover:underline">{t("landingLean.tiers.explore", `Explore Tier ${tier.n} →`)}</Link>
      </div>
      <TierRowBody people={people} loading={loading} name={tier.name} />
    </>
  );

  return (
    <section className="ed-section" aria-labelledby="ed-tiers-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">{t("landingLean.tiers.eyebrow", "Four tiers")}</div>
          <h2 id="ed-tiers-heading" className="ed-section-title">{t("landingLean.tiers.title", "The Four Tiers at a Glance")}</h2>
        </div>
        <ul className="flex list-none flex-col gap-4">
          {tiers.map((tier) => (
            <li key={tier.n} data-tier={tier.n} className="min-w-0 rounded-2xl border border-gold/20 bg-white/[0.03] p-4">
              <NearViewport placeholder={row(tier, [], true)}>
                {tier.n === 1 ? row(tier, ICON_PEOPLE, false) : <LiveTierRow tier={tier.n} render={(p, l) => row(tier, p, l)} />}
              </NearViewport>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-white/55">{t("landingLean.tiers.reviewNote", "Profiles are published as nominations are reviewed.")}</p>
      </div>
    </section>
  );
}

/** Trust points + endorser logos + governance link. */
export function TrustPartnersSection() {
  const { t } = useTranslation("pages");
  const points = [
    { title: t("landingLean.trust.p1t", "Independent NRRC verification"), body: t("landingLean.trust.p1b", "Every nomination researched and verified before review.") },
    { title: t("landingLean.trust.p2t", "Evidence-based evaluation"), body: t("landingLean.trust.p2b", "Category-specific standards applied consistently across every tier.") },
    { title: t("landingLean.trust.p3t", "No public voting for the 2026 awards"), body: t("landingLean.trust.p3b", "Nine independent Icon judges and nine Icon NRRC members. Nomination is free.") },
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
          <Link to="/about#governance">{t("landingLean.trust.link", "Read our governance →")}</Link>
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
          <a href={PUBLIC_ACTIONS_2026.nominate.href} target="_blank" rel="noopener noreferrer" className="ed-btn-primary">{t("landingLean.closing.nominate", "Nominate")}</a>
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
  const btnPrimary = "inline-flex h-9 items-center rounded-full bg-gold px-4 text-xs font-semibold text-charcoal transition-colors hover:bg-gold/90";
  const btnGhost = "inline-flex h-9 items-center rounded-full border border-gold/40 px-4 text-xs font-semibold text-gold transition-colors hover:bg-gold/10";

  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-pillars-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">{t("landingLean.pillars.eyebrow", "Tier 1 · The flagship honour")}</div>
          <h2 id="ed-pillars-heading" className="ed-section-title">
            {t("landingLean.pillars.title", "Africa Education Icon of the Decade, 2006–2026")}
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tier 1 — Africa Education Icon */}
          <article className="ed-card">
            <div className="ed-card-badge">{t("landingLean.pillars.iconBadge", "2006–2026")}</div>
            <h3><Link to="/awards/africa-education-icon" className="hover:underline">{t("landingLean.pillars.iconTitle", "Africa Education Icon Award")}</Link></h3>
            <p>{t("landingLean.pillars.iconBody", "Up to nine Icons, assessed by nine independent judges, for lifetime contribution to education across Africa.")}</p>
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
                    {t("landingLean.pillars.viewCategory", "View nominees →")}
                  </Link>
                  <IconCategoryNomineeStrip pathwayName={pw.name} nominees={nomineesByPathway[pw.slug] ?? []} />
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={PUBLIC_ACTIONS_2026.nominate.href} target="_blank" rel="noopener noreferrer" className={btnPrimary}>{t("landingLean.pillars.nominate", "Nominate")}</a>
              <Link to="/nominees/africa-education-icon-award" className={btnGhost}>{t("landingLean.pillars.meet", "Meet Icon nominees")}</Link>
              <Link to="/awards/africa-education-icon" className={btnGhost}>{t("landingLean.pillars.iconPage", "Tier 1 page →")}</Link>
            </div>
          </article>

          {/* Post-award service — Special Needs Education Support Africa */}
          <article className="ed-card">
            <div className="ed-card-badge">{t("landingLean.pillars.snsBadge", "Post-award service · EduAid-Africa")}</div>
            <h3><Link to={SCHOOL} className="hover:underline">{t("landingLean.pillars.snsTitle", "From recognition to impact: Support a Special-Needs School Across Africa")}</Link></h3>
            <img
              src={SNS_HERO_IMAGE.src}
              alt={SNS_HERO_IMAGE.alt}
              loading="lazy"
              decoding="async"
              className="mt-4 h-auto w-full rounded-xl border border-gold/20 object-cover"
            />
            <p className="mt-4">{t("landingLean.pillars.snsIntro", "Recognition is the start. Through EduAid-Africa, SCEF and NESA-Africa turn recognition into support for specialist and inclusive schools — one verified school in each of eight African regions in 2027.")}</p>
            <p className="mt-3 text-sm font-semibold text-gold">{t("landingLean.pillars.snsFlow", "SCEF → NESA-Africa recognises → EduAid-Africa supports")}</p>
            <ul className="mt-5 flex list-none snap-x gap-3 overflow-x-auto pb-3" aria-label={t("landingLean.pillars.snsCategories", "School support category pictures")}>
              {SNS_CATEGORIES.filter((category) => category.image).slice(0, 8).map((category) => (
                <li key={category.title} className="w-[104px] shrink-0 snap-start">
                  <img
                    src={category.image!.src}
                    alt={category.image!.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full rounded-lg border border-gold/15 object-cover"
                  />
                  <span className="mt-1.5 block text-[10px] leading-tight text-white/65">{category.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to={`${SCHOOL}#nominate`} className={btnPrimary}>{t("landingLean.impact.nominate", "Nominate a School")}</Link>
              <button type="button" disabled aria-disabled="true" className={`${btnGhost} cursor-not-allowed opacity-70`}>
                {t("landingLean.pillars.vote", "Vote")} · {t("landingLean.pillars.voteTiming", "Opens September 2027")}
              </button>
              <Link to={`${SCHOOL}#donate`} className={btnGhost}>{t("landingLean.pillars.donate", "Donate or Fund a Scholarship")}</Link>
              <Link to={`${SCHOOL}#partner`} className={btnGhost}>{t("landingLean.pillars.partner", "Sponsor or Partner")}</Link>
            </div>
            <p className="mt-3 text-xs text-white/55">{t("landingLean.pillars.snsSeparate", "Donations and sponsorship never influence awards, judging or school selection.")}</p>
            <ul className="mt-5 grid list-none grid-cols-3 items-center gap-2 border-t border-gold/15 pt-4" aria-label={t("landingLean.pillars.snsOrganisations", "School support organisations")}>
              {SCHOOL_ORGANISATION_LOGOS.map((logo) => (
                <li key={logo.id} className="flex h-16 items-center justify-center rounded-lg bg-cream p-2">
                  <img
                    src={logo.src}
                    alt={t(`landingLean.pillars.snsLogos.${logo.id}`, { scef: "Santos Creations Educational Foundation", eduaid: "EduAid-Africa", friends: "Friends of EduAid-Africa" }[logo.id])}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full w-full object-contain"
                  />
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
