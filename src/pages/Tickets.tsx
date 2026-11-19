import { Navigate } from "react-router-dom";

/** Retired ticket surface: the 2026 programme is online and has no ticket sales. */
export default function Tickets() {
  return <Navigate to="/programme/2026" replace />;
}
