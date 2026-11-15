import { LeanHero, LeanSection, LeanCtas, type LeanCta } from "@/components/lean/LeanPage";

const BLOCKS: Array<{ title: string; body: string; ctas: LeanCta[] }> = [
  { title: "Volunteer", body: "Contribute skills in NRRC research and nominee contact, technology, data quality, website QA, social media, graphic design, documentary production, webinars and podcasts, communications, translation, accessibility, safeguarding, partnerships, fundraising or administration. Applying is not appointment or onboarding.", ctas: [{ label: "Apply to Volunteer", href: "/volunteer" }] },
  { title: "Join a local chapter", body: "Chapters connect enablers, volunteers, institutions and supporters in African countries and Diaspora communities. They support awareness, credible nominations, education activities and EduAid-Africa interventions. They cannot verify nominees, appoint judges or influence recognition.", ctas: [{ label: "Find a Chapter", href: "/chapters" }, { label: "Join a Chapter", href: "/chapters/join" }, { label: "Apply to Establish a Chapter", href: "/contact?subject=chapter" }] },
  { title: "Join our team", body: "Paid and volunteer vacancies across SCEF programmes.", ctas: [{ label: "View Vacancies", href: "/vacancies" }] },
  { title: "Partner with us", body: "Technology, accessibility, media, research, education interventions, regional school support, training and Afri-EduTourism.", ctas: [{ label: "Propose a Partnership", href: "/partners" }] },
  { title: "Sponsor responsibly", body: "Sponsors support approved delivery without nomination, judging or editorial influence.", ctas: [{ label: "Become a Sponsor", href: "/sponsors" }] },
  { title: "Donate", body: "Donations support approved education documentation, accessibility, school interventions and EduAid-Africa services, by bank transfer to EduAid Africa Ltd.", ctas: [{ label: "Support Education", href: "/support" }] },
  { title: "Buy merchandise", body: "Official NESA-Africa and EduAid-Africa merchandise is available on request while the online shop is closed.", ctas: [{ label: "Enquire About Merchandise", href: "/contact?subject=merchandise", primary: true }] },
];

export default function GetInvolvedPage() {
  return (
    <main id="main-content">
      <LeanHero title="Contribute to Education Recognition and Impact" path="/get-involved"
        seoTitle="Get Involved With NESA-Africa and EduAid-Africa"
        description="Take part through nomination, volunteering, local chapters, partnerships, sponsorship, responsible education support or official merchandise.">
        <p>Take part through nomination, volunteering, local chapters, partnerships, sponsorship, responsible education support or official merchandise.</p>
      </LeanHero>
      {BLOCKS.map((b, i) => (
        <LeanSection key={b.title} title={b.title} tone={i % 2 ? "dark" : "light"}>
          <p>{b.body}</p>
          <LeanCtas ctas={b.ctas} />
        </LeanSection>
      ))}
      <LeanSection title="Integrity notice">
        <p>Sponsorship, donations, partnerships, endorsements, merchandise purchases and media participation carry zero weight in nomination, eligibility, judging or recognition.</p>
      </LeanSection>
    </main>
  );
}
