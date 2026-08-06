// NESA-Africa 2026 Capability Statement — canonical content module.
// Single source of truth for the approved 2026 copy. Sections may consume
// individual constants without touching layout. Do NOT introduce visual
// changes here — this file is text only.

export const POSITIONING = {
  name: "NESA-Africa 2026",
  fullMeaning: "New Education Standard Award Africa",
  positioning: "Africa's Education Recognition & Impact Platform",
  mandate: "Recognising the Enablers of Education for All Across Africa",
  theme: "The African Blue-Garnet Awards for Education",
  flagshipEvent: "Gold-Blue Garnet Awards Gala",
  date: "13 December 2026",
  location: "Lagos, Nigeria",
  organisedBy: "Santos Creations Educational Foundation",
  impactPartners: ["EduAid-Africa", "Rebuild My School Africa"],
  closingSalute:
    "Africa sees you. Africa appreciates you. Africa says thank you.",
} as const;

export const HERO_COPY = {
  headline: "NESA-Africa 2026",
  subhead: "Africa's Education Recognition & Impact Platform",
  tagline: "Recognising the Enablers of Education for All Across Africa",
  body: [
    "NESA-Africa — the New Education Standard Award Africa — is a continental education recognition and impact platform created to identify, verify, recognise, celebrate, connect and support the people, organisations and institutions enabling Education for All across Africa.",
    "An initiative of Santos Creations Educational Foundation, NESA-Africa 2026 brings together Education Enablers, corporate organisations, philanthropists, governments, development partners, universities, faith-based organisations, media platforms, digital creators, diaspora Africans and Friends of Africa.",
    "NESA-Africa turns recognition into visibility, credibility, partnerships, investment and measurable education impact.",
  ],
  primaryCTAs: [
    { label: "Nominate an Education Enabler", href: "/nominate" },
    { label: "Become a Sponsor", href: "/sponsors" },
    { label: "Join as a Volunteer", href: "/volunteer" },
    { label: "Explore Award Categories", href: "/awards" },
  ],
} as const;

export const ABOUT_INTRO = {
  eyebrow: "About NESA-Africa",
  headline: "Africa's Education Recognition & Impact Platform",
  body: [
    "NESA-Africa exists to celebrate and support the Enablers of Education for All Across Africa — the individuals, organisations, institutions and partnerships creating real educational impact through leadership, funding, innovation, advocacy, service, public policy, media influence and community transformation.",
    "Through nominations, verification, independent judging, public participation, media storytelling, recognition events and post-award impact programmes, NESA-Africa provides a trusted continental platform for recognising education impact.",
    "The 2026 edition is themed The African Blue-Garnet Awards for Education. The flagship event is the Gold-Blue Garnet Awards Gala on 13 December 2026 in Lagos, Nigeria.",
  ],
} as const;

export const VISION = {
  title: "Our Vision",
  body: "To build a continent where every genuine Education Enabler is seen, celebrated, supported and connected to opportunities that advance Education for All. NESA-Africa envisions an Africa where recognition is not only about applause, but about measurable impact, continental collaboration, investment, institutional credibility and long-term educational transformation.",
} as const;

export const MISSION = {
  title: "Our Mission",
  body: "To create a credible, transparent and impact-driven continental platform that recognises outstanding contributions to education, amplifies the stories of Education Enablers, connects nominees and winners to opportunities, and drives measurable impact through partnerships, media, public participation and post-award education programmes.",
} as const;

export const STRATEGIC_OBJECTIVES = [
  {
    number: "01",
    title: "Identify and Recognise Education Enablers Across Africa",
    body: "Identify, verify and celebrate individuals, organisations, institutions, companies, faith-based bodies, public agencies, philanthropists, innovators, diaspora contributors and Friends of Africa whose work is advancing Education for All across the continent.",
  },
  {
    number: "02",
    title: "Amplify Education Impact Through Media, Storytelling and Public Participation",
    body: "Use nominations, nominee profiles, NESA Africa TV, webinars, documentaries, digital campaigns, public voting and regional engagement to make the work of Education Enablers visible, trusted and widely celebrated.",
  },
  {
    number: "03",
    title: "Connect Recognition to Partnerships, Funding and Measurable Impact",
    body: "Ensure recognition leads to practical education outcomes by connecting nominees, winners, sponsors, donors and partners to scholarships, school support, EduAid-Africa, Rebuild My School Africa, special needs education initiatives and Afri-EduTourism legacy programmes.",
  },
  {
    number: "04",
    title: "Build a Transparent Continental Education Recognition Ecosystem",
    body: "Strengthen public trust through a credible recognition framework, independent judging, clear award categories, verified nominations, AGC-powered participation and a strict integrity firewall where sponsorship does not influence winners.",
  },
] as const;

