# NESA-Africa 2026 CTA, Follow-link and page-content refactor

## Review rhythm
Build in phases and stop after each phase for review. Capture before/after screenshots at 390px and 1440px, check the desktop header at 1920px, and do not publish. Keep the existing charcoal/gold/cream design, Playfair Display headings, Inter body text, components and layouts.

## Phase 1 — Site-wide actions and Follow links
- Add one public-action configuration and one social-profile configuration. Standardize Follow destinations on the existing global footer’s Facebook, Instagram, LinkedIn, X/Twitter and YouTube accounts; add no unconfirmed accounts. Keep social-share URLs separate.
- Route every nomination CTA through the official Google Form, with real new-tab anchor destinations while retaining NominationLinkRouter as legacy protection.
- Update shared header, announcement, footer and mobile navigation to the brief’s labels and destinations. Use two mobile actions: Nominate and Explore Awards. Remove the book-style page bar, countdowns and redundant sticky nomination bars; keep Sophia clear of the mobile actions.
- Retire public ticket, voting, AGC/wallet, shop and merchandise routes and links with safe redirects; retain admin data and functionality. Send gala aliases to the Online Awards Gala page.
- Update shared public dates to 9 November 2026–31 March 2027, continuous verified-contributor certificate downloads, and the 13 December 2026 Online Awards Gala.
- Refactor hardcoded hero, category, media, gallery, volunteer and support CTA/Follow exceptions. Replace contact, donation-enquiry and sponsorship-enquiry submission/payment actions with dashed CONTENT REQUIRED states until SCEF supplies its Google Form URLs; record those blockers in docs/content-required.md.
- Add focused tests for CTA destinations, modified/middle-click nomination behavior, retired routes, social URLs/accessibility, missing-form states and prohibited public copy. Crawl representative public routes and review 390px/1440px screenshots before stopping.

## Phase 2 — Homepage content
- Apply the supplied homepage copy verbatim and in the specified order: alert/header, hero, recognition process, four tiers, integrity, nomination, Online Awards Gala, media channels, endorsers/sponsor, EduAid and sponsorship panels, and footer.
- Use the approved 4 tiers, 22 categories and 90 subcategories throughout. Preserve the existing dark hero photo and visual system.
- Browser-check every section and capture before/after screenshots at both required widths before stopping.

## Phase 3 — Awards, nomination and certificates
- Refactor the shared tier and all 22 category templates with the required section order, eligibility, self-nomination, evidence and free-nomination guidance.
- Update nomination and confirmation copy, keeping the official Google Form as the only nomination channel.
- Add/refine the certificate download section using the existing verification feature; leave the download method as CONTENT REQUIRED if it cannot be confirmed.
- Verify dynamic category links, modified-click behavior, statuses, mobile layout and translations before stopping.

## Phase 4 — Remaining public pages
- Apply the brief’s H1s, leads and body requirements to About, Nominees, Research & Judging, Evidence, Online Awards Gala, Media, Impact, Partners, Get Involved, EduAid support, Sponsor, Resources, FAQ, Governance and Contact.
- Use the approved status ladder, NRC public name, judge/member counts, partner disclosure and no-public-voting rules. Never invent missing body copy, contact details, platforms, running orders or statistics; use and document CONTENT REQUIRED.
- Check all public pages at 390px and 1440px before stopping.

## Phase 5 — Metadata and final acceptance
- Apply page titles/descriptions and Online Awards Gala JSON-LD, retain all 12 languages, and keep non-English pages unpublished until translated.
- Extend banned-string and public-route regression coverage for outdated dates/counts, physical gala/tickets, public voting/AGC/shop, old tier names and unsupported verification/winner claims.
- Run focused unit tests and the full public browser crawl, review final screenshots, and report any remaining content blockers. Do not publish.

## Technical approach
- Reuse `src/components/nominate/NominationLinkRouter.tsx`, `src/config/nomination/officialGoogleForm.ts`, shared CTA components and `PublicLayout`.
- Add small registries such as `src/config/publicActions2026.ts` and `src/config/socialLinks.ts`; migrate duplicated values rather than adding parallel page layouts.
- Keep new copy in translation files. Do not edit `src/index.css` or `tailwind.config.ts` for a new visual direction.
- Preserve admin-only data, RLS, judging/NRC workflows and existing nominations. Public route removal must not delete backend records.
