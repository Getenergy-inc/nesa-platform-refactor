import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function CSREducationNigeriaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("bg-csr-nigeria")} theme="corporate" />;
}