export const CORE_IDENTITY = [
  { label: "Name", value: "NESA-Africa 2026" },
  { label: "Full Meaning", value: "New Education Standard Award Africa" },
  { label: "Theme", value: "The African Blue-Garnet Awards for Education" },
  { label: "Positioning", value: "Africa's Education Recognition & Impact Platform" },
  { label: "Core Mandate", value: "Recognising the Enablers of Education for All Across Africa" },
  { label: "Flagship Event", value: "Gold-Blue Garnet Awards Gala" },
  { label: "Date", value: "13 December 2026" },
  { label: "Location", value: "Lagos, Nigeria" },
  { label: "Organised By", value: "Santos Creations Educational Foundation" },
  { label: "Impact Partners", value: "EduAid-Africa and Rebuild My School Africa" },
] as const;

export const WHAT_WE_DO = [
  {
    title: "Continental Education Recognition",
    body: "A structured platform for recognising education impact across individuals, organisations, institutions, public agencies, corporate bodies, development partners and global supporters of African education.",
  },
  {
    title: "Nomination and Verification",
    body: "Transparent nomination processes through public submissions, nominee profiling, category alignment, documentation review, regional classification and independent verification.",
  },
  {
    title: "Awards and Public Recognition",
    body: "Recognition campaigns, showcases, media features, public voting, jury review processes and award events that celebrate measurable education impact.",
  },
  {
    title: "Media and Storytelling",
    body: "NESA Africa TV, digital campaigns, documentaries, interviews, webinars and regional correspondent reports amplify the work of Education Enablers.",
  },
  {
    title: "Stakeholder Engagement",
    body: "One continental participation ecosystem for nominees, sponsors, partners, donors, governments, diaspora contributors, volunteers, judges, media and community actors.",
  },
  {
    title: "CSR, Sponsorship and Partnership Activation",
    body: "Visibility and engagement opportunities for organisations investing in education through CSR, grants, sponsorships, scholarships, institutional support and social impact programmes.",
  },
  {
    title: "Public Voting and Participation",
    body: "Public participation through AGC-powered voting, nominee discovery, awareness campaigns, digital engagement and continental mobilisation.",
  },
  {
    title: "Post-Award Education Impact",
    body: "Recognition connected to impact through scholarships, special needs education support, Rebuild My School Africa, EduAid-Africa, Afri-EduTourism and education-focused partnerships.",
  },
] as const;

export const RECOGNITION_ARCHITECTURE_STATS = [
  { value: "4", label: "Recognition Tiers" },
  { value: "18", label: "Award Categories" },
  { value: "100+", label: "Recognition Subcategories" },
  { value: "9", label: "Recognition Pillars" },
  { value: "8", label: "Africa Regions" },
  { value: "2", label: "Global Communities" },
] as const;

export const RECOGNITION_ARCHITECTURE_NOTE =
  "This structure allows NESA-Africa to recognise education impact from multiple angles, including lifetime achievement, corporate investment, institutional leadership, education philanthropy, diaspora contribution, EdTech innovation, faith-based education support, media advocacy and influencer impact.";

export const FOUR_TIERS = [
  {
    tier: "Tier 1",
    title: "Africa Education Icon Award",
    subtitle: "Lifetime Achievement Recognition · 2006–2026",
    body: "Recognises transformational individuals whose lifetime contributions have shaped African education over two decades.",
    href: "/awards/africa-education-icon",
  },
  {
    tier: "Tier 2",
    title: "Gold-Blue Garnet Awards",
    subtitle: "Competitive Recognition",
    body: "Recognises organisations, NGOs, CSR programmes, EdTech innovators, STEM leaders, faith-based organisations, media actors and other education enablers creating measurable impact across Africa.",
    href: "/awards/blue-garnet",
  },
  {
    tier: "Tier 3",
    title: "Platinum Recognition",
    subtitle: "Jury-Only Institutional Recognition",
    body: "Recognises governments, ministries, universities, libraries, bilateral organisations, development partners, faith-based institutions and public bodies advancing education systems at scale.",
    href: "/awards/platinum",
  },
  {
    tier: "Tier 4",
    title: "Influencer Education Impact Award",
    subtitle: "Certificate of Recognition",
    body: "Recognises sports icons, music icons, social media creators and public figures using their platforms to promote Education for All, fund scholarships, mentor youth, support schools or inspire learning.",
    href: "/awards/influencers-education-impact-2026-recognition",
  },
] as const;

