
-- First add unique constraint on subcategories.slug
ALTER TABLE public.subcategories ADD CONSTRAINT subcategories_slug_unique UNIQUE (slug);
