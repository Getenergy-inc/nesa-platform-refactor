// RedirectRoute — react-router helper that substitutes `:param` tokens in the
// destination `to` prop with the current route params before navigating.
//
// Standard <Navigate to="/x/:slug" /> does NOT substitute — it navigates to the
// literal string ":slug". This wrapper enables template-based redirects for the
// Stage 6 legacy-URL consolidation without hand-writing one component per route.

import { Navigate, useParams } from "react-router-dom";

export interface RedirectRouteProps {
  /** Destination path template. `:foo` tokens are replaced with useParams().foo. */
  to: string;
  /** Preserve history entry? Defaults to true (replace). */
  replace?: boolean;
}

export default function RedirectRoute({ to, replace = true }: RedirectRouteProps) {
  const params = useParams();
  const resolved = to.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_, key) => {
    const value = params[key];
    return typeof value === "string" ? value : "";
  });
  return <Navigate to={resolved} replace={replace} />;
}
