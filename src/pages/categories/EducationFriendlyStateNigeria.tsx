import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function EducationFriendlyStateNigeriaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("bg-education-state-nigeria")} theme="regional" />;
}
