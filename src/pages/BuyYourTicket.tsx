import { Navigate } from "react-router-dom";

/** Retired checkout: no ticket, card or physical-gala purchase flow is authorised. */
export default function BuyYourTicket() {
  return <Navigate to="/programme/2026" replace />;
}
