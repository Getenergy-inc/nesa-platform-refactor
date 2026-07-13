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
    </>
  );
}
