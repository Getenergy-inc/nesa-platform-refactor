// LegacyCategoryRedirect — resolves a legacy category slug via the DB spine and
// navigates to the canonical `/awards/explore/:tier/:category` path.
// Falls back to /recognition when the slug is unknown so users are never
// dead-ended on an orphaned URL.

import { Navigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCategoryResolver } from "@/hooks/useCategoryResolver";

export default function LegacyCategoryRedirect() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { loading, resolved, error } = useCategoryResolver(categorySlug);

  if (loading) {
    return (
      <div
        role="status"
        className="flex min-h-[40vh] items-center justify-center gap-2 text-white/70"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Redirecting…
      </div>
    );
  }
  if (error || !resolved) {
    return <Navigate to="/recognition" replace />;
  }
  return <Navigate to={resolved.path} replace />;
}
