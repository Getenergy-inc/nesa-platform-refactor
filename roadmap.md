## First navigation bar additions — 14 Nov 2026
- [x] Owner confirmed three separate links: Buy Merchandise, NRRC Portal and Judges Arena; merchandise goes to the existing Contact page, not a reopened shop.
- [x] Verified all three desktop links by opening their existing destinations and all three mobile Quick Links at 915px; seven navigation tests passed and preview build OK. Styling and workspace guards unchanged; no publishing.

## Keyboard navigation for both bars — 13 Nov 2026, 21:53 UTC
- [x] Capture current contact-page header and audit opening, movement and Escape behaviour using keyboard input and existing accessible primitives.
- [x] Improve grouped desktop menus and utility Sign In using existing Radix menubar/dropdown primitives, preserving labels, destinations and gold focus styling; ordinary Contact remains a link.
- [x] Improve mobile visible focus and Sign In focus movement; retain the existing drawer focus trap and Escape behaviour.
- [x] Verified all five desktop groups for Arrow Down entry, movement, Home/End, Escape/focus return; cross-group Arrow Right/entry and Tab exit; both Sign In controls; mobile opening, accordion Tab movement, Sign In focus, focus trapping and Escape/focus return at 915px/390px. Five navigation unit tests passed and latest preview build OK. Added retained E2E tests; JS runner cannot launch its missing browser version, so equivalent Python Playwright checks passed instead. No page-content, permission or data changes; nothing published.

## Navigation bars 1 and 2 — 13 Nov 2026, 21:44 UTC
- [x] Read the supplied Draft Lean NESA-Africa Navigation Bar and inspect the live shared header, primary/utility menu configuration and sign-in menu.
- [x] Owner granted “Exempt navigation only”; limited to bars 1 and 2 and their desktop/mobile menus, not wider security clearance or publication.
- [x] Owner approved the navigation plan unchanged: group existing links under About, Recognition, Impact, Media and Get Involved; keep Contact, both existing bars and original visual styling; place NRRC/Judges under Sign In, preserve destinations/access rules, and retain Nominees at the mobile first level as supplied.
- [x] Applied shared desktop/mobile groups, upper utility Sign In/authorised nomination links, six-workspace Sign In selector, NRRC wording and removal of header AGC/signup links. Preserved existing destinations, guarded workspaces, colours, fonts, logo, bar heights and all languages; no routes redirected or data/access rules changed.
- [x] Five navigation tests passed; latest preview build OK; desktop dropdown Enter/Escape and pointer operation, E-Journal link, nomination form consistency, 915px/390px mobile accordions and volunteer/admin sign-in redirects verified with screenshots and no page errors. NRRC/Judges existing entry pages and nominee sign-in gate checked. Authenticated workspace contents were not exercised: outside the navigation-only exemption; wider Phase 0 hold remains. Nothing published.

## Site-wide December date correction — 13 Nov 2026, 21:31 UTC
- [x] Replaced every active-source 13 December/13 Dec/2026-12-13 occurrence with 28 December/28 Dec/2026-12-28 across website content, connected timelines, saved project copy and date checks; used Monday for the 2026 programme and updated the connected 2027 anniversary endpoint. Updated three live FAQ answers through a new migration; historical migrations and the regression-test pattern intentionally retain the old value.
- [x] Verified eight affected routes plus 390px About rendering, zero remaining live FAQ matches, build OK and all new date checks. Focused run: 68 passed; seven pre-existing nomination-window checks still fail over September/November vs 9 November–31 March mismatches, unrelated to this correction. Uploaded source documents are read-only historical inputs. Nothing published.

