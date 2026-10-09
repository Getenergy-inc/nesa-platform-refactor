-- Allow Icon judges to view their own audit trail entries
CREATE POLICY "icon_audit_read_self"
ON public.icon_jury_audit_logs
FOR SELECT
TO authenticated
USING (actor_user_id = auth.uid() AND public.is_icon_judge(auth.uid()));

-- Helpful index for filtered queries
CREATE INDEX IF NOT EXISTS icon_jury_audit_logs_actor_created_idx
  ON public.icon_jury_audit_logs (actor_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS icon_jury_audit_logs_action_created_idx
  ON public.icon_jury_audit_logs (action, created_at DESC);
CREATE INDEX IF NOT EXISTS icon_jury_audit_logs_entity_created_idx
  ON public.icon_jury_audit_logs (entity_type, created_at DESC);