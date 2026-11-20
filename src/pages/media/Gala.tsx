import { Navigate } from "react-router-dom";

/** Retired physical-gala surface; the canonical 2026 programme is online only. */
export default function Gala() {
  return <Navigate to="/programme/2026" replace />;
}
