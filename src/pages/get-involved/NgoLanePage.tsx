import AwardLanePage from "@/components/get-involved/AwardLanePage";

export default function NgoLanePage() {
  return (
    <AwardLanePage
      title="NGOs Advancing Education"
      meaning="This lane is for non-governmental and civil society organisations delivering education programmes at scale — building schools, supplying learning materials, funding scholarships, training teachers, and advocating for learners."
      audience={[
        "Registered NGOs and civil society organisations running education programmes in Nigeria.",
        "Nonprofits with verifiable, sustained education delivery — not one-off campaigns.",
        "Community-based organisations whose core mission includes education access or quality.",
      ]}
      categories={[
        {
          name: "NGO for Education Advancement (Nigeria)",
          tier: "Gold-Blue Garnet Recognition",
          whoItsFor:
            "Your NGO delivers education programmes within Nigeria — infrastructure, scholarships, learning materials, youth skills, or girls' education.",
          categoryHref: "/category/ngo-education-nigeria",
          nominateHref: "/nominate?category=best-ngo-for-education-advancement-nigeria",
        },
      ]}
      metaDescription="Nominate an NGO for the NESA-Africa NGO for Education Advancement (Nigeria) award — recognising nonprofits delivering education at scale."
    />
  );
}
