// Refactored Africa Education Icon roster (2005–2025 period)
// Source: secretariat shortlist (Santos Aderibigbe, Mar 2026) — credibility-balanced version.
// 3 subcategories × 3 classifications × 20 nominees = up to 180 entries.
// Duplicates of slugs already in ICON_NOMINEES are filtered at export time.

import type {
  IconNominee,
  IconSubcategorySlug,
  IconClassificationSlug,
} from "./index";

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const REGION_BY_COUNTRY: Record<string, string> = {
  Nigeria: "West Africa",
  Ghana: "West Africa",
  Senegal: "West Africa",
  "Sierra Leone": "West Africa",
  "Côte d'Ivoire": "West Africa",
  "Cote d'Ivoire": "West Africa",
  Benin: "West Africa",
  Niger: "West Africa",
  Mali: "West Africa",
  Cameroon: "Central Africa",
  Congo: "Central Africa",
  Angola: "Southern Africa",
  Zimbabwe: "Southern Africa",
  "South Africa": "Southern Africa",
  Malawi: "Southern Africa",
  Kenya: "East Africa",
  Tanzania: "East Africa",
  Uganda: "East Africa",
  Rwanda: "East Africa",
  Ethiopia: "East Africa",
  Somalia: "East Africa",
  Djibouti: "East Africa",
  Sudan: "North Africa",
  Egypt: "North Africa",
  Libya: "North Africa",
  Tunisia: "North Africa",
  Morocco: "North Africa",
  Mauritius: "Indian Ocean Islands",
};

const regionFor = (country: string, cls: IconClassificationSlug): string => {
  if (cls === "diaspora-africans") return "Diaspora & Global Africa";
  if (cls === "friends-of-africa") return "Global Partners";
  return REGION_BY_COUNTRY[country] ?? "Africa";
};

type Row = [name: string, country: string, contribution: string];

const build = (
  prefix: string,
  sub: IconSubcategorySlug,
  cls: IconClassificationSlug,
  rows: Row[],
): IconNominee[] =>
  rows.map((r, i) => {
    const [name, country, contribution] = r;
    const id = `ICON-${prefix}-${String(i + 1).padStart(3, "0")}`;
    const slug = slugify(name);
    const heritage =
      cls === "friends-of-africa" ? "Non-African" : "African";
    const residency =
      cls === "diaspora-africans"
        ? "Diaspora"
        : cls === "friends-of-africa"
        ? "Global Partner"
        : "Africa-Resident";
    return {
      id,
      name,
      slug,
      award_subcategory_slug: sub,
      classification_slug: cls,
      country,
      region: regionFor(country, cls),
      nationality: country,
      heritage_identity: heritage,
      residency_status: residency,
      impact_area: [],
      years_of_contribution: "2005–2025",
      impact_summary: contribution,
      jury_status: "nominated",
      verification_status: "pending",
      image_url: `/images/africaicons/${slug}.png`,
      previous_categories: [
        `${
          sub === "education-philanthropy-icon"
            ? "Africa Education Philanthropy"
            : sub === "literary-new-curriculum-advocate"
            ? "Literary & New Curriculum Advocate"
            : "Africa Technical Educator"
        } Icon of the Period (2005–2025)`,
      ],
      nomination_year: 2026,
      migration_source: "manual",
      migration_status: "pending-review",
    } satisfies IconNominee;
  });

