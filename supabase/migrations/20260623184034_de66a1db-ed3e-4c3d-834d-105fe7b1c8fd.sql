
-- =========================================================================
-- Fix 1: Column-level restriction on public.nominees for anon role
-- =========================================================================
-- The "Public view approved nominees" policy stays in place (so the app
-- keeps working), but anon's table-level SELECT is replaced with column-
-- level SELECT that omits PII and internal workflow fields:
--   email, phone, acceptance_token, acceptance_token_expires_at,
--   identity_hash, nrc_no, review_notes, nrc_reviewer_id, reviewed_at,
--   nrc_verified, nrc_verified_at, nominator_user_id, published_by,
--   legacy_ids, legacy_source, evidence_urls, jury_score, final_score.
--
-- Authenticated users continue to read through their own policies (owner,
-- NRC, admin) which run as the table owner via the policy USING clause.

REVOKE SELECT ON public.nominees FROM anon;

GRANT SELECT (
  id,
  subcategory_id,
  season_id,
  name,
  slug,
  title,
  organization,
  bio,
  photo_url,
  logo_url,
  status,
  is_platinum,
  public_votes,
  created_at,
  updated_at,
  renomination_count,
  region,
  country,
  first_letter_sent,
  acceptance_status,
  accepted_at,
  work_done,
  website,
  linkedin_url,
  verification_tier,
  published_at,
  publication_status,
  profile_status,
  profile_completion_score,
  award_family,
  recognition_class,
  region_slug,
  zone_slug,
  state_slug,
  category_fit_summary,
  impact_area,
  social_profile_links,
  public_documents,
  media_gallery,
  active_nominee_id,
  nrc_classification_level,
  nigeria_classification_group,
  country_of_impact,
  edi_band,
  public_display_status
) ON public.nominees TO anon;

-- =========================================================================
-- Fix 2: Restrict nrc_icon_classifications public reads to display-ready rows
-- =========================================================================
DROP POLICY IF EXISTS "Public read icon classifications" ON public.nrc_icon_classifications;

CREATE POLICY "Public read display-ready icon classifications"
  ON public.nrc_icon_classifications
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.nrc_evidence_rows er
      WHERE er.id = nrc_icon_classifications.nrc_row_id
        AND er.public_display_status = 'public_display_ready'
    )
  );
