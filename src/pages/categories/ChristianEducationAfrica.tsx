import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function ChristianEducationAfricaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("pt-christian")} theme="legacy" />;
}
