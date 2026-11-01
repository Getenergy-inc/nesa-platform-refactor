# NESA-Africa 2026 — Bring the whole site in line with the Master Document

The Master Document is now the single source of truth. Where any page, data file, metadata or `/docs/refactor` file says something different (for example `governance-clarifications.md`, which still says "99 Subcategories"), the Master Document wins. Every nomination button keeps opening the official Google Form. The harmful start-up scripts, `.vscode` tasks and font files stay deleted, and each phase includes a check that they haven't come back.

## 1. What conflicts today (from a search of the site)

| Problem | Where it shows up (examples; Phase 0 produces the full file list) | Change |
|---|---|---|
| "Buy Award Gala Ticket" in the top bar | `config/siteNavigation.ts` | Remove it. Put "2026 Programme" in its place |
| Tickets, gala, ICC Lagos, red carpet, accommodation | `/tickets`, `/gala`, `/events/gala-2026`, `/gala/*`, `pages/Tickets.tsx`, `GalaConsolidated`, `config/sponsorPricing.ts`, `sponsorSlotLimits.ts`, `sponsorLaneCopy.ts`, `content/capability2026.ts` (10 files mention red carpet, 14 mention ICC) | Redirect every gala and ticket address to the new 2026 Programme page. Rewrite the sponsor copy so it offers online-programme packages only |
| Merchandise and shop | `/shop*`, `/merch`, `/merchandise`, `/shop-now`; 48 files | Remove from the menus, the top bar and the footer. Redirect these addresses to Get Involved. Keep the code switched off, ready to bring back if approved |
| Public voting, "vote now", AGC / Afri-Gold Coin, wallet | `/vote`, `/voting-portal` (these already point to a closing page), `/earn-agc`, `/wallet/*`, `NomineeReferralCard.tsx`; 114 files mention AGC | See the decision box below |
| Old counts: 18 categories, 96 / 100 / 135 subcategories, "six recognition families" | `config/siteStats.ts`, `platformCopy.ts`, `recognitionArchitecture.ts`, `awardTiers2026.ts`, `recognition2026/nomineeTypes.ts`, `NESALandingPage.tsx`, `RecognitionHubPage.tsx`, `pages/Awards.tsx`, `EducationChampionsDirectory.tsx`, `GoldCertificateSection.tsx`, `locales/*/pages.json`, `brandHierarchy.ts`, `useFamilyGallery.ts`, `EducationImpactCertificatesPage.tsx`, `masterTimeline2026.ts` | Change everything to 4 Tiers · 22 Categories · 90 Subcategories, all read from one shared registry. Add a test that fails if any old count comes back |
| Old dates: "Public Nominations Open 6 September 2026", the Icon window 6 Sep – 6 Oct and the certificate window to 21 Nov | `nominationWindows2026.ts`, the site-wide banner, `NESALandingPage.tsx`, `AboutCycle2026.tsx`, `Tickets.tsx`, `masterTimeline2026.ts` (9 files) | Replace with "Nominations are continuous" and "13 December 2026 — Online Awards Programme". The nomination lock (StageGate) stays open all year |
| Nominee status labels | "verified" appears in 303 files, mostly on nominee cards, galleries, profiles and the Influencer pages | Show one badge per nominee, mapped from its current record to the §29 status ladder. Records with nothing to support a higher status show "Identified Education Contributor". Statuses never move up by themselves |
| Sponsor or endorser logos near judging | NRC, Judges and Judges Arena pages, and the sponsor ribbons used inside layouts (Phase 0 confirms which) | Take sponsor and endorser logos off every judging page. Show sponsors only on the Partners page, in its Sponsors section |
| Metadata | Titles and descriptions on each page, `index.html`, sitemap | Use the §72 wording. Remove "Gala Lagos", "AGC voting", "public vote" and the old counts |
| Docs | `docs/refactor/governance-clarifications.md` and other refactor docs | Add a note at the top saying they are replaced by the Master Document. Correct the counts |

**Decision box: what happens to the wallet and voting features.** I recommend switching them off for the public:
- Remove every public link to voting, the wallet, AGC and the shop.
- Redirect the public addresses: voting and the vote pages go to the NRC & Judging page, which says "No public voting in 2026". The wallet and earn-AGC pages go to Get Involved.
- Keep the wallet records and the admin screens, visible to admins only, so nothing is lost and the history can still be checked.
- No data is deleted.

## 2. New site structure (§46) and where every old address goes

| New section | Address | Where existing pages go |
|---|---|---|
| Home | `/` | — |
| About | `/about` | `/about/*`, CVO message, About Cycle |
| Awards | `/awards` | `/recognition/*`, `/categories/*`, tier pages, research pathway pages (these stay as sub-pages) |
| Nominate | `/nominate` | `/nominate/*` stay. Every button opens the Google Form |
| Nominees | `/nominees` | `/nominees/*`, galleries, profiles |
| NRC & Judging | `/nrc-judging` (new) | `/nrc`, `/judges`, the judges directory; `/vote*` redirect here |
| 2026 Programme | `/programme-2026` (new) | `/gala*`, `/tickets`, `/events/gala-2026`, timeline |
| Media | `/media` | TV, podcast, webinars, e-Journal, radio pages |
| Impact | `/impact` | Rebuild My School and impact pages |
| Partners | `/partners` | Endorsers · Sponsors · Institutional · Media · Supporters, in separate sections; `/sponsors` and `/partner-with-us` |
| Get Involved | `/get-involved` | Volunteer, donate (EduAid-Africa), sponsor, `/shop*`, `/wallet*` |
| Resources | `/resources` | Policies, guides, FAQ, media kit |
| Contact | `/contact` | Support |

