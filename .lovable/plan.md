# NESA-Africa 2026 — updated phased content refactor

## Authority and scope
This plan replaces the earlier plan. The latest uploaded **NESA-AFRICA 2026 — CONTENT REFACTOR OF THE EXISTING SITE** brief wins wherever earlier instructions differ. The 2 November Master Document supplies approved taxonomy (§§6–26) and page body content. Older `/docs/refactor` files are not requirements.

**Plan only at this review gate.** After approval, complete one phase, show before/after screenshots at **390px and 1440px**, report checks and missing content, then stop for review. **Do not publish.** Capture each phase's baseline immediately before its changes; no manufactured before/after comparisons.

Keep existing charcoal/near-black, NESA gold, cream, Playfair Display headings and Inter body; reuse existing components, cards, buttons and layouts. No new colours, fonts or tokens, including protected dashboards. Preserve the current dark hero photo. Allowed visual fixes: desktop header overlap (also check 1920px), remove the public “Page 1 of 39” bar, countdowns and carousels. Use existing dark-gold/charcoal text on light surfaces with contrast ≥4.5:1. Preserve the mobile Nominate/Explore Awards bar and position Sophia above it.

## Canonical facts
- **4 tiers · 22 main award categories · 90 subcategories**: Africa Education Icon 3 categories; Influencers Education Impact 3; Platinum Recognition 7/27; Gold-Blue Garnet 9/63. Icon uses pathways, not subcategories.
- **Public nominations: 9 November 2026–31 March 2027.** Verified contributors may continuously download their **2026** Certificate of Recognition throughout that window.
- **13 December 2026: NESA-Africa 2026 Online Awards Gala**, honouring Africa Education Icons 2006–2026. Online only; about 20–30 invited live participants; authorised broadcasts; no venue, tickets or red carpet.
- Free nominations, official Google Form only, no public voting. Sponsorship and donations carry zero judging weight.
- Nomination Review Committee (NRC); **9 Independent Judges · 27 Nomination Review Committee members**.
- Organisations may self-nominate; individuals only where approved category guidance allows it. Multiple category appearances remain permitted.
- No invented content or automatic status promotion. Missing approved content: visible dashed **CONTENT REQUIRED**, tracked in `docs/content-required.md`.

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

The detailed Phase 0 audit remains the search inventory; inspect hits in context, particularly admin-only finance and historical data. Preserve protected admin/NRC/judge routes, permissions and existing review decisions.

## Phases and review gates

### Phase 0 — refresh baseline and content inventory
Confirm original brand rules remain restored; do not redesign. Update the conflict audit and superseded notices to reference the latest brief, distinguishing exact approved copy from missing body content. Locate the full Master Document before transcribing all 22 category definitions; do not infer missing names or criteria from counts. Refresh `docs/content-required.md` with missing enquiry forms, SCEF role, category purposes/eligibility/evidence, certificate method, running order/platforms, eight contact destinations and partner approval/permissions. Capture baseline at 390/1440 and inspect header at 1920. Run the existing startup-integrity checks. **Stop for review.**

### Phase 1 — taxonomy and shared dates
Create the single public `taxonomy2026.ts` registry from Master Document §§6–26 with tier/category/subcategory metadata and legacyCode mappings. Preserve legacy nomination keys, existing records, eligibility and research registry provenance; unresolved mapping is a review item, not automatic reclassification. Use canonical shared nomination/certificate dates and event date across public consumers. Tests assert 4/22/90, 27/63 splits, three Icon categories/pathways, tier naming, legacy mapping integrity and the concrete date boundaries. **Stop for review.**

### Phase 2 — homepage, public copy and metadata foundation
Apply supplied homepage copy verbatim in its 12-part order: alert/header, existing-photo hero, work/three steps, four tiers, recognition integrity, nomination invitation, online gala date block, seven media channels, separately labelled endorsers/sponsor rows, separate education-support/sponsorship panels, footer. Conditional sponsor approval and logo permission take precedence over displaying an unapproved sponsor. Keep a visible missing-approval placeholder where needed.

Replace old public dates/counts/tier names/physical-event claims, public voting and award guarantees. Store new copy in English translation files from the start. Establish shared page metadata; update `index.html` head as part of requested SEO work. Update the banned-content check to allow “Online Awards Gala”; scope it to public rendered output so legitimate private/historical records are not rewritten. **Stop for review.**

### Phase 3 — navigation, footer, public route migration
Use the exact supplied nav items with “More” below 1440px, search, all 12 languages, Support Education and gold Nominate. Rebuild footer groups using existing components. Keep mobile Nominate/Explore Awards and Sophia clearance. Fix desktop header overlap; remove page-book bar, countdowns and carousels without unrelated styling changes. Audit ordinary, modified and mobile clicks so every Nominate CTA goes to the official form in a new tab. Do not invent SCEF enquiry URLs. Add deliberate redirects for obsolete public links while preserving protected routes. **Stop for review.**

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
Remove public voting/AGC/wallet/earn-AGC/shop/merchandise links and exposure through menus, search and sitemap. Redirect obsolete public addresses to relevant retained pages; keep financial records and legitimate functions admin-only. Verify public denial and authorised admin access separately; no deletion or reclassification of historical data. **Stop for review.**

### Phase 6 — language publication boundaries
Keep all 12 existing languages, including Arabic RTL. New copy remains translation-key driven. Non-English pages remain unpublished until SCEF supplies approved translations; do not automatically translate, publish stale translated copy, or advertise unpublished alternates in sitemap/hreflang. Use existing publication controls where available and make missing approval explicit. **Stop for review.**

### Phase 7 — verified data, certificates and security
When Cloud is active, verify status/evidence/consent before public profile publication and real certificate download authorisation; preserve protected research staging and review tools. Do not auto-promote seeded or unconfirmed candidates. Test signed-in authorised flows with real readable results.

Inspect live schema/policies for the two role/badge alerts before changing access: source migrations indicate reference definitions, separate from private assignments. Keep findings active while live verification is unavailable; ask before any restriction that breaks legitimate public display. No silent dismissal or destructive security change. **Stop for review.**

### Phase 8 — final checks, still no publishing
Check all retained public routes, redirects, nomination clicks, exact dates/counts, consent/status rendering, enquiry placeholders, all language states, keyboard/focus access, image loading and mobile fit. Validate route-specific titles/descriptions/canonicals and sitemap. Event JSON-LD: online attendance, VirtualLocation, 2026-12-13, no offers; do not invent a broadcast URL. Preserve single-string Helmet titles and startup-integrity protections. Run relevant tests, accessibility/performance checks and screenshots at 390/1440 plus header at 1920. Report remaining blockers. **Stop for final review; do not publish.**

## Small source ambiguities handled without inventing content
The supplied homepage title is a specific exception to the general title suffix rule; other titles use concise variants under 60 characters ending `| NESA-Africa 2026`. Exact navigation labels are retained. Sponsor approval, logo permissions, authorised platforms, missing category bodies and SCEF enquiry forms remain CONTENT REQUIRED until supplied. The external Google Form's own availability/submission confirmation cannot be controlled or claimed from website copy alone.