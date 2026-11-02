# NESA-Africa 2026 website refactor — phased plan (replaces the earlier plan)

Sources of truth: the Master Document (2 Nov 2026) and this brief, including its decisions, copy, metadata and design tokens. Nothing is published. I stop for your review at the end of every phase.

Kept as they are:
- Every Nominate button still goes through the existing link router to the official Google Form. Its existing test stays.
- Existing category codes are kept as `legacyCode`.
- Admin, NRC and judge tools stay at their current protected addresses.
- The harmful start-up scripts, editor tasks and fake font files are never brought back.
- Nothing is invented. Every missing item shows a visible dashed "CONTENT REQUIRED" box and is listed in `/docs/content-required.md`.

## Where the brief clashes with the current site

| # | Current site | What the brief says | What I'll do |
|---|---|---|---|
| 1 | Saved project rules: charcoal/black background, gold accents, "no blue/navy", Playfair Display headings | Blue, garnet and white palette; Source Serif 4 and Inter; gold for decoration only | Follow the brief. Rewrite the saved style rules so they don't conflict |
| 2 | The old 18-form category list is treated as the master list | `taxonomy2026.ts` is the only source, with `legacyCode` linking back | Follow the brief. Old nomination keys still resolve through `legacyCode`, so existing nominations are unaffected. Update the project rules file |
| 3 | Saved rule: CSR Africa uses 5 regions plus Pan-African | Master doc §18 lists 6 industry subcategories | Use the master doc. Update the saved rule |
| 4 | Saved rule: 27 Icon judges in a 3-3-3 structure; the docs say 27 judges and 99 subcategories | 9 Independent Judges · 27 NRC members | Mark those docs as superseded. Update the saved rule |
| 5 | The Master Document's status order | The brief's confirmed order, with Nominee before Featured | Use the brief's order |
| 6 | 12 languages exist, and the Sophia chat answers in 11 | Launch with en/fr/ar/pt only; non-English addresses stay unpublished | **Question A** |
| 7 | Mobile quick-action bar, a "Page 1 of 39" book-style page bar, and the Sophia chat bubble all sit at the bottom of the screen | A fixed bottom bar with Nominate / Explore Awards | Replace the quick-action bar. Remove the book-style page bar from public pages. Move the chat bubble above the new bar |
| 8 | Countdown timers, the influencer slider and video carousels | No carousels, no countdowns | Remove them from public pages |
| 9 | `/nrc` and `/judges` are landing pages; the NRC Arena lives at `/nrc/arena/*` | Redirect `/nrc` and `/judges` | Redirect the exact addresses only. `/nrc/arena/*` and the judge tools stay untouched |
| 10 | Page titles and the contact, donate and sponsor forms would read from or save to the database | The database is paused | Page titles come from a config file, with the database able to override later. **Question B** covers where form messages go |
| 11 | The banned-words check scans source files only, and voting words only give a warning | Scan the HTML visitors actually see, including "winner" outside allowed statuses | Keep the source scan and make it strict. Add a test-browser crawl of every public page for the rendered check |
| 12 | Page titles change only after the page loads | Unique titles, hreflang tags and per-language sitemaps | Google will see these. Link previews on WhatsApp, Facebook and similar apps will still show only the site-wide title, because this setup builds pages in the visitor's browser |
| 13 | No accessibility or Lighthouse test tools installed | axe tests and Lighthouse scores | Add the axe test tool for development only. Run Lighthouse with a temporary tool at QA time |

## Phases

**Phase 0 — Audit and safety**
- Write `/docs/refactor/audit-2026-11.md`: every file that conflicts with the brief (counts, gala and tickets, voting/AGC, shop, old dates, blanket "verified" labels, sponsor logos near judging, old pricing).
- Add an automated check, and a test, that fails if any of these appear: `node init`, `node api.js`, `createRequire(import.meta.url)`, `allowAutomaticTasks`, or a `.vscode/tasks.json` file.
- Add a "superseded" note to the top of each conflicting doc in `/docs/refactor`.
- Create `/docs/content-required.md`.

