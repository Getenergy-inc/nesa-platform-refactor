// /nrc/sign-in — thin wrapper that hands off to the shared secure login with
// a return URL so approved NRC members land inside the arena after auth.

import { Navigate, useSearchParams } from "react-router-dom";

export default function NRCSignIn() {
  const [params] = useSearchParams();
  const next = params.get("next") || "/nrc/dashboard";
  return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
}
