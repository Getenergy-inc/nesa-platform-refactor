import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";

export default function InternationalEducationPage() {
  return (
    <>
      <BrandedCategoryHero
        theme="global"
        headlineLead="Which Global Grants Are"
        headlineAccent="Powering Education in Africa?"
        description="Global partnerships are expanding educational opportunity across Africa through funding, collaboration, innovation, and long-term investment in future generations."
        tags={["Collaboration", "Grants", "Diplomacy", "Global Impact", "SDGs", "Partnership", "Development", "Innovation"]}
        stats={[
          { value: "Global", label: "Collaboration" },
          { value: "Grants", label: "& Funding" },
          { value: "International", label: "Impact" },
        ]}
        primaryCta={{ label: "Explore Global Partners", href: "/nominees?category=International%20%26%20Bilateral%20Contributors%20to%20Education" }}
        secondaryCta={{ label: "Become a Partner", href: "/partners" }}
        watchCta={{ label: "View Partnership Impact", href: "/media" }}
        imageAlt="International & bilateral contributors powering education in Africa"
      />
      <BrandedDocumentaryPreview
        theme="global"
        title="Partnership Stories"
        description="See how global institutions and bilateral partners are building stronger, more equitable education systems across Africa."
        watchCtaHref="/media"
        imageAlt="Global partnership stories documentary preview"
      />
      <DynamicCategoryPage
        categoryTitle="International & Bilateral Contributors to Education"
        nominationType="International Contributors"
      />
    </>
  );
}
