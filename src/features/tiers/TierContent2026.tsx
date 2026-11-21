import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CATEGORIES } from "@/config/recognition2026/categories";
import type { TierNumber } from "./TierNomineeDirectory";
import iconImage from "@/assets/story/tier-africa-education-icon.jpg";
import influencerImage from "@/assets/story/tier-influencer-education-impact.jpg";
import platinumImage from "@/assets/story/tier-platinum.jpg";
import garnetImage from "@/assets/story/tier-gold-blue-garnet.jpg";

const TIER_CONFIG_SLUG: Record<TierNumber, string> = {
  1: "africa-education-icon",
  2: "influencer-education-impact",
  3: "platinum",
  4: "gold-blue-garnet",
};

export const TIER_PRESENTATION_2026 = [
  { tier: 1 as const, name: "Africa Education Icon", image: iconImage, href: "/awards/africa-education-icon", line: "The flagship lifetime honour, judged by nine independent judges." },
  { tier: 2 as const, name: "Influencers Education Impact", image: influencerImage, href: "/awards/influencer-education-impact", line: "Music, social media and sports figures who use their reach for education." },
  { tier: 3 as const, name: "Platinum Recognition", image: platinumImage, href: "/awards/platinum-recognition", line: "Libraries, research, faith-based education, leadership, partnerships and the diaspora." },
  { tier: 4 as const, name: "Gold–Blue Garnet", image: garnetImage, href: "/awards/gold-blue-garnet", line: "Organisations advancing education through CSR, EduTech, media, NGOs, STEM, arts and policy." },
];

export function TierCards2026() {
  const { t } = useTranslation("pages");
  return (
    <section aria-labelledby="awards-tier-cards" className="mb-16">
      <h2 id="awards-tier-cards" className="sr-only">{t("awardsPage.tiers.title", "Four recognition tiers")}</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {TIER_PRESENTATION_2026.map((tier) => (
          <article key={tier.tier} className="overflow-hidden rounded-2xl border border-gold/20 bg-charcoal/60">
            <img src={tier.image} alt={t(`awardsPage.tiers.imageAlt.${tier.tier}`, `${tier.name} — NESA-Africa Tier ${tier.tier}`)} loading="lazy" decoding="async" className="aspect-[16/8] w-full object-cover" />
            <div className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{t("tierPage.eyebrow", "Tier")} {tier.tier}</p>
              <h3 className="mt-2 font-display text-2xl text-white">{t(`awardsPage.tiers.name.${tier.tier}`, tier.name)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{t(`awardsPage.tiers.line.${tier.tier}`, tier.line)}</p>
              <Link to={tier.href} className="mt-4 inline-block text-sm font-semibold text-gold hover:underline">{t("awardsPage.tiers.explore", "Explore tier →")}</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RecognitionPaths2026() {
  const { t } = useTranslation("pages");
  return (
    <div className="mx-auto mb-12 max-w-6xl">
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-gold/25 bg-charcoal/60 p-6">
          <h3 className="font-display text-xl text-gold">{t("recognitionPaths.judgedTitle", "Tier 1, judged")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{t("recognitionPaths.judged", "NRRC research → eligibility approval → nine independent judges → recognition decision.")}</p>
        </article>
        <article className="rounded-2xl border border-gold/25 bg-charcoal/60 p-6">
          <h3 className="font-display text-xl text-gold">{t("recognitionPaths.documentaryTitle", "Tiers 2–4, documentary")}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{t("recognitionPaths.documentary", "NRRC research → governance review → documentary recognition → Certificate of Recognition.")}</p>
        </article>
      </div>
      <p className="mt-5 text-center text-sm leading-relaxed text-white/70">{t("recognitionPaths.note", "Certificates of Recognition are separate from competitive awards. There is no public voting for the 2026 awards.")}</p>
    </div>
  );
}

export function TierRecognitionBullets({ tier }: { tier: TierNumber }) {
  const { t } = useTranslation("pages");
  const categories = CATEGORIES.filter((category) => category.tier === TIER_CONFIG_SLUG[tier]);
  const bullets = categories.flatMap((category) => category.subcategories.length ? category.subcategories.map((sub) => sub.name) : [category.shortName]).slice(0, 5);
  return (
    <section aria-labelledby={`tier-${tier}-recognises`} className="border-b border-gold/10 bg-charcoal py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 id={`tier-${tier}-recognises`} className="font-display text-2xl text-white md:text-3xl">{t("tierPage.recognises", "What this tier recognises")}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {bullets.map((bullet) => <li key={bullet} className="rounded-xl border border-gold/15 bg-white/[0.03] px-4 py-3 text-sm text-white/80">{bullet}</li>)}
        </ul>
      </div>
    </section>
  );
}

export function TierDecisionPath({ tier }: { tier: TierNumber }) {
  const { t } = useTranslation("pages");
  const judged = tier === 1;
  return (
    <section aria-labelledby={`tier-${tier}-decision`} className="border-y border-gold/10 bg-black/30 py-12">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h2 id={`tier-${tier}-decision`} className="font-display text-2xl text-white md:text-3xl">{t("tierPage.decision", "How this tier is decided")}</h2>
        <p className="mt-2 text-sm font-semibold text-gold">{judged ? t("recognitionPaths.judgedTitle", "Tier 1, judged") : t("recognitionPaths.documentaryTitle", "Tiers 2–4, documentary")}</p>
        <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">{judged ? t("recognitionPaths.judged", "NRRC research → eligibility approval → nine independent judges → recognition decision.") : t("recognitionPaths.documentary", "NRRC research → governance review → documentary recognition → Certificate of Recognition.")}</p>
        <p className="mt-4 text-xs leading-relaxed text-white/60">{t("recognitionPaths.note", "Certificates of Recognition are separate from competitive awards. There is no public voting for the 2026 awards.")}</p>
      </div>
    </section>
  );
}
