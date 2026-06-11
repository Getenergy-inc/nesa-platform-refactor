import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function DiasporaEducationPage() {
  return (
    <>
      <Helmet>
        <title>Diaspora Association Educational Impact | NESA-Africa</title>
        <meta name="description" content="Honouring African diaspora associations funding scholarships, building schools and powering education back home." />
        <link rel="canonical" href="https://nesa.africa/awards/diaspora-impact" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Diaspora Impact", path: "/awards/diaspora-impact" }]} />

      <BrandedCategoryHero
        theme="diaspora"
        headlineLead="Which Diaspora Associations Are"
        headlineAccent="Lifting Africa Back Home?"
        description="From scholarship funds to school construction and mentorship pipelines, African diaspora associations across the globe are channelling remittances, expertise and love into education back home."
        tags={["Diaspora", "Global Africa", "Remittances", "Scholarships", "Mentorship", "Schools", "Identity", "Belonging"]}
        stats={[
          { value: "Global", label: "African Diaspora" },
          { value: "Home", label: "Reinvestment in Education" },
          { value: "Bridges", label: "Across Continents" },
        ]}
        primaryCta={{ label: "Explore Diaspora Nominees", href: "/nominees?category=Diaspora%20Association%20Educational%20Impact" }}
        secondaryCta={{ label: "Vote for an Association", href: "/vote" }}
        watchCta={{ label: "Watch Diaspora Stories", href: "/media" }}
        imageAlt="Diaspora Association Educational Impact"
      />
      <AnimatedActionWords
        theme="diaspora"
        lead="The Diaspora Brings"
        words={["Belonging", "Remittances", "Mentorship", "Scholarships", "Identity", "Bridges", "Service", "Pride", "Investment", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="diaspora"
        title="Diaspora Stories"
        description="Discover how African diaspora associations channel global wealth and wisdom back into classrooms, scholarships, and futures across the continent."
        watchCtaHref="/media"
        imageAlt="Diaspora stories preview"
      />
      <BrandedNomineeDirectory
        theme="diaspora"
        categoryName="Diaspora Association Educational Impact"
        title="Live Diaspora Nominees"
      />
      <DynamicCategoryPage categoryTitle="Diaspora Association Educational Impact" nominationType="Diaspora Impact" />
    </>
  );
}
