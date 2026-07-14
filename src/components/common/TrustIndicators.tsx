// TrustIndicators — homepage/landing trust strip.
// Renders the five approved trust markers from §12 of the brief.

import { cn } from "@/lib/utils";

const DEFAULT_ITEMS = [
  { label: "4 Recognition Tiers", detail: "Icon · Blue Garnet · Platinum · Influencer" },
  { label: "NRC-Verified Profiles", detail: "Independent verification of every recognised nominee" },
  { label: "8 Africa Regions", detail: "Continental reach with regional accountability" },
  { label: "African Diaspora", detail: "One continent, one diaspora community, one mission" },
  { label: "Sponsor Independence", detail: "Sponsors fund the platform. They do not influence selection." },
];

export interface TrustIndicatorsProps {
  items?: typeof DEFAULT_ITEMS;
  className?: string;
}

export function TrustIndicators({ items = DEFAULT_ITEMS, className }: TrustIndicatorsProps) {
  return (
    <section
      aria-label="Why NESA-Africa"
      className={cn("border-y border-gold/10 bg-charcoal/95 py-8", className)}
    >
      <div className="container mx-auto grid gap-6 px-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-wide text-gold">{item.label}</p>
            <p className="text-sm text-white/70">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustIndicators;
