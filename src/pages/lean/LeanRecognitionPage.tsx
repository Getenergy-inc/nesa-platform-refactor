// Lean Recognition page (owner brief Page 3 + master-draft tier cards).
import { Link } from "react-router-dom";
import { LeanHero, LeanSection, LeanList, LeanCtas } from "@/components/lean/LeanPage";
import { Button } from "@/components/ui/button";
import { TIER_CARDS } from "./leanContent";

export default function LeanRecognitionPage() {
  return (
    <main id="main-content">
      <LeanHero title="Four Recognition Tiers, 22 Main Awards and 90 Subcategories" path="/recognition"
        seoTitle="NESA-Africa Recognition | Four Tiers and 22 Awards"
        description="Explore the four NESA-Africa recognition tiers, 22 main awards and 90 subcategories.">
        <p>NESA-Africa recognises different forms and levels of verified education contribution through a structured, evidence-led framework. There is no public or AGC voting in 2026.</p>
      </LeanHero>
      <LeanSection>
        <div className="grid gap-5 md:grid-cols-2">
          {TIER_CARDS.map((t) => (
            <article key={t.number} data-testid="tier-card" className="flex flex-col rounded-lg border border-gold/30 bg-card p-6">
              <p className="text-xs uppercase tracking-widest text-gold">Tier {t.number}</p>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">{t.name}</h2>
              <p className="mt-2 text-foreground/80">{t.description}</p>
              <dl className="mt-3 space-y-1 text-sm">
                <div><dt className="inline font-semibold">Main awards: </dt><dd className="inline">{t.awards.length}</dd></div>
                <div><dt className="inline font-semibold">Selection method: </dt><dd className="inline">{t.selection}</dd></div>
                <div><dt className="inline font-semibold">2026 voting: </dt><dd className="inline">None</dd></div>
              </dl>
              <ul className="mt-3 list-disc pl-5 text-sm text-foreground/75 flex-1">{t.awards.map((a) => <li key={a}>{a}</li>)}</ul>
              <Button asChild className="mt-5 self-start bg-gold text-charcoal hover:bg-gold/90 font-semibold">
                <Link to={t.href} aria-label={`Explore ${t.name}`}>Explore</Link>
              </Button>
            </article>
          ))}
        </div>
      </LeanSection>
      <LeanSection title="Certificates of Recognition" tone="dark">
        <p>Certificates of Recognition may be issued to approved contributors who meet programme requirements. A certificate is not automatically a competitive award and must not be presented as an award won.</p>
      </LeanSection>
      <LeanSection title="What does not determine recognition">
        <LeanList items={["Popularity", "Sponsorship", "Donations", "Personal access to organisers", "Paid publicity", "Webinar or podcast appearances", "Social-media following", "Merchandise purchases", "Public voting", "AGC or wallet activity"]} />
        <LeanCtas ctas={[{ label: "Submit a Nomination", href: "/nominate", primary: true }, { label: "Help Me Choose a Recognition Field", href: "/nominate/help-me-choose" }]} />
      </LeanSection>
    </main>
  );
}
