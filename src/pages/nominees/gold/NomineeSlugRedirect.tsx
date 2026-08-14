import { Navigate, useParams } from "react-router-dom";
import { getAllGoldNominees } from "@/data/goldSpecialRecognition";
import { getIconNominee, profileUrl as iconProfileUrl } from "@/data/iconAward";

/**
 * Universal nominee profile resolver.
 * - Icon Award nominees redirect to the canonical nested profile URL.
 * - Gold Special Recognition nominees are redirected to their category-specific path.
 */
export default function NomineeSlugRedirect() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/nominees/africa-education-icon-award" replace />;

  // Icon Award match → redirect to the canonical 4-segment profile URL
  if (getIconNominee(slug)) {
    return <Navigate to={iconProfileUrl(slug)} replace />;
  }

  // Gold Special Recognition match → redirect to nested path
  const gold = getAllGoldNominees().find(({ nominee }) => nominee.slug === slug);
  if (gold) {
    return (
      <Navigate
        to={`/nominees/gold-special-recognition/${gold.category.slug}/${gold.nominee.slug}`}
        replace
      />
    );
  }

  // No match
  return <Navigate to="/nominees/africa-education-icon-award" replace />;
}
