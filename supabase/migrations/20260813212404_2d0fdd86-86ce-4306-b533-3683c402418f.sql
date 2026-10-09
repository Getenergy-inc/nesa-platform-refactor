CREATE OR REPLACE FUNCTION public.check_nrc_quorum(p_nomination_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_approve_count integer;
  v_reject_count integer;
  v_total_reviews integer;
  v_result text;
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE decision = 'APPROVE'),
    COUNT(*) FILTER (WHERE decision = 'REJECT'),
    COUNT(*)
  INTO v_approve_count, v_reject_count, v_total_reviews
  FROM nrc_reviews
  WHERE nomination_id = p_nomination_id AND completed_at IS NOT NULL;

  IF v_total_reviews < 2 THEN
    RETURN jsonb_build_object('quorum_reached', false, 'reason', 'insufficient_reviews');
  END IF;

  IF v_approve_count >= 2 THEN
    v_result := 'verified';
  ELSIF v_reject_count >= 2 THEN
    v_result := 'rejected';
  ELSE
    RETURN jsonb_build_object('quorum_reached', false, 'reason', 'split_decision', 'needs_lead', true);
  END IF;

  UPDATE nrc_verification_summaries
  SET final_decision = v_result,
      approve_count = v_approve_count,
      reject_count = v_reject_count,
      review_count = v_total_reviews,
      decision_at = now(),
      updated_at = now()
  WHERE nomination_id = p_nomination_id;

  UPDATE nominations
  SET workflow_status = CASE WHEN v_result = 'verified' THEN 'VERIFIED_BY_NRC' ELSE 'REJECTED_BY_NRC' END,
      status = (CASE WHEN v_result = 'verified' THEN 'approved' ELSE 'rejected' END)::nomination_status,
      reviewed_at = now(),
      updated_at = now()
  WHERE id = p_nomination_id;

  RETURN jsonb_build_object('quorum_reached', true, 'decision', v_result,
    'approve_count', v_approve_count, 'reject_count', v_reject_count);
END;
$function$;