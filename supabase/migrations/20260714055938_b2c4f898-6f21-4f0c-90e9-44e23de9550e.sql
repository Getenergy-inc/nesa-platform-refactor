
-- Column-level protection for nominee PII.
-- Revoke wildcard SELECT for authenticated, then re-grant SELECT on every
-- non-PII column. Admin/NRC keep full access via their existing RLS policies
-- (which run as security definer role checks) and via service_role.

REVOKE SELECT ON public.nominees FROM authenticated;

GRANT SELECT (
  id, subcategory_id, season_id, name, slug, title, organization, bio,
  photo_url, evidence_urls, status, nominator_user_id, nrc_reviewer_id,
  reviewed_at, review_notes, is_platinum, public_votes, jury_score,
  final_score, created_at, updated_at, renomination_count, region,
  country, identity_hash, first_letter_sent, acceptance_status,
  accepted_at, nrc_verified, nrc_verified_at, logo_url, legacy_ids,
  legacy_source, work_done, website, linkedin_url, source_nomination_id,
  verification_tier, published_at, published_by, publication_status,
  profile_status, profile_completion_score, award_family,
  recognition_class, region_slug, zone_slug, state_slug,
  category_fit_summary, impact_area, social_profile_links,
  public_documents, media_gallery, nrc_no, active_nominee_id,
  nrc_classification_level, nigeria_classification_group,
  country_of_impact, nrc_evidence_status, edi_band,
  public_display_status, research_priority, referral_code,
  recognition_pathway
) ON public.nominees TO authenticated;

-- Ordinary authenticated users can still INSERT/UPDATE/DELETE where RLS allows.
GRANT INSERT, UPDATE, DELETE ON public.nominees TO authenticated;

-- Service role and admin flows stay unrestricted.
GRANT ALL ON public.nominees TO service_role;
