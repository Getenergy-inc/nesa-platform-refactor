import { useParams, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AwardCategoryPage } from "@/components/awards/AwardCategoryPage";
import { getCategoryBySlug, type AwardCategoryConfig } from "@/config/awardCategories";

/**
 * Lazy-load the existing branded hero pages so we keep the rich
 * existing visuals as the "legacyHero" above the structured panel.
 */
const LEGACY_LOADERS: Record<string, ReturnType<typeof lazy> | undefined> = {
  NGOEducationAfrica: lazy(() => import("@/pages/categories/NGOEducationAfrica")),
  NGOEducationNigeria: lazy(() => import("@/pages/categories/NGOEducationNigeria")),
  CSREducationAfrica: lazy(() => import("@/pages/categories/CSREducationAfrica")),
  CSREducationNigeria: lazy(() => import("@/pages/categories/CSREducationNigeria")),
  EduTechAfrica: lazy(() => import("@/pages/categories/EduTechAfrica")),
  STEMEducationAfrica: lazy(() => import("@/pages/categories/STEMEducationAfrica")),
  MediaAdvocacyNigeria: lazy(() => import("@/pages/categories/MediaAdvocacyNigeria")),
  CreativeArtsNigeria: lazy(() => import("@/pages/categories/CreativeArtsNigeria")),
  EducationFriendlyStateNigeria: lazy(() => import("@/pages/categories/EducationFriendlyStateNigeria")),
  LibraryNigeria: lazy(() => import("@/pages/categories/LibraryNigeria")),
  ResearchDevelopmentNigeria: lazy(() => import("@/pages/categories/ResearchDevelopmentNigeria")),
  ChristianEducationAfrica: lazy(() => import("@/pages/categories/ChristianEducationAfrica")),
  IslamicEducationAfrica: lazy(() => import("@/pages/categories/IslamicEducationAfrica")),
  PoliticalLeadersNigeria: lazy(() => import("@/pages/categories/PoliticalLeadersNigeria")),
  InternationalEducation: lazy(() => import("@/pages/categories/InternationalEducation")),
  DiasporaEducation: lazy(() => import("@/pages/categories/DiasporaEducation")),
  AfricaEducationIcon: lazy(() => import("@/pages/categories/AfricaEducationIcon")),
};

interface Props {
  /** Optional explicit config (e.g. for the Icon single page route) */
  config?: AwardCategoryConfig;
}

export default function AwardCategoryRoute({ config: explicit }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const config = explicit ?? (slug ? getCategoryBySlug(slug) : undefined);

  if (!config) return <Navigate to="/awards/categories" replace />;

  const Legacy = config.legacyComponentKey ? LEGACY_LOADERS[config.legacyComponentKey] : undefined;

  return (
    <AwardCategoryPage
      config={config}
      formPosition={config.slug === "africa-education-icon" ? "top" : "bottom"}
      legacyHero={
        Legacy ? (
          <Suspense fallback={null}>
            <Legacy />
          </Suspense>
        ) : null
      }
    />
  );
}
