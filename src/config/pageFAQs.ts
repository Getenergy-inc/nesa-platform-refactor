// Page-specific FAQs tailored for The New Education Standard Award Africa (NESA Africa 2026)
// Each route maps to a curated set of frequently asked questions.

export interface FAQ {
  q: string;
  a: string;
  /** Optional CTAs rendered beneath the answer */
  ctas?: { label: string; href: string }[];
}

export interface FAQGroup {
  /** Group heading e.g. "Voting & AGC" */
  title: string;
  /** Short helper line under the group title */
  description?: string;
  faqs: FAQ[];
}

export interface PageFAQ {
  /** Route path or path prefix (e.g. "/", "/nominate", "/awards") */
  match: string;
  /** Section title shown above the accordion */
  title: string;
  /** Short subtitle */
  subtitle?: string;
  faqs: FAQ[];
  /** Optional link to the fuller FAQ / help-center page */
  viewAllHref?: string;
  viewAllLabel?: string;
}

// Universal fallback — shown if no route-specific match
const DEFAULT_FAQS: FAQ[] = [
  {
    q: "What is The New Education Standard Award Africa (NESA Africa 2026)?",
    a: "NESA Africa 2026 is a continental recognition platform celebrating individuals, organizations, and partners advancing Education for All across Africa and the African diaspora — connecting recognition, visibility, partnerships, and funding into one ecosystem.",
  },
  {
    q: "Who hosts NESA Africa?",
    a: "NESA Africa is hosted by the Nigeria Local Chapter of the Santos Creations Educational Foundation (SCEF), in partnership with regional chapters across Africa.",
  },
  {
    q: "Who can be recognized?",
    a: "Africans living in Africa, Africans in the diaspora, Friends of Africa, corporations, influencers, grantmakers, embassies, and bilateral and multilateral institutions all contributing to education in Africa.",
  },
  {
    q: "How do I get involved?",
    a: "You can nominate a changemaker, vote during official voting windows using AGC, attend the Gala, become an Ambassador, partner as a sponsor, or support EduAid Africa and Rebuild My School Africa.",
  },
];