// ───────────────────────── CATEGORY 1: PHILANTHROPY ─────────────────────────
const PHIL_AFRICA: Row[] = [
  ["Yousriya Loza-Sawiris", "Egypt", "Co-founded Sawiris Foundation; funded education reform, scholarships and systemic school transformation."],
  ["Abdul Samad Rabiu", "Nigeria", "BUA Foundation education grants and university infrastructure financing."],
  ["James Mwangi", "Kenya", "Equity Group Foundation; funded secondary scholarships for thousands of low-income students."],
  ["Mohamed Mansour", "Egypt", "Mansour Foundation educational partnerships and youth empowerment initiatives."],
  ["Mo Dewji", "Tanzania", "Mo Dewji Foundation; large-scale secondary and tertiary education sponsorship."],
  ["Samuel Esson Jonah", "Ghana", "University governance reform and scholarship endowment initiatives."],
  ["Innocent Chukwuma", "Nigeria", "Technical education funding and youth skills development initiatives."],
  ["Bethlehem Tilahun Alemu", "Ethiopia", "Enterprise-backed education and youth leadership development funding."],
  ["Ashish Thakkar", "Rwanda", "Youth entrepreneurship academies across Africa."],
  ["Koos Bekker", "South Africa", "Digital infrastructure investments benefiting higher education institutions."],
  ["Hakeem Belo-Osagie", "Nigeria", "Private university governance and tertiary education strengthening."],
  ["Aigboje Aig-Imoukhuede", "Nigeria", "AIG Scholarships; public sector and education leadership reform."],
  ["Kennedy Odede", "Kenya", "Community-led education access initiatives in Kibera."],
  ["Mike Adenuga", "Nigeria", "Educational endowments and tertiary institution funding."],
  ["Mohammed Dewji", "Tanzania", "Foundation supporting secondary and tertiary education access."],
  ["Naguib Sawiris", "Egypt", "Education funding and scholarship programmes."],
  ["Tony Elumelu (Philanthropy track)", "Nigeria", "$100M entrepreneurship programme supporting youth education across Africa."],
  ["Idris Elba (Africa education projects)", "Sierra Leone", "Investment in creative arts education and youth development."],
  ["Yousriya Sawiris (Reform track)", "Egypt", "Sawiris Foundation educational reform programmes."],
  ["Osei Kwame Despite (Schools track)", "Ghana", "Secondary school development and scholarship funding."],
];

const PHIL_DIASPORA: Row[] = [
  ["Ndidi Okonkwo Nwuneli", "Nigeria", "LEAP Africa leadership ecosystem strengthening African institutions."],
  ["Acha Leke", "Cameroon", "Advisory reform work shaping education policy transformation."],
  ["Obiageli Ezekwesili", "Nigeria", "Education reform advocacy and transparency in public systems."],
  ["Akinwumi Adesina", "Nigeria", "Education-linked development financing via AfDB."],
  ["Vera Songwe", "Cameroon", "Economic policy work influencing education sector funding."],
  ["Wale Adeosun", "Nigeria", "Investment capital deployed into African education ventures."],
  ["Eghosa Omoigui", "Nigeria", "Venture support for African edtech startups."],
  ["Tope Awotona", "Nigeria", "Tech capital reinvested into African digital ecosystems."],
  ["Ory Okolloh", "Kenya", "Civic technology literacy strengthening governance education."],
  ["Donald Kaberuka", "Rwanda", "Education-linked development policy frameworks."],
  ["Ibrahim Mayaki", "Niger", "Regional institutional reform affecting education systems."],
  ["Fatoumata Ba", "Senegal", "Digital entrepreneurship mentorship programmes."],
  ["Karim Beguir", "Tunisia", "AI education training programmes across Francophone Africa."],
  ["Hilda Moraa", "Kenya", "Fintech literacy programmes supporting youth inclusion."],
  ["Ngozi Okonjo-Iweala", "Nigeria", "Education financing advocacy via global institutions."],
  ["Nnedi Okorafor (Philanthropy track)", "Nigeria", "Literary development and youth reading culture advocacy."],
  ["Audrey Cheng (Philanthropy track)", "Kenya", "Co-founder AkiraChix supporting women in STEM."],
  ["Rebecca Enonchong (Diaspora work)", "Cameroon", "IT entrepreneurship mentorship."],
  ["Iyinoluwa Aboyeji (Diaspora track)", "Nigeria", "Innovation and tech entrepreneurship education funding."],
  ["Ashish Thakkar (Diaspora track)", "Rwanda", "Youth leadership and entrepreneurship education."],
];

