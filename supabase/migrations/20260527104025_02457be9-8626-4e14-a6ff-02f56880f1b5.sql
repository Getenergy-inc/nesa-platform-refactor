CREATE TABLE public.award_categories (
  slug TEXT PRIMARY KEY,
  group_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_award_categories_group ON public.award_categories(group_key, sort_order);
CREATE INDEX idx_award_categories_published ON public.award_categories(is_published);

GRANT SELECT ON public.award_categories TO anon;
GRANT SELECT ON public.award_categories TO authenticated;
GRANT ALL ON public.award_categories TO service_role;

ALTER TABLE public.award_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published award categories are public"
ON public.award_categories FOR SELECT
USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert award categories"
ON public.award_categories FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update award categories"
ON public.award_categories FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete award categories"
ON public.award_categories FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_award_categories_updated_at
BEFORE UPDATE ON public.award_categories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();