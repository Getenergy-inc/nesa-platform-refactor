// AwardSubpageRoute — renders any of the 22 canonical subpages by slug.
// URL: /recognition/subpage/:slug

import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AwardSubpageTemplate } from "@/components/awards/subpage/AwardSubpageTemplate";
import { getSubpage } from "@/config/awards/subpages2026";

export default function AwardSubpageRoute() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/recognition" replace />;
  const content = getSubpage(slug);
  if (!content) return <Navigate to="/recognition" replace />;
  return <AwardSubpageTemplate content={content} />;
}
