-- Add renomination_count to nominees table for tracking re-nominations
ALTER TABLE public.nominees
ADD COLUMN IF NOT EXISTS renomination_count integer NOT NULL DEFAULT 0;

-- Add region field to nominees for region-first logic
ALTER TABLE public.nominees
ADD COLUMN IF NOT EXISTS region text;

-- Create an index for faster region queries
CREATE INDEX IF NOT EXISTS idx_nominees_region ON public.nominees(region);

-- Create an index for renomination count queries
CREATE INDEX IF NOT EXISTS idx_nominees_renomination_count ON public.nominees(renomination_count);

-- Add trigger to audit renominations
CREATE OR REPLACE FUNCTION public.log_renomination()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.renomination_count > OLD.renomination_count THEN
    INSERT INTO public.audit_logs (
      action,
      entity_type,
      entity_id,
      user_id,
      old_values,
      new_values
    ) VALUES (
      'renomination',
      'nominee',
      NEW.id,
      auth.uid(),
      jsonb_build_object('renomination_count', OLD.renomination_count),
      jsonb_build_object('renomination_count', NEW.renomination_count)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for renomination auditing
DROP TRIGGER IF EXISTS trg_log_renomination ON public.nominees;
CREATE TRIGGER trg_log_renomination
  AFTER UPDATE ON public.nominees
  FOR EACH ROW
  EXECUTE FUNCTION public.log_renomination();