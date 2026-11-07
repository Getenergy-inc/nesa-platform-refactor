# NESA-Africa 2026 — updated phased content refactor

## Authority and scope
This plan replaces the earlier plan. The latest uploaded **NESA-AFRICA 2026 — CONTENT REFACTOR OF THE EXISTING SITE** brief wins wherever earlier instructions differ. The 2 November Master Document supplies approved taxonomy (§§6–26) and page body content. Older `/docs/refactor` files are not requirements.

**Plan only at this review gate.** After approval, complete one phase, show before/after screenshots at **390px and 1440px**, report checks and missing content, then stop for review. **Do not publish.** Capture each phase's baseline immediately before its changes; no manufactured before/after comparisons.

Keep existing charcoal/near-black, NESA gold, cream, Playfair Display headings and Inter body; reuse existing components, cards, buttons and layouts. No new colours, fonts or tokens, including protected dashboards. Preserve the current dark hero photo. Allowed visual fixes: desktop header overlap (also check 1920px), remove the public “Page 1 of 39” bar, countdowns and carousels. Use existing dark-gold/charcoal text on light surfaces with contrast ≥4.5:1. Preserve the mobile Nominate/Explore Awards bar and position Sophia above it.

## Canonical facts
**4/22/90:** Icon 3 categories, Influencers 3, Platinum 7/27, Gold-Blue Garnet 9/63. Icon has pathways, not subcategories. **Nominations and continuous verified 2026 certificate downloads: 9 November 2026–31 March 2027.** **13 December 2026 Online Awards Gala** honours Africa Education Icons 2006–2026: online only, about 20–30 invited live participants, authorised broadcasts, no tickets/venue. Free nomination, official form only, no public voting, zero judging weight for sponsorship/donations. **9 Independent Judges · 27 Nomination Review Committee members.** Organisations may self-nominate; individuals only where category guidance permits; multiple categories remain allowed. No automatic status promotion or invented content; dashed **CONTENT REQUIRED** placeholders are tracked in `docs/content-required.md`.

## Current conflicts and dependencies
| Area | Current conflict / affected files | Resolution phase |
|---|---|---|
| Dates | `src/config/schedule.ts` still says 6 September; season/campaign/category configurations duplicate older windows | 1–2 |
| Taxonomy | No `src/config/taxonomy2026.ts`; competing `awardCategories/`, `awardTiers2026.ts`, `nesaCategories.ts`, recognition registries | 1 |
| Homepage | Content distributed across `HomeHeroBlock`, `components/nesa/`, editorial sections; old copy, ticket bands, countdowns and ordering | 2–3 |
| Public navigation | Multiple navigation registries; ticket/voting/wallet/shop links; menu crowding and book-style pagination | 3 |
| Event pages | `galaConfig.ts`, Gala/Events/ticket pages and bands retain physical-event terminology | 2, 4–5 |
| Trust/statuses | Existing blanket verified/winner claims, public voting language, outdated governance counts and tier labels | 2, 4, 7 |
| Nomination | Multiple native nomination pages remain; retain the shared `NominationLinkRouter` and official Google Form routing | 3–4 |
| Locales | Twelve locale trees include obsolete dates/voting/gala text; translations must not be invented or publicly released | 2, 6 |
| SEO | Distributed page metadata, structured data and sitemap generation need alignment with retained public routes | 2, 4, 8 |
| Docs | Phase 0 audit is a candidate-hit list, not proof every hit is public; older “99 subcategories”/other guidance is superseded | 0–1 |
| Fonts | Earlier visual review reported a rendered heading-font discrepancy; verify against existing CSS/config without adding fonts | 0 |
| Cloud/security | Hosted database is currently paused. Two public-read findings for role and volunteer-badge definitions remain active; live schema verification and any safe remediation are blocked | 7 |

Inspect audit hits in context; preserve protected admin/NRC/judge routes, permissions and review decisions.

## Phases and review gates

### Phase 0 — refresh baseline and content inventory
Verify original brand and heading fonts; refresh audit/superseded notices for this brief. Locate the full Master Document before transcribing category definitions; never infer names/criteria. Track missing enquiry forms, SCEF role, category bodies, certificate method, running order/platforms, eight contact destinations and partner approvals. Capture baseline at 390/1440, header at 1920; run startup-integrity checks. **Stop for review.**

### Phase 1 — taxonomy and shared dates
Create public `taxonomy2026.ts` from Master Document §§6–26 with legacyCode mappings. Preserve existing nomination keys, records, eligibility and research provenance; unresolved mappings require review, never auto-reclassification. Share canonical dates across public consumers. Test 4/22/90, 27/63, Icon pathways, tier names, mappings and concrete date boundaries. **Stop for review.**

### Phase 2 — homepage, public copy and metadata foundation
Apply exact homepage copy/order: alert/header, existing-photo hero, work/steps, tiers, integrity, nomination, online gala, seven media channels, separate endorser/sponsor rows, separate support/sponsorship panels, footer. Sponsor approval/logo permission take precedence; missing approval uses a placeholder.

