// Africa regional zones used by Africa Regional award nomination forms.
//
// Each Africa Regional category is split into 5 region-specific forms so that
// nominators only see countries and subcategories from their own region.
// See addendum prompt §1–§8 and the audit table in
// /mnt/documents/africa_regional_form_audit.md.

export interface AfricaRegionDef {
  /** kebab-case slug used in ?region= query */
  slug: string;
  /** Display region name */
  name: string;
  /** Country dropdown for the region */
  countries: string[];
}

export const AFRICA_REGIONS: AfricaRegionDef[] = [
  {
    slug: "north-africa",
    name: "North Africa",
    countries: [
      "Algeria",
      "Egypt",
      "Libya",
      "Morocco",
      "Tunisia",
      "Western Sahara / Sahrawi Arab Democratic Republic",
    ],
  },
  {
    slug: "west-africa",
    name: "West Africa",
    countries: [
      "Benin",
      "Burkina Faso",
      "Cabo Verde",
      "Côte d’Ivoire",
      "The Gambia",
      "Ghana",
      "Guinea",
      "Guinea-Bissau",
      "Liberia",
      "Mali",
      "Mauritania",
      "Niger",
      "Nigeria",
      "Senegal",
      "Sierra Leone",
      "Togo",
    ],
  },
  {
    slug: "east-africa",
    name: "East Africa",
    countries: [
      "Burundi",
      "Comoros",
      "Djibouti",
      "Eritrea",
      "Ethiopia",
      "Kenya",
      "Rwanda",
      "Seychelles",
      "Somalia",
      "South Sudan",
      "Tanzania",
      "Uganda",
    ],
  },
  {
    slug: "central-africa",
    name: "Central Africa",
    countries: [
      "Cameroon",
      "Central African Republic",
      "Chad",
      "Republic of the Congo",
      "Democratic Republic of the Congo",
      "Equatorial Guinea",
      "Gabon",
      "São Tomé and Príncipe",
    ],
  },
  {
    slug: "southern-africa",
    name: "Southern Africa",
    countries: [
      "Angola",
      "Botswana",
      "Eswatini",
      "Lesotho",
      "Madagascar",
      "Malawi",
      "Mauritius",
      "Mozambique",
      "Namibia",
      "South Africa",
      "Zambia",
      "Zimbabwe",
    ],
  },
];

export function getAfricaRegion(slug: string): AfricaRegionDef | undefined {
  return AFRICA_REGIONS.find((r) => r.slug === slug);
}
