import { LeanHero, LeanSection, LeanList, LeanCtas } from "@/components/lean/LeanPage";

export const RECOGNITION_STEPS: Array<[string, string]> = [
  ["Nomination received", "recorded and given a reference."],
  ["Completeness review", "required fields and information checked."],
  ["Duplicate review", "possible duplicates investigated."],
  ["Contact verification", "nominee identity and contact details checked."],
  ["Acceptance and consent", "the nominee confirms participation and publication consent."],
  ["Evidence review", "claims and materials examined."],
  ["NRRC research and review", "interviews, evidence research, profile and dossier."],
  ["Preliminary eligibility decision", "the dossier is checked against requirements."],
  ["Icon judging, where applicable", "eligible Icon dossiers go to the nine independent judges."],
  ["Governance and quality assurance", "conflicts, completeness, consistency and records reviewed."],
  ["Recognition decision", "recorded and secured."],
  ["Formal notification", "through an authorised channel."],
  ["Publication and certification", "only approved information and materials are published."],
];

export default function HowItWorksPage() {
  return (
    <main id="main-content">
      <LeanHero title="How NESA-Africa Recognition Works" seoTitle="How NESA-Africa Recognition Works" path="/how-it-works"
        description="Every NESA-Africa nomination follows a controlled 13-step process from receipt to publication.">
        <p>Every nomination follows a controlled process. A submission does not create a verified nominee, finalist, winner or recipient.</p>
      </LeanHero>
      <LeanSection title="The 13 steps">
        <LeanList ordered items={RECOGNITION_STEPS.map(([t, d]) => <><strong>{t}:</strong> {d}</>)} />
      </LeanSection>
      <LeanSection title="NRRC and judges" tone="dark">
        <p>The NRRC prepares and reviews the factual dossier. Judges assess eligible Icon dossiers independently. NRRC members cannot alter judge assessments. Judges cannot contact nominees privately or rewrite NRRC records without a documented correction.</p>
      </LeanSection>
      <LeanSection title="Recognition firewall (zero decision weight)">
        <LeanList items={["Sponsorship", "Donations", "Partnerships", "Endorsements", "Publicity", "Webinar or podcast participation", "Merchandise purchases", "Wallet activity", "Public voting"]} />
        <LeanCtas ctas={[
          { label: "Submit a Nomination", href: "/nominate", primary: true },
          { label: "Explore Recognition", href: "/recognition" },
          { label: "Read Governance and Integrity", href: "/about/governance" },
        ]} />
      </LeanSection>
    </main>
  );
}
