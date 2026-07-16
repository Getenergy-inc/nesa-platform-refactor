import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function NGOEducationNigeriaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("bg-ngo-nigeria")} theme="ngo" />;
}
