import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function CreativeArtsNigeriaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("bg-creative-nigeria")} theme="influencer" />;
}
