import { TierArtworkBand, TierFamiliesSection, SchoolSupportBanner } from "@/features/tiers/TierPageExtras";
import tierImage from "@/assets/story/tier-platinum.jpg";
import tierBadge from "@/assets/certificates/platinum-certificate.jpeg";
import { TierNomineeDirectory } from "@/features/tiers/TierNomineeDirectory";
import { TierDecisionPath, TierRecognitionBullets } from "@/features/tiers/TierContent2026";
import AwardCategoryStandardPage from "./AwardCategoryStandardPage";
import TierCategoriesGrid from "@/components/recognition2026/TierCategoriesGrid";
import { useTranslation } from "react-i18next";

/** Premium Platinum Recognition page. */
export default function PlatinumAward() {
  const { t } = useTranslation("pages");
  return (
    <>
      <AwardCategoryStandardPage
        slug="platinum-recognition"
        heroBadge={t("tier3.hero.eyebrow", "Tier 3")}
        heroLead={t("tier3.hero.line", "Certificates of Recognition for libraries, research, faith-based education, education leadership, partnerships and the diaspora.")}
        heroPrimaryCta={{ label: t("tierPage.nominate", "Nominate"), href: "#nominate" }}
        heroSecondaryCta={{ label: t("tierPage.meetNominees", "Meet the nominees ↓"), href: "#nominees" }}
        afterHero={<><TierArtworkBand image={tierImage} badge={tierBadge} name="Platinum Recognition" /><TierRecognitionBullets tier={3} /></>}
        afterPathways={<><TierFamiliesSection tier={3} title="Platinum recognition pathways" /><TierCategoriesGrid tier="platinum" intro="Seven Platinum institutional-leadership categories. Open each category page for eligibility, evidence and the dedicated nomination pathway." /></>}
        beforeNominees={<TierDecisionPath tier={3} />}
        nomineeDirectory={<TierNomineeDirectory tier={3} title="Platinum Recognition nominees" />}
        hideFinalCta
      />
      <SchoolSupportBanner />
    </>
  );
}
