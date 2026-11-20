ALTER TABLE public.contact_enquiries
  DROP CONSTRAINT IF EXISTS contact_enquiries_enquiry_type_check;

ALTER TABLE public.contact_enquiries
  ADD CONSTRAINT contact_enquiries_enquiry_type_check
  CHECK (enquiry_type IN (
    'General enquiry','Nomination help','Nominee acceptance','Evidence submission','Correction or update','Consent or privacy','NRRC or judging','Certificates','Online programme','Media or podcast','Volunteering','Local chapters','Partnership','Sponsorship','Donation','Merchandise','School support','Technical support',
    'Nomination assistance','Consent','Profile correction','NRRC support','Judges Arena support','Volunteer','Chapter','EduAid-Africa programme','Special-needs school support','Media','Privacy request','Safeguarding concern'
  ));