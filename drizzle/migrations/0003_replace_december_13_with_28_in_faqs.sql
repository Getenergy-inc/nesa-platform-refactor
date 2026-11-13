UPDATE public.sophia_faqs
SET answer_en = REPLACE(
  REPLACE(
    REPLACE(answer_en, 'Sunday, 13 December 2026', 'Monday, 28 December 2026'),
    '13 December 2026',
    '28 December 2026'
  ),
  '13 Dec 2026',
  '28 Dec 2026'
)
WHERE answer_en ~* '(13[[:space:]]+(December|Dec)|December[[:space:]]+13|2026-12-13|2027-12-13)';