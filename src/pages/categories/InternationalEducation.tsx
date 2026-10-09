import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function InternationalEducationPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("pt-international")} theme="corporate" />;
}
