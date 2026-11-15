// Lean homepage (owner-approved lean 14-page site, 15 Nov 2026).
import { Link } from "react-router-dom";
import { LeanHero, LeanSection, LeanList, LeanCtas } from "@/components/lean/LeanPage";
import { PROGRAMME_FACTS, TIER_CARDS } from "./leanContent";

export default function LeanHomePage() {
  return (
    <main id="main-content">
      <LeanHero
        title="Recognising Africa's Education Enablers."
        path="/"
        seoTitle="NESA-Africa 2026 | Recognising Africa's Education Enablers"
        description="NESA-Africa identifies, documents and recognises people and institutions expanding education access, quality, inclusion, innovation and opportunity across Africa."
      >
        <p className="text-sm uppercase tracking-[0.2em] text-gold/80 font-semibold">NESA-Africa 2026</p>
        <p>The African Blue-Garnet Awards for Education identify, document and recognise people and institutions whose verified work expands education access, quality, inclusion, innovation and opportunity across Africa.</p>
        <LeanCtas ctas={[{ label: "Submit a Nomination", href: "/nominate", primary: true }, { label: "How Recognition Works", href: "/how-it-works" }]} />
        <p className="text-sm text-white/60">Evidence-led research. Independent Icon judging. No public voting in 2026.</p>
      </LeanHero>

      <LeanSection title="Programme facts">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Programme facts">
          {PROGRAMME_FACTS.map((f) => (
            <li key={f} className="rounded-lg border border-gold/30 bg-card p-4 font-semibold text-foreground">{f}</li>
          ))}
        </ul>
      </LeanSection>

      <LeanSection title="Africa sees those who make education possible." tone="dark">
        <p>Educators, philanthropists, institutions, innovators, researchers, public leaders, artists, athletes, advocates and community organisations help learners overcome barriers. NESA-Africa brings these contributions into view through open nomination, identity and contact checks, consent, evidence review, structured research, independent Icon judging and responsible storytelling.</p>
        <p>Recognition rests on documented contribution, not popularity, sponsorship, donations, relationships or media exposure.</p>
      </LeanSection>

      <LeanSection title="What NESA-Africa does">
        <LeanList items={[
          <><strong>Identify:</strong> credible nominations from Africa, the Diaspora and Friends of Africa.</>,
          <><strong>Verify:</strong> contact, identity, consent, eligibility and evidence.</>,
          <><strong>Document:</strong> NRRC profiles and dossiers.</>,
          <><strong>Assess:</strong> independent judges for Icon dossiers; approved pathways for the other tiers.</>,
          <><strong>Recognise:</strong> formal notification and authorised materials.</>,
          <><strong>Connect:</strong> interviews, documentaries, webinars, podcasts and partnerships.</>,
        ]} />
        <LeanCtas ctas={[{ label: "View the Recognition Process", href: "/how-it-works" }]} />
      </LeanSection>

      <LeanSection title="Four recognition tiers" tone="dark">
        <div className="grid gap-4 sm:grid-cols-2">
          {TIER_CARDS.map((t) => (
            <Link key={t.href} to={t.href} className="block rounded-lg border border-gold/40 p-5 hover:bg-gold/10 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
              <span className="text-xs uppercase tracking-widest text-gold/80">Tier {t.number}</span>
              <span className="mt-1 block font-display text-xl font-bold text-gold">{t.name}</span>
            </Link>
          ))}
        </div>
      </LeanSection>

      <LeanSection title="A focused online recognition programme.">
        <p>Scheduled for Monday, 28 December 2026, with about 20–30 invited live participants. It principally recognises up to nine Africa Education Icons, supported by Certificates of Recognition, documentaries, interviews and education-impact media.</p>
        <p role="note" className="border-l-4 border-gold pl-4 font-medium">No public physical gala, ticket sale, corporate table or public venue is authorised.</p>
        <LeanCtas ctas={[{ label: "Explore the 2026 Programme", href: "/programme/2026", primary: true }, { label: "Receive Programme Updates", href: "/contact?subject=general" }]} />
      </LeanSection>

      <LeanSection title="Recognition cannot be bought." tone="dark">
        <p>Nomination is free. Sponsorship, donations, partnerships, endorsements, publicity, merchandise, webinars, podcasts and media participation carry zero weight.</p>
        <LeanCtas ctas={[{ label: "Read Governance and Integrity", href: "/governance" }]} />
      </LeanSection>

      <LeanSection title="Education action.">
        <p>Through SCEF and EduAid-Africa, supporters can volunteer, join a chapter, partner on programmes or support a verified special-needs school.</p>
        <LeanCtas ctas={[
          { label: "Support a Special-Needs School", href: "/support-a-special-needs-school", primary: true },
          { label: "Volunteer", href: "/volunteer" },
          { label: "Join a Local Chapter", href: "/chapters/join" },
        ]} />
      </LeanSection>

      <LeanSection title="Help Us Document Education Impact Responsibly" tone="dark">
        <p>Know a person, institution or programme whose work deserves evidence-based consideration?</p>
        <LeanCtas ctas={[{ label: "Submit a Nomination", href: "/nominate", primary: true }, { label: "Read the Nomination Guide", href: "/nominate#nominator-guidelines" }]} />
      </LeanSection>
    </main>
  );
}
