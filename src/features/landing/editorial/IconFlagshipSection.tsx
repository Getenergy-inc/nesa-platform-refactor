import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
// Homepage — Africa Education Icon flagship band.
// Names and eligible communities are sourced from brandHierarchy.ts, never
// retyped in prose, to prevent naming drift.

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Crown } from "lucide-react";
import {
  BRAND,
  RECOGNITION_COMMUNITIES,
  ICON_NO_PUBLIC_VOTING_NOTE,
  ICON_PATHWAYS,
} from "@/config/brandHierarchy";

export function IconPathwayCards({ homeV3 = false }: { homeV3?: boolean }) {
  const { t } = useTranslation("pages");
  const shortNames: Record<string, string> = {
    "education-philanthropy-icon": t("landingV3.icon.categories.philanthropy", "Education Philanthropy Icon"),
    "literary-new-curriculum-advocate": t("landingV3.icon.categories.literary", "Literary & New Curriculum Advocate Icon"),
    "technical-educator-icon": t("landingV3.icon.categories.technical", "Technical Educator Icon"),
  };

  return (
    <ul className="mt-6 grid gap-3 text-left sm:grid-cols-3" aria-label={t("landingV3.icon.categoriesLabel", "Africa Education Icon categories")}>
      {ICON_PATHWAYS.map((p) => (
        <li key={p.slug} className="rounded-xl border border-gold/20 bg-white/[0.03] p-4">
          <h3 className="font-serif text-base text-white">
            {homeV3 ? shortNames[p.slug] : t(`landingLean.pillars.categories.${p.slug}.name`, p.name)}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-white/65">{t(`landingLean.pillars.categories.${p.slug}.blurb`, p.blurb)}</p>
          <Link to={p.nomineesHref} className="mt-2 inline-block text-xs font-semibold text-gold hover:underline">
            {t("landingV3.icon.viewNominees", "View nominees →")}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function IconFlagshipSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-icon-flagship-heading">
      <div className="ed-wrap">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gold/35 bg-gradient-to-b from-gold/[0.09] to-transparent px-6 py-10 text-center sm:px-10">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <Crown className="h-4 w-4" aria-hidden="true" />
            Flagship Recognition
          </p>
          <h2 id="ed-icon-flagship-heading" className="ed-section-title mt-3">
            {BRAND.flagship}
          </h2>
          <p className="mt-1 font-serif text-lg text-white/85">
            Africa&apos;s Flagship Lifetime Education Honour
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            Honouring exceptional individuals whose lifelong contribution has helped advance
            Education for All across Africa.
          </p>

          <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Eligible communities">
            {RECOGNITION_COMMUNITIES.map((c) => (
              <li key={c.slug} className="ed-stat-pill">
                {c.name}
              </li>
            ))}
          </ul>

          <IconPathwayCards />

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/nominees/africa-education-icon-award" className="ed-btn-primary">
              Explore Africa Education Icons →
            </Link>
            <a href={PUBLIC_ACTIONS_2026.nominate.href} target="_blank" rel="noopener noreferrer" className="ed-btn-ghost">
              Submit a Nomination →
            </a>
          </div>

          <p className="mt-6 text-xs text-white/50">{ICON_NO_PUBLIC_VOTING_NOTE}</p>
        </div>
      </div>
    </section>
  );
}

export default IconFlagshipSection;