const PHIL_FRIENDS: Row[] = [
  ["Sheikha Moza bint Nasser", "Qatar", "Founder, Education Above All Foundation; funded access-to-education programmes reaching millions of African children."],
  ["Mary Joy Pigozzi", "USA", "Education quality reform through Educate A Child initiatives in Africa."],
  ["Gordon Brown", "UK", "Global education financing advocacy benefiting African countries."],
  ["Julia Gillard", "Australia", "Led Global Partnership for Education directing funds to African systems."],
  ["Mark Lowcock", "UK", "Oversaw humanitarian funding including education in crisis regions in Africa."],
  ["Kristalina Georgieva", "Bulgaria", "Development financing support for African education sectors."],
  ["Mark Malloch-Brown", "UK", "Governance reform programmes impacting education systems."],
  ["Jeffrey Sachs", "USA", "Education-linked development economics influencing African policy."],
  ["Sal Khan", "USA", "Free digital learning resources adopted widely across Africa."],
  ["Sir Fazle Hasan Abed (Posthumous)", "Bangladesh", "BRAC education model expansion into African countries."],
  ["Jacqueline Novogratz", "USA", "Impact investment in African education enterprises."],
  ["Kailash Satyarthi", "India", "Advocacy for child schooling access in vulnerable regions."],
  ["Queen Rania", "Jordan", "Girls' education global partnerships affecting Africa."],
  ["Amina Mohammed", "UK", "UN advocacy strengthening African education systems."],
  ["David Beckham", "UK", "UNICEF education programmes in African nations."],
  ["Michelle Obama", "USA", "Girls' education initiatives with African outreach."],
  ["Ban Ki-moon", "South Korea", "Education access advocacy across developing nations including Africa."],
  ["Antonio Guterres", "Portugal", "UN-led education in emergencies funding in Africa."],
  ["Reed Hastings", "USA", "Education reform philanthropy with global reach impacting Africa."],
  ["Mark Suzman", "USA", "Gates Foundation Africa education programming leadership."],
];

// ───────────────────────── CATEGORY 2: LITERARY & CURRICULUM ─────────────────────────
const LIT_AFRICA: Row[] = [
  ["Mahmood Mamdani", "Uganda", "Advanced African-centered political and historical curriculum reform in higher education."],
  ["Amina Mama", "Nigeria", "Promoted gender studies and feminist curriculum development in African universities."],
  ["Kwesi Yankah", "Ghana", "Strengthened indigenous language scholarship and cultural studies."],
  ["Bayo Olukoshi", "Nigeria", "Education policy reform and social science curriculum development."],
  ["Naledi Pandor", "South Africa", "Higher education policy reform and university transformation."],
  ["Toyin Falola", "Nigeria", "Expanded African historiography and curriculum innovation."],
  ["Achille Mbembe", "Cameroon", "Influenced African philosophical and postcolonial curriculum debates."],
  ["Sabelo Ndlovu-Gatsheni", "Zimbabwe", "Decolonial education reform across African universities."],
  ["Thandika Mkandawire (Posthumous)", "Malawi", "Influenced development economics curriculum across Africa."],
  ["Catherine Odora Hoppers", "South Africa", "Promoted indigenous knowledge systems integration."],
  ["Pius Adesanmi (Posthumous)", "Nigeria", "Advanced African literary criticism scholarship."],
  ["Grace Musila", "Kenya", "African literature pedagogy and curriculum innovation."],
  ["Francis Nyamnjoh", "Cameroon", "Knowledge production reform in African higher education."],
  ["Wandia Njoya", "Kenya", "Curriculum reform advocacy in basic education."],
  ["Ato Quayson", "Ghana", "African literary studies institutional strengthening."],
  ["Ruth Meena", "Tanzania", "Gender curriculum and education access policy reform."],
  ["Jonathan Jansen", "South Africa", "University transformation and education reform leadership."],
  ["Tshilidzi Marwala", "South Africa", "Artificial intelligence ethics integration into university curricula."],
  ["Nuruddin Farah", "Somalia", "Promoted African literary scholarship and curriculum enrichment."],
  ["Véronique Tadjo", "Côte d'Ivoire", "Literary works integrated into African literature curricula."],
];

