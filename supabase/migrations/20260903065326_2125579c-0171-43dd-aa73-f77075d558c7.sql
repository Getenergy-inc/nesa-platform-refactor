INSERT INTO public.subcategories (category_id, name, slug, display_order, is_active)
SELECT c.id, v.name, v.slug, v.ord, true
FROM public.categories c,
(VALUES
  ('Basic & Primary Education (West Africa)','ngo-africa-basicprimary-west-africa',51),
  ('Basic & Primary Education (East Africa)','ngo-africa-basicprimary-east-africa',52),
  ('Refugee & Displaced Children Education (West Africa)','ngo-africa-refugee-west-africa',53),
  ('Refugee & Displaced Children Education (East Africa)','ngo-africa-refugee-east-africa',54)
) AS v(name, slug, ord)
WHERE c.slug = 'best-ngo-education-africa'
ON CONFLICT DO NOTHING;