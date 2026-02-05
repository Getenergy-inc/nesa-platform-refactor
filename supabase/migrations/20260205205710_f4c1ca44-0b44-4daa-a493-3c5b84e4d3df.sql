
-- =====================================================
-- NRC AUTOMATION MODULE - NESA-AFRICA 2025
-- Database Schema Enhancement for 99% Perfection
-- =====================================================

-- 1. Create enhanced nomination workflow status enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nrc_workflow_status') THEN
    CREATE TYPE nrc_workflow_status AS ENUM (
      'DRAFT',
      'SUBMITTED_PENDING_ACCEPTANCE',
      'DECLINED',
      'ACCEPTED_PENDING_NRC',
      'NRC_ASSIGNED',
      'NRC_IN_REVIEW',
      'NRC_QUERY_SENT',
      'VERIFIED_BY_NRC',
      'REJECTED_BY_NRC',
      'PUBLISHED_FOR_VOTING'
    );
  END IF;
END $$;

-- 2. Create NRC reviewer role enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nrc_reviewer_role') THEN
    CREATE TYPE nrc_reviewer_role AS ENUM (
      'nrc_reviewer',
      'nrc_lead',
      'nrc_auditor'
    );
  END IF;
END $$;

-- 3. Create AI assessment recommendation enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ai_recommendation') THEN
    CREATE TYPE ai_recommendation AS ENUM (
      'RECOMMEND_ELIGIBLE',
      'RECOMMEND_INELIGIBLE',
      'NEEDS_MORE_EVIDENCE',
      'FLAG_FOR_RISK_REVIEW'
    );
  END IF;
END $$;

-- 4. Create NRC review decision enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'nrc_review_decision') THEN
    CREATE TYPE nrc_review_decision AS ENUM (
      'APPROVE',
      'REJECT',
      'REQUEST_MORE_EVIDENCE',
      'RECLASSIFY',
      'ESCALATE'
    );
  END IF;
END $$;

-- 5. Add workflow_status to nominations table
ALTER TABLE nominations
ADD COLUMN IF NOT EXISTS workflow_status text DEFAULT 'SUBMITTED_PENDING_ACCEPTANCE',
ADD COLUMN IF NOT EXISTS rubric_version text DEFAULT '2025.1',
ADD COLUMN IF NOT EXISTS query_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_query_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS sla_deadline timestamp with time zone;

-- 6. Add NRC-specific columns to nrc_members
ALTER TABLE nrc_members
ADD COLUMN IF NOT EXISTS nrc_role text DEFAULT 'nrc_reviewer',
ADD COLUMN IF NOT EXISTS current_assignments integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_review_time_hours numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS identity_checks integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS evidence_checks integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS category_checks integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_available boolean DEFAULT true;

-- 7. Create AI NRC Assessments table
CREATE TABLE IF NOT EXISTS ai_nrc_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nomination_id uuid NOT NULL REFERENCES nominations(id) ON DELETE CASCADE,
  recommendation text NOT NULL,
  evidence_score integer DEFAULT 0 CHECK (evidence_score >= 0 AND evidence_score <= 100),
  category_fit_score integer DEFAULT 0 CHECK (category_fit_score >= 0 AND category_fit_score <= 100),
  risk_score integer DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  identity_verified boolean DEFAULT false,
  reason_codes jsonb DEFAULT '[]'::jsonb,
  explanation_summary text,
  model_version text DEFAULT 'nrc-ai-v1',
  rubric_version text DEFAULT '2025.1',
  processing_time_ms integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 8. Create NRC Review Checklist table (human reviews)
