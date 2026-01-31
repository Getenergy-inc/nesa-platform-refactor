-- Add GFA_WZIP fund account for the 2% processing markup
INSERT INTO public.fund_accounts (key, display_name, description) VALUES
  ('GFA_WZIP', 'GFA Wzip Processing', '2% payment processing markup for GFA Wzip gateway services')
ON CONFLICT (key) DO NOTHING;

-- Add platform markup configuration
INSERT INTO public.platform_config (key, value, description) VALUES
  ('gfa_wzip_markup_percent', '0.02', 'GFA Wzip mandatory payment processing markup (2%)'),
  ('gfa_wzip_account_key', '"GFA_WZIP"', 'Fund account key for GFA Wzip markup deposits')
ON CONFLICT (key) DO NOTHING;

-- Update settlement split rules to clarify these are POST-markup allocations
UPDATE public.settlement_split_rules 
SET allocations = '[
  {"target": "FUND:NESA", "mode": "PERCENT", "value": 0.50, "note": "After 2% GFA Wzip markup"},
  {"target": "FUND:EDUAID", "mode": "PERCENT", "value": 0.10, "note": "After 2% GFA Wzip markup"},
  {"target": "FUND:SCEF", "mode": "PERCENT", "value": 0.20, "note": "After 2% GFA Wzip markup"},
  {"target": "FUND:LOCAL_CHAPTER", "mode": "PERCENT", "value": 0.07, "note": "After 2% GFA Wzip markup"},
  {"target": "FUND:REBUILD", "mode": "PERCENT", "value": 0.10, "note": "After 2% GFA Wzip markup"},
  {"target": "FUND:CVO", "mode": "PERCENT", "value": 0.03, "note": "After 2% GFA Wzip markup"}
]'::jsonb
WHERE scope = 'DAILY_MASTER_SPLIT';