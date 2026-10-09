import AwardLanePage from "@/components/get-involved/AwardLanePage";

export default function FoundationsLanePage() {
  return (
    <AwardLanePage
      title="Foundations"
      subtitle="Officially recognised as the Africa Education Philanthropy Icon"
      meaning="This lane is for family, corporate, and community foundations doing sustained philanthropic giving in education — endowments, scholarship funds, school-building programmes, and long-horizon education grantmaking."
      audience={[
        "Family foundations with a multi-year education funding track record.",
        "Corporate foundations making sustained philanthropic investments in learning.",
        "Community foundations and philanthropic trusts supporting African education.",
      ]}
      categories={[
        {
          name: "Africa Education Philanthropy Icon",
          tier: "Africa Education Icon — Lifetime Legacy",
          whoItsFor:
            "Your foundation's philanthropic giving has created durable, demonstrable change in African education — the highest recognition lane for education philanthropy.",
          categoryHref: "/nominees/africa-education-icon-award/education-philanthropy-icon",
          nominateHref: "/nominate?category=africa-education-icon-award",
        },
      ]}
      metaDescription="Nominate a foundation for the Africa Education Philanthropy Icon — NESA-Africa's lifetime-legacy recognition for sustained education philanthropy."
    />
  );
}
