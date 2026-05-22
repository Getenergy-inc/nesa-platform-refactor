# Igbo (`ig`) hreflang & Meta Audit

_Last updated: 2026-05-22_

## TL;DR

- **Sitewide hreflang in `index.html`** already advertises `ig` (and all 12 locales) for the home route — ✅ correct.
- **Per-route `<html lang>` + localized `<title>` / `<meta>`** was only present on `/programs/nesa-africa`. The main landing route `/` was hard-coded English. ❌ → ✅ fixed in this pass.
- **Per-route hreflang alternates** were missing on every React route (only `/` had them via `index.html`). ❌ → ✅ a shared `<LocalizedSEO>` component now emits them for any route that adopts it.
- **40+ other pages** still use bare `<Helmet>` with English-only strings and no hreflang. They need to migrate to `<LocalizedSEO>` (tracked below).

---

## What was fixed

### 1. New shared component
`src/components/seo/LocalizedSEO.tsx` — emits, per route:
- `<html lang>` + `<html dir>` (RTL-aware for `ar`)
- `<title>`, `<meta name="description">`, `<meta name="keywords">`
- Localized OG + Twitter tags (`og:title`, `og:description`, `og:locale`, `og:url`)
- `<link rel="canonical" href="…?lang=<active>">`
- `<link rel="alternate" hreflang="x-default" …>` + one alternate per supported locale (incl. `ig`)

All hreflang URLs share the same pathname; only the `?lang=` query changes, matching the convention already used in `index.html`.

### 2. Landing route `/` (`src/features/landing/NESALandingPage.tsx`)
- Removed hard-coded English `<Helmet>`.
- Now uses `<LocalizedSEO pathname="/" />` reading `seo.landing.*` from `pages.json`.
- Igbo visitors at `/?lang=ig` now get Igbo `<title>`, `<meta name="description">`, OG/Twitter tags and `<html lang="ig">`.

### 3. Program route `/programs/nesa-africa`
- Migrated from raw `<Helmet>` to `<LocalizedSEO>`. Existing Igbo `seo.nesaAfrica.*` strings continue to ship; hreflang alternates for all 12 locales are now emitted.

### 4. Locale catalogue updates
- `src/locales/en/pages.json` — added `seo.landing.*` (title, description, ogTitle, ogDescription, keywords).
- `src/locales/ig/pages.json` — added Igbo `seo.landing.*` matching the schema.

---

## Routes still needing migration

The following pages use `<Helmet>` directly and do not import `useTranslation` for SEO strings — Igbo (and every non-English) visitor still sees English meta on these routes, and none of them advertise per-route hreflang alternates.

Action: replace the `<Helmet>{…}</Helmet>` block with `<LocalizedSEO pathname="/the-route" title={t(...)} description={t(...)} />` and add matching `seo.<key>` entries in `src/locales/en/pages.json` + `src/locales/ig/pages.json` (and other locales as they're prioritised).

Priority A (high-traffic / public discovery):
- `src/pages/Categories.tsx` → `/categories`
- `src/pages/CategoryDetail.tsx` → `/categories/:slug`
- `src/pages/NomineeDirectory.tsx` → `/nominees`
- `src/pages/NomineeProfile.tsx` → `/nominees/:slug`
- `src/pages/MasterNomineeProfile.tsx`
- `src/pages/Vote.tsx`, `src/pages/VoteWithAGC.tsx`
- `src/pages/Results.tsx`
- `src/pages/about/About.tsx`, `src/pages/about/Governance.tsx`, `src/pages/about/SCEF.tsx`, `src/pages/about/Timeline.tsx`, `src/pages/about/Vision2035.tsx`

Priority B (conversion / wallet / programs):
- `src/pages/AboutAGC.tsx`, `src/pages/EarnVotingCoins.tsx`, `src/pages/EarnVotingCredits.tsx`, `src/pages/ClaimVotingCredits.tsx`
- `src/pages/Donate.tsx`, `src/pages/EndorseNESA.tsx`, `src/pages/Partners.tsx`, `src/pages/Ambassadors.tsx`
- `src/pages/EduAid.tsx`, `src/pages/Rebuild.tsx`, `src/pages/MovementPage.tsx`, `src/pages/EcosystemPage.tsx`, `src/pages/GovernancePage.tsx`
- `src/pages/Programs.tsx`, `src/pages/PathwaysPage.tsx`, `src/pages/AwardPathwayPage.tsx`
- `src/pages/Tickets.tsx`, `src/pages/BuyYourTicket.tsx`, `src/pages/UpcomingEvents.tsx`, `src/pages/Policies.tsx`
- `src/pages/Wallet.tsx`, `src/pages/GFAWzipLinks.tsx`, `src/pages/GFAWzipWallet.tsx`

Priority C (utility / status):
- `src/pages/NotFound.tsx`, `src/pages/Unauthorized.tsx`
- `src/pages/Judges.tsx`, `src/pages/Contributors.tsx`, `src/pages/ContributorProfile.tsx`

Each migration is mechanical:
```tsx
// Before
<Helmet>
  <title>Categories | NESA-Africa</title>
  <meta name="description" content="Explore the award categories." />
</Helmet>

// After
<LocalizedSEO
  pathname="/categories"
  title={t("seo.categories.title")}
  description={t("seo.categories.description")}
/>
```

---

## Verification checklist

For each Igbo route:
1. Visit `https://nesaafrica.lovable.app/<route>?lang=ig`.
2. View source / DevTools → `<head>` should show:
   - `<html lang="ig">`
   - `<title>` and `<meta name="description">` in Igbo
   - `<meta property="og:locale" content="ig">`
   - `<link rel="canonical" href=".../<route>?lang=ig">`
   - 12 `<link rel="alternate" hreflang="..">` tags + `x-default`, all pointing to the same pathname with different `?lang=`.
3. Run Google Rich Results / hreflang testers against the URL.

Note on social previews: `react-helmet-async` mutates `document.head` client-side. Crawlers that don't execute JS (LinkedIn, Slack, Facebook) keep seeing the static English `<head>` from `index.html`. For accurate per-locale social previews the project would need SSR — out of scope for this audit.

---

## Summary table

| Concern | Before | After |
|---|---|---|
| Igbo declared in sitewide hreflang | ✅ (`index.html`) | ✅ unchanged |
| Igbo `<title>` / `<meta>` on `/` | ❌ English only | ✅ via `LocalizedSEO` |
| Igbo `<title>` / `<meta>` on `/programs/nesa-africa` | ✅ | ✅ + hreflang added |
| Per-route hreflang alternates | ❌ (only `/`) | ✅ everywhere `LocalizedSEO` is adopted |
| Other 40+ routes localized for `ig` | ❌ | ⏳ migration tracked above |
