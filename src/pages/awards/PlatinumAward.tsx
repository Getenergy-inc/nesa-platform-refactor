import { TierArtworkBand, TierFamiliesSection, SchoolSupportBanner } from "@/features/tiers/TierPageExtras";
import tierImage from "@/assets/story/tier-platinum.jpg";
import tierBadge from "@/assets/certificates/platinum-certificate.jpeg";
import { TierNomineeDirectory } from "@/features/tiers/TierNomineeDirectory";
import AwardCategoryStandardPage from "./AwardCategoryStandardPage";
import TierCategoriesGrid from "@/components/recognition2026/TierCategoriesGrid";

/** Premium Platinum Recognition page. */
export default function PlatinumAward() {
  return (
    <>
      <AwardCategoryStandardPage slug="platinum-recognition" />
      <TierArtworkBand image={tierImage} badge={tierBadge} name="Platinum Recognition" />
      <TierFamiliesSection tier={3} title="Platinum recognition pathways" />
      <TierCategoriesGrid
        tier="platinum"
        intro="Seven Platinum institutional-leadership categories. Open each category page for eligibility, evidence and the dedicated nomination pathway."
      />
      <TierNomineeDirectory tier={3} title="Platinum Recognition nominees" />
      <SchoolSupportBanner />
    </>
  );
}