// =============================================================
// Page-specific FAQ sets (longest path matched first)
// =============================================================
export const PAGE_FAQS: PageFAQ[] = [
  // ---------- HOMEPAGE ----------
  {
    match: "/",
    title: "About NESA Africa 2026",
    subtitle: "Everything you need to know about the continental award",
    faqs: [
      {
        q: "What is NESA Africa 2026?",
        a: "The New Education Standard Award Africa 2026 is a continental platform recognizing excellence in education and driving real impact through partnerships, media, and school transformation across Africa.",
      },
      {
        q: "What is the difference between NESA Africa and other education awards?",
        a: "NESA Africa is a recognition-to-impact system. We move beyond ceremonies — every award category is tied to follow-through programs like EduAid Africa, Rebuild My School Africa, and Special School Grants 2026/2027.",
      },
      {
        q: "When and where is the 2026 ceremony?",
        a: "The 2026 Grand Gala is scheduled for June 27, 2026. Regional ceremonies and TV broadcasts run throughout the year. Visit the Tickets page for the latest event details.",
      },
      {
        q: "How are nominees selected?",
        a: "Nominations are submitted by the public, screened by the Nomination Review Committee (NRC), and evaluated against the Education Development Index (EDI) — a 5-pillar scoring framework covering Access, Quality, Equity, Innovation, and Impact.",
      },
      {
        q: "What is the Africa Education Icon?",
        a: "The Africa Education Icon is our highest honor — a Lifetime Achievement award (2006–2026) recognizing leaders who have shaped education across Africa over two decades.",
      },
      {
        q: "What are AGC voting points?",
        a: "Afrigold Credits (AGC) are non-tradeable voting points earned through participation. They are used during official voting windows to support Gold and Blue Garnet nominees. AGC is not cryptocurrency and cannot be cashed out.",
      },
      {
        q: "Which African regions participate?",
        a: "All 5 African regions plus the Diaspora and Friends of Africa: West, East, North, Central, Southern Africa, and global African communities.",
      },
    ],
  },

  // ---------- NOMINATIONS ----------
  {
    match: "/nominate",
    title: "Nomination FAQs",
    subtitle: "Everything about submitting a nomination for NESA Africa 2026",
    faqs: [
      {
        q: "Who can submit a nomination?",
        a: "Anyone — the public, organizations, peers, and self-nominees. You only need a verified account and supporting evidence of the nominee's impact.",
      },
      {
        q: "Is there a fee to nominate?",
        a: "No. Nominations are free for all open public categories. Some sponsorship-tier recognitions follow institutional governance.",
      },
      {
        q: "What evidence do I need?",
        a: "Provide proof of impact: project documentation, photos, media coverage, beneficiary numbers, partner letters, or website links. Strong evidence strengthens the nominee's NRC review.",
      },
      {
        q: "Can I nominate someone in the diaspora?",
        a: "Yes. NESA Africa explicitly recognizes Africans in the diaspora and Friends of Africa contributing to education on the continent.",
      },
      {
        q: "What happens after I submit?",
        a: "You earn +2 AGCc voting credits, the nominee receives an official acceptance letter, and the NRC reviews the submission against the EDI matrix. Verified nominees enter the public-facing directory.",
      },
      {
        q: "Can I renominate someone from a previous year?",
        a: "Yes. Use the 'Renominate' option on the nominee's profile — this clones the original record and adds your endorsement.",
      },
      {
        q: "What is the deadline?",
        a: "Nominations close before the Gold and Blue Garnet voting windows open. Check the season timeline on the homepage countdown.",
      },
    ],
  },

  // ---------- VOTING ----------
  {
    match: "/vote",
    title: "Voting & AGC FAQs",
    subtitle: "How public voting and Afrigold Credits work",
    faqs: [
      {
        q: "How do I earn AGC voting credits?",
        a: "Earn credits through participation: +2 AGCc per verified nomination, +1 daily sign-in, +3 AGC for first referral, +1 AGC for additional referrals, +1 AGCc for watching NESA TV, +2 AGCc for signup verification.",
      },
      {
        q: "What is the conversion rate?",
        a: "10 AGCc = 1 AGC. AGCc auto-converts to AGC. 1 vote = 1 AGC during official voting windows.",
      },
      {
        q: "Can I buy or sell AGC?",
        a: "No. AGC is non-tradeable, non-withdrawable, and non-cashable. It is not cryptocurrency — it is a structured participation credit used only within the NESA Africa ecosystem.",
      },
      {
        q: "What is the difference between Gold and Blue Garnet voting?",
        a: "Gold Certificate winners are decided 100% by public AGC voting. Blue Garnet winners use a combined weight of jury evaluation + public participation.",
      },
      {
        q: "How is voting kept fair?",
        a: "Every vote is logged in an append-only audit ledger with anti-fraud controls, identity verification, and an Education Development Index (EDI) integrity wall.",
      },
      {
        q: "When are the voting windows?",
        a: "Official voting windows run between April and June. Outside these windows, the platform accepts nominations and participation activities only.",
      },
    ],
  },

  // ---------- AWARDS / CATEGORIES ----------
  {
    match: "/awards",
    title: "Awards & Categories FAQs",
    subtitle: "Understanding the NESA Africa award framework",
    faqs: [
      {
        q: "How many award categories are there?",
        a: "17 main categories across 4 tiers: Africa Education Icon (Lifetime), Blue Garnet (jury + public), Gold Certificate (public vote), and Platinum (merit-based recognition).",
      },
      {
        q: "What is the Africa Education Icon — Lifetime Achievement?",
        a: "The highest honor of NESA Africa, recognizing transformational leaders shaping education across Africa from 2006 to 2026. Selected by the Icon Award expert panel.",
      },
      {
        q: "What is Best CSR for Education?",
        a: "Recognizes corporations driving education funding, infrastructure support, and inclusive education initiatives across each African region in 2026.",
      },
      {
        q: "What does the Influencer category cover?",
        a: "Celebrates social media advocates, music artists, and sports personalities using their platform to advance education awareness across Africa.",
      },
      {
        q: "What is the Grants & Global Support award?",
        a: "Honors bilateral, multilateral, and international development partners — embassies, foundations, and agencies — investing in African education in 2026.",
      },
      {
        q: "What is the Platinum Certificate?",
        a: "A merit-based recognition for exceptional, verified contributions. Platinum requires no public vote — it is awarded through governance verification.",
      },
    ],
  },
  {
    match: "/categories",
    title: "Awards & Categories FAQs",
    subtitle: "Understanding the NESA Africa award framework",
    faqs: [
      {
        q: "How many award categories are there?",
        a: "17 main categories across 4 tiers: Africa Education Icon (Lifetime), Blue Garnet (jury + public), Gold Certificate (public vote), and Platinum (merit-based recognition).",
      },
      {
        q: "How do I find categories relevant to my country or region?",
        a: "Categories are organized by region (West, East, North, Central, Southern Africa, Diaspora) and theme (CSR, Influencer, Special School Impact, Global Support).",
      },
      {
        q: "Can my organization be nominated in multiple categories?",
        a: "Yes — if the work meets the eligibility criteria of each category. Each nomination is reviewed independently by the NRC.",
      },
    ],
  },

  // ---------- TICKETS ----------
  {
    match: "/buy-your-ticket",
    title: "Tickets & Gala FAQs",
    subtitle: "Attending the NESA Africa 2026 Grand Gala",
    faqs: [
      {
        q: "What ticket tiers are available?",
        a: "Standard, VIP, VVIP, Sponsor Tables, and Diaspora Premium. Each tier includes Gala access, dinner, and access to recognition lounges.",
      },
      {
        q: "Do I receive a digital ticket?",
        a: "Yes. After payment you receive an instant receipt and a QR e-ticket via email.",
      },
      {
        q: "Do ticket purchases earn AGC credits?",
        a: "Yes. Eligible purchases earn $1 = 5 Bonus AGC, added to your NESA wallet automatically.",
      },
      {
        q: "Can I refund or transfer my ticket?",
        a: "Tickets are transferable up to 7 days before the event. Refund eligibility depends on the tier — see the Tickets page for details.",
      },
      {
        q: "Is there a livestream option?",
        a: "Yes. NESA Africa TV broadcasts the ceremony live for global audiences who cannot attend in person.",
      },
    ],
  },

  // ---------- DONATE ----------
  {
    match: "/donate",
    title: "Donations & Impact FAQs",
    subtitle: "How your support powers EduAid Africa and Rebuild My School Africa",
    faqs: [
      {
        q: "Where do donations go?",
        a: "Donations fund EduAid Africa, Rebuild My School Africa, Special School Grants (2026/2027), and infrastructure crowdfunding for schools across Africa.",
      },
      {
        q: "Are donations tax-deductible?",
        a: "Donations through SCEF (Santos Creations Educational Foundation) are eligible for tax receipts in supported jurisdictions. A receipt is issued for every contribution.",
      },
      {
        q: "Can corporations donate as part of CSR?",
        a: "Yes. Corporate CSR donations qualify for the Best CSR for Education recognition and receive a partnership acknowledgement.",
      },
      {
        q: "Do donations earn AGC?",
        a: "Yes — $1 = 5 Bonus AGC for eligible donations, supporting your participation in voting windows.",
      },
    ],
  },

  // ---------- PARTNERS / SPONSORS ----------
  {
    match: "/partners",
    title: "Partnership & Sponsorship FAQs",
    subtitle: "Sponsor tiers, benefits, and CSR alignment",
    faqs: [
      {
        q: "What sponsorship tiers exist?",
        a: "Six corporate tiers from $20,000 to $250,000+, plus four Friend-of-Africa philanthropic levels. Each includes branding, gala presence, and CSR recognition.",
      },
      {
        q: "Can sponsors influence winners?",
        a: "No. Sponsors cannot influence winners. The integrity firewall strictly separates sponsor relationships from voting and judging outcomes.",
      },
      {
        q: "What do sponsors receive?",
        a: "Branding across NESA TV, Gala recognition, regional activation, CSR for Education credits, partner pages on nesa.africa, and access to the Education Champions Directory.",
      },
      {
        q: "How do I become a partner?",
        a: "Submit the partnership inquiry form on the Partners page. Our team responds within 5 business days with a tailored partnership pack.",
      },
    ],
  },

  // ---------- AMBASSADORS ----------
  {
    match: "/ambassadors",
    title: "Ambassador & SCEF Member FAQs",
    subtitle: "Joining the NESA Africa movement at the local level",
    faqs: [
      {
        q: "What is a NESA Ambassador?",
        a: "Ambassadors lead local chapters across African regions and the diaspora, driving nominations, voting awareness, school visibility, and partnership growth.",
      },
      {
        q: "What are the Ambassador tiers?",
        a: "Three tiers: Ambassador-1 (Local, $25), Ambassador-2 (Regional), and Ambassador-3 (Continental). Each tier includes credentials, training, and revenue sharing.",
      },
      {
        q: "What is a SCEF Active Member?",
        a: "SCEF Active Members support the Santos Creations Educational Foundation directly — participating in projects, fundraising, and volunteering.",
      },
      {
        q: "Do Ambassadors earn revenue?",
        a: "Yes. Ambassadors earn referral commissions and chapter revenue shares through the OLC settlement system.",
      },
    ],
  },

  // ---------- DASHBOARD ----------
  {
    match: "/dashboard",
    title: "Dashboard & Wallet FAQs",
    subtitle: "Managing your NESA Africa account",
    faqs: [
      {
        q: "Where do I see my AGC balance?",
        a: "Your wallet shows AGC and AGCc balances, voting history, transaction ledger, and earned credits in real time.",
      },
      {
        q: "How do referrals work?",
        a: "Share your referral code from the dashboard. You earn +3 AGC for the first referral and +1 AGC for each additional verified signup.",
      },
      {
        q: "Where do I track my nominations?",
        a: "The Nominations tab shows submission status, NRC review notes, and acceptance flow for every nominee you've supported.",
      },
      {
        q: "How do I update my profile?",
        a: "Use the Profile section to update your name, region, photo, and notification preferences. Verified profiles unlock additional voting capacity.",
      },
    ],
  },

  // ---------- ABOUT / VISION ----------
  {
    match: "/about",
    title: "About NESA Africa FAQs",
    subtitle: "The mission, governance, and Vision 2035",
    faqs: [
      {
        q: "What is the mission of NESA Africa?",
        a: "Recognizing excellence. Driving impact. Advancing education across Africa. We connect recognition to real outcomes through partnerships, media, and school transformation.",
      },
      {
        q: "What is Vision 2035?",
        a: "A 10-year roadmap to transition NESA Africa into a pan-African education governance, recognition, and infrastructure platform — aligning with UN SDG 4 and AU Agenda 2063.",
      },
      {
        q: "Who governs NESA Africa?",
        a: "Governance is shared by SCEF, the 27-member jury panel, the 30-member NRC volunteer team, and regional ambassadors — all under transparent integrity protocols.",
      },
      {
        q: "Who is the Chief Visionary Officer?",
        a: "The CVO leads NESA Africa's strategic direction, ensuring alignment with SDG 4 and continental education priorities.",
      },
    ],
  },

  // ---------- PROGRAMS ----------
  {
    match: "/programs",
    title: "Programs & Impact FAQs",
    subtitle: "EduAid Africa, Rebuild My School Africa, and beyond",
    faqs: [
      {
        q: "What is EduAid Africa?",
        a: "EduAid Africa is the post-award legacy program providing infrastructure crowdfunding, special school grants, and community-led education interventions across the continent.",
      },
      {
        q: "What is Rebuild My School Africa?",
        a: "A flagship project where every African region selects one special-needs school for transformation through community nominations, public votes, and EduAid Africa funding.",
      },
      {
        q: "How are beneficiary schools chosen?",
        a: "Communities nominate schools, the public votes, and the NRC + EduAid Africa technical team verify needs against the EDI matrix before funding.",
      },
      {
        q: "Can my school be nominated?",
        a: "Yes — submit through the Nominate page under the Special School Impact category. Verified schools enter the public-vote shortlist.",
      },
    ],
  },

  // ---------- MEDIA / TV ----------
  {
    match: "/media",
    title: "Media & NESA TV FAQs",
    subtitle: "Watch, listen, and engage with NESA Africa content",
    faqs: [
      {
        q: "Where can I watch NESA Africa TV?",
        a: "NESA TV streams on the Media page (/media/tv) and on YouTube @Nesa.africaTV. Episodes include nominee features, gala highlights, and educational documentaries.",
      },
      {
        q: "Can I earn AGC by watching?",
        a: "Yes. +1 AGCc per verified watch session, capped per day, contributing to your voting eligibility.",
      },
      {
        q: "Is there an official NESA Africa song?",
        a: "Yes. The official NESA anthem celebrates education champions across Africa — listen, download, and share to support EduAid Africa.",
      },
    ],
  },

  // ---------- AUTH ----------
  {
    match: "/login",
    title: "Account & Sign-in FAQs",
    faqs: [
      {
        q: "Why do I need an account?",
        a: "An account lets you nominate, vote during official windows, earn AGC, manage tickets, and track your participation across the NESA Africa ecosystem.",
      },
      {
        q: "I forgot my password — what do I do?",
        a: "Click 'Forgot Password' on the login screen. We'll email you a secure reset link. Reset links expire after 60 minutes.",
      },
      {
        q: "Can I use Google to sign in?",
        a: "Yes. Google sign-in is supported alongside email/password registration.",
      },
    ],
  },
  {
    match: "/register",
    title: "Account & Sign-up FAQs",
    faqs: [
      {
        q: "What do I get for signing up?",
        a: "+2 AGCc voting credits, access to nominations, voting, your NESA wallet, ticket purchases, and the Education Champions Directory.",
      },
      {
        q: "Do I need to verify my email?",
        a: "Yes. Email verification is required to earn voting credits and access governance-protected features.",
      },
      {
        q: "Is my data safe?",
        a: "Yes. NESA Africa enforces strict Row-Level Security (RLS), PII protection, and never shares personal data with sponsors or third parties.",
      },
    ],
  },

  // ---------- NOMINEES DIRECTORY ----------
  {
    match: "/nominees",
    title: "Nominee Directory FAQs",
    subtitle: "Browsing, endorsing, and supporting nominees",
    faqs: [
      {
        q: "How do I find a specific nominee?",
        a: "Use the search bar, filter by region, tier (Blue Garnet, Platinum, Gold, Lifetime), or category. Results update in real time.",
      },
      {
        q: "What does it mean to 'endorse' a nominee?",
        a: "Endorsing publicly supports a nominee with your verified profile. Endorsements strengthen NRC review signals and visibility.",
      },
      {
        q: "How do I vote for a nominee?",
        a: "During official voting windows, open the nominee profile and use AGC credits. Outside windows, you can endorse, share, or renominate.",
      },
    ],
  },

  // ---------- REGIONS ----------
  {
    match: "/region",
    title: "Regional Hub FAQs",
    subtitle: "Continental coverage across Africa and the diaspora",
    faqs: [
      {
        q: "How are African regions defined?",
        a: "5 core regions (West, East, North, Central, Southern Africa) plus Diaspora & Global Africa and Friends of Africa — 7 zones in total.",
      },
      {
        q: "Are nominations and voting region-specific?",
        a: "Yes. Many categories run regional shortlists to ensure fair continental representation before continental finals.",
      },
      {
        q: "What is Edu-Tourism?",
        a: "Edu-Tourism connects nominees, sponsors, and audiences to education-related travel experiences across each region — schools, cultural sites, and learning communities.",
      },
    ],
  },
];

/**
 * Resolve the best-matching FAQ set for a given pathname.
 * Longest path prefix wins, falls back to root, then to defaults.
 */
export function getFAQsForPath(pathname: string): PageFAQ {
  const normalized = pathname.toLowerCase();

  // Sort by match length descending — longest specific match first
  const sorted = [...PAGE_FAQS].sort((a, b) => b.match.length - a.match.length);

  for (const entry of sorted) {
    if (entry.match === "/" && normalized === "/") return entry;
    if (entry.match !== "/" && normalized.startsWith(entry.match)) return entry;
  }

  return {
    match: "*",
    title: "Frequently Asked Questions",
    subtitle: "About The New Education Standard Award Africa 2026",
    faqs: DEFAULT_FAQS,
  };
}
