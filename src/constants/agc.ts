/**
 * AGC (Afri Gold Coins) Constants
 * Unified copy and rules for voting credits across the platform
 */

// ============== DISCLAIMERS ==============

export const AGC_NON_TRADEABLE_DISCLAIMER = 
  "AGC is non-tradeable voting credit — no withdrawals, no cash-out, no payouts.";

export const AGC_DISCLAIMER_SHORT = 
  "AGC is NOT tradeable. No withdrawals/payouts/cash-out.";

export const AGC_DISCLAIMER_FULL = [
  "AGC (Afri Gold Coin) is a non-tradeable internal voting credit.",
  "Used only within the NESA-Africa/SCEF ecosystem for voting and participation.",
  "No cash-out. No withdrawals. No payouts. Not a cryptocurrency.",
];

// ============== VOTING COPY ==============

export const VOTING_IS_AGC_ONLY = "Voting uses AGC voting credits. 1 vote = 1 AGC.";

export const VOTING_SERVICES = [
  { name: "NESA-Africa", description: "Awards and platform voting" },
  { name: "Rebuild My School Africa", description: "Vote for priority schools for intervention" },
  { name: "EduAid-Africa", description: "Vote for grant seekers and beneficiaries" },
  { name: "eLibrary Nigeria", description: "Vote/rate books and reviews" },
];

// ============== EARNING METHODS ==============

export const EARN_METHODS = [
  {
    id: "welcome",
    title: "Verify & Claim Welcome Credits",
    description: "Complete your profile verification to claim your welcome bonus AGC.",
    agcReward: 10,
    icon: "Gift",
    action: "claim-welcome",
  },
  {
    id: "daily",
    title: "Daily Check-In",
    description: "Sign in daily to earn +1 AGCc (converts to AGC at 10:1 ratio).",
    agcReward: 0.1,
    icon: "Calendar",
    action: "check-in",
  },
  {
    id: "polls",
    title: "Education Impact Polls",
    description: "Participate in polls and surveys to earn AGC.",
    agcReward: 5,
    icon: "Vote",
    action: "polls",
  },
  {
    id: "referral",
    title: "Invite & Verify",
    description: "Invite friends to join. Earn AGC when they complete their first purchase.",
    agcReward: 15,
    icon: "Users",
    action: "invite",
  },
  {
    id: "nomination",
    title: "Submit Nominations",
    description: "Submit verified nominations to earn +5 AGCc.",
    agcReward: 0.5,
    icon: "Award",
    action: "nominate",
  },
  {
    id: "shop",
    title: "Shop Merchandise",
    description: "Every $1 spent = 5 AGC bonus credited to your wallet.",
    agcReward: 5,
    icon: "ShoppingBag",
    action: "shop",
  },
  {
    id: "ticket",
    title: "Buy Gala Tickets",
    description: "Every $1 ticket purchase = 5 AGC bonus.",
    agcReward: 5,
    icon: "Ticket",
    action: "ticket",
  },
];

// ============== REFERRAL COPY ==============

export const REFERRAL_EARN_COPY = {
  title: "Refer & Earn Voting Credits",
  subtitle: "Share your ticket link. When friends buy, you earn extra AGC.",
  howItWorks: [
    "Get your unique referral link after purchase (or when you sign in).",
    "Share it on WhatsApp, Instagram, X, Facebook, email—anywhere.",
    "When someone buys a ticket using your link, you receive Referral Bonus AGC.",
  ],
  bonusNote: "Referral bonuses are for voting across SCEF services only.",
  disclaimer: "AGC is non-tradeable — no withdrawals, no payouts, no cash-out.",
};

// ============== BONUS RATES ==============

export const AGC_BONUS_RATES = {
  /** AGC per $1 USD spent */
  purchaseBonus: 5,
  /** AGC for referrer on first referred purchase */
  referralFirstPurchase: 15,
  /** AGC for referrer on second referred purchase */
  referralSecondPurchase: 5,
  /** AGCc per daily check-in */
  dailyCheckIn: 1,
  /** AGCc per verified nomination */
  nominationReward: 5,
  /** AGCc to AGC conversion ratio */
  agccToAgcRatio: 10,
};

// ============== CLAIM SOURCES ==============

export const CLAIM_SOURCES = {
  voucher: {
    title: "Claim Voucher Code",
    description: "Enter a voucher code to claim AGC credits.",
  },
  qr: {
    title: "Scan QR Code",
    description: "Scan a sponsor QR code to claim AGC at events.",
  },
  publicPool: {
    title: "Public Voting Pools",
    description: "Check available sponsor-funded voting credits.",
  },
};
