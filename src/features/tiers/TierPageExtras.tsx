// Tier-page sections moved off the old homepage: recognition-family cards,
// tier artwork and the post-award school-support banner. Presentation only.
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RECOGNITION_FAMILIES } from "@/config/brandHierarchy";
import { CATEGORIES } from "@/config/recognition2026/categories";
import { FamilyEnablerStrip } from "@/features/landing/editorial/FamilyEnablerStrip";
import { TIER_DB_CATEGORIES } from "./TierNomineeDirectory";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { RecognitionIntegrityLine } from "@/components/nesa/SiteWideContent2026";
import "@/features/landing/editorial/editorial.css";

const TIER_SLUG = { 2: "influencer-education-impact", 3: "platinum", 4: "gold-blue-garnet" } as const;

/** Same CTA overrides the old homepage families section used. */
const FAMILY_CTA_OVERRIDES: Record<string, { nominate?: string; explore?: string }> = {
  "influencer-education-impact": {
    nominate: "/nominate?tier=influencer-2026",
    explore: "/awards/influencer-education-impact/nominees",
  },
};

/** Families whose categories belong to the given tier (via categories config `tier`). */
export function familiesForTier(tier: 2 | 3 | 4) {
  return RECOGNITION_FAMILIES.filter((f) =>
    f.categorySlugs.some((slug) => CATEGORIES.find((c) => c.slug === slug)?.tier === TIER_SLUG[tier]),
  );
}

export function TierFamiliesSection({ tier, title }: { tier: 2 | 3 | 4; title: string }) {
  const families = familiesForTier(tier);
  if (families.length === 0) return null;
  return (
    <div className="nesa-ed">
      <section className="ed-section" aria-labelledby={`tier-${tier}-families`}>
        <div className="ed-wrap">
          <div className="ed-section-head">
            <div className="ed-eyebrow">Recognition Pathways</div>
            <h2 id={`tier-${tier}-families`} className="ed-section-title">{title}</h2>
          </div>
          <div className="ed-grid-3">
            {families.map((f) => {
              const cta = FAMILY_CTA_OVERRIDES[f.slug] ?? {};
              const exploreHref = cta.explore ?? `/nominees?family=${f.slug}`;
              return (
                <article key={f.slug} className="ed-card min-w-0">
                  <div className="ed-card-badge">Recognition Pathway</div>
                  <h3><Link to={`/recognition/${f.slug}`} className="hover:underline">{f.name}</Link></h3>
                  <p>{f.lede}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <a href={PUBLIC_ACTIONS_2026.nominate.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center rounded-full bg-gold px-4 text-xs font-semibold text-charcoal transition-colors hover:bg-gold/90">Nominate</a>
                    <Link to={exploreHref} className="inline-flex h-9 items-center rounded-full border border-gold/40 px-4 text-xs font-semibold text-gold transition-colors hover:bg-gold/10">Meet the nominees</Link>
                    <Link to={`/recognition/${f.slug}`} className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-xs font-semibold text-white/80 transition-colors hover:border-gold/40 hover:text-gold">Explore {f.name} →</Link>
                  </div>
                  <FamilyEnablerStrip familySlug={f.slug} familyName={f.name} exploreHref={exploreHref} categoryFilter={tier === 2 ? undefined : TIER_DB_CATEGORIES[tier]} />
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

/** Tier image + certificate badge band. */
export function TierArtworkBand({ image, badge, name }: { image: string; badge: string; name: string }) {
  return (
    <section aria-label={`${name} artwork`} className="bg-charcoal py-10">
      <div className="container mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-[2fr_1fr]">
        <img src={image} alt={`${name} — NESA-Africa recognition tier`} loading="lazy" decoding="async" className="aspect-[16/9] w-full rounded-2xl border border-gold/20 object-cover" />
        <img src={badge} alt={`${name} certificate`} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-2xl border border-gold/20 bg-white object-contain p-2 md:aspect-auto md:h-full" />
      </div>
    </section>
  );
}

export function SchoolSupportBanner() {
  const { t } = useTranslation("pages");
  return (
    <div className="bg-charcoal pb-12">
      <RecognitionIntegrityLine className="mb-8" />
      <div className="container mx-auto max-w-6xl px-4">
        <Link to="/impact/special-needs-schools" className="block rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm text-white/85 hover:border-gold/60">
          {t("tierPage.school", "After the awards: Support a Special-Needs School Across Africa through EduAid-Africa →")}
        </Link>
      </div>
    </div>
  );
}
