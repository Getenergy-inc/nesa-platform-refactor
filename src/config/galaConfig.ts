/**
 * NESA-Africa Gala 2026 Configuration
 * Typed constants for tickets, donations, and payment methods
 */

// ============== TICKET TIERS ==============

export type TicketTierType = 'GENERAL' | 'PREMIUM' | 'VIP' | 'VVIP';

export interface TicketTier {
  id: TicketTierType;
  name: string;
  price: number;
  currency: string;
  description: string;
  seatingNote: string;
  features: string[];
  maxPerOrder: number;
}

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'GENERAL',
    name: 'General Admission',
    price: 30,
    currency: 'USD',
    description: 'Standard gala entry',
    seatingNote: 'General seating area',
    features: [
      'Gala entry',
      'General seating',
      'Instant QR e-ticket',
      'Digital receipt',
    ],
    maxPerOrder: 10,
  },
  {
    id: 'PREMIUM',
    name: 'Premium Seat',
    price: 60,
    currency: 'USD',
    description: 'Enhanced gala experience',
    seatingNote: 'Priority mid-front seating',
    features: [
      'Gala entry',
      'Priority seating',
      'Welcome drink',
      'Instant QR e-ticket',
      'Digital receipt',
    ],
    maxPerOrder: 8,
  },
  {
    id: 'VIP',
    name: 'VIP Seat',
    price: 120,
    currency: 'USD',
    description: 'VIP privileges & front-row access',
    seatingNote: 'VIP front-row seating',
    features: [
      'Gala entry',
      'VIP front-row seating',
      'VIP lounge access',
      'Complimentary bar',
      'Red carpet photo',
      'Instant QR e-ticket',
      'Digital receipt',
    ],
    maxPerOrder: 6,
  },
  {
    id: 'VVIP',
    name: 'VVIP / Platinum Seat',
    price: 200,
    currency: 'USD',
    description: 'Platinum experience with exclusive perks',
    seatingNote: 'VVIP Platinum front-row reserved',
    features: [
      'Gala entry',
      'VVIP Platinum reserved seating',
      'Exclusive Platinum lounge',
      'Gourmet dinner experience',
      'Unlimited premium bar',
      'Backstage tour',
      'Nominee meet & greet',
      'Luxury gift collection',
      'Instant QR e-ticket',
      'Digital receipt',
    ],
    maxPerOrder: 4,
  },
];

// ============== DONATION CAUSES ==============

export type DonationCauseType = 
  | 'EDUAID_GENERAL'
  | 'REBUILD_MY_SCHOOL'
  | 'SPONSOR_STUDENT'
  | 'TVET_SPONSORSHIP';

export interface DonationCause {
  id: DonationCauseType;
  name: string;
  description: string;
  icon: string;
}

export const DONATION_CAUSES: DonationCause[] = [
  {
    id: 'EDUAID_GENERAL',
    name: 'EduAid-Africa (General Support)',
    description: 'Support educational initiatives across Africa',
    icon: '📚',
  },
  {
    id: 'REBUILD_MY_SCHOOL',
    name: 'Rebuild My School (2026–2027)',
    description: 'NESA-Africa Legacy Project for school reconstruction',
    icon: '🏫',
  },
  {
    id: 'SPONSOR_STUDENT',
    name: 'Sponsor a Student',
    description: 'Fund education for a deserving student',
    icon: '🎓',
  },
  {
    id: 'TVET_SPONSORSHIP',
    name: 'TVET Sponsorship / Grant',
    description: 'Technical and vocational education training support',
    icon: '🔧',
  },
];

// ============== DONATION FREQUENCY ==============

export type DonationFrequencyType = 'ONE_TIME' | 'MONTHLY' | 'CORPORATE';

export interface DonationFrequency {
  id: DonationFrequencyType;
  label: string;
  description: string;
}

export const DONATION_FREQUENCIES: DonationFrequency[] = [
  {
    id: 'ONE_TIME',
    label: 'One-Time',
    description: 'Make a single donation',
  },
  {
    id: 'MONTHLY',
    label: 'Monthly',
    description: 'Continuous monthly giving',
  },
  {
    id: 'CORPORATE',
    label: 'Corporate',
    description: 'Corporate/Partner sponsorship (request invoice/pledge)',
  },
];

// ============== PAYMENT METHODS ==============

export type PaymentMethodType = 
  | 'GFA_WALLET'
  | 'PAYSTACK'
  | 'TRANSACTPAY'
  | 'TAPTAP_SEND'
  | 'ZELLE'
  | 'BANCABLE';

export interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  icon: string;
  available: boolean;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'GFA_WALLET', name: 'GFA Wallet', icon: '💳', available: true },
  { id: 'PAYSTACK', name: 'Paystack', icon: '🏦', available: true },
  { id: 'TRANSACTPAY', name: 'Transactpay', icon: '💵', available: true },
  { id: 'TAPTAP_SEND', name: 'TapTap Send', icon: '📱', available: true },
  { id: 'ZELLE', name: 'Zelle', icon: '💸', available: true },
  { id: 'BANCABLE', name: 'Bancable', icon: '🏧', available: true },
];

// ============== EVENT DETAILS ==============

export const GALA_EVENT = {
  name: 'NESA-Africa Grand Gala Night',
  date: 'June 28, 2026',
  year: 2026,
  time: '18:00 WAT',
  venue: 'International Conference Centre',
  city: 'Abuja, Nigeria',
  dressCode: 'Black Tie / Traditional Formal',
};

// ============== FAQ ==============

export interface FAQItem {
  question: string;
  answer: string;
}

export const GALA_FAQS: FAQItem[] = [
  {
    question: 'Will I receive my ticket immediately?',
    answer: 'Yes — QR e-ticket instantly after successful payment.',
  },
  {
    question: 'Can I donate monthly?',
    answer: 'Yes — choose Monthly continuous donation and select your cause.',
  },
  {
    question: 'Is AGC a cryptocurrency? Can I withdraw it?',
    answer: 'No — AGC is non-tradeable and used only inside the ecosystem. No withdrawals.',
  },
];

// ============== AGC DISCLOSURE ==============

export const AGC_DISCLOSURE = {
  title: 'AfriGold Coins (AGC) Disclosure',
  points: [
    'AGC is not a tradeable coin.',
    'Afri-Gold Coins (AGC) are non-tradeable internal credits used only within the ecosystem for services and records (tickets, receipts, donations).',
    'No cash-out. No withdrawals. No ticket payout.',
  ],
};

// ============== CHECKOUT INFO ==============

export const CHECKOUT_INFO = {
  ticketDeliverables: [
    'Receipt',
    'QR e-ticket (instant)',
  ],
  donationDeliverables: [
    'Receipt/confirmation',
  ],
  monthlyDonorBenefits: [
    'Next charge date shown',
    'Manage/cancel instructions provided',
    'Monthly Fundraising Receipt Report',
  ],
};