Footer (§67): About · Awards · Nominate · Governance · Media · Partners · Contact · Privacy · Terms · Accessibility · Safeguarding · Complaints.

All old addresses get redirects through the existing redirect file, so no links break. A test checks that every redirect lands on a real page.

## 3. Header layout bug and mobile order

**Desktop:** at 1920px the logo overlaps About / Icon / CSR, and the two hero buttons collide with the menu. The fix:
- Give the logo a fixed width that can't shrink.
- Reduce the main menu to the 13 sections in §46. Put the less-used ones under a "More" menu once the screen is narrower than about 1440px.
- Remove the duplicate top bar.
- Place the hero below the full header height.
- Screenshot and check at 1280, 1440, 1600 and 1920px.

**Mobile (§74):** show the page in this order: hero → Nominate → four tiers → categories → no-public-voting notice → 13 December programme → support / sponsor → media → contact. Reduce heavy animations.

## 4. Are all 22 categories and 90 subcategories present with the exact names in §6–§26?

Phase 1 runs a script that compares the document word for word with the award list added last time. From earlier work, these need correcting:
- **14 CSR Africa:** the site uses regions; the document uses six industry subcategories. Use the document's six.
- **22 State:** the six zone names match. The plan keeps individual states as the nominees.
- **15 CSR Nigeria (23 subcategories):** wording varies, for example "Banking & Finance CSR" versus "Banking & Financial Services".
- **Tier 2 influencer pathways:** the site uses older pathway names.

Phase 1 also produces the exact list of anything missing or misnamed, before any public page changes.

## 5. Nomination rules (§27, §56, §77)

- Every nomination button keeps opening the Google Form.
- "Nomination is free" appears next to every one.
- Donate (EduAid-Africa) and Sponsor have their own colour and their own sections. They never sit inside a nomination button group.
- A test checks that every nomination button points to the Google Form and never to a payment or donation page.

## 6. Questions to answer before building

1. **§29 status order:** should "Featured" (4) come before "Nominee" (5)? Should "Certificate of Recognition Recipient" (7) rank below "Shortlisted Nominee" (8)? Please confirm the intended order.
2. **Self-nomination (§27 vs §78):** organisations only, or individuals too where the category allows?
3. **Governance page:** the footer links to Governance, but §46 has no Governance page. Should it be a standalone page, or part of NRC & Judging?
4. **Overlaps:** can one person or organisation be entered in both:
   - Tier 2 Music and Creative Arts "Music Industry Contribution"?
   - Tier 2 Social Media and CSR Nigeria "Social Media Influencers / Creator CSR"?
   - the Diaspora Icon pathway and Platinum category 13?
5. **Tier 4 name:** "Gold-Blue Garnet" or "Gold-Blue"?
6. **GET Energy Trading Services** is both a sponsor and a funder of SCEF, the host. Should the site show a related-party disclosure?
7. **Judging numbers:** is "9 Independent Judges · 27 Nominee Research Corps Members" approved for display? A governance file in the project mentions 27 judges.
8. **NRC wording:** the document says "Nominee Research Corps". The site was recently changed to "Nomination Review Committee". Which name is correct?
9. **Wallet and voting:** do you approve switching them off for the public and keeping them for admins only, as in the decision box above?

## 7. Build order, lowest risk first

| Phase | What | Needs the database? |
|---|---|---|
| 0 | Produce the full list of every file that conflicts. Add the safety check for the harmful files. Mark the old docs as replaced | No |
| 1 | One shared award registry for 22 / 90, the name-by-name check, and fixes to every count and copy | No |
| 2 | Wording and metadata: remove gala, tickets, voting and AGC; add continuous nominations and the 13 Dec online programme; "Nomination is free"; §72 page titles | No |
| 3 | New menus and footer, the header fix, the redirects, and the mobile order | No |
| 4 | New pages: NRC & Judging, 2026 Programme, Get Involved, Resources, the restructured Partners page, Governance (if approved), and the Home page sections from §47–§52 | No |
| 5 | Switch off public wallet, voting and shop links and redirect them; keep admin access | No for links. Yes to confirm the admin-only screens still load |
| 6 | Nominee status badges on cards and profiles | Yes. Reading each nominee's real record needs the database running |
| 7 | Live counts (`site_stats`), the two open security warnings (roles and volunteer badges), and the admin research staging check | Yes |

The database is paused because the workspace has no Cloud credits. Phases 0–5 can go ahead without it. Phases 6–7 wait until credits are added.

## Technical notes
- New `src/config/masterDocument2026.ts` holds the tiers, categories, subcategories, statuses and the main wording. `siteStats`, `platformCopy`, `awardTiers2026` and the existing award registry all read from it.
- The existing category codes, nomination keys and draft keys stay unchanged, so existing nominations are not reclassified.
- Tests to add: no old counts or banned words anywhere on public pages; 22 / 90 exact names; every nomination button points to the Google Form; every redirect lands on a real page; status labels follow the ladder.
- No publishing during the build until you say so.