export const NINE_PILLARS = [
  { title: "Africa Education Icon", body: "Honouring lifetime education legacy and continental transformation." },
  { title: "Best CSR for Education in Africa", body: "Recognising companies investing in classrooms, scholarships, teacher training, digital tools and education infrastructure." },
  { title: "Diaspora Champions for African Education", body: "Celebrating Africans abroad supporting education through funding, mentorship, advocacy and partnerships." },
  { title: "Best EdTech & STEM Education in Africa", body: "Recognising technology, science, digital learning, TVET and STEM innovation transforming how Africa learns." },
  { title: "Institutional & Bilateral Grants for Education for All", body: "Honouring funders, grant-makers, embassies, agencies and international partners supporting education access." },
  { title: "Institutional Excellence in Education", body: "Recognising governments, ministries, universities, libraries, research institutions, NGOs and public bodies strengthening education systems." },
  { title: "Social Media Education Champions", body: "Celebrating digital voices, creators, sports icons and music icons promoting Education for All." },
  { title: "Philanthropy for Education", body: "Recognising philanthropists, foundations and scholarship providers expanding educational opportunity." },
  { title: "Faith-Based & Religious Organisations Advancing Education", body: "Honouring Christian, Islamic and other faith-based organisations advancing education access, scholarships, vocational training and inclusion." },
] as const;

export const CONTINENTAL_REACH =
  "NESA-Africa 2026 is designed as a continental platform with participation across eight Africa regions, Africans living in Africa, Africans in the Diaspora, Friends of Africa, corporate organisations, education institutions, public sector leaders, civil society organisations, development partners, faith-based organisations, media organisations, digital creators and education funders. This continental structure ensures that recognition is not limited to one country, one sector or one type of education contribution.";

export const KEY_PROGRAMMES = [
  {
    title: "Gold-Blue Garnet Awards Gala",
    body: "The flagship recognition ceremony of NESA-Africa 2026, bringing together nominees, winners, sponsors, judges, partners, education leaders, government representatives, media organisations, volunteers and stakeholders. 13 December 2026 · Lagos, Nigeria.",
  },
  {
    title: "Africa Education Hall of Fame",
    body: "Documents and preserves the stories of outstanding Education Enablers whose contributions deserve continental recognition.",
  },
  {
    title: "NESA Africa TV",
    body: "The media and storytelling arm of the recognition journey — nominee interviews, documentaries, weekly updates, partner features, sponsor visibility and gala coverage.",
  },
  {
    title: "EduAid-Africa",
    body: "Connects recognition to public education, webinars, scholarships, donor engagement and education access programmes.",
  },
  {
    title: "Rebuild My School Africa",
    body: "Improves school environments, infrastructure and learning conditions, especially in underserved and special needs school communities.",
  },
  {
    title: "Afri-EduTourism",
    body: "Connects education recognition with learning travel, school visits, cultural exchange, impact commissioning and continental storytelling.",
  },
  {
    title: "AGC Voting and Wallet Participation",
    body: "Supports public voting, digital engagement and transparent community involvement.",
  },
] as const;

