/**
 * GFAwzip Wallet — canonical public-facing terminology (2026 cycle).
 *
 * Single source of truth for how the wallet may and may not be described.
 * NESA-Africa 2026 operates with NO public voting, so the wallet is a
 * payment/transaction channel only. Never a voting or ranking mechanism.
 *
 * NOTE: historical/archived AGC ledger records remain untouched for audit
 * integrity — this file governs current-facing copy only.
 */

import { SERVICE_OWNERS } from "@/config/brandHierarchy";

export const WALLET_NAME = "GFAwzip Wallet";
export const WALLET_PROVIDER_URL = "https://www.getfinance.africa";

export const WALLET_TAGLINE =
  "The approved multi-currency payment channel for authorised NESA-Africa, EduAid-Africa and SCEF transactions.";

/** What the wallet IS used for. */
export const WALLET_PAYMENT_PURPOSES = [
  "Sponsorship payments",
  "Merchandise payments",
  "Gala and event payments",
  "Approved programme contributions",
  "Other authorised NESA-Africa transactions",
];

/** What the wallet is explicitly NOT. Render verbatim wherever needed. */
export const WALLET_PROHIBITIONS = [
  "It is not a voting wallet and holds no voting credits.",
  "It is not a nominee-ranking or award-selection mechanism.",
  "It cannot be used to purchase recognition, finalist status or an award.",
  "It cannot influence judges, the NRC, or any assessment outcome.",
];

export const WALLET_SHORT_DISCLAIMER =
  "GFAwzip Wallet is a payment channel only. No voting credits exist and no payment can influence recognition.";

export const WALLET_RECONCILIATION_NOTE =
  "All wallet activity is subject to existing payment, reconciliation and reporting procedures, with a receipt issued for every successful transaction.";

// ── 2026 Recognition Independence ───────────────────────────────────────────

export const RECOGNITION_INDEPENDENCE_2026 = {
  title: "2026 Recognition Independence",
  summary:
    "Recognition at NESA-Africa 2026 is decided by verification, assessment and governance — never by money and never by public vote.",
  statements: [
    "No public voting exists for the 2026 cycle.",
    "No voting credits exist, in any form or under any name.",
    "No payment-to-vote mechanism exists anywhere on this platform.",
    "No wallet or payment activity of any kind can increase a nominee's score, influence assessment, influence NRC verification, influence recognition decisions, or purchase finalist or award status.",
    "Sponsorship, donations, merchandise, ticket and membership payments are commercial or philanthropic transactions only, and are firewalled from nominee assessment.",
  ],
};

// ── Payment path separation (service ownership) ─────────────────────────────

export type PaymentOrgId = "nesa" | "eduaid" | "scef";

export interface PaymentDestination {
  id: PaymentOrgId;
  /** Legal / display name of the organisation actually receiving the payment. */
  payee: string;
  shortName: string;
  /** Prefix applied to the `program` field sent to the payments function. */
  programPrefix: string;
  /** Plain-language description of what this path covers. */
  covers: string[];
  accent: string;
}

const owner = (id: PaymentOrgId) => SERVICE_OWNERS.find((o) => o.id === id);

export const PAYMENT_DESTINATIONS: Record<PaymentOrgId, PaymentDestination> = {
  nesa: {
    id: "nesa",
    payee: owner("nesa")?.name ?? "NESA-Africa",
    shortName: "NESA-Africa",
    programPrefix: "nesa",
    covers: [
      "Gala tickets and events",
      "Merchandise",
      "Sponsorship and partnership",
      "Award-related commercial services",
    ],
    accent: "gold",
  },
  eduaid: {
    id: "eduaid",
    payee: owner("eduaid")?.name ?? "EduAid-Africa",
    shortName: "EduAid-Africa",
    programPrefix: "eduaid",
    covers: [
      "Rebuild My School Africa",
      "Scholarships",
      "School interventions",
      "Education donations",
    ],
    accent: "emerald",
  },
  scef: {
    id: "scef",
    payee: owner("scef")?.name ?? "Santos Creations Educational Foundation",
    shortName: "SCEF",
    programPrefix: "scef",
    covers: [
      "Membership sign-up",
      "Ambassador dues",
      "Local chapter dues",
      "Foundation programmes",
    ],
    accent: "sky",
  },
};

/** Build the `program` code sent to the payments gateway for a given path. */
export function paymentProgram(org: PaymentOrgId, slug: string): string {
  return `${PAYMENT_DESTINATIONS[org].programPrefix}_${slug}`;
}
