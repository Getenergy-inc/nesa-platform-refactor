import AwardLanePage from "@/components/get-involved/AwardLanePage";

export default function CsrLanePage() {
  return (
    <AwardLanePage
      title="CSR for Education"
      meaning="This lane is for companies that fund or run structured corporate giving, CSR, or ESG programmes in education — scholarships, school builds, learning materials, teacher support, and similar commitments."
      audience={[
        "Companies with a dedicated CSR or ESG budget directed at education.",
        "Corporate foundations delivering education programmes for their parent company.",
        "Businesses whose education support is structured and sustained, not one-off donations.",
      ]}
      categories={[
        {
          name: "CSR for Education (Africa Regional)",
          tier: "Gold-Blue Garnet Recognition",
          whoItsFor:
            "Your company operates education CSR programmes across multiple African countries, or across a region of the continent.",
          categoryHref: "/category/csr-education-africa",
          nominateHref: "/nominate?category=best-csr-for-education-africa-regional",
        },
        {
          name: "CSR for Education (Nigeria)",
          tier: "Gold-Blue Garnet Recognition",
          whoItsFor:
            "Your company's education CSR work is focused primarily within Nigeria.",
          categoryHref: "/category/csr-education-nigeria",
          nominateHref: "/nominate?category=best-csr-for-education-nigeria",
        },
      ]}
      metaDescription="Nominate a company for the NESA-Africa CSR for Education awards — Africa Regional or Nigeria — recognising structured corporate giving to education."
    />
  );
}