## Unified NESA-Africa & EduAid-Africa framework — 13 Nov 2026
- [x] Review the final NESA-Africa/EduAid-Africa/SCEF page-copy deck received at 20:56 UTC and record its source, notices, unconfirmed facts and retained wording-only/Phase 0 restrictions in framework memory; no application changes.
- [ ] After Phase 0 clearance and applicable phase approval, use the final deck's exact copy on existing NESA-Africa surfaces only; defer new pages, reordered sections, new controls/forms, signup/payment workflows and route/role migrations. Other-site updates require authorised project access; bracketed facts and conditional funding allocations require confirmation.
- [x] Record owner's 19:03 update in the framework memory: NRRC naming/description/CTAs, eight programme-operational regions, separate school-support service, US$1.2 million 2027 fundraising target (US$150,000 per region) and exact separation notice; no website changes or publishing.
- [ ] After Phase 0 clearance and applicable phase review, apply NRRC visible wording across existing pages/navigation/dashboards/forms/emails/appointment-letter templates/role descriptions/metadata/notifications; update existing school-support and operational-region wording without design or geographic-data changes. Recruitment remains closed unless formally opened; no regional totals before an approved country-to-region register.
- [ ] Separate future scope only: preferred /nrrc routes and permanent /nrc/* redirects, and nrc→nrrc role/status/assignment mappings after security clearance and migration testing; preserve user IDs, audit logs, assignments, timestamps, evidence, access rules and history. Excluded from the wording-only pass.
- [x] Apply owner's 18:55 correction to scope: wording and existing link destinations only; preserve every layout, component, section order, colour, font, spacing, image, card style and page structure. No application design edits occurred during the preceding plan/review step, so no design rollback is needed.
- [ ] Apply permitted Unified Framework wording after Phase 0 clearance; skip homepage reordering, added/removed sections, participation cards, new controls, new workflows and backend changes under the text-only correction.
- [x] Record the latest owner-approved framework and inspect the existing navigation, redirects, official accounts and Phase 0 evidence.
- [x] Review and approve the incremental implementation plan.
- [ ] Clear Phase 0: approval record and clearance checklist still BLOCKED after plan approval; independent security sign-off and exact written "Phase 0 approved" evidence remain missing. Existing recovery restrictions block application execution and protected changes; plan approval is not security clearance.
- [ ] Text phase 1: shared facts, existing menu labels/link destinations, nomination destination and exact announcement; no navigation restructuring.
- [ ] Text phase 2: homepage, About, recognition and online programme wording in their unchanged existing sections.
- [ ] Text phase 3: school support, volunteers, chapters, sponsors and official account text on existing support/donate pages; no added controls or payment functionality.
- [ ] Text phase 4: existing nomination/profile/contact notices only; status-model, publication-rule and contact-save functionality changes excluded.
- [ ] Text phase 5: existing NRRC/judge/sign-in labels and notices after clearance; no new cards, dashboards or role/access logic.
- [ ] Text phase 6: legacy English copy, metadata/Open Graph, alt text, FAQs and email-template wording; report every wording/link change and excluded design/functionality work; no publishing.

## Phase 0 protected-page publishing guard — 13 Nov 2026
- [x] Add fail-closed protected governance/judges diff checks, structured approval evidence, a prebuild hook, CI workflow and focused tests; no protected pages changed or publishing performed.
- [ ] Make the Phase 0 Protected Pages Guard a required status check in repository branch protection — repository administration is required.

## Special Needs School programme and participation pages — 12 Nov 2026
- [x] Extend the existing programme page and school-support registry with the supplied programme copy; preserve the current theme and fail-closed school visibility.
- [x] Add the canonical programme and eight-option participation routes, config-driven NESA form link and config-gated voting label.
- [x] Verify seven focused rules, both routes, 390px/1440px rendering and the missing-form/voting-disabled states; build OK; do not publish.
- [ ] Activate the external NESA-Africa participation form — authorised SNS_FORM_URL not supplied; page currently displays CONTENT REQUIRED and no external link.

## Page-specific refactor template — 12 Nov 2026
- [ ] Await the concrete route, file, Section 3 page copy and word budget; the received template contains placeholders only, so no page files changed.

## Public navigation, mobile actions, footer and redirects — 12 Nov 2026
- [x] Confirm use of the live header/mobile files and resolve the missing footer-link list and programme-updates destination.
- [x] Apply the seven-item main menu, four-item mobile grid, official nomination CTA, requested footer additions and legacy redirects without editing page content.
- [x] Verify all ten generated redirects, nine navigation/footer browser checks, twelve desktop header checks and 756px/390px layouts; build OK; no publishing.

## Africa Special Needs Education Support Fund 2027 — 12 Nov 2026
- [x] Read the latest programme brief and prepare a staged plan preserving the security hold and existing branding.
- [x] Receive approval of the staged programme plan; approval does not clear the mandatory Phase 0 security hold.
- [ ] Obtain security clearance and written phase approval before executing application code or implementing website changes.
- [ ] Confirm authorised EduAid-Africa project access, official forms, approved regional mapping and voting governance inputs.
- [ ] Add matching programme and participation pages, eight service groups, timetable and shared safeguards on both websites after clearance.
- [ ] Implement approved-only school visibility, source-recorded participation and separate donation-interest/payment statuses.
- [ ] Implement and verify controlled school-only voting; keep disabled until all authorisation conditions are met.
- [ ] Test both sites' actual flows, mobile/desktop accessibility and privacy; supply 390px/1440px before/after evidence and stop for written review without publishing.

## Security recovery and CTA master prompt — 12 Nov 2026
- [x] Phase 0: Deliver local/repository recovery inventory, security findings and rotation checklist using static inspection and read-only Cloud queries; no application code executed.
- [x] Add a 26-check Phase 0 security-clearance tracker with evidence requirements, responsible roles, review ledger and exact written-approval record; no security checks newly marked accepted.
- [x] Inventory both public GitHub repositories, branch revisions/authors, protection flags, manifests and available divergence comparisons.
- [ ] Complete collaborator/ruleset/force-push audit — authenticated repository-owner access required; some branch comparisons unverified.
- [ ] Clear confirmed obfuscated init and hidden editor/font execution hooks — approved containment change and independent security review required.
- [ ] Obtain a dated full database/Auth export and storage-file backup with tested rollback — existing package contains metadata only.
- [ ] Obtain Phase 0 clearance and written "Phase 0 approved" before Phase 1; no application execution, installation, deployment or publishing.
- [ ] After Phase 0 clearance: replace the NRRC page description with the approved wording (incl. "The NRRC does not make the final Africa Education Icon recognition decisions."), wording only. Blocked by Phase 0.
- [ ] After Phase 0 clearance or owner exemption: apply the lean 14-page copy (uploaded 21:18 UTC) verbatim to existing pages, wording only, one page per review.
- [ ] Resolve uploaded-brief conflicts with earlier gala-date, certificate-window, social-channel and selection-criteria approvals before content changes.

## Africa Education Icon selection criteria — 9 Nov 2026
- [x] Add the shared eight-criterion, 100%-weighted EDI selection section and ten-year evidence notice to the gala and Icon pages.
- [x] Verify all four public URLs, 22 focused unit tests, eight desktop/mobile browser checks and 390px/1440px layouts; build OK; do not publish.

## Online Awards Gala recognition focus — 9 Nov 2026
- [x] Approve the focused gala-content plan: up to nine verified Africa Education Icons of the Decade; preserve design and do not publish.
- [x] Align connected public gala descriptions and metadata; preserve legacy taxonomy, protected records and certificate timing.
- [x] Verify gala content, award link and 390px/1440px screenshots; 25 unit tests and 21 public cleanup browser checks passed. Stop for review; no publishing.

## Online Awards Gala reschedule — 9 Nov 2026
- [x] Update all website gala date references to Monday 28 December 2026; preserve independent nomination, verification and webinar dates.
- [x] Verify shared dates, announcement, seven public routes and 390px/1440px/762px rendering; 19 focused tests passed; do not publish. Existing broad timeline checks still report seven unrelated nomination-date inconsistencies; no nomination deadlines changed in this task.

## Africa Special Needs Education Support Fund — 9 Nov 2026
- [x] Review and approve the phased school-support addition plan; retain existing design and do not publish.
- [x] Phase 1: Add shared school CTAs, homepage section, navigation/mobile/footer, canonical public profile and programme/impact-story surfaces; 12 unit and 28 browser tests passed.
- [ ] Review Phase 1 before starting Phase 2 country-first nomination and Phase 3 approved-school support.
- [ ] Update country-first nomination with verification notice; official regional form URLs are not supplied.
- [ ] Enforce verified-and-approved school visibility, filters, distinct progress states and controlled support options.
- [x] Phase 1: Verify school actions and fail-closed publication safeguard; review 390px/1440px before/after screenshots and 762px layout.
- [ ] Verify Phase 2/3 nomination, approved-school filtering and support processes after the phase review gates.
- [ ] Activate official nomination/support channels — blocked by missing authorised URLs.

## Restore repair and site-wide CTA/follow refactor — 8 Nov 2026
- [x] Repair the five failing package migrations so a clean restore needs no production rows.
- [x] Reconcile all reported schema differences with authoritative live metadata; distinguish real drift from comparator/bootstrap artefacts.
- [x] Rerun strict mode across all 169 migrations and require zero verified schema differences.
- [x] Run restore unit tests and rebuild the validated migration package without touching production.
- [x] Fix the current homepage preview while completing the shared header, CTA, Follow-link and mobile-bar cleanup.
- [x] Complete Phase 1 CTA and Follow-link cleanup across shared public pages, with 390px and 1440px review screenshots and 34 passing checks; do not publish.

## Automated clean-database restore test — 8 Nov 2026
- [x] Add an isolated runner for all 169 migrations with a clean-database safety guard.
- [x] Compare restored schema objects with the exported live metadata and write machine-readable and human-readable reports.
- [x] Run the restore test, package the scripts and honest results in a new migration ZIP, and verify archive integrity.

- [x] Factual check: /nominees/lane/ngo-africa route, data source, counts, category identity
- [x] LaneGalleryPage refactor (focus-area tabs, region filter, NomineeAvatar fallback)
- [x] Verified page renders 85 live nominees (tabs, filters, pagination OK)
- [x] Refactor attached-document award and subcategory content, preserving existing routes and nomination rules.
- [x] Stage 2,044 identifiable PDF candidates privately with provenance and within-pathway deduplication; no public nominees created.
- [x] Verify public research pages, live searches, profile links, fallbacks, 320–1440px layouts, 85 frontend tests and 4 extraction tests.
- [ ] Verify administrator staging screen end-to-end — requesting account has only user role; requires an authorised administrator session.
- [ ] Clear public reference-table alerts — schemas and policies confirmed intentionally public, awaiting approval to dismiss false positives.
- [ ] Replace public award hierarchy with the approved four tiers, 22 main awards and 90 subcategories from the two master documents.
- [ ] Apply tier/category/subcategory editorial guidance to award pages and nomination selections while preserving existing nominations, links and review rules.
- [ ] Treat individual states as nominees and six zones as geographic groupings; verify counts, guidance and nomination navigation.
- [x] Send every website nomination button and CTA to the official Google Form (single shared link), embedded on the nomination page with open-in-new-tab.
- [x] Remove hidden harmful start-up code that arrived via the 18 Oct GitHub merge (start scripts, style config, editor auto-run task, fake font files).
- [ ] Confirm volunteer badge list is only public badge definitions — database unreachable this turn.
- [ ] Lean Website Pack v2 (WP-1–WP-12) — blocked on "Gate 0 approved"; Icon weight visibility needs confirmation
- [ ] Reconcile public judge/NRC counts after Gate 0 — NRC confirmed at 9 per tier (36 total); Icon category confirmed at exactly 9 judges; other judge totals unconfirmed.
