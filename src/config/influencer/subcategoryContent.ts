// Content for the three dedicated Influencer Education Impact subcategory
// pages. Aligned with the NESA-Africa 2026 recognition framework:
//   Review method: NRC impact verification and governance approval.
//   Public voting: not applicable in 2026.

export type InfluencerSubcategorySlug =
  | "african-social-media-influencers"
  | "african-sports-icons-supporting-education"
  | "african-music-icons-supporting-education";

export interface InfluencerSubcategoryContent {
  slug: InfluencerSubcategorySlug;
  formMedium: "social-media" | "sports-icons" | "music-icons";
  seoTitle: string;
  metaDescription: string;
  breadcrumbLeaf: string;
  tierLabel: string;
  title: string;
  supportingStatement: string;
  intro: string[];
  nominateCta: string;
  quickInfo: { label: string; value: string }[];
  heroImageAlt: string;
  celebrates: string[];
  whoMayBeNominated: string[];
  whoMayBeNominatedNote?: string;
  geographyClassifications: string[];
  geographyExtras: string[];
  eligibility: string[];
  eligibilityFootnote?: string;
  evidence: string[];
  impactQuestions: string[];
  directoryHeading: string;
  directoryIntro: string;
  directoryFilters: string[];
  directoryCardShows: string[];
  directoryExcludes: string;
  formTitle: string;
  formSections: string[];
  keyNomineeFields: string[];
  submitCta: string;
  reviewSteps: string[];
  integrityNotice: string;
  faqs: { q: string; a: string }[];
  finalCta: {
    heading: string;
    body: string;
  };
}

const COMMON_QUICK_INFO_TAIL = [
  { label: "Geographic coverage", value: "Africa and African Diaspora" },
  {
    label: "Decision method",
    value: "NRC impact verification and governance approval",
  },
  { label: "Public voting", value: "None" },
  { label: "Nominations close", value: "14 October 2026" },
];

export const INFLUENCER_SUBCATEGORIES: Record<
  InfluencerSubcategorySlug,
  InfluencerSubcategoryContent
