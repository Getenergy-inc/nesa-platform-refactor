import { Navigate, useParams } from "react-router-dom";
import { getAllGoldNominees } from "@/data/goldSpecialRecognition";
import { getIconNominee, profileUrl as iconProfileUrl } from "@/data/iconAward";
import IconNomineeProfile from "@/pages/nominees/icon/IconNomineeProfile";

/**
 * Universal nominee profile resolver.
 * - Icon Award nominees are rendered directly via IconNomineeProfile.
 * - Gold Special Recognition nominees are redirected to their category-specific path.
 */
export default function NomineeSlugRedirect() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/nominees/africa-education-icon-award" replace />;

  // Icon Award match → render profile inline (preserves URL)
  if (getIconNominee(slug)) {
    return <IconNomineeProfile />;
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
