DROP POLICY IF EXISTS icon_audit_write_self ON public.icon_jury_audit_logs;

CREATE POLICY icon_audit_write_self
ON public.icon_jury_audit_logs
FOR INSERT
TO authenticated
WITH CHECK (
  actor_user_id = auth.uid()
  AND public.is_icon_judge(auth.uid())
);