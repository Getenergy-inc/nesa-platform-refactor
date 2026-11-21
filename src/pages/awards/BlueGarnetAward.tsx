import { TierArtworkBand, TierFamiliesSection, SchoolSupportBanner } from "@/features/tiers/TierPageExtras";
import tierImage from "@/assets/story/tier-gold-blue-garnet.jpg";
import tierBadge from "@/assets/certificates/blue-garnet-certificate.jpeg";
import { TierNomineeDirectory } from "@/features/tiers/TierNomineeDirectory";
import { TierDecisionPath, TierRecognitionBullets } from "@/features/tiers/TierContent2026";
import AwardCategoryStandardPage from "./AwardCategoryStandardPage";
import TierCategoriesGrid from "@/components/recognition2026/TierCategoriesGrid";
import { useTranslation } from "react-i18next";

/** Gold–Blue Garnet documentary recognition page; the tier video grid stays off. */
export default function BlueGarnetAward() {
  const { t } = useTranslation("pages");
  return (
    <>
      <AwardCategoryStandardPage
        slug="gold-blue-garnet"
        heroBadge={t("tier4.hero.eyebrow", "Tier 4")}
        heroLead={t("tier4.hero.line", "Recognition for organisations advancing education through CSR, EduTech, media, NGOs, STEM, arts and policy.")}
        heroPrimaryCta={{ label: t("tierPage.nominate", "Nominate"), href: "#nominate" }}
        heroSecondaryCta={{ label: t("tierPage.meetNominees", "Meet the nominees ↓"), href: "#nominees" }}
        afterHero={<><TierArtworkBand image={tierImage} badge={tierBadge} name="Gold–Blue Garnet" /><TierRecognitionBullets tier={4} /></>}
        afterPathways={<><TierFamiliesSection tier={4} title="Gold–Blue Garnet recognition pathways" /><TierCategoriesGrid tier="gold-blue-garnet" intro="Nine categories under the Gold-Blue Garnet 2026 Recognition Edition — open each category page to view eligibility, evidence and the dedicated nomination pathway." /></>}
        beforeNominees={<TierDecisionPath tier={4} />}
        nomineeDirectory={<TierNomineeDirectory tier={4} title="Gold–Blue Garnet nominees" />}
        hideFinalCta
      />
      <SchoolSupportBanner />
    </>
  );
}
