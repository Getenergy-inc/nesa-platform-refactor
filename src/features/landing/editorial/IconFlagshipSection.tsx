import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
// Homepage — Africa Education Icon flagship band.
// Names and eligible communities are sourced from brandHierarchy.ts, never
// retyped in prose, to prevent naming drift.

import { Link } from "react-router-dom";
import { Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  RECOGNITION_COMMUNITIES,
  ICON_PATHWAYS,
} from "@/config/brandHierarchy";

const COMMUNITY_COPY: Record<string, string> = {
  "africans-in-africa": "Africans Living in Africa — citizens and residents advancing education in their countries, regions or across the continent.",
  "diaspora-africans": "Africans in the Diaspora — Africans abroad whose knowledge, funding, advocacy, partnerships or technology supports education in Africa.",
  "friends-of-africa": "Friends of Africa — people not African by nationality or heritage with a genuine, sustained and verifiable commitment to education in Africa: international educators, philanthropists, researchers, development partners, volunteers and advocates.",
};

const PATHWAY_TITLES: Record<string, string> = {
  "education-philanthropy-icon": "Education Philanthropy Icon",
  "literary-new-curriculum-advocate": "Literary & New Curriculum Advocate Icon",
  "technical-educator-icon": "Technical Educator Icon",
};

export function IconFlagshipSection() {
  const { t } = useTranslation("pages");
  return (
    <section className="ed-section" aria-labelledby="ed-icon-flagship-heading">
      <div className="ed-wrap">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gold/35 bg-gradient-to-b from-gold/[0.09] to-transparent px-6 py-10 text-center sm:px-10">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <Crown className="h-4 w-4" aria-hidden="true" />
            {t("landingLean.iconFlagship.eyebrow", "Tier 1 · Africa's highest education honour")}
          </p>
          <h2 id="ed-icon-flagship-heading" className="ed-section-title mt-3">
            {t("landingLean.iconFlagship.title", "Who Is an Africa Education Icon?")}
          </h2>
          <p className="mt-1 font-serif text-lg text-white/85">
            {t("landingLean.iconFlagship.tagline", "Africa's Flagship Lifetime Education Honour")}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            {t("landingLean.iconFlagship.intro", "An Africa Education Icon is a person whose sustained and verifiable work has made an exceptional contribution to education in Africa over the decade 2006–2026 — by expanding access, funding schools and scholarships, advancing literacy and curriculum, building technical and digital skills, or creating education models with lasting impact.")}
          </p>

          <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label={t("landingLean.iconFlagship.communities", "Eligible communities")}>
            {RECOGNITION_COMMUNITIES.map((c) => (
              <li key={c.slug} className="ed-stat-pill">
                {t(`landingLean.iconFlagship.eligibility.${c.slug}`, COMMUNITY_COPY[c.slug] ?? c.name)}
              </li>
            ))}
          </ul>

          <ul className="mt-6 grid gap-3 text-left sm:grid-cols-3" aria-label={t("landingLean.iconFlagship.pathways", "Icon pathways")}>
            {ICON_PATHWAYS.map((p) => (
              <li key={p.slug} className="rounded-xl border border-gold/20 bg-white/[0.03] p-4">
                <h3 className="font-serif text-base text-white">{t(`landingLean.iconFlagship.categories.${p.slug}.name`, PATHWAY_TITLES[p.slug] ?? p.name)}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/65">{t(`landingLean.iconFlagship.categories.${p.slug}.blurb`, p.blurb)}</p>
                <Link to={p.nomineesHref} className="mt-2 inline-block text-xs font-semibold text-gold hover:underline">{t("landingLean.iconFlagship.viewNominees", "View nominees →")}</Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/awards/africa-education-icon" className="ed-btn-primary">
              {t("landingLean.iconFlagship.explore", "Explore Tier 1 — Africa Education Icons")}
            </Link>
            <a href={PUBLIC_ACTIONS_2026.nominate.href} target="_blank" rel="noopener noreferrer" className="ed-btn-ghost">
              {t("landingLean.iconFlagship.nominate", "Submit a Nomination")}
            </a>
          </div>

          <p className="mt-6 text-xs text-white/50">{t("landingLean.iconFlagship.governance", "Public visibility alone does not make someone an Icon. Recognition is based on evidence of meaningful and sustained education impact. Being associated with Africa is not enough: the contribution must benefit African learners and be supported by credible evidence.")}</p>
        </div>
      </div>
    </section>
  );
}

export default IconFlagshipSection;
