// Nigeria's 6 geopolitical zones with their states + FCT.
// Used by the "Excellence in Political Leadership for Education — Nigeria"
// nomination flow (one form, scoped by zone + state).

export interface NigeriaZone {
  slug: string;
  name: string;
  states: { slug: string; name: string }[];
}

const mkState = (name: string) => ({
  slug: name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),
  name,
});

export const NIGERIA_ZONES: NigeriaZone[] = [
  {
    slug: "north-central",
    name: "North Central",
    states: [
      "Benue",
      "Kogi",
      "Kwara",
      "Nasarawa",
      "Niger",
      "Plateau",
      "Federal Capital Territory, Abuja",
    ].map(mkState),
  },
  {
    slug: "north-east",
    name: "North East",
    states: ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"].map(mkState),
  },
  {
    slug: "north-west",
    name: "North West",
    states: [
      "Jigawa",
      "Kaduna",
      "Kano",
      "Katsina",
      "Kebbi",
      "Sokoto",
      "Zamfara",
    ].map(mkState),
  },
  {
    slug: "south-east",
    name: "South East",
    states: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"].map(mkState),
  },
  {
    slug: "south-south",
    name: "South South",
    states: [
      "Akwa Ibom",
      "Bayelsa",
      "Cross River",
      "Delta",
      "Edo",
      "Rivers",
    ].map(mkState),
  },
  {
    slug: "south-west",
    name: "South West",
    states: ["Ekiti", "Lagos", "Ogun", "Ondo", "Osun", "Oyo"].map(mkState),
  },
];

export const NIGERIA_POLITICAL_ROLES: string[] = [
  "Governor",
  "Deputy Governor",
  "Minister",
  "Commissioner for Education",
  "State Universal Basic Education Board leader",
  "Senator",
  "House of Representatives member",
  "State House of Assembly member",
  "Local Government Chairman",
  "Education policy adviser",
  "Public education agency leader",
  "Former political leader with verified education impact",
  "Other political/public sector leader",
];

export const NIGERIA_EDU_IMPACT_SUBCATEGORIES: string[] = [
  "Basic education reform",
  "Secondary education reform",
  "Teacher recruitment and welfare",
  "Teacher training and capacity building",
  "School infrastructure development",
  "Digital education and ICT learning",
  "Girl-child education",
  "Special needs and inclusive education",
  "Technical and vocational education",
  "Education financing and accountability",
  "Out-of-school children intervention",
  "Scholarship and bursary support",
  "Public school renovation",
  "Learning materials and libraries",
  "Education policy implementation",
  "Community education development",
  "Other education leadership impact",
];

export function getNigeriaZone(slug: string): NigeriaZone | undefined {
  return NIGERIA_ZONES.find((z) => z.slug === slug);
}

export function getNigeriaState(zoneSlug: string, stateSlug: string) {
  return getNigeriaZone(zoneSlug)?.states.find((s) => s.slug === stateSlug);
}
