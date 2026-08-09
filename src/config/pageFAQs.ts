// =============================================================
// NESA-Africa 2026 — Page-Specific FAQ System
// =============================================================
// Brand architecture (do NOT deviate):
//   Official Name:  New Education Standard Award Africa (NESA-Africa)
//   Current Edition: NESA-Africa 2026
//   Motto / Brand Line: "The African Blue-Garnet Awards for Education"
//
// Integrity rule used across all FAQs that mention sponsorship,
// voting, judging or award outcomes:
//   New Education Standard Award Africa (NESA-Africa) 2026 maintains
//   a strict separation between sponsorship, partnership, endorsement
//   and award governance. Sponsors, partners, endorsers and donors
//   cannot nominate, shortlist, vote, judge, lobby, influence or
//   determine award outcomes.
//
// Placeholders intentionally left for unconfirmed information:
//   [CONFIRM DATE] [CONFIRM DEADLINE] [CONFIRM VENUE] [CONFIRM EMAIL]
//   [CONFIRM PHONE NUMBER] [APPROVED PRICING] [APPROVED TIMELINE]
//   [APPROVED SPONSOR BENEFITS]
// =============================================================

export interface FAQ {
  q: string;
  a: string;
  /** Optional CTAs rendered beneath the answer */
  ctas?: { label: string; href: string }[];
}

export interface FAQGroup {
  title: string;
  description?: string;
  faqs: FAQ[];
}

export interface PageFAQ {
  /** Route path or path prefix (e.g. "/", "/nominate", "/awards") */
  match: string;
  title: string;
  subtitle?: string;
  faqs: FAQ[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

// -------------------------------------------------------------
// Reusable integrity clause (kept short — for inline reuse)
// -------------------------------------------------------------
const INTEGRITY_SHORT =
  "Sponsors, partners, endorsers and donors cannot nominate, shortlist, vote, judge, lobby, influence or determine award outcomes. Award governance, verification, voting, judging and winner selection remain fully independent.";

// -------------------------------------------------------------
// Universal fallback
// -------------------------------------------------------------
const DEFAULT_FAQS: FAQ[] = [
  {
    q: "What is New Education Standard Award Africa (NESA-Africa)?",
    a: 'New Education Standard Award Africa (NESA-Africa) is a continental recognition and impact platform celebrating individuals, schools, organisations and partners advancing Education for All across Africa and the African diaspora. Its motto is "The African Blue-Garnet Awards for Education".',
  },
  {
    q: "What is NESA-Africa 2026?",
    a: "NESA-Africa 2026 is the current edition of the awards cycle, running from pre-nomination through verification, public voting, the Blue Garnet Awards Gala and the post-award EduAid-Africa impact phase.",
  },
  {
    q: "How can I participate?",
    a: "You can nominate a changemaker, support a nominee with public voting, sponsor a category, endorse the programme as an institution, or partner with NESA-Africa on media, technology, hospitality or implementation.",
  },
  {
    q: "Is NESA-Africa influenced by sponsors?",
    a: INTEGRITY_SHORT,
  },
];

// =============================================================
// Page-specific FAQ sets — longest path matched first
// =============================================================
export const PAGE_FAQS: PageFAQ[] = [
  // ---------------- 1. HOMEPAGE ----------------
  {
    match: "/",
    title: "NESA-Africa 2026 — Frequently Asked Questions",
    subtitle:
      'New Education Standard Award Africa (NESA-Africa) 2026 — "The African Blue-Garnet Awards for Education". Quick answers for first-time visitors.',
    viewAllHref: "/faq",
    viewAllLabel: "Open Full FAQ Hub",
    faqs: [
      {
        q: "What is New Education Standard Award Africa (NESA-Africa)?",
        a: 'New Education Standard Award Africa (NESA-Africa) is a continental recognition and impact platform celebrating people, schools, organisations and partners advancing Education for All across Africa and the diaspora. Its motto is "The African Blue-Garnet Awards for Education".',
        ctas: [{ label: "About NESA-Africa", href: "/about" }],
      },
      {
        q: "What does NESA-Africa 2026 represent?",
        a: "NESA-Africa 2026 is the current edition of the awards cycle. It moves from public pre-nomination, through independent NRC verification, public voting, the Blue Garnet Awards Gala, and into post-award legacy impact through EduAid-Africa and Rebuild My School Africa.",
      },
      {
        q: 'What is the motto "The African Blue-Garnet Awards for Education"?',
        a: 'It is the official motto and premium brand line of NESA-Africa. It is not the legal name of the organisation. The official name remains New Education Standard Award Africa (NESA-Africa).',
      },
      {
        q: "Who can participate in NESA-Africa 2026?",
        a: "Educators, schools, NGOs, corporations, governments, foundations, influencers, media houses, diaspora communities and Friends of Africa whose work advances education across the continent.",
      },
      {
        q: "Is NESA-Africa only an awards event?",
        a: "No. NESA-Africa is an ecosystem built on a Recognition → Visibility → Partnerships → Legacy Impact model. Awards are followed by EduAid-Africa programmes, NESA-Africa TV storytelling, and Rebuild My School Africa interventions.",
      },
      {
        q: "How can I nominate, sponsor, partner or support?",
        a: "Use the navigation to nominate a changemaker, explore sponsorship categories, propose an institutional partnership, endorse the programme, or contribute to legacy projects.",
        ctas: [
          { label: "Explore Award Categories", href: "/categories" },
          { label: "Become a Sponsor", href: "/sponsor" },
          { label: "Partner With Us", href: "/partners" },
        ],
      },
      {
        q: "Can sponsors influence who wins?",
        a: INTEGRITY_SHORT,
      },
    ],
  },

  // ---------------- 2. ABOUT ----------------
  {
    match: "/about",
    title: "About NESA-Africa — FAQ",
    subtitle:
      "Understand the mission, host, ecosystem and credibility of New Education Standard Award Africa (NESA-Africa).",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What is the mission of NESA-Africa?",
        a: "To recognise, celebrate and scale verified contributions to Education for All across Africa, and to convert recognition into measurable education outcomes through legacy programmes.",
      },
      {
        q: "Why was NESA-Africa created?",
        a: "To close the gap between recognition and real impact in African education by linking awards to verified data, transparent governance and follow-through community programmes.",
      },
      {
        q: "Who powers or hosts NESA-Africa?",
        a: "NESA-Africa is hosted by the Santos Creations Educational Foundation (SCEF), through its Nigeria Local Chapter, in partnership with regional chapters and institutional partners across Africa.",
      },
      {
        q: "What is the role of Santos Creations Educational Foundation (SCEF)?",
        a: "SCEF is the founding institutional host. It provides governance, secretariat support and the legacy implementation pipeline that turns NESA-Africa recognition into education projects on the ground.",
      },
      {
        q: "How are NESA-Africa, EduAid-Africa, NESA-Africa TV and Rebuild My School Africa connected?",
        a: "NESA-Africa is the master brand. EduAid-Africa runs implementation and webinars. NESA-Africa TV runs storytelling and broadcast. Rebuild My School Africa runs post-award school infrastructure projects. All are sub-brands under NESA-Africa.",
      },
      {
        q: "What makes NESA-Africa different from a conventional awards programme?",
        a: "It is governance-led, evidence-based and legacy-driven. Every category is tied to verified data, independent review and a follow-through impact subcategory.",
      },
      {
        q: "How does NESA-Africa support education transformation across Africa?",
        a: "Through public recognition, sponsor-funded category programmes, EduAid-Africa webinars, NESA-Africa TV documentation and Rebuild My School Africa infrastructure delivery.",
      },
      {
        q: 'What does the motto "The African Blue-Garnet Awards for Education" mean?',
        a: "It is a premium brand line that signals continental prestige. The blue garnet is rare, durable and luminous — a fitting symbol for resilient education leadership in Africa.",
      },
    ],
  },

