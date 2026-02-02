# NESA-Africa Routes Documentation

This document describes all public routes in the NESA-Africa platform.

## Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | NESA Landing Page | Main landing page for NESA-Africa (flagship program) |
| `/programs` | Programs Index | Overview of all SCEF programs |
| `/programs/nesa-africa` | NESA-Africa Landing | Full NESA-Africa landing page with all sections |
| `/categories` | Award Categories | Browse all award categories and subcategories |
| `/nominate` | Nomination Form | Submit a nomination (stage-gated) |
| `/login` | Login | User authentication |
| `/register` | Register | New user registration |

## Stage-Gated Routes

These routes are protected by the StageGate system and show a `StageLocked` message when the stage is closed:

| Route | Required Stage | Description |
|-------|----------------|-------------|
| `/nominate` | `nominations` | Nomination submission form |
| `/vote` | `public_voting` | Public voting interface (planned) |
| `/jury` | `jury_scoring` | Jury scoring dashboard (role-protected, planned) |
| `/results` | `results` | Results and winners (planned) |
| `/certificates` | `certificates` | Certificate download and verification (planned) |

## Dashboard Routes (Authenticated)

| Route | Required Role | Description |
|-------|---------------|-------------|
| `/dashboard` | `user` | User dashboard with nominations |
| `/dashboard/nominations` | `user` | User's nomination history |

## NRC Portal Routes (Authenticated)

| Route | Required Role | Description |
|-------|---------------|-------------|
| `/nrc` | `nrc`, `admin` | NRC dashboard overview |
| `/nrc/my-queue` | `nrc`, `admin` | Individual reviewer workspace with assigned nominations |
| `/nrc/members` | `admin` | NRC member management (30-member cap) |
| `/nrc/settings` | `nrc`, `admin` | Personal NRC workspace preferences |

## Anchor Links (Landing Page Sections)

| Anchor | Section |
|--------|---------|
| `#refer` | Referral section |
| `#vision-2035` | Vision 2035 document |
| `#tickets` | Ticket purchase |
| `#watch` | Media hub / live streams |

## Error Routes

| Route | Description |
|-------|-------------|
| `/unauthorized` | Shown when user lacks required role |
| `/*` (404) | Not Found page |

## Route Implementation Notes

- All routes use `react-router-dom` v6
- Stage gating is handled by the `StageGate` component from `@/components/governance/StageGate`
- Role protection uses the `ProtectedRoute` component
- Season-aware metadata is provided via `useSeason()` hook
- All date/year references are dynamic (no hardcoded years in UI)

## Configuration Files

- `src/config/season.ts` - Season editions and transition rules
- `src/config/schedule.ts` - Event scheduling and date calculations
- `src/config/nesaSeasonConfig.ts` - Phase definitions and category metadata

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/functions/v1/stage` | Current stage flags and season key |
| `/functions/v1/season` | Full season configuration with current/next edition |
