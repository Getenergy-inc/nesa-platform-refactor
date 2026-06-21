-- Phase 1 PII fix (Option A): column-level GRANT model on anon.
-- Existing public SELECT policy stays in place; we just narrow what columns
-- anonymous traffic is allowed to read.

REVOKE SELECT ON public.nominees FROM anon;

GRANT SELECT (
  id, subcategory_id, season_id, name, slug, title, organization, bio,
  photo_url, evidence_urls, status, is_platinum, public_votes, jury_score,
  final_score, created_at, updated_at, renomination_count, region, country,
  first_letter_sent, acceptance_status, accepted_at, nrc_verified,
  nrc_verified_at, logo_url, legacy_ids, legacy_source, work_done, website,
  linkedin_url, source_nomination_id, verification_tier, published_at,
  published_by, publication_status, profile_status, profile_completion_score,
  award_family, recognition_class, region_slug, zone_slug, state_slug,
  category_fit_summary, impact_area, social_profile_links, public_documents,
  media_gallery
) ON public.nominees TO anon;