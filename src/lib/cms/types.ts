// CMS content type shapes.
// These are deliberately CMS-agnostic — every adapter normalises
// its native response into these structures so pages don't care
// where the data came from.

export interface PathwayCard {
  id: string;
  category: string;
  headline: string;
  awardLine: string;
  description: string | null;
  accentLabel: string | null;
  cta: string;
  href: string;
  imageUrl: string | null;
  visualGradient: string | null;
  displayOrder: number;
}

export interface AwardCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconName: string | null;
  displayOrder: number;
  /** NESA-Africa 2026 award tier: 1 Blue Garnet · 2 Platinum · 3 Africa Education Icon · 4 Influencers. */
  tier: 1 | 2 | 3 | 4 | null;
  subcategoryCount?: number;
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  categoryId: string;
  categorySlug: string | null;
  displayOrder: number;
}

export interface NomineeSummary {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  organization: string | null;
  country: string | null;
  region: string | null;
  photoUrl: string | null;
  logoUrl: string | null;
  isPlatinum: boolean;
}
