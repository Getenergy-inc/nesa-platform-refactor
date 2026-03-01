export interface NominationCertificateState {
  id: string;
  code: string;
  title: string;
  description: string;

  obtainable: boolean;
  eligible: boolean;
  downloadable: boolean;
  lockedReason?: string;

  fileUrl?: string;
  verificationCode?: string;
  issuedAt?: string;
}

export interface NominationDashboardItem {
  id: string;
  tier: "standard" | "gold" | "platinum";
  voting_status: "pending" | "won" | "lost";
  public_votes: number;
  endorsement_count: number;

  category: string;
  subcategory: string;

  certificates: NominationCertificateState[];
}

export interface NomineeDashboardData {
  id: string;
  name: string;
  slug: string;
  photo_url?: string;
  acceptance_status: string;
  nominations: NominationDashboardItem[];
  referral_code?: string;
}
