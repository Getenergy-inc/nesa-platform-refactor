import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { RegionKey } from "@/config/schoolSupport";

export type SponsorMode = "sponsor" | "partner";
type Ctx = {
  donateRegion: RegionKey | "any"; setDonateRegion: (r: RegionKey | "any") => void;
  sponsorMode: SponsorMode; setSponsorMode: (m: SponsorMode) => void;
  sponsorRegion: RegionKey | null; setSponsorRegion: (r: RegionKey | null) => void;
  goDonate: (r?: RegionKey | "any") => void;
  goSponsor: (m?: SponsorMode, r?: RegionKey | null) => void;
  goAnchor: (id: string) => void;
};
const SupportCtx = createContext<Ctx | null>(null);

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export function SupportPageProvider({ children }: { children: ReactNode }) {
  const [donateRegion, setDonateRegion] = useState<RegionKey | "any">("any");
  const [sponsorMode, setSponsorMode] = useState<SponsorMode>("sponsor");
  const [sponsorRegion, setSponsorRegion] = useState<RegionKey | null>(null);
  const goDonate = useCallback((r?: RegionKey | "any") => { if (r) setDonateRegion(r); requestAnimationFrame(() => scrollToId("donate")); }, []);
  const goSponsor = useCallback((m?: SponsorMode, r?: RegionKey | null) => {
    if (m) setSponsorMode(m); if (r !== undefined) setSponsorRegion(r);
    requestAnimationFrame(() => scrollToId("sponsor-form"));
  }, []);
  return (
    <SupportCtx.Provider value={{ donateRegion, setDonateRegion, sponsorMode, setSponsorMode, sponsorRegion, setSponsorRegion, goDonate, goSponsor, goAnchor: scrollToId }}>
      {children}
    </SupportCtx.Provider>
  );
}
export function useSupportPage() {
  const v = useContext(SupportCtx);
  if (!v) throw new Error("useSupportPage must be used inside SupportPageProvider");
  return v;
}
