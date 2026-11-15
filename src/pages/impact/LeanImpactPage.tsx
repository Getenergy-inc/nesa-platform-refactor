// Lean /impact page (owner-approved 15 Nov 2026): two programmes, delivery roles, reporting rule, notice.
import { Link } from "react-router-dom";
import { LeanHero, LeanSection, LeanCtas } from "@/components/lean/LeanPage";
import { Button } from "@/components/ui/button";

const PROGRAMMES = [
  {
    title: "Support a Special-Needs School Across Africa",
    body: "Nominate, donate to or sponsor a verified special-needs or inclusive school in one of eight regions; one priority school per region in 2027.",
    cta: { label: "Support a Special-Needs School", href: "/support-a-special-needs-school" },
  },
  {
    title: "Afri-EduTourism",
    body: "Join a 2027 education mission to see the regional school interventions and attend the grant awarding ceremony in each region.",
    cta: { label: "Explore Afri-EduTourism", href: "/afri-edutourism" },
  },
];

export default function LeanImpactPage() {
  return (
    <main>
      <LeanHero
        title="From Recognition to Education Action"
        path="/impact"
        seoTitle="Education Impact | NESA-Africa"
        description="From recognition to action: support a special-needs school or join an Afri-EduTourism mission."
      >
        <p>NESA-Africa documents those who make education possible. Our impact work turns that recognition into practical support for learners who need it most.</p>
        <LeanCtas ctas={[
          { label: "Support a Special-Needs School", href: "/support-a-special-needs-school", primary: true },
          { label: "Explore Afri-EduTourism", href: "/afri-edutourism" },
        ]} />
      </LeanHero>

      <LeanSection>
        <div className="grid gap-5 md:grid-cols-2">
          {PROGRAMMES.map((p) => (
            <article key={p.title} className="rounded-lg border border-gold/30 bg-card p-6 flex flex-col">
              <h2 className="font-display text-xl font-bold text-foreground">{p.title}</h2>
              <p className="mt-3 text-foreground/80 flex-1">{p.body}</p>
              <Button asChild className="mt-5 self-start bg-gold text-charcoal hover:bg-gold/90 font-semibold whitespace-normal h-auto py-2">
                <Link to={p.cta.href}>{p.cta.label}</Link>
              </Button>
            </article>
          ))}
        </div>
      </LeanSection>

      <LeanSection title="Who delivers it" tone="dark">
        <p>NESA-Africa covers recognition, documentation, research and media.</p>
        <p>EduAid-Africa covers education support, fundraising and interventions.</p>
        <p>Rebuild My School Africa covers school rebuilding, renovation and special-needs-school support.</p>
        <p>All three sit under SCEF.</p>
      </LeanSection>

      <LeanSection title="Impact reporting">
        <p>Every figure we publish is defined, dated, sourced, approved and clear about whether it is a target or a completed result.</p>
        <p role="note" className="border-l-4 border-gold pl-4 font-medium">Participation in EduAid-Africa or Rebuild My School Africa does not guarantee nomination or recognition through NESA-Africa.</p>
      </LeanSection>
    </main>
  );
}
