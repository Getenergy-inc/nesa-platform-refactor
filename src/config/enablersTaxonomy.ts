// Education Enablers taxonomy — RECs, sectors, EdTech subcategories.
// Feeds the desktop mega menu and the mobile accordion drawer.

export interface TaxonomyItem {
  slug: string;
  label: string;
  href: string;
  description?: string;
}

// 8 African Regional Economic Communities.
export const RECS: TaxonomyItem[] = [
  { slug: "amu", label: "AMU — Arab Maghreb Union", href: "/education-enablers/regions/amu" },
  { slug: "cen-sad", label: "CEN-SAD — Community of Sahel-Saharan States", href: "/education-enablers/regions/cen-sad" },
  { slug: "comesa", label: "COMESA — Common Market for Eastern & Southern Africa", href: "/education-enablers/regions/comesa" },
  { slug: "eac", label: "EAC — East African Community", href: "/education-enablers/regions/eac" },
  { slug: "eccas", label: "ECCAS — Economic Community of Central African States", href: "/education-enablers/regions/eccas" },
  { slug: "ecowas", label: "ECOWAS — Economic Community of West African States", href: "/education-enablers/regions/ecowas" },
  { slug: "igad", label: "IGAD — Intergovernmental Authority on Development", href: "/education-enablers/regions/igad" },
  { slug: "sadc", label: "SADC — Southern African Development Community", href: "/education-enablers/regions/sadc" },
];

// 20 sectors — full framework surfaces on `/education-enablers/sectors`.
export const SECTORS: TaxonomyItem[] = [
  { slug: "banking-financial-services", label: "Banking & Financial Services", href: "/education-enablers/sectors/banking-financial-services" },
  { slug: "insurance-reinsurance", label: "Insurance & Reinsurance", href: "/education-enablers/sectors/insurance-reinsurance" },
  { slug: "telecommunications", label: "Telecommunications", href: "/education-enablers/sectors/telecommunications" },
  { slug: "information-technology-software", label: "Information Technology & Software", href: "/education-enablers/sectors/information-technology-software" },
  { slug: "aviation-airports", label: "Aviation & Airports", href: "/education-enablers/sectors/aviation-airports" },
  { slug: "maritime-ports-shipping", label: "Maritime, Ports & Shipping", href: "/education-enablers/sectors/maritime-ports-shipping" },
  { slug: "logistics-transportation", label: "Logistics & Transportation", href: "/education-enablers/sectors/logistics-transportation" },
  { slug: "food-beverages", label: "Food & Beverages", href: "/education-enablers/sectors/food-beverages" },
  { slug: "agriculture-agribusiness", label: "Agriculture & Agribusiness", href: "/education-enablers/sectors/agriculture-agribusiness" },
  { slug: "oil-gas-renewable-energy", label: "Oil, Gas & Renewable Energy", href: "/education-enablers/sectors/oil-gas-renewable-energy" },
  { slug: "mining-natural-resources", label: "Mining & Natural Resources", href: "/education-enablers/sectors/mining-natural-resources" },
  { slug: "cement-construction-infrastructure", label: "Cement, Construction & Infrastructure", href: "/education-enablers/sectors/cement-construction-infrastructure" },
  { slug: "automotive-mobility", label: "Automotive & Mobility", href: "/education-enablers/sectors/automotive-mobility" },
  { slug: "media-broadcasting-entertainment", label: "Media, Broadcasting & Entertainment", href: "/education-enablers/sectors/media-broadcasting-entertainment" },
  { slug: "healthcare-pharmaceuticals", label: "Healthcare & Pharmaceuticals", href: "/education-enablers/sectors/healthcare-pharmaceuticals" },
  { slug: "retail-ecommerce", label: "Retail & E-commerce", href: "/education-enablers/sectors/retail-ecommerce" },
  { slug: "hospitality-tourism-real-estate", label: "Hospitality, Tourism & Real Estate", href: "/education-enablers/sectors/hospitality-tourism-real-estate" },
  { slug: "professional-consulting-services", label: "Professional & Consulting Services", href: "/education-enablers/sectors/professional-consulting-services" },
  { slug: "manufacturing-industrial-services", label: "Manufacturing & Industrial Services", href: "/education-enablers/sectors/manufacturing-industrial-services" },
  { slug: "foundations-corporate-philanthropy", label: "Foundations & Corporate Philanthropy", href: "/education-enablers/sectors/foundations-corporate-philanthropy" },
];

// Featured sectors surfaced in the desktop mega-menu column.
export const FEATURED_SECTOR_SLUGS = [
  "banking-financial-services",
  "telecommunications",
  "information-technology-software",
  "agriculture-agribusiness",
  "healthcare-pharmaceuticals",
  "media-broadcasting-entertainment",
  "oil-gas-renewable-energy",
  "foundations-corporate-philanthropy",
];

export const FEATURED_SECTORS = SECTORS.filter((s) => FEATURED_SECTOR_SLUGS.includes(s.slug));

// EdTech Education Enablers — 4 subcategories.
export const EDTECH_SUBCATS: TaxonomyItem[] = [
  { slug: "digital-learning-platforms", label: "Digital Learning Platforms & LMS", href: "/education-enablers/edtech/digital-learning-platforms" },
  { slug: "ai-adaptive-learning", label: "AI & Adaptive Learning", href: "/education-enablers/edtech/ai-adaptive-learning" },
  { slug: "teacher-digital-empowerment", label: "Teacher Digital Empowerment", href: "/education-enablers/edtech/teacher-digital-empowerment" },
  { slug: "infrastructure-connectivity", label: "Learning Infrastructure & Connectivity", href: "/education-enablers/edtech/infrastructure-connectivity" },
];

// Enabler action links (right column of the mega menu).
export const ENABLER_ACTIONS: TaxonomyItem[] = [
  { slug: "nominate", label: "Nominate an Education Enabler", href: "/nominate" },
  { slug: "claim-profile", label: "Claim or Update an Organisation Profile", href: "/education-enablers/claim-profile" },
  { slug: "submit-evidence", label: "Submit Programme Evidence", href: "/education-enablers/submit-evidence" },
  { slug: "verification", label: "Become a Verified Education Enabler", href: "/education-enablers/verification" },
  { slug: "partner", label: "Partner with NESA-Africa", href: "/get-involved/partner" },
];
