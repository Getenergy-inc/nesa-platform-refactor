ALTER TABLE public.nominations ALTER COLUMN nominator_id DROP NOT NULL;

UPDATE public.nominations SET nominator_id = NULL
WHERE nominator_id IS NOT NULL AND nominator_id NOT IN (SELECT id FROM public.nominators);

ALTER TABLE public.nominations DROP CONSTRAINT IF EXISTS nominations_nominator_id_fkey;
ALTER TABLE public.nominations
  ADD CONSTRAINT nominations_nominator_id_fkey
  FOREIGN KEY (nominator_id) REFERENCES public.nominators(id) ON DELETE SET NULL;