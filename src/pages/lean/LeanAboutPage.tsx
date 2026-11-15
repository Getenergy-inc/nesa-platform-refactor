// Lean About page (owner brief Page 2). Keeps #governance and #scef anchors used by legacy redirects.
import { LeanHero, LeanSection, LeanList, LeanCtas } from "@/components/lean/LeanPage";

export default function LeanAboutPage() {
  return (
    <main id="main-content">
      <LeanHero title="About NESA-Africa" path="/about"
        seoTitle="About NESA-Africa | African Blue-Garnet Awards for Education"
        description="Learn about NESA-Africa, its purpose, values, host organisation and approach to responsible education recognition.">
        <p>NESA-Africa, the New Education Standard Award Africa, is a pan-African education-recognition and documentation programme hosted by Santos Creations Educational Foundation (SCEF). It makes credible education contributions visible, preserves evidence of impact and encourages cooperation around education for all.</p>
      </LeanHero>
      <LeanSection>
        <p><strong>Purpose:</strong> to identify, document, verify, recognise, celebrate and connect people and institutions enabling education across Africa.</p>
        <p><strong>Vision:</strong> an Africa where meaningful contributions to education are visible, responsibly documented and strengthened through recognition, learning and partnership.</p>
        <p><strong>Mission:</strong> to run a credible pan-African recognition platform combining open nomination, consent, structured research, evidence review, independent Icon judging and responsible storytelling.</p>
      </LeanSection>
      <LeanSection title="Participation pathways" tone="dark">
        <LeanList items={["Africans in Africa", "Africans in the Diaspora", "Friends of Africa"]} />
      </LeanSection>
      <LeanSection title="Our principles" id="governance">
        <LeanList items={["Evidence before acclaim", "Consent before publicity", "Research before judging", "Independence from financial influence", "Pan-African participation", "Responsible storytelling"]} />
        <LeanCtas ctas={[{ label: "Read Governance and Integrity", href: "/governance" }]} />
      </LeanSection>
      <LeanSection title="Hosted by SCEF" tone="dark" id="scef">
        <p>SCEF provides the organisational and governance structure for NESA-Africa. NESA-Africa runs alongside EduAid-Africa, Rebuild My School Africa and other SCEF education services. Taking part in one programme does not guarantee recognition in another.</p>
        <LeanCtas ctas={[
          { label: "Explore the 2026 Programme", href: "/programme/2026", primary: true },
          { label: "How Recognition Works", href: "/how-it-works" },
          { label: "About SCEF", href: "/about#scef" },
          { label: "Meet the Global Team", href: "/meet-the-team" },
        ]} />
      </LeanSection>
    </main>
  );
}
