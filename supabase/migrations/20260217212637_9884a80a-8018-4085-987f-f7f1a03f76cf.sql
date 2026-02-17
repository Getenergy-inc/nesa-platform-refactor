
-- Add country column to categories for dynamic country-specific categories
ALTER TABLE public.categories 
ADD COLUMN country text NULL;

-- Add index for efficient country-based filtering
CREATE INDEX idx_categories_country ON public.categories (country) WHERE country IS NOT NULL;
CREATE INDEX idx_categories_scope ON public.categories (scope);

-- Set country for existing Nigeria categories
UPDATE public.categories SET country = 'Nigeria' WHERE scope = 'NIGERIA';
