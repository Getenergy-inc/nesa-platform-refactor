
-- Defense-in-depth server-side StageGate for nominations.
-- Blocks INSERTs into public.nominations when the "nominations" stage is closed,
-- regardless of client, unless an admin explicitly bypasses via GUC.

CREATE OR REPLACE FUNCTION public.enforce_nominations_stage_gate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bypass text;
  v_is_open boolean;
BEGIN
  -- Explicit admin bypass for backfills / imports: SET LOCAL nesa.bypass_stage_gate = 'on';
  BEGIN
    v_bypass := current_setting('nesa.bypass_stage_gate', true);
  EXCEPTION WHEN OTHERS THEN
    v_bypass := NULL;
  END;
  IF v_bypass = 'on' THEN
    RETURN NEW;
  END IF;

  -- Admins with a valid session may bypass (covers admin dashboard writes).
  IF auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  v_is_open := public.is_stage_open('nominations'::stage_action);
  IF NOT COALESCE(v_is_open, false) THEN
    RAISE EXCEPTION 'Nominations are currently closed for the active season'
      USING ERRCODE = 'P0403', HINT = 'StageGate: nominations stage is locked';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_nominations_stage_gate ON public.nominations;
CREATE TRIGGER trg_enforce_nominations_stage_gate
BEFORE INSERT ON public.nominations
FOR EACH ROW
EXECUTE FUNCTION public.enforce_nominations_stage_gate();
