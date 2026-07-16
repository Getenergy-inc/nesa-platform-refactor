import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function IslamicEducationAfricaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("pt-islamic")} theme="legacy" />;
}
