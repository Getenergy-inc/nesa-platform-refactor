## Refactor: Influencer Education Impact Award 2026 Recognition Page

Route: `/awards/influencers-education-impact-2026-recognition`
Current page: `src/pages/awards/GoldSpecialRecognition.tsx` (95-line shell composed of `BrandedCategoryHero`, `BrandedDocumentaryPreview`, `GoldTrackNavGrid`, `GoldSpecialRecognitionSection`, `AwardStandardStack`).
Current data: `src/data/goldSpecialRecognition.ts` (3 hardcoded tracks: Sports / Music / Social Media).

This is a large refactor that spans content, taxonomy config, a new nominee-discovery UI, and a small DB schema addition for the classification fields. I will ship it in 4 phases so each can be reviewed before the next runs.

---

### Phase 1 — Taxonomy & config (no DB, no UI yet)

Add a single source-of-truth config for the new framework:

`src/config/awards/influencerImpact2026.ts`

```text
INFLUENCER_AWARD = {
  family: "Influencer Education Impact Award 2026",
  recognitionClasses: ["African Living in Africa", "African in the Diaspora"],
  regions: ["West Africa","East Africa","Southern Africa","Central Africa","North Africa"],
  categories: [
    {
      id: "social-media",
      title: "African Social Media Influencers Education Impact Award",
      platforms: [12 entries — Facebook…Multi-Platform],
      contentImpactAreas: [10 entries — Education Content Creator…Leadership],
      classificationFields: ["primary_social_media_platform","content_impact_area"],
    },
    {
      id: "sports",
      title: "African Sports Icons Supporting Education",
      sportAreas: [11 entries — Football…Multi-Sport Athlete],
      impactAreas: [9 entries — Scholarship Support…Out-of-School Child Support],
      classificationFields: ["primary_sport_area","sports_education_impact_area"],
    },
    {
      id: "music",
      title: "African Music Icons Supporting Education",
      genres: [10 entries — Afrobeats…Multi-Genre Artist],
      impactAreas: [9 entries — Scholarships…Cultural Identity Education],
      classificationFields: ["music_genre","music_education_impact_area"],
    },
  ],
  evidenceCategories: [8 entries — Scholarships Supported…Girls Education Projects Supported],
  edxWeights: { education: 25, development: 30, excellence: 45 },
  governanceRules: [4 disqualifier statements],
}
```

This config drives the hero stats bar, the 3 category cards, nominee filters, profile chips, and the Google-Form-style nomination flow's conditional logic. Nothing else duplicates the lists.

### Phase 2 — Database (small, additive)

The site already has a `nominees` table. The new framework only adds *classification* fields specific to this award family. I will add one new table, `influencer_impact_nominees`, scoped to this award, plus the standard GRANT + RLS block. No FK to `auth.users`.

Columns (domain-specific, per spec):

- Common: award_family, award_category, recognition_class, nominee_name, nominee_country, nominee_region, education_impact_summary, evidence_links (text[]), verification_status
- Social Media: primary_social_media_platform, other_platforms (text[]), content_impact_area, follower_count_range, platform_profile_link
- Sports: primary_sport_area, club_team_or_foundation, sports_education_impact_area, athlete_status, sports_profile_link
- Music: music_genre, other_music_genres (text[]), stage_name, label_or_foundation, music_education_impact_area, artist_profile_link

RLS:
- `anon` + `authenticated` read rows where `verification_status = 'VERIFIED'`
- `authenticated` insert into their own `submitted_by = auth.uid()` rows (status auto-set to `PENDING`)
- Admin / NRC reviewer roles (`has_role(uid,'admin')`, `has_role_code(uid,'NRC_REVIEWER')`) can update verification_status
- `service_role` full access

A short seed migration will copy the 9 existing `GOLD_CATEGORIES` nominees into this table with the new classification fields populated (one-time backfill so the page is not empty on first deploy).

### Phase 3 — Page refactor (UI)

Replace `src/pages/awards/GoldSpecialRecognition.tsx` content (keep the same route) with a composition of new section components, each ≤200 lines:

```text
src/pages/awards/InfluencerImpact2026.tsx           ← new page (route handler unchanged)
src/components/influencer-impact/
  HeroSection.tsx          // new headline, sub, 5-stat bar, 4 CTAs
  RecognitionClassFilter.tsx
  CategoryCards.tsx        // 3 reframed category cards w/ classification chips
  NomineeDiscovery.tsx     // searchable + filterable nominee grid
  NomineeCard.tsx          // photo, name, country, class, category, classification,
                           //   impact area, verified noms count, status, 4 actions
  EvidenceImpactSection.tsx
  GovernanceNotice.tsx
  EDXFrameworkPanel.tsx    // 25/30/45 weights w/ examples per category
useInfluencerNominees.ts   // Supabase hook (filter, search, paginate)
```

Filters wired to taxonomy config: Category, Recognition Class, Region, Country, Platform, Sport Area, Music Genre, Education Impact Area, Verification Status. Search hits nominee_name, label_or_foundation, club_team_or_foundation, stage_name, platform_profile_link, sports_profile_link, artist_profile_link.

CTA wiring:
- Nominate an Influencer → existing nomination flow `/nominate?family=influencer-education-impact&category=<id>` (conditional logic already supported in `NomineeEntryForm`; I'll extend `src/config/nomination/awardCategoryForms.ts` to surface the new platform / sport / genre selects per category).
- Explore Existing Nominees → scrolls to `#nominees`
- Become a Reviewer → existing `/nrc/apply`
- Earn AGC Voting Coin → existing `/earn-agc`

The existing `GoldSpecialRecognition.tsx` shell will redirect to `InfluencerImpact2026.tsx` (same path, swap the element in `App.tsx`). The legacy `/awards/gold-special-recognition` redirect stays intact.

The old `goldSpecialRecognition.ts` data file is left in place (other pages still import it via `GoldSpecialRecognitionSection`); the new page does NOT consume it. We can deprecate it in a later cleanup pass.

### Phase 4 — Tests + governance

- Unit: taxonomy config invariants (3 categories, classification arrays non-empty, no duplicate platform/genre/sport entries, classification fields named exactly as DB columns).
- Unit: `NomineeCard` renders all required chips for each category type.
- Unit: filter reducer (category + recognition class + region intersection).
- E2E (Playwright, single spec): page loads → hero stats visible → switching category card scrolls to discovery → applying Recognition Class filter narrows result count → "Nominate an Influencer" navigates with correct query string.
- Governance notice rendered as semantic `<aside role="note">` so screen readers announce the 4 disqualifier rules.

---

### Out of scope (call out explicitly)

- The Google Form itself is external; I will only extend the in-app nomination flow's conditional logic and link Google-Form CTAs where the user has previously supplied form URLs. If a fresh Form URL per category is needed I'll ask before Phase 3.
- NRC verification queue UI changes — the page only *reads* `verification_status`. Reviewer dashboards stay as-is.
- AGC voting allocation tweaks — the existing `/earn-agc` flow is linked, not modified.
- Removing the legacy `GOLD_CATEGORIES` data and `GoldSpecialRecognitionSection` — kept for backward compatibility; cleanup in a follow-up.

### Order of operations

1. Phase 1 config (single PR-sized change, no risk).
2. Phase 2 migration via the migration tool — needs your approval before it runs.
3. Phase 3 page refactor consuming Phase 1 config + Phase 2 table (with a graceful empty state if the table is unseeded).
4. Phase 4 tests + CI wiring.

**Confirm to proceed, or tell me to start at a specific phase (e.g. "skip the DB table, render from the config-only seed list for now").**
