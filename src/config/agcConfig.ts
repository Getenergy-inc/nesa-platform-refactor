/**
 * NESA-Africa AGC (Afri Gold Coin) Configuration
 * 
 * Types and constants for the AGC voting credit system.
 */

// ============================================================================
// AGC TYPES
// ============================================================================

export type AGCSource = 
  | 'DAILY_SIGNIN'
  | 'NOMINATION_VERIFIED'
  | 'REFERRAL_SIGNUP'
  | 'REFERRAL_FIRST_PAYMENT'
  | 'REFERRAL_SECOND_PAYMENT'
  | 'WATCH_TV'
  | 'SOCIAL_SHARE'
  | 'SPONSOR_FUNDED'
  | 'CONVERSION'
  | 'VOTE_SPEND'
  | 'ADMIN_BONUS';

export type AGCTransactionType = 'EARN' | 'CONVERT' | 'SPEND' | 'ADJUSTMENT' | 'REVERSAL';

export type VotingPhase = 'GOLD_CERTIFICATE' | 'BLUE_GARNET';

export interface AGCEarningMethod {
  id: string;
  source: AGCSource;
  title: string;
  description: string;
  reward: string;
  rewardAgcc: number;
  icon: string;
  isActive: boolean;
}

export interface VotingPhaseConfig {
  id: VotingPhase;
  name: string;
  description: string;
  votingWeight: {
    public: number;
    jury: number;
  };
  dates: {
    votingOpens: string;
    votingCloses: string;
    resultsDate: string;
  };
}

export interface AGCFAQ {
  question: string;
  answer: string;
}

// ============================================================================
// VOTING CALENDAR 2026
// ============================================================================

export const PROGRAMME_TIMELINE_2026 = [
  {
    id: 'nrc-review',
    phase: 'NRC Nominee Review',
    period: '1 Feb – 31 Mar 2026',
    description: 'Nominee Research Corps verifies all nominations for eligibility and governance compliance',
    status: 'upcoming' as const,
  },
  {
    id: 'jury-selection',
    phase: 'Jury Selection',
    period: 'Feb – Mar 2026',
    description: 'Applications reviewed and independent jury members selected',
    status: 'upcoming' as const,
  },
  {
    id: 'platinum-show',
    phase: 'Platinum Recognition Show',
    period: '28 February 2026',
    description: '3-hour TV Show — Non-competitive baseline recognition of service',
    status: 'upcoming' as const,
  },
  {
    id: 'icon-show',
    phase: 'Africa Education Icon Show',
    period: '28 March 2026',
    description: '3-hour TV Show — Lifetime impact recognition (9 Icons)',
    status: 'upcoming' as const,
  },
  {
    id: 'jury-onboarding',
    phase: 'Jury Onboarding',
    period: 'April 2026',
    description: 'Selected jury members complete orientation and training',
    status: 'upcoming' as const,
  },
  {
    id: 'gold-voting',
    phase: 'Gold Certificate Voting',
    period: '10 Apr – 16 May 2026',
    description: '100% public voting across 135 sub-categories — Top 3 winners each (405 Gold Certificate winners)',
    status: 'upcoming' as const,
    votingPhase: 'GOLD_CERTIFICATE' as VotingPhase,
  },
  {
    id: 'gold-show',
    phase: 'Gold Certificate Winners Show',
    period: '17 May 2026',
    description: '3-hour TV Show — 405 Gold Certificate winners announced',
    status: 'upcoming' as const,
  },
  {
    id: 'blue-garnet-voting',
    phase: 'Blue Garnet Award Voting',
    period: '18 May – 17 Jun 2026',
    description: '40% public vote + 60% independent jury review',
    status: 'upcoming' as const,
    votingPhase: 'BLUE_GARNET' as VotingPhase,
  },
  {
    id: 'blue-garnet-gala',
    phase: 'Blue Garnet Awards Gala',
    period: '27 June 2026',
    description: 'Grand ceremony in Lagos + live broadcast — 9 Blue Garnet Award winners',
    status: 'upcoming' as const,
  },
  {
    id: 'rmsa-launch',
    phase: 'Rebuild My School Africa',
    period: 'Jun 2026 – Jun 2027',
    description: 'Legacy phase: 5 Special Needs facilities across African regions',
    status: 'upcoming' as const,
  },
];

