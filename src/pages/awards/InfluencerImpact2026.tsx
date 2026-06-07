import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { HeroSection } from "@/components/influencer-impact/HeroSection";
import { CategoryCards } from "@/components/influencer-impact/CategoryCards";
import { NomineeDiscovery } from "@/components/influencer-impact/NomineeDiscovery";
import { EvidenceImpactSection } from "@/components/influencer-impact/EvidenceImpactSection";
import { EDXFrameworkPanel } from "@/components/influencer-impact/EDXFrameworkPanel";
import { GovernanceNotice } from "@/components/influencer-impact/GovernanceNotice";
import { ProjectTimelineSection } from "@/components/influencer-impact/ProjectTimelineSection";
import { AWARD_ROUTE, type CategoryId } from "@/config/awards/influencerImpact2026";

export default function InfluencerImpact2026() {
  const [category, setCategory] = useState<CategoryId | "all">("all");

  const handleSelectCategory = (id: CategoryId) => {
    setCategory((prev) => (prev === id ? "all" : id));
    requestAnimationFrame(() => {
      document.getElementById("nominees")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <>
      <Helmet>
        <title>
          Influencer Education Impact Award 2026 | NESA-Africa
        </title>
        <meta
          name="description"
          content="Africa's most influential voices advancing education. Recognising creators, athletes, musicians, digital innovators and cultural icons turning influence into measurable education impact."
        />
        <meta
          property="og:title"
          content="Influencer Education Impact Award 2026 | NESA-Africa"
        />
        <meta
          property="og:description"
          content="Discover Africans transforming influence into measurable education impact across social media, sports and music."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://nesaafrica.lovable.app${AWARD_ROUTE}`} />
      </Helmet>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Awards", path: "/awards" },
          {
            name: "Influencer Education Impact Award 2026",
            path: AWARD_ROUTE,
          },
        ]}
      />

      <div className="min-h-screen bg-charcoal pb-20">
        <NESAHeader />
        <HeroSection />
        <CategoryCards onSelectCategory={handleSelectCategory} selected={category} />
        <EvidenceImpactSection />
        <NomineeDiscovery category={category} onCategoryChange={setCategory} />
        <EDXFrameworkPanel />
        <ProjectTimelineSection />
        <GovernanceNotice />
        <NESAFooter />
      </div>
    </>
  );
}
