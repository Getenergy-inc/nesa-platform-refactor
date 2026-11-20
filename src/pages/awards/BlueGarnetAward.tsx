import { TierArtworkBand, TierFamiliesSection, SchoolSupportBanner } from "@/features/tiers/TierPageExtras";
import tierImage from "@/assets/story/tier-gold-blue-garnet.jpg";
import tierBadge from "@/assets/certificates/blue-garnet-certificate.jpeg";
import { TierNomineeDirectory } from "@/features/tiers/TierNomineeDirectory";
import AwardCategoryStandardPage from "./AwardCategoryStandardPage";
import TierCategoriesGrid from "@/components/recognition2026/TierCategoriesGrid";

/** Premium Gold-Blue Garnet competitive recognition page (continental honourees). */
export default function BlueGarnetAward() {
  return (
    <>
      <AwardCategoryStandardPage slug="gold-blue-garnet" />
      <TierArtworkBand image={tierImage} badge={tierBadge} name="Gold–Blue Garnet" />
      <TierFamiliesSection tier={4} title="Gold–Blue Garnet recognition pathways" />
      <TierCategoriesGrid
        tier="gold-blue-garnet"
        intro="Nine categories under the Gold-Blue Garnet 2026 Recognition Edition — open each category page to view eligibility, evidence and the dedicated nomination pathway."
      />
      <TierNomineeDirectory tier={4} title="Gold–Blue Garnet nominees" />
      <SchoolSupportBanner />
    </>
  );
}