  // ---------------- 3. AWARDS ----------------
  {
    match: "/awards",
    title: "Awards — Frequently Asked Questions",
    subtitle:
      'The recognition structure of New Education Standard Award Africa (NESA-Africa) 2026 — "The African Blue-Garnet Awards for Education".',
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What awards are available under NESA-Africa 2026?",
        a: "Africa Education Icon Lifetime Achievement Award (2006–2026), Blue Garnet Award Categories, Platinum Certificate Categories, Influencers Education Impact 2026 and Regional Leadership recognitions.",
        ctas: [{ label: "Browse Categories", href: "/categories" }],
      },
      {
        q: "What are the Blue Garnet Award Categories?",
        a: "Premier continental categories combining independent jury evaluation with public voting. They represent the highest competitive recognition tier of NESA-Africa 2026.",
        ctas: [{ label: "Blue Garnet Awards", href: "/awards/blue-garnet" }],
      },
      {
        q: "What are the Platinum Certificate Categories?",
        a: "Merit-based recognitions awarded through governance review and verified evidence — not public voting. They honour sustained, high-impact contributions across the education ecosystem.",
        ctas: [{ label: "Platinum Awards", href: "/awards/platinum" }],
      },
      {
        q: "What is the Africa Education Icon Lifetime Achievement Award, 2006–2026?",
        a: "The highest lifetime recognition of NESA-Africa, covering two decades of African education leadership (2006–2026). Selected by an independent Icon expert panel under a 3-3-3 structure.",
        ctas: [{ label: "Africa Education Icon", href: "/awards/africa-education-icon" }],
      },
      {
        q: "What is Influencers Education Impact 2026?",
        a: "A dedicated recognition tier for creators, artists, athletes, youth advocates and media voices whose digital influence advances education across Africa.",
        ctas: [{ label: "Influencers Impact 2026", href: "/awards/influencers-education-impact-2026-recognition" }],
      },
      {
        q: "Who can be nominated?",
        a: "Educators, schools, NGOs, corporations, governments, foundations, influencers, media houses, diaspora communities and Friends of Africa whose work advances education in Africa.",
      },
      {
        q: "How are nominees reviewed?",
        a: "The independent Nomination Review Committee (NRC) screens every submission against the 5-pillar Education Development Index (Access, Quality, Equity, Innovation, Impact) before publication.",
      },
      {
        q: "How are winners selected?",
        a: "Selection varies by tier: Icon and Platinum are governance/panel selected; Blue Garnet combines independent jury scoring with public voting; Gold Certificate categories are public-vote driven within official voting windows.",
      },
      {
        q: "Can public voting influence results?",
        a: "Public voting contributes to Blue Garnet and Gold Certificate categories within official windows. It does not override governance verification or jury evaluation, and is subject to anti-fraud audit.",
      },
      {
        q: "How does NESA-Africa protect award integrity?",
        a: "Through strict separation of governance, an independent NRC and jury, append-only audit logs for voting, sponsor firewalls, and published evaluation rubrics.",
      },
      {
        q: "Can sponsors influence award outcomes?",
        a: INTEGRITY_SHORT,
      },
    ],
  },

  // ---------------- 4. CATEGORIES ----------------
  {
    match: "/categories",
    title: "Award Categories — FAQ",
    subtitle:
      "How NESA-Africa 2026 categories are organised, who qualifies and how to choose the right one.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "How are NESA-Africa categories organised?",
        a: "Categories sit within four tiers: Africa Education Icon (lifetime), Blue Garnet (jury + public), Platinum Certificate (governance/merit) and Gold Certificate / Influencer Impact (public voting and digital impact).",
      },
      {
        q: "What is the difference between Blue Garnet and Platinum Certificate categories?",
        a: "Blue Garnet is competitive and combines jury scoring with public voting. Platinum Certificate is governance-led, evidence-based recognition without public voting.",
      },
      {
        q: "Can one nominee enter more than one category?",
        a: "Yes, where eligibility allows, but each submission must reflect distinct evidence and impact relevant to that category. The NRC may consolidate duplicate submissions.",
      },
      {
        q: "Are there regional, national and continental categories?",
        a: "Yes. NESA-Africa runs continental, regional and national categories so that local excellence is celebrated alongside continental leadership.",
      },
      {
        q: "What documents or evidence may be required?",
        a: "Programme descriptions, beneficiary numbers, partner letters, photos, links, media references and any verifiable impact data. Sensitive material is handled under strict data-protection rules.",
      },
      {
        q: "What makes a nomination strong?",
        a: "Clear scope, verifiable beneficiaries, documented outcomes, alignment with the EDI pillars (Access, Quality, Equity, Innovation, Impact) and credible references.",
      },
      {
        q: "Can organisations nominate themselves?",
        a: "Yes. Self-nomination is allowed where category rules permit, provided the evidence is verifiable and the submission meets governance standards.",
      },
      {
        q: "Can sponsors support a category?",
        a: "Yes — sponsors can fund a category, gala segment or programme, and receive approved visibility and CSR reporting benefits.",
      },
      {
        q: "Can category sponsors influence winners?",
        a: INTEGRITY_SHORT,
      },
      {
        q: "How do I choose the right category?",
        a: "Start with the nominee's primary contribution (school, NGO, corporate, government, media, influencer), then match it to the closest category. The category detail page lists eligibility and evidence guidance.",
        ctas: [{ label: "Browse Categories", href: "/categories" }],
      },
    ],
  },

  // ---------------- 5. NOMINATION ----------------
  {
    match: "/nominate",
    title: "Nominate for NESA-Africa 2026 — FAQ",
    subtitle:
      "Everything you need to know before submitting a nomination to New Education Standard Award Africa (NESA-Africa) 2026.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "Who can submit a nomination?",
        a: "Any individual or organisation may nominate a person, school, NGO, government body, corporation, foundation, influencer or partner whose work advances education in Africa.",
      },
      {
        q: "Can I nominate myself or my organisation?",
        a: "Yes, self-nomination is allowed where category rules permit. Submissions must include verifiable evidence and credible references.",
      },
      {
        q: "What information is required?",
        a: "Nominee details, category, programme summary, geographic reach, beneficiary numbers, supporting links, photos and any partner or media references.",
      },
      {
        q: "What evidence should be submitted?",
        a: "Annual reports, programme briefs, beneficiary data, media coverage, partner endorsements, photos, video links and any third-party verification you can share.",
      },
      {
        q: "Can I edit a nomination after submission?",
        a: "Limited edits are allowed before NRC review begins. After review starts, updates are handled by contacting the secretariat at [CONFIRM EMAIL].",
      },
      {
        q: "What happens after I submit?",
        a: "The submission enters the NRC review queue, is screened against the EDI pillars, and — if eligible — is published in the public nominee directory.",
      },
      {
        q: "How will nominees be contacted?",
        a: "Nominees receive an official acceptance notification with a verification token. They confirm participation, update their profile and access nominee resources.",
      },
      {
        q: "Is there a nomination fee?",
        a: "Public nominations are free. Optional premium profile features and confirmation services may apply at [APPROVED PRICING] when activated.",
      },
      {
        q: "How is nominee data protected?",
        a: "Nominee data is stored under strict access controls, used only for award governance and limited public profile display, and never sold or shared with sponsors.",
      },
      {
        q: "Can sponsors or partners influence nomination review?",
        a: INTEGRITY_SHORT,
      },
    ],
  },

  // ---------------- 6. VOTING ----------------
  {
    match: "/awards/gold-blue-garnet",
    title: "Voting — Frequently Asked Questions",
    subtitle:
      "How public voting works in NESA-Africa 2026 and how its integrity is protected.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What is public voting?",
        a: "There is no public voting in the NESA-Africa 2026 cycle. Recognition is decided by NRC verification, EDI Matrix assessment, independent judging and governance ratification.",
      },
      {
        q: "Who can vote?",
        a: "Not applicable for the 2026 cycle — no public voting is used.",
      },
      {
        q: "How many times can someone vote?",
        a: "Each account can cast unique votes per nominee per category, subject to the rules of each voting track. Duplicate or automated voting is detected and removed.",
      },
      {
        q: "Which categories include public voting?",
        a: "Blue Garnet (combined with jury) and Gold Certificate / Influencer Impact (public-led). Platinum and Africa Education Icon do not use public voting.",
      },
      {
        q: "Does public voting alone determine winners?",
        a: "Not in Blue Garnet — public votes are combined with independent jury scoring. In Gold and Influencer Impact categories, public voting is the primary signal, audited for integrity.",
      },
      {
        q: "How does NESA-Africa prevent manipulation?",
        a: "Through identity verification, device and session checks, anti-bot controls, append-only audit logs and post-vote integrity reviews.",
      },
      {
        q: "Can sponsors buy votes or influence votes?",
        a: INTEGRITY_SHORT,
      },
      {
        q: "What happens if suspicious voting activity is detected?",
        a: "Suspicious votes are quarantined, reviewed and removed where confirmed. Persistent abuse leads to account suspension and category disqualification where warranted.",
      },
      {
        q: "When will voting open and close?",
        a: "Official voting windows are: Gold Certificate [CONFIRM DATE] – [CONFIRM DATE]; Blue Garnet [CONFIRM DATE] – [CONFIRM DATE]. Outside these windows the platform only accepts nominations and engagement.",
      },
      {
        q: "Where can voters see official updates?",
        a: "On this voting page, the official NESA-Africa newsletter, and verified NESA-Africa social channels.",
        ctas: [{ label: "How Voting Works", href: "/how-voting-works" }],
      },
    ],
  },

  // ---------------- 7. NOMINEE PROFILE ----------------
  {
    match: "/nominee",
    title: "Nominee Profile — FAQ",
    subtitle:
      "What appears on a NESA-Africa 2026 nominee profile and what visitors can do.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What is a nominee profile?",
        a: "A public page that presents a verified nominee for NESA-Africa 2026 — including category, region, impact summary, evidence highlights and supporter actions.",
      },
      {
        q: "What information appears on a nominee profile?",
        a: "Name, category, region, profile photo, impact summary, optional media, supporter actions (where applicable) and a verification badge once NRC review is complete.",
      },
      {
        q: "How can a nominee update their profile?",
        a: "Confirmed nominees use their nominee dashboard and verification token to update profile content, evidence and media within the approved guidelines.",
      },
      {
        q: "Can visitors vote from nominee profiles?",
        a: "Yes, when the nominee belongs to a category with an active voting window. Voting buttons appear only within official windows and require a verified account.",
      },
      {
        q: "Can supporters share nominee profiles?",
        a: "Yes. Each profile has share tools for social platforms and messaging apps to help nominees grow their visibility.",
      },
      {
        q: "Does a profile guarantee finalist or winner status?",
        a: "No. A profile confirms eligibility and NRC verification only. Finalist and winner status follow the governance, jury and (where applicable) public voting process.",
      },
      {
        q: "Can sponsors contact nominees directly?",
        a: "Sponsorship and partnership conversations are routed through the secretariat. Direct sponsor-to-nominee contact for award influence is not permitted.",
      },
      {
        q: "How are corrections handled?",
        a: "Nominees and the public can request corrections through the profile or by emailing [CONFIRM EMAIL]. Verified corrections are applied promptly.",
      },
    ],
  },

  // ---------------- 8. SPONSORSHIP ----------------
  {
    match: "/sponsor",
    title: "Sponsor NESA-Africa 2026 — FAQ",
    subtitle:
      'Sponsorship categories, benefits and integrity rules for "The African Blue-Garnet Awards for Education".',
    viewAllHref: "/faq",
    faqs: [
      {
        q: "How can an organisation sponsor NESA-Africa 2026?",
        a: "Choose a sponsorship category that fits your CSR or brand goals, then contact the partnerships team at partnerships@nesa.africa for a tailored package.",
        ctas: [{ label: "Sponsorship Categories", href: "/sponsor" }],
      },
      {
        q: "What sponsorship categories are available?",
        a: "General NESA-Africa 2026 Sponsorship, Africa Education Icon Sponsorship, Blue Garnet Category Sponsorship, Platinum Certificate Category Sponsorship, Influencers Education Impact 2026 Sponsorship, Blue Garnet Awards Gala Sponsorship, EduAid-Africa Webinar Sponsorship, NESA-Africa TV Sponsorship, Rebuild My School Africa Sponsorship, Post-Award Legacy Sponsorship, General Award Sponsorship, and In-Kind Support Partner.",
      },
      {
        q: "What is General NESA-Africa 2026 Sponsorship?",
        a: "Cycle-wide sponsorship that supports the entire NESA-Africa 2026 platform across nominations, voting, gala and post-award impact.",
      },
      {
        q: "What is Blue Garnet Award Category Sponsorship?",
        a: "Sponsorship of a specific Blue Garnet category, including approved visibility on the category page, gala segment and category communications.",
      },
      {
        q: "What is Platinum Certificate Category Sponsorship?",
        a: "Sponsorship of a Platinum Certificate category recognising sustained merit, with approved visibility benefits.",
      },
      {
        q: "What is Gala Sponsorship?",
        a: "Sponsorship of the Blue Garnet Awards Gala — including premium branding, hospitality and broadcast association — at [APPROVED PRICING] tiers.",
      },
      {
        q: "What is EduAid-Africa Webinar Sponsorship?",
        a: "Sponsorship of EduAid-Africa thought-leadership webinars and capacity-building sessions, with approved branding and audience reporting.",
      },
      {
        q: "What is NESA-Africa TV Sponsorship?",
        a: "Sponsorship of NESA-Africa TV documentaries, finalist features and event broadcasts, with approved editorial-neutral branding.",
      },
      {
        q: "What is Rebuild My School Africa Sponsorship?",
        a: "Sponsorship of post-award school infrastructure projects — classrooms, libraries, digital labs, WASH and accessibility upgrades.",
      },
      {
        q: "What benefits do sponsors receive?",
        a: "[APPROVED SPONSOR BENEFITS] — typically include logo placement, gala access, NESA-Africa TV mentions, CSR/ESG reporting, social media features and partner communications.",
      },
      {
        q: "Are sponsorship prices fixed?",
        a: "All investment amounts are draft / indicative unless marked as officially approved by NESA-Africa 2026.",
      },
      {
        q: "Can sponsors receive CSR or ESG reporting?",
        a: "Yes. Approved sponsorship tiers include CSR / ESG impact reports aligned with SDG 4 and relevant African Union education frameworks.",
      },
      {
        q: "Can sponsors influence nominations, voting, judging or winners?",
        a: INTEGRITY_SHORT,
      },
      {
        q: "How do sponsors begin?",
        a: "Email partnerships@nesa.africa with your organisation, preferred category and CSR objectives. The partnerships team will respond within [CONFIRM] business days.",
        ctas: [{ label: "Sponsorship Hub", href: "/sponsor" }],
      },
    ],
  },

  // ---------------- 9. SPONSORSHIP TIERS ----------------
  {
    match: "/become-sponsor",
    title: "Sponsorship Tiers — FAQ",
    subtitle:
      "Tier structure, benefits and customisation for NESA-Africa 2026 sponsors.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What sponsorship tiers are available?",
        a: "Continental Title Partner, Africa Blue-Garnet Lead Sponsor, Gold Garnet Sponsor, Silver Garnet Sponsor, Bronze Garnet Sponsor, Category Sponsor and In-Kind Support Partner.",
      },
      {
        q: "What is a Continental Title Partner?",
        a: "The headline partner of NESA-Africa 2026, with the highest level of brand association across the cycle, gala and broadcasts.",
      },
      {
        q: "What is an Africa Blue-Garnet Lead Sponsor?",
        a: "A premium lead-tier sponsor with senior brand association across Blue Garnet categories, gala and media properties.",
      },
      { q: "What is a Gold Garnet Sponsor?", a: "A senior sponsor tier with significant visibility across selected categories and the gala." },
      { q: "What is a Silver Garnet Sponsor?", a: "A mid-tier sponsor with approved visibility and event-day access." },
      { q: "What is a Bronze Garnet Sponsor?", a: "An entry-level sponsor tier with approved visibility and recognition." },
      { q: "What is a Category Sponsor?", a: "A sponsor of a specific award category, with category-page visibility and gala segment recognition." },
      {
        q: "What is an In-Kind Support Partner?",
        a: "A partner providing services, products or expertise — such as venues, travel, hospitality, media, technology or logistics — instead of cash sponsorship.",
      },
      {
        q: "Are sponsorship amounts confirmed?",
        a: "All investment amounts are draft / indicative unless marked as officially approved by NESA-Africa 2026.",
      },
      {
        q: "Can packages be customised?",
        a: "Yes. Packages can be tailored to your CSR, ESG, marketing or implementation priorities while staying within sponsor-safe governance rules.",
      },
      {
        q: "What documents will sponsors receive?",
        a: "A signed sponsorship agreement, branding guidelines, gala materials and post-cycle CSR / impact reporting.",
      },
      { q: "Can sponsors influence award outcomes?", a: INTEGRITY_SHORT },
    ],
  },

  // ---------------- 10. PARTNERSHIPS ----------------
  {
    match: "/partner",
    title: "Partnerships — FAQ",
    subtitle:
      "How institutional, media, technology and implementation partners work with NESA-Africa 2026.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "Can an organisation partner without sponsoring?",
        a: "Yes. Partnerships can be strategic, in-kind or implementation-based and do not require cash sponsorship.",
      },
      {
        q: "What is the difference between sponsorship and partnership?",
        a: "Sponsorship is primarily a funded brand-association arrangement. Partnership is an institutional collaboration that may include MoUs, joint programmes, media, technology, hospitality or research support.",
      },
      {
        q: "What types of partners does NESA-Africa work with?",
        a: "Strategic Institutional Partners, CSR Implementation Partners, Government Partners, Development Partners, Media Partners, Technology Partners, Airline / Travel Partners, Hotel / Hospitality Partners, University / Academic Partners, Civil Society Partners, Diaspora Partners and Community Chapter Partners.",
      },
      {
        q: "Can partners contribute media, technology, logistics, travel, venues, research or outreach?",
        a: "Yes. In-kind contributions are formally recognised as partnership value and acknowledged across NESA-Africa channels.",
      },
      {
        q: "Do partnerships require an MoU?",
        a: "Most strategic and implementation partnerships are governed by an MoU outlining scope, deliverables, branding and integrity safeguards.",
      },
      {
        q: "Can partners receive visibility?",
        a: "Yes — through approved branding on partner pages, event signage, NESA-Africa TV mentions and communications.",
      },
      { q: "Can partners influence awards?", a: INTEGRITY_SHORT },
      {
        q: "How do we propose a partnership?",
        a: "Email partnerships@nesa.africa with a brief on your organisation, proposed contribution and CSR or institutional goals.",
        ctas: [{ label: "Partners Hub", href: "/partners" }],
      },
    ],
  },

  // ---------------- 11. ENDORSEMENTS ----------------
  {
    match: "/endorse",
    title: "Endorse NESA-Africa 2026 — FAQ",
    subtitle:
      "Institutional endorsement of New Education Standard Award Africa (NESA-Africa) 2026.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What is an endorsement?",
        a: "An institutional or public statement of support for the mission and credibility of NESA-Africa 2026, without financial obligation or governance authority.",
      },
      {
        q: "How is endorsement different from sponsorship?",
        a: "Endorsement is a statement of support. Sponsorship is a funded partnership with defined benefits. The two are governed separately.",
      },
      {
        q: "How is endorsement different from partnership?",
        a: "Partnerships involve operational collaboration and may include MoUs. Endorsements are voluntary recognitions of NESA-Africa's mission and credibility.",
      },
      {
        q: "Who can endorse NESA-Africa 2026?",
        a: "Governments, ministries, agencies, universities, NGOs, media houses, professional bodies, diaspora groups and civil-society institutions.",
      },
      {
        q: "What endorsement categories exist?",
        a: "Institutional Endorsement, Education Sector Endorsement, Civil Society Endorsement, Government / Agency Endorsement, Media Endorsement, Academic Endorsement and Diaspora Endorsement.",
      },
      { q: "Can endorsers influence award outcomes?", a: INTEGRITY_SHORT },
      {
        q: "Can endorsers use NESA-Africa branding?",
        a: "Endorsers may use approved endorsement marks in line with brand guidelines, but cannot use NESA-Africa marks for commercial promotion without written approval.",
      },
      {
        q: "Does endorsement create financial obligation?",
        a: "No. Endorsement does not require payment. It also does not create ownership, control, judging authority or automatic sponsorship status.",
      },
      {
        q: "How can an institution submit an endorsement?",
        a: "Use the endorsement form on the Endorse page or email endorsements@nesa.africa with an official letter on institutional letterhead.",
        ctas: [{ label: "Endorse NESA-Africa", href: "/endorse" }],
      },
    ],
  },

  // ---------------- 12. EDUAID-AFRICA ----------------
  {
    match: "/eduaid",
    title: "EduAid-Africa — FAQ",
    subtitle:
      "Education support, webinars and implementation under NESA-Africa 2026.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What is EduAid-Africa?",
        a: "EduAid-Africa is the implementation and capacity-building arm of NESA-Africa. It runs webinars, programmes and projects that turn recognition into measurable education outcomes.",
      },
      {
        q: "How does EduAid-Africa connect to NESA-Africa?",
        a: "EduAid-Africa is a sub-brand of NESA-Africa. Verified nominees and projects feed into the EduAid-Africa delivery pipeline.",
      },
      {
        q: "What are EduAid-Africa webinars?",
        a: "Continental knowledge-sharing sessions on education policy, innovation, equity, CSR and impact — featuring leaders, partners and practitioners.",
      },
      {
        q: "Who can attend EduAid-Africa webinars?",
        a: "Educators, students, NGOs, government officials, corporate CSR teams, media and the public. Most sessions are free; some are partner-only.",
      },
      {
        q: "Can organisations sponsor EduAid-Africa webinars?",
        a: "Yes. EduAid-Africa Webinar Sponsorship offers approved branding, speaker slots within editorial guidelines, and audience reporting.",
      },
      {
        q: "What topics are covered?",
        a: "STEM, EdTech, girls' education, special needs, teacher development, school infrastructure, climate and education, CSR and impact reporting.",
      },
      {
        q: "Can sponsors speak during webinars?",
        a: "Sponsors may participate as panellists or thought leaders within agreed editorial guidelines, without compromising independent content.",
      },
      {
        q: "What reporting is provided?",
        a: "Audience reach, engagement metrics, demographic summaries and post-event impact briefs.",
      },
      { q: "Does EduAid-Africa sponsorship affect award outcomes?", a: INTEGRITY_SHORT },
    ],
  },

  // ---------------- 13. NESA-AFRICA TV ----------------
  {
    match: "/media/nesa-tv",
    title: "NESA-Africa TV — FAQ",
    subtitle:
      "Storytelling, broadcast and sponsor-safe visibility through NESA-Africa TV.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What is NESA-Africa TV?",
        a: "The official media and storytelling channel of NESA-Africa — producing nominee features, finalist stories, documentaries and broadcasts across the 2026 cycle.",
      },
      {
        q: "What content does NESA-Africa TV produce?",
        a: "Nominee features, regional spotlights, EduAid-Africa documentaries, Rebuild My School Africa progress reports and Blue Garnet Awards Gala broadcasts.",
      },
      {
        q: "Can NESA-Africa TV feature nominees, finalists and winners?",
        a: "Yes, within editorial guidelines and with nominee consent. Coverage does not imply or influence award outcomes.",
      },
      {
        q: "Can sponsors support documentaries or finalist stories?",
        a: "Yes. NESA-Africa TV Sponsorship supports specific productions with approved, editorial-neutral branding.",
      },
      {
        q: "Can sponsors control editorial content?",
        a: "No. Editorial independence is preserved at all times.",
      },
      {
        q: "Can media partners collaborate with NESA-Africa TV?",
        a: "Yes. Accredited media and broadcast partners can co-produce, syndicate or rebroadcast NESA-Africa TV content under partnership terms.",
      },
      {
        q: "What analytics can sponsors receive?",
        a: "Audience reach, demographic and geographic distribution, watch-time and engagement metrics across published episodes.",
      },
      { q: "Does NESA-Africa TV sponsorship affect award outcomes?", a: INTEGRITY_SHORT },
    ],
  },

  // ---------------- 14. REBUILD MY SCHOOL AFRICA ----------------
  {
    match: "/rebuild",
    title: "Rebuild My School Africa — FAQ",
    subtitle:
      "Post-award legacy impact under NESA-Africa 2026.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What is Rebuild My School Africa?",
        a: "A flagship legacy programme that channels NESA-Africa recognition into measurable school transformation across the continent.",
      },
      {
        q: "How does it connect to NESA-Africa 2026?",
        a: "Each region selects priority schools — including special-needs schools — for transformation through nominations, public visibility and sponsor-funded delivery.",
      },
      {
        q: "What kinds of projects can be supported?",
        a: "Classrooms, libraries, digital labs, WASH facilities, accessibility upgrades, teacher resources and learning materials.",
      },
      {
        q: "Can sponsors support a school, classroom, library, digital lab, WASH facility or accessibility upgrade?",
        a: "Yes. Sponsors can fund a defined intervention package per school with documented before-and-after reporting.",
      },
      {
        q: "Can sponsors provide in-kind materials or services?",
        a: "Yes. In-kind partnerships are welcomed and formally recognised.",
      },
      {
        q: "How are schools selected?",
        a: "Communities nominate, the public votes and the NRC plus the EduAid-Africa technical team verify needs against the EDI matrix before funding is released.",
      },
      {
        q: "What safeguarding rules apply?",
        a: "All projects follow child-safeguarding, data-protection and contractor-vetting standards. Site visits require chaperoned access and consent.",
      },
      {
        q: "What reports will sponsors receive?",
        a: "Pre-build assessment, project plan, milestone updates, completion report and CSR-ready impact summary.",
      },
      {
        q: "Will there be before-and-after documentation?",
        a: "Yes — photography, video and beneficiary statements, produced in partnership with NESA-Africa TV.",
      },
    ],
  },

  // ---------------- 15. BLUE GARNET AWARDS GALA ----------------
  {
    match: "/buy-your-ticket",
    title: "Blue Garnet Awards Gala — FAQ",
    subtitle:
      'The continental finale of NESA-Africa 2026 — "The African Blue-Garnet Awards for Education".',
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What is the Blue Garnet Awards Gala?",
        a: "The official continental ceremony of NESA-Africa 2026 — where Blue Garnet, Platinum, Africa Education Icon and Influencer Impact honourees are celebrated.",
      },
      {
        q: "When and where will the Gala take place?",
        a: "Date: [CONFIRM DATE]. Venue: [CONFIRM VENUE]. Broadcast across NESA-Africa TV and partner channels.",
      },
      {
        q: "Who attends the Gala?",
        a: "Honourees, finalists, sponsors, partners, government and diplomatic guests, education leaders, media and invited diaspora delegates.",
      },
      {
        q: "Can sponsors support the Gala?",
        a: "Yes. Gala Sponsorship is offered across multiple tiers with approved visibility and hospitality benefits.",
      },
      {
        q: "What Gala sponsorship options are available?",
        a: "Title, Lead, Gold, Silver, Bronze, Category Segment and Hospitality / In-Kind sponsorship — at [APPROVED PRICING] tiers.",
      },
      {
        q: "Can sponsors present awards?",
        a: "Selected senior sponsors may present specific segments on stage, within editorial and integrity rules.",
      },
      { q: "Can Gala sponsors influence winners?", a: INTEGRITY_SHORT },
      {
        q: "Are tickets available?",
        a: "Tickets and table packages will open at [CONFIRM DATE] via the official ticket page.",
        ctas: [{ label: "Tickets & Tables", href: "/buy-your-ticket" }],
      },
      {
        q: "Will the Gala be broadcast?",
        a: "Yes. NESA-Africa TV will broadcast the ceremony with partner channels across Africa and the diaspora.",
      },
      {
        q: "How can media organisations cover the Gala?",
        a: "Media accreditation opens at [CONFIRM DATE]. Contact [CONFIRM EMAIL] for press credentials and broadcast cooperation.",
      },
    ],
  },

  // ---------------- 16. AFRICA EDUCATION ICON ----------------
  {
    match: "/awards/africa-education-icon",
    title: "Africa Education Icon Award — FAQ",
    subtitle:
      "Lifetime achievement recognition under NESA-Africa 2026 (2006–2026).",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What is the Africa Education Icon Lifetime Achievement Award, 2006–2026?",
        a: "The highest lifetime recognition of NESA-Africa, honouring sustained, continental-level contribution to African education over two decades.",
      },
      {
        q: "Why does the recognition cover 2006–2026?",
        a: "It anchors the award to 20 years of African education leadership — reflecting the period covered by the NESA-Africa governance framework.",
      },
      {
        q: "Who is eligible?",
        a: "Individuals with sustained, verifiable continental contribution to education across multiple countries, programmes or institutions.",
      },
      {
        q: "What evidence is considered?",
        a: "Programme records, institutional roles, peer testimonies, media references, published works and verifiable beneficiary impact.",
      },
      {
        q: "Is this award given every year?",
        a: "The Icon Award is conferred selectively under the 3-3-3 structure — a maximum of three honourees per defined sub-tier per cycle.",
      },
      {
        q: "Can sponsors support the Icon category?",
        a: "Yes — through Icon Tribute Publication and Legacy Documentary partnerships, with editorial-neutral branding.",
      },
      { q: "Can sponsors influence who receives the Icon Award?", a: INTEGRITY_SHORT },
      {
        q: "What is an Icon Tribute Publication Partner?",
        a: "A sponsor or partner supporting the official Icon Tribute Publication — a curated honourees record produced under independent editorial oversight.",
      },
      {
        q: "What is a Legacy Documentary Partner?",
        a: "A sponsor or partner co-funding NESA-Africa TV legacy documentaries on Icon Award honourees, produced under independent editorial guidelines.",
      },
    ],
  },

  // ---------------- 17. INFLUENCERS EDUCATION IMPACT ----------------
  {
    match: "/awards/influencers-education-impact-2026-recognition",
    title: "Influencers Education Impact 2026 — FAQ",
    subtitle:
      "Recognition for creators, youth voices, artists, athletes and digital advocates advancing African education.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "What is Influencers Education Impact 2026?",
        a: "A dedicated NESA-Africa 2026 recognition tier for digital voices — creators, artists, athletes, youth advocates and educators — whose influence advances education in Africa.",
      },
      {
        q: "Who can be recognised?",
        a: "Individuals or collectives with verifiable digital reach and education advocacy across African and diaspora audiences.",
      },
      {
        q: "Are teachers, students, creators and advocates eligible?",
        a: "Yes — any individual using digital platforms to advance education access, quality, equity, innovation or impact.",
      },
      {
        q: "What platforms count?",
        a: "Major social, video and audio platforms — including but not limited to YouTube, Instagram, TikTok, X, Facebook, podcasts and verified institutional channels.",
      },
      {
        q: "How is education impact measured?",
        a: "Through a blend of reach, engagement, sentiment, advocacy outputs and verifiable real-world education outcomes.",
      },
      {
        q: "Can brands sponsor this category?",
        a: "Yes — through Influencers Education Impact 2026 Sponsorship, with approved visibility and editorial-neutral branding.",
      },
      { q: "Can sponsors influence influencer selection or winners?", a: INTEGRITY_SHORT },
      {
        q: "What engagement metrics may be reported?",
        a: "Audience reach, demographic distribution, geographic spread, watch and engagement rates, and campaign-level impact summaries.",
      },
    ],
  },

  // ---------------- 18. MEDIA / PRESS ----------------
  {
    match: "/media",
    title: "Media & Press — FAQ",
    subtitle:
      "Coverage, accreditation and media partnerships for NESA-Africa 2026.",
    viewAllHref: "/faq",
    faqs: [
      {
        q: "How can media organisations cover NESA-Africa 2026?",
        a: "Through press accreditation, NESA-Africa TV cooperation and approved partner-media agreements. Email [CONFIRM EMAIL] for credentials.",
      },
      {
        q: "Is there a press kit?",
        a: "Yes — the official NESA-Africa 2026 press kit includes brand assets, fact sheet, programme overview and key spokespersons. Available on request at [CONFIRM EMAIL].",
      },
      {
        q: "Can journalists request interviews?",
        a: "Yes. Interview requests with NESA-Africa leadership, partners and honourees are coordinated through the secretariat.",
      },
      {
        q: "Can media organisations become official media partners?",
        a: "Yes. Media partners receive cooperation rights for content, broadcast and cross-promotion under partnership terms.",
      },
      {
        q: "Can media partners use NESA-Africa branding?",
        a: "Yes — within the approved brand and partnership guidelines.",
      },
      { q: "Can media partners influence awards?", a: INTEGRITY_SHORT },
      {
        q: "Who should media teams contact?",
        a: "Media & PR: [CONFIRM EMAIL]. General enquiries: info@nesa.africa.",
      },
      {
        q: "Are photos, videos and logos available?",
        a: "Yes — high-resolution photos, video reels and brand marks are available through the official media kit at [CONFIRM EMAIL].",
      },
    ],
  },

  // ---------------- 19. CONTACT ----------------
  {
    match: "/contact",
    title: "Contact NESA-Africa — FAQ",
    subtitle:
      "Routing your enquiry to the right team within NESA-Africa 2026.",
    viewAllHref: "/faq",
    faqs: [
      { q: "Who should I contact for sponsorship?", a: "Email partnerships@nesa.africa." },
      { q: "Who should I contact for partnership?", a: "Email partnerships@nesa.africa." },
      { q: "Who should I contact for endorsements?", a: "Email endorsements@nesa.africa or use the Endorse NESA-Africa page." },
      { q: "Who should I contact for nominations?", a: "Use the Nominate page, or email info@nesa.africa for nomination support." },
      { q: "Who should I contact for media?", a: "Email [CONFIRM EMAIL] for press, interviews and media partnerships." },
      { q: "Who should I contact for technical issues?", a: "Email [CONFIRM EMAIL] for platform, account or voting technical support." },
      { q: "How long does it take to receive a response?", a: "Most enquiries receive a response within 2 business days. Sponsorship and partnership replies may take up to 5 business days." },
      { q: "What information should I include in my message?", a: "Your name, organisation, country, the purpose of your enquiry and any relevant references or documents." },
      {
        q: "Where can I see the standard contact directory?",
        a: "Partnerships: partnerships@nesa.africa · General Enquiries: info@nesa.africa · CSR / Social Impact: [CONFIRM EMAIL] · Media / NESA-Africa TV: [CONFIRM EMAIL] · Technical Support: [CONFIRM EMAIL] · Phone: [CONFIRM PHONE NUMBER].",
      },
    ],
  },

  // ---------------- ANCILLARY PAGES (kept compact) ----------------
  {
    match: "/donate",
    title: "Donate — FAQ",
    subtitle: "How donations support EduAid-Africa and Rebuild My School Africa under NESA-Africa 2026.",
    faqs: [
      { q: "What does my donation support?", a: "Verified school infrastructure, special-needs school grants, teacher development and community education programmes under EduAid-Africa and Rebuild My School Africa." },
      { q: "Is my donation tax-deductible?", a: "Tax-deductibility depends on your country of residence. Documentation is available on request at [CONFIRM EMAIL]." },
      { q: "How are funds tracked?", a: "Through transparent reporting on funded projects, including before-and-after documentation." },
      { q: "Can I donate in-kind?", a: "Yes. In-kind donations (materials, services, expertise) are welcomed and formally recognised." },
      { q: "Can donors influence award outcomes?", a: INTEGRITY_SHORT },
    ],
  },
  {
    match: "/ambassadors",
    title: "Ambassadors — FAQ",
    subtitle: "How to become a NESA-Africa 2026 Ambassador.",
    faqs: [
      { q: "Who can become an Ambassador?", a: "Anyone passionate about advancing education in Africa — students, professionals, educators, creators, diaspora leaders and community organisers." },
      { q: "What do Ambassadors do?", a: "Drive nominations, voter awareness, regional visibility and community engagement on behalf of NESA-Africa 2026." },
      { q: "Are there Ambassador tiers?", a: "Yes — tiered Ambassador roles offer different levels of access, training and recognition." },
      { q: "Do Ambassadors receive rewards?", a: "Ambassadors earn recognition, training, AGC participation credits and gala access where applicable." },
      { q: "Can Ambassadors influence award outcomes?", a: INTEGRITY_SHORT },
    ],
  },
  {
    match: "/dashboard",
    title: "Your Dashboard — FAQ",
    subtitle: "Managing your NESA-Africa 2026 account.",
    faqs: [
      { q: "What can I do in the dashboard?", a: "Manage your profile, nominations, votes, AGC balance, notifications and event registrations." },
      { q: "How do I update my profile?", a: "Open the profile section of the dashboard and edit personal, organisational and visibility details." },
      { q: "How do I see my voting history?", a: "Open the voting section of the dashboard to view ballots, AGC spent and category windows." },
      { q: "How do I contact support?", a: "Use the in-dashboard help link or email info@nesa.africa." },
    ],
  },
  {
    match: "/programs",
    title: "Programmes — FAQ",
    subtitle: "Programmes under New Education Standard Award Africa (NESA-Africa) 2026.",
    faqs: [
      { q: "What programmes does NESA-Africa run?", a: "EduAid-Africa, NESA-Africa TV, Rebuild My School Africa, regional chapter programmes and Ambassador / Volunteer programmes." },
      { q: "How are programmes funded?", a: "Through sponsorships, partnerships, donations and in-kind contributions." },
      { q: "Can institutions co-deliver programmes?", a: "Yes. Strategic and implementation partners co-deliver programmes under MoUs." },
      { q: "Do programmes operate outside award cycles?", a: "Yes. Programmes run year-round; awards mark the recognition phase of the broader ecosystem." },
    ],
  },
  {
    match: "/login",
    title: "Sign in — FAQ",
    subtitle: "Accessing your NESA-Africa 2026 account.",
    faqs: [
      { q: "How do I sign in?", a: "Use your email and password, or sign in with Google where enabled." },
      { q: "I forgot my password — what do I do?", a: "Use the password reset link on the sign-in page to receive a reset email." },
      { q: "Do I need an account to vote?", a: "Yes — a verified account is required to vote during official windows." },
      { q: "How is my data protected?", a: "Personal data is stored under strict access controls and used only for award governance, account management and approved communications." },
    ],
  },
  {
    match: "/register",
    title: "Create an account — FAQ",
    subtitle: "Joining the NESA-Africa 2026 community.",
    faqs: [
      { q: "Why should I create an account?", a: "To nominate, follow nominees, manage GFAwzip Wallet payments, register for events and receive official updates." },
      { q: "Is registration free?", a: "Yes. Basic registration is free." },
      { q: "Can institutions register?", a: "Yes. Institutional accounts support sponsors, partners, endorsers and chapter teams." },
      { q: "What if I do not receive a verification email?", a: "Check your spam folder, then request a new verification email from the sign-in page or contact info@nesa.africa." },
    ],
  },
  {
    match: "/nominees",
    title: "Nominee Directory — FAQ",
    subtitle: "Exploring nominees of NESA-Africa 2026.",
    faqs: [
      { q: "What is the nominee directory?", a: "A public directory of verified NESA-Africa 2026 nominees by category, region and tier." },
      { q: "How do I find a nominee?", a: "Use the search, category filters and regional filters to navigate the directory." },
      { q: "How do I support a nominee?", a: "Open the nominee profile, share it on social media and vote during official voting windows." },
      { q: "Are all listed nominees verified?", a: "Yes. Listed nominees have completed NRC verification under the 5-pillar EDI framework." },
    ],
  },
  {
    match: "/region",
    title: "Regions — FAQ",
    subtitle: "How NESA-Africa 2026 organises continental and diaspora regions.",
    faqs: [
      { q: "Which regions does NESA-Africa cover?", a: "West, East, North, Central and Southern Africa — plus Diaspora & Global Africa and Friends of Africa zones." },
      { q: "Do regions have their own pages?", a: "Yes. Each region has a hub with nominees, partners, chapter contacts and events." },
      { q: "Can countries have local categories?", a: "Yes. National categories run alongside regional and continental categories." },
      { q: "How do I find my region?", a: "Use the regional switcher in the navigation to open your region's hub." },
    ],
  },

  // ---------------- Fallback ----------------
  {
    match: "*",
    title: "Frequently Asked Questions",
    subtitle:
      'About New Education Standard Award Africa (NESA-Africa) 2026 — "The African Blue-Garnet Awards for Education".',
    faqs: DEFAULT_FAQS,
  },
];

