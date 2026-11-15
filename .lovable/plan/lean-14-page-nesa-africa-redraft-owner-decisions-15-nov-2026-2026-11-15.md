# Lean 14-page NESA-Africa redraft (owner decisions 15 Nov 2026)

Nothing is published. Each phase stops for owner review before the next begins.

## Conflicts with existing project rules (owner to confirm)
1. **Wording-only rule:** memory says to keep all design, section order and page structure. This brief adds new pages and restructures the homepage, header and footer. I will treat the 15 Nov brief as an owner-approved structural exception. I will reuse the existing charcoal/gold/cream theme, Playfair/Inter and components, with no new colours or fonts (EduAid styling stays on the school page only).
2. **"Change only files named in each message":** this brief names pages and components, not every file. I will keep to the files listed below and report any extras.
3. **Contact enquiries:** memory sends enquiries to SCEF Google Forms. The brief says to record enquiries only. Recording needs one new private table (`contact_enquiries`): anonymous insert only, admin-only read, no public read, same pattern as the Support Fund tables. No existing roles or data change.
4. **Utility bar removal and new header:** this replaces the "seven-link menu" in the lean-knowledge memory. I will update that memory to the new header.
5. **Programme date:** unchanged (Monday 28 December 2026), taken from the season config.
6. **Phase 0 build guard:** this is still waiting on the independent reviewer record. I will not bypass it.

## Phase 1: Navigation, footer, routes and redirects
- Rebuild `siteNavigation.ts` exactly to the brief: the desktop order, Media renamed to Webinars, Podcast and NESA-Africa TV, Nominees in the mobile menu only, and the Sign In workspace list with six entries.
- Remove `UtilityBar` from the header. Keep the Radix menubar on desktop and the accordion/dialog on mobile.
- Six-column footer with the exact footer statement. Remove 2027, 2028–2030, Vision 2035, gallery and old NRC links from the menus and footer. Those pages stay reachable by direct link.
- Routes: add `/how-it-works` and `/research-and-judging`; make `/get-involved` a real page; redirect `/about/how-recognition-works` and `/vote` to `/how-it-works`; keep `/tickets`, `/buy-your-ticket` and `/media/gala` redirecting to `/programme/2026`. Apply the same changes in `public/_redirects` and `generate-redirects.ts`.
- Run a broken-link sweep over every menu and footer link.

## Phase 2: Remove gala and ticket items
- Delete `GalaTicketBand` and its uses; remove the Lagos text from `CountdownSection` and `HomepageGalleryTeaser`; remove countdowns from public pages.
- Retire the `BuyYourTicket` and `Tickets` pages: their routes redirect, and the files go unused. Remove the "Buy Tickets" card and the wallet "Buy Ticket" action (the wallet stays hidden).
- Remove remaining "Lagos, Nigeria" gala text from `galaConfig`, `schedule`, `Gala.tsx` and the English copy. Lagos entries that are geography (Nigeria zones, regions, nominee data) stay unchanged.

## Phase 3: Core pages, part 1 (Pages 1–5)
Homepage, About, Recognition, the category template `/recognition/:tier/:category`, and Nominate, using the exact supplied copy and SEO title and description. The template reads the existing taxonomy through the presentation registry, so nomination keys stay unchanged.

## Phase 4: Core pages, part 2 (Pages 6–11)
Nominees (status table, filters, counter policy, profile template), How Recognition Works (13 steps), Research and Judging, the 2026 Online Programme, Media (channel table), and Get Involved.

## Phase 5: Impact and the special-needs school page (Pages 12–13)
- Impact page copy.
- School page: in `schoolSupport.ts` and `specialNeedsCategories.ts`, replace the 8 categories with the 14 learner-support categories. Add the intervention areas, programme flow, 2027 milestone table, the US$135k/US$15k split notice, the dashboard text "Awaiting the first approved figures" and the safeguards.
- Keep the Support Fund tables, the bank-transfer flow, reconciliation and closed voting. The region map stays labelled draft.

## Phase 6: Contact and Help (Page 14)
- Form with 18 enquiry types, plus country, an optional reference, subject, message and consent. `?subject=merchandise` preselects Merchandise.
- Includes the security warning, the confirmation with an `NESA-EQ-…` reference, and the 10 FAQs.
- Enquiries are saved through one service module into the new private table. There is no email destination yet.

## Phase 7: Tests, checks, notes
- Update `siteNavigation.test.ts` and `navbar-overlap.spec.ts`.
- New tests for: redirects, the 18 enquiry types with merchandise preselected, the 14 categories, no "Lagos"/ticket text on public pages, no "Nominee Research Corps", and the counts (4/22/90, nine NRRC members, nine judges).
- Check the menus, footer and new pages on desktop and at 360px, with screenshots. Do a real anonymous enquiry save, confirm anonymous reads are refused, then delete the test row.
- Update memory (header, footer, contact rule) and `AGENTS.md`.

## Files expected to change
- **Navigation and layout:** `src/config/siteNavigation.ts`, `src/components/nesa/NESAHeader.tsx`, `NESAFooter.tsx`, `UtilityBar.tsx` (unused afterwards), `src/App.tsx`, `public/_redirects`, `scripts/generate-redirects.ts`, `src/config/refactorRedirects2026.ts`.
- **Gala and tickets:** `GalaTicketBand.tsx`, `CountdownSection.tsx`, `HomepageGalleryTeaser.tsx`, `Tickets.tsx`, `BuyYourTicket.tsx`, wallet action component, `galaConfig.ts`, `schedule.ts`, `pages/media/Gala.tsx`.
- **Pages:** homepage sections under `src/features/landing`, `pages/about/*`, `pages/recognition/*`, `CategoryDetail.tsx` or the recognition template, `Nominate*.tsx`, `Nominees.tsx` and `NomineeProfile.tsx`, new `pages/HowItWorks.tsx`, new `pages/ResearchAndJudging.tsx`, the programme page, `pages/media/*`, new `pages/get-involved/GetInvolvedPage.tsx`, `Impact.tsx`, the school-support page and its sections, `Contact.tsx`.
- **Config, copy and data:** `schoolSupport.ts`, `specialNeedsCategories.ts`, `src/locales/en/*.json`, new `src/services/contactEnquiries.ts`, one migration for `contact_enquiries`.
- **Tests and notes:** files under `src/config/__tests__`, `src/test`, `tests/e2e`; memory, `AGENTS.md`, `roadmap.md`.

## Estimate
About 7 review rounds, one per phase. Phases 3–4 are the largest (about 11 pages of copy). Phases 1, 2 and 6 are moderate.

## Still open (does not block the build)
- Contact destination email or SCEF form.
- Written approval of the region country list.
- Administrator account for admin-only access checks.
- The EduAid logo and the 14 category images (illustrative placeholders until supplied).
- Translations for the other 11 languages (English first; other languages remain unpublished).