export const CAPABILITY_AREAS = [
  { title: "Recognition Programme Design", body: "Award category development, recognition subcategory structuring, nomination framework design, nominee profile development, award tier architecture and continental participation structure." },
  { title: "Nomination and Verification Management", body: "Public nomination collection, nominee documentation, category review, verification support, regional classification and integrity screening." },
  { title: "Jury and Governance Coordination", body: "Judge onboarding, evaluation framework support, conflict-of-interest guidance, scoring process coordination, governance communication and independent review support." },
  { title: "Media Production and Storytelling", body: "NESA Africa TV programming, documentary production, nominee interviews, public awareness campaigns, gala broadcast planning, social media activation and regional correspondent reporting." },
  { title: "Event and Gala Management", body: "Awards gala planning, recognition showcase production, stage and broadcast coordination, red carpet media, sponsor visibility integration, press conference coordination and winner announcement management." },
  { title: "Partnership and Sponsorship Engagement", body: "Corporate sponsorship packages, CSR visibility opportunities, donor engagement, embassy and bilateral partnership outreach, institutional partnership development and education impact partnership alignment." },
  { title: "Public Engagement and Voting", body: "AGC voting education, nominee discovery campaigns, public voting coordination, digital engagement, community mobilisation and regional participation." },
  { title: "Impact Programme Activation", body: "Scholarship mobilisation, school support initiatives, special needs education support, EduAid-Africa webinars, Rebuild My School Africa campaigns and Afri-EduTourism legacy activities." },
] as const;

export const WHO_WE_SERVE = [
  "Corporate CSR teams",
  "Banks, telecoms, energy companies, FMCG firms and private sector organisations",
  "Philanthropists and foundations",
  "Embassies and bilateral agencies",
  "Development partners and grant-makers",
  "Ministries and public institutions",
  "Universities, libraries and research institutions",
  "Faith-based organisations",
  "NGOs and civil society organisations",
  "Media organisations",
  "EdTech and STEM innovators",
  "Diaspora African networks",
  "Sports, music and digital influencers",
  "Volunteers, judges and local chapter leaders",
  "Education advocates and community changemakers",
] as const;

export const PARTNERSHIP_OPPORTUNITIES = [
  { title: "Sponsorship", body: "Support award categories, recognition events, media programming, gala experiences, nominee visibility and impact campaigns." },
  { title: "CSR Collaboration", body: "Align your organisation's CSR education projects with NESA-Africa's recognition and storytelling platform." },
  { title: "Education Impact Funding", body: "Support scholarships, school interventions, special needs education, teacher development and education access programmes." },
  { title: "Media Partnership", body: "Support coverage, broadcast, interviews, documentaries, press activities and education storytelling." },
  { title: "Technology Partnership", body: "Support nomination systems, voting, data, cybersecurity, digital media, streaming and platform development." },
  { title: "Institutional Partnership", body: "Collaborate on research, education policy, grants, innovation and continental education support." },
  { title: "Volunteer and Local Chapter Partnership", body: "Support regional mobilisation, nominee discovery, community engagement, media reporting and event coordination." },
] as const;

export const INTEGRITY_STATEMENT = {
  headline: "Integrity and Governance",
  firewall: "Sponsorship does not influence winners.",
  body: "NESA-Africa is committed to credibility, fairness and transparency. The platform operates with a strict integrity firewall across nominations, judging, sponsorship, media, technology and voting. NESA-Africa separates partnership support from judging outcomes to protect public trust and ensure that recognition is based on merit, evidence, impact and category standards.",
  values: [
    "Transparency",
    "Integrity",
    "Fairness",
    "Accountability",
    "Continental balance",
    "Public trust",
    "Measurable impact",
    "Youth and community-centred education outcomes",
  ],
} as const;

export const WHY_PARTNER =
  "Partnering with NESA-Africa gives organisations and institutions the opportunity to support Education for All across Africa, align with a credible continental education recognition platform, gain visibility among education leaders and communities, showcase CSR contributions, participate in a high-profile continental awards gala and support measurable education programmes beyond the awards ceremony. It also gives partners the opportunity to strengthen brand association with education transformation, inclusion and African development while contributing to scholarships, school rebuilding, special needs education and community learning impact.";

export const IMPACT_PATHWAY = [
  "Recognition",
  "Visibility",
  "Credibility",
  "Partnerships",
  "Investment",
  "Educational Transformation",
  "Legacy",
] as const;

export const FINAL_CALL =
  "NESA-Africa 2026 is Africa's Education Recognition & Impact Platform, built to celebrate and support the Enablers of Education for All Across Africa. Through its four recognition tiers, nine recognition pillars, continental nomination system, media storytelling, AGC-powered participation, Gold-Blue Garnet Awards Gala and post-award impact programmes, NESA-Africa transforms recognition into measurable education progress. Recognition is only the beginning.";
