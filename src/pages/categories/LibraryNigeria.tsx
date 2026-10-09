import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function LibraryNigeriaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("pt-library-nigeria")} theme="legacy" />;
}
