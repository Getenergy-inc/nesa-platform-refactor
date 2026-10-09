-- Fix: nominations.nominator_id must reference public.nominators (the public,
-- no-login intake), not auth.users.
--
-- The original column was `nominator_id UUID REFERENCES auth.users(id) NOT NULL`.
-- A later migration tried to repoint it to nominators via
-- `ADD COLUMN IF NOT EXISTS ... REFERENCES nominators`, but that was a no-op
-- (the column already existed), so the FK stayed on auth.users and NOT NULL.
-- Confirmed via PostgREST: no nominations<->nominators relationship exists.
--
-- A public nomination has no auth.users id, so the insert could never succeed
-- (that is why the nominations table is empty). Since it IS empty, repointing
-- the FK is data-safe.

ALTER TABLE public.nominations ALTER COLUMN nominator_id DROP NOT NULL;

ALTER TABLE public.nominations DROP CONSTRAINT IF EXISTS nominations_nominator_id_fkey;

ALTER TABLE public.nominations
  ADD CONSTRAINT nominations_nominator_id_fkey
  FOREIGN KEY (nominator_id) REFERENCES public.nominators(id) ON DELETE SET NULL;
