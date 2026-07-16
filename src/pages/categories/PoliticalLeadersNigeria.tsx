import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function PoliticalLeadersNigeriaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("pt-political")} theme="regional" />;
}
