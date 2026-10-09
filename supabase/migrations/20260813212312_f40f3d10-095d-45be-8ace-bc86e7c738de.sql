ALTER TABLE public.nrc_verification_summaries ALTER COLUMN final_decision DROP NOT NULL;
ALTER TABLE public.nrc_verification_summaries ALTER COLUMN final_decision DROP DEFAULT;
UPDATE public.nrc_verification_summaries SET final_decision = NULL WHERE final_decision = 'pending';