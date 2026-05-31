export type ProvidusCurrency = "NGN" | "USD" | "GBP" | "EUR";

export interface ProvidusAccount {
  currency: ProvidusCurrency;
  currencyLabel: string;
  accountNumber: string;
  purpose: string;
}

export interface ProvidusQuickAction {
  label: string;
  to?: string;
}

export interface ProvidusAccountGroup {
  id: "scef" | "eduaid" | "nesa" | "gfa";
  shortName: string;
  legalName: string;
  description: string;
  accounts: ProvidusAccount[];
  recommendedUse: string[];
  quickActions: ProvidusQuickAction[];
  primaryCta: { label: string; to: string };
}

export interface PaymentPurpose {
  value: string;
  label: string;
  groupId: ProvidusAccountGroup["id"];
}

export const PAYMENT_PURPOSES: PaymentPurpose[] = [
  { value: "scef-donation", label: "SCEF Donation", groupId: "scef" },
  { value: "membership", label: "Membership", groupId: "scef" },
  { value: "ambassador", label: "Ambassador Registration", groupId: "scef" },
  { value: "local-chapter", label: "Local Chapter Support", groupId: "scef" },
  { value: "advocacy", label: "Advocacy Campaign", groupId: "scef" },
  { value: "eduaid-scholarship", label: "EduAid-Africa Scholarship", groupId: "eduaid" },
  { value: "send-a-child", label: "Send a Child to School", groupId: "eduaid" },
  { value: "rebuild-school", label: "Rebuild My School Africa", groupId: "eduaid" },
  { value: "training", label: "Training / Webinar", groupId: "eduaid" },
  { value: "nesa-sponsorship", label: "NESA-Africa Sponsorship", groupId: "nesa" },
  { value: "gala-ticket", label: "Gala Ticket", groupId: "nesa" },
  { value: "nesa-tv", label: "NESA TV Support", groupId: "nesa" },
  { value: "csr", label: "CSR Partnership", groupId: "nesa" },
];

export const PROVIDUS_ACCOUNT_GROUPS: ProvidusAccountGroup[] = [
  {
    id: "scef",
    shortName: "SCEF Foundation",
    legalName: "Santos Creations Educational Foundation",
    description:
      "General foundation donations, membership, advocacy, local chapters, ESG, health education, teacher wellbeing, volunteers and institutional partnerships.",
    accounts: [
      { currency: "NGN", currencyLabel: "NGN / Naira", accountNumber: "1309631669", purpose: "Main Foundation Account" },
      { currency: "USD", currencyLabel: "USD / US Dollar", accountNumber: "1309632525", purpose: "International Donations & Partnerships" },
      { currency: "GBP", currencyLabel: "GBP / Pound Sterling", accountNumber: "1309632491", purpose: "UK & Global Support" },
      { currency: "EUR", currencyLabel: "EUR / Euro", accountNumber: "1309632501", purpose: "European Donations & Partnerships" },
    ],
    recommendedUse: [
      "Membership fees",
      "Ambassador registration",
      "Advocacy campaigns",
      "Local chapter support",
      "ESG & sustainability programs",
      "Health education advocacy",
    ],
    quickActions: [
      { label: "Pay Membership Fee", to: "/membership" },
      { label: "Support SCEF", to: "/about" },
      { label: "Sponsor Advocacy Campaign", to: "/programs" },
      { label: "Support Local Chapters", to: "/chapters" },
    ],
    primaryCta: { label: "Support SCEF", to: "/about" },
  },
  {
    id: "eduaid",
    shortName: "EduAid-Africa",
    legalName: "EduAid Africa Ltd",
    description:
      "Scholarships, Send a Child to School, Rebuild My School Africa, teacher training, girls education, eLibrary Africa, My Career My Life, and education support programs.",
    accounts: [
      { currency: "NGN", currencyLabel: "NGN / Naira", accountNumber: "1305744507", purpose: "Scholarships & Education Support" },
      { currency: "USD", currencyLabel: "USD / US Dollar", accountNumber: "1307264500", purpose: "International Education Support" },
      { currency: "EUR", currencyLabel: "EUR / Euro", accountNumber: "1307264531", purpose: "European Education Funding" },
      { currency: "GBP", currencyLabel: "GBP / Pound Sterling", accountNumber: "1307264548", purpose: "UK Education Support" },
    ],
    recommendedUse: [
      "Scholarships",
      "Send a Child to School",
      "Teacher training",
      "School rebuilding",
      "Digital learning",
      "eLibrary Africa",
    ],
    quickActions: [
      { label: "Support EduAid-Africa", to: "/programs" },
      { label: "Send a Child to School", to: "/donate" },
      { label: "Adopt a School", to: "/donate" },
      { label: "Sponsor Teacher Training", to: "/programs" },
    ],
    primaryCta: { label: "Support EduAid-Africa", to: "/programs" },
  },
  {
    id: "nesa",
    shortName: "NESA-Africa",
    legalName: "New Education Standards Award",
    description:
      "NESA-Africa sponsorship, Blue Garnet Awards Gala, award nominations, NESA TV, gala tickets, media, CSR awards, and education recognition campaigns.",
    accounts: [
      { currency: "NGN", currencyLabel: "NGN / Naira", accountNumber: "1305476015", purpose: "NESA Operations & Gala" },
      { currency: "USD", currencyLabel: "USD / US Dollar", accountNumber: "1305486988", purpose: "International Sponsorship" },
      { currency: "GBP", currencyLabel: "GBP / Pound Sterling", accountNumber: "1305532926", purpose: "UK Sponsorship & Partnerships" },
      { currency: "EUR", currencyLabel: "EUR / Euro", accountNumber: "1305532933", purpose: "European Sponsorship & Support" },
    ],
    recommendedUse: [
      "NESA-Africa sponsorship",
      "Award gala tickets",
      "Nomination support",
      "Exhibition booths",
      "Media partnerships",
      "NESA TV",
    ],
    quickActions: [
      { label: "Sponsor NESA-Africa", to: "/sponsor" },
      { label: "Buy Gala Ticket", to: "/gala" },
      { label: "Support NESA TV", to: "/nesa-tv" },
      { label: "Partner With NESA-Africa", to: "/partners" },
    ],
    primaryCta: { label: "Sponsor NESA-Africa", to: "/sponsor" },
  },
  {
    id: "gfa",
    shortName: "GFA Wallet / Technology",
    legalName: "GFA WZIP Technology Limited",
    description:
      "Digital infrastructure, wallet systems, voting systems, website platforms, EdTech, API, hosting, and technology support.",
    accounts: [
      { currency: "NGN", currencyLabel: "NGN / Naira", accountNumber: "1308235448", purpose: "Technology & Digital Infrastructure" },
    ],
    recommendedUse: [
      "GFA Wallet systems",
      "Digital learning infrastructure",
      "Website & platform development",
      "Voting systems",
      "API & hosting infrastructure",
      "EdTech innovation",
    ],
    quickActions: [
      { label: "Support Digital Innovation", to: "/programs" },
      { label: "Fund GFA Wallet", to: "/wallet" },
      { label: "Support Platform Development", to: "/programs" },
    ],
    primaryCta: { label: "Support Digital Innovation", to: "/programs" },
  },
];

export const BANK_NAME = "Providus Bank";