const LIT_DIASPORA: Row[] = [
  ["Kwame Anthony Appiah", "Ghana", "Advanced African philosophy in global academic curriculum."],
  ["Chika Okeke-Agulu", "Nigeria", "Promoted African art history in global academic institutions."],
  ["Saidiya Hartman", "USA", "Influenced African diaspora historical curriculum."],
  ["Abdulrazak Gurnah", "Tanzania", "Elevated East African literature in global education systems."],
  ["Paul Tiyambe Zeleza", "Malawi", "University leadership reform and academic publishing in Africa."],
  ["Tajudeen Abdul-Raheem (Posthumous)", "Nigeria", "Pan-African intellectual curriculum advocacy."],
  ["Oyeronke Oyewumi", "Nigeria", "Gender theory curriculum reform rooted in African epistemology."],
  ["Simon Gikandi", "Kenya", "African literary scholarship in global academia."],
  ["Tejumola Olaniyan (Posthumous)", "Nigeria", "African cultural studies curriculum development."],
  ["Harry Garuba (Posthumous)", "Nigeria", "Literary and postcolonial scholarship."],
  ["Carli Coetzee", "South Africa", "Promoted African language translation scholarship."],
  ["Akin Adesokan", "Nigeria", "African media studies curriculum expansion."],
  ["Moradewun Adejunmobi", "Nigeria", "African linguistics and media studies reform."],
  ["Lindiwe Dovey", "South Africa", "African film and visual literacy curriculum reform."],
  ["Abiola Irele (Posthumous)", "Nigeria", "Foundational African literary scholarship."],
  ["Okwui Enwezor (Posthumous)", "Nigeria", "Curatorial scholarship influencing African art education."],
  ["Hakim Adi", "UK", "African and diaspora history curriculum reform."],
  ["Maaza Mengiste", "Ethiopia", "Elevated African women's historical narratives."],
  ["Laila Lalami", "Morocco", "Integrated African migration themes into global curriculum."],
  ["Dinaw Mengestu", "Ethiopia", "Highlighted migration and identity themes in education."],
];

const LIT_FRIENDS: Row[] = [
  ["Sheikha Moza bint Nasser (Curriculum track)", "Qatar", "Education Above All Foundation funding curriculum access programmes across Africa."],
  ["Sir Fazle Hasan Abed (Curriculum track)", "Bangladesh", "BRAC education model expansion into African schooling systems."],
  ["Julia Gillard (Curriculum track)", "Australia", "Directed funding supporting curriculum reform in African states."],
  ["Gordon Brown (Curriculum track)", "UK", "Global education access advocacy in African nations."],
  ["Martha Nussbaum", "USA", "Influenced global ethics curriculum adopted in African universities."],
  ["Amartya Sen", "India", "Development theory shaping African public policy education."],
  ["Sir Ken Robinson (Posthumous)", "UK", "Influenced creativity-based curriculum reform models adopted in Africa."],
  ["Jacqueline Novogratz (Curriculum track)", "USA", "Invested in African education innovation enterprises."],
  ["Jeffrey Sachs (Curriculum track)", "USA", "Education-linked development policy shaping African governments."],
  ["Queen Rania (Curriculum track)", "Jordan", "Supported girls' education global frameworks affecting Africa."],
  ["Kristalina Georgieva (Curriculum track)", "Bulgaria", "Development financing enabling education reform."],
  ["Mark Suzman (Curriculum track)", "USA", "Gates Foundation programming strengthening education systems in Africa."],
  ["Antonio Guterres (Curriculum track)", "Portugal", "Education in emergencies funding."],
  ["Ban Ki-moon (Curriculum track)", "South Korea", "UN education advocacy across Africa."],
  ["Sal Khan (Curriculum track)", "USA", "Digital curriculum access widely used in African classrooms."],
  ["David Beckham (Curriculum track)", "UK", "UNICEF education campaigns in African countries."],
  ["Michelle Obama (Curriculum track)", "USA", "Girls' education global outreach including Africa."],
  ["Kailash Satyarthi (Curriculum track)", "India", "Advocacy for child schooling access."],
  ["Amina Mohammed (Curriculum track)", "UK", "UN partnerships strengthening African education institutions."],
  ["Reed Hastings (Curriculum track)", "USA", "Global education innovation philanthropy affecting Africa."],
];

