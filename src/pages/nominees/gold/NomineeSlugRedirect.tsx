import { Navigate, useParams } from "react-router-dom";
import { getAllGoldNominees } from "@/data/goldSpecialRecognition";

/**
 * Universal Gold nominee profile resolver.
 * Matches /nominee/:slug to its Gold category and forwards to the full profile page.
 */
export default function NomineeSlugRedirect() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/nominees/gold-special-recognition" replace />;
  const hit = getAllGoldNominees().find(({ nominee }) => nominee.slug === slug);
  if (!hit) return <Navigate to="/nominees/gold-special-recognition" replace />;
  return <Navigate to={`/nominees/gold-special-recognition/${hit.category.slug}/${hit.nominee.slug}`} replace />;
}
