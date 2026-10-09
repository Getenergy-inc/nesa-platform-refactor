CREATE OR REPLACE FUNCTION public.export_nomination_batch(p_batch_id uuid)
RETURNS TABLE(
  record_id text,
  intake_id uuid,
  form_type text,
  award_group text,
  award_category text,
  award_subcategory text,
  nominee_name_clean text,
  nominee_type_clean text,
  nominee_country_clean text,
  nominee_region_clean text,
  nominee_city_clean text,
  impact_summary_clean text,
  evidence_status text,
  verification_status text,
  nomination_status text,
  duplicate_of uuid,
  duplicate_status text,
  identity_hash text,
  ingested_at timestamptz,
  ingested_by uuid,
  updated_at timestamptz,
  audit_trail jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ni.record_id,
    ni.id AS intake_id,
    ni.form_type,
    ni.award_group,
    ni.award_category,
    ni.award_subcategory,
    ni.nominee_name_clean,
    ni.nominee_type_clean,
    ni.nominee_country_clean,
    ni.nominee_region_clean,
    ni.nominee_city_clean,
    ni.impact_summary_clean,
    ni.evidence_status,
    ni.verification_status,
    ni.nomination_status,
    ni.duplicate_of,
    ni.duplicate_status,
    ni.identity_hash,
    ni.ingested_at,
    ni.ingested_by,
    ni.updated_at,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'action', nia.action,
          'reason', nia.reason,
          'canonical_id', nia.canonical_id,
          'previous_duplicate_status', nia.previous_duplicate_status,
          'new_duplicate_status', nia.new_duplicate_status,
          'actor_id', nia.actor_id,
          'created_at', nia.created_at
        ) ORDER BY nia.created_at
      ) FILTER (WHERE nia.id IS NOT NULL),
      '[]'::jsonb
    ) AS audit_trail
  FROM public.nomination_intake ni
  LEFT JOIN public.nomination_ingest_audit nia
    ON nia.intake_id = ni.id AND nia.batch_id = p_batch_id
  WHERE ni.id IN (
    SELECT DISTINCT intake_id
    FROM public.nomination_ingest_audit
    WHERE batch_id = p_batch_id
  )
  GROUP BY ni.id, ni.record_id, ni.form_type, ni.award_group, ni.award_category,
    ni.award_subcategory, ni.nominee_name_clean, ni.nominee_type_clean,
    ni.nominee_country_clean, ni.nominee_region_clean, ni.nominee_city_clean,
    ni.impact_summary_clean, ni.evidence_status, ni.verification_status,
    ni.nomination_status, ni.duplicate_of, ni.duplicate_status, ni.identity_hash,
    ni.ingested_at, ni.ingested_by, ni.updated_at
  ORDER BY ni.ingested_at, ni.id;
$$;

REVOKE ALL ON FUNCTION public.export_nomination_batch(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.export_nomination_batch(uuid) TO service_role;