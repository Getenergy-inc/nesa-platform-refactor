// SponsorFAQ — 20 sponsor FAQs in an accessible accordion.

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: "How can an organisation sponsor NESA-Africa 2026?",
    a: "Request the Sponsorship Prospectus, choose a partnership lane (or request a custom package), and our partnerships team will issue a term sheet or MoU specifying scope, visibility, deliverables, reporting and payment channel.",
  },
  {
    q: "What sponsorship categories are available?",
    a: "Blue Diamond, Blue Garnet Awards Gala, Award Categories, Africa Education Icon, Gold/Blue Garnet, Platinum Recognition, Influencers Education Impact, EduAid-Africa Webinars, NESA-Africa TV Features, Sub-Category Pages, Rebuild My School Africa, Strategic Partnership and Supporter Visibility Listing.",
  },
  {
    q: "What is Blue Diamond Sponsorship?",
    a: "The highest, exclusive sponsorship level at $800,000 covering the full NESA-Africa 2026 ecosystem — awards, gala, NESA-Africa TV, EduAid-Africa, RMSA and continental visibility. Limited to one partner only.",
  },
  {
    q: "What is Gala Sponsorship?",
    a: "The Award Gala Night Main Sponsor is $200,000 (one slot), with 3–5 supporting partners at $25,000–$50,000 covering hospitality, red carpet, media wall, VIP reception, accessibility and cultural performance.",
  },
  {
    q: "What is Africa Education Icon Sponsorship?",
    a: "A premium lifetime education impact recognition with a Main Sponsor at $100,000 (1 slot), a Legacy Documentary Partner at $40,000–$60,000, and an Icon Reception / Tribute Partner at $20,000–$35,000.",
  },
  {
    q: "What is Gold-Blue Garnet Sponsorship?",
    a: "Core continental recognition sponsorship at $150,000 for the main sponsor, with Blue Garnet Category Sponsors at $20,000 per category — one per category — under a strict non-influence firewall.",
  },
  {
    q: "What is Platinum Recognition Sponsorship?",
    a: "Recognition of verified excellence with a Platinum Main Sponsor at $70,000 and Platinum Category Sponsors at $10,000–$15,000 per category, one per category.",
  },
  {
    q: "What is Influencers Education Impact Sponsorship?",
    a: "A digital advocacy and youth-voice platform with a Main Sponsor at $50,000 plus 3–6 Supporting Partners at $10,000–$25,000 across youth voice, creator cohorts, social amplification and community campaigns.",
  },
  {
    q: "What is EduAid-Africa Webinar Sponsorship?",
    a: "Per-episode sponsorship at $500–$1,500 (1 main per episode) and Supporting Visibility at $250–$500 (up to 2 per episode) covering parent, teacher, inclusion, special-needs and community education.",
  },
  {
    q: "What is NESA-Africa TV Feature Sponsorship?",
    a: "Broadcast and online-feature sponsorship at $3,000–$5,000 per online award category feature (1 main per feature), with Episode Supporting Partners at $1,000–$2,500 (up to 2 per episode).",
  },
  {
    q: "What is Rebuild My School Africa Sponsorship?",
    a: "Direct legacy support for school infrastructure, accessibility, Special Needs Education, digital learning spaces, libraries, WASH and community-led improvement — running October 2026 to October 2027. Regional partner amounts are approved per region.",
  },
  {
    q: "What is Sub-Category Page Sponsorship?",
    a: "Page-level visibility on sub-category and regional listing pages: $5,000 (lead), $2,500 (supporting), $1,000 (visibility). Maximum 3 sponsors per page.",
  },
  {
    q: "What is Supporter Visibility Listing?",
    a: "A $500 public listing for institutional, civil-society, academic, media, diaspora, corporate and community supporters. It is grouped publicly and does NOT create sponsorship rights, category ownership, judging authority, nomination influence or winner-selection power.",
  },
  {
    q: "What benefits do sponsors receive?",
    a: "Website and event visibility, programme-guide listing, NESA-Africa TV acknowledgement, media mentions, CSR/ESG-ready reporting, branded credits where permitted, interview opportunities and post-event impact documentation.",
  },
  {
    q: "Are sponsorship prices fixed?",
    a: "Published amounts are governance-approved reference figures. Final packaging, multi-lane bundles, in-kind values and currency settlement are confirmed by term sheet or MoU.",
  },
  {
    q: "Can sponsors receive CSR or ESG reporting?",
    a: "Yes. Every sponsorship lane includes structured reporting: reach, engagement, visibility, beneficiary documentation and (for legacy lanes) before-and-after evidence aligned to SDG 4, SDG 17 and AU Agenda 2063.",
  },
  {
    q: "Can sponsors influence nominations, voting, judging, finalists or winners?",
    a: "No. NESA-Africa 2026 maintains a strict firewall. Sponsors, partners, donors, endorsers and visibility supporters cannot nominate, shortlist, vote, judge, lobby or influence finalists or winners. Benefits are limited to approved visibility, reporting and engagement.",
  },
  {
    q: "How does the 5% Rebuild My School Africa contribution work?",
    a: "NESA-Africa allocates 5% of eligible sponsorship income to the RMSA Legacy Fund. Subject to Board, Finance and Compliance approval, allocations flow through the 8 approved regional GFA Wzip wallets with monthly reconciliation, project documentation, beneficiary verification and sponsor-ready reporting.",
  },
  {
    q: "How do sponsors begin?",
    a: "Request the Sponsorship Prospectus or talk to our partnerships team. We confirm scope, issue a term sheet or MoU, verify the payment channel, raise an invoice and onboard you to visibility, reporting and impact documentation workflows.",
  },
  {
    q: "How can I verify payment channels?",
    a: "All settlements use the approved GFA Wallet or verified bank transfer to published NESA-Africa / SCEF / EduAid-Africa accounts, with receipts issued for every transaction. NESA-Africa never requests payments to personal accounts, crypto wallets, private mobile-money wallets or unverified third-party links. Verify via partnerships@nesa.africa, the Support Centre or Sophia WhatsApp support.",
  },
];

export function SponsorFAQ() {
  return (
    <section
      id="faq"
      className="bg-charcoal py-14 md:py-20 border-t border-gold/10 scroll-mt-24"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold font-semibold mb-3">
            <HelpCircle className="h-3.5 w-3.5" /> Sponsor FAQ
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
            Sponsorship questions, answered
          </h2>
          <p className="text-ivory/65 text-sm md:text-base">
            Twenty of the most common questions from corporate sponsors, foundations, CSR teams,
            ESG teams, development partners and institutional funders.
          </p>
        </div>

        <div className="max-w-4xl">
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`faq-${i}`}
                className="rounded-xl border border-gold/15 bg-charcoal/60 px-4"
              >
                <AccordionTrigger className="text-left text-ivory hover:no-underline py-4">
                  <span className="font-display text-base md:text-lg">{f.q}</span>
                </AccordionTrigger>
                <AccordionContent className="text-ivory/70 text-sm md:text-base leading-relaxed pb-4">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default SponsorFAQ;
