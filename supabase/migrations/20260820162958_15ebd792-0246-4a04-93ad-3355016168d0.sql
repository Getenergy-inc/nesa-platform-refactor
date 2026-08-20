
ALTER TABLE public.influencer_impact_nominees
  ADD COLUMN IF NOT EXISTS contact_on_file boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.influencer_nominee_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_slug text NOT NULL UNIQUE REFERENCES public.influencer_impact_nominees(slug) ON DELETE CASCADE,
  contact_email text,
  contact_phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.influencer_nominee_contacts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.influencer_nominee_contacts TO authenticated;
ALTER TABLE public.influencer_nominee_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage influencer nominee contacts" ON public.influencer_nominee_contacts;
CREATE POLICY "Admins manage influencer nominee contacts"
  ON public.influencer_nominee_contacts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Role / country / category corrections
UPDATE public.influencer_impact_nominees SET education_impact_summary = 'Actor / digital personality'
  WHERE slug = 'aicha-kamoise';
UPDATE public.influencer_impact_nominees SET award_category = 'social-media',
  education_impact_summary = 'Chef / food personality'
  WHERE slug = 'marcus-samuelsson';
UPDATE public.influencer_impact_nominees SET nominee_country = 'Ethiopia'
  WHERE slug IN ('the-weekend','yegna','bethlehem-tilahun-alemu','liya-kebede','ruth-negga','shega-media','nardos-imam');
UPDATE public.influencer_impact_nominees SET nominee_country = 'Somalia'
  WHERE slug IN ('iman','halima-aden','ugaaso-abukar-boocow','ilhan-omar');
UPDATE public.influencer_impact_nominees SET nominee_country = 'Nigeria'
  WHERE nominee_region = 'West Africa' AND (nominee_country IS NULL OR nominee_country = 'Not specified')
    AND slug NOT IN ('wode-maya','kwadwo-sheldon');
UPDATE public.influencer_impact_nominees SET nominee_country = 'Ghana'
  WHERE slug IN ('wode-maya','kwadwo-sheldon');

-- Contacts on file (kept private; only the flag is public)
WITH c(nm, email, phone) AS (
  VALUES
    ('fisayo fosudo','fisayofosudo@gmail.com',NULL),
    ('zuriel oduwole','zuriel.oduwole@gmail.com',NULL),
    ('tayo aina','tayo@tayoaina.com',NULL),
    ('wode maya','business@wodemaya.africa',NULL),
    ('peace itimi','jopesiitimi@gmail.com',NULL),
    ('miss techy','collaborations@misstechymedia.com',NULL),
    ('korty eo','kortyeo@gmail.com',NULL),
    ('enioluwa adeoluwa','enioluwa.adeoluwa@gmail.com',NULL),
    ('aproko doctor','hello@aprokodoctor.com',NULL),
    ('tomike adeoye','tomisinadeoye09@gmail.com',NULL),
    ('rebecca enonchong','rebecca.enonchong@gmail.com',NULL),
    ('muriel blanche','ask@murielblanche.com',NULL),
    ('syndy emade','syndy.emade@gmail.com',NULL),
    ('marcelle kuetche','marcelle.kuetche@yahoo.fr',NULL),
    ('aïcha kamoise','aicha.kamoise@gmail.com',NULL),
    ('blanche bailly','bbailly@collenginyers.com',NULL),
    ('daphne njie',NULL,'+237 675213944'),
    ('tenor cameroon','truelabelconsulting@gmail.com',NULL),
    ('innoss''b','contact@la-ent.com',NULL),
    ('fally ipupa','fally.ipupa@gmail.com',NULL)
)
INSERT INTO public.influencer_nominee_contacts (nominee_slug, contact_email, contact_phone)
SELECT n.slug, c.email, c.phone
FROM c JOIN public.influencer_impact_nominees n ON lower(n.nominee_name) = c.nm
ON CONFLICT (nominee_slug) DO UPDATE
  SET contact_email = EXCLUDED.contact_email,
      contact_phone = EXCLUDED.contact_phone,
      updated_at = now();

UPDATE public.influencer_impact_nominees n SET contact_on_file = true
WHERE EXISTS (SELECT 1 FROM public.influencer_nominee_contacts c WHERE c.nominee_slug = n.slug);
