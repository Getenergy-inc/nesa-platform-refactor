# Support a Special-Needs School Across Africa — page rebuild

## Decisions needed before I build (conflicts with saved project rules)
1. **Brand inside the page body.** Saved rule: "no new colours/fonts/tokens anywhere" on NESA. Your spec asks for EduAid-Africa green/brown/cream with Fraunces + Plus Jakarta Sans. I will scope these to the page wrapper only (header, footer, nav, language switcher untouched) and record this as a page-only exception — confirm.
2. **Phase 0 / wording-only scope.** Saved rule limits NESA to wording and link changes. This is a full build (new sections, forms, map, database tables). Your message is treated as explicit approval for this page only — confirm.
3. **Links.** `BASE` is the Lovable project address, but canonical is `https://eduaid.africa/...`. I will use `BASE` for CTAs as written and eduaid.africa as canonical. Alternative: use relative links on NESA so they work on nesa.africa. Your choice.
4. **Phrase "Votes are never sold"** and the "Vote" action stay, but voting is disabled (`VOTING_OPEN = false`) with the September 2027 notice. No voting controls are built.
5. **Not published.** Nothing will be published.

## What visitors will see (in order)
Thin band "A Rebuild My School Africa service · EduAid-Africa · presented with NESA-Africa", then the 20 sections exactly as listed in your spec: utility bar with text size and high-contrast; dark green hero with five action tiles and "2027 at a glance"; notice; About; Five ways; Donate form; Sponsor/Partner form; two click-to-load videos; eight categories (gradient tiles until your images arrive); interactive Africa map and eight region cards; EduTourism and ceremonies table; 10-step process; support details; Take-part tabs; Verified Schools table and empty accountability dashboard ("—", "Awaiting the first approved figures"); timetable and Vote preconditions; sponsorship overview; six FAQs; final CTA; Connect section with desks and the four bank accounts.

Ownership line, integrity notice, "targets, not secured funding", "Completing this form does not confirm payment…" and "Pay only into accounts named EduAid Africa Ltd." appear as specified. No school names, children's data, statistics, partner logos or testimonials are invented. The logo file is used unchanged.

## Data
- Two new tables: `support_fund_pledges` and `support_fund_transfer_reports` (anyone may submit; only admins read/update; no public reads; `site = 'nesa'`). No card, PIN, password, OTP or bank-login fields anywhere.
- All saving goes through one service module so it can later point at the shared EduAid-Africa backend.
- Wallet and revenue split are not touched; supporter dashboard only as a disabled flag.

## Files I will touch
- `src/config/schoolSupport.ts` — extended as the single source of truth (CTAs, forms, videos, 8 regions/desks, 54-country draft map with Western Sahara unassigned, 8 categories, accounts, bank accounts, timetable, `PUBLIC_STATS`, flags).
- `src/pages/impact/SpecialNeedsSchools.tsx` — rebuilt in place from new section components.
- New: `src/components/school-support/*` (sections, DonateForm, SponsorPartnerForm, AfricaRegionMap, TakePartTabs, AccountabilityDashboard, ClickToLoadVideo, page theme wrapper).
- New: `src/services/supportFund.ts` (save + reference `EA-DN/SP/PT-YYMMDD-XXXX`).
- New migration for the two tables.
- `src/index.css` — page-scoped `.eduaid-page` variables and font import only.
- `src/locales/en/common.json` (+ English fallback for the other 11 languages; integrity notices marked for human review).
- `src/components/impact/SchoolSupportFundSection.tsx`, `SchoolSupportActions.tsx`, `SpecialNeedsSchoolParticipate.tsx` — remove duplicated hard-coded copy, read from config; participate page keeps its route.
- `src/test/school-support.test.ts` — config counts, `VOTING_OPEN === false`, acknowledgement required, no forbidden field names.
- Packages: `d3-geo`, `topojson-client`, `world-atlas` (map loaded lazily).

## Outside this page
- None to header, footer, navigation, sign-in or other pages. Existing redirects in `public/_redirects` and `scripts/generate-redirects.ts` stay unchanged; `/support-a-special-needs-school`, `/participate` and `/2027` keep working.
- Memory/AGENTS.md: note the page-scoped EduAid branding exception and the support-fund data rule.

## Technical notes
- Map: world-atlas countries-50m, `geoMercator().fitExtent` to lon −25.5…57.8 / lat −35.2…37.6 with clip; 7px dots for five island states; `<title>` per shape; accessible country `<select>`; legend focus greys others.
- Tabs use the existing Radix tabs (arrow keys) and read `?participation=`; Donate/Sponsor links scroll and preset region/mode via shared page state.
- iframes lazy; YouTube via youtube-nocookie on click.
- SEO via Helmet: title, description, OG, canonical, JSON-LD NGO + DonateAction.
- Verification: unit tests plus Playwright screenshots at 360/768/1280 of hero, map with country, Donate thank-you, partner mode, tabs, empty dashboard.
