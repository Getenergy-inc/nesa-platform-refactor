
-- 1) Revoke direct anon access to PII columns on judges; public reads go through judges_public view
REVOKE SELECT ON TABLE public.judges FROM anon;

-- Drop the broad public SELECT policy that exposed all columns to anon
DROP POLICY IF EXISTS "Public can view approved public judges" ON public.judges;

-- 2) Restrict platform_config reads to admins only
DROP POLICY IF EXISTS "Platform config readable by authenticated" ON public.platform_config;

CREATE POLICY "Admins can read platform config"
ON public.platform_config
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
