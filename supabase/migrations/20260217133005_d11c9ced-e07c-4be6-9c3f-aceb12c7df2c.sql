
-- Add gold_special to certificate_tier enum
ALTER TYPE public.certificate_tier ADD VALUE IF NOT EXISTS 'gold_special';

-- Update category names: replace "in Education" with "for Education" where appropriate
UPDATE public.categories 
SET name = REPLACE(name, 'in Education', 'for Education'),
    updated_at = now()
WHERE name LIKE '%in Education%';

-- Update subcategory names similarly
UPDATE public.subcategories 
SET name = REPLACE(name, 'in Education', 'for Education'),
    updated_at = now()
WHERE name LIKE '%in Education%';
