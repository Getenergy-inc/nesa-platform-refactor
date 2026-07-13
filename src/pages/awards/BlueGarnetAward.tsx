import AwardCategoryStandardPage from "./AwardCategoryStandardPage";
import TierCategoriesGrid from "@/components/recognition2026/TierCategoriesGrid";

/** Premium Gold-Blue Garnet competitive recognition page (continental honourees). */
export default function BlueGarnetAward() {
  return (
    <>
      <AwardCategoryStandardPage slug="gold-blue-garnet" />
      <TierCategoriesGrid
        tier="gold-blue-garnet"
        intro="Nine categories under the Gold-Blue Garnet 2026 Recognition Edition — open each category page to view eligibility, evidence and the dedicated nomination pathway."
      />
    </>
  );
}
