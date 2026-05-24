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
    title: "NESA-Africa 2026 — Frequently Asked Questions",
    subtitle:
      "Everything you need to know about nominations, AGC voting, the Blue Garnet Awards Gala, regional participation, and post-award education impact.",
    viewAllHref: "/faq",
    viewAllLabel: "View Full FAQ & Participation Guide",
    faqs: [
      {
        q: "What is NESA-Africa 2026?",
        a: "NESA-Africa 2026 — The New Education Standard Award Africa — is a continental recognition-to-impact platform honouring the people, schools, corporations and partners advancing Education for All across Africa and the diaspora. The 2026 journey runs in phases: public pre-nomination, NRC verification, jury onboarding, Gold Certificate public voting, Blue Garnet final voting, the June Awards Gala, and the post-award EduAid Africa impact phase.",
        ctas: [
          { label: "View Full 2026 Journey", href: "/about" },
          { label: "Explore Nominees", href: "/nominees" },
        ],
      },
      {
        q: "How is NESA-Africa different from traditional education awards?",
        a: "Most education awards end at the ceremony. NESA-Africa is a recognition-to-impact ecosystem — every category is tied to follow-through programs like EduAid Africa, Rebuild My School Africa and Special School Grants. Recognition is decided by a transparent EDI scoring matrix, an independent jury, and verified public AGC voting — not by sponsors.",
      },
      {
        q: "Who can be nominated and who runs the review?",
        a: "Anyone advancing education in Africa can be nominated: individuals, schools, NGOs, corporations, influencers, embassies and global partners. Submissions are screened by the Nomination Review Committee (NRC), verified against the 5-pillar Education Development Index (EDI), then published in the public directory.",
        ctas: [
          { label: "Nominate for 2026", href: "/nominate" },
          { label: "Nominate a School", href: "/nominate?category=special-school-impact" },
        ],
      },
      {
        q: "What are AGC voting points and how do I earn them?",
        a: "Afri-Gold Coins (AGC) are non-tradeable participation credits used during official voting windows. Earn them by signing up (+2 AGCc), nominating (+2 AGCc), daily sign-in (+1), referrals (+3 then +1), watching NESA TV (+1) and other actions. 10 AGCc = 1 AGC. 1 vote = 1 AGC. AGC is not cryptocurrency and cannot be cashed out.",
        ctas: [
          { label: "Earn AGC", href: "/earn-agc" },
          { label: "Learn About Voting", href: "/how-voting-works" },
        ],
      },
      {
        q: "What is the Blue Garnet Awards Gala?",
        a: "The Blue Garnet Awards Gala is the continental finale on June 27, 2026, where Blue Garnet winners (jury + public AGC voting), Gold Certificate winners (100% public vote), Platinum Recognition honourees and the Africa Education Icon are celebrated live, broadcast on NESA TV across Africa and the diaspora.",
        ctas: [{ label: "View Tickets & Gala", href: "/buy-your-ticket" }],
      },
      {
        q: "What is the Africa Education Icon Award?",
        a: "The highest honour of NESA-Africa — a Lifetime Achievement recognition (2006–2026) for leaders who have shaped education across the continent over two decades. Icon awards are selected by an expert panel, not public voting, under a strict 3-3-3 structure.",
      },
      {
        q: "Which African regions participate?",
        a: "All five African regions — West, East, North, Central and Southern Africa — plus the Diaspora & Global Africa and Friends of Africa zones. Many categories run regional shortlists before continental finals to keep representation fair.",
        ctas: [{ label: "Explore Regions", href: "/region" }],
      },
      {
        q: "What happens after the awards ceremony?",
        a: "Phase 2 begins: recognition transitions into real impact through EduAid Africa and Rebuild My School Africa. Each region selects a special-needs school for transformation, supported by community votes, sponsor funding and verified delivery — turning every award into measurable education outcomes.",
        ctas: [
          { label: "Partner With NESA-Africa", href: "/sponsors" },
          { label: "Support EduAid Africa", href: "/donate" },
        ],
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

// =============================================================
// FULL FAQ ECOSYSTEM — used on /faq (help-center) page
// Categorised continental participation guide aligned with the
// NESA-Africa 2026 journey (Phase 1 awards → Phase 2 impact).
// =============================================================
export const FULL_FAQ_GROUPS: FAQGroup[] = [
  {
    title: "A. About NESA-Africa",
    description: "The mission, model and 2026 continental journey.",
    faqs: [
      {
        q: "What is NESA-Africa 2026?",
        a: "NESA-Africa 2026 — The New Education Standard Award Africa — is a continental recognition-to-impact platform honouring people, schools, corporations and partners advancing Education for All across Africa and the diaspora.",
      },
      {
        q: "How is NESA-Africa different from traditional education awards?",
        a: "We don't stop at recognition. Every category links to a follow-through program — EduAid Africa, Rebuild My School Africa and Special School Grants — so the award converts into measurable education outcomes.",
      },
      {
        q: "Why does NESA-Africa focus on changemakers instead of only schools or teachers?",
        a: "Education in Africa is moved by an ecosystem — teachers, schools, NGOs, corporations, governments, influencers and the diaspora. Recognising the whole ecosystem unlocks more funding, more visibility and more lasting impact.",
      },
      {
        q: "What is the Blue Garnet Awards Gala?",
        a: "The continental finale on June 27, 2026, where Blue Garnet, Gold Certificate, Platinum and Africa Education Icon honourees are celebrated live and broadcast across Africa on NESA TV.",
        ctas: [{ label: "View Tickets & Gala", href: "/buy-your-ticket" }],
      },
      {
        q: "What happens after the awards ceremony?",
        a: "Phase 2 begins — EduAid Africa and Rebuild My School Africa channel sponsor and community funding into verified schools selected through the award cycle.",
        ctas: [{ label: "Explore Programs", href: "/programs" }],
      },
    ],
  },
  {
    title: "B. Nominations & Nominees",
    description: "Who can be nominated, how submissions are verified, and which awards exist.",
    faqs: [
      {
        q: "Who can be nominated?",
        a: "Individuals, schools, NGOs, corporations, influencers, embassies, foundations and bilateral / multilateral institutions contributing to education in Africa.",
        ctas: [{ label: "Nominate for 2026", href: "/nominate" }],
      },
      {
        q: "Can I nominate someone from outside Africa?",
        a: "Yes — Africans in the diaspora and Friends of Africa whose work advances African education are explicitly eligible.",
      },
      {
        q: "What is the difference between nomination and pre-nomination?",
        a: "Pre-nomination is the public activation phase where anyone can flag candidates early. Formal nominations are submitted through the nominee form and reviewed by the NRC against the EDI matrix.",
      },
      {
        q: "How are nominees reviewed and verified?",
        a: "The Nomination Review Committee (NRC) screens every submission against the 5-pillar Education Development Index (Access, Quality, Equity, Innovation, Impact) before publication.",
      },
      {
        q: "What categories are open for nomination?",
        a: "18 award categories across the Blue Garnet, Platinum, Africa Education Icon, Influencer Impact, Gold Certificate and Regional Leadership tiers.",
        ctas: [{ label: "Browse Categories", href: "/categories" }],
      },
      {
        q: "What is the Africa Education Icon Award?",
        a: "The highest lifetime recognition (2006–2026), awarded under a 3-3-3 structure by an independent Icon Award expert panel — not by public vote.",
      },
      {
        q: "What are Platinum Recognition Awards?",
        a: "Merit-based honours for verified, high-impact contributions — selected through governance review rather than public voting.",
      },
      {
        q: "What are Influencer Education Impact Awards?",
        a: "A dedicated tier celebrating social-media voices, artists and athletes amplifying education advocacy across Africa.",
      },
    ],
  },
  {
    title: "C. Voting & AGC",
    description: "How Afri-Gold Coins, public voting and jury evaluation work together.",
    faqs: [
      {
        q: "What are AGC voting points?",
        a: "Afri-Gold Coins are non-tradeable participation credits used during official voting windows. 10 AGCc = 1 AGC. 1 vote = 1 AGC. AGC is not cryptocurrency and cannot be cashed out.",
      },
      {
        q: "How does AGC voting work?",
        a: "During an official window, open a nominee profile and spend AGC to vote. Every vote is logged in an append-only audit ledger with anti-fraud and identity checks.",
        ctas: [{ label: "Learn About Voting", href: "/how-voting-works" }],
      },
      {
        q: "How can users earn AGC?",
        a: "+2 AGCc signup, +2 AGCc per verified nomination, +1 daily sign-in, +3 AGC first referral, +1 AGC each additional referral, +1 AGCc per NESA TV watch session, plus bonus AGC on eligible donations and ticket purchases.",
        ctas: [{ label: "Earn AGC", href: "/earn-agc" }],
      },
      {
        q: "Is voting public or jury-based?",
        a: "Both — Gold Certificate categories are 100% public AGC voting. Blue Garnet categories combine jury evaluation with public AGC voting. Platinum and Icon awards are governance / panel selected.",
      },
      {
        q: "When does voting begin?",
        a: "Official Gold and Blue Garnet voting windows open between April and June 2026 after NRC verification and jury onboarding. Outside these windows the platform accepts nominations and participation activities only.",
      },
      {
        q: "How does Blue Garnet voting work?",
        a: "Blue Garnet uses a two-stage flow: a competitive shortlist scored by an independent jury, then a public AGC vote that combines with jury weighting to determine the final winner.",
      },
    ],
  },
  {
    title: "D. Awards & Recognition",
    description: "Tiers, certificates and the post-award lifecycle.",
    faqs: [
      {
        q: "What award tiers exist?",
        a: "Africa Education Icon (Lifetime), Blue Garnet (jury + public), Platinum (merit), Gold Certificate (public vote), Influencer Impact and Regional Leadership awards.",
      },
      {
        q: "When and where is the 2026 ceremony?",
        a: "June 27, 2026 — the continental Blue Garnet Awards Gala, with regional ceremonies and NESA TV broadcasts throughout the year.",
      },
      {
        q: "Are certificates verifiable?",
        a: "Yes. Every certificate is generated with a verifiable ID and can be checked on the Certificate Verification page.",
        ctas: [{ label: "Verify a Certificate", href: "/verify-certificate" }],
      },
    ],
  },
  {
    title: "E. Regions & Participation",
    description: "How continental coverage and diaspora participation work.",
    faqs: [
      {
        q: "Which African regions participate?",
        a: "West, East, North, Central and Southern Africa — plus Diaspora & Global Africa and Friends of Africa zones.",
        ctas: [{ label: "Explore Regions", href: "/region" }],
      },
      {
        q: "Can Africans in the diaspora participate?",
        a: "Yes. Diaspora communities can nominate, earn AGC, vote and attend the Gala — and the Diaspora & Global Africa zone has dedicated recognition.",
      },
      {
        q: "Can Friends of Africa participate?",
        a: "Yes. Non-Africans whose work advances African education can be nominated, sponsor categories or partner through the Friends of Africa philanthropic tiers.",
      },
      {
        q: "Are nominations limited to one country?",
        a: "No. Many categories are continental, with regional shortlists running first to ensure fair representation before the continental finals.",
      },
      {
        q: "How are regional nominees organized?",
        a: "Each region has a hub page with its shortlist, local chapter contacts and regional ceremonies. Continental categories aggregate regional winners.",
      },
    ],
  },
  {
    title: "F. Post-Award Impact",
    description: "How recognition converts into real education outcomes.",
    faqs: [
      {
        q: "What is Rebuild My School Africa?",
        a: "A flagship Phase 2 project where each region selects one special-needs school for transformation through community nominations, public votes and EduAid Africa funding.",
        ctas: [{ label: "Nominate a School", href: "/nominate?category=special-school-impact" }],
      },
      {
        q: "What is EduAid Africa?",
        a: "EduAid Africa is the legacy program providing infrastructure crowdfunding, special school grants and community-led education interventions across the continent.",
        ctas: [{ label: "Support EduAid Africa", href: "/donate" }],
      },
      {
        q: "How does the award transition into social impact?",
        a: "Verified nominees and recognised projects feed directly into the EduAid Africa pipeline, with sponsor commitments and community funding tracked transparently.",
      },
      {
        q: "How are schools selected for support?",
        a: "Communities nominate, the public votes, and the NRC + EduAid technical team verify needs against the EDI matrix before funding is released.",
      },
      {
        q: "What happens after the gala?",
        a: "Recognition shifts into delivery: school rebuilds, special grants, regional activations and ongoing NESA TV storytelling that keeps sponsors and communities accountable.",
      },
    ],
  },
  {
    title: "G. Partnerships & Media",
    description: "Sponsors, partners, media and local chapters.",
    faqs: [
      {
        q: "How can organizations partner with NESA-Africa?",
        a: "Through the Partners hub — corporate, philanthropic, media and ecosystem partnerships are all supported with tailored CSR alignment.",
        ctas: [{ label: "Partner With NESA-Africa", href: "/sponsors" }],
      },
      {
        q: "How can sponsors participate?",
        a: "Six corporate tiers from $20,000 to $250,000+, plus four Friend-of-Africa philanthropic levels — each with branding, gala presence and CSR recognition. Sponsors never influence winners; the integrity firewall is strict.",
      },
      {
        q: "Can media organizations cover the campaign?",
        a: "Yes. Accredited media can access the press room, NESA TV feeds and on-the-ground regional coverage. Contact info@nesa.africa for accreditation.",
      },
      {
        q: "How can local chapters participate?",
        a: "Through the Ambassador and OLC programs — local chapters drive nominations, voter awareness, school visibility and revenue sharing in their region.",
        ctas: [{ label: "Become an Ambassador", href: "/ambassadors" }],
      },
    ],
  },
];
