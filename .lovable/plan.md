

# Refactor Wallet: Remove Withdrawable/Non-withdrawable Split

## What Changes

Remove the separate "Withdrawable" and "Non-withdrawable" balance displays from the wallet UI across all components. The total AGC balance already covers this, so these granular breakdowns will be removed.

## Files to Modify

### 1. `src/pages/Wallet.tsx` (lines 159-166)
- Remove the two grid cells showing "Non-Withdrawable" and "Withdrawable" separately
- Keep the "Bonus AGC" and "USD Balance" cells
- Adjust grid from `grid-cols-2 md:grid-cols-4` to `grid-cols-2` (or `grid-cols-3` if another metric is added)

### 2. `src/components/dashboard/wallet/AGCSummaryCard.tsx` (lines 58-82)
- Remove the "Withdrawable" SummaryItem (with Unlock icon)
- Remove the "Non-withdrawable" SummaryItem (with Lock icon)
- Keep "Bonus" SummaryItem
- Clean up unused variables (`withdrawable`, `nonWithdrawable`)

### 3. `src/components/olc/SettlementRequestDialog.tsx` (lines 38-105)
- Remove references to "Withdrawable Balance" and "Non-Withdrawable" display rows
- Update settlement logic to use `agc_total` instead of `agc_withdrawable`
- Update validation message accordingly

## What Stays Unchanged
- The `WalletBalance` type in `src/types/wallet.ts` -- the fields remain in the data model for backend tracking
- The `is_withdrawable` field on transactions -- still tracked server-side
- Edge function logic -- no changes to how transactions are recorded

## Technical Notes
- This is a UI-only change; the database schema and backend logic remain intact
- The distinction may still exist in the data layer for governance/audit purposes, it just won't be shown to users
