import { useTranslation } from "react-i18next";

export function IconGovernanceNote() {
  const { t } = useTranslation("pages");
  return (
    <div className="ed-wrap pb-10">
      <div className="mx-auto max-w-3xl space-y-3 border-t border-gold/15 pt-5 text-center">
        <p className="text-sm leading-relaxed text-white/70">
          {t("tier1.governance.note", "Icons are assessed by nine independent judges using published criteria, after NRRC research and eligibility approval. There is no public voting. Sponsors, partners and donors have no role in judging.")}
        </p>
        <p className="text-sm font-semibold leading-relaxed text-gold">
          {t("tier1.governance.announcement", "The Africa Education Icons of the Decade will be announced at the Online Recognition Programme on 28 December 2026.")}
        </p>
      </div>
    </div>
  );
}

export default IconGovernanceNote;
