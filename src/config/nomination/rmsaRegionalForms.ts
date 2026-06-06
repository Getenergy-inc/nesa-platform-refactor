// 8 RMSA / EduAid-Africa Regional Special Needs School Google Forms.
// Form URLs are "" with status "Link Pending" until the SCEF / NESA-Africa
// data team creates the Google Form inside the listed Gmail inbox and pastes
// the public + embed URLs here. Flip status to "Active" once both are filled.
//
// See: docs/NOMINATION_FORM_MAPPING.md for the full operational register.

import type { RmsaRegionalForm } from "./types";

const TODAY = "2026-06-06";

export const RMSA_REGIONAL_FORMS: RmsaRegionalForm[] = [
  {
    slug: "west-africa",
    region: "West Africa",
    gmail: "rmsawafricaeduaidafrica@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026–2027 RMSA — West Africa Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Nominate a special needs school in West Africa for EduAid-Africa intervention.",
  },
  {
    slug: "east-africa",
    region: "East Africa",
    gmail: "rmsaeafricaeduaidafrica@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026–2027 RMSA — East Africa Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Nominate a special needs school in East Africa for EduAid-Africa intervention.",
  },
  {
    slug: "central-africa",
    region: "Central Africa",
    gmail: "rmsacafricaeduaidafrica@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026–2027 RMSA — Central Africa Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Nominate a special needs school in Central Africa for EduAid-Africa intervention.",
  },
  {
    slug: "southern-africa",
    region: "Southern Africa",
    gmail: "rmsasafricaeduaidafrica@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026–2027 RMSA — Southern Africa Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Nominate a special needs school in Southern Africa for EduAid-Africa intervention.",
  },
  {
    slug: "north-africa",
    region: "North Africa",
    gmail: "rmsanafricaeduaidafrica@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026–2027 RMSA — North Africa Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Nominate a special needs school in North Africa for EduAid-Africa intervention.",
  },
  {
    slug: "sahel-africa",
    region: "Sahel Africa",
    gmail: "rmsasaheleduaidafrica@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026–2027 RMSA — Sahel Africa Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Nominate a special needs school in the Sahel Region for EduAid-Africa intervention.",
  },
  {
    slug: "horn-of-africa",
    region: "Horn of Africa",
    gmail: "rmsahornafricaeduaidafrica@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026–2027 RMSA — Horn of Africa Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Nominate a special needs school in the Horn of Africa for EduAid-Africa intervention.",
  },
  {
    slug: "indian-ocean-islands",
    region: "Indian Ocean Islands",
    gmail: "rmsaindianoceaneduaidafrica@gmail.com",
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: "NESA 2026–2027 RMSA — Indian Ocean Islands Responses",
    status: "Link Pending",
    lastUpdated: TODAY,
    shortDescription:
      "Nominate a special needs school in the Indian Ocean Islands for EduAid-Africa intervention.",
  },
];

export function getRmsaRegionFormBySlug(
  slug: string,
): RmsaRegionalForm | undefined {
  return RMSA_REGIONAL_FORMS.find((r) => r.slug === slug);
}
