# Consolidated NESA-Africa master refactor v3 — implementation plan

**Status: awaiting owner approval. No application code has been changed for this request.**

## Source handling and boundaries

- The uploaded `NESA-AFRICA_-_CONSOLIDATED_MASTER_REFACTOR_pasted.md` (v3, 20 Nov 2026) is authoritative over older notes.
- Use `EduAid-Africa-Support-Engine.html` only as a content/workflow reference. Rebuild anything needed with the project's React, Tailwind and shadcn components; do not paste its HTML/CSS/JS.
- Do not use the HTML's FormSubmit endpoint, direct mailbox, third-party data submission, voting workflow, eight-category model or visual redesign. The master requires 14 categories and “regional participation”, never voting.
- Preserve the design freeze, `.nesa-ed`, existing page shells, header/footer styling, owner-supplied Support pictures, EduAid page-only branding, data, auth, database role names, permissions, nomination keys, Support Fund tables and Phase 0 build guard.
- Site-relative internal links only; no CTA may point to a redirect. No publishing or deployment.

## Phase A — Release 1 dead ends and accuracy

- Reduce `FinalCTASection` to the approved two buttons and copy; remove shop/awards links and counters.
- Make `ExitIntentPopup` desktop/fine-pointer-only, true exit-intent-only, once per visitor with `nesa_exit_popup_shown_v2`, route-suppressed, Escape-closeable and an accessible dialog.
- Update Sophia’s visible links/copy and the existing chat system prompt so there is no public or AGC voting in 2026; use the canonical recognition, sponsor and chapter destinations.
- Remove the `/faqs` and `/faq` redirect loops; retain `/help -> /faqs`. Replace remaining public `/shop`, `/awards`, `/awards/18-categories` and `/how-voting-works` CTA destinations with their canonical replacements.
- Leave membership-fee and GFA Wallet account configuration untouched.

**Files:** `src/components/nesa/FinalCTASection.tsx`, `src/components/nesa/ExitIntentPopup.tsx`, `src/components/support/CustomerCareChat.tsx`, `src/hooks/useCustomerCareChat.ts` if needed, `supabase/functions/chat/index.ts`, `src/config/refactorRedirects2026.ts`, affected public CTA components found by the link sweep, `public/_redirects` via its generator, and focused tests.

## Phase B — navigation, footer and CTA consistency

- Make every dropdown heading the direct menu-page link; remove duplicate overview items and Timeline/Certificates from the header as specified.
- Keep the two-item Impact menu unchanged. Remove the separate mobile Nominees item; retain Nominee Directory inside Recognition.
- Preserve Contact in the header, one primary Submit a Nomination button, workspace sign-in choices and existing route guards.
- Apply the shared CTA labels/destinations and per-page next-step blocks without introducing a new visual component style.
- Align the six footer columns and integrity statement while preserving footer styling and all required live legacy pages.

**Files:** `src/config/siteNavigation.ts`, `src/components/navigation/SiteHeader.tsx`, `src/components/nesa/NESAFooter.tsx`, `src/config/publicActions2026.ts`, relevant page CTA blocks, `src/config/__tests__/siteNavigation.test.ts`, `tests/e2e/navbar-overlap.spec.ts` and CTA/link tests.

## Phase C — lean eight-section homepage

- Reorder/reuse existing editorial sections into Hero, facts strip, process, four tiers, approved profiles, online programme, impact and final CTA.
- Remove duplicate Icon sections, plaque/influencer displays, enabler/partner/volunteer/advisor/join/governance duplicate bands, scroll progress and the homepage floating FAQ button; content remains available on its owning pages.
- Use facts only: 4 / 22 / 90, nine independent Icon judges, no public voting in 2026, and no unapproved partner or nominee totals.
- Keep the editorial hero/card/button styling and lazy-load below-hero sections.

**Files:** `src/features/landing/NESALandingPage.tsx`, the existing components in `src/features/landing/editorial/` for Hero, DirectoryStatsSection, process/tiers/gallery/programme/impact sections, `src/components/impact/SchoolSupportFundSection.tsx` only if content merging requires it, `src/components/nesa/FinalCTASection.tsx`, English translation copy and homepage tests.

## Phase D — core recognition and public pages

- Apply the approved copy/metadata to About, Recognition, the shared award template, Nominate, Nominees/profile template, How Recognition Works, Research and Judging, Programme, Media and Get Involved.
- Recognition will show the exact totals table, four tier cards and approved award names/scope counts only. Do not expose legacy subcategory names as the unapproved 90-name register.
- Make `/about/scef` and `/about/governance` real pages rather than anchor redirects, using existing NESA page shells and styles; update internal links to the real routes.
- Preserve the official nomination channel, existing nomination keys/data and controlled nominee publication. No invented statuses, profiles, judges, programme participants or media items.

