// Lean 2026 Online Programme page (owner brief Page 9). /gala*, /tickets and /buy-your-ticket redirect here.
import { LeanHero, LeanSection, LeanList, LeanCtas } from "@/components/lean/LeanPage";

export const PROGRAMME_REDIRECT_NOTICE =
  "The NESA-Africa 2026 Online Recognition Programme is scheduled for Monday, 28 December 2026. Live participation is by invitation and operational approval. Public viewing information will be released after approval and technical testing.";

export default function LeanProgrammePage() {
  return (
    <main id="main-content">
      <LeanHero title="NESA-Africa 2026 Online Recognition Programme" path="/programme/2026"
        seoTitle="NESA-Africa 2026 Online Recognition Programme"
        description="Monday, 28 December 2026 — a focused online programme principally recognising up to nine Africa Education Icons.">
        <p><strong>Scheduled date:</strong> Monday, 28 December 2026.</p>
        <p>A focused online programme with about 20–30 invited live participants, principally recognising up to nine Africa Education Icons.</p>
        <p role="note" className="border-l-4 border-gold pl-4 text-base">{PROGRAMME_REDIRECT_NOTICE}</p>
      </LeanHero>
      <LeanSection title="Purpose">
        <p>To bring verified education contributions into public view through responsible storytelling, documentaries, interviews and approved recognition moments.</p>
      </LeanSection>
      <LeanSection title="Programme elements" tone="dark">
        <LeanList items={["Africa Education Icon recognition", "Icon documentaries", "Authorised interviews", "Education-impact stories", "Regional and international contributions", "Approved Certificates of Recognition", "NESA-Africa TV coverage", "Africa Education Enablers Podcast features"]} />
      </LeanSection>
      <LeanSection title="Participation">
        <p>Live participation is by invitation and operational approval. Broadcast or public-access details are published after approval and technical testing.</p>
        <p role="note" className="border-l-4 border-gold pl-4 font-medium">No public physical gala, ticket sale, corporate table or public venue is authorised.</p>
        <p>Appearing in an interview, webinar, podcast, documentary or programme does not confirm nomination, selection or recognition.</p>
        <LeanCtas ctas={[
          { label: "Receive Programme Updates", href: "/contact?subject=general", primary: true },
          { label: "Explore the Icon Categories", href: "/recognition/africa-education-icon" },
          { label: "Watch Published Programmes", href: "/media/tv" },
          { label: "Media Enquiries", href: "/contact?subject=media" },
        ]} />
      </LeanSection>
    </main>
  );
}
