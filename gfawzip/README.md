# GFA WZIP Wallet — Phase 1 Scaffold

**GFA WZIP Technology Limited — Digital Wallet & Financial Infrastructure**

> "Powering transparent digital payments, wallets, allocation and settlement for
> organisations, communities and social-impact programmes."

This folder is a **self-contained, portable Phase 1 scaffold**. It has no imports
from the surrounding NESA-Africa codebase and is intended to be lifted into a
standalone GFA WZIP project (its own repo, its own database).

## Regulatory positioning (do not weaken)

GFA WZIP is a **wallet/ledger and payment-orchestration technology platform**.
It is **not** a bank, payment institution, PSP, money-transfer operator or
custodian. Custody, processing and settlement of third-party funds are performed
only through appropriately authorised banks/PSPs.

The data model therefore separates, at all times:

| Concept | Where it lives |
|---|---|
| Digital wallet / ledger balance | `wallet_ledger_entries` → `wallet_balances` |
| Actual bank-custodied funds | `bank_accounts` + settlement records (Phase 2) |
| GFA WZIP own revenue | wallets of type `GFAWZIP_REVENUE` |
| Third-party / programme funds | wallets of type `ORGANISATION`, `PROGRAMME`, `CHAPTER`, `CAMPAIGN` |

## No fabrication rule

No bank accounts, gateway credentials, commission rates, markup rates, FX rates,
licences, beneficiaries or prices are invented anywhere in this scaffold.
Everything commercial is a configuration row an administrator must approve.

## Layout

```
gfawzip/
├── db/001_phase1_schema.sql      Full Phase 1 schema: enums, tables, GRANTs, RLS, roles
├── src/lib/
│   ├── money.ts                  Minor-unit money maths (no floats)
│   ├── ids.ts                    GFAW-00000001 identifiers
│   ├── ledger.ts                 Double-entry posting engine (pure, testable)
│   ├── paymentIntent.ts          Payment intent lifecycle + state machine
│   ├── receipts.ts               Deterministic receipt construction
│   └── providers/                Provider-agnostic gateway adapters
│       ├── types.ts
│       ├── registry.ts
│       ├── bankTransfer.ts
│       ├── paystack.ts           Stub until PAYSTACK_SECRET_KEY is configured
│       └── flutterwave.ts        Stub until FLUTTERWAVE_SECRET_KEY is configured
├── supabase/functions/gfawzip-wallet/index.ts   API surface (/api/v1/*)
├── src/pages/                    Consumer wallet + admin dashboard UI
├── tests/                        Independent financial-calculation tests
└── vitest.config.ts
```

## Phase 1 scope (delivered here)

Registration/auth (host platform), wallet creation, immutable double-entry
ledger, balances, transactions, payment intents, bank-transfer reconciliation
references, Paystack + Flutterwave adapters (stubbed), receipts, admin dashboard.

Phase 2+ (allocation engine, commission/markup, settlement engine, bank account
directory, reconciliation) has its **table and enum stubs reserved** in the schema
so the ledger never needs a breaking migration, but no engine logic ships yet.

## Porting checklist

1. Create the new project and its database.
2. Run `db/001_phase1_schema.sql` as a single migration.
3. Copy `src/lib`, `src/pages` and `supabase/functions/gfawzip-wallet`.
4. Point `src/lib/providers/registry.ts` at real provider secrets when verified.
5. Run `bunx vitest run --config gfawzip/vitest.config.ts`.