> = {
  "african-social-media-influencers": {
    slug: "african-social-media-influencers",
    formMedium: "social-media",
    seoTitle:
      "African Social Media Influencers Education Impact | NESA-Africa 2026",
    metaDescription:
      "Nominate an African creator, podcaster, blogger or digital advocate whose verified online influence is advancing education across Africa or the African Diaspora.",
    breadcrumbLeaf: "African Social Media Influencers",
    tierLabel: "Influencer Education Impact 2026",
    title: "African Social Media Influencers Education Impact",
    supportingStatement:
      "Recognising creators, podcasters, bloggers and digital advocates using digital platforms to advance learning, literacy, mentorship, scholarships, school support and public understanding of education.",
    intro: [
      "Digital influence can do more than attract attention. It can help a learner find a scholarship, connect a school to support, explain complex ideas, mobilise resources and inspire young people to remain in education.",
      "This subcategory honours African and diaspora-based digital voices whose verified work has created measurable education impact.",
    ],
    nominateCta: "Nominate a Social Media Education Enabler",
    quickInfo: [
      {
        label: "Nominee type",
        value: "Individual creator or recognised digital advocate",
      },
      ...COMMON_QUICK_INFO_TAIL,
    ],
    heroImageAlt:
      "African digital creator recording education-focused content for an online audience.",
    celebrates: [
      "explain education issues",
      "produce learning content",
      "promote literacy",
      "identify scholarships and opportunities",
      "mentor learners and young professionals",
      "support schools and education programmes",
      "raise funds for credible education causes",
      "advocate for inclusive education",
      "promote African knowledge and languages",
      "connect young people to skills and career opportunities",
      "mobilise public attention around Education for All",
    ],
    whoMayBeNominated: [
      "social-media content creators",
      "podcasters",
      "bloggers",
      "video creators",
      "digital storytellers",
      "education commentators",
      "online learning advocates",
      "community-media creators",
      "career and skills educators",
      "literacy advocates",
      "disability-inclusion advocates",
      "technology and digital-skills educators",
      "diaspora-based African creators supporting African education",
    ],
    whoMayBeNominatedNote:
      "The nominee must be an individual or a clearly identifiable creator-led public platform. Media companies should be nominated under the relevant Media Organisation category rather than this subcategory.",
    geographyClassifications: [
      "African in Africa",
      "Diaspora African",
      "Friend of Africa, where the person's work directly supports African education",
    ],
    geographyExtras: [
      "nationality",
      "country of residence",
      "principal African country of impact",
      "other African countries reached",
      "African regions reached",
      "diaspora country, where applicable",
    ],
    eligibility: [
      "have a clear and active public identity",
      "have produced education-focused or education-supporting content",
      "demonstrate activity beyond occasional posts",
      "show evidence of actual education outcomes or credible mobilisation",
      "provide accessible links to relevant content or campaigns",
      "have no unresolved material integrity concerns",
      "consent to verification and public-profile publication where required",
      "meet the published NESA-Africa integrity requirements",
    ],
    eligibilityFootnote: "Follower numbers alone do not establish eligibility.",
    evidence: [
      "educational videos, podcasts, articles or livestreams",
      "learner or audience testimonials",
      "scholarship or opportunity campaigns",
      "school-support campaigns",
      "education fundraising records",
      "partnerships with schools, NGOs or institutions",
      "workshops, mentoring sessions or learning communities",
      "audience analytics linked to education campaigns",
      "verified referrals or opportunities created",
      "documented policy or public-awareness outcomes",
      "credible media coverage",
      "independent confirmation from beneficiaries or partners",
    ],
    impactQuestions: [
      "What is the nominee's primary digital platform?",
      "What type of education content does the nominee produce?",
      "When did the education-focused activity begin?",
      "Which learners or communities are served?",
      "Which African countries or diaspora communities are reached?",
      "What education problem is the nominee addressing?",
      "How frequently is education content produced?",
      "What campaigns, scholarships or programmes have been supported?",
      "How many people have benefited from the work?",
      "What measurable outcome has resulted?",
      "Which schools, NGOs or institutions have partnered with the nominee?",
      "Has the nominee mobilised funds or learning resources?",
      "How is the impact sustained beyond individual posts?",
      "What evidence demonstrates impact beyond follower count?",
      "Why should the nominee receive NESA-Africa recognition?",
    ],
    directoryHeading: "Explore African Social Media Education Enablers",
    directoryIntro:
      "Discover verified creators and digital advocates using online influence to improve learning and education opportunity.",
    directoryFilters: [
      "name",
      "country",
      "country of residence",
      "African region",
      "content type",
      "education focus",
      "verification status",
      "year nominated",
    ],
    directoryCardShows: [
      "photograph",
      "public name",
      "country",
      "platform type",
      "education-impact summary",
      "verification badge where approved",
      "View Profile button",
    ],
    directoryExcludes:
      "Public rankings, vote counts and popularity scores are not displayed.",
    formTitle: "Nominate an African Social Media Education Enabler",
    formSections: [
      "Recognition and subcategory confirmation",
      "Geographic classification",
      "Nominee identity",
      "Digital platform information",
      "Education-content contribution",
      "Measurable impact",
      "Campaigns, scholarships and school support",
      "Evidence and public links",
      "Nominator details",
      "Consent and declaration",
    ],
    keyNomineeFields: [
      "full legal name",
      "public or creator name",
      "nationality",
      "country of residence",
      "primary platform",
      "username or channel",
      "website",
      "email or management contact",
      "biography",
      "profile photograph",
      "audience size, collected for context only",
      "education focus",
      "countries reached",
      "years active",
    ],
    submitCta: "Submit Social Media Influencer Nomination",
    reviewSteps: [
      "Nomination submitted",
      "Identity and duplicate check",
      "Nominee acceptance",
      "Profile and evidence completion",
      "NRC impact verification",
      "Governance approval",
      "Verified profile and recognition",
    ],
    integrityNotice:
      "This recognition is not determined by follower count, public voting, AGC Participation Credits or online popularity. NESA-Africa reviews verified education contribution, evidence, continuity, reach, outcomes and integrity.",
    faqs: [
      {
        q: "Is this a popularity award?",
        a: "No. Follower count and online popularity do not determine recognition.",
      },
      {
        q: "Can creators nominate themselves?",
        a: "Self-nomination may be permitted, but the contribution must still be independently verified.",
      },
      {
        q: "Can a podcast host be nominated?",
        a: "Yes, where the podcast or associated activities create credible education impact.",
      },
      {
        q: "Can a media company be nominated here?",
        a: "No. A media organisation should use the Media Organisation for Education Advocacy category.",
      },
      {
        q: "Can the same creator receive several nominations?",
        a: "Yes. Multiple submissions may support one master nominee profile after duplicate review.",
      },
      {
        q: "Does nomination guarantee recognition?",
        a: "No. Every nomination is subject to eligibility, acceptance, evidence and verification.",
      },
    ],
    finalCta: {
      heading: "Know a Digital Voice Advancing Education?",
      body: "Help Africa discover a creator whose influence is opening opportunities for learning.",
    },
  },

  "african-sports-icons-supporting-education": {
    slug: "african-sports-icons-supporting-education",
    formMedium: "sports-icons",
    seoTitle: "African Sports Icons Supporting Education | NESA-Africa 2026",
    metaDescription:
      "Nominate an African athlete, coach, academy founder or sports leader whose verified work supports education, scholarships, schools and youth development.",
    breadcrumbLeaf: "African Sports Icons Supporting Education",
    tierLabel: "Influencer Education Impact 2026",
    title: "African Sports Icons Supporting Education",
    supportingStatement:
      "Recognising athletes, coaches, academies and sports leaders using the power of sport to fund learning, strengthen schools, mentor young people and expand education opportunity.",
    intro: [
      "Sport can inspire discipline, confidence and leadership, but its impact becomes even greater when sporting influence is used to keep young people in school, finance scholarships, improve learning facilities and connect talent to education.",
      "This subcategory honours African and diaspora sports figures whose verified education contribution extends beyond sporting achievement.",
    ],
    nominateCta: "Nominate a Sports Education Enabler",
    quickInfo: [
      {
        label: "Nominee type",
        value: "Athlete, coach, academy founder or sports leader",
      },
      ...COMMON_QUICK_INFO_TAIL,
    ],
    heroImageAlt:
      "African sports leader mentoring learners through a school and youth-development programme.",
    celebrates: [
      "scholarships",
      "school construction or renovation",
      "learning materials",
      "youth mentoring",
      "sports-and-education academies",
      "literacy programmes",
      "school retention",
      "girls' education",
      "disability inclusion",
      "leadership development",
      "career preparation",
      "equipment and technology donations",
      "teacher or coach development",
      "fundraising for education",
    ],
    whoMayBeNominated: [
      "professional athletes",
      "retired athletes",
      "para-athletes",
      "coaches",
      "sports academy founders",
      "sporting foundations",
      "sports mentors",
      "team or club leaders",
      "sports administrators",
      "sports philanthropists",
      "diaspora African sports personalities supporting education in Africa",
    ],
    whoMayBeNominatedNote:
      "Where an academy or foundation is nominated as the primary nominee rather than its founder, the form must capture the correct organisation nominee type.",
    geographyClassifications: [
      "African in Africa",
      "Diaspora African",
      "Friend of Africa, where directly supporting African education",
    ],
    geographyExtras: [
      "nationality",
      "sport",
      "country of residence",
      "principal African country of impact",
      "other countries reached",
      "African regions reached",
      "academy or foundation location",
    ],
    eligibility: [
      "have a verifiable sporting or sports-leadership identity",
      "demonstrate a specific contribution to education",
      "provide evidence beyond general youth inspiration",
      "identify beneficiaries, programmes or institutions supported",
      "have credible references or partners",
      "meet integrity and safeguarding requirements",
      "permit verification",
      "demonstrate that education is a substantive part of the contribution",
    ],
    eligibilityFootnote: "Sporting achievement alone does not qualify.",
    evidence: [
      "scholarship records",
      "school or academy reports",
      "education-programme records",
      "beneficiary lists or anonymised statistics",
      "partnership letters",
      "school construction or renovation evidence",
      "mentoring-programme attendance",
      "financial contributions",
      "equipment or learning-material donations",
      "photographs and videos",
      "independent media coverage",
      "teacher, parent or school testimonials",
      "annual foundation reports",
      "measured education or progression outcomes",
    ],
    impactQuestions: [
      "What sport is the nominee associated with?",
      "What is the nominee's professional or leadership role?",
      "What education programme or intervention is being nominated?",
      "When did the contribution begin?",
      "Which countries, schools or communities have benefited?",
      "How many scholarships have been provided?",
      "How many learners have been reached?",
      "Has the nominee built, renovated or equipped schools?",
      "Does the nominee operate an academy combining sport and education?",
      "What mentoring or leadership support is provided?",
      "How are girls, vulnerable learners or learners with disabilities included?",
      "Which organisations or institutions are partners?",
      "What measurable education outcomes have been achieved?",
      "How is the work funded and sustained?",
      "What independent evidence supports the claims?",
      "Why should the nominee receive NESA-Africa recognition?",
    ],
    directoryHeading: "Explore African Sports Education Enablers",
    directoryIntro:
      "Discover athletes, coaches and sports leaders using sport as a platform for education and opportunity.",
    directoryFilters: [
      "name",
      "sport",
      "country",
      "country of residence",
      "African region",
      "contribution type",
      "academy or foundation",
      "verification status",
    ],
    directoryCardShows: [
      "photograph",
      "name",
      "sport",
      "country",
      "short education-impact summary",
      "verified-profile status",
      "View Profile button",
    ],
    directoryExcludes: "Vote totals and public rankings are not displayed.",
    formTitle: "Nominate an African Sports Icon Supporting Education",
    formSections: [
      "Recognition and subcategory confirmation",
      "Geographic classification",
      "Nominee identity and sporting profile",
      "Academy, foundation or programme details",
      "Scholarships and school support",
      "Mentoring and youth development",
      "Beneficiaries and measurable outcomes",
      "Safeguarding and inclusion",
      "Evidence upload",
      "Nominator information and declaration",
    ],
    keyNomineeFields: [
      "full legal name",
      "professional name",
      "nationality",
      "country of residence",
      "sport",
      "current or former club/team",
      "professional status",
      "academy or foundation",
      "management contact",
      "biography",
      "photograph",
      "website",
      "verified public profiles",
    ],
    submitCta: "Submit Sports Icon Nomination",
    reviewSteps: [
      "Nomination submitted",
      "Identity and sporting-profile check",
      "Duplicate review",
      "Nominee acceptance",
      "Education-impact evidence",
      "NRC verification",
      "Governance approval",
      "Verified profile and recognition",
    ],
    integrityNotice:
      "Sporting success, fame, endorsements, sponsorship value and follower numbers do not determine recognition. NESA-Africa assesses verified education contribution, beneficiary impact, continuity, evidence, inclusion and integrity.",
    faqs: [
      {
        q: "Is sporting success enough to qualify?",
        a: "No. The nominee must demonstrate verified education contribution.",
      },
      {
        q: "Can a sports academy be nominated?",
        a: "Yes, where its education role is substantive. The system should identify whether the nominee is the individual leader, academy or foundation.",
      },
      {
        q: "Are scholarships required?",
        a: "No. Education impact may also include school support, mentoring, literacy, infrastructure, inclusion or skills development.",
      },
      {
        q: "Can a non-African sports figure be nominated?",
        a: "Yes, under Friend of Africa where the person has made a verified contribution to African education.",
      },
      {
        q: "Is there public voting?",
        a: "No. The 2026 recognition uses NRC verification and governance approval.",
      },
    ],
    finalCta: {
      heading: "Know a Sports Leader Opening Doors to Education?",
      body: "Nominate an athlete, coach or sports leader whose influence is creating lasting learning opportunities.",
    },
  },

  "african-music-icons-supporting-education": {
    slug: "african-music-icons-supporting-education",
    formMedium: "music-icons",
    seoTitle: "African Music Icons Supporting Education | NESA-Africa 2026",
    metaDescription:
      "Nominate an African musician, recording artist, producer or music-industry leader whose verified work supports scholarships, schools, literacy and education opportunity.",
    breadcrumbLeaf: "African Music Icons Supporting Education",
    tierLabel: "Influencer Education Impact 2026",
    title: "African Music Icons Supporting Education",
    supportingStatement:
      "Recognising musicians, recording artists, producers and music-industry leaders using their voices, resources and creative platforms to expand access to education.",
    intro: [
      "Music reaches people across borders, languages and generations. When that influence is directed toward scholarships, school support, literacy, mentorship and youth development, it becomes a powerful force for education.",
      "This subcategory honours African and diaspora music figures whose verified education contributions have created meaningful and measurable opportunity.",
    ],
    nominateCta: "Nominate a Music Education Enabler",
    quickInfo: [
      {
        label: "Nominee type",
        value: "Musician, artist, producer or music-industry leader",
      },
      ...COMMON_QUICK_INFO_TAIL,
    ],
    heroImageAlt:
      "African music artist supporting learners through an education and mentorship programme.",
    celebrates: [
      "scholarships",
      "school construction and renovation",
      "literacy campaigns",
      "learning materials",
      "youth mentoring",
      "music education",
      "creative-skills training",
      "fundraising concerts",
      "education foundations",
      "school adoption",
      "digital-learning support",
      "girls' education",
      "disability inclusion",
      "community-learning programmes",
      "advocacy for Education for All",
    ],
    whoMayBeNominated: [
      "musicians",
      "singers",
      "recording artists",
      "composers",
      "music producers",
      "DJs",
      "music executives",
      "label founders",
      "music-foundation founders",
      "artist-led education advocates",
      "diaspora African music personalities supporting education in Africa",
    ],
    whoMayBeNominatedNote:
      "Where an artist's foundation is the principal contributor, the nomination form must distinguish between the artist and the organisation.",
    geographyClassifications: [
      "African in Africa",
      "Diaspora African",
      "Friend of Africa, where directly supporting African education",
    ],
    geographyExtras: [
      "nationality",
      "country of residence",
      "music market or professional base",
      "principal African country of impact",
      "other countries reached",
      "African regions reached",
      "foundation or programme location",
    ],
    eligibility: [
      "have a verifiable music or music-industry identity",
      "demonstrate a direct contribution to education",
      "show more than a one-time promotional statement",
      "provide programme, beneficiary or partner evidence",
      "identify the education outcomes created",
      "meet integrity requirements",
      "permit verification",
      "demonstrate credible continuity or significance",
    ],
    eligibilityFootnote:
      "Music popularity, streaming figures or awards alone do not qualify.",
    evidence: [
      "scholarship records",
      "school-project reports",
      "artist-foundation annual reports",
      "fundraising-event records",
      "education-campaign materials",
      "beneficiary data",
      "mentoring-programme records",
      "music-education programme reports",
      "partner confirmations",
      "photographs and videos",
      "financial or in-kind contribution evidence",
      "media reporting",
      "school testimonials",
      "documented education outcomes",
    ],
    impactQuestions: [
      "What is the nominee's role in the music industry?",
      "What education cause or programme does the nominee support?",
      "When did the education contribution begin?",
      "Which schools, learners or communities have benefited?",
      "Which African countries or diaspora communities are reached?",
      "How many scholarships have been funded?",
      "Has the nominee supported school infrastructure or learning materials?",
      "Has the nominee delivered music education or creative-skills training?",
      "What mentoring or youth-development activity is provided?",
      "Have concerts, releases or campaigns raised resources for education?",
      "Which foundations, NGOs or institutions are partners?",
      "What measurable outcomes have been achieved?",
      "How is the programme sustained?",
      "What evidence exists beyond public statements or publicity?",
      "Why should the nominee receive NESA-Africa recognition?",
    ],
    directoryHeading: "Explore African Music Education Enablers",
    directoryIntro:
      "Discover artists and music-industry leaders using creativity and influence to support learning.",
    directoryFilters: [
      "name",
      "music role",
      "country",
      "country of residence",
      "African region",
      "contribution type",
      "programme or foundation",
      "verification status",
    ],
    directoryCardShows: [
      "approved photograph",
      "artist or public name",
      "country",
      "professional role",
      "brief education-impact summary",
      "verification status",
      "View Profile button",
    ],
    directoryExcludes:
      "Public rankings, streaming numbers as scores and vote counts are not displayed.",
    formTitle: "Nominate an African Music Icon Supporting Education",
    formSections: [
      "Recognition and subcategory confirmation",
      "Geographic classification",
      "Nominee identity and music profile",
      "Education programme or foundation",
      "Scholarships and school support",
      "Campaigns, concerts and resource mobilisation",
      "Creative education and mentorship",
      "Beneficiaries and measurable outcomes",
      "Evidence upload",
      "Nominator details and declaration",
    ],
    keyNomineeFields: [
      "full legal name",
      "stage or public name",
      "nationality",
      "country of residence",
      "music profession",
      "label or management",
      "foundation or programme",
      "management contact",
      "website",
      "public profiles",
      "biography",
      "profile image",
    ],
    submitCta: "Submit Music Icon Nomination",
    reviewSteps: [
      "Nomination submitted",
      "Identity and professional-profile check",
      "Duplicate review",
      "Nominee acceptance",
      "Education-impact evidence completion",
      "NRC impact verification",
      "Governance approval",
      "Verified profile and recognition",
    ],
    integrityNotice:
      "Music popularity, awards, streams, chart position, sponsorship, AGC Participation Credits and follower numbers do not determine recognition. NESA-Africa assesses verified education contribution, outcomes, continuity, evidence and integrity.",
    faqs: [
      {
        q: "Is this a music-industry award?",
        a: "No. It recognises verified education impact created through a music figure's platform and resources.",
      },
      {
        q: "Can a producer or music executive be nominated?",
        a: "Yes, where the person has delivered or supported measurable education impact.",
      },
      {
        q: "Can a musician's foundation be nominated?",
        a: "Yes. The form must identify whether the primary nominee is the musician, the foundation or both as linked records.",
      },
      {
        q: "Does a fundraising concert automatically qualify?",
        a: "No. The nomination should show how funds were received, allocated and used for education.",
      },
      {
        q: "Is public voting used?",
        a: "No. The 2026 process uses NRC verification and governance approval.",
      },
    ],
    finalCta: {
      heading: "Know a Music Voice Creating Education Opportunity?",
      body: "Nominate an artist or music-industry leader whose work is helping learners, schools and communities thrive.",
    },
  },
};

export const INFLUENCER_SUBCATEGORY_ORDER: InfluencerSubcategorySlug[] = [
  "african-social-media-influencers",
  "african-sports-icons-supporting-education",
  "african-music-icons-supporting-education",
];

export function getInfluencerSubcategory(slug: string | undefined) {
  if (!slug) return undefined;
  return INFLUENCER_SUBCATEGORIES[slug as InfluencerSubcategorySlug];
}
