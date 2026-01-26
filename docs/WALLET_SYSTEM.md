# NESA-Africa Identity, RBAC & GFA Wallet System

## Overview

This document describes the database schema, RBAC model, and GFA (Golden AfriCoin) Wallet system for the NESA-Africa platform.

## Core Principles

1. **Identity**: Every user has an `auth.users` record and a `profiles` row
2. **RBAC**: Roles define access; users can have multiple roles with optional scope
3. **Stage Gating**: Actions (nomination/voting/certificates) are enabled/disabled by season config
4. **Non-Custodial Wallet**: Record ledger entries and gateway references; no internal stored-value custody

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profile data linked to `auth.users` |
| `roles` | Reference table for role definitions |
| `user_roles` | User-to-role assignments with optional chapter scope |
| `chapters` | Local chapters with referral codes |
| `wallet_accounts` | Wallet accounts for users, chapters, and platform |
| `wallet_ledger_entries` | Source of truth for all balance changes |
| `wallet_balances` | Computed view of account balances |
| `payment_intents` | Payment gateway transaction records |
| `referrals` | User/chapter referral codes |
| `referral_events` | Referral activity tracking |
| `revenue_splits` | Admin-configured revenue distribution |
| `disbursement_runs` | Periodic disbursement batches |
| `disbursement_lines` | Individual disbursement line items |
| `seasons` | Season config with stage gating flags |

### Enums

```sql
-- Wallet
wallet_owner_type: USER, CHAPTER, PLATFORM
wallet_entry_type: TOPUP, NOMINATION_FEE, VOTE_FEE, DONATION, TICKET, 
                   REFERRAL_BONUS, AMBASSADOR_BONUS, CHAPTER_BONUS,
                   WITHDRAW_REQUEST, WITHDRAW_APPROVED, ADJUSTMENT
wallet_direction: CREDIT, DEBIT

-- Payments
payment_provider: PAYSTACK, FLUTTERWAVE, LEMFI, TAPTAPSEND
payment_status: INITIATED, PENDING, SUCCESS, FAILED, CANCELLED

-- Referrals
referral_owner_type: USER, CHAPTER
referral_event_type: SIGNUP, NOMINATION_PAID, VOTE_PAID, DONATION, TICKET

-- Admin
disbursement_status: DRAFT, COMPLETED, FAILED

-- Roles
role_code: USER, NOMINEE, AMBASSADOR, OLC_COORDINATOR, NRC, JURY, SPONSOR, ADMIN, SUPER_ADMIN
```

## Identity Flow

### On Signup
1. Auth trigger creates `profiles` row with user data
2. `handle_new_user()` creates `user_roles` entry with `role = 'user'`
3. `handle_new_user_wallet()` trigger:
   - Creates `wallet_accounts` row (owner_type = 'USER')
   - Generates unique referral code
   - Creates `referrals` row
   - Sets `role_code = 'USER'` on user_roles

### OLC Coordinator Flow
1. Admin creates chapter with coordinator assignment
2. `handle_new_chapter_wallet()` trigger:
   - Creates `wallet_accounts` row (owner_type = 'CHAPTER')
   - Generates chapter referral code
   - Creates `referrals` row

## RBAC Enforcement

### RLS Policies
- Users can read/update their own profile
- Users can read only their wallet account + ledger entries
- Chapter coordinators can view their chapter wallet
- Admins can read/write all data

### Server-Side Guards
Use the `has_role()` and `has_role_code()` functions:

```sql
-- Check existing app_role
SELECT has_role(auth.uid(), 'admin'::app_role);

-- Check new role_code
SELECT has_role_code(auth.uid(), 'SUPER_ADMIN'::role_code);
```

## Wallet System

### Balance Buckets
- **agc_total**: Total AGC balance
- **agc_withdrawable**: AGC that can be withdrawn
- **agc_non_withdrawable**: AGC locked (e.g., promotional credits)
- **agc_bonus**: Bonus AGC from referrals/promotions
- **usd_balance**: USD equivalent

### Entry Types
| Type | Direction | Withdrawable | Description |
|------|-----------|--------------|-------------|
| TOPUP | CREDIT | Yes | User deposits via payment gateway |
| NOMINATION_FEE | DEBIT | - | Nomination submission fee |
| VOTE_FEE | DEBIT | - | Voting fee |
| DONATION | DEBIT | - | Donation to platform programs |
| TICKET | DEBIT | - | Event ticket purchase |
| REFERRAL_BONUS | CREDIT | Yes | Bonus for referrals |
| AMBASSADOR_BONUS | CREDIT | Yes | Ambassador program bonus |
| CHAPTER_BONUS | CREDIT | Yes | Chapter performance bonus |
| WITHDRAW_REQUEST | DEBIT | - | Pending withdrawal |
| WITHDRAW_APPROVED | DEBIT | - | Approved withdrawal |
| ADJUSTMENT | CREDIT/DEBIT | Varies | Admin adjustment |

### Payment Providers
- Paystack (Nigeria)
- Flutterwave (Pan-African)
- LemFi (International)
- TapTapSend (Remittance)

## API Endpoints

### Wallet Edge Function (`/wallet`)

```
GET  /wallet/me              - Get user's wallet + balance
GET  /wallet/dashboard       - Full dashboard data
GET  /wallet/ledger          - Ledger entries (paginated)
POST /wallet/topup           - Initialize top-up payment
GET  /wallet/referral        - User's referral info
GET  /wallet/referral/lookup/:code - Public code validation

# Admin
POST /wallet/admin/credit    - Credit a wallet
POST /wallet/admin/debit     - Debit a wallet
GET  /wallet/admin/accounts  - List all wallets
GET  /wallet/admin/platform  - Platform wallet
```

## TypeScript Types

Import types from `src/types/wallet.ts`:

```typescript
import type {
  WalletAccount,
  WalletBalance,
  WalletLedgerEntry,
  PaymentIntent,
  Referral,
  ReferralEvent,
  RoleCode,
} from '@/types/wallet';
```

## Frontend API Client

Import from `src/api/wallet.ts`:

```typescript
import {
  getMyWallet,
  getWalletDashboard,
  getMyLedgerEntries,
  initTopup,
  getMyReferral,
  formatAgc,
  formatUsd,
} from '@/api/wallet';
```

## Revenue Splits

Default configuration (100% total):
- NESA Platform: 40%
- EduAid-Africa: 20%
- Rebuild My School Africa: 15%
- CVO Fund: 10%
- Admin Costs: 10%
- Chapter Pool: 5%

## Stage Gating

Season table now includes:
- `nomination_open` - Allow nominations
- `gold_voting_open` - Allow Gold voting
- `blue_garnet_open` - Allow Blue Garnet voting
- `certificate_download_open` - Allow certificate downloads
- `config` - JSONB for additional settings

Check stage status:
```sql
SELECT is_stage_open('nominations'::stage_action);
```

Or use new season flags:
```sql
SELECT nomination_open FROM seasons WHERE is_active = true;
```

## Security Notes

1. All wallet tables have RLS enabled
2. Ledger entries are append-only (no UPDATE/DELETE policies for users)
3. Balance is computed from ledger, never stored directly
4. Payment intents track all gateway interactions
5. Audit logs record all admin actions
