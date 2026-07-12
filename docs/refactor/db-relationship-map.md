# Database Relationship Map — Target Spine

All schema changes are **additive**; nothing is dropped in Stages 1–8. Existing tables (`nominees`, `nominations`, `judges`, `wallet_*`, `media_assets`, etc.) remain; new columns are nullable and backfilled.

## Recognition spine (new)

```
award_cycles (2026, 2027…)
  └── award_tiers (4)                     tier_id, slug, name, selection_method, public_voting_enabled, judge_review_enabled, governance_review_enabled
        └── award_categories (18)         category_id, tier_id, slug, name, scope_id, geographic_scope
              └── award_subcategories (96) subcategory_id, category_id, slug, name, order
              └── award_classifications*  classification_id, category_id  (Icon only: African-in-Africa / Diaspora / Friend)
              └── category_scopes         scope_id, kind (national|regional|continental|diaspora)
              └── eligibility_rules       rule_id, tier_id|category_id, rule_json
              └── evidence_requirements   req_id, tier_id|category_id, req_json
              └── form_definitions        form_id, cycle_id, tier_id, category_id, subcategory_id, version
                    └── form_fields       field_id, form_id, key, type, order, validation_json
              └── timeline_events         event_id, cycle_id, phase, tier_id?, category_id?, starts_at, ends_at, status, link
```

## Nominations join (extend existing `nominations`)

Add nullable columns (backfill from current category text):
- `cycle_id uuid → award_cycles`
- `tier_id uuid → award_tiers` (required after backfill)
- `category_id uuid → award_categories` (required after backfill)
- `subcategory_id uuid → award_subcategories` (required after backfill)
- `classification_id uuid → award_classifications` (nullable; required only when `tier.slug='africa-education-icon'`)
- `page_source text`, `campaign_source text` (analytics attribution)

## Media (extend existing `media_assets`, add stories/series)

```
media_series           id, slug, kind (tv|webinar|podcast|documentary|show)
  └── media_episodes   id, series_id, episode_no, published_at, media_asset_id
media_stories          id, slug, headline, dek, body, cover_asset_id, nominee_id?, category_id?, tier_id?, region_code?, cycle_id?, status
media_publications     id, story_id, channel, published_at
media_schedules        id, story_id|episode_id, scheduled_for
media_consents         id, subject_type, subject_id, consent_json, expires_at
media_rights           id, asset_id, license, expires_at
media_approvals        id, story_id, reviewer_id, decision, decided_at
media_accreditations   id, applicant_email, event_id, status
content_performance    id, story_id|episode_id, metric_key, value, captured_at
```

## Governance flags per tier (from spec)

| Tier | public_voting | judge_review | governance_review |
|---|---|---|---|
| gold-blue-garnet | ❌ | ❌ | ✅ |
| platinum | ❌ | ❌ | ✅ |
| africa-education-icon | ❌ | ✅ (27 judges) | ✅ |
| influencer-education-impact | ❌ | ❌ | ✅ |

## RLS posture (must-hold)

- `award_*` and `timeline_events`: public `SELECT`, admin `INSERT/UPDATE/DELETE`. GRANTs to `anon`, `authenticated`, `service_role`.
- `nominations`: authenticated self-write / self-read, NRC and admin full via `has_role`.
- `judge_assignments`: RLS filter enforcing `tier_id = 'africa-education-icon'` for the `jury` role.
- `nominees` PII columns: existing restrictions retained (already remediated).
- All new public tables: `GRANT SELECT ... TO anon, authenticated; GRANT ALL ... TO service_role;`

## Backfill strategy

Stage 3 migration performs:
1. Create new tables + GRANT + RLS + policies.
2. Seed `award_cycles(2026)`, 4 tiers, 18 categories, 96 subcategories, 3 classifications from `src/config/recognition/taxonomy2026.ts` via a `seed-taxonomy` edge function (idempotent upsert on slug).
3. Backfill `nominations.tier_id/category_id/subcategory_id` by matching existing `category` / `subcategory` text against the seed slug map; unmatched rows written to `nominations_backfill_queue` for manual mapping (no destructive updates).
4. After sign-off (Stage 9), a follow-up migration sets NOT NULL on `tier_id`/`category_id`/`subcategory_id`.
