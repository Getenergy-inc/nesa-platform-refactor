import type { CategoryFaq } from "./types";

interface FaqInputs {
  eligibility: string;
  whoCanNominate: string;
  evidence: string;
  publicVoting: string;
  review: string;
  sponsorInfluence?: string;
  announcement?: string;
  howToNominate?: string;
}

export function buildStandardFaqs(i: FaqInputs): CategoryFaq[] {
  return [
    { q: "Who is eligible for this category?", a: i.eligibility },
    { q: "Who can nominate?", a: i.whoCanNominate },
    { q: "What evidence is required?", a: i.evidence },
    { q: "Is there public voting?", a: i.publicVoting },
    { q: "How is the category reviewed?", a: i.review },
    {
      q: "Can sponsors influence this category?",
      a:
        i.sponsorInfluence ??
        "No. Sponsorship supports visibility and programme delivery only. Sponsors, partners, endorsers and donors cannot nominate, shortlist, vote, judge, or determine winners.",
    },
    {
      q: "When will finalists or winners be announced?",
      a:
        i.announcement ??
        "Finalists are announced during the NESA-Africa 2026 season public window, with winners revealed at the official Gala. Exact dates follow the published season timeline.",
    },
    {
      q: "How do I nominate someone for this category?",
      a:
        i.howToNominate ??
        "Use the 'Nominate in this Category' CTA above. Sign in, complete the guided nomination form, attach evidence, and submit before the season deadline.",
    },
  ];
}