**Phase 1 — The single award list**
- `src/config/taxonomy2026.ts` holds the 4 tiers, 22 categories with their slugs, 90 subcategories, 3 Icon pathways and the 10 statuses, plus a `legacyCode` link for each category.
- Site stats, menus, filters, nomination link details, page titles and every count read from it.
- Tests for the counts (4 / 22 / 90 / 27 / 63), for exact names against the master doc, and that every old code links to a category.

**Phase 2 — Wording and page titles**
- Remove the banned terms. Add the trust messages and the final homepage copy, word for word.
- Add `src/config/pageMeta.ts` with the brief's titles and descriptions, then fix `index.html`.
- Extend the banned-words check as in row 11 above.

**Phase 3 — Site frame**
- New shared parts in `src/components/site/`: the alert bar, header, footer, mobile menu, bottom bar, breadcrumb, and the loading, empty and error displays.
- Header fix: the logo has a fixed width so it never overlaps the menu. Impact, Partners, Resources and Contact move into "More" below 1440px.
- Screenshots at 1280, 1440, 1600 and 1920px, and checks at 320 and 360px for no sideways scrolling.
- Add the redirects to the existing redirect generator, plus a test that every redirect lands on a live page.
- New design colours and fonts, focus ring, skip link and reduced-motion support.

**Phase 4 — Pages**
- Awards, the 4 tier pages, and one template that renders all 22 category pages (unknown addresses show a 404 with links to Awards).
- Research & Judging, Evidence, 2026 Programme, Partners (6 role sections and the related-party note), Get Involved, Support EduAid, Sponsor, Resources, FAQ, Governance, Contact, the legal pages, Search, Nominate, the nomination start page and the confirmation page.
- Website filters are saved in the address so they can be shared. Event and breadcrumb data for search engines, plus the brief's analytics events.

**Phase 5 — Switch off wallet, voting and shop for the public**
- Remove all public links and redirect their addresses.
- The admin screens and stored data stay; nothing is deleted. Confirming the admin screens still load needs the database.

**Phase 6 — Language structure**
- `/fr`, `/ar` and `/pt` addresses; right-to-left layout for Arabic with the Noto Sans Arabic font; a language switcher; hreflang tags.
- The build fails if any translation key is missing in fr, ar or pt. Missing translations are filled with "CONTENT REQUIRED" text.
- Non-English addresses are hidden from search engines and the sitemap until SCEF supplies translations.
- Nominate buttons use the English form until each language's form address is supplied.

**Phase 7 — Data features (needs the database turned back on)**
- New tables for nominees, evidence, media, impact stories, organisations, programme sessions, FAQs, team members and so on.
- Public visitors only see items that are both published and consented.
- Status changes happen only through a logged admin action; nothing moves up a status automatically. Each existing nominee is matched to the status ladder, defaulting to "Identified".
- Migrate podcast episodes 8–9 and webinar weeks 8–9.
- Resolve the two open security warnings (role names and volunteer badges).

**Phase 8 — QA**
- All tests; axe (zero serious or critical problems); Lighthouse on mobile; a report of the results. No publishing.

## Questions to answer before Phase 3

- **A. Other languages:** what should happen to the 8 other languages (Hausa, Swahili, Yoruba, Igbo, Zulu, Amharic, Chinese, Hindi) and the Sophia chat's answers in them?
  1. Keep their files but hide them from the switcher.
  2. Remove them.
- **B. Contact, donate and sponsor enquiry forms:** where should messages go?
  1. Saved in the database. This won't work until it's turned back on.
  2. Open the visitor's email app, addressed to approved addresses. This needs the addresses.
  3. Google Forms, like nominations.
- **C. Nominate button colour:** garnet replaces gold. Please confirm the new palette also applies to the admin and NRC dashboards, or only to public pages.

## Technical notes
- `App.tsx` (2,887 lines, 581 routes) gets route groups split into lazy-loaded modules, to meet the 200KB first-load target.
- `/support` currently opens the policies tab page. It redirects to `/contact`, and the policies move to `/resources` and the legal pages.
- `roadmap.md` gets these phases as tasks once building starts. In this planning step I can only edit the plan.
