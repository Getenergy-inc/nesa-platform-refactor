import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function NGOEducationAfricaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("bg-ngo-africa")} theme="ngo" />;
}
