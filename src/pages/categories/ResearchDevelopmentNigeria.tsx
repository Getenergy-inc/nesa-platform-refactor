import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function ResearchDevelopmentNigeriaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("pt-rnd")} theme="stem" />;
}