Replace obsolete public dates/counts/tier names/event claims, voting and guarantees. New copy uses English translation files from the start. Establish shared metadata, including requested `index.html` head updates. Banned-content checks allow “Online Awards Gala” and exclude legitimate private/historical records. **Stop for review.**

### Phase 3 — navigation, footer, public route migration
Use exact supplied nav with “More” below 1440px, search, 12 languages, Support Education and gold Nominate; reuse footer components. Keep mobile actions/Sophia clearance. Fix overlap; remove book bar/countdowns/carousels. Test ordinary, modified and mobile Nominate clicks to the official form in a new tab. Missing SCEF forms stay placeholders. Map obsolete public redirects without changing protected routes. **Stop for review.**

### Phase 4 — page-by-page content
Use exact supplied H1/lead text and approved Master Document body; missing body uses tracked placeholders.

| Page family | Required changes |
|---|---|
| About | “Education Impact Deserves to Be Seen, Verified and Remembered”; approved lead; missing SCEF role placeholder |
| Awards | “The African Blue-Garnet Awards for Education”; 4/22/90 discovery driven by registry |
| Icon / Influencers / Platinum / Gold-Blue Garnet | Exact brief heroes; three Icon pathways; influence over follower counts; 7/27 and 9/63 splits |
| All 22 category pages and subpages | Ordered hero/territory/purpose/CTA, why it matters, eligibility/self-nomination, subcategories or Icon pathways, evidence, non-determinants, free nomination/window notice; preserve existing profile links |
| Nominate / confirmation | Exact brief copy; official Google Form only; no guarantee or premature nominee/winner status. Do not pretend an external form was submitted; confirmation requires a real completion signal, otherwise informational only |
| Certificates | Exact download/window copy; reuse existing verification where suitable; unapproved download method remains CONTENT REQUIRED, no fake download |
| Nominees / profiles | “Africa's Education Enablers”; explain full ten-status ladder; unsupported status defaults to Identified; trophies only for confirmed Award Recipient/Icon |
| Research & Judging / Evidence | Exact heroes; NRC/judge counts, independent assessment, E1–E4; participant interviews begin at E3, E4 never published as fact |
| `/programme-2026` | Exact Online Awards Gala title, 13 December and Icons 2006–2026; online-only 20–30 invited participants; running order and authorised platforms placeholders |
| Media / Impact | Exact supplied heroes; seven approved channels and documented impact, no invented archive/highlights/statistics |
| Partners / Governance | Six labelled partner groups; five governance principles; exact related-party disclosure; no partner logos on judging/NRC/evidence/nominee pages; sponsor display requires approval |
| Get Involved / Support EduAid-Africa / Sponsor | Exact supplied heroes; separate support/partnership journeys, zero judging weight, Google Form enquiry destinations pending |
| Resources / FAQ / Contact | Exact heroes; nomination close 31 March 2027, verified certificate window, online-only gala FAQ; eight contact routes with missing-address placeholders |
| Legal / ancillary public pages | Align retained existing content with safeguarding/consent/privacy and current programme; no fabricated policy body |

Use exact navigation labels supplied in the brief (including “2026 Awards Gala”) as specific exceptions to the broader qualified-Gala wording rule. **Stop for review.**

### Phase 5 — remove public voting, wallet and commerce
Remove public voting/AGC/wallet/shop exposure from menus, search and sitemap; redirect obsolete addresses. Preserve records/functions admin-only and test public denial versus authorised access. No historical data deletion. **Stop for review.**

### Phase 6 — language publication boundaries
Keep 12 languages/Arabic RTL; translation-key driven copy. Non-English stays unpublished until SCEF translations; no invented/stale translations or unpublished sitemap/hreflang alternates. **Stop for review.**

### Phase 7 — verified data, certificates and security
Once Cloud is active, verify status/evidence/consent, certificate authorisation and protected staging. Never promote unconfirmed candidates automatically. Test authorised signed-in flows with readable results.

Inspect live role/badge definitions and policies; migrations indicate public reference data, separate from assignments. Findings stay active until verified; ask before restricting legitimate display. **Stop for review.**

### Phase 8 — final checks, still no publishing
Check routes/redirects, form clicks, dates/counts, consent/statuses, placeholders, languages, keyboard/focus, images and mobile fit. Validate metadata/sitemap. Event JSON-LD: Online, VirtualLocation, 2026-12-13, no offers or invented broadcast URL. Preserve single-string Helmet titles/startup integrity. Run tests/accessibility/performance checks; screenshots 390/1440 and header 1920. Report blockers. **Stop; do not publish.**

## Small source ambiguities handled without inventing content
Keep the supplied homepage title as an exception; others are under 60 characters ending `| NESA-Africa 2026`. Missing approvals/forms/body content remain CONTENT REQUIRED. Website copy cannot establish external Google Form submission or control its availability.