CREATE TABLE IF NOT EXISTS nrc_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nomination_id uuid NOT NULL REFERENCES nominations(id) ON DELETE CASCADE,
  reviewer_user_id uuid NOT NULL,
  review_type text NOT NULL CHECK (review_type IN ('identity', 'evidence', 'category', 'full')),
  decision text NOT NULL,
  -- Checklist scores
  identity_match boolean,
  category_fit boolean,
  evidence_sufficiency integer CHECK (evidence_sufficiency >= 0 AND evidence_sufficiency <= 5),
  evidence_authenticity text CHECK (evidence_authenticity IN ('none', 'medium', 'high')),
  timeframe_fit boolean,
  duplication_status text CHECK (duplication_status IN ('unique', 'possible_duplicate', 'confirmed_duplicate')),
  -- Notes
  reviewer_notes text,
  suggested_category_id uuid REFERENCES categories(id),
  suggested_subcategory_id uuid REFERENCES subcategories(id),
  -- Timestamps
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- 9. Create NRC Assignment Rules table
CREATE TABLE IF NOT EXISTS nrc_assignment_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name text NOT NULL UNIQUE,
  rule_type text NOT NULL CHECK (rule_type IN ('random', 'round_robin', 'workload_balanced', 'specialization')),
  min_reviewers integer DEFAULT 2,
  max_reviewers integer DEFAULT 3,
  sla_hours integer DEFAULT 72,
  escalation_hours integer DEFAULT 96,
  is_active boolean DEFAULT true,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 10. Create NRC Evidence Queries table (for clarifications)
CREATE TABLE IF NOT EXISTS nrc_evidence_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nomination_id uuid NOT NULL REFERENCES nominations(id) ON DELETE CASCADE,
  reviewer_user_id uuid NOT NULL,
  query_type text NOT NULL CHECK (query_type IN ('identity', 'evidence', 'category', 'other')),
  query_text text NOT NULL,
  required_evidence_types text[],
  response_text text,
  response_evidence_urls text[],
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'expired', 'resolved')),
  due_date timestamp with time zone,
  responded_at timestamp with time zone,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- 11. Create NRC Verification Summary table (final decision record)
CREATE TABLE IF NOT EXISTS nrc_verification_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nomination_id uuid UNIQUE NOT NULL REFERENCES nominations(id) ON DELETE CASCADE,
  nominee_id uuid REFERENCES nominees(id),
  final_decision text NOT NULL CHECK (final_decision IN ('verified', 'rejected', 'pending')),
  primary_reviewer_id uuid,
  secondary_reviewer_id uuid,
  lead_reviewer_id uuid,
  ai_recommendation text,
  ai_evidence_score integer,
  -- Aggregated checklist
  identity_verified boolean DEFAULT false,
  category_verified boolean DEFAULT false,
  evidence_verified boolean DEFAULT false,
  risk_cleared boolean DEFAULT false,
  -- Counts
  review_count integer DEFAULT 0,
  approve_count integer DEFAULT 0,
  reject_count integer DEFAULT 0,
  -- Summary PDF
  summary_pdf_url text,
  summary_generated_at timestamp with time zone,
  -- Timestamps
  decision_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 12. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_nrc_assessments_nomination ON ai_nrc_assessments(nomination_id);
CREATE INDEX IF NOT EXISTS idx_nrc_reviews_nomination ON nrc_reviews(nomination_id);
CREATE INDEX IF NOT EXISTS idx_nrc_reviews_reviewer ON nrc_reviews(reviewer_user_id);
CREATE INDEX IF NOT EXISTS idx_nrc_evidence_queries_nomination ON nrc_evidence_queries(nomination_id);
CREATE INDEX IF NOT EXISTS idx_nrc_evidence_queries_status ON nrc_evidence_queries(status);
CREATE INDEX IF NOT EXISTS idx_nominations_workflow ON nominations(workflow_status);
CREATE INDEX IF NOT EXISTS idx_nominations_sla ON nominations(sla_deadline);

-- 13. Enable RLS on new tables
ALTER TABLE ai_nrc_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nrc_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE nrc_assignment_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE nrc_evidence_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE nrc_verification_summaries ENABLE ROW LEVEL SECURITY;

