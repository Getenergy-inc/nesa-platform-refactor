// D1 (Hybrid) — single source of truth for tier vocabulary.
//
// Internal slugs stay Set B (matches DB enums, recognition2026 config,
// existing route params) so no migration risk. Public copy uses Set A
// wording everywhere the user sees text.
//
// Rule for every UI surface (nav, footer, hero, forms, dashboards,
// cards, badges, breadcrumbs):
//     import { getTierLabel, TIER_NAMING } from "@/config/tierNaming";
//     <span>{getTierLabel("gold-blue-garnet").public}</span>
//
// Never hardcode "Gold-Blue Garnet" / "Platinum" / "Influencer Education
// Impact" in a component. The banned-strings CI check will flag it.

export type TierSlug =
  | "africa-education-icon"
  | "influencer-education-impact"
  | "platinum"
  | "gold-blue-garnet";

export interface TierNaming {
  /** Set B slug used in URLs, DB enums, code. Never change. */
  slug: TierSlug;
  /** Set A public label shown to users. */
  public: string;
  /** Short chip/pill label (≤ 22 chars). */
  short: string;
  /** One-line descriptor for hover/aria. */
  descriptor: string;
  /** Competitive flagship vs. non-competitive Certificate of Recognition. */
  isFlagship: boolean;
}

export const TIER_NAMING: Record<TierSlug, TierNaming> = {
  "africa-education-icon": {
    slug: "africa-education-icon",
    public: "Africa Education Icon",
    short: "Icon",
    descriptor: "Competitive flagship — once-in-a-lifetime honour",
    isFlagship: true,
  },
  "influencer-education-impact": {
    slug: "influencer-education-impact",
    // Set A wording — Recognition of Service framing
    public: "Influencer Recognition of Service",
    short: "Influencer",
    descriptor: "Certificate of Recognition · public figures enabling education",
    isFlagship: false,
  },
  platinum: {
    slug: "platinum",
    // Set A wording — CSR / EduTech framing
    public: "CSR for Education & EduTech",
    short: "CSR & EduTech",
    descriptor: "Certificate of Recognition · corporate & technology enablers",
    isFlagship: false,
  },
  "gold-blue-garnet": {
    slug: "gold-blue-garnet",
    // Set A wording — Bilateral & International framing
    public: "Bilateral & International Recognition",
    short: "Bilateral & International",
    descriptor: "Certificate of Recognition · cross-border education partnerships",
    isFlagship: false,
  },
};

export function getTierLabel(slug: TierSlug): TierNaming {
  return TIER_NAMING[slug];
}

export function listTiers(): TierNaming[] {
  return [
    TIER_NAMING["africa-education-icon"],
    TIER_NAMING["influencer-education-impact"],
    TIER_NAMING.platinum,
    TIER_NAMING["gold-blue-garnet"],
  ];
}

/**
 * Legacy label → canonical slug. Use during the rename sweep to migrate
 * any remaining hardcoded Set-B strings without breaking existing links.
 */
export const LEGACY_LABEL_TO_SLUG: Record<string, TierSlug> = {
  "africa education icon": "africa-education-icon",
  "icon": "africa-education-icon",
  "influencer education impact": "influencer-education-impact",
  "influencer recognition of service": "influencer-education-impact",
  "platinum": "platinum",
  "csr for education & edutech": "platinum",
  "gold-blue garnet": "gold-blue-garnet",
  "gold blue garnet": "gold-blue-garnet",
  "bilateral & international recognition": "gold-blue-garnet",
};
