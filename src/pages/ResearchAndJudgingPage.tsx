import { LeanHero, LeanSection, LeanList, LeanCtas } from "@/components/lean/LeanPage";

export default function ResearchAndJudgingPage() {
  return (
    <main id="main-content">
      <LeanHero title="Research, Review and Independent Icon Judging" path="/research-and-judging"
        seoTitle="NESA-Africa Research, Review and Independent Icon Judging"
        description="How the Nominee Research and Review Corps and nine independent Icon judges keep research and final assessment separate.">
        <p>NESA-Africa separates nominee research and review from the final Icon assessment.</p>
      </LeanHero>
      <LeanSection title="The Nominee Research and Review Corps (NRRC)">
        <p>The NRRC provides the research, verification and preliminary-review foundation.</p>
        <h3 className="font-semibold text-foreground">Does</h3>
        <LeanList items={["Reviews completeness", "Investigates duplicates", "Verifies contacts", "Prepares notification letters", "Records delivery", "Obtains acceptance and consent", "Interviews", "Reviews evidence", "Prepares neutral profiles", "Runs the preliminary eligibility review", "Organises dossiers", "Carries out internal quality assurance", "Hands eligible Icon dossiers to the judges"]} />
        <h3 className="font-semibold text-foreground">Must not</h3>
        <LeanList items={["Select Icon recipients", "Promise recognition", "Alter judge scores", "Accept payments from nominees", "Treat sponsorship as evidence", "Publish unapproved profiles", "Share private nominee information"]} />
        <p><strong>2026 Icon structure:</strong> three Icon categories × three NRRC members = nine Icon NRRC members.</p>
      </LeanSection>
      <LeanSection title="Independent Icon judges" tone="dark">
        <p>Nine in total, three each for Education Philanthropy, Literary and New Curriculum Advocate, and Technical Educator.</p>
        <p><strong>Activation:</strong> written acceptance → identity confirmation → confidentiality terms → conflict declaration → category assignment → rubric training → calibration → secure-access test.</p>
        <h3 className="font-semibold text-white">Must not</h3>
        <LeanList items={["Assess a conflicted case", "Contact nominees privately", "Accept gifts or payments", "Disclose evidence", "Share scores", "Let sponsors influence decisions"]} />
      </LeanSection>
      <LeanSection title="Readiness notice">
        <p>The Judges Arena opens only after appointments, conflict declarations, calibration and secure-access testing are complete.</p>
        <LeanCtas ctas={[
          { label: "View Research and Review Standards", href: "/how-it-works" },
          { label: "View Judging Standards", href: "/about/governance" },
          { label: "Authorised Member Sign-In", href: "/login" },
        ]} />
      </LeanSection>
    </main>
  );
}