export const VOTING_PHASES: VotingPhaseConfig[] = [
  {
    id: 'GOLD_CERTIFICATE',
    name: 'Gold Certificate Phase',
    description: 'Public Voting Only',
    votingWeight: {
      public: 100,
      jury: 0,
    },
    dates: {
      votingOpens: '2026-04-10',
      votingCloses: '2026-05-16',
      resultsDate: '2026-05-17',
    },
  },
  {
    id: 'BLUE_GARNET',
    name: 'Blue Garnet Award Phase',
    description: 'Public + Jury',
    votingWeight: {
      public: 40,
      jury: 60,
    },
    dates: {
      votingOpens: '2026-05-18',
      votingCloses: '2026-06-17',
      resultsDate: '2026-06-27',
    },
  },
];

export const GALA_DATE = '2026-06-27';
export const GALA_WEEKEND = 'June 27–28, 2026';

// ============================================================================
// CONVERSION RULES
// ============================================================================

export const AGC_CONVERSION_RATE = 10; // 10 AGCc = 1 AGC
export const DEFAULT_VOTE_COST_AGC = 1; // 1 AGC per vote

// ============================================================================
// EARNING METHODS
// ============================================================================

export const AGC_EARNING_METHODS: AGCEarningMethod[] = [
  {
    id: 'daily_signin',
    source: 'DAILY_SIGNIN',
    title: 'Daily Sign-In Reward',
    description: 'Sign in daily to earn AGCc. 10 AGCc auto-converts to 1 AGC.',
    reward: '+1 AGCc per day',
    rewardAgcc: 1,
    icon: 'Calendar',
    isActive: true,
  },
  {
    id: 'nomination',
    source: 'NOMINATION_VERIFIED',
    title: 'Verified Nomination',
    description: 'Every successful nomination earns AGCc. Nomination must be valid—duplicate or rejected nominations earn no AGCc.',
    reward: '+2 AGCc per nomination',
    rewardAgcc: 2,
    icon: 'Trophy',
    isActive: true,
  },
  {
    id: 'signup_verification',
    source: 'REFERRAL_SIGNUP',
    title: 'Signup & Verification Bonus',
    description: 'Earn AGCc when you create an account, verify your email, and verify your phone number.',
    reward: '+2 AGCc on verification',
    rewardAgcc: 2,
    icon: 'UserCheck',
    isActive: true,
  },
  {
    id: 'referral_first',
    source: 'REFERRAL_FIRST_PAYMENT',
    title: 'First Paid Support Referral',
    description: 'Earn AGC when a referred user completes their first successful payment.',
    reward: '+3 AGC',
    rewardAgcc: 30,
    icon: 'Users',
    isActive: true,
  },
  {
    id: 'referral_second',
    source: 'REFERRAL_SECOND_PAYMENT',
    title: 'Second Paid Support Referral',
    description: 'Earn AGC from the second paid support referral.',
    reward: '+1 AGC',
    rewardAgcc: 10,
    icon: 'UserPlus',
    isActive: true,
  },
  {
    id: 'watch_earn',
    source: 'WATCH_TV',
    title: 'Watch & Earn (NESA Africa TV)',
    description: 'Earn AGCc by watching award shows, results shows, and nominee spotlight videos. Sessions are verified to prevent abuse.',
    reward: '+1 AGCc per session',
    rewardAgcc: 1,
    icon: 'Tv',
    isActive: true,
  },
  {
    id: 'social_sharing',
    source: 'SOCIAL_SHARE',
    title: 'Social Sharing & Campaign Engagement',
    description: 'Share official links using your referral link. Earn AGCc for verified engagement. Anti-fraud systems apply.',
    reward: '+1 AGCc per engagement',
    rewardAgcc: 1,
    icon: 'Share2',
    isActive: true,
  },
  {
    id: 'sponsor_funded',
    source: 'SPONSOR_FUNDED',
    title: 'Sponsor-Funded AGC',
    description: 'Sponsors may fund public voting credits through Sponsor Referral Links. Users claim sponsor-provided AGC for voting only.',
    reward: 'Varies by sponsor',
    rewardAgcc: 0,
    icon: 'Gift',
    isActive: true,
  },
];

// ============================================================================
// AGC RULES (IMPORTANT NOTICES)
// ============================================================================

