CREATE POLICY "NRC and admins can view nomination evidence"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'nomination-evidence'
  AND (public.has_role(auth.uid(), 'nrc'::public.app_role) OR public.has_role(auth.uid(), 'admin'::public.app_role))
);