// =============================================================
// Route matcher — longest match wins
// =============================================================
export function getFAQsForPath(pathname: string): PageFAQ {
  const normalized = pathname.replace(/\/+$/, "") || "/";

  // Sort by descending match length so /awards/africa-education-icon
  // beats /awards, and /media/nesa-tv beats /media.
  const sorted = [...PAGE_FAQS]
    .filter((p) => p.match !== "*")
    .sort((a, b) => b.match.length - a.match.length);

  for (const entry of sorted) {
    if (entry.match === "/" && normalized === "/") return entry;
    if (entry.match !== "/" && normalized.startsWith(entry.match)) return entry;
  }

  return PAGE_FAQS.find((p) => p.match === "*")!;
}

// =============================================================
// FULL FAQ HUB — used on /faq (help-center) page
// Aligned with the corrected brand architecture.
// =============================================================
export const FULL_FAQ_GROUPS: FAQGroup[] = [
  {
    title: "A. General NESA-Africa",
    description:
      'New Education Standard Award Africa (NESA-Africa) and the motto "The African Blue-Garnet Awards for Education".',
    faqs: [
      {
        q: "What is New Education Standard Award Africa (NESA-Africa)?",
        a: "A continental recognition and impact platform celebrating individuals, schools, organisations and partners advancing Education for All across Africa and the diaspora.",
      },
      {
        q: 'What is "The African Blue-Garnet Awards for Education"?',
        a: "It is the official motto and premium brand line of NESA-Africa. The legal name remains New Education Standard Award Africa (NESA-Africa).",
      },
      {
        q: "What is NESA-Africa 2026?",
        a: "The current edition of the awards cycle, covering pre-nomination, verification, public voting, the Blue Garnet Awards Gala and post-award legacy impact.",
      },
      {
        q: "Who hosts NESA-Africa?",
        a: "The Santos Creations Educational Foundation (SCEF), through its Nigeria Local Chapter and regional partners across Africa.",
      },
    ],
  },
  {
    title: "B. Awards & Categories",
    description: "Award tiers, categories and selection.",
    faqs: [
      {
        q: "What award tiers exist?",
        a: "Africa Education Icon (lifetime), Blue Garnet (jury + public), Platinum Certificate (governance/merit), Gold Certificate / Influencer Impact (public-led) and Regional Leadership recognitions.",
      },
      {
        q: "How are winners selected?",
        a: "Icon and Platinum are governance/panel selected; Blue Garnet combines independent jury scoring with public voting; Gold and Influencer Impact are public-vote driven, audited for integrity.",
      },
      {
        q: "Can sponsors influence award outcomes?",
        a: INTEGRITY_SHORT,
      },
    ],
  },
  {
    title: "C. Nomination & Voting",
    description: "How nominations and assessment work.",
    faqs: [
      { q: "Who can be nominated?", a: "Educators, schools, NGOs, corporations, governments, foundations, influencers, media houses, diaspora communities and Friends of Africa." },
      { q: "How are nominees verified?", a: "By the independent Nomination Review Committee (NRC) against the 5-pillar Education Development Index." },
      { q: "How does public voting work?", a: "There is no public voting in the 2026 cycle. Recognition is decided by verification, assessment, judging and governance ratification." },
      { q: "When does voting open?", a: "Gold Certificate [CONFIRM DATE] – [CONFIRM DATE]; Blue Garnet [CONFIRM DATE] – [CONFIRM DATE]." },
    ],
  },
  {
    title: "D. Sponsorship",
    description: "How organisations sponsor NESA-Africa 2026.",
    faqs: [
      { q: "What sponsorship categories are available?", a: "General, Icon, Blue Garnet Category, Platinum Category, Influencers Education Impact 2026, Gala, EduAid-Africa Webinar, NESA-Africa TV, Rebuild My School Africa, Post-Award Legacy, General Award and In-Kind Support." },
      { q: "Are sponsorship prices fixed?", a: "All investment amounts are draft / indicative unless marked as officially approved by NESA-Africa 2026." },
      { q: "Can sponsors influence awards?", a: INTEGRITY_SHORT },
    ],
  },
  {
    title: "E. Partnership & Endorsement",
    description: "Institutional collaboration and statements of support.",
    faqs: [
      { q: "What is the difference between sponsorship and partnership?", a: "Sponsorship is primarily funded brand association. Partnership is institutional collaboration, often under MoU, including in-kind and implementation support." },
      { q: "What is endorsement?", a: "A statement of institutional support for NESA-Africa, without financial obligation or governance authority." },
      { q: "Can partners or endorsers influence awards?", a: INTEGRITY_SHORT },
    ],
  },
  {
    title: "F. EduAid-Africa",
    description: "Education programmes, webinars and implementation.",
    faqs: [
      { q: "What is EduAid-Africa?", a: "The implementation and capacity-building arm of NESA-Africa, running webinars, programmes and projects." },
      { q: "Can sponsors support EduAid-Africa?", a: "Yes — through EduAid-Africa Webinar Sponsorship and programme partnerships." },
    ],
  },
  {
    title: "G. NESA-Africa TV",
    description: "Storytelling, documentaries and broadcasts.",
    faqs: [
      { q: "What is NESA-Africa TV?", a: "The official media and storytelling channel of NESA-Africa, producing nominee features, documentaries and Gala broadcasts." },
      { q: "Can sponsors control editorial content?", a: "No — editorial independence is preserved at all times." },
    ],
  },
  {
    title: "H. Rebuild My School Africa",
    description: "Post-award legacy infrastructure projects.",
    faqs: [
      { q: "What is Rebuild My School Africa?", a: "A flagship legacy programme that converts NESA-Africa recognition into school transformation across the continent." },
      { q: "Can sponsors fund specific schools?", a: "Yes — sponsors can fund defined interventions per school, with documented before-and-after reporting." },
    ],
  },
  {
    title: "I. Blue Garnet Awards Gala",
    description: "The continental finale ceremony.",
    faqs: [
      { q: "When is the Gala?", a: "[CONFIRM DATE], at [CONFIRM VENUE], broadcast on NESA-Africa TV." },
      { q: "Can Gala sponsors influence winners?", a: INTEGRITY_SHORT },
    ],
  },
  {
    title: "J. Media",
    description: "Press, accreditation and media partnerships.",
    faqs: [
      { q: "How can media cover NESA-Africa 2026?", a: "Through press accreditation and media partnerships. Contact [CONFIRM EMAIL]." },
      { q: "Can media partners influence awards?", a: INTEGRITY_SHORT },
    ],
  },
  {
    title: "K. Contact & Support",
    description: "Routing enquiries to the right team.",
    faqs: [
      { q: "How do I contact the right team?", a: "Partnerships: partnerships@nesa.africa · General: info@nesa.africa · Endorsements: endorsements@nesa.africa · Media: [CONFIRM EMAIL] · Technical: [CONFIRM EMAIL] · Phone: [CONFIRM PHONE NUMBER]." },
      { q: "How long until I receive a response?", a: "Most enquiries within 2 business days; sponsorship and partnership replies may take up to 5 business days." },
    ],
  },
];
