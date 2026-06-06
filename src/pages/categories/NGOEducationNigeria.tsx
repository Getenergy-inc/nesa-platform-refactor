import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function NGOEducationNigeriaPage() {
  return (
    <>
      <Helmet>
        <title>Best NGO Contribution to Education (Nigeria) | NESA-Africa</title>
        <meta name="description" content="Recognising Nigerian NGOs driving educational access, equity and community impact across the country." />
        <link rel="canonical" href="https://nesa.africa/awards/ngo-nigeria" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "NGO Education (Nigeria)", path: "/awards/ngo-nigeria" }]} />

      <BrandedCategoryHero
        theme="ngo"
        headlineLead="Which Nigerian NGOs Are"
        headlineAccent="Transforming Education?"
        description="From rural classrooms to inner-city outreach, Nigerian NGOs are unlocking education for millions — bridging gaps in access, infrastructure, inclusion and opportunity."
        tags={["Nigeria", "Grassroots", "Access", "Equity", "Scholarships", "Outreach", "Inclusion", "Impact"]}
        stats={[
          { value: "Nationwide", label: "Education Outreach" },
          { value: "Communities", label: "Lifted by NGOs" },
          { value: "Nigeria", label: "Sector Leaders" },
        ]}
        primaryCta={{ label: "Explore NGO Nominees", href: "/nominees?category=Best%20NGO%20Contribution%20to%20Education%20(Nigeria)" }}
        secondaryCta={{ label: "Vote for an NGO", href: "/vote" }}
        watchCta={{ label: "Watch Impact Stories", href: "/media" }}
        imageAlt="Best NGO Contribution to Education — Nigeria"
      />
      <AnimatedActionWords
        theme="ngo"
        lead="Nigerian NGOs Stand For"
        words={["Access", "Equity", "Hope", "Community", "Compassion", "Opportunity", "Empowerment", "Outreach", "Inclusion", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="ngo"
        title="Nigerian Impact Stories"
        description="See how Nigerian NGOs are restoring access to learning, reaching out-of-school children and lifting entire communities through education."
        watchCtaHref="/media"
        imageAlt="Nigerian NGO impact stories preview"
      />
      <BrandedNomineeDirectory
        theme="ngo"
        categoryName="Best NGO Contribution to Education (Nigeria)"
        title="Live Nigerian NGO Nominees"
      />
      <DynamicCategoryPage categoryTitle="Best NGO Contribution to Education (Nigeria)" nominationType="NGO Nigeria" nominateCategorySlug="best-ngo-for-education-advancement-nigeria" />
    </>
  );
}
