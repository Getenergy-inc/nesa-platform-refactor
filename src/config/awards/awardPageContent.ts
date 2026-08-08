// Content map for the unified premium award-page system.
// Every entry drives <AwardCategoryStandardPage slug=… /> rendering with the
// same visual/structural standard as /awards/africa-education-icon.

import type { Subcategory } from "@/components/awards/standard/sections";

export type AwardPageContent = {
  slug: string;
  canonicalPath: string;
  seoTitle: string;
  metaDescription: string;
  hero: {
    badge: string;
    title: string;
    titleAccent?: string;
    subhead: string;
    lead?: string;
    statsBuilder?: (counts: { nominees: number; regions: number; subcategories: number; finalists: number }) => { label: string; value: string | number }[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    trustLine?: string;
  };
  recognises: string;
  eligibility: {
    canBeNominated: string[];
    shouldNotBeNominated: string[];
    evidence?: string[];
    region?: string;
    pathway?: string;
  };
  hallFilter: {
    /** Substrings matched against MasterNominee.category (case insensitive). Empty = all. */
    categoryIncludes?: string[];
    /** Pathway filter for "Africans in Africa" / "Africans in Diaspora" / "Friends of Africa". */
    pathways?: string[];
    /** Use Icon hall-of-fame data instead of the master nominee dataset. */
    sourceIcon?: boolean;
  };
  exploreAllHref: string;
  nominateHref: string;
  subcategories: Subcategory[];
  finalCta: {
    heading?: string;
    body?: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. AFRICA EDUCATION ICON (delegates to bespoke page — kept for reference)
// ─────────────────────────────────────────────────────────────────────────────

const ICON: AwardPageContent = {
  slug: "africa-education-icon",
  canonicalPath: "/awards/africa-education-icon",
  seoTitle: "Africa Education Icon Award 2006–2026 | NESA-Africa",
  metaDescription:
    "Two decades. Three pathways. Nine laureates. One continental legacy. The highest lifetime recognition for Education Enablers whose sustained work has reshaped African learning between 2006 and 2026.",
  hero: {
    badge: "Lifetime Achievement · 2006–2026",
    title: "Africa Education Icon Award",
    titleAccent: "2006–2026",
    subhead:
      "Two decades. Three pathways. Nine laureates. One continental legacy. The Africa Education Icon Award is NESA-Africa's highest lifetime recognition — a Continental Hall of Fame for the Education Enablers whose sustained work has transformed access to learning, strengthened institutions, influenced policy, expanded opportunity and reshaped African education between 2006 and 2026.",
    statsBuilder: ({ nominees, subcategories, finalists }) => [
      { label: "Verified Nominees", value: nominees },
      { label: "Recognition Pathways", value: subcategories || 3 },
      { label: "Laureate Classifications", value: 3 },
      { label: "Final Laureates", value: finalists || 9 },
    ],
    primaryCta: { label: "Nominate an Africa Education Icon", href: "/nominate?category=africa-education-icon-award" },
    secondaryCta: { label: "Explore Existing Nominees", href: "/nominees/africa-education-icon-award" },
    trustLine: "Jury-led · No public voting · Independent NRC verification · Continental Hall of Fame induction",
  },
  recognises:
    "Education transforms lives, but Education Enablers create the conditions that make transformation possible. The Africa Education Icon Award honours philanthropists, curriculum reformers, literary advocates, technical education pioneers, institution builders and long-serving reformers whose lifetime contribution has built schools, funded scholarships, shaped policy, advanced literacy, strengthened STEM and TVET, and inspired generations of learners across Africa and the African Diaspora. Every laureate becomes part of a permanent public record — their journey, contributions, institutions, publications and continuing legacy preserved as part of Africa's educational history.",
  eligibility: {
    canBeNominated: [
      "Philanthropists, benefactors and foundation leaders funding education access",
      "Authors, publishers and curriculum reformers shaping how Africa teaches and learns",
      "Technical education, TVET, STEM and vocational training pioneers",
      "University founders, institutional builders and long-serving reformers",
      "Literacy advocates, researchers and education policy leaders",
      "Africans in Africa, Africans in the Diaspora, and Friends of Africa",
    ],
    shouldNotBeNominated: [
      "One-off donations or short-term campaigns",
      "Unverified claims or popularity-based nominations",
      "Nominees with no substantial education contribution",
      "Temporary projects without lasting impact",
      "Nominees whose recognition depends on political, commercial or sponsor influence",
    ],
    evidence: [
      "Verified biography and sustained contribution over the 2006–2026 period",
      "Documented institutions built, programmes founded, or reforms delivered",
      "Independent third-party endorsements, publications or policy citations",
    ],
    region: "Continental. Three laureate classifications: Africans in Africa · Africans in the Diaspora · Friends of Africa.",
    pathway: "Three recognition pathways: Africa Education Philanthropy Icon · Literary & New Curriculum Advocate Icon · Africa Technical Educator Icon.",
  },
  hallFilter: { sourceIcon: true },
  exploreAllHref: "/nominees/africa-education-icon-award",
  nominateHref: "/nominate?category=africa-education-icon-award",
  subcategories: [
    {
      slug: "education-philanthropy-icon",
      title: "Africa Education Philanthropy Icon of the Period (2006–2026)",
      blurb:
        "Recognising philanthropists, benefactors, foundation leaders, corporate leaders and development partners whose long-term investment has expanded educational opportunity — turning resources into access, opportunity and hope.",
      recognises: "Philanthropists whose lifetime giving has transformed African education",
      scope: "Continental · 3 Laureates (Africa-resident · Diaspora · Friend of Africa)",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/africa-education-icon/education-philanthropy-icon",
      nominateHref: "/nominate?category=africa-education-icon-award&track=philanthropy",
    },
    {
      slug: "literary-new-curriculum-advocate",
      title: "Literary & New Curriculum Advocate Icon of the Period (2006–2026)",
      blurb:
        "Recognising authors, publishers, curriculum reformers, policy writers, researchers and literacy advocates whose work has influenced how Africa teaches, learns, reads and preserves knowledge.",
      recognises: "Literary figures and curriculum reformers shaping African knowledge systems",
      scope: "Continental · 3 Laureates (Africa-resident · Diaspora · Friend of Africa)",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/africa-education-icon/literary-new-curriculum-advocate",
      nominateHref: "/nominate?category=africa-education-icon-award&track=curriculum",
    },
    {
      slug: "technical-educator-icon",
      title: "Africa Technical Educator Icon of the Period (2006–2026)",
      blurb:
        "Recognising pioneers of TVET, STEM, engineering, digital skills, innovation and entrepreneurship whose work positions education as a driver of skills, enterprise and economic transformation.",
      recognises: "TVET, STEM and technical education pioneers",
      scope: "Continental · 3 Laureates (Africa-resident · Diaspora · Friend of Africa)",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/africa-education-icon/technical-educator-icon",
      nominateHref: "/nominate?category=africa-education-icon-award&track=technical",
    },
  ],
  finalCta: {
    heading: "Help Africa Recognise Its Education Icons",
    body: "Nominate an individual whose work between 2006 and 2026 has changed how Africa learns, who gains access to education, or how educational opportunity is created. Two decades. Three pathways. Nine laureates. One Continental Hall of Fame.",
    primary: { label: "Nominate an Africa Education Icon", href: "/nominate?category=africa-education-icon-award" },
    secondary: { label: "View the Continental Hall of Fame", href: "/nominees/africa-education-icon-award" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. GOLD-BLUE GARNET AWARDS
// ─────────────────────────────────────────────────────────────────────────────

const GOLD_BLUE_GARNET: AwardPageContent = {
  slug: "gold-blue-garnet",
  canonicalPath: "/awards/blue-garnet",
  seoTitle: "Blue Garnet Award 2026 — Recognition & Qualification Edition | NESA-Africa",
  metaDescription:
    "The Blue Garnet Award 2026 is a Continental Recognition Edition — identifying, verifying and celebrating Africa's Education Enablers while laying the foundation for the competitive Blue Garnet Award 2027.",
  hero: {
    badge: "2026 Recognition & Qualification Edition · No Public Voting",
    title: "Blue Garnet Award",
    titleAccent: "2026",
    subhead:
      "Africa's Recognition Platform for Education Enablers. The 2026 edition is a Continental Recognition Edition — identifying, verifying, documenting and celebrating outstanding Education Enablers across corporations, NGOs, EdTech, STEM, media, creative industries and government, while preparing the trusted foundation for a fully competitive Blue Garnet Award from 2027 onward.",
    statsBuilder: ({ nominees }) => [
      { label: "Verified Nominees", value: nominees },
      { label: "Recognition Categories", value: 9 },
      { label: "Recognition Subcategories", value: 63 },
      { label: "Edition", value: "Qualification" },
    ],
    primaryCta: { label: "Nominate an Education Enabler", href: "/nominate?tier=gold-blue-garnet" },
    secondaryCta: { label: "Explore Existing Nominees", href: "/nominees?tier=blue-garnet" },
    trustLine: "No public voting · No competitive ranking · Independent NRC verification · Africa Education Impact Directory listing",
  },
  recognises:
    "The Blue Garnet Award 2026 is a Continental Recognition Edition. There is no public voting, no competitive ranking and no elimination rounds. Successful nominees receive official recognition as verified Education Enablers — a Certificate of Recognition, Letter of Appreciation, verified public profile and Africa Education Impact Directory listing — and become the qualifying pool for the fully competitive Blue Garnet Award 2027. The 2026 edition builds Africa's most credible database of verified Education Enablers across CSR, EdTech, NGOs, STEM, media, creative industries, state governments, foundations, professional associations, community initiatives and social enterprises.",
  eligibility: {
    canBeNominated: [
      "Corporations running Corporate Social Responsibility (CSR) education programmes",
      "Non-Governmental Organisations (NGOs) advancing education access",
      "Education Technology (EdTech) innovators, platforms and tools",
      "STEM education programmes and academies",
      "Media organisations and creative industries promoting learning",
      "State governments, foundations and community education initiatives",
      "Social enterprises, professional associations and educational partnerships",
    ],
    shouldNotBeNominated: [
      "Organisations with no documented education work",
      "One-off donations or photo-op campaigns without measurable impact",
      "Pure marketing claims without learner outcomes",
      "Nominees relying on sponsorship, popularity or public visibility for recognition",
    ],
    evidence: [
      "Programme reports with learner-level outcomes and beneficiary data",
      "Independent third-party verification, references or annual reports",
      "Documented partnerships, publications, photos, videos and impact statistics",
    ],
    region: "Open to organisations operating across Africa Regional and Nigeria-specific categories.",
    pathway: "Public nomination → automated screening → nominee acceptance → profile development → NRC verification → governance review → Recognition Certificate + Directory listing. Recognised nominees qualify for competitive Blue Garnet Award 2027.",
  },
  hallFilter: {
    categoryIncludes: ["csr", "ngo", "edutech", "edtech", "stem", "media", "creative", "policy", "state"],
  },
  exploreAllHref: "/nominees?tier=blue-garnet",
  nominateHref: "/nominate?tier=gold-blue-garnet",
  subcategories: [
    {
      slug: "csr-africa",
      title: "Best CSR for Education (Africa Regional)",
      blurb: "Nominations are open for the Blue Garnet category honouring corporate social responsibility initiatives advancing education across the continent. Know a company doing the work? Nominate them now.",
      recognises: "Corporations running CSR-for-Education programmes across Africa",
      scope: "Africa Regional",
      subcategoryCount: 6,
      voteSplit: "Recognition Edition · No public voting",
      viewHref: "/awards/blue-garnet-categories/best-csr-for-education-africa-regional",
      nominateHref: "/nominate?category=best-csr-for-education-africa-regional",
    },
    {
      slug: "csr-nigeria",
      title: "Best CSR for Education (Nigeria)",
      blurb: "Calling all Nigerian corporations leading on education CSR — help us celebrate the companies investing in the nation's classrooms across 23 subcategories.",
      recognises: "Nigerian corporations advancing education through CSR",
      scope: "Nigeria",
      subcategoryCount: 23,
      voteSplit: "Recognition Edition · No public voting",
      viewHref: "/awards/blue-garnet-categories/best-csr-for-education-nigeria",
      nominateHref: "/nominate?category=best-csr-for-education-nigeria",
    },
    {
      slug: "edutech-africa",
      title: "Best EduTech Innovation for Education (Africa Regional)",
      blurb: "Is your edtech innovation transforming how Africa learns? Nominate a platform, app or tool delivering real classroom impact across the continent.",
      recognises: "EdTech platforms, apps and tools",
      scope: "Africa Regional",
      subcategoryCount: 3,
      voteSplit: "Recognition Edition · No public voting",
      viewHref: "/awards/blue-garnet-categories/best-edutech-innovation-for-education-africa-regional",
      nominateHref: "/nominate?category=best-edutech-innovation-for-education-africa-regional",
    },
    {
      slug: "media-nigeria",
      title: "Best Media Organisation for Education Advocacy (Nigeria)",
      blurb: "Which Nigerian media house is championing education in its coverage? Recognising journalism that puts learning on the front page.",
      recognises: "Nigerian broadcasters, publications and education advocacy outlets",
      scope: "Nigeria",
      subcategoryCount: 4,
      voteSplit: "Recognition Edition · No public voting",
      viewHref: "/awards/blue-garnet-categories/best-media-organisation-for-education-advocacy-nigeria",
      nominateHref: "/nominate?category=best-media-organisation-for-education-advocacy-nigeria",
    },
    {
      slug: "ngo-nigeria",
      title: "Best NGO for Education Advancement (Nigeria)",
      blurb: "Tell us which non-governmental organisation is making the biggest difference in Nigerian classrooms and communities.",
      recognises: "Nigerian NGOs advancing education access and outcomes",
      scope: "Nigeria",
      subcategoryCount: 5,
      voteSplit: "Recognition Edition · No public voting",
      viewHref: "/awards/blue-garnet-categories/best-ngo-for-education-advancement-nigeria",
      nominateHref: "/nominate?category=best-ngo-for-education-advancement-nigeria",
    },
    {
      slug: "ngo-africa",
      title: "Best NGO for Education Advancement (Africa Regional)",
      blurb: "From literacy programmes to school infrastructure, NGOs across Africa are closing the education gap. Nominate one for continental recognition.",
      recognises: "NGOs advancing inclusive education across Africa",
      scope: "Africa Regional",
      subcategoryCount: 5,
      voteSplit: "Recognition Edition · No public voting",
      viewHref: "/awards/blue-garnet-categories/best-ngo-for-education-advancement-africa-regional",
      nominateHref: "/nominate?category=best-ngo-for-education-advancement-africa-regional",
    },
    {
      slug: "stem-africa",
      title: "Best STEM Education Programme (Africa Regional)",
      blurb: "Science, technology, engineering and maths shape Africa's future workforce. Nominate an outstanding STEM initiative for continental honours.",
      recognises: "STEM schools, science programmes, coding & robotics academies",
      scope: "Africa Regional",
      subcategoryCount: 4,
      voteSplit: "Recognition Edition · No public voting",
      viewHref: "/awards/blue-garnet-categories/best-stem-education-programme-africa-regional",
      nominateHref: "/nominate?category=best-stem-education-programme-africa-regional",
    },
    {
      slug: "creative-arts-nigeria",
      title: "Best Creative Arts Contribution to Education (Nigeria)",
      blurb: "Art, music, film and design are powerful teaching tools. Nominate a Nigerian creative individual or organisation advancing education through the arts.",
      recognises: "Nigerian creative industries contributing to education",
      scope: "Nigeria",
      subcategoryCount: 7,
      voteSplit: "Recognition Edition · No public voting",
      viewHref: "/awards/blue-garnet-categories/best-creative-arts-contribution-to-education-nigeria",
      nominateHref: "/nominate?category=best-creative-arts-contribution-to-education-nigeria",
    },
    {
      slug: "policy-state-nigeria",
      title: "Best Education Policy & Implementation State (Nigeria)",
      blurb: "Which Nigerian state is getting education policy right? Recognising real implementation, not just paperwork.",
      recognises: "Nigerian state governments delivering on education policy",
      scope: "Nigeria",
      subcategoryCount: 6,
      voteSplit: "Recognition Edition · No public voting",
      viewHref: "/awards/blue-garnet-categories/best-education-policy-and-implementation-state-nigeria",
      nominateHref: "/nominate?category=best-education-policy-and-implementation-state-nigeria",
    },
  ],
  finalCta: {
    heading: "Join the Movement",
    body: "If your organisation is helping to build stronger education systems, expand learning opportunities, empower teachers, support learners or advance educational innovation, we invite you to become part of Africa's growing community of Education Enablers. The Blue Garnet Award 2026 is the beginning of a continental journey — recognising today's Education Enablers while building the trusted foundation for Africa's premier competitive education recognition programme from 2027 onward.",
    primary: { label: "Nominate an Education Enabler", href: "/nominate?tier=gold-blue-garnet" },
    secondary: { label: "Explore the Africa Education Impact Directory", href: "/nominees?tier=blue-garnet" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. PLATINUM RECOGNITION
// ─────────────────────────────────────────────────────────────────────────────

const PLATINUM: AwardPageContent = {
  slug: "platinum-recognition",
  canonicalPath: "/awards/platinum",
  seoTitle: "Platinum Award 2026 — Institutional Leadership Recognition | NESA-Africa",
  metaDescription:
    "NESA-Africa's highest institutional recognition — jury-only honours for universities, libraries, research organisations, faith-based education institutions, political leaders, international partners and African Diaspora organisations strengthening education across Africa.",
  hero: {
    badge: "Institutional Leadership Recognition · Jury Only",
    title: "Platinum Award",
    titleAccent: "2026",
    subhead:
      "Honouring the Institutions Shaping Africa's Learning Future. The Platinum Award is NESA-Africa's highest institutional recognition — celebrating universities, libraries, research organisations, faith-based education institutions, political leaders, international development partners and African Diaspora organisations whose long-term commitment has created sustainable, measurable and transformational impact in education.",
    statsBuilder: ({ nominees }) => [
      { label: "Verified Institutions", value: nominees },
      { label: "Recognition Categories", value: 7 },
      { label: "Recognition Subcategories", value: 27 },
      { label: "Vote Mechanic", value: "Jury Only" },
    ],
    primaryCta: { label: "Nominate an Institution", href: "/nominate?tier=platinum" },
    secondaryCta: { label: "Explore Existing Nominees", href: "/nominees?tier=platinum" },
    trustLine: "Jury-only recognition · Independent NRC verification · Governance-ratified · No public voting · No political or sponsor influence",
  },
  recognises:
    "Strong education systems are built by strong institutions. Universities prepare future leaders. Libraries preserve knowledge. Research institutions develop evidence for better policy. Faith-based organisations establish schools and expand access. Governments create policies and invest in learning. International partners strengthen education through collaboration. Diaspora organisations connect Africa with global expertise and investment. The Platinum Award honours these seven institutional pathways because they build the foundations upon which quality education depends — recognised on evidence, integrity and contribution, not organisational size, political influence or public visibility.",
  eligibility: {
    canBeNominated: [
      "Universities, colleges, polytechnics and higher education institutions",
      "University, national, public, digital, research and specialised libraries",
      "Research institutes, think tanks, innovation hubs and centres of excellence",
      "Faith-based education institutions (Christian, Islamic and others)",
      "Presidents, governors, ministers, commissioners, legislators and mayors advancing education",
      "International development agencies, multilateral organisations, foundations and diplomatic missions supporting African education",
      "African Diaspora organisations investing in education across the continent",
    ],
    shouldNotBeNominated: [
      "Institutions with no documented education work",
      "Political appointments without measurable outcomes or verified reforms",
      "Programmes without independent verification or public evidence",
      "Nominees relying on organisational size, political affiliation or public visibility",
    ],
    evidence: [
      "Official institutional records, annual reports and programme documentation",
      "Independently verifiable learner outcomes, research citations or policy implementation data",
      "Documented partnerships, research outputs, publications and impact statistics",
    ],
    region: "Seven institutional pathways spanning national, regional, continental and international scope.",
    pathway: "Nomination → automated screening → nominee acceptance → institutional profile development → NRC verification → independent jury assessment → governance approval → Platinum Certificate + Directory listing.",
  },
  hallFilter: {
    categoryIncludes: ["library", "research", "christian", "islamic", "political", "international", "diaspora", "platinum"],
  },
  exploreAllHref: "/nominees?tier=platinum",
  nominateHref: "/nominate?tier=platinum",
  subcategories: [
    {
      slug: "library-nigeria",
      title: "Best Tertiary Institution Library (Nigeria)",
      blurb: "Libraries shape how students learn to think. Nominate a Nigerian tertiary institution for excellence in higher-education library services.",
      recognises: "Nigerian tertiary institution libraries",
      scope: "Nigeria",
      subcategoryCount: 8,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/best-tertiary-institution-library-nigeria",
      nominateHref: "/nominate?category=best-tertiary-institution-library-nigeria",
    },
    {
      slug: "research-nigeria",
      title: "Excellence in Research & Development for Education (Nigeria)",
      blurb: "Nominate a Nigerian research institution advancing education through evidence and innovation.",
      recognises: "Universities, research institutes and think-tanks",
      scope: "Nigeria",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-research-and-development-for-education-nigeria",
      nominateHref: "/nominate?category=excellence-in-research-and-development-for-education-nigeria",
    },
    {
      slug: "christian-africa",
      title: "Excellence in Christian Education Impact (Africa Regional)",
      blurb: "Faith-based institutions have shaped African education for generations. Nominate a Christian organisation or leader for continental recognition.",
      recognises: "Christian education institutions and faith leaders",
      scope: "Africa Regional",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-christian-education-impact-africa-regional",
      nominateHref: "/nominate?category=excellence-in-christian-education-impact-africa-regional",
    },
    {
      slug: "islamic-africa",
      title: "Excellence in Islamic Education Impact (Africa Regional)",
      blurb: "Nominate an Islamic institution or leader making a lasting impact on education across Africa.",
      recognises: "Islamic education institutions and faith leaders",
      scope: "Africa Regional",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-islamic-education-impact-africa-regional",
      nominateHref: "/nominate?category=excellence-in-islamic-education-impact-africa-regional",
    },
    {
      slug: "political-nigeria",
      title: "Excellence in Political Leadership for Education (Nigeria)",
      blurb: "Which Nigerian political leader has put education policy into real action? Recognising leadership backed by results, not rhetoric.",
      recognises: "Ministers, legislators and public officials",
      scope: "Nigeria",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-political-leadership-for-education-nigeria",
      nominateHref: "/nominate?category=excellence-in-political-leadership-for-education-nigeria",
    },
    {
      slug: "international-partnership",
      title: "Excellence in International Partnership for Education (Africa)",
      blurb: "International partnerships are accelerating education outcomes across Africa. Nominate a global partner organisation advancing learning on the continent.",
      recognises: "Global partner organisations supporting African education",
      scope: "Africa Regional",
      subcategoryCount: 4,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-international-partnership-for-education-africa",
      nominateHref: "/nominate?category=excellence-in-international-partnership-for-education-africa",
    },
    {
      slug: "diaspora-international",
      title: "Excellence in Diaspora Educational Impact (International)",
      blurb: "300 verified diaspora-led organisations across 8 African regions and 3 subcategories — infrastructure, program innovation and teacher training. Explore the directory or nominate a champion.",
      recognises: "Diaspora organisations investing in African education",
      scope: "International • 5 Africa Regions",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-recognition/diaspora",
      nominateHref: "/nominate?category=excellence-in-diaspora-educational-impact-international",
    },
  ],
  finalCta: {
    heading: "Recognise the Institutions Building Africa's Future",
    body: "Whether a university, library, research organisation, faith-based institution, political leader, international partner or Diaspora organisation — if their long-term work has strengthened education across Africa, they deserve to be recognised. Platinum recognition is jury-only, evidence-based and independently ratified.",
    primary: { label: "Nominate an Institution", href: "/nominate?tier=platinum" },
    secondary: { label: "Explore Verified Institutions", href: "/nominees?tier=platinum" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. INFLUENCER EDUCATION IMPACT 2026
// ─────────────────────────────────────────────────────────────────────────────

const INFLUENCER: AwardPageContent = {
  slug: "influencer-education-impact-2026",
  canonicalPath: "/awards/influencers-education-impact-2026-recognition",
  seoTitle: "Influencer Education Impact Award 2026 — Public Figures Advancing Learning | NESA-Africa",
  metaDescription:
    "Recognising African social media creators, sports icons and music icons whose platforms translate into measurable education action. 2026 Recognition Edition — verification-based, no competitive ranking.",
  hero: {
    badge: "Public Figures Recognition · 2026 Recognition Edition",
    title: "Influencer Education Impact",
    titleAccent: "2026",
    subhead:
      "Honouring the Public Figures Driving Education Awareness and Action Across Africa. The Influencer Education Impact Award recognises African social media influencers, sports icons and music icons whose visibility, voice and platforms translate into measurable education action — funding scholarships, building schools, mentoring learners and producing learning content across Africa and the Diaspora.",
    statsBuilder: ({ nominees }) => [
      { label: "Verified Public Figures", value: nominees },
      { label: "Recognition Pathways", value: 3 },
      { label: "Model", value: "Verification" },
      { label: "Edition", value: "2026 Recognition" },
    ],
    primaryCta: { label: "Nominate an Education Enabler", href: "/nominate?tier=influencer-2026" },
    secondaryCta: { label: "Explore the Directory", href: "/nominees?tier=influencer" },
    trustLine: "2026 Recognition & Verification Edition · NRC-verified · Directory listing · No competitive ranking · Foundation year for 2027 competitive launch",
  },
  recognises:
    "Public figures shape culture, values and public conversation. When they use that influence to advance education, the impact reaches millions of young Africans. The Influencer Education Impact Award honours three verification pathways — Social Media Creators, Sports Icons and Music Icons — celebrating individuals whose platforms produce documented education outcomes rather than one-off endorsements.",
  eligibility: {
    canBeNominated: [
      "Creators, podcasters, bloggers and digital advocates producing sustained education content",
      "African athletes, academies, coaches and sports leaders funding or supporting learning",
      "African musicians, performers, producers and music executives backing education initiatives",
      "Africans in Africa and Africans in the Diaspora with documented education contributions",
    ],
    shouldNotBeNominated: [
      "Public figures without documented, sustained education action",
      "Brand-led marketing claims without verified outcomes or beneficiaries",
      "One-off appearances, photo opportunities or single-post campaigns",
    ],
    evidence: [
      "Documented education programmes, scholarships, campaigns or content series",
      "Independent third-party verification of outcomes and beneficiaries",
      "Beneficiary testimony, programme reports or measurable reach data",
    ],
    region: "Open to Africans in Africa and Africans in the Diaspora.",
    pathway: "Nomination → automated screening → nominee acceptance → profile development → NRC verification → governance approval → Directory listing as a verified 2026 Education Enabler (foundation year for 2027 competitive launch).",
  },
  hallFilter: {
    categoryIncludes: ["influencer", "social media", "sport", "footballer", "music", "musician"],
  },
  exploreAllHref: "/nominees?tier=influencer",
  nominateHref: "/nominate?tier=influencer-2026",
  subcategories: [
    {
      slug: "social-media",
      title: "African Social Media Influencers Education Impact",
      blurb: "Creators, podcasters and online educators are changing how Africa learns. Nominate a social media influencer using their platform to advance education.",
      recognises: "Creators, podcasters, bloggers, digital advocates",
      scope: "Africa & Diaspora",
      subcategoryCount: 1,
      voteSplit: "Verification only",
      viewHref: "/awards/influencers-education-impact/education-content-social-media-influencers",
      nominateHref: "/nominate?tier=influencer-2026&track=social-media",
    },
    {
      slug: "sports",
      title: "African Sports Icons Supporting Education",
      blurb: "From scholarship funds to school-building, athletes are creating real education outcomes. Nominate a sports icon or academy backing learning.",
      recognises: "Athletes, academies, coaches, sports leaders",
      scope: "Africa & Diaspora",
      subcategoryCount: 1,
      voteSplit: "Verification only",
      viewHref: "/awards/influencers-education-impact/african-footballers-supporting-education",
      nominateHref: "/nominate?tier=influencer-2026&track=sports",
    },
    {
      slug: "music",
      title: "African Music Icons Supporting Education",
      blurb: "Music moves culture — and sometimes moves whole communities toward education. Nominate a musician or music executive supporting learning.",
      recognises: "Musicians, performers, producers, music executives",
      scope: "Africa & Diaspora",
      subcategoryCount: 1,
      voteSplit: "Verification only",
      viewHref: "/awards/influencers-education-impact/african-musicians-supporting-education",
      nominateHref: "/nominate?tier=influencer-2026&track=music",
    },
  ],
  finalCta: {
    heading: "Recognise the Public Figures Educating Africa",
    body: "If an African creator, athlete or music icon is converting their platform into measurable education impact, they belong in Africa's Education Impact Directory. 2026 is the Recognition & Verification Edition — the foundation for competitive honours from 2027.",
    primary: { label: "Nominate an Education Enabler", href: "/nominate?tier=influencer-2026" },
    secondary: { label: "Explore the Africa Education Impact Directory", href: "/nominees?tier=influencer" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry + helpers
// ─────────────────────────────────────────────────────────────────────────────

const REGISTRY: Record<string, AwardPageContent> = {
  [ICON.slug]: ICON,
  [GOLD_BLUE_GARNET.slug]: GOLD_BLUE_GARNET,
  [PLATINUM.slug]: PLATINUM,
  [INFLUENCER.slug]: INFLUENCER,
};

export function getAwardPageContent(slug: string): AwardPageContent | undefined {
  return REGISTRY[slug];
}

export const AWARD_PAGE_SLUGS = Object.keys(REGISTRY);
