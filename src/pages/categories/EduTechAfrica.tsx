import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function EduTechAfricaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("bg-edutech-africa")} theme="stem" />;
}
