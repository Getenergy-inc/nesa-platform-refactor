import { TierNomineeDirectory } from "@/features/tiers/TierNomineeDirectory";
import AwardCategoryStandardPage from "./AwardCategoryStandardPage";
import TierCategoriesGrid from "@/components/recognition2026/TierCategoriesGrid";

/** Premium Platinum Recognition page. */
export default function PlatinumAward() {
  return (
    <>
      <AwardCategoryStandardPage slug="platinum-recognition" />
      <TierCategoriesGrid
        tier="platinum"
        intro="Seven Platinum institutional-leadership categories. Open each category page for eligibility, evidence and the dedicated nomination pathway."
      />
      <TierNomineeDirectory tier={3} title="Platinum Recognition nominees" />
    </>
  );
}
