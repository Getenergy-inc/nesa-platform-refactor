import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function CSREducationAfricaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("bg-csr-africa")} theme="corporate" />;
}
