-- Tighten nrc_invitations SELECT policy so invited users only see live, unclaimed invitations
DROP POLICY IF EXISTS "Invited users can view their invitation" ON public.nrc_invitations;

CREATE POLICY "Invited users can view their pending invitation"
  ON public.nrc_invitations FOR SELECT
  TO authenticated
  USING (
    accepted_at IS NULL
    AND status = 'pending'
    AND expires_at > now()
    AND lower(email) = lower((SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Defence in depth: re-assert that judges PII columns are not selectable
-- outside the approved judges_public view / owner + admin RLS paths.
REVOKE SELECT (email, phone) ON public.judges FROM anon;
REVOKE SELECT (email, phone) ON public.judges FROM authenticated;