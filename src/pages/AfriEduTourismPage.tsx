// Lean /afri-edutourism page (owner-approved 15 Nov 2026). Also embedded at #afri-edutourism on the EduAid-Africa page.
import { LeanHero, LeanSection, LeanList, LeanCtas, type LeanCta } from "@/components/lean/LeanPage";

export const REGISTER_INTEREST_HREF = "/contact?subject=afri-edutourism";

export const MISSION_TYPES = [
  { title: "School commissioning visits", body: "See the verified school intervention completed and attend the regional grant awarding ceremony." },
  { title: "Inclusive-education learning visits", body: "Learn from special-needs and inclusive schools, resource centres and practitioners." },
  { title: "Education leadership and teacher exchange", body: "Peer learning for principals, teachers and education officials." },
  { title: "Heritage and Diaspora learning journeys", body: "Visit historic learning sites, universities and libraries in the host region." },
];

export const OPERATIONAL_REGIONS = [
  "North Africa", "West Africa", "Central Africa", "East Africa",
  "Southern Africa", "Sahel", "Horn of Africa", "Indian Ocean Islands",
];

const HERO_CTAS: LeanCta[] = [
  { label: "Register Interest in a 2027 Mission", href: REGISTER_INTEREST_HREF, primary: true },
  { label: "Support a Special-Needs School", href: "/support-a-special-needs-school" },
];

const FINAL_CTAS: LeanCta[] = [
  { label: "Register Interest in a 2027 Mission", href: REGISTER_INTEREST_HREF, primary: true },
  { label: "Propose an Institutional Partnership", href: "/partners" },
  { label: "Support a Special-Needs School", href: "/support-a-special-needs-school" },
];

export default function AfriEduTourismPage() {
  return (
    <div>
      <LeanHero
        title="Afri-EduTourism"
        path="/afri-edutourism"
        seoTitle="Afri-EduTourism | Education Missions Across Africa"
        description="Responsible education travel linking learning, skilled volunteering and verified special-needs school interventions across Africa's eight regions."
        canonicalUrl="https://nesa.africa/afri-edutourism"
      >
        <p>Responsible education travel that connects learning, skilled volunteering and verified school interventions across Africa.</p>
        <LeanCtas ctas={HERO_CTAS} />
      </LeanHero>

      <LeanSection title="About Afri-EduTourism">
        <p>Afri-EduTourism is the education-travel arm of the Support a Special-Needs School programme, a Rebuild My School Africa service delivered by NESA-Africa and EduAid-Africa under SCEF.</p>
        <p>Small groups visit the region's priority school and see the intervention their support made possible. They share professional skills, learn from local education institutions and heritage, and attend the regional grant awarding ceremony.</p>
      </LeanSection>

      <LeanSection title="2027 missions" tone="dark">
        <p>
          <span className="inline-block rounded-full border border-gold bg-gold/10 px-3 py-1 text-sm font-semibold text-gold">Not yet open — 2027</span>
        </p>
        <p>There is one mission per operational region in October–November 2027, timed with intervention delivery and each region's grant awarding ceremony.</p>
        <p>Dates, itineraries and costs are published only after approval. Missions are not yet open.</p>
      </LeanSection>

      <LeanSection title="Mission types">
        <div className="grid gap-5 sm:grid-cols-2">
          {MISSION_TYPES.map((m) => (
            <article key={m.title} data-testid="mission-card" className="rounded-lg border border-gold/30 bg-card p-6">
              <h3 className="font-display text-lg font-bold text-foreground">{m.title}</h3>
              <p className="mt-2 text-foreground/80">{m.body}</p>
            </article>
          ))}
        </div>
      </LeanSection>

      <LeanSection title="Who can join" tone="dark">
        <LeanList items={[
          "Educators and education leaders",
          "Sponsors and partners",
          "Skilled volunteers (therapy, accessibility, teacher training, media)",
          "Africans in the Diaspora and Friends of Africa",
          "Students, through partner institutions",
        ]} />
      </LeanSection>

      <LeanSection title="Safeguarding comes first">
        <LeanList items={[
          "No unsupervised contact with learners.",
          "Background checks for anyone working with children.",
          "No photos or video of children without school and parental consent.",
          "Visits follow the school's routine and are led by programme staff.",
        ]} />
        <p role="note" className="border-l-4 border-gold pl-4 font-medium">
          Mission fees are kept separate from the Support Fund. Joining a mission does not influence school selection, regional participation or NESA-Africa recognition.
        </p>
      </LeanSection>

      <LeanSection title="Eight operational regions" tone="dark">
        <ul className="flex flex-wrap gap-2" aria-label="Operational regions">
          {OPERATIONAL_REGIONS.map((r) => (
            <li key={r} className="rounded-full border border-gold/40 px-3 py-1 text-sm text-white/85">{r}</li>
          ))}
        </ul>
        <p>Host schools and itineraries are announced after regional selection in September 2027.</p>
      </LeanSection>

      <LeanSection>
        <LeanCtas ctas={FINAL_CTAS} />
      </LeanSection>
    </div>
  );
}