// ───────────────────────── CATEGORY 3: TECHNICAL EDUCATOR ─────────────────────────
const TECH_AFRICA: Row[] = [
  ["Rapelang Rabana", "South Africa", "Developed EdTech platforms for digital learners."],
  ["Erik Hersman", "Kenya", "Built iHub innovation ecosystem supporting tech talent."],
  ["Juliana Rotich", "Kenya", "Developed civic technology and innovation labs."],
  ["William Kamkwamba", "Malawi", "STEM inspiration and science advocacy programmes."],
  ["Hilda Moraa (Tech track)", "Kenya", "Fintech literacy education programmes."],
  ["Bethlehem Tilahun Alemu (Tech track)", "Ethiopia", "Enterprise skills training integrated into youth development."],
  ["Herman Chinery-Hesse", "Ghana", "Software training and digital entrepreneurship advocacy."],
  ["Pascal Murasira", "Rwanda", "Technical workforce development initiatives."],
  ["Sim Shagaya", "Nigeria", "Online learning platforms and digital commerce training."],
  ["Andrew Alli", "Nigeria", "Infrastructure financing supporting tertiary STEM institutions."],
  ["Mark Shuttleworth", "South Africa", "Open-source software supporting educational technology."],
  ["Rebecca Oke", "Nigeria", "Curriculum digitisation initiatives."],
  ["David Sengeh", "Sierra Leone", "AI-driven education policy and innovation reform."],
  ["Bitange Ndemo", "Kenya", "ICT policy reform enabling digital education access."],
  ["Tunde Kehinde (Tech track)", "Nigeria", "Expanded financial literacy education."],
  ["Audrey Cheng (Africa-based)", "Kenya", "Women in coding and STEM empowerment."],
  ["Bright Simons (Tech track)", "Ghana", "Used tech innovation to strengthen governance literacy."],
  ["Patrick Awuah (Tech track)", "Ghana", "Built Ashesi University focusing on ethical STEM leadership."],
  ["Fred Swaniker (Tech track)", "Ghana", "Expanded African Leadership University network."],
  ["Judith Owigar (Tech track)", "Kenya", "Founded Moringa School coding academy."],
];

const TECH_DIASPORA: Row[] = [
  ["Karim Beguir (Tech track)", "Tunisia", "AI training ecosystems supporting Francophone Africa."],
  ["Eghosa Omoigui (Tech track)", "Nigeria", "Venture capital support for African edtech startups."],
  ["Ory Okolloh (Tech track)", "Kenya", "Civic tech and digital governance literacy."],
  ["Tope Awotona (Tech track)", "Nigeria", "Tech reinvestment strengthening digital ecosystems."],
  ["Hakeem Belo-Osagie (Tech track)", "Nigeria", "University governance strengthening."],
  ["Salim Ismail", "Egypt", "Innovation ecosystem frameworks adopted in Africa."],
  ["Fatoumata Ba (Tech track)", "Senegal", "Digital entrepreneurship training networks."],
  ["Dare Okoudjou", "Benin", "Payment technology skills expansion."],
  ["Tayo Oviosu", "Nigeria", "Financial inclusion literacy."],
  ["Acha Leke (Tech track)", "Cameroon", "Advisory reform for digital education systems."],
  ["Karim Jovian", "Sierra Leone", "Youth digital awareness initiatives."],
  ["Ali Partovi", "USA", "Tech mentorship programmes benefiting African coders."],
  ["Idris Sandu", "Ghana", "Youth coding advocacy initiatives."],
  ["Donald Kaberuka (Tech track)", "Rwanda", "Development financing supporting STEM institutions."],
  ["Vera Songwe (Tech track)", "Cameroon", "Policy frameworks strengthening tech education funding."],
  ["Hilda Kragha", "Nigeria", "Workforce digitalisation and employability frameworks."],
  ["Karim Sy", "Senegal", "Entrepreneurship education ecosystems."],
  ["Iyinoluwa Aboyeji (Tech diaspora)", "Nigeria", "Fintech and innovation education expansion."],
  ["Mark Suzman (Tech track)", "USA", "Education technology funding strategy."],
  ["Elon Musk", "South Africa", "Satellite connectivity expanding African internet access."],
];

