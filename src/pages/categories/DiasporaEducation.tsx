import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function DiasporaEducationPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("pt-diaspora")} theme="corporate" />;
}
