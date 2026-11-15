// Temporary noindex for transitional legacy pages (owner master draft, 15 Nov 2026).
import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";

export function NoIndex({ children }: { children: ReactNode }) {
  return (
    <>
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      {children}
    </>
  );
}
