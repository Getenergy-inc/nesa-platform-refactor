import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  getSubcategoryBySlug,
  isRegisteredSubcategorySlug,
} from "@/config/recognition/subcategoryRegistry";
import SubcategoryLandingPage from "./SubcategoryLandingPage";
import NomineeProfile from "../NomineeProfile";
import { trackEvent } from "@/lib/analytics";

/**
 * Resolves /nominees/:slug:
 *   - If slug matches the canonical SUBCATEGORY_REGISTRY, render the
 *     SubcategoryLandingPage (Tier 1–4 + Africa-regional permutations).
 *   - Otherwise fall through to the existing NomineeProfile (individual
 *     nominee by slug). Preserves all legacy nominee profile URLs.
 */
export default function NomineeSlugDispatcher() {
  const { slug } = useParams<{ slug: string }>();
  const entry = slug ? getSubcategoryBySlug(slug) : undefined;

  useEffect(() => {
    if (entry) {
      trackEvent("subcategory_page_view", {
        slug: entry.slug,
        tier: entry.tier,
        parent: entry.parentCategorySlug,
        regional: !!entry.isRegional,
      });
    }
  }, [entry]);

  if (slug && isRegisteredSubcategorySlug(slug) && entry) {
    return <SubcategoryLandingPage entry={entry} />;
  }
  return <NomineeProfile />;
}
