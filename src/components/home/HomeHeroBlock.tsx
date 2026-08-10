// HomeHeroBlock — Phase 1 above-the-fold hero for `/`.
// Composes Phase 0 primitives: HeroCompact (H1 + one primary + one secondary
// + one tertiary CTA), TierNoticeBanner (2026 Recognition Edition), and
// TrustIndicators (§12 five markers). Analytics slots: `hero_cta_click`.

import { HeroCompact, TierNoticeBanner, TrustIndicators } from "@/components/common";
import { trackEvent } from "@/lib/analytics";
import heroImage from "@/assets/refactor/home-hero-2026.jpg";

function fire(slot: "primary" | "secondary" | "tertiary", href: string) {
  return () => trackEvent("hero_cta_click", { slot, href, surface: "home" });
}

export function HomeHeroBlock() {
  return (
    <>
      <HeroCompact
        eyebrow="NESA-Africa 2026 · Recognition Edition"
        title="Africa's Education Recognition & Impact Platform"
        lede="Recognising the Enablers of Education for All Across Africa — across 8 regions and the African Diaspora, four recognition tiers, and verified profiles built to attract partnerships, funding, and intervention."
        primary={{
          label: "Nominate an Education Enabler",
          href: "/nominate",
          onClick: fire("primary", "/nominate"),
        }}
        secondary={{
          label: "Explore the Impact Directory",
          href: "/nominees",
          onClick: fire("secondary", "/nominees"),
        }}
        tertiary={{
          label: "How recognition works",
          href: "/about/how-it-works",
          onClick: fire("tertiary", "/about/how-it-works"),
        }}
        imageSrc={heroImage}
        imageAlt="African educators, students, and community leaders across the continent"
      />

      <section aria-label="2026 recognition notice" className="bg-charcoal">
        <div className="container mx-auto px-4 py-6">
          <TierNoticeBanner kind="recognition" />
        </div>
      </section>

      <TrustIndicators />
    </>
  );
}

export default HomeHeroBlock;
