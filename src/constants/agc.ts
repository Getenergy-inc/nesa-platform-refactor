/**
 * GFAwzip Wallet copy constants.
 *
 * Historically these constants carried "AGC / voting credit" language. For the
 * 2026 cycle there is no public voting and no voting credits, so the copy here
 * describes the GFAwzip Wallet strictly as a payment channel. Export names are
 * kept stable so existing consumers keep compiling; archived AGC ledger records
 * are untouched.
 */

import {
  WALLET_NAME,
  WALLET_PAYMENT_PURPOSES,
  WALLET_RECONCILIATION_NOTE,
  WALLET_SHORT_DISCLAIMER,
} from "@/config/walletBranding";

// ============== DISCLAIMERS ==============

export const AGC_NON_TRADEABLE_DISCLAIMER = WALLET_SHORT_DISCLAIMER;

export const AGC_DISCLAIMER_SHORT =
  "Payments only. No voting credits, no cash-out, no payouts.";

export const AGC_DISCLAIMER_FULL = [
  `${WALLET_NAME} is an approved payment and transaction channel for the NESA-Africa, EduAid-Africa and SCEF ecosystem.`,
  `It is used for ${WALLET_PAYMENT_PURPOSES.join(", ").toLowerCase()}.`,
  "It is not a voting wallet, holds no voting credits, and cannot influence assessment, verification or recognition outcomes.",
  WALLET_RECONCILIATION_NOTE,
];

// ============== PAYMENT PATHS ==============

export const PARTICIPATION_IS_AGC_ONLY =
  `${WALLET_NAME} handles payments only. It never influences judging or recognition outcomes.`;

export const PARTICIPATION_SERVICES = [
  { name: "NESA-Africa", description: "Tickets, merchandise, sponsorship and event payments" },
  { name: "EduAid-Africa", description: "Donations to school interventions and scholarships" },
  { name: "Rebuild My School Africa", description: "Donations to priority school interventions (EduAid-Africa)" },
  { name: "SCEF", description: "Membership sign-up, ambassador and chapter dues" },
];

/** @deprecated No voting exists for 2026. Use PARTICIPATION_SERVICES. */
export const VOTING_SERVICES = PARTICIPATION_SERVICES;

// ============== WHAT THE WALLET COVERS ==============

export const EARN_METHODS = [
  {
    id: "tickets",
    title: "Gala & Event Tickets",
    description: "Pay for NESA-Africa gala and event tickets and receive an instant QR e-ticket.",
    agcReward: 0,
    icon: "Ticket",
    action: "ticket",
  },
  {
    id: "shop",
    title: "Merchandise",
    description: "Pay for official NESA-Africa merchandise in your local currency.",
    agcReward: 0,
    icon: "ShoppingBag",
    action: "shop",
  },
  {
    id: "sponsorship",
    title: "Sponsorship & Partnership",
    description: "Settle sponsorship and partnership invoices with full reconciliation records.",
    agcReward: 0,
    icon: "Award",
    action: "sponsor",
  },
  {
    id: "donation",
    title: "EduAid-Africa Donations",
    description: "Donate to Rebuild My School Africa, scholarships and school interventions.",
    agcReward: 0,
    icon: "Heart",
    action: "donate",
  },
  {
    id: "membership",
    title: "SCEF Membership & Dues",
    description: "Pay SCEF membership sign-up, ambassador and local chapter dues.",
    agcReward: 0,
    icon: "Users",
    action: "membership",
  },
];

// ============== REFERRAL COPY ==============

export const REFERRAL_EARN_COPY = {
  title: "Share Your Ticket Link",
  subtitle: "Invite others to attend. Your link tracks attendance, not recognition.",
  howItWorks: [
    "Get your unique referral link after purchase (or when you sign in).",
    "Share it on WhatsApp, Instagram, X, Facebook, email—anywhere.",
    "Track how many people joined the gala through your link.",
  ],
  bonusNote: "Referral links are for attendance and outreach tracking only.",
  disclaimer: WALLET_SHORT_DISCLAIMER,
};

// ============== BONUS RATES (retained for legacy ledger reads) ==============

export const AGC_BONUS_RATES = {
  purchaseBonus: 0,
  referralFirstPurchase: 0,
  referralSecondPurchase: 0,
  dailyCheckIn: 0,
  nominationReward: 0,
  agccToAgcRatio: 10,
};

// ============== CLAIM SOURCES ==============

export const CLAIM_SOURCES = {
  voucher: {
    title: "Redeem Voucher Code",
    description: "Enter a sponsor voucher code to apply credit against an authorised payment.",
  },
  qr: {
    title: "Scan QR Code",
    description: "Scan an event QR code to complete an authorised payment at venue.",
  },
  publicPool: {
    title: "Sponsor-Funded Programmes",
    description: "See which programme costs sponsors have already covered.",
  },
};
