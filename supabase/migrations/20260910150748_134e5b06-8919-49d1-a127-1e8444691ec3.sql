
CREATE TABLE public.sophia_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  tags text[] NOT NULL DEFAULT '{}',
  intent_keywords text[] NOT NULL DEFAULT '{}',
  cta_label text,
  cta_href text,
  escalate boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  answer_en text NOT NULL,
  answer_fr text,
  answer_ar text,
  answer_sw text,
  answer_zu text,
  answer_yo text,
  answer_ha text,
  answer_hi text,
  answer_am text,
  answer_zh text,
  answer_pt text,
  answer_ig text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sophia_faqs TO anon;
GRANT SELECT ON public.sophia_faqs TO authenticated;
GRANT ALL ON public.sophia_faqs TO service_role;
ALTER TABLE public.sophia_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active Sophia FAQs"
  ON public.sophia_faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage Sophia FAQs"
  ON public.sophia_faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_sophia_faqs_category ON public.sophia_faqs(category);
CREATE INDEX idx_sophia_faqs_active ON public.sophia_faqs(is_active);

CREATE TRIGGER trg_sophia_faqs_updated_at
  BEFORE UPDATE ON public.sophia_faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.sophia_unanswered (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  detected_language text NOT NULL DEFAULT 'en',
  channel text NOT NULL DEFAULT 'web',
  conversation_id text,
  best_match_id uuid REFERENCES public.sophia_faqs(id) ON DELETE SET NULL,
  best_match_score numeric,
  reviewed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.sophia_unanswered TO authenticated;
GRANT ALL ON public.sophia_unanswered TO service_role;
ALTER TABLE public.sophia_unanswered ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read unanswered questions"
  ON public.sophia_unanswered FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update unanswered questions"
  ON public.sophia_unanswered FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_sophia_unanswered_updated_at
  BEFORE UPDATE ON public.sophia_unanswered
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.sophia_whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  direction text NOT NULL CHECK (direction IN ('inbound','outbound')),
  wa_message_id text,
  wa_from text,
  wa_to text,
  body text,
  detected_language text,
  matched_faq_id uuid REFERENCES public.sophia_faqs(id) ON DELETE SET NULL,
  delivery_status text NOT NULL DEFAULT 'received',
  error_detail text,
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sophia_whatsapp_messages TO authenticated;
GRANT ALL ON public.sophia_whatsapp_messages TO service_role;
ALTER TABLE public.sophia_whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read WhatsApp message log"
  ON public.sophia_whatsapp_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.sophia_faqs (question, category, tags, intent_keywords, cta_label, cta_href, display_order, answer_en) VALUES
('What is NESA-Africa?', 'general', ARRAY['about','nesa'], ARRAY['what is nesa','about nesa','nesa africa'], 'About NESA-Africa', '/about', 1,
 'NESA-Africa is The African Blue-Garnet Awards for Recognising Africa''s Education Enablers — a continental recognition platform that honours the people, organisations and institutions advancing education across Africa. Recognition is evidence-based and organised across four tiers and 18 award categories.'),
('What is the NESA-Africa tagline and motto?', 'general', ARRAY['brand','tagline'], ARRAY['tagline','motto','slogan'], NULL, NULL, 2,
 'Our tagline is "Recognising Africa''s Education Enablers." Our closing words to every honouree are: "Africa sees you. Africa appreciates you. Africa says thank you."'),
('Does nominating or sponsoring influence who wins?', 'integrity', ARRAY['integrity','judging'], ARRAY['influence','bias','sponsor win','pay to win'], 'Governance', '/about', 3,
 'No. Nominating, sponsoring or partnering with NESA-Africa has no effect whatsoever on judging outcomes. Evaluation is carried out independently by the Nominee Research Corps and the judging panels using documented evidence only.'),
('How do I nominate someone?', 'nominations', ARRAY['nominate'], ARRAY['nominate','submit nomination','how to nominate'], 'Nominate an Education Enabler', '/nominate', 4,
 'Go to the Nominate page, choose the category that best fits the nominee''s work, and complete the form with verifiable evidence — links, coverage, documents or references. Nominations for the 2026 cycle open on 6 September 2026. You can save a draft and return to it later.'),
('What happens after I submit a nomination?', 'nominations', ARRAY['nominate','process'], ARRAY['after nomination','what next','nomination status'], NULL, NULL, 5,
 'Your submission enters research and review. The Nominee Research Corps checks the evidence provided, then eligible nominees are passed to the judging stage. I can''t check the live status of an individual nomination yet — for that, please contact the team through the Support page.'),
('I received an acceptance link — what is it?', 'nominations', ARRAY['acceptance','nominee'], ARRAY['acceptance letter','accept nomination','token link'], 'Support', '/support', 6,
 'Nominees receive a secure, personal acceptance link in the form /nominee/accept/your-token. Opening it lets you confirm or decline your nomination, verify your details, and activate your public profile. Links expire after 30 days; if yours has expired, contact the team via the Support page.'),
('How many award categories are there?', 'categories', ARRAY['categories'], ARRAY['categories','how many categories','award list'], 'Explore categories', '/awards', 7,
 'There are 18 award categories across four recognition tiers, covering areas such as CSR in education, NGOs and foundations, EduTech, STEM, faith-based education impact, libraries and literacy, media advocacy, diaspora contribution, political leadership and the Africa Education Icon awards.'),
('When and where is the Award Gala?', 'gala', ARRAY['gala','event'], ARRAY['gala','ceremony','event date','awards night'], NULL, NULL, 8,
 'The NESA-Africa 2026 Award Gala takes place on Sunday, 13 December 2026. Venue details and ticketing information are being finalised — please check the site or contact the team for the latest confirmed arrangements.'),
('What is the NRC (Nominee Research Corps)?', 'nrc', ARRAY['nrc','volunteer'], ARRAY['nrc','research corps','volunteer research'], 'NRC Arena', '/nrc', 9,
 'The Nominee Research Corps is the volunteer research body that verifies nominee evidence before judging. NRC members research claims, document sources and prepare verification summaries. You can apply to join through the NRC page; applications are reviewed before onboarding.'),
('How does judging work?', 'judging', ARRAY['judges','process'], ARRAY['judging','judges','how are winners chosen','scoring'], 'Judges Arena', '/judges', 10,
 'Judging is evidence-based. Verified nominee dossiers are assigned to independent judges who score against published criteria, declare any conflicts of interest, and submit scores independently — no judge sees another judge''s scores. Judging decisions are separate from nominations, sponsorship and public engagement.');
