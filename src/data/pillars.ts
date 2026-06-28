// NESA-Africa 2026 — 9 Recognition Pillars
// Content-only file. Edit copy here; pages render from this data.

import {
  Crown,
  Building2,
  Globe2,
  Cpu,
  Coins,
  Landmark,
  Megaphone,
  HeartHandshake,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export type PillarSubcategory = {
  title: string;
  description: string;
  cta: string;
  href: string;
  certificateTagline?: string;
};

export type Pillar = {
  slug: string;
  number: number;
  shortTitle: string;
  pageTitle: string;
  sellLine: string;
  heroHeadline: string;
  intro: string[]; // paragraphs
  eligible: string[];
  notEligible: string[];
  whyExists: string[];
  subcategories: PillarSubcategory[];
  sponsorPositioning: string;
  sponsorCta: { label: string; href: string };
  nominationCta: { label: string; href: string };
  hashtags: string[];
  icon: LucideIcon;
  accent: string; // gradient class fragment
  bannerCta: string;
  bannerSummary: string;
  recipientBenefits?: string[];
  extraNote?: string;
};

export const PILLARS: Pillar[] = [
  {
    slug: "africa-education-icon",
    number: 1,
    shortTitle: "Africa Education Icon",
    pageTitle: "Africa Education Icon",
    sellLine: "One name. One continent. One legacy.",
    heroHeadline: "The Continental Lifetime Achievement Crown for African Education.",
    intro: [
      "The Africa Education Icon pillar is the highest individual honour within NESA-Africa. It recognises people whose lifetime work has shaped education access, learning, curriculum, philanthropy, technical education, policy, advocacy, institutional development, or public understanding of education across Africa.",
      "This is not ordinary recognition. It is a continental legacy honour.",
      "It is for those whose work has outlived a project, a classroom, an organisation, or a single country — and has contributed to Africa's long-term education future.",
    ],
    eligible: [
      "Education philanthropists",
      "Curriculum reform advocates",
      "Literacy and reading culture leaders",
      "Technical and vocational education champions",
      "Public policy education reformers",
      "Institution builders",
      "Education access advocates",
      "Long-serving education development leaders",
      "Africans in Africa",
      "Africans in the diaspora",
      "Friends of Africa contributing to African education",
    ],
    notEligible: [
      "People with no clear education contribution",
      "Short-term publicity projects without evidence",
      "Purely political nominations without measurable education value",
      "Academic popularity nominations with no wider education impact",
    ],
    whyExists: [
      "Across Africa, some people have spent years building schools, funding learning, shaping policy, promoting literacy, strengthening institutions, or opening education access for underserved communities.",
      "Many of them are known locally, but not continentally.",
      "NESA-Africa gives their legacy the stage it deserves.",
    ],
    subcategories: [
      {
        title: "Africa Education Philanthropy Icon",
        description:
          "Honouring lifetime giving, funding, and philanthropic support that has opened education opportunities across Africa.",
        cta: "Nominate a Philanthropy Icon",
        href: "/nominate?pillar=africa-education-icon&track=philanthropy",
      },
      {
        title: "Literary & New Curriculum Advocate Icon",
        description:
          "Honouring writers, thinkers, curriculum advocates, publishers, and reform voices shaping what Africa learns and how Africa learns.",
        cta: "Nominate a Curriculum Advocate",
        href: "/nominate?pillar=africa-education-icon&track=curriculum",
      },
      {
        title: "Africa Technical Educator Icon",
        description:
          "Honouring lifetime contributors to technical, vocational, practical, and skills-based education development.",
        cta: "Nominate a Technical Education Icon",
        href: "/nominate?pillar=africa-education-icon&track=technical",
      },
    ],
    sponsorPositioning:
      "Own Africa's most prestigious education legacy honour and attach your brand to excellence, dignity, and continental respect.",
    sponsorCta: { label: "Sponsor the Africa Education Icon Award", href: "/sponsors" },
    nominationCta: { label: "Nominate an Education Icon", href: "/nominate?pillar=africa-education-icon" },
    hashtags: [
      "#AfricaEducationIcon",
      "#NESAAfrica2026",
      "#BlueGarnetAwards",
      "#EducationLegacy",
      "#AfricanEducationExcellence",
    ],
    icon: Crown,
    accent: "from-amber-500/30 via-yellow-500/15 to-transparent",
    bannerCta: "Nominate an Icon",
    bannerSummary:
      "For lifetime education legacy. Honouring individuals whose life's work has shaped education in Africa.",
  },

  {
    slug: "csr-for-education",
    number: 2,
    shortTitle: "Best CSR for Education in Africa",
    pageTitle: "Best CSR for Education in Africa",
    sellLine:
      "Your company is changing classrooms across Africa. NESA-Africa makes sure the continent knows it.",
    heroHeadline: "Honouring Corporations Investing in African Learners.",
    intro: [
      "The Best CSR for Education in Africa pillar recognises companies and corporate foundations whose social investment is improving education outcomes across the continent.",
      "This award is for organisations using their resources, influence, infrastructure, technology, funding, volunteers, and partnerships to make education more accessible, inclusive, innovative, and impactful.",
      "From banks funding scholarships to telecoms supporting digital learning, from manufacturers rebuilding schools to energy companies supporting STEM laboratories, NESA-Africa gives corporate education impact the visibility it deserves.",
    ],
    eligible: [
      "Banks and financial institutions",
      "Telecom companies",
      "Energy companies",
      "Food and beverage companies",
      "Airlines",
      "Technology companies",
      "Manufacturing companies",
      "Corporate foundations",
      "ESG and sustainability departments",
      "CSR-led education programmes",
      "Public-private education partnerships",
    ],
    notEligible: [
      "Companies with no clear education CSR evidence",
      "Pure marketing campaigns without measurable education value",
      "One-off donations with no documented education impact",
      "Sponsors seeking influence over judging or winners",
    ],
    whyExists: [
      "Every major corporation wants proof that its CSR work matters.",
      "NESA-Africa gives education-focused CSR programmes a credible continental platform. It helps companies show that their education investment is not only an expense — it is a contribution to Africa's future.",
    ],
    subcategories: [
      {
        title: "Best CSR for Education — Africa Regional",
        description:
          "Recognising companies across African regions investing in schools, learners, teachers, infrastructure, digital access, inclusion, and education equity.",
        cta: "Submit Regional CSR Impact",
        href: "/nominate?pillar=csr-for-education&scope=regional",
      },
      {
        title: "Best CSR for Education — Nigeria",
        description:
          "Recognising Nigerian companies whose CSR programmes are improving education outcomes and learning opportunities.",
        cta: "Submit Nigeria CSR Impact",
        href: "/nominate?pillar=csr-for-education&scope=nigeria",
      },
    ],
    sponsorPositioning:
      "This pillar allows a sponsor to stand publicly as a leading corporate investor in African education.",
    sponsorCta: { label: "Own the CSR for Education Pillar", href: "/sponsors" },
    nominationCta: { label: "Submit CSR Impact", href: "/nominate?pillar=csr-for-education" },
    hashtags: [
      "#CSRforEducation",
      "#NESAAfrica2026",
      "#EducationCSR",
      "#CorporateImpactAfrica",
      "#BrandsForEducation",
    ],
    icon: Building2,
    accent: "from-blue-500/30 via-indigo-500/15 to-transparent",
    bannerCta: "Submit CSR Impact",
    bannerSummary:
      "For companies investing in African learners. Recognising CSR programmes creating measurable education impact.",
  },

  {
    slug: "diaspora-champions",
    number: 3,
    shortTitle: "Diaspora Champions for African Education",
    pageTitle: "Diaspora Champions for African Education",
    sellLine: "You may live outside Africa, but your impact can still shape Africa's education future.",
    heroHeadline: "Honouring Africans Abroad Who Invest Back Home.",
    intro: [
      "The Diaspora Champions for African Education pillar recognises Africans living outside the continent who continue to support education back home.",
      "They fund schools. They mentor students. They support scholarships. They connect institutions. They advocate for African learners. They build bridges between global opportunity and local education need.",
      "NESA-Africa honours diaspora champions because Africa's education future is not only being built on the continent. It is also being supported from London, New York, Toronto, Dubai, Johannesburg, Berlin, Paris, Atlanta, and every place Africans continue to carry Africa in their hearts.",
    ],
    eligible: [
      "Diaspora individuals funding African education",
      "Diaspora organisations supporting schools",
      "Alumni groups giving back to institutions",
      "Professional networks mentoring African learners",
      "Diaspora-led scholarship funds",
      "African community organisations abroad",
      "Diaspora content creators promoting education",
      "International African student groups",
      "Diaspora NGOs and foundations",
    ],
    notEligible: [
      "Diaspora individuals with no evidence of education support",
      "General charity work not connected to education",
      "Unverified fundraising claims",
      "Programmes with no clear African education link",
    ],
    whyExists: [
      "Many Africans abroad support education quietly and consistently. They pay school fees, donate books, fund classrooms, support libraries, mentor students, and create opportunities.",
      "NESA-Africa brings that contribution into the light.",
    ],
    subcategories: [
      {
        title: "Excellence in Diaspora Educational Impact — International",
        description:
          "Recognising diaspora individuals, groups, associations, and organisations supporting education development back home.",
        cta: "Nominate a Diaspora Education Champion",
        href: "/nominate?pillar=diaspora-champions&track=international",
      },
      {
        title: "Diaspora Social Media Education Champion",
        description:
          "Recognising Africans abroad using digital platforms to promote, fund, mentor, or advocate for African education.",
        cta: "Apply as a Diaspora Education Champion",
        href: "/nominate?pillar=diaspora-champions&track=social-media",
      },
    ],
    sponsorPositioning:
      "This pillar connects sponsors to a global African audience that believes in legacy, identity, contribution, and giving back.",
    sponsorCta: { label: "Sponsor the Diaspora Champions Pillar", href: "/sponsors" },
    nominationCta: { label: "Nominate a Diaspora Champion", href: "/nominate?pillar=diaspora-champions" },
    hashtags: [
      "#DiasporaForEducation",
      "#NESAAfrica2026",
      "#AfricanDiasporaImpact",
      "#EducationBackHome",
      "#DiasporaChampion2026",
    ],
    icon: Globe2,
    accent: "from-emerald-500/30 via-teal-500/15 to-transparent",
    bannerCta: "Nominate a Diaspora Champion",
    bannerSummary:
      "For Africans abroad supporting education back home. Celebrating diaspora funding, mentoring, advocacy, and bridges.",
  },

  {
    slug: "edtech-stem",
    number: 4,
    shortTitle: "Best EdTech & STEM Education in Africa",
    pageTitle: "Best EdTech & STEM Education in Africa",
    sellLine: "The future of African education is being built by innovators.",
    heroHeadline: "Honouring Technology-Driven Education Innovation.",
    intro: [
      "The Best EdTech & STEM Education in Africa pillar recognises the platforms, tools, programmes, schools, startups, teachers, companies, and innovators changing how Africa learns.",
      "Education is no longer limited to a classroom wall. Across Africa, digital learning platforms, science clubs, coding academies, AI tools, robotics programmes, STEM labs, and mobile-first learning solutions are opening new possibilities.",
      "NESA-Africa puts these innovators on the continental stage.",
    ],
    eligible: [
      "EdTech startups",
      "STEM education programmes",
      "Digital learning platforms",
      "Coding and robotics academies",
      "AI learning tools",
      "Science education initiatives",
      "Schools running STEM innovation programmes",
      "Technology companies supporting education",
      "NGOs using technology for learning access",
      "Youth innovation hubs",
    ],
    notEligible: [
      "Technology products with no education use",
      "Apps or platforms without real user evidence",
      "Innovation claims without implementation",
      "Programmes that exclude underserved learners without explanation",
    ],
    whyExists: [
      "Africa's education future will be shaped by access, technology, science, creativity, and practical skills.",
      "This pillar recognises the innovators building that future.",
    ],
    subcategories: [
      {
        title: "Best EduTech Innovation for Education — Africa Regional",
        description:
          "Recognising digital platforms, tools, and innovators transforming how Africa learns.",
        cta: "Nominate an EduTech Innovation",
        href: "/nominate?pillar=edtech-stem&track=edtech",
      },
      {
        title: "Best STEM Education Programme — Africa Regional",
        description:
          "Recognising STEM programmes preparing African learners for science, technology, innovation, and the future of work.",
        cta: "Nominate a STEM Programme",
        href: "/nominate?pillar=edtech-stem&track=stem",
      },
    ],
    sponsorPositioning:
      "This pillar places sponsors at the centre of Africa's education technology and STEM innovation movement.",
    sponsorCta: { label: "Sponsor the EdTech & STEM Pillar", href: "/sponsors" },
    nominationCta: {
      label: "Nominate an EdTech or STEM Innovator",
      href: "/nominate?pillar=edtech-stem",
    },
    hashtags: [
      "#EdTechAfrica",
      "#STEMEducationAfrica",
      "#NESAAfrica2026",
      "#DigitalLearningAfrica",
      "#FutureOfLearning",
    ],
    icon: Cpu,
    accent: "from-cyan-500/30 via-sky-500/15 to-transparent",
    bannerCta: "Nominate an EdTech or STEM Innovator",
    bannerSummary:
      "For innovators changing how Africa learns. Recognising technology, science, digital, and STEM transformation.",
  },

  {
    slug: "education-funding",
    number: 5,
    shortTitle: "Institutional & Bilateral Grants for Education for All",
    pageTitle: "Institutional & Bilateral Grants for Education for All",
    sellLine: "Funding the future of African education.",
    heroHeadline: "Honouring Bilateral Agencies, Multilateral Partners and Grant-Makers Funding Education for All.",
    intro: [
      "The Best Education Grants & Funding for Africa pillar recognises the foundations, development partners, grant-makers, NGOs, government agencies, donor institutions, and scholarship funds financing measurable education outcomes.",
      "Education impact requires belief. It also requires funding.",
      "This pillar honours those who provide the financial backbone behind access, infrastructure, scholarships, research, inclusion, innovation, and long-term education development.",
    ],
    eligible: [
      "Foundations",
      "Development organisations",
      "Grant-making institutions",
      "Scholarship funds",
      "NGOs funding education access",
      "Government education support programmes",
      "Bilateral and multilateral partners",
      "Corporate foundations",
      "International education partners",
      "Research and education development funders",
    ],
    notEligible: [
      "Funders with no clear education focus",
      "Funding claims with no documentation",
      "Short-term donations without measurable connection to learning",
      "Organisations seeking recognition without transparency",
    ],
    whyExists: [
      "Education funding is often invisible. NESA-Africa makes it visible.",
      "This pillar helps the continent see who is financing the classrooms, libraries, scholarships, research, interventions, and innovations that make education possible.",
    ],
    subcategories: [
      {
        title: "Excellence in International Partnership for Education — Africa",
        description:
          "Recognising international partnerships creating measurable education progress across Africa.",
        cta: "Nominate an International Education Partner",
        href: "/nominate?pillar=education-funding&track=international-partnership",
      },
      {
        title: "Education Grants & Funding Impact Recognition",
        description:
          "Recognising grant-makers, foundations, and institutions financing education access, equity, innovation, infrastructure, and outcomes.",
        cta: "Submit a Funding Impact Story",
        href: "/nominate?pillar=education-funding&track=grants",
      },
    ],
    sponsorPositioning:
      "This pillar positions sponsors and partners as builders of measurable education development.",
    sponsorCta: { label: "Sponsor the Education Funding Pillar", href: "/sponsors" },
    nominationCta: {
      label: "Submit a Funding Impact Story",
      href: "/nominate?pillar=education-funding",
    },
    hashtags: [
      "#EducationFundingAfrica",
      "#GrantsForEducation",
      "#NESAAfrica2026",
      "#FundersForEducation",
      "#EducationImpact",
    ],
    icon: Coins,
    accent: "from-yellow-500/30 via-amber-500/15 to-transparent",
    bannerCta: "Submit a Funding Impact Story",
    bannerSummary:
      "For funders making education possible. Honouring foundations, partners, grant-makers, NGOs, and institutions.",
  },

  {
    slug: "continental-recognition",
    number: 6,
    shortTitle: "Institutional Excellence in Education",
    pageTitle: "Institutional Excellence in Education",
    sellLine: "Strengthening Africa's education systems.",
    heroHeadline: "Recognising Governments, Ministries, Universities, Research Institutes, NGOs and Public Institutions Strengthening Education.",
    intro: [
      "The Continental Education Recognition & Awards pillar houses the broader NESA-Africa award categories.",
      "This is where schools, universities, libraries, NGOs, governments, media organisations, creative arts contributors, policy leaders, public institutions, regional education actors, and faith-based education impact organisations find their recognition pathway.",
      "This pillar keeps the full breadth of NESA-Africa intact while giving visitors a simple way to understand where the wider categories belong.",
    ],
    eligible: [
      "Schools and education institutions",
      "Universities and tertiary institutions",
      "Libraries",
      "NGOs",
      "Media organisations",
      "Creative arts projects",
      "Education policy leaders",
      "State governments",
      "Faith-based education organisations",
      "Regional education development initiatives",
      "Research and development contributors",
    ],
    notEligible: [
      "Nominees with no education contribution",
      "Projects without evidence of impact",
      "Political claims without education outcomes",
      "Media or creative campaigns not connected to education",
    ],
    whyExists: [
      "Africa's education enablers are not built by one group alone.",
      "It is built by institutions, governments, communities, storytellers, NGOs, researchers, libraries, policy leaders, and public actors. This pillar recognises the full system.",
    ],
    subcategories: [
      {
        title: "Best Media Organisation for Education Advocacy — Nigeria",
        description:
          "Recognising media organisations using journalism, broadcasting, publishing, and storytelling to advance education.",
        cta: "Nominate a Media Organisation",
        href: "/nominate?pillar=continental-recognition&track=media-nigeria",
      },
      {
        title: "Best NGO for Education Advancement — Nigeria",
        description:
          "Recognising Nigerian NGOs improving education access, inclusion, support, advocacy, and community learning.",
        cta: "Nominate an Education NGO",
        href: "/nominate?pillar=continental-recognition&track=ngo-nigeria",
      },
      {
        title: "Best NGO for Education Advancement — Africa Regional",
        description:
          "Recognising African NGOs driving education impact across regions and underserved communities.",
        cta: "Nominate a Regional Education NGO",
        href: "/nominate?pillar=continental-recognition&track=ngo-regional",
      },
      {
        title: "Best Creative Arts Contribution to Education — Nigeria",
        description:
          "Recognising creative arts projects using music, film, literature, performance, design, and culture to promote learning.",
        cta: "Nominate a Creative Arts Education Project",
        href: "/nominate?pillar=continental-recognition&track=creative-arts",
      },
      {
        title: "Best Education Policy & Implementation State — Nigeria",
        description:
          "Recognising state-level leadership turning education policy into measurable learning progress.",
        cta: "Nominate an Education Policy State",
        href: "/nominate?pillar=continental-recognition&track=policy-state",
      },
      {
        title: "Best Tertiary Institution Library — Nigeria",
        description:
          "Recognising libraries strengthening research, access to knowledge, student support, and academic excellence.",
        cta: "Nominate a Tertiary Library",
        href: "/nominate?pillar=continental-recognition&track=library",
      },
      {
        title: "Excellence in R&D for Education — Nigeria",
        description:
          "Recognising research and development contributions improving education systems, policy, technology, and practice.",
        cta: "Nominate an Education R&D Leader",
        href: "/nominate?pillar=continental-recognition&track=rd",
      },
      {
        title: "Excellence in Christian Education Impact — Africa Regional",
        description:
          "Recognising Christian institutions and organisations advancing education access, values, inclusion, and community development.",
        cta: "Nominate a Christian Education Impact Leader",
        href: "/nominate?pillar=continental-recognition&track=christian",
      },
      {
        title: "Excellence in Islamic Education Impact — Africa Regional",
        description:
          "Recognising Islamic institutions and organisations advancing education access, values, inclusion, and community development.",
        cta: "Nominate an Islamic Education Impact Leader",
        href: "/nominate?pillar=continental-recognition&track=islamic",
      },
      {
        title: "Excellence in Political Leadership for Education — Nigeria",
        description:
          "Recognising political and public leadership that has advanced education through policy, funding, implementation, reform, or measurable public service.",
        cta: "Nominate a Political Education Leader",
        href: "/nominate?pillar=continental-recognition&track=political",
      },
    ],
    sponsorPositioning:
      "This pillar allows sponsors to support the broadest recognition platform for Africa's education enablers.",
    sponsorCta: { label: "Sponsor Continental Recognition Awards", href: "/sponsors" },
    nominationCta: {
      label: "Explore All Award Categories",
      href: "/awards/categories",
    },
    hashtags: [
      "#AfricanEducationAwards",
      "#NESAAfrica2026",
      "#EducationExcellence",
      "#ContinentalRecognition",
      "#EducationForAll",
    ],
    icon: Landmark,
    accent: "from-violet-500/30 via-purple-500/15 to-transparent",
    bannerCta: "Explore All Award Categories",
    bannerSummary:
      "For institutions, governments, NGOs, media, libraries, and regional education leaders across Africa.",
  },

  {
    slug: "social-media-champions",
    number: 7,
    shortTitle: "Social Media Education Champions",
    pageTitle: "Social Media Education Champions",
    sellLine: "From the classroom to the timeline, if you are promoting African education, NESA-Africa sees you.",
    heroHeadline: "Certificate of Recognition for Digital Voices Promoting Education for All.",
    intro: [
      "Every day, thousands of people use social media to promote education across Africa.",
      "A teacher shares free lessons on TikTok. A diaspora supporter raises funds for a school back home. A parent advocates for girl-child education on Facebook. A creator tells African education stories on YouTube. A global ally promotes African literacy on LinkedIn. An NGO uses WhatsApp to mobilise school support.",
      "Many of these people do this without formal recognition. NESA-Africa now sees them.",
      "The Social Media Education Champions Certificate of Recognition honours Africans in Africa, Africans in the diaspora, and Friends of Africa using digital platforms to promote Education for All.",
    ],
    eligible: [
      "Teachers sharing lessons online",
      "Education bloggers",
      "TikTok, Instagram, YouTube, Facebook, X, LinkedIn, and WhatsApp education advocates",
      "Diaspora Africans fundraising for schools",
      "Parents and PTA advocates",
      "NGOs promoting education online",
      "Friends of Africa supporting education causes",
      "Content creators telling education stories",
      "Professionals mentoring learners online",
      "Organisations amplifying African education campaigns",
    ],
    notEligible: [
      "Accounts promoting harmful, false, or exploitative content",
      "Pages with no clear education contribution",
      "Popular accounts with no visible education advocacy",
      "Fake or unverifiable social media profiles",
    ],
    whyExists: [
      "Recognition should not only belong to the famous.",
      "A person with 200 followers promoting literacy in a community matters. A diaspora group raising school fees matters. A creator documenting education challenges matters. A friend of Africa amplifying school support matters.",
      "This pillar turns social media recognition into a movement.",
    ],
    subcategories: [
      {
        title: "7A — Africans in Africa",
        description:
          "For individuals and organisations based in Africa using social media to promote education access, literacy, STEM learning, school enrolment, teacher support, girl-child education, digital learning, and community advocacy.",
        certificateTagline: "Recognised by NESA-Africa 2026 — Education Voice of the Continent.",
        cta: "Apply as an Education Voice in Africa",
        href: "/nominate?pillar=social-media-champions&track=africa",
      },
      {
        title: "7B — Africans in the Diaspora",
        description:
          "For Africans living outside the continent using their platforms, networks, mentorship, fundraising, and advocacy to support education back home.",
        certificateTagline: "Recognised by NESA-Africa 2026 — Diaspora Education Champion.",
        cta: "Apply as a Diaspora Education Champion",
        href: "/nominate?pillar=social-media-champions&track=diaspora",
      },
      {
        title: "7C — Friends of Africa",
        description:
          "For non-African individuals, institutions, organisations, and advocates supporting African education through media, funding, storytelling, research, or public advocacy.",
        certificateTagline: "Recognised by NESA-Africa 2026 — Friend of African Education.",
        cta: "Apply as a Friend of African Education",
        href: "/nominate?pillar=social-media-champions&track=friends",
      },
    ],
    sponsorPositioning:
      "This is the most shareable NESA-Africa recognition pillar. Every certificate recipient becomes an ambassador. Every recognition post becomes organic visibility. Every social media story becomes an entry point into the NESA-Africa movement.",
    sponsorCta: { label: "Sponsor Social Media Education Champions", href: "/sponsors" },
    nominationCta: {
      label: "Apply for Certificate of Recognition",
      href: "/nominate?pillar=social-media-champions",
    },
    hashtags: [
      "#NESAEduChampion",
      "#SocialMediaForEducation",
      "#AfricaTeaches",
      "#DiasporaChampion2026",
      "#FriendsOfAfricaEdu",
      "#BlueGarnetVoice",
      "#EducationForAll",
      "#NESAAfrica2026",
    ],
    icon: Megaphone,
    accent: "from-rose-500/30 via-pink-500/15 to-transparent",
    bannerCta: "Apply for Certificate of Recognition",
    bannerSummary:
      "For digital voices promoting Education for All. Certificate of Recognition across Africa, diaspora, and Friends of Africa.",
    recipientBenefits: [
      "Digital Certificate",
      "Digital Badge",
      "Recognition Profile",
      "Social Media Shoutout",
      "Community Access",
      "Possible NESA TV Feature",
    ],
    extraNote:
      "No minimum follower count is required. Recognition is based on visible education contribution, not popularity.",
  },

  // PILLAR 8 — Philanthropy for Education (NEW)
  {
    slug: "philanthropy-for-education",
    number: 8,
    shortTitle: "Philanthropy for Education",
    pageTitle: "Philanthropy for Education",
    sellLine: "Transforming generosity into educational opportunity.",
    heroHeadline: "Honouring Philanthropists, Foundations and Scholarship Providers Expanding Educational Access.",
    intro: [
      "The Philanthropy for Education pillar recognises philanthropists, charitable foundations, scholarship providers and education benefactors whose investments expand educational opportunity, equity and access across Africa.",
      "From individual benefactors funding scholarships to foundations endowing schools, this pillar honours those whose generosity becomes lasting educational opportunity.",
    ],
    eligible: [
      "Individual philanthropists funding education",
      "Charitable foundations",
      "Scholarship providers and trusts",
      "Family foundations",
      "Education endowments and benefactors",
      "Africans in Africa, the diaspora, and Friends of Africa",
    ],
    notEligible: [
      "One-off donations without documented education impact",
      "Publicity-only giving without evidence",
      "Funding with conditions that compromise educational independence",
    ],
    whyExists: [
      "Behind every scholarship recipient, funded classroom and endowed library is a philanthropist who believed.",
      "NESA-Africa makes that generosity visible at a continental scale.",
    ],
    subcategories: [
      {
        title: "Individual Philanthropist for Education",
        description: "Recognising individuals whose personal giving has expanded educational access.",
        cta: "Nominate a Philanthropist",
        href: "/nominate?pillar=philanthropy-for-education&track=individual",
      },
      {
        title: "Foundation for Education",
        description: "Recognising charitable foundations financing educational opportunity at scale.",
        cta: "Nominate a Foundation",
        href: "/nominate?pillar=philanthropy-for-education&track=foundation",
      },
      {
        title: "Scholarship Provider",
        description: "Recognising scholarship funds opening doors for African learners.",
        cta: "Nominate a Scholarship Provider",
        href: "/nominate?pillar=philanthropy-for-education&track=scholarship",
      },
    ],
    sponsorPositioning:
      "Position your brand alongside Africa's most respected education philanthropists.",
    sponsorCta: { label: "Sponsor the Philanthropy Pillar", href: "/sponsors" },
    nominationCta: {
      label: "Nominate an Education Philanthropist",
      href: "/nominate?pillar=philanthropy-for-education",
    },
    hashtags: [
      "#PhilanthropyForEducation",
      "#NESAAfrica2026",
      "#EducationForAll",
      "#GivingForLearning",
    ],
    icon: HeartHandshake,
    accent: "from-pink-500/30 via-rose-500/15 to-transparent",
    bannerCta: "Nominate an Education Philanthropist",
    bannerSummary:
      "For philanthropists, foundations and scholarship providers expanding educational opportunity across Africa.",
  },

  // PILLAR 9 — Faith-Based & Religious Organisations Advancing Education (NEW)
  {
    slug: "faith-based-education",
    number: 9,
    shortTitle: "Faith-Based & Religious Organisations Advancing Education",
    pageTitle: "Faith-Based & Religious Organisations Advancing Education",
    sellLine: "Serving communities through education.",
    heroHeadline: "Honouring Christian, Islamic and Other Faith-Based Organisations Advancing Education for All.",
    intro: [
      "The Faith-Based & Religious Organisations pillar recognises Christian, Islamic and other faith-based organisations advancing education through schools, scholarships, vocational training, humanitarian services, community learning and inclusive educational programmes.",
      "Across Africa, faith-based institutions are among the largest providers of education, particularly in underserved communities. NESA-Africa honours their consistent, generations-long contribution.",
    ],
    eligible: [
      "Christian education organisations and institutions",
      "Islamic education organisations and institutions",
      "Other faith-based education providers",
      "Faith-led schools, colleges and universities",
      "Faith-based scholarship and humanitarian programmes",
      "Religious organisations running vocational and adult learning",
    ],
    notEligible: [
      "Religious activities without an education component",
      "Programmes that exclude learners on non-faith grounds without explanation",
      "Unverifiable claims of educational impact",
    ],
    whyExists: [
      "Faith-based organisations have built and sustained much of Africa's education infrastructure for centuries.",
      "This pillar gives that quiet, consistent contribution the continental recognition it deserves.",
    ],
    subcategories: [
      {
        title: "Christian Education Impact",
        description: "Christian institutions and leaders advancing education access, inclusion and community development.",
        cta: "Nominate a Christian Education Partner",
        href: "/nominate?pillar=faith-based-education&track=christian",
      },
      {
        title: "Islamic Education Impact",
        description: "Islamic institutions and leaders advancing education access, inclusion and community development.",
        cta: "Nominate an Islamic Education Partner",
        href: "/nominate?pillar=faith-based-education&track=islamic",
      },
      {
        title: "Inter-Faith & Other Faith-Based Education",
        description: "Other faith-based organisations expanding learning opportunity across Africa.",
        cta: "Nominate a Faith-Based Partner",
        href: "/nominate?pillar=faith-based-education&track=interfaith",
      },
    ],
    sponsorPositioning:
      "Stand alongside Africa's faith communities in building inclusive, values-driven education access.",
    sponsorCta: { label: "Sponsor the Faith-Based Education Pillar", href: "/sponsors" },
    nominationCta: {
      label: "Nominate a Faith-Based Education Partner",
      href: "/nominate?pillar=faith-based-education",
    },
    hashtags: [
      "#FaithForEducation",
      "#NESAAfrica2026",
      "#EducationForAll",
      "#CommunityLearning",
    ],
    icon: BookOpen,
    accent: "from-purple-500/30 via-indigo-500/15 to-transparent",
    bannerCta: "Nominate a Faith-Based Education Partner",
    bannerSummary:
      "For Christian, Islamic and other faith-based organisations advancing education access, scholarships and inclusion across Africa.",
  },
];

export const getPillar = (slug: string): Pillar | undefined =>
  PILLARS.find((p) => p.slug === slug);
