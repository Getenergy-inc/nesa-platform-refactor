# NESA-Africa 2026 Content Sync + Volunteer Command Center

Four work streams, executed in this order. All public-facing copy comes verbatim from the brief you pasted; internal volunteer hub builds the operations toolkit.

---

## 1. Vision, Mission & Objectives (public landing)

File: `src/components/nesa/VisionMissionObjectivesSection.tsx`

- Replace existing vision/mission/objectives copy with the exact wording from section 1 of the brief.
- Render as three blocks: Vision (single paragraph), Mission (single paragraph crediting SCEF + UN SDGs + AU 2063), and Objectives (numbered list of all 7, including the SMART and 2035 ones).
- Keep current Charcoal/Gold styling, Playfair display headings, framer-motion fade-in.
- Strip the old "15 objectives" wording everywhere it referenced this section.

## 2. Season Timeline sync (public)

Files: `src/config/schedule.ts`, `src/components/nesa/TimelineSection.tsx` (read first to confirm shape), `src/components/nesa/CountdownSection.tsx` if it hardcodes phase dates.

Canonical 2026 timeline (from section 7):

| Phase | Dates |
|---|---|
| Public Pre-Nomination Activation (Kickoff) | 20 May 2026 |
| Jury Onboarding (internal) | 29 Jun – 10 Jul 2026 |
| Platinum Recognition Show | 5 Jul 2026 |
| Gold Certificate Nominations Close | 10 Jul 2026 |
| Africa Education Icon Show + Nominations Open | 12 Jul 2026 |
| Gold Certificate AGC Voting | 15 Aug – 15 Sep 2026 |
| Icon Nominations Close | 12 Sep 2026 |
| Gold Certificate Winners Show | 16 Sep 2026 |
| Momentum Phase | 16 Sep – 15 Oct 2026 |
| Blue Garnet Voting (60% jury + 40% public) | 16 Sep – 22 Oct 2026 |
| Blue Garnet Awards Gala (Lagos) | 22 Oct 2026 |
| Rebuild My School Africa | 23 Oct 2026 → Oct 2027 |

- Update `DEFAULT_SCHEDULE_TEMPLATE` / `buildTimeline` so dates flow into `TimelineSection`, `KeyDatesBanner`, and `CountdownSection` from one source.
- Keep season config (`src/config/season.ts`) unchanged for `ceremonyDate` (already 2026-10-22 18:00).

## 3. Award Tiers — 4 tiers · 18 categories · 96 subcategories (public)

New file: `src/config/awardTiers2026.ts` — typed array of tiers with category, subcategory count, vote mechanic, CTA, key dates.

New section: `src/components/nesa/AwardTiersSummarySection.tsx`, lazy-mounted in `NESALandingPage.tsx` between Vision/Mission and Ecosystem.

- 4 tier cards (Blue Garnet · Platinum · Icon · Influencers) with type, vote mechanic, dates, and a "View categories" disclosure listing the 18 categories with subcategory counts.
- Include Master Summary row (18 categories, 96 subcategories total).
- Subcategory names: only the confirmed ones (Cat 5 NGO Nigeria, Cat 17 Icon, Cat 18 Influencers) get inline names. The rest render "Subcategories: N · pulled from platform" with a link to the dedicated category route. No invented names.
- CTAs per tier: Nominate / Vote, Recommend Again, Nominate, Nominate / Vote.

## 4. Volunteer Command Center (internal)

New route: `/volunteers/command-center` (linked from existing `/volunteer` page footer, not added to public nav).

New files under `src/pages/volunteers/`:
- `CommandCenter.tsx` — page shell using `NESAHeader` + `NESAFooter`, gated behind sign-in (uses existing `AuthContext`; unauthenticated users see CTA to sign in).
- `sections/MissionStatementCard.tsx` — section 2 mission statement, pull-quote styled.
- `sections/SocialChannelsTable.tsx` — section 3 handles + the 4 mandatory hashtags.
- `sections/TeamStructureGrid.tsx` — section 5 four-team table (Alpha, Beta, Gamma, Central) with capacity, KPI, weekly time.
- `sections/SmatObjectivesAccordion.tsx` — section 6 five SMAT objectives with team-to-objective mapping at the bottom.
- `sections/NominationCaptionsLibrary.tsx` — section 8, all 22 captions grouped by tier with copy-to-clipboard buttons.
- `sections/PlatformAdaptationGuide.tsx` — section 9 table (Instagram / TikTok / Facebook / X / LinkedIn formats + CTAs).
- `sections/SubmissionProcessSteps.tsx` — section 10 four-step checklist with file-naming pattern in `<code>`.
- `sections/AssignmentTracker.tsx` — section 11 list of all 22 categories with read-only "assignee" placeholder column (no backend yet — purely a printable reference for now).

Routing: add lazy route in `src/App.tsx` (or wherever pages are registered — confirm first).

Styling: Charcoal background, Gold accents, Playfair headings, Inter body — matches existing project standards. Tabs (shadcn `Tabs`) across the top to jump between Mission, Teams, Objectives, Captions, Platforms, Process, Tracker.

## Technical notes

- All copy lives in component files (English only for now). Translations not added — `i18n` keys are out of scope for this pass.
- No database tables added. Assignment tracker is static; we can wire to Supabase later if you want assignments persisted.
- No changes to `src/integrations/supabase/client.ts`, no new edge functions, no new migrations.
- Tests: no new Playwright specs — banned-strings and unit suites will run on save.

## Out of scope (flag for next pass)

- Pulling the missing subcategory names for categories 1–4 and 6–16 from `CategoryMasterIndex.tsx`/admin — requires the export you mentioned.
- Persisting volunteer assignments to a `volunteer_assignments` table.
- Localising the new volunteer hub into the other 10 languages.
- Updating category landing pages (`src/pages/categories/*`) to match the new subcategory counts — separate sweep once subcategory names land.
