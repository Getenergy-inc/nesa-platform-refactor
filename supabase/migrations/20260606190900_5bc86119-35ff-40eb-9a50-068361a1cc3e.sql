CREATE UNIQUE INDEX IF NOT EXISTS audit_events_form_auto_promoted_unique
  ON public.audit_events ((metadata->>'form_kind'), (metadata->>'form_slug'))
  WHERE action = 'form_auto_promoted';