-- 14. RLS Policies for ai_nrc_assessments
CREATE POLICY "NRC can view AI assessments" ON ai_nrc_assessments
  FOR SELECT USING (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert AI assessments" ON ai_nrc_assessments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage AI assessments" ON ai_nrc_assessments
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 15. RLS Policies for nrc_reviews
CREATE POLICY "NRC can view reviews" ON nrc_reviews
  FOR SELECT USING (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "NRC can insert own reviews" ON nrc_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_user_id AND has_role(auth.uid(), 'nrc'));

CREATE POLICY "NRC can update own reviews" ON nrc_reviews
  FOR UPDATE USING (auth.uid() = reviewer_user_id AND has_role(auth.uid(), 'nrc'));

CREATE POLICY "Admins manage all reviews" ON nrc_reviews
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 16. RLS Policies for nrc_assignment_rules
CREATE POLICY "Anyone can view active rules" ON nrc_assignment_rules
  FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage rules" ON nrc_assignment_rules
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 17. RLS Policies for nrc_evidence_queries
CREATE POLICY "NRC can view queries" ON nrc_evidence_queries
  FOR SELECT USING (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "NRC can create queries" ON nrc_evidence_queries
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "NRC can update queries" ON nrc_evidence_queries
  FOR UPDATE USING (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

-- 18. RLS Policies for nrc_verification_summaries
CREATE POLICY "NRC can view summaries" ON nrc_verification_summaries
  FOR SELECT USING (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "NRC can insert summaries" ON nrc_verification_summaries
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'nrc') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage summaries" ON nrc_verification_summaries
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 19. Function to auto-assign reviewers (2-3 random active NRC members)
CREATE OR REPLACE FUNCTION assign_nrc_reviewers(
  p_nomination_id uuid,
  p_num_reviewers integer DEFAULT 2
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reviewers uuid[];
  v_reviewer_id uuid;
  v_sla_deadline timestamp with time zone;
  v_result jsonb;
BEGIN
  -- Get random available reviewers
  SELECT array_agg(user_id)
  INTO v_reviewers
  FROM (
    SELECT user_id
    FROM nrc_members
    WHERE status = 'active'
      AND is_available = true
      AND current_assignments < max_queue_size
    ORDER BY random()
    LIMIT p_num_reviewers
  ) subq;

  IF array_length(v_reviewers, 1) IS NULL OR array_length(v_reviewers, 1) < 1 THEN
    RETURN jsonb_build_object('success', false, 'error', 'No available NRC reviewers');
  END IF;

  -- Set SLA deadline (72 hours)
  v_sla_deadline := now() + interval '72 hours';

  -- Create queue assignments and reviews
  FOREACH v_reviewer_id IN ARRAY v_reviewers
  LOOP
    -- Insert into nrc_queue
    INSERT INTO nrc_queue (nomination_id, assigned_to, due_date, status)
    VALUES (p_nomination_id, v_reviewer_id, v_sla_deadline, 'assigned')
    ON CONFLICT (nomination_id) DO NOTHING;

    -- Update member's current assignments
    UPDATE nrc_members
    SET current_assignments = current_assignments + 1,
        last_active_at = now()
    WHERE user_id = v_reviewer_id;
  END LOOP;

  -- Update nomination workflow status
  UPDATE nominations
  SET workflow_status = 'NRC_ASSIGNED',
      sla_deadline = v_sla_deadline,
      updated_at = now()
  WHERE id = p_nomination_id;

  -- Create verification summary record
  INSERT INTO nrc_verification_summaries (nomination_id, primary_reviewer_id, secondary_reviewer_id)
  VALUES (
    p_nomination_id,
    v_reviewers[1],
    CASE WHEN array_length(v_reviewers, 1) > 1 THEN v_reviewers[2] ELSE NULL END
  )
  ON CONFLICT (nomination_id) DO UPDATE
  SET primary_reviewer_id = EXCLUDED.primary_reviewer_id,
      secondary_reviewer_id = EXCLUDED.secondary_reviewer_id,
      updated_at = now();

  RETURN jsonb_build_object(
    'success', true,
    'reviewers', v_reviewers,
    'sla_deadline', v_sla_deadline
  );
END;
$$;

-- 20. Function to check NRC quorum decision (2 of 3 rule)
CREATE OR REPLACE FUNCTION check_nrc_quorum(p_nomination_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  WHERE nomination_id = p_nomination_id
    AND completed_at IS NOT NULL;

  -- Need at least 2 reviews for quorum
  IF v_total_reviews < 2 THEN
    RETURN jsonb_build_object('quorum_reached', false, 'reason', 'insufficient_reviews');
  END IF;

  -- 2 of 3 approve = approved
  IF v_approve_count >= 2 THEN
    v_result := 'verified';
  -- 2 of 3 reject = rejected
  ELSIF v_reject_count >= 2 THEN
    v_result := 'rejected';
  -- Split decision = escalate to lead
  ELSE
    RETURN jsonb_build_object('quorum_reached', false, 'reason', 'split_decision', 'needs_lead', true);
  END IF;

  -- Update verification summary
  UPDATE nrc_verification_summaries
  SET final_decision = v_result,
      approve_count = v_approve_count,
      reject_count = v_reject_count,
      review_count = v_total_reviews,
      decision_at = now(),
      updated_at = now()
  WHERE nomination_id = p_nomination_id;

  -- Update nomination status
  UPDATE nominations
  SET workflow_status = CASE WHEN v_result = 'verified' THEN 'VERIFIED_BY_NRC' ELSE 'REJECTED_BY_NRC' END,
      status = CASE WHEN v_result = 'verified' THEN 'approved' ELSE 'rejected' END,
      reviewed_at = now(),
      updated_at = now()
  WHERE id = p_nomination_id;

  RETURN jsonb_build_object(
    'quorum_reached', true,
    'decision', v_result,
    'approve_count', v_approve_count,
    'reject_count', v_reject_count
  );
END;
$$;

-- 21. Function to handle SLA escalation
CREATE OR REPLACE FUNCTION escalate_overdue_nrc_assignments()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer := 0;
  v_record RECORD;
BEGIN
  FOR v_record IN
    SELECT q.id, q.nomination_id, q.assigned_to
    FROM nrc_queue q
    JOIN nominations n ON n.id = q.nomination_id
    WHERE q.status IN ('assigned', 'in_review')
      AND n.sla_deadline < now()
      AND n.sla_deadline > now() - interval '24 hours' -- Recently overdue
  LOOP
    -- Log escalation event
    INSERT INTO audit_events (
      action, entity_type, entity_id, actor_role, metadata
    ) VALUES (
      'nrc_sla_escalation',
      'nrc_queue',
      v_record.id,
      'system',
      jsonb_build_object('nomination_id', v_record.nomination_id, 'overdue_reviewer', v_record.assigned_to)
    );

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;

-- 22. Insert default assignment rule
INSERT INTO nrc_assignment_rules (rule_name, rule_type, min_reviewers, max_reviewers, sla_hours, escalation_hours)
VALUES ('default_2_reviewer', 'workload_balanced', 2, 3, 72, 96)
ON CONFLICT (rule_name) DO NOTHING;

-- 23. Trigger to update nrc_members stats after review completion
CREATE OR REPLACE FUNCTION update_nrc_member_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    UPDATE nrc_members
    SET total_reviews = total_reviews + 1,
        current_assignments = GREATEST(0, current_assignments - 1),
        review_count = review_count + 1,
        last_active_at = now()
    WHERE user_id = NEW.reviewer_user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_nrc_member_stats ON nrc_reviews;
CREATE TRIGGER trigger_update_nrc_member_stats
  AFTER UPDATE ON nrc_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_nrc_member_stats();