**Files:** `src/App.tsx`, `src/pages/about/About.tsx`, `src/pages/about/SCEF.tsx`, `src/pages/about/Governance.tsx`, `src/pages/recognition/RecognitionHubPage.tsx`, `src/components/recognition2026/CategoryPage.tsx`, `src/components/awards/subpage/AwardSubpageTemplate.tsx`, `src/pages/nominate/NominateHub2026.tsx`, `src/pages/NominateOfficial.tsx`, `src/pages/nominees/NomineesHubPage.tsx`, the existing nominee profile component, `src/pages/HowItWorksPage.tsx`, `src/pages/ResearchAndJudgingPage.tsx`, `src/pages/gala/GalaConsolidated.tsx`, `src/pages/media/MediaHub.tsx`, `src/pages/get-involved/GetInvolvedPage.tsx`, shared SEO/copy registries and focused tests.

## Phase E — Impact, Afri-EduTourism and Support Engine content

- Keep the approved lean Impact and Afri-EduTourism pages and two-item Impact menu.
- Rework only Support-page content/anchors into Overview, Who Can Apply, School Categories, Eight Regions, 2027 Timeline, Funding, Nominate, Donate, Sponsor or Partner, Volunteer and EduTourism, Accountability and FAQ.
- Replace every public Support “Vote” label/process/safeguard with regional-participation wording; keep participation closed pending verification and approval. Do not implement the HTML ballot.
- Retain the 14 approved categories, eight operational regions, hidden country mapping, existing Google Form nomination channel, donation/transfer/sponsor services, bank accounts, reconciliation rules, no-card warning and ring-fenced Support Fund.
- Use the HTML only to enrich relevant school-nomination, support-offer, safeguarding, Academy/Friends and EduTourism copy where consistent with the master. Route mission/general interest through the secure Contact enquiry flow rather than the HTML inbox.
- Keep every current owner-supplied picture and also extract/add suitable embedded HTML logos and flyers through Lovable asset pointers. Do not replace the existing category collage or crops; use added assets only where the approved Support content calls for them.

**Files:** `src/config/schoolSupport.ts`, `src/pages/impact/SpecialNeedsSchools.tsx`, `src/components/school-support/TakePartTabs.tsx`, `src/components/school-support/AfricaRegionMap.tsx`, related school-support presentation components, `src/pages/AfriEduTourismPage.tsx` only for required link/copy consistency, English translations and Support tests. No Support Fund schema changes.

## Phase F — Contact and supporting content pages

- Replace the public 18-option Contact list with the exact 20 types, retaining merchandise and Afri-EduTourism prefills, secure case references and administrator-only management.
- Apply a reviewed database migration that permits the new values while retaining legacy database values for historical enquiries; do not rewrite or delete existing enquiries. Public validation will permit only the new 20 types.
- Apply content-only updates to Global Team, Certificates, Volunteer, Join a Local Chapter, Sponsors, Partners, Donate, Impact Stories, E-Journal and Policies using their existing pages/components.
- Do not display unconfirmed SCEF registration details as confirmed facts; no Contact destination mailbox is added.

**Files:** `src/config/contactEnquiries.ts`, `src/services/contactEnquiries.ts`, `src/pages/Contact.tsx`, `src/pages/admin/AdminContactEnquiries.tsx`, a migration created only through the database migration tool, existing supporting pages (`MeetOurGlobalTeam`, `EducationImpactCertificatesPage`, `Volunteer`, `JoinLocalChapter`, `SponsorsPartners`, `Partners`, `Donate`, `ImpactStories`, `EduAidJournal`, `Policies`), their copy registries and tests.

## Phase G — portals, legacy discovery, accessibility, measurement and release evidence

- Apply portal landing copy only; keep all stored roles, guards, OTP and workspace permissions unchanged. The 36-member scaling model remains NRRC-portal-only.
- Complete retired-route/noindex/sitemap/internal-link cleanup and controlled retired-content handling where no replacement exists.
- Audit skip links, headings, labels, inline errors, keyboard/Escape behavior, focus, reduced motion and tap targets; fix accessibility semantics without visual redesign.
- Retain `final_cta_click`; add the specified primary-CTA and `nomination_form_opened` events through the existing analytics utility.

**Files:** existing portal landing pages, `src/pages/Policies.tsx`, `src/App.tsx`, `src/config/refactorRedirects2026.ts`, `scripts/generate-redirects.ts`, `scripts/generate-sitemap.ts`, relevant accessibility/form components, `src/lib/analytics.ts` and tests.

## Verification and delivery

- Run focused unit/contract tests after each phase and the full production build with the Phase 0 guard unchanged.
- Capture before/after screenshots for every touched page at 1280px and 360px; test menus, dialogs, forms and keyboard behavior in a real browser.
- Crawl public CTA/header/footer links to prove no broken links and no links to redirect sources; verify `/faqs` and `/help` directly.
- Re-test a real anonymous Contact submission and anonymous read/update denial, deleting only the synthetic row afterward. Test member/admin access only with genuine authorised sessions; never promote an account.
- Deliver per-phase summaries, staging evidence, design-unchanged findings and a non-destructive rollback plan. Do not publish.

## Held/open items

- Owner confirmed “both”: retain every current Support picture and add suitable embedded HTML logos/flyers without replacing the existing category imagery.
- Keep hidden/unimplemented: country-to-region allocation, the 90-subcategory register, unconfirmed SCEF registration details, Contact/merchandise destination mailbox, Pay Membership Fee/GFA Wallet decisions, voting, card payments, shop/cart/checkout and any role migration.
