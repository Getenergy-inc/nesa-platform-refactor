import { Helmet } from "react-helmet-async";
import { ContributorsHallSection } from "@/components/nesa/ContributorsHallSection";

export default function ContributorsPage() {
  return (
    <>
      <Helmet>
        <title>Meet Our Contributors | NESA-Africa Hall of Fame</title>
        <meta
          name="description"
          content="A living recognition wall of NESA-Africa volunteers, interns, judges, ambassadors and Board of Advisors from 2021 to today."
        />
        <link rel="canonical" href="https://www.nesa.africa/contributors" />
      </Helmet>
      <ContributorsHallSection compact={false} />
    </>
  );
}
