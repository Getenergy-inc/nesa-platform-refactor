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
  subcategoryCount?: number;
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
  publicVotes: number;
}