const TECH_FRIENDS: Row[] = [
  ["Sheikha Moza bint Nasser (Tech track)", "Qatar", "Education Above All digital access and schooling programmes across Africa."],
  ["Satya Nadella", "USA", "Microsoft 4Afrika digital skills programmes."],
  ["Sundar Pichai", "USA", "Google digital training expansion across African countries."],
  ["Sal Khan (Tech track)", "USA", "Free online STEM curriculum widely used in Africa."],
  ["Jack Ma", "China", "Entrepreneurship and digital training initiatives in Africa."],
  ["Mark Zuckerberg", "USA", "Connectivity initiatives supporting online learning."],
  ["Jensen Huang", "USA", "AI ecosystem development influencing digital education globally."],
  ["Eric Schmidt", "USA", "Digital infrastructure support affecting African ecosystems."],
  ["Pierre Omidyar", "USA", "Digital governance and civic tech funding."],
  ["Marc Benioff", "USA", "Cloud infrastructure supporting educational institutions."],
  ["Patrick Collison", "Ireland", "Fintech ecosystem influencing African tech education."],
  ["John Doerr", "USA", "Impact investing in education technology ventures."],
  ["Susan Wojcicki (Posthumous)", "USA", "Educational content accessibility via YouTube."],
  ["Jeff Skoll", "Canada", "Social innovation funding supporting African education ventures."],
  ["Bill Drayton", "USA", "Ashoka Fellows supporting African education innovators."],
  ["Jacqueline Novogratz (Tech track)", "USA", "Invested in African EdTech enterprises."],
  ["Amartya Sen (Tech track)", "India", "Development frameworks influencing education policy."],
  ["Gordon Brown (Tech track)", "UK", "Advocacy for digital learning in crisis regions."],
  ["Julia Gillard (Tech track)", "Australia", "Global funding for technology-enabled education in Africa."],
  ["Bill Gates", "USA", "Major investments in African education systems and digital learning."],
];

export const REFACTORED_ICON_NOMINEES: IconNominee[] = [
  ...build("PHIL-A", "education-philanthropy-icon", "africans-in-africa", PHIL_AFRICA),
  ...build("PHIL-B", "education-philanthropy-icon", "diaspora-africans", PHIL_DIASPORA),
  ...build("PHIL-C", "education-philanthropy-icon", "friends-of-africa", PHIL_FRIENDS),
  ...build("LIT-A", "literary-new-curriculum-advocate", "africans-in-africa", LIT_AFRICA),
  ...build("LIT-B", "literary-new-curriculum-advocate", "diaspora-africans", LIT_DIASPORA),
  ...build("LIT-C", "literary-new-curriculum-advocate", "friends-of-africa", LIT_FRIENDS),
  ...build("TECH-A", "technical-educator-icon", "africans-in-africa", TECH_AFRICA),
  ...build("TECH-B", "technical-educator-icon", "diaspora-africans", TECH_DIASPORA),
  ...build("TECH-C", "technical-educator-icon", "friends-of-africa", TECH_FRIENDS),
];
