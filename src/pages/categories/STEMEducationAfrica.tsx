import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function STEMEducationAfricaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("bg-stem-africa")} theme="stem" />;
}
