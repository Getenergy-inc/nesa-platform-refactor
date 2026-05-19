import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { RelatedIconHonoureesRibbon } from "@/components/awards/RelatedIconHonoureesRibbon";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function InternationalEducationPage() {
  return (
    <>
      <Helmet>
        <title>Platinum Global Grants & Partnerships | NESA-Africa</title>
        <meta
          name="description"
          content="Bilateral, multilateral and international institutions powering African education through grants, collaboration and long-term investment."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/awards/global-partnerships" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Global Partnerships", path: "/awards/global-partnerships" }]} />

      <BrandedCategoryHero
        theme="global"
        headlineLead="Which Global Grants Are"
        headlineAccent="Powering Education in Africa?"
        description="Global partnerships are expanding educational opportunity across Africa through grants, institutional collaboration, innovation, infrastructure, and long-term investment in future generations. This recognition celebrates the organizations and allies supporting Africa's educational transformation."
        tags={["Collaboration", "Grants", "Diplomacy", "Global Impact", "SDGs", "Partnership", "Development", "Innovation"]}
        stats={[
          { value: "Global", label: "Collaboration" },
          { value: "Grants", label: "& Funding" },
          { value: "International", label: "Impact" },
        ]}
        primaryCta={{ label: "Explore Global Partners", href: "/nominees?category=International%20%26%20Bilateral%20Contributors%20to%20Education" }}
        secondaryCta={{ label: "Become a Strategic Partner", href: "/partners" }}
        watchCta={{ label: "View Partnership Impact", href: "/media" }}
        imageAlt="International & bilateral contributors powering education in Africa"
      />
      <AnimatedActionWords
        theme="global"
        lead="Global Partners Bring"
        words={["Collaboration", "Grants", "Diplomacy", "SDGs", "Development", "Global Impact", "Partnership", "Innovation", "Opportunity", "International Support"]}
      />
      <BrandedDocumentaryPreview
        theme="global"
        title="Partnership Stories"
        status="Documentary Coming Soon"
        description="Explore how global partnerships and international collaboration are helping shape the future of African education."
        watchCtaLabel="View Partnership Impact"
        watchCtaHref="/media"
        imageAlt="Global partnership stories documentary preview"
      />
      <BrandedNomineeDirectory
        theme="global"
        categoryName="International & Bilateral Contributors to Education"
        title="Live Global Partners"
        description="Bilateral, multilateral and institutional partners verified by the NESA Nominee Research Corps."
      />
      <RelatedIconHonoureesRibbon
        title="Friends of Africa — Lifetime Honourees"
        description="Non-African individuals and institutions with sustained contributions to African education across the Africa Education Icon Award."
        filterClassification="friends-of-africa"
      />
      <DynamicCategoryPage
        categoryTitle="International & Bilateral Contributors to Education"
        nominationType="International Contributors"
      />
    </>
  );
}
