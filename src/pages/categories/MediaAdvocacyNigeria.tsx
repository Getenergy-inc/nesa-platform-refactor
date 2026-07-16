import DetailedCategoryPageTemplate from "@/components/awards/DetailedCategoryPageTemplate";
import { getPathwayPage } from "@/content/contentBible2026/pathwayPages";

export default function MediaAdvocacyNigeriaPage() {
  return <DetailedCategoryPageTemplate page={getPathwayPage("bg-media-nigeria")} theme="media" />;
}