export const AGC_RULES = [
  'AGC is not money',
  'No cash-out',
  'No transfer between users',
  'No withdrawals',
  'No trading or resale',
  'AGC exists only to support fair, verified, and transparent voting',
];

export const AGC_QUICK_SUMMARY = [
  { label: 'Daily sign-in', value: '+1 AGCc' },
  { label: 'Every nomination', value: '+2 AGCc' },
  { label: 'Conversion rate', value: '10 AGCc = 1 AGC' },
  { label: 'AGC usage', value: 'Voting only' },
  { label: 'Cash-out', value: 'Not allowed' },
  { label: 'Transfers', value: 'Not allowed' },
];

// ============================================================================
// FAQs
// ============================================================================

export const AGC_FAQS: AGCFAQ[] = [
  {
    question: 'Will I receive my ticket immediately?',
    answer: 'Yes—QR e-ticket instantly after successful payment.',
  },
  {
    question: 'Can I donate monthly?',
    answer: 'Yes—choose Monthly continuous donation and select your cause.',
  },
  {
    question: 'Is AGC a cryptocurrency? Can I withdraw it?',
    answer: 'No—AGC is non-tradeable and used only inside the ecosystem. No withdrawals.',
  },
  {
    question: 'What is the difference between AGCc and AGC?',
    answer: 'AGCc (Afri Gold Coin cents) is earned through daily activity and converts automatically to AGC at a rate of 10 AGCc = 1 AGC. Only AGC can be used for voting.',
  },
  {
    question: 'How do I earn AGC?',
    answer: 'You can earn AGCc through daily sign-ins, submitting nominations, referrals, watching NESA Africa TV, and social sharing. AGCc converts to AGC automatically.',
  },
  {
    question: 'What happens if I abuse the system?',
    answer: 'All AGC activities are logged, verified, and monitored. Abuse, duplication, or manipulation results in disqualification and your votes will be voided.',
  },
  {
    question: 'Can sponsors influence voting?',
    answer: 'No—sponsors, partners, and advertisers do not influence winners. Voting integrity is protected.',
  },
  {
    question: 'When can I vote?',
    answer: 'Voting is only available during active voting windows. Gold Certificate Phase: April 10 – May 16, 2026. Blue Garnet Award Phase: May 18 – June 17, 2026.',
  },
];

// ============================================================================
// PRIMARY ACTIONS
// ============================================================================

export const AGC_PRIMARY_ACTIONS = [
  { label: 'Create Account', href: '/register', variant: 'default' as const },
  { label: 'Earn AGC', href: '/about-agc#earn', variant: 'outline' as const },
  { label: 'Vote Now', href: '/vote-with-agc#vote', variant: 'default' as const },
  { label: 'View Voting Calendar', href: '/vote-with-agc#calendar', variant: 'outline' as const },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format AGCc amount
 */
export function formatAgcc(amount: number): string {
  return `${amount.toLocaleString()} AGCc`;
}

/**
 * Format AGC amount
 */
export function formatAgc(amount: number): string {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} AGC`;
}

/**
 * Convert AGCc to AGC
 */
export function convertAgccToAgc(agcc: number): number {
  return Math.floor(agcc / AGC_CONVERSION_RATE);
}

/**
 * Get current voting phase based on date
 */
export function getCurrentVotingPhase(date: Date = new Date()): VotingPhaseConfig | null {
  const dateStr = date.toISOString().split('T')[0];
  
  for (const phase of VOTING_PHASES) {
    if (dateStr >= phase.dates.votingOpens && dateStr <= phase.dates.votingCloses) {
      return phase;
    }
  }
  
  return null;
}

/**
 * Check if voting is currently open
 */
export function isVotingOpen(date: Date = new Date()): boolean {
  return getCurrentVotingPhase(date) !== null;
}

/**
 * Get next voting phase
 */
export function getNextVotingPhase(date: Date = new Date()): VotingPhaseConfig | null {
  const dateStr = date.toISOString().split('T')[0];
  
  for (const phase of VOTING_PHASES) {
    if (dateStr < phase.dates.votingOpens) {
      return phase;
    }
  }
  
  return null;
}

/**
 * Get earning method by source
 */
export function getEarningMethodBySource(source: AGCSource): AGCEarningMethod | undefined {
  return AGC_EARNING_METHODS.find(m => m.source === source);